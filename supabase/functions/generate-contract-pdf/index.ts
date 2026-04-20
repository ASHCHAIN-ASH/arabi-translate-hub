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
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Aref+Ruqaa:wght@400;700&family=Reem+Kufi+Fun:wght@400;700&display=swap" rel="stylesheet">
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
  .sig-title { text-align:center; font-weight:700; font-size:18px; color:var(--navy); margin-bottom:18px;
    letter-spacing:.15em; }
  .sig-title::before, .sig-title::after { content:"━━━"; color:var(--gold); margin:0 12px; font-weight:400; }

  .sigs { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .sigbox { position:relative; background:linear-gradient(180deg,#fff 0%,#fdfbf5 100%);
    border:1px solid ${GOLD}88; border-radius:12px; padding:20px 18px 22px; text-align:center;
    box-shadow:0 4px 16px rgba(10,31,61,.08); overflow:hidden; }
  .sigbox::before { content:""; position:absolute; top:0; right:0; left:0; height:4px;
    background:linear-gradient(90deg,${GOLD} 0%,${NAVY} 50%,${GOLD} 100%); }
  .sigbox::after { content:""; position:absolute; bottom:8px; right:8px; left:8px;
    height:1px; border-bottom:1px dashed ${GOLD}55; }
  .sigbox .badge-corner { position:absolute; top:10px; left:10px; background:var(--navy);
    color:var(--gold); padding:3px 8px; border-radius:4px; font-size:9px; font-weight:700;
    letter-spacing:.15em; }
  .sigbox .lbl { font-weight:700; color:var(--navy); font-size:13px; margin-top:6px; }
  .sigbox .who { font-size:13px; color:var(--navy); margin:6px 0 16px; font-weight:600; }

  /* Premium digital seal — official platform */
  .seal-circle { position:relative; margin:0 auto 14px; width:140px; height:140px;
    border-radius:50%; background:radial-gradient(circle,${CREAM} 60%,${GOLD}15 100%);
    display:flex; align-items:center; justify-content:center; flex-direction:column;
    box-shadow:inset 0 0 0 2px var(--navy), inset 0 0 0 4px ${CREAM},
      inset 0 0 0 6px var(--navy), 0 2px 12px rgba(10,31,61,.2); }
  .seal-circle::before { content:""; position:absolute; inset:10px; border-radius:50%;
    border:1px dashed ${NAVY}55; }
  .seal-circle .sn { font-size:9px; color:var(--navy); margin:0; letter-spacing:.1em;
    font-weight:600; text-transform:uppercase; }
  .seal-circle .sm { font-family:'Aref Ruqaa',serif; font-size:22px; color:var(--navy);
    font-weight:700; margin:4px 0; line-height:1; }
  .seal-circle .sd { font-size:8.5px; color:var(--gold); margin:2px 0 0; font-weight:700;
    letter-spacing:.1em; }
  .seal-circle .ring-text { position:absolute; inset:0; }

  .stamp-ok { display:inline-flex; align-items:center; gap:6px; padding:6px 14px;
    background:linear-gradient(135deg,${GOLD}33,${GOLD}15); color:var(--navy);
    border:1.5px solid var(--gold); border-radius:20px; font-weight:700; font-size:11.5px;
    letter-spacing:.05em; box-shadow:0 2px 6px ${GOLD}33; }
  .stamp-ok::before { content:"✓"; background:var(--navy); color:var(--gold);
    width:16px; height:16px; border-radius:50%; display:inline-flex;
    align-items:center; justify-content:center; font-size:10px; }

  /* Client e-signature card — bank receipt aesthetic */
  .signed-card { position:relative; background:linear-gradient(180deg,#fff,${CREAM});
    border:1.5px solid var(--gold); border-radius:10px; padding:14px 12px 12px;
    color:var(--navy); box-shadow:inset 0 0 0 1px ${GOLD}33; }
  .signed-card .verified { display:inline-flex; align-items:center; gap:5px;
    background:#16a34a; color:#fff; padding:3px 9px; border-radius:12px;
    font-size:10px; font-weight:700; margin-bottom:8px; letter-spacing:.05em; }
  .signed-card .verified::before { content:"✓"; font-weight:900; }
  .signed-card .sig-frame { background:#fff; border:1px solid ${GOLD}66;
    border-radius:6px; padding:10px 8px; margin:6px 0 10px; position:relative; }
  .signed-card .sig-frame::before { content:"التوقيع"; position:absolute; top:-7px; right:10px;
    background:#fff; padding:0 6px; font-size:9px; color:${NAVY}99; font-weight:600; }
  .signed-card .sigtext { font-family:'Aref Ruqaa','Brush Script MT',cursive;
    font-size:30px; color:var(--navy); line-height:1.2; font-weight:700;
    text-shadow:1px 1px 0 ${GOLD}22; }
  .signed-card .meta { font-size:10.5px; color:${NAVY}cc; line-height:1.9;
    text-align:right; padding:4px 6px; }
  .signed-card .meta .row { display:flex; justify-content:space-between; gap:8px;
    border-bottom:1px dotted ${GOLD}55; padding:2px 0; }
  .signed-card .meta .row:last-child { border:0; }
  .signed-card .meta .k { color:${NAVY}99; font-weight:600; }
  .signed-card .meta .v { color:var(--navy); font-weight:700;
    font-family:ui-monospace,Menlo,monospace; font-size:10px; }

  .pending { background:repeating-linear-gradient(45deg,${CREAM},${CREAM} 10px,#f6f1e3 10px,#f6f1e3 20px);
    border:1.5px dashed ${NAVY}66; border-radius:8px; padding:30px 14px;
    color:${NAVY}88; font-size:12px; font-weight:600; }
  .pending::before { content:"⏳ "; font-size:18px; }

  .verify { margin-top:18px; padding:14px 16px;
    background:linear-gradient(135deg,${GOLD}11,${NAVY}05);
    border:1px solid ${GOLD}66; border-radius:10px; font-size:11px; color:var(--navy); }
  .verify .vh { display:flex; align-items:center; gap:8px; font-weight:700;
    margin-bottom:6px; color:var(--navy); }
  .verify .vh .lock { background:var(--navy); color:var(--gold); width:22px; height:22px;
    border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:11px; }
  .verify code { display:block; word-break:break-all; font-family:ui-monospace,Menlo,monospace;
    font-size:10px; padding:8px 10px; background:#fff; border:1px dashed ${GOLD}55;
    border-radius:6px; color:var(--navy); margin-top:6px; letter-spacing:.02em; }
  .verify .note { margin-top:6px; font-size:10px; color:${NAVY}99; }

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
    إنه في يوم <strong>${fmtDate(contract.created_at)}</strong>، وانطلاقاً من رسالة <strong>${esc(PLATFORM.legal)}</strong>
    في دعم المسيرة الأكاديمية والبحثية وتقديم خدمات علمية تتوافق مع أعلى المعايير المهنية والأخلاقية المُعتمدة في الأوساط الجامعية،
    وبناءً على رغبة الطرف الثاني الصريحة في الإفادة من الخدمات الأكاديمية المُقدَّمة عبر منصة <strong>${esc(PLATFORM.name)}</strong>
    (${esc(PLATFORM.domain)})، فقد اتفق الطرفان — وهما بكامل أهليتهما المعتبرة شرعاً ونظاماً — على إبرام هذا العقد
    وفق البنود والأحكام المُبيَّنة أدناه، التي تُعدّ هذه الديباجة جزءاً لا يتجزأ منها ومُكمِّلةً لأحكامها.
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
      ${(contract.metadata as any)?.workDuration ? `<tr><td>مدة تنفيذ العمل</td><td><strong>${esc(String((contract.metadata as any).workDuration))}</strong></td></tr>` : ""}
      ${contract.delivery_date ? `<tr><td>موعد التسليم</td><td>${fmtDate(contract.delivery_date)}</td></tr>` : ""}
      <tr class="total"><td>القيمة الإجمالية المتفق عليها</td><td>${fmtMoney(total, currency)}</td></tr>
    </tbody>
  </table>

  ${bodyHtml ? `<div class="body">${bodyHtml}</div>` : ""}

  <div class="sig-divider"></div>
  <div class="sig-title">◆ التوقيع والاعتماد ◆</div>

  <div class="sigs">
    <div class="sigbox">
      <div class="badge-corner">OFFICIAL</div>
      <div class="lbl">الطرف الأول</div>
      <div class="who">${esc(PLATFORM.legal)}</div>
      <div class="seal-circle">
        <p class="sn">${esc(PLATFORM.nameAr)}</p>
        <p class="sm">MUP</p>
        <p class="sd">${fmtDate(contract.created_at)}</p>
      </div>
      <div class="stamp-ok">معتمد ومختوم رسمياً</div>
    </div>

    <div class="sigbox">
      <div class="badge-corner">E-SIGNED</div>
      <div class="lbl">الطرف الثاني</div>
      <div class="who">${esc(contract.client_full_name || "—")}</div>
      ${signature ? `
        <div class="signed-card">
          <div class="verified">موقّع إلكترونياً ومُوثّق</div>
          ${signature.signature_image ? `
            <div class="sig-frame">
              <img src="${esc(signature.signature_image)}" alt="التوقيع المرسوم"
                   style="max-width:100%;max-height:90px;display:block;margin:0 auto;" />
            </div>
          ` : `
            <div class="sig-frame">
              <div class="sigtext">${esc(signature.signature_text)}</div>
            </div>
          `}
          <div class="meta">
            <div class="row"><span class="k">التاريخ والوقت</span><span class="v">${fmtDateTime(signature.signed_at)}</span></div>
            ${signature.ip_address ? `<div class="row"><span class="k">عنوان IP</span><span class="v">${esc(signature.ip_address)}</span></div>` : ""}
            ${signature.signer_id_number ? `<div class="row"><span class="k">رقم الهوية</span><span class="v">${esc(signature.signer_id_number)}</span></div>` : ""}
            <div class="row"><span class="k">معرّف التوقيع</span><span class="v">${esc(String(signature.id || "").slice(0,8))}</span></div>
          </div>
        </div>
      ` : `<div class="pending">لم يتم التوقيع بعد</div>`}
    </div>
  </div>

  ${signature ? `
    <div class="verify">
      <div class="vh"><span class="lock">🔒</span> بصمة التحقق الرقمي (SHA-256)</div>
      <code>${esc(verifyHash)}</code>
      <div class="note">هذه البصمة تُستخدم للتحقق من سلامة العقد وعدم التلاعب به. أي تعديل سيؤدي إلى تغيير البصمة.</div>
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

function isCompleteContractContent(content?: string | null) {
  const value = String(content || "").trim();
  return value.length >= 400 && /##|المادة|\|/.test(value);
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

    const overrideContent = typeof body.override_content === "string" ? body.override_content.trim() : "";
    const overrideClientName = typeof body.override_client_full_name === "string" ? body.override_client_full_name.trim() : "";
    const overrideClientEmail = typeof body.override_client_email === "string" ? body.override_client_email.trim() : "";

    if (overrideClientName) contract.client_full_name = overrideClientName;
    if (overrideClientEmail) contract.client_email = overrideClientEmail;
    if (isCompleteContractContent(overrideContent)) {
      contract.content = overrideContent;
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
