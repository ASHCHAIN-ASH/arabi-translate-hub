// Fekrah PayLater — Financing email lifecycle notifier (parallel to WhatsApp)
// Triggered by DB trigger after status changes; invokes send-transactional-email.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function fmt(n: number | string | null | undefined): string {
  const v = Number(n || 0);
  return v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function refOf(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { application_id, event, extra = {} } = await req.json();
    if (!application_id || !event) {
      return json(400, { success: false, error: "application_id and event are required" });
    }

    const { data: app, error } = await supabase
      .from("financing_applications")
      .select("id, applicant_full_name, applicant_email, total_amount, down_payment, remaining_amount, monthly_installment, duration_months, rejection_reason, contract_id, contract_pdf_url")
      .eq("id", application_id)
      .maybeSingle();

    if (error || !app) {
      return json(404, { success: false, error: "application not found" });
    }
    if (!app.applicant_email) {
      return json(200, { success: false, skipped: true, reason: "no email on file" });
    }

    // Try fetching contract PDF for signature step
    let contractPdfUrl: string | null = (app as any).contract_pdf_url || null;
    if (event === "contract_pending_signature" && !contractPdfUrl && (app as any).contract_id) {
      const { data: contractRow } = await supabase
        .from("contracts")
        .select("signed_pdf_path")
        .eq("id", (app as any).contract_id)
        .maybeSingle();
      if (contractRow?.signed_pdf_path) {
        const { data: signed } = await supabase.storage
          .from("contracts")
          .createSignedUrl(contractRow.signed_pdf_path, 60 * 60 * 24 * 7);
        contractPdfUrl = signed?.signedUrl || null;
      }
    }

    const templateData: Record<string, any> = {
      event,
      applicantName: app.applicant_full_name,
      ref: refOf(app.id),
      totalAmount: fmt(app.total_amount),
      downPayment: fmt(app.down_payment),
      monthlyInstallment: fmt(app.monthly_installment),
      durationMonths: app.duration_months,
      remainingAmount: fmt(app.remaining_amount),
      rejectionReason: app.rejection_reason || extra.rejection_reason,
      contractPdfUrl: contractPdfUrl || undefined,
      installmentNumber: extra.installment_number,
      installmentAmount: extra.installment_amount ? fmt(extra.installment_amount) : undefined,
      installmentDueDate: extra.installment_due_date,
      daysOverdue: extra.days_overdue,
      receiptAmount: extra.receipt_amount ? fmt(extra.receipt_amount) : undefined,
    };

    const idempotencyKey = `financing-${event}-${application_id}-${extra.installment_id || extra.receipt_id || Date.now()}`;

    const { data: result, error: invokeErr } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "financing-status-update",
        recipientEmail: app.applicant_email,
        idempotencyKey,
        templateData,
      },
    });

    if (invokeErr) {
      return json(500, { success: false, error: invokeErr.message });
    }

    return json(200, { success: true, result });
  } catch (e) {
    console.error("financing-email-notify error:", e);
    return json(500, { success: false, error: e instanceof Error ? e.message : "Unknown error" });
  }
});
