// Master U Path — Contract PDF generator (Phase 2)
// Real PDF via Browserless. Versioned, immutable storage. Evidence snapshot.
// Body: { contract_id, mode?: 'preview'|'signed_final', force?: boolean }
//   - 'signed_final' is idempotent: returns existing version if already generated
//   - 'preview' is overwritable (single overwritable preview.pdf per contract)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLATFORM = {
  name: "MasterEduPath",
  nameAr: "ماستر إيدو باث",
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

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

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

function isCompleteContractContent(content?: string | null) {
  const value = String(content || "").trim();
  return value.length >= 400 && /##|المادة|\|/.test(value);
}

function buildHtml(contract: any, signature: any, verifyHash: string, opts: {
  forPdf: boolean;
  versionLabel?: string;
  verifyUrl?: string;
}) {
  const total = Number(contract.total_amount || 0);
  const currency = contract.currency || "SAR";
  const bodyHtml = mdToHtml(contract.content || "");

  const partyRow = (k: string, v: string) =>
    `<tr><td class="pk">${esc(k)}:</td><td class="pv">${esc(v)}</td></tr>`;

  // QR code via public chart API (renders inside browserless before PDF)
  const qrUrl = opts.verifyUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=4&data=${encodeURIComponent(opts.verifyUrl)}`
    : "";

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
  html,body { margin:0; padding:0; background:${opts.forPdf ? '#fff' : '#e9ecf1'}; color:var(--navy);
    font-family:'IBM Plex Sans Arabic',Tajawal,system-ui,sans-serif; line-height:1.85;
    -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .page { width:${opts.forPdf ? 'auto' : '210mm'}; min-height:${opts.forPdf ? 'auto' : '297mm'};
    margin:${opts.forPdf ? '0' : '16px auto'}; background:var(--cream);
    padding:${opts.forPdf ? '14mm 12mm' : '20mm 18mm'};
    box-shadow:${opts.forPdf ? 'none' : '0 8px 40px rgba(10,31,61,.15)'}; position:relative; }
  ${opts.forPdf ? '@page { size:A4; margin:0; }' : `@media print {
    body { background:#fff; }
    .page { margin:0; box-shadow:none; width:auto; min-height:auto; padding:14mm 12mm; }
    .toolbar { display:none !important; }
    @page { size:A4; margin:0; }
  }
  .toolbar { position:fixed; top:14px; left:14px; z-index:50; display:flex; gap:8px; }
  .toolbar button { background:var(--navy); color:var(--gold); border:1px solid var(--gold);
    padding:10px 18px; border-radius:8px; font-family:inherit; font-weight:700; cursor:pointer; }
  .toolbar button.alt { background:#fff; color:var(--navy); border:1px solid var(--navy); }`}

  .confidential { background:var(--navy); color:var(--gold); text-align:center;
    font-weight:700; letter-spacing:.25em; padding:10px; border-radius:6px;
    margin-bottom:22px; font-size:13px; }
  .version-tag { position:absolute; top:6mm; left:8mm; background:var(--gold); color:var(--navy);
    padding:3px 10px; border-radius:4px; font-size:9.5px; font-weight:700; letter-spacing:.1em; }

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

  .sig-divider { border-top:2px solid var(--gold); margin:28px 0 14px; page-break-before:auto; }
  .sig-title { text-align:center; font-weight:700; font-size:18px; color:var(--navy); margin-bottom:18px;
    letter-spacing:.15em; }
  .sig-title::before, .sig-title::after { content:"━━━"; color:var(--gold); margin:0 12px; font-weight:400; }
  .sigs { display:grid; grid-template-columns:1fr 1fr; gap:16px; page-break-inside:avoid; }
  .sigbox { position:relative; background:linear-gradient(180deg,#fff 0%,#fdfbf5 100%);
    border:1px solid ${GOLD}88; border-radius:12px; padding:20px 18px 22px; text-align:center;
    box-shadow:0 4px 16px rgba(10,31,61,.08); overflow:hidden; }
  .sigbox::before { content:""; position:absolute; top:0; right:0; left:0; height:4px;
    background:linear-gradient(90deg,${GOLD} 0%,${NAVY} 50%,${GOLD} 100%); }
  .sigbox .badge-corner { position:absolute; top:10px; left:10px; background:var(--navy);
    color:var(--gold); padding:3px 8px; border-radius:4px; font-size:9px; font-weight:700;
    letter-spacing:.15em; }
  .sigbox .lbl { font-weight:700; color:var(--navy); font-size:13px; margin-top:6px; }
  .sigbox .who { font-size:13px; color:var(--navy); margin:6px 0 16px; font-weight:600; }
  .seal-circle { position:relative; margin:0 auto 14px; width:140px; height:140px;
    border-radius:50%; background:radial-gradient(circle,${CREAM} 60%,${GOLD}15 100%);
    display:flex; align-items:center; justify-content:center; flex-direction:column;
    box-shadow:inset 0 0 0 2px var(--navy), inset 0 0 0 4px ${CREAM},
      inset 0 0 0 6px var(--navy), 0 2px 12px rgba(10,31,61,.2); }
  .seal-circle .sn { font-size:9px; color:var(--navy); margin:0; letter-spacing:.1em; font-weight:600; text-transform:uppercase; }
  .seal-circle .sm { font-family:'Aref Ruqaa',serif; font-size:22px; color:var(--navy); font-weight:700; margin:4px 0; line-height:1; }
  .seal-circle .sd { font-size:8.5px; color:var(--gold); margin:2px 0 0; font-weight:700; letter-spacing:.1em; }
  .stamp-ok { display:inline-flex; align-items:center; gap:6px; padding:6px 14px;
    background:linear-gradient(135deg,${GOLD}33,${GOLD}15); color:var(--navy);
    border:1.5px solid var(--gold); border-radius:20px; font-weight:700; font-size:11.5px; }
  .stamp-ok::before { content:"✓"; background:var(--navy); color:var(--gold);
    width:16px; height:16px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:10px; }

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
  .signed-card .meta { font-size:10.5px; color:${NAVY}cc; line-height:1.9; text-align:right; padding:4px 6px; }
  .signed-card .meta .row { display:flex; justify-content:space-between; gap:8px;
    border-bottom:1px dotted ${GOLD}55; padding:2px 0; }
  .signed-card .meta .row:last-child { border:0; }
  .signed-card .meta .k { color:${NAVY}99; font-weight:600; }
  .signed-card .meta .v { color:var(--navy); font-weight:700; font-family:ui-monospace,Menlo,monospace; font-size:10px; }

  .pending { background:repeating-linear-gradient(45deg,${CREAM},${CREAM} 10px,#f6f1e3 10px,#f6f1e3 20px);
    border:1.5px dashed ${NAVY}66; border-radius:8px; padding:30px 14px;
    color:${NAVY}88; font-size:12px; font-weight:600; }
  .pending::before { content:"⏳ "; font-size:18px; }

  .verify { margin-top:18px; padding:14px 16px;
    background:linear-gradient(135deg,${GOLD}11,${NAVY}05);
    border:1px solid ${GOLD}66; border-radius:10px; font-size:11px; color:var(--navy);
    display:grid; grid-template-columns:1fr ${qrUrl ? '130px' : '0'}; gap:14px; align-items:center; page-break-inside:avoid; }
  .verify .vh { display:flex; align-items:center; gap:8px; font-weight:700; margin-bottom:6px; color:var(--navy); }
  .verify .vh .lock { background:var(--navy); color:var(--gold); width:22px; height:22px;
    border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:11px; }
  .verify code { display:block; word-break:break-all; font-family:ui-monospace,Menlo,monospace;
    font-size:10px; padding:8px 10px; background:#fff; border:1px dashed ${GOLD}55;
    border-radius:6px; color:var(--navy); margin-top:6px; letter-spacing:.02em; }
  .verify .note { margin-top:6px; font-size:10px; color:${NAVY}99; }
  .verify .qr { background:#fff; border:1px solid ${GOLD}66; border-radius:8px; padding:6px; text-align:center; }
  .verify .qr img { display:block; width:118px; height:118px; }
  .verify .qr .qr-lbl { font-size:8.5px; color:${NAVY}99; margin-top:4px; font-weight:600; letter-spacing:.05em; }

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
${opts.forPdf ? '' : `<div class="toolbar">
  <button onclick="window.print()">⬇️ حفظ كـ PDF</button>
  <button class="alt" onclick="window.close()">إغلاق</button>
</div>`}

<div class="page">
  ${opts.versionLabel ? `<div class="version-tag">${esc(opts.versionLabel)}</div>` : ''}
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
      <p class="en">MASTEREDUPATH — ACADEMIC SERVICES</p>
      <div class="seal">MEP</div>
    </div>
  </header>

  <div class="divider"></div>
  <div class="title-block">
    <h2>${esc(contract.title || "عقد تقديم خدمات أكاديمية")}</h2>
    <p class="en">ACADEMIC SERVICES AGREEMENT</p>
  </div>

  <div class="preamble">
    إنه في يوم <strong>${fmtDate(contract.created_at)}</strong>، وانطلاقاً من رسالة <strong>${esc(PLATFORM.legal)}</strong>
    في دعم المسيرة الأكاديمية والبحثية، وبناءً على رغبة الطرف الثاني الصريحة في الإفادة من الخدمات الأكاديمية المُقدَّمة عبر
    <strong>${esc(PLATFORM.nameAr)}</strong> على النطاق الرسمي <strong>${esc(PLATFORM.domain)}</strong>، فقد اتفق الطرفان — وهما بكامل أهليتهما المعتبرة شرعاً ونظاماً —
    على إبرام هذا العقد وفق البنود والأحكام المُبيَّنة أدناه.
  </div>

  <h3 class="section">المادة الأولى: أطراف العقد</h3>
  <div class="parties">
    <div class="party">
      <div class="lbl">الطرف الأول (مقدّم الخدمة)</div>
      <table>
        ${partyRow("الاسم", PLATFORM.legal)}
        ${partyRow("العلامة التجارية", PLATFORM.nameAr)}
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
        <p class="sm">MEP</p>
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
      <div>
        <div class="vh"><span class="lock">🔒</span> بصمة التحقق الرقمي (SHA-256)</div>
        <code>${esc(verifyHash)}</code>
        <div class="note">هذه البصمة تُستخدم للتحقق من سلامة العقد وعدم التلاعب به. أي تعديل سيؤدي إلى تغيير البصمة.${opts.verifyUrl ? ` للتحقق المستقل: <strong>${esc(opts.verifyUrl)}</strong>` : ''}</div>
      </div>
      ${qrUrl ? `<div class="qr"><img src="${qrUrl}" alt="QR Verification" /><div class="qr-lbl">امسح للتحقق</div></div>` : ''}
    </div>
  ` : ""}

  <footer class="doc">
    <span class="num">${esc(contract.contract_number)}</span>
    <div class="center">
      <b>${esc(PLATFORM.legal)} | ${esc(PLATFORM.nameAr)}</b>
      جميع الحقوق محفوظة © ${new Date().getFullYear()}
    </div>
    <span>${esc(PLATFORM.domain)}</span>
  </footer>
</div>
</body>
</html>`;
}

// ============== Browserless: HTML → PDF ==============
async function renderPdfViaBrowserless(html: string): Promise<Uint8Array> {
  const apiKey = Deno.env.get("BROWSERLESS_API_KEY");
  if (!apiKey) throw new Error("BROWSERLESS_API_KEY is not configured");

  const endpoint = `https://production-sfo.browserless.io/pdf?token=${encodeURIComponent(apiKey)}`;
  const resp = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      html,
      options: {
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
        displayHeaderFooter: false,
      },
      gotoOptions: { waitUntil: "networkidle0", timeout: 30000 },
      waitForTimeout: 800, // give fonts a beat
    }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Browserless ${resp.status}: ${text.slice(0, 300)}`);
  }
  const buf = await resp.arrayBuffer();
  return new Uint8Array(buf);
}

// ============== HTTP entry ==============
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
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mode: "preview" | "signed_final" =
      body.mode === "signed_final" || url.searchParams.get("mode") === "signed_final"
        ? "signed_final" : "preview";
    const force = body.force === true || url.searchParams.get("force") === "true";
    const wantsHtml =
      url.searchParams.get("format") === "html" ||
      body.format === "html" ||
      (req.headers.get("accept") || "").includes("text/html");

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

    // Apply optional overrides for previews, and for signed_final only when base contract content is incomplete
    const overrideContent = typeof body.override_content === "string" ? body.override_content.trim() : "";
    const overrideClientName = typeof body.override_client_full_name === "string" ? body.override_client_full_name.trim() : "";
    const overrideClientEmail = typeof body.override_client_email === "string" ? body.override_client_email.trim() : "";
    const allowSignedOverride = mode === "signed_final" && !isCompleteContractContent(contract.content);
    if (mode === "preview" || allowSignedOverride || (mode === "signed_final" && force)) {
      if (overrideClientName) contract.client_full_name = overrideClientName;
      if (overrideClientEmail) contract.client_email = overrideClientEmail;
      if (isCompleteContractContent(overrideContent)) contract.content = overrideContent;
    }

    // Auto-append acknowledgement if content is light and we have a signature
    if (!isCompleteContractContent(contract.content) && signature?.signature_text) {
      contract.content = `${contract.content || ""}

---

### إقرار الطرف الثاني
أقرّ أنا/${signature.signer_name || contract.client_full_name || "العميل"} بأنني وافقت على هذا العقد إلكترونياً وتم توثيق توقيعي في النظام.`.trim();
    }
    if ((!contract.client_full_name || !String(contract.client_full_name).trim()) && signature?.signer_name) {
      contract.client_full_name = signature.signer_name;
    }
    if ((!contract.client_email || !String(contract.client_email).trim()) && signature?.signer_email) {
      contract.client_email = signature.signer_email;
    }

    // Verify hash & verification URL
    const verifyHash = signature
      ? await sha256Hex(`${contract.id}|${signature.signed_at}|${signature.ip_address || ""}|${signature.signature_text}`)
      : "";
    const verifyToken = contract.verification_token;
    const publicOrigin = body.public_origin || url.searchParams.get("public_origin") || "https://masteredupath.com";
    const verifyUrl = verifyToken ? `${publicOrigin}/verify/${verifyToken}` : "";

    // ===== signed_final path: idempotent, immutable, versioned =====
    if (mode === "signed_final") {
      if (!signature) throw new Error("Cannot generate signed_final: contract has no signature");

      // Idempotency: reuse only if current signed version is complete; otherwise auto-repair by regenerating a new immutable version
      if (!force) {
        const { data: existing } = await supabase
          .from("contract_versions")
          .select("*")
          .eq("contract_id", contract.id)
          .eq("output_type", "signed_final")
          .eq("is_current", true)
          .maybeSingle();
        const existingSnapshot = String(existing?.content_snapshot || "").trim();
        const canReuseExisting = Boolean(existing?.pdf_storage_path) && isCompleteContractContent(existingSnapshot);
        if (canReuseExisting) {
          const { data: signedUrlData } = await supabase.storage
            .from("contracts").createSignedUrl(existing.pdf_storage_path, 60 * 60 * 24 * 7);
          return new Response(JSON.stringify({
            success: true, reused: true,
            version: existing,
            pdf_storage_path: existing.pdf_storage_path,
            signed_url: signedUrlData?.signedUrl,
            verification_token: verifyToken,
            verification_url: verifyUrl,
          }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }

      // Determine next version number
      const { data: maxRow } = await supabase
        .from("contract_versions")
        .select("version_no")
        .eq("contract_id", contract.id)
        .eq("output_type", "signed_final")
        .order("version_no", { ascending: false })
        .limit(1).maybeSingle();
      const nextVersion = (maxRow?.version_no || 0) + 1;
      const versionLabel = `الإصدار ${nextVersion} • SIGNED FINAL`;

      const html = buildHtml(contract, signature, verifyHash, {
        forPdf: true, versionLabel, verifyUrl,
      });
      const contentHash = await sha256Hex(contract.content || "");
      const pdf = await renderPdfViaBrowserless(html);
      const pdfHash = await sha256Hex(Array.from(pdf).map(b => String.fromCharCode(b)).join(""));

      const path = `${contract.id}/versions/v${nextVersion}/signed.pdf`;
      const { error: upErr } = await supabase.storage
        .from("contracts").upload(path, pdf, {
          contentType: "application/pdf", upsert: false, // never overwrite signed_final
        });
      if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

      // Insert version row (becomes current via trigger)
      const { data: versionRow, error: vErr } = await supabase
        .from("contract_versions").insert({
          contract_id: contract.id,
          version_no: nextVersion,
          output_type: "signed_final",
          content_snapshot: contract.content,
          content_sha256: contentHash,
          pdf_storage_path: path,
          pdf_size_bytes: pdf.byteLength,
          generator: "browserless",
          based_on_signature_id: signature.id,
          is_current: true,
          metadata: { verify_hash: verifyHash, verify_url: verifyUrl },
        }).select().single();
      if (vErr) throw new Error(`Version insert failed: ${vErr.message}`);

      // Upsert evidence (one per contract)
      const evidencePayload = {
        contract_id: contract.id,
        signature_id: signature.id,
        contract_version_id: versionRow.id,
        signed_at: signature.signed_at,
        signer_name: signature.signer_name,
        signer_email: signature.signer_email,
        signer_id_number: signature.signer_id_number,
        signer_user_id: signature.signer_user_id,
        ip_address: signature.ip_address,
        user_agent: signature.user_agent,
        accepted_terms: signature.accepted_terms,
        content_snapshot: contract.content,
        content_sha256: contentHash,
        pdf_storage_path: path,
        pdf_sha256: pdfHash,
        verification_token: verifyToken,
        metadata: { source: force ? "regenerate" : "first_generation", verify_hash: verifyHash },
      };
      const evidenceHash = await sha256Hex(JSON.stringify(evidencePayload));

      // Try insert; if exists (backfill scenario), skip — evidence is immutable
      const { data: existingEvidence } = await supabase
        .from("contract_evidence").select("id").eq("contract_id", contract.id).maybeSingle();
      if (!existingEvidence) {
        const { error: eErr } = await supabase
          .from("contract_evidence").insert({ ...evidencePayload, evidence_sha256: evidenceHash });
        if (eErr) console.warn("evidence insert warning:", eErr.message);
        await supabase.from("contracts").update({
          evidence_id: (await supabase.from("contract_evidence").select("id").eq("contract_id", contract.id).maybeSingle()).data?.id,
          signed_pdf_path: path, // keep legacy column in sync
          signed_pdf_generated_at: new Date().toISOString(),
          content_sha256: contentHash,
        }).eq("id", contract.id);
      } else {
        await supabase.from("contracts").update({
          signed_pdf_path: path,
          signed_pdf_generated_at: new Date().toISOString(),
        }).eq("id", contract.id);
      }

      const { data: signedUrlData } = await supabase.storage
        .from("contracts").createSignedUrl(path, 60 * 60 * 24 * 7);

      return new Response(JSON.stringify({
        success: true, reused: false,
        version: versionRow,
        pdf_storage_path: path,
        signed_url: signedUrlData?.signedUrl,
        content_sha256: contentHash,
        pdf_sha256: pdfHash,
        verification_token: verifyToken,
        verification_url: verifyUrl,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ===== preview path: HTML or overwritable preview PDF =====
    const html = buildHtml(contract, signature, verifyHash, {
      forPdf: !wantsHtml,
      versionLabel: signature ? "معاينة" : "مسودة",
      verifyUrl,
    });

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

    // Render preview PDF (overwritable)
    const pdf = await renderPdfViaBrowserless(html);
    const previewPath = `${contract.id}/previews/preview.pdf`;
    await supabase.storage.from("contracts").upload(previewPath, pdf, {
      contentType: "application/pdf", upsert: true,
    });
    const { data: signedUrlData } = await supabase.storage
      .from("contracts").createSignedUrl(previewPath, 60 * 60); // 1h

    return new Response(JSON.stringify({
      success: true, mode: "preview",
      pdf_storage_path: previewPath,
      signed_url: signedUrlData?.signedUrl,
      contract_id: contract.id,
      verification_token: verifyToken,
      verification_url: verifyUrl,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("generate-contract-pdf error:", e);
    return new Response(JSON.stringify({ success: false, error: e.message || String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
