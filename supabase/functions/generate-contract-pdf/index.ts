// Bank-grade RTL contract PDF generator — Master U Path
// Navy + Gold banking aesthetic. Renders standalone HTML for print/save-as-PDF.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLATFORM = {
  name: "Master U Path",
  nameAr: "ماستر يو المسار",
  legal: "منصة ماستر إيدو باث للخدمات الأكاديمية",
  domain: "masteredupath.com",
  jurisdiction: "المملكة العربية السعودية",
};

const NAVY = "#0a1f3d";
const GOLD = "#c9a961";
const CREAM = "#fdfbf5";

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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

// Convert markdown-ish content to HTML (basic: headings, bold, lists, hr).
function mdToHtml(md: string): string {
  if (!md) return "";
  const lines = md.split("\n");
  let html = "";
  let inList: "ol" | "ul" | null = null;
  const closeList = () => { if (inList) { html += `</${inList}>`; inList = null; } };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { closeList(); continue; }
    if (/^---+$/.test(line)) { closeList(); html += "<hr/>"; continue; }
    let m;
    if ((m = line.match(/^###\s+(.+)/))) { closeList(); html += `<h3>${esc(m[1])}</h3>`; continue; }
    if ((m = line.match(/^##\s+(.+)/))) { closeList(); html += `<h2>${esc(m[1])}</h2>`; continue; }
    if ((m = line.match(/^#\s+(.+)/))) { closeList(); html += `<h1>${esc(m[1])}</h1>`; continue; }
    if ((m = line.match(/^\d+\.\s+(.+)/))) {
      if (inList !== "ol") { closeList(); html += "<ol>"; inList = "ol"; }
      html += `<li>${inlineFmt(m[1])}</li>`; continue;
    }
    if ((m = line.match(/^[-*]\s+(.+)/))) {
      if (inList !== "ul") { closeList(); html += "<ul>"; inList = "ul"; }
      html += `<li>${inlineFmt(m[1])}</li>`; continue;
    }
    closeList();
    html += `<p>${inlineFmt(line)}</p>`;
  }
  closeList();
  return html;
}

function inlineFmt(s: string): string {
  return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function buildHtml(contract: any, signature: any, verifyHash: string) {
  const total = Number(contract.total_amount || 0);
  const currency = contract.currency || "SAR";
  const bodyHtml = mdToHtml(contract.content || "");

  const partyRow = (k: string, v: string) =>
    `<tr><td class="pk">${esc(k)}:</td><td class="pv">${esc(v)}</td></tr>`;

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>عقد ${esc(contract.contract_number)} — ${esc(PLATFORM.name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root { --navy:${NAVY}; --gold:${GOLD}; --cream:${CREAM}; }
  * { box-sizing:border-box; }
  html,body { margin:0; padding:0; background:#e9ecf1; color:var(--navy);
    font-family:'IBM Plex Sans Arabic',Tajawal,system-ui,sans-serif; line-height:1.85; }
  .page { width:210mm; min-height:297mm; margin:16px auto; background:var(--cream);
    padding:20mm 18mm; box-shadow:0 8px 40px rgba(10,31,61,.15); position:relative; }
  @media print {
    body { background:#fff; }
    .page { margin:0; box-shadow:none; width:auto; min-height:auto; padding:14mm 12mm; }
    .toolbar { display:none !important; }
    @page { size:A4; margin:0; }
  }
  .toolbar { position:fixed; top:14px; left:14px; z-index:50; display:flex; gap:8px; }
  .toolbar button { background:var(--navy); color:var(--gold); border:1px solid var(--gold);
    padding:10px 18px; border-radius:8px; font-family:inherit; font-weight:700; cursor:pointer;
    box-shadow:0 4px 14px rgba(10,31,61,.25); }
  .toolbar button.alt { background:#fff; color:var(--navy); border:1px solid var(--navy); }

  .confidential { background:var(--navy); color:var(--gold); text-align:center;
    font-weight:700; letter-spacing:.25em; padding:10px; border-radius:6px;
    margin-bottom:22px; font-size:13px; }

  header.brand { display:flex; justify-content:space-between; align-items:flex-start;
    gap:20px; margin-bottom:20px; flex-wrap:wrap; }
  .meta-card { background:#fff; border:1px solid ${GOLD}66; border-radius:8px;
    padding:12px 16px; flex:1; min-width:240px; }
  .meta-card table { width:100%; border-collapse:collapse; }
  .meta-card td { padding:3px 0; font-size:12.5px; }
  .meta-card td.k { color:${NAVY}99; padding-left:12px; }
  .meta-card td.v { color:var(--navy); font-weight:700; }
  .meta-card td.v.mono { font-family:ui-monospace,Menlo,monospace; }

  .brand-mark { text-align:left; }
  .brand-mark h1 { margin:0; font-size:20px; color:var(--navy); }
  .brand-mark .en { color:var(--gold); font-size:10.5px; letter-spacing:.25em;
    margin:4px 0 8px; font-weight:600; }
  .seal { display:inline-flex; align-items:center; justify-content:center;
    width:64px; height:64px; background:var(--navy); color:var(--gold);
    border-radius:12px; border:2px solid var(--gold); font-weight:700; font-size:16px; }

  .divider { border-top:2px solid var(--gold); margin:18px 0; }

  .title-block { background:var(--navy); color:#fff; border:2px solid var(--gold);
    border-radius:12px; padding:24px 22px; text-align:center; margin-bottom:24px; }
  .title-block h2 { margin:0 0 6px; font-size:22px; color:#fff; }
  .title-block .en { margin:0; color:var(--gold); font-size:11px; letter-spacing:.3em; font-weight:600; }

  .preamble { background:#fff; border:1px solid ${GOLD}55; border-right:4px solid var(--gold);
    border-radius:8px; padding:14px 18px; margin-bottom:24px; font-size:13.5px; }

  h3.section { color:var(--navy); font-size:15px; margin:22px 0 12px;
    padding-right:12px; border-right:4px solid var(--gold); font-weight:700; }
  h3.section::before { content:"◆ "; color:var(--gold); }

  .parties { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:24px; }
  .party { background:#fff; border:1px solid ${GOLD}66; border-radius:8px; padding:14px 16px; }
  .party .lbl { font-weight:700; color:var(--navy); font-size:13px; padding-bottom:8px;
    border-bottom:2px solid var(--gold); margin-bottom:10px; }
  .party table { width:100%; border-collapse:collapse; font-size:13px; }
  .party td.pk { color:${NAVY}99; padding:3px 12px 3px 0; width:32%; vertical-align:top; }
  .party td.pv { color:var(--navy); font-weight:600; padding:3px 0; }

  table.fin { width:100%; border-collapse:collapse; margin-bottom:24px;
    border:1px solid ${GOLD}55; border-radius:8px; overflow:hidden; font-size:13.5px; }
  table.fin th { background:var(--navy); color:var(--gold); padding:12px;
    text-align:right; font-weight:700; }
  table.fin td { padding:12px; border-bottom:1px solid ${GOLD}33; }
  table.fin tr.total td { background:var(--navy); color:var(--gold);
    font-weight:700; font-size:15px; border-bottom:0; }

  .body { font-size:13.5px; color:var(--navy); }
  .body h1, .body h2, .body h3 { color:var(--navy); border-right:4px solid var(--gold);
    padding-right:12px; margin:18px 0 8px; font-weight:700; }
  .body h1 { font-size:18px; } .body h2 { font-size:16px; } .body h3 { font-size:14px; }
  .body p { margin:6px 0; }
  .body strong { color:var(--navy); font-weight:700; }
  .body ol, .body ul { padding-right:22px; }
  .body li { margin:4px 0; }
  .body hr { border:0; border-top:1px solid ${GOLD}55; margin:18px 0; }

  .sig-divider { border-top:2px solid var(--gold); margin:28px 0 14px; }
  .sig-title { text-align:center; font-weight:700; font-size:18px; color:var(--navy); margin-bottom:18px; }

  .sigs { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .sigbox { background:#fff; border:1px solid ${GOLD}66; border-radius:10px;
    padding:18px; text-align:center; }
  .sigbox .lbl { font-weight:700; color:var(--navy); font-size:13px; }
  .sigbox .who { font-size:12px; color:var(--navy); margin:4px 0 14px; }

  .seal-circle { margin:0 auto 12px; width:120px; height:120px;
    border:3px double var(--navy); border-radius:50%; background:var(--cream);
    display:flex; align-items:center; justify-content:center; flex-direction:column; }
  .seal-circle .sn { font-size:10px; color:var(--navy); margin:0; }
  .seal-circle .sm { font-size:18px; color:var(--navy); font-weight:700; margin:2px 0; }
  .seal-circle .sd { font-size:9px; color:var(--gold); margin:0; }
  .stamp-ok { display:inline-block; padding:5px 12px; background:${GOLD}33;
    color:var(--navy); border:1px solid var(--gold); border-radius:6px;
    font-weight:700; font-size:12px; }

  .signed-card { background:var(--cream); border:1px dashed var(--gold);
    border-radius:8px; padding:14px; font-size:12px; color:var(--navy); }
  .signed-card .ok { font-weight:700; margin-bottom:6px; }
  .signed-card .sigtext { font-family:'Brush Script MT',cursive; font-size:24px;
    color:var(--navy); margin:6px 0; }
  .signed-card .meta { font-size:11px; color:${NAVY}99; line-height:1.7; }
  .pending { background:var(--cream); border:1px dashed ${NAVY}55; border-radius:8px;
    padding:24px; color:${NAVY}99; font-size:12px; }

  .verify { margin-top:18px; padding:12px 14px; background:${GOLD}11;
    border:1px solid ${GOLD}66; border-radius:8px; font-size:11px; color:var(--navy); }
  .verify code { display:block; word-break:break-all; font-family:ui-monospace,Menlo,monospace;
    font-size:10px; margin-top:4px; color:${NAVY}cc; }

  footer.doc { margin-top:24px; padding-top:14px; border-top:1px solid ${GOLD}55;
    display:flex; justify-content:space-between; align-items:center;
    font-size:10.5px; color:${NAVY}99; }
  footer.doc .num { font-family:ui-monospace,Menlo,monospace; font-weight:700;
    color:var(--navy); border:1px solid var(--gold); padding:4px 8px; border-radius:4px; }
  footer.doc .center { text-align:center; }
  footer.doc .center b { color:var(--navy); display:block; }
</style>
</head>
<body>
<div class="toolbar">
  <button onclick="window.print()">⬇️ حفظ كـ PDF</button>
  <button class="alt" onclick="window.close()">إغلاق</button>
</div>

<div class="page">
  <div class="confidential">◆ سري وخاص &nbsp;—&nbsp; CONFIDENTIAL ◆</div>

  <header class="brand">
    <div class="meta-card">
      <table>
        <tr><td class="k">رقم العقد:</td><td class="v mono">${esc(contract.contract_number)}</td></tr>
        <tr><td class="k">التاريخ:</td><td class="v">${fmtDate(contract.created_at)}</td></tr>
        <tr><td class="k">النوع:</td><td class="v">${esc(contract.service_type || "خدمة أكاديمية")}</td></tr>
        <tr><td class="k">الخدمة:</td><td class="v">${esc(contract.service_name || "—")}</td></tr>
      </table>
    </div>
    <div class="brand-mark">
      <h1>${esc(PLATFORM.nameAr)}</h1>
      <p class="en">MASTER U PATH — ACADEMIC SERVICES</p>
      <div class="seal">MUP</div>
    </div>
  </header>

  <div class="divider"></div>

  <div class="title-block">
    <h2>${esc(contract.title || "عقد تقديم خدمات أكاديمية")}</h2>
    <p class="en">ACADEMIC SERVICES AGREEMENT</p>
  </div>

  <div class="preamble">
    بتاريخ <strong>${fmtDate(contract.created_at)}</strong>، أُبرم هذا العقد بين الطرفين أدناه وفقاً للأحكام الواردة فيه،
    ويُقدَّم حصرياً عبر منصة <strong>${esc(PLATFORM.name)}</strong> (${esc(PLATFORM.domain)}) بإشراف ${esc(PLATFORM.legal)}.
  </div>

  <h3 class="section">المادة الأولى: أطراف العقد</h3>
  <div class="parties">
    <div class="party">
      <div class="lbl">الطرف الأول (مقدّم الخدمة)</div>
      <table>
        ${partyRow("الاسم", PLATFORM.legal)}
        ${partyRow("العلامة التجارية", PLATFORM.name)}
        ${partyRow("النطاق الرسمي", PLATFORM.domain)}
        ${partyRow("المقر", PLATFORM.jurisdiction)}
      </table>
    </div>
    <div class="party">
      <div class="lbl">الطرف الثاني (العميل)</div>
      <table>
        ${partyRow("الاسم", contract.client_full_name || "—")}
        ${partyRow("البريد", contract.client_email || "—")}
        ${partyRow("الجوال", contract.client_phone || "—")}
        ${partyRow("الهوية", contract.client_id_number || "—")}
      </table>
    </div>
  </div>

  <h3 class="section">المادة الثانية: قيمة الخدمة</h3>
  <table class="fin">
    <thead><tr><th>البند</th><th>التفاصيل</th></tr></thead>
    <tbody>
      <tr><td>اسم الخدمة</td><td><strong>${esc(contract.service_name || "—")}</strong></td></tr>
      ${contract.payment_terms ? `<tr><td>شروط الدفع</td><td>${esc(contract.payment_terms)}</td></tr>` : ""}
      ${contract.delivery_date ? `<tr><td>موعد التسليم</td><td>${fmtDate(contract.delivery_date)}</td></tr>` : ""}
      <tr class="total"><td>القيمة الإجمالية المتفق عليها</td><td>${fmtMoney(total, currency)}</td></tr>
    </tbody>
  </table>

  ${bodyHtml ? `<div class="body">${bodyHtml}</div>` : ""}

  <div class="sig-divider"></div>
  <div class="sig-title">◆ التوقيع والاعتماد ◆</div>

  <div class="sigs">
    <div class="sigbox">
      <div class="lbl">الطرف الأول</div>
      <div class="who">${esc(PLATFORM.legal)}</div>
      <div class="seal-circle">
        <p class="sn">${esc(PLATFORM.nameAr)}</p>
        <p class="sm">MUP</p>
        <p class="sd">${fmtDate(contract.created_at)}</p>
      </div>
      <div class="stamp-ok">✓ معتمد ومختوم رسمياً</div>
    </div>

    <div class="sigbox">
      <div class="lbl">الطرف الثاني</div>
      <div class="who">${esc(contract.client_full_name || "—")}</div>
      ${signature ? `
        <div class="signed-card">
          <div class="ok">✓ تم التوقيع إلكترونياً</div>
          <div class="sigtext">${esc(signature.signature_text)}</div>
          <div class="meta">
            التاريخ: ${fmtDateTime(signature.signed_at)}<br/>
            ${signature.ip_address ? `IP: ${esc(signature.ip_address)}<br/>` : ""}
            ${signature.signer_id_number ? `الهوية: ${esc(signature.signer_id_number)}` : ""}
          </div>
        </div>
      ` : `<div class="pending">— لم يتم التوقيع بعد —</div>`}
    </div>
  </div>

  ${signature ? `
    <div class="verify">
      <strong>🔐 بصمة التحقق الرقمي (SHA-256):</strong>
      <code>${esc(verifyHash)}</code>
    </div>
  ` : ""}

  <footer class="doc">
    <span class="num">${esc(contract.contract_number)}</span>
    <div class="center">
      <b>${esc(PLATFORM.legal)} | ${esc(PLATFORM.name)}</b>
      جميع الحقوق محفوظة © ${new Date().getFullYear()}
    </div>
    <span>${esc(PLATFORM.domain)}</span>
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

    try {
      await supabase.storage.from("contracts")
        .upload(path, new Blob([html], { type: "text/html; charset=utf-8" }), {
          contentType: "text/html; charset=utf-8", upsert: true,
        });
      await supabase.from("contracts").update({
        signed_pdf_path: path,
        signed_pdf_generated_at: new Date().toISOString(),
      }).eq("id", contract.id);

      const { data: urlData } = await supabase.storage
        .from("contracts").createSignedUrl(path, 60 * 60 * 24 * 7);
      signedUrl = urlData?.signedUrl;
    } catch (e) {
      console.warn("storage upload failed:", e);
    }

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
                  ? fmt(Number(contract.total_amount), contract.currency || "SAR") : undefined,
                pdfUrl: signedUrl,
              },
            },
          });
        }
      } catch (e) {
        console.warn("admin notification failed:", e);
      }
    }

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
      success: true, path, signed_url: signedUrl,
      contract_id: contract.id, html,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("generate-contract-pdf error:", e);
    return new Response(JSON.stringify({ success: false, error: e.message || String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
