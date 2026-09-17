// Unified invoice email dispatcher for FekrahEdu.
// All invoice-related email now flows through `send-transactional-email`
// (pgmq queue + email_send_log + retries + suppression), so every message
// is traceable from the admin dashboards.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { getUserPhone, notifyWhatsApp } from "../_shared/whatsapp-notify.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://fekrahedu.com";

type InvoiceEvent = "issued" | "payment_received" | "paid" | "overdue";

const TEMPLATE_BY_EVENT: Record<InvoiceEvent, string> = {
  issued: "invoice-issued",
  payment_received: "invoice-payment-received",
  paid: "invoice-paid",
  overdue: "invoice-overdue",
};

interface Body {
  invoice_id?: string;
  event?: InvoiceEvent;
  to?: string;
  cc?: string[];
  subject?: string;
  custom_message?: string;
  // payment_received extras
  amount_paid?: number;
  payment_method?: string;
  payment_date?: string;
  reference_number?: string | null;
}

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const body = (await req.json().catch(() => ({}))) as Body;
    if (!body.invoice_id) return json({ error: "invoice_id required" }, 400);

    const event: InvoiceEvent = body.event ?? "issued";
    const templateName = TEMPLATE_BY_EVENT[event];
    if (!templateName) return json({ error: `unknown event: ${event}` }, 400);

    const { data: invoice, error: invErr } = await admin
      .from("invoices")
      .select("*")
      .eq("id", body.invoice_id)
      .maybeSingle();

    if (invErr) throw invErr;
    if (!invoice) return json({ error: "الفاتورة غير موجودة" }, 404);

    const recipient = (body.to || invoice.customer_email || "").trim();
    if (!recipient) return json({ error: "لا يوجد بريد إلكتروني للعميل" }, 400);

    const { data: items } = await admin
      .from("invoice_items")
      .select("item_name, quantity, unit_price, total_price")
      .eq("invoice_id", invoice.id);

    const invoiceUrl = `${SITE_URL}/invoices/${invoice.id}/pay`;
    const currency = invoice.currency || "SAR";
    const remaining = Number(
      invoice.remaining_amount ??
        Math.max(Number(invoice.total_amount || 0) - Number(invoice.paid_amount || 0), 0),
    );

    let daysOverdue = 0;
    if (invoice.due_date) {
      const diff = Date.now() - new Date(invoice.due_date).getTime();
      daysOverdue = Math.max(Math.floor(diff / 86_400_000), 0);
    }

    const base = {
      customerName: invoice.customer_name ?? "",
      invoiceNumber: invoice.invoice_number,
      currency,
      invoiceUrl,
    };

    const templateData: Record<string, unknown> =
      event === "issued"
        ? {
            ...base,
            issueDate: invoice.issue_date,
            dueDate: invoice.due_date,
            subtotal: invoice.subtotal,
            taxAmount: invoice.tax_amount,
            discountAmount: invoice.discount_amount,
            totalAmount: invoice.total_amount,
            remainingAmount: remaining,
            items: items ?? [],
            customMessage: body.custom_message || undefined,
          }
        : event === "payment_received"
        ? {
            ...base,
            amountPaid: body.amount_paid ?? invoice.paid_amount,
            remainingAmount: remaining,
            totalAmount: invoice.total_amount,
            paymentMethod: body.payment_method,
            paymentDate: body.payment_date ?? new Date().toISOString().slice(0, 10),
            referenceNumber: body.reference_number ?? undefined,
          }
        : event === "paid"
        ? {
            ...base,
            totalAmount: invoice.total_amount,
            paidAt: (invoice.paid_at ?? new Date().toISOString()).slice(0, 10),
          }
        : {
            ...base,
            remainingAmount: remaining,
            dueDate: invoice.due_date,
            daysOverdue,
          };

    const idempotencyKey =
      event === "issued" || event === "overdue"
        ? `invoice-${event}-${invoice.id}-${new Date().toISOString().slice(0, 10)}`
        : `invoice-${event}-${invoice.id}-${body.reference_number ?? body.amount_paid ?? remaining}`;

    const { data: result, error: sendErr } = await admin.functions.invoke(
      "send-transactional-email",
      {
        body: {
          templateName,
          recipientEmail: recipient,
          idempotencyKey,
          subjectOverride: body.subject?.trim() || undefined,
          cc: body.cc ?? [],
          templateData,
          metadata: {
            source: "invoice",
            event,
            invoice_id: invoice.id,
            invoice_number: invoice.invoice_number,
            customer_id: invoice.customer_id,
            user_id: invoice.user_id,
            customer_name: invoice.customer_name,
            amount: invoice.total_amount,
          },
        },
      },
    );

    if (sendErr) throw sendErr;

    // Record the send on the invoice timeline so admins see it inline.
    await admin.from("invoice_timeline").insert({
      invoice_id: invoice.id,
      action_type: "email_sent",
      action_label: "إرسال بريد إلكتروني",
      action_description: `تم إرسال بريد (${event}) إلى ${recipient}`,
      metadata: { event, recipient, template: templateName },
    }).then(() => {}, () => {});

    if (event === "issued") {
      await admin
        .from("invoices")
        .update({ sent_at: new Date().toISOString() })
        .eq("id", invoice.id)
        .then(() => {}, () => {});
    }

    // إشعار واتساب مرافق للفاتورة (لا يعطّل البريد عند الفشل)
    try {
      const waEvent =
        event === "issued" ? "invoice_new" : event === "overdue" ? "invoice_reminder" : "invoice_paid";
      const phone = invoice.customer_phone || (invoice.user_id ? await getUserPhone(admin, invoice.user_id) : null);
      if (phone) {
        await notifyWhatsApp(admin, {
          to: phone,
          event_key: waEvent,
          variables: {
            name: invoice.customer_name ?? "عميلنا العزيز",
            customer_name: invoice.customer_name ?? "عميلنا العزيز",
            invoice_no: invoice.invoice_number,
            invoice_number: invoice.invoice_number,
            amount: Number(invoice.total_amount || 0).toLocaleString("ar-SA"),
            total: Number(invoice.total_amount || 0).toLocaleString("ar-SA"),
            remaining: Number(remaining).toLocaleString("ar-SA"),
            due_date: invoice.due_date ?? "",
            date: new Date().toISOString().slice(0, 10),
            currency,
            link: invoiceUrl,
          },
          user_id: invoice.user_id ?? null,
          related_entity_type: "invoice",
          related_entity_id: invoice.id,
        });
      }
    } catch (waError) {
      console.warn("invoice whatsapp skipped", waError);
    }

    return json({ ok: true, queued: true, template: templateName, recipient, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "تعذر إرسال البريد";
    console.error("send-invoice-email failed", message);
    return json({ error: message }, 500);
  }
});
