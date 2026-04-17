// Generates a modern, RTL Arabic, print-ready contract document.
// Output is a styled standalone HTML file (page-sized A4) stored in the
// "contracts" bucket. Browsers render it perfectly in Arabic and the user
// can "Save as PDF" from the print dialog. Avoids jsPDF Arabic shaping issues.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PARENT_COMPANY = "شركة علي صالح الشهري القابضة";
const BRAND = "منصة ماستر إيدو باث";

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fmtMoney = (n: number, c = "SAR") =>
  new Intl.NumberFormat("ar-SA", { style: "currency", currency: c, maximumFractionDigits: 2 }).format(n || 0);

const fmtDate = (d?: string | null) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }); }
  catch { return String(d); }
};

const fmtDateTime = (d?: string | null) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleString("ar-SA", { dateStyle: "long", timeStyle: "short" }); }
  catch { return String(d); }
};

function buildHtml(contract: any, signature: any, verifyHash: string) {
  const total = Number(contract.total_amount || 0);
  const currency = contract.currency || "SAR";

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>عقد رقم ${esc(contract.contract_number)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --ink:#0f172a; --muted:#64748b; --line:#e2e8f0; --accent:#0f766e;
    --soft:#f8fafc; --brand:#0f172a;
  }
  * { box-sizing:border-box; }
  html,body { margin:0; padding:0; background:#eef2f7; color:var(--ink);
    font-family:'IBM Plex Sans Arabic',Tajawal,system-ui,sans-serif; line-height:1.85; }
  .page {
    width:210mm; min-height:297mm; margin:16px auto; background:#fff;
    padding:18mm 16mm; box-shadow:0 6px 30px rgba(15,23,42,.08); position:relative;
  }
  @media print {
    body { background:#fff; }
    .page { margin:0; box-shadow:none; width:auto; min-height:auto; padding:14mm 12mm; }
    .toolbar { display:none !important; }
    @page { size:A4; margin:0; }
  }
  .toolbar {
    position:fixed; top:12px; left:12px; z-index:50; display:flex; gap:8px;
  }
  .toolbar button {
    background:var(--brand); color:#fff; border:0; padding:10px 16px; border-radius:10px;
    font-family:inherit; font-weight:600; cursor:pointer; box-shadow:0 4px 14px rgba(15,23,42,.2);
  }
  .toolbar button.alt { background:#fff; color:var(--brand); border:1px solid var(--line); }

  header.brand {
    display:flex; justify-content:space-between; align-items:flex-start;
    border-bottom:3px solid var(--brand); padding-bottom:14px; margin-bottom:22px;
  }
  .brand h1 { margin:0; font-size:22px; color:var(--brand); letter-spacing:-0.3px; }
  .brand .sub { font-size:12px; color:var(--muted); margin-top:4px; }
  .brand .meta { text-align:left; font-size:12px; color:var(--muted); }
  .brand .meta strong { color:var(--ink); display:block; font-size:13px; margin-bottom:2px; }

  .title-block {
    background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%); color:#fff;
    border-radius:14px; padding:20px 22px; margin-bottom:22px;
  }
  .title-block h2 { margin:0 0 6px; font-size:20px; }
  .title-block .row { display:flex; gap:16px; flex-wrap:wrap; font-size:13px; opacity:.95; }
  .title-block .row span { background:rgba(255,255,255,.12); padding:4px 10px; border-radius:6px; }

  table.kv {
    width:100%; border-collapse:collapse; margin:14px 0 22px;
    font-size:13px; border:1px solid var(--line); border-radius:10px; overflow:hidden;
  }
  table.kv th, table.kv td {
    padding:10px 14px; text-align:right; border-bottom:1px solid var(--line); vertical-align:top;
  }
  table.kv tr:last-child th, table.kv tr:last-child td { border-bottom:0; }
  table.kv th {
    width:32%; background:var(--soft); color:var(--muted); font-weight:600;
  }
  table.kv td { font-weight:600; color:var(--ink); }

  h3.section {
    color:var(--brand); font-size:15px; margin:22px 0 8px;
    padding-right:12px; border-right:4px solid var(--accent);
  }
  p, li { font-size:13.5px; color:#1e293b; }
  ol, ul { padding-right:22px; }
  ol li, ul li { margin:4px 0; }

  .price-table {
    width:100%; border-collapse:collapse; margin:10px 0 22px;
    font-size:13px; border:1px solid var(--line); border-radius:10px; overflow:hidden;
  }
  .price-table th { background:var(--brand); color:#fff; padding:12px; text-align:right; font-weight:600; }
  .price-table td { padding:12px; border-bottom:1px solid var(--line); }
  .price-table tr.total td {
    background:var(--soft); font-weight:700; font-size:14px; color:var(--brand); border-top:2px solid var(--accent);
  }

  .signatures {
    margin-top:24px; display:grid; grid-template-columns:1fr 1fr; gap:16px;
  }
  .sigbox {
    border:1px dashed var(--line); border-radius:12px; padding:16px; background:var(--soft);
  }
  .sigbox .label { font-size:11px; color:var(--muted); margin-bottom:6px; }
  .sigbox .name { font-weight:700; color:var(--brand); margin-bottom:8px; }
  .sigbox .signed {
    font-family:'Brush Script MT',cursive; font-size:24px; color:var(--accent); margin:6px 0;
  }
  .sigbox .meta { font-size:11px; color:var(--muted); line-height:1.6; }

  .verify {
    margin-top:18px; padding:12px 14px; background:#ecfdf5; border:1px solid #a7f3d0;
    border-radius:10px; font-size:11px; color:#065f46;
  }
  .verify strong { color:#064e3b; }
  .verify code {
    display:block; word-break:break-all; font-family:ui-monospace,Menlo,monospace;
    font-size:10px; margin-top:4px; color:#047857;
  }

  footer.doc {
    margin-top:30px; padding-top:14px; border-top:1px solid var(--line);
    text-align:center; font-size:11px; color:var(--muted);
  }
  .badge-status {
    display:inline-block; padding:4px 10px; border-radius:999px;
    font-size:11px; font-weight:600;
  }
  .badge-status.signed { background:#d1fae5; color:#065f46; }
  .badge-status.pending { background:#fef3c7; color:#92400e; }
</style>
</head>
<body>
<div class="toolbar">
  <button onclick="window.print()">⬇️ حفظ كـ PDF</button>
  <button class="alt" onclick="window.close()">إغلاق</button>
</div>

<div class="page">
  <header class="brand">
    <div>
      <h1>${esc(BRAND)}</h1>
      <div class="sub">تابعة لـ ${esc(PARENT_COMPANY)} • المملكة العربية السعودية</div>
    </div>
    <div class="meta">
      <strong>عقد رقم</strong>
      <div style="font-family:ui-monospace,Menlo,monospace;color:var(--brand);font-size:14px;">${esc(contract.contract_number)}</div>
      <div style="margin-top:6px;">
        <span class="badge-status ${signature ? "signed" : "pending"}">
          ${signature ? "موقّع إلكترونياً ✓" : "بانتظار التوقيع"}
        </span>
      </div>
    </div>
  </header>

  <div class="title-block">
    <h2>${esc(contract.title || "عقد تقديم خدمة")}</h2>
    <div class="row">
      <span>📅 تاريخ التحرير: ${fmtDate(contract.created_at)}</span>
      ${contract.delivery_date ? `<span>🗓 موعد التسليم: ${fmtDate(contract.delivery_date)}</span>` : ""}
      <span>💰 ${fmtMoney(total, currency)}</span>
    </div>
  </div>

  <h3 class="section">١. أطراف العقد</h3>
  <table class="kv">
    <tr><th>الطرف الأول (مُقدِّم الخدمة)</th><td>${esc(BRAND)} — التابعة لـ ${esc(PARENT_COMPANY)}</td></tr>
    <tr><th>الجهة القانونية</th><td>${esc(PARENT_COMPANY)} — المملكة العربية السعودية</td></tr>
    <tr><th>الطرف الثاني (العميل)</th><td>${esc(contract.client_full_name || "—")}</td></tr>
    ${contract.client_id_number ? `<tr><th>رقم الهوية / الإقامة</th><td>${esc(contract.client_id_number)}</td></tr>` : ""}
    ${contract.client_email ? `<tr><th>البريد الإلكتروني</th><td>${esc(contract.client_email)}</td></tr>` : ""}
    ${contract.client_phone ? `<tr><th>رقم الجوال</th><td>${esc(contract.client_phone)}</td></tr>` : ""}
  </table>

  <h3 class="section">٢. تفاصيل الخدمة والمقابل المالي</h3>
  <table class="price-table">
    <thead>
      <tr>
        <th style="width:55%">البيان</th>
        <th>التفاصيل</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>اسم الخدمة</td><td><strong>${esc(contract.service_name || "خدمة أكاديمية")}</strong></td></tr>
      ${contract.payment_terms ? `<tr><td>شروط الدفع</td><td>${esc(contract.payment_terms)}</td></tr>` : ""}
      ${contract.delivery_date ? `<tr><td>الموعد التقديري للتسليم</td><td>${fmtDate(contract.delivery_date)}</td></tr>` : ""}
      <tr class="total"><td>القيمة الإجمالية المتفق عليها</td><td>${fmtMoney(total, currency)}</td></tr>
    </tbody>
  </table>

  <h3 class="section">٣. التزامات الطرف الأول (المنصة)</h3>
  <ol>
    <li>تنفيذ الخدمة بأعلى معايير الجودة المهنية والأكاديمية المتعارف عليها.</li>
    <li>الالتزام بالمواعيد المتفق عليها وإبلاغ العميل بأي ظرف قاهر يستوجب التأجيل.</li>
    <li>تخصيص متخصص أو فريق مؤهل في مجال الخدمة المطلوبة.</li>
    <li>تقديم تعديل واحد رئيسي مجاناً بعد التسليم خلال (7) أيام، وفق ضوابط النطاق المتفق عليه.</li>
    <li>الحفاظ التام على سرية بيانات العميل ووثائقه ومحتوى الخدمة.</li>
  </ol>

  <h3 class="section">٤. التزامات الطرف الثاني (العميل)</h3>
  <ol>
    <li>تزويد المنصة بكافة البيانات والمستندات الصحيحة والكاملة اللازمة لتنفيذ الخدمة.</li>
    <li>سداد القيمة المتفق عليها وفق شروط الدفع المنصوص عليها.</li>
    <li>الردّ على استفسارات الفريق المُنفّذ في وقت معقول لضمان الالتزام بالموعد.</li>
    <li>عدم استخدام مخرجات الخدمة بما يُخالف الأنظمة أو الأخلاقيات الأكاديمية المعتمدة.</li>
  </ol>

  <h3 class="section">٥. السرية وحماية المعلومات</h3>
  <ol>
    <li>تتعهّد المنصة بعدم إفشاء أو نشر أو مشاركة أي معلومات أو وثائق خاصة بالعميل لأي طرف ثالث، ما لم يكن ذلك بإذن كتابي من العميل أو بموجب نظام نافذ.</li>
    <li>يُعدّ هذا الالتزام مستمراً حتى بعد انتهاء العقد لمدة لا تقل عن خمس (5) سنوات.</li>
    <li>تخضع جميع البيانات الشخصية لنظام حماية البيانات الشخصية المعمول به في المملكة العربية السعودية.</li>
  </ol>

  <h3 class="section">٦. النزاهة الأكاديمية والملكية الفكرية</h3>
  <ol>
    <li>تُؤكّد المنصة أن جميع المخرجات أصلية، ويتم فحصها ضد الانتحال (Plagiarism) قبل التسليم.</li>
    <li>تُقدَّم الخدمة لأغراض الاستشارة الأكاديمية، ويتحمّل العميل مسؤولية الالتزام بأنظمة جهته الأكاديمية في الاستخدام النهائي.</li>
    <li>تنتقل حقوق استخدام المخرجات إلى العميل بعد سداد كامل المستحقات.</li>
  </ol>

  <h3 class="section">٧. الإلغاء والاسترداد</h3>
  <ol>
    <li>للعميل الحق في إلغاء العقد قبل بدء التنفيذ مع استرداد كامل المبلغ المسدّد بعد خصم رسوم إدارية لا تتجاوز (10%).</li>
    <li>في حال طلب الإلغاء بعد بدء التنفيذ، يُحسب المستحق بناءً على نسبة الإنجاز الفعلي، ويُسترد الفرق إن وُجد.</li>
    <li>لا يحقّ الاسترداد بعد تسليم الخدمة كاملةً واعتمادها من العميل.</li>
  </ol>

  <h3 class="section">٨. القانون الواجب التطبيق وتسوية النزاعات</h3>
  <ol>
    <li>يخضع هذا العقد ويُفسَّر وفق أنظمة المملكة العربية السعودية ذات العلاقة.</li>
    <li>يسعى الطرفان لتسوية أي نزاع ودياً خلال (15) يوماً من نشوئه.</li>
    <li>في حال تعذُّر التسوية الودية، يُحال النزاع إلى مركز التحكيم التجاري السعودي بمدينة الرياض وفق نظامه المعتمد.</li>
  </ol>

  <h3 class="section">٩. أحكام عامة</h3>
  <ol>
    <li>حُرِّر هذا العقد إلكترونياً، ويُعدّ التوقيع الإلكتروني المُسجَّل في النظام (مع توثيق وقت التوقيع وعنوان IP) قائماً مقام التوقيع اليدوي وله ذات الحجّية القانونية وفق نظام التعاملات الإلكترونية في المملكة العربية السعودية.</li>
    <li>أي تعديل أو إضافة على هذا العقد لا يُعتدّ به إلا إذا كان مكتوباً وموقَّعاً من الطرفين.</li>
    <li>يُعدّ هذا العقد ساري المفعول من تاريخ التوقيع، وتسلَّم نسخة إلكترونية للعميل عبر حسابه في المنصة.</li>
  </ol>

  <h3 class="section">١٠. التوقيعات</h3>
  <div class="signatures">
    <div class="sigbox">
      <div class="label">الطرف الأول (المنصة)</div>
      <div class="name">${esc(BRAND)}</div>
      <div class="signed">موقّع إلكترونياً</div>
      <div class="meta">${esc(PARENT_COMPANY)}<br/>تاريخ الإصدار: ${fmtDateTime(contract.created_at)}</div>
    </div>
    <div class="sigbox">
      <div class="label">الطرف الثاني (العميل)</div>
      <div class="name">${esc(contract.client_full_name || "—")}</div>
      ${signature ? `
        <div class="signed">${esc(signature.signature_text)}</div>
        <div class="meta">
          ✓ موقّع إلكترونياً<br/>
          التاريخ: ${fmtDateTime(signature.signed_at)}<br/>
          ${signature.ip_address ? `IP: ${esc(signature.ip_address)}<br/>` : ""}
          ${signature.signer_id_number ? `الهوية: ${esc(signature.signer_id_number)}` : ""}
        </div>
      ` : `<div class="meta" style="padding:18px 0;text-align:center;color:var(--muted);">— لم يتم التوقيع بعد —</div>`}
    </div>
  </div>

  ${signature ? `
    <div class="verify">
      <strong>🔐 بصمة التحقق الرقمي (SHA-256):</strong>
      <code>${esc(verifyHash)}</code>
      هذه البصمة تُستخدم للتحقق من سلامة العقد وعدم التلاعب به.
    </div>
  ` : ""}

  <footer class="doc">
    ${esc(BRAND)} • ${esc(PARENT_COMPANY)} • وثيقة مُولّدة إلكترونياً<br/>
    masteredupath.com
  </footer>
</div>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    let contractId: string | undefined;
    let body: any = {};
    if (req.method === "GET") {
      contractId = url.searchParams.get("contract_id") || url.searchParams.get("contractId") || undefined;
    } else {
      body = await req.json().catch(() => ({}));
      contractId = body.contract_id || body.contractId || url.searchParams.get("contract_id") || undefined;
    }
    if (!contractId) {
      return new Response(JSON.stringify({ error: "contract_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: contract, error: cErr } = await supabase
      .from("contracts").select("*").eq("id", contractId).single();
    if (cErr || !contract) throw new Error(cErr?.message || "Contract not found");

    const { data: signature } = await supabase
      .from("contract_signatures").select("*")
      .eq("contract_id", contractId)
      .order("signed_at", { ascending: false })
      .limit(1).maybeSingle();

    let hash = "";
    if (signature) {
      const src = `${contract.id}|${signature.signed_at}|${signature.ip_address || ""}|${signature.signature_text}`;
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(src));
      hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    }

    const html = buildHtml(contract, signature, hash);
    const userId = contract.user_id || "system";
    const path = `${userId}/${contract.id}.html`;

    let signedUrl: string | undefined;

    // Save a copy in storage (best-effort, don't fail the request)
    try {
      await supabase.storage
        .from("contracts")
        .upload(path, new Blob([html], { type: "text/html; charset=utf-8" }), {
          contentType: "text/html; charset=utf-8",
          upsert: true,
        });
      await supabase.from("contracts").update({
        signed_pdf_path: path,
        signed_pdf_generated_at: new Date().toISOString(),
      }).eq("id", contract.id);

      const { data: urlData } = await supabase.storage
        .from("contracts")
        .createSignedUrl(path, 60 * 60 * 24 * 7);
      signedUrl = urlData?.signedUrl;
    } catch (e) {
      console.warn("storage upload failed:", e);
    }

    // Notify admins automatically when contract is signed (best-effort)
    if (signature) {
      try {
        const { data: adminRoles } = await supabase
          .from("user_roles").select("user_id").eq("role", "admin");
        const adminEmails = new Set<string>();
        for (const r of (adminRoles || [])) {
          const { data: u } = await supabase.auth.admin.getUserById(r.user_id);
          if (u?.user?.email) adminEmails.add(u.user.email);
        }

        const fmt = (n: number, c = "SAR") =>
          new Intl.NumberFormat("ar-SA", { style: "currency", currency: c }).format(n || 0);

        for (const email of adminEmails) {
          await supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "contract-signed-admin",
              recipientEmail: email,
              idempotencyKey: `contract-signed-admin-${contract.id}-${email}`,
              templateData: {
                clientName: signature.signer_name,
                clientEmail: signature.signer_email || contract.client_email,
                contractNumber: contract.contract_number,
                contractTitle: contract.title,
                signedAt: new Date(signature.signed_at).toLocaleString("ar-SA"),
                ipAddress: signature.ip_address,
                totalAmount: contract.total_amount
                  ? fmt(Number(contract.total_amount), contract.currency || "SAR")
                  : undefined,
                pdfUrl: signedUrl,
              },
            },
          });
        }
      } catch (e) {
        console.warn("admin notification failed:", e);
      }
    }

    // If client requests raw HTML, return it directly so the browser renders
    // the styled document immediately and triggers print/save-as-PDF.
    const wantsHtml =
      url.searchParams.get("format") === "html" ||
      body.format === "html" ||
      (req.headers.get("accept") || "").includes("text/html");

    if (wantsHtml) {
      return new Response(html, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `inline; filename="contract-${contract.contract_number || contract.id}.html"`,
          "Cache-Control": "no-store",
        },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      path,
      signed_url: signedUrl,
      contract_id: contract.id,
      html,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("generate-contract-pdf error:", e);
    return new Response(JSON.stringify({ success: false, error: e.message || String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
