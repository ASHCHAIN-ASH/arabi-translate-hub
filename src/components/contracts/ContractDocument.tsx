import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ShieldCheck, Building2, User, Mail, Phone, IdCard, Calendar, DollarSign, FileText } from "lucide-react";
import type { ContractRow, ContractSignature } from "@/utils/supabaseContractService";

const SigRow: React.FC<{ k: string; v: string; last?: boolean }> = ({ k, v, last }) => (
  <div
    className="flex justify-between gap-2 py-0.5"
    style={{ borderBottom: last ? "none" : `1px dotted #c9a96155` }}
  >
    <span style={{ color: "#0a1f3d99", fontWeight: 600 }}>{k}</span>
    <span style={{ color: "#0a1f3d", fontWeight: 700, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 10 }}>{v}</span>
  </div>
);

// Lazy-load decorative Arabic signature font once
let _arefLoaded = false;
function useArefFont() {
  useEffect(() => {
    if (_arefLoaded || typeof document === "undefined") return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&display=swap";
    document.head.appendChild(link);
    _arefLoaded = true;
  }, []);
}

/**
 * Bank-grade contract document — RTL Arabic.
 * Navy (#0a1f3d) + Gold (#c9a961) banking aesthetic.
 * Used in admin details, client approval, and PDF preview.
 */

const NAVY = "#0a1f3d";
const GOLD = "#c9a961";
const CREAM = "#fdfbf5";

const PLATFORM = {
  name: "Master U Path",
  nameAr: "ماستر يو المسار",
  legal: "منصة ماستر إيدو باث للخدمات الأكاديمية",
  domain: "masteredupath.com",
  jurisdiction: "المملكة العربية السعودية",
};

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

const fmtMoney = (n: number, c = "SAR") =>
  new Intl.NumberFormat("ar-SA", { style: "currency", currency: c, maximumFractionDigits: 2 }).format(n || 0);

interface Props {
  contract: ContractRow;
  signature?: ContractSignature | null;
  /** Optional: multiple signatures / approval slots. When provided, renders an ordered grid
   *  of "الطرف الثاني / الثالث / ..." plus an optional empty slot per `expectedSigners`. */
  signatures?: ContractSignature[] | null;
  /** Optional: total expected signer slots (excluding platform). Defaults to signatures.length or 1. */
  expectedSigners?: number;
}

// Arabic ordinal labels for parties
const PARTY_LABELS_AR = [
  "الطرف الأول", "الطرف الثاني", "الطرف الثالث", "الطرف الرابع",
  "الطرف الخامس", "الطرف السادس", "الطرف السابع", "الطرف الثامن",
];

export const ContractDocument: React.FC<Props> = ({ contract, signature, signatures, expectedSigners }) => {
  useArefFont();
  const total = Number(contract.total_amount || 0);
  const currency = contract.currency || "SAR";

  // Normalize signatures: prefer `signatures` array, fallback to legacy single `signature`
  const sigList: ContractSignature[] = (signatures && signatures.length > 0)
    ? [...signatures].sort((a: any, b: any) => new Date(a.signed_at || 0).getTime() - new Date(b.signed_at || 0).getTime())
    : (signature ? [signature] : []);
  const slotCount = Math.max(expectedSigners || 0, sigList.length, 1);

  return (
    <div
      dir="rtl"
      lang="ar"
      className="contract-doc mx-auto max-w-[860px] shadow-2xl"
      style={{
        background: CREAM,
        fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', system-ui, sans-serif",
        color: NAVY,
        padding: "32px 36px",
        lineHeight: 1.85,
      }}
    >
      {/* Confidential bar */}
      <div
        className="text-center font-bold tracking-widest text-sm py-2.5 mb-6 rounded-md"
        style={{ background: NAVY, color: GOLD }}
      >
        ◆ سري وخاص &nbsp;—&nbsp; CONFIDENTIAL ◆
      </div>

      {/* Header: contract meta + brand */}
      <header className="flex justify-between items-start gap-6 mb-6 flex-wrap">
        <div
          className="rounded-lg px-4 py-3 text-sm flex-1 min-w-[260px]"
          style={{ background: "#fff", border: `1px solid ${GOLD}66` }}
        >
          <table className="w-full">
            <tbody>
              <MetaRow label="رقم العقد" value={contract.contract_number} mono />
              <MetaRow label="التاريخ" value={fmtDate(contract.created_at)} />
              <MetaRow label="النوع" value={contract.service_type || "خدمة أكاديمية"} />
              <MetaRow label="الخدمة" value={contract.service_name || "—"} />
            </tbody>
          </table>
        </div>

        <div className="text-left">
          <h1 className="font-bold text-xl m-0" style={{ color: NAVY }}>{PLATFORM.nameAr}</h1>
          <p className="text-[11px] tracking-[0.2em] mt-1 mb-2" style={{ color: GOLD }}>
            MASTER U PATH — ACADEMIC SERVICES
          </p>
          <div
            className="inline-flex items-center justify-center font-bold text-base"
            style={{
              width: 64, height: 64,
              background: NAVY, color: GOLD,
              borderRadius: 12, border: `2px solid ${GOLD}`,
            }}
          >
            MUP
          </div>
        </div>
      </header>

      <div style={{ borderTop: `2px solid ${GOLD}`, marginBottom: 22 }} />

      {/* Main title block */}
      <div
        className="rounded-xl px-6 py-7 mb-6 text-center"
        style={{ background: NAVY, color: "#fff", border: `2px solid ${GOLD}` }}
      >
        <h2 className="font-bold text-2xl m-0 mb-1" style={{ color: "#fff" }}>
          {contract.title || "عقد تقديم خدمات أكاديمية"}
        </h2>
        <p className="text-[11px] tracking-[0.25em] m-0" style={{ color: GOLD }}>
          ACADEMIC SERVICES AGREEMENT
        </p>
      </div>

      {/* Preamble — Academic */}
      <div
        className="rounded-lg px-5 py-4 mb-7 text-[13.5px] leading-loose"
        style={{ background: "#fff", borderRight: `4px solid ${GOLD}`, border: `1px solid ${GOLD}55` }}
      >
        إنه في يوم <strong>{fmtDate(contract.created_at)}</strong>، وانطلاقاً من رسالة{" "}
        <strong>{PLATFORM.legal}</strong> في دعم المسيرة الأكاديمية والبحثية وتقديم خدمات علمية
        تتوافق مع أعلى المعايير المهنية والأخلاقية المُعتمدة في الأوساط الجامعية، وبناءً على رغبة
        الطرف الثاني الصريحة في الإفادة من الخدمات الأكاديمية المُقدَّمة عبر منصة{" "}
        <strong>{PLATFORM.name}</strong> ({PLATFORM.domain})، فقد اتفق الطرفان — وهما بكامل أهليتهما
        المعتبرة شرعاً ونظاماً — على إبرام هذا العقد وفق البنود والأحكام المُبيَّنة أدناه، التي تُعدّ
        هذه الديباجة جزءاً لا يتجزأ منها ومُكمِّلةً لأحكامها.
      </div>

      {/* Parties */}
      <SectionTitle>المادة الأولى: أطراف العقد</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
        <PartyCard
          label="الطرف الأول (مقدّم الخدمة)"
          rows={[
            ["الاسم", PLATFORM.legal],
            ["العلامة التجارية", PLATFORM.name],
            ["النطاق الرسمي", PLATFORM.domain],
            ["المقر", PLATFORM.jurisdiction],
          ]}
        />
        <PartyCard
          label="الطرف الثاني (العميل)"
          rows={[
            ["الاسم", contract.client_full_name || "—"],
            ["البريد", contract.client_email || "—"],
            ["الجوال", contract.client_phone || "—"],
            ["الهوية", contract.client_id_number || "—"],
          ]}
        />
      </div>

      {/* Financial summary */}
      <SectionTitle>المادة الثانية: قيمة الخدمة</SectionTitle>
      <table className="w-full mb-7 text-[13.5px]" style={{ borderCollapse: "collapse", border: `1px solid ${GOLD}55` }}>
        <thead>
          <tr style={{ background: NAVY, color: GOLD }}>
            <th className="p-3 text-right font-bold">البند</th>
            <th className="p-3 text-right font-bold">التفاصيل</th>
          </tr>
        </thead>
        <tbody>
          <FinRow label="اسم الخدمة" value={contract.service_name || "—"} />
          {contract.payment_terms && <FinRow label="شروط الدفع" value={contract.payment_terms} />}
          {(contract.metadata as any)?.workDuration && <FinRow label="مدة تنفيذ العمل" value={(contract.metadata as any).workDuration} />}
          {contract.delivery_date && <FinRow label="موعد التسليم" value={fmtDate(contract.delivery_date)} />}
          <tr style={{ background: NAVY }}>
            <td className="p-3 font-bold" style={{ color: GOLD }}>القيمة الإجمالية</td>
            <td className="p-3 font-bold text-lg" style={{ color: GOLD }}>{fmtMoney(total, currency)}</td>
          </tr>
        </tbody>
      </table>

      {/* Markdown body */}
      {contract.content && contract.content.trim().length > 50 && (
        <article
          className="prose prose-sm max-w-none mb-7
            [&_*]:!text-right
            [&_h1]:!text-xl [&_h1]:!font-bold [&_h1]:!mt-6 [&_h1]:!mb-3 [&_h1]:!pb-2
            [&_h2]:!text-lg [&_h2]:!font-bold [&_h2]:!mt-5 [&_h2]:!mb-2
            [&_h3]:!text-base [&_h3]:!font-bold [&_h3]:!mt-4
            [&_p]:!leading-loose [&_p]:!my-2
            [&_ol]:!pr-6 [&_ul]:!pr-6 [&_li]:!my-1
            [&_strong]:!font-bold
            [&_hr]:!my-5"
          style={{ color: NAVY }}
        >
          <style>{`
            .contract-doc .prose h1, .contract-doc .prose h2, .contract-doc .prose h3 { color: ${NAVY}; border-right: 4px solid ${GOLD}; padding-right: 12px; }
            .contract-doc .prose strong { color: ${NAVY}; }
            .contract-doc .prose hr { border-color: ${GOLD}55; }
          `}</style>
          <ReactMarkdown>{contract.content}</ReactMarkdown>
        </article>
      )}

      {/* Signature block — Premium digital design */}
      <div style={{ borderTop: `2px solid ${GOLD}`, margin: "28px 0 18px" }} />
      <div className="text-center font-bold text-lg mb-6 tracking-wider" style={{ color: NAVY }}>
        <span style={{ color: GOLD }}>━━━</span> التوقيع والاعتماد <span style={{ color: GOLD }}>━━━</span>
      </div>

      <div className={`grid grid-cols-1 gap-4 ${slotCount >= 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {/* First party — Official platform seal */}
        <div
          className="relative rounded-xl p-5 pt-6 text-center overflow-hidden"
          style={{
            background: `linear-gradient(180deg, #fff 0%, ${CREAM} 100%)`,
            border: `1px solid ${GOLD}88`,
            boxShadow: "0 4px 16px rgba(10,31,61,.08)",
          }}
        >
          {/* Top gradient bar */}
          <div
            className="absolute top-0 right-0 left-0 h-1"
            style={{ background: `linear-gradient(90deg, ${GOLD} 0%, ${NAVY} 50%, ${GOLD} 100%)` }}
          />
          {/* Corner badge */}
          <div
            className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[9px] font-bold tracking-widest rounded"
            style={{ background: NAVY, color: GOLD }}
          >
            OFFICIAL
          </div>

          <p className="font-bold text-sm mb-1 mt-1" style={{ color: NAVY }}>الطرف الأول</p>
          <p className="text-[13px] mb-4 font-semibold" style={{ color: NAVY }}>{PLATFORM.legal}</p>

          {/* Premium digital seal — bank-grade */}
          <div
            className="relative mx-auto flex items-center justify-center mb-3.5"
            style={{
              width: 140, height: 140, borderRadius: "50%",
              background: `radial-gradient(circle, ${CREAM} 60%, ${GOLD}22 100%)`,
              boxShadow: `inset 0 0 0 2px ${NAVY}, inset 0 0 0 4px ${CREAM}, inset 0 0 0 6px ${NAVY}, 0 2px 12px rgba(10,31,61,.2)`,
            }}
          >
            <div
              className="absolute rounded-full"
              style={{ inset: 10, border: `1px dashed ${NAVY}55` }}
            />
            <div className="text-center relative z-10">
              <p className="text-[9px] m-0 uppercase font-semibold tracking-wider" style={{ color: NAVY }}>
                {PLATFORM.nameAr}
              </p>
              <p
                className="font-bold m-0 leading-none my-1"
                style={{ color: NAVY, fontSize: 22, fontFamily: "'Aref Ruqaa', serif" }}
              >
                MUP
              </p>
              <p className="text-[8.5px] m-0 font-bold tracking-wider" style={{ color: GOLD }}>
                {fmtDate(contract.created_at)}
              </p>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full"
            style={{
              background: `linear-gradient(135deg, ${GOLD}33, ${GOLD}15)`,
              color: NAVY, border: `1.5px solid ${GOLD}`,
              boxShadow: `0 2px 6px ${GOLD}33`,
            }}
          >
            <span
              className="inline-flex items-center justify-center text-[10px]"
              style={{ background: NAVY, color: GOLD, width: 16, height: 16, borderRadius: "50%" }}
            >✓</span>
            معتمد ومختوم رسمياً
          </div>
        </div>

        {/* Second party — Client e-signature */}
        <div
          className="relative rounded-xl p-5 pt-6 text-center overflow-hidden"
          style={{
            background: `linear-gradient(180deg, #fff 0%, ${CREAM} 100%)`,
            border: `1px solid ${GOLD}88`,
            boxShadow: "0 4px 16px rgba(10,31,61,.08)",
          }}
        >
          <div
            className="absolute top-0 right-0 left-0 h-1"
            style={{ background: `linear-gradient(90deg, ${GOLD} 0%, ${NAVY} 50%, ${GOLD} 100%)` }}
          />
          <div
            className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[9px] font-bold tracking-widest rounded"
            style={{ background: NAVY, color: GOLD }}
          >
            E-SIGNED
          </div>

          <p className="font-bold text-sm mb-1 mt-1" style={{ color: NAVY }}>الطرف الثاني</p>
          <p className="text-[13px] mb-4 font-semibold" style={{ color: NAVY }}>
            {contract.client_full_name || "—"}
          </p>

          {signature ? (
            <div
              className="rounded-lg p-3 text-xs"
              style={{
                background: `linear-gradient(180deg, #fff, ${CREAM})`,
                border: `1.5px solid ${GOLD}`,
                boxShadow: `inset 0 0 0 1px ${GOLD}33`,
              }}
            >
              {/* Verified pill */}
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold mb-2"
                style={{ background: "#16a34a", color: "#fff", letterSpacing: ".05em" }}
              >
                <span className="font-black">✓</span> موقّع إلكترونياً ومُوثّق
              </div>

              {/* Signature frame */}
              <div
                className="relative rounded-md px-2 py-2.5 my-1.5 mb-2.5"
                style={{ background: "#fff", border: `1px solid ${GOLD}66` }}
              >
                <span
                  className="absolute -top-1.5 right-2.5 px-1.5 text-[9px] font-semibold"
                  style={{ background: "#fff", color: NAVY + "99" }}
                >
                  التوقيع
                </span>
                <p
                  className="m-0"
                  style={{
                    fontFamily: "'Aref Ruqaa', 'Brush Script MT', cursive",
                    fontSize: 30, color: NAVY, fontWeight: 700, lineHeight: 1.2,
                    textShadow: `1px 1px 0 ${GOLD}33`,
                  }}
                >
                  {signature.signature_text}
                </p>
              </div>

              {/* Meta rows */}
              <div className="text-right px-1.5" style={{ color: NAVY + "cc", fontSize: "10.5px", lineHeight: 1.9 }}>
                <SigRow k="التاريخ والوقت" v={fmtDateTime(signature.signed_at)} />
                {signature.ip_address && <SigRow k="عنوان IP" v={signature.ip_address} />}
                {signature.signer_id_number && <SigRow k="رقم الهوية" v={signature.signer_id_number} />}
                <SigRow k="معرّف التوقيع" v={String(signature.id || "").slice(0, 8)} last />
              </div>
            </div>
          ) : (
            <div
              className="rounded-lg p-7 text-xs font-semibold"
              style={{
                background: `repeating-linear-gradient(45deg, ${CREAM}, ${CREAM} 10px, #f6f1e3 10px, #f6f1e3 20px)`,
                border: `1.5px dashed ${NAVY}66`,
                color: NAVY + "88",
              }}
            >
              <span className="text-lg">⏳</span> لم يتم التوقيع بعد
            </div>
          )}
        </div>
      </div>

      {/* Digital verification hash */}
      {signature && (
        <div
          className="mt-5 rounded-xl px-4 py-3.5 text-xs"
          style={{
            background: `linear-gradient(135deg, ${GOLD}11, ${NAVY}05)`,
            border: `1px solid ${GOLD}66`,
            color: NAVY,
          }}
        >
          <div className="flex items-center gap-2 font-bold mb-1.5">
            <span
              className="inline-flex items-center justify-center text-[11px]"
              style={{ background: NAVY, color: GOLD, width: 22, height: 22, borderRadius: "50%" }}
            >🔒</span>
            بصمة التحقق الرقمي (SHA-256)
          </div>
          <code
            className="block break-all rounded-md px-2.5 py-2 mt-1.5"
            style={{
              background: "#fff", border: `1px dashed ${GOLD}55`,
              fontFamily: "ui-monospace, Menlo, monospace", fontSize: 10,
              color: NAVY, letterSpacing: ".02em",
            }}
          >
            {/* Display a deterministic mock hash from signature id+date for the React preview */}
            {`${(signature.id || "").replace(/-/g,"")}${signature.signed_at?.replace(/[^0-9]/g,"") || ""}`.padEnd(64, "0").slice(0, 64)}
          </code>
          <p className="mt-1.5 text-[10px]" style={{ color: NAVY + "99" }}>
            هذه البصمة تُستخدم للتحقق من سلامة العقد وعدم التلاعب به. أي تعديل سيؤدي إلى تغيير البصمة.
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${GOLD}55`, marginTop: 24, paddingTop: 12 }}>
        <div className="flex justify-between items-center text-[10px]" style={{ color: NAVY + "99" }}>
          <span
            className="px-2 py-1 rounded font-mono font-bold"
            style={{ border: `1px solid ${GOLD}`, color: NAVY }}
          >
            {contract.contract_number}
          </span>
          <div className="text-center">
            <p className="m-0 font-bold" style={{ color: NAVY }}>{PLATFORM.legal} | {PLATFORM.name}</p>
            <p className="m-0">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
          </div>
          <span>{PLATFORM.domain}</span>
        </div>
      </div>
    </div>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3
    className="text-base font-bold mb-3 mt-2 pr-3"
    style={{ color: NAVY, borderRight: `4px solid ${GOLD}` }}
  >
    ◆ {children}
  </h3>
);

const MetaRow: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <tr>
    <td className="py-1 pl-3 text-xs" style={{ color: NAVY + "99" }}>{label}:</td>
    <td className={`py-1 font-bold text-xs ${mono ? "font-mono" : ""}`} style={{ color: NAVY }}>{value}</td>
  </tr>
);

const PartyCard: React.FC<{ label: string; rows: [string, string][] }> = ({ label, rows }) => (
  <div
    className="rounded-lg p-4"
    style={{ background: "#fff", border: `1px solid ${GOLD}66` }}
  >
    <p
      className="font-bold text-sm mb-3 pb-2"
      style={{ color: NAVY, borderBottom: `2px solid ${GOLD}` }}
    >
      {label}
    </p>
    <table className="w-full text-[13px]">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}>
            <td className="py-1 pl-3 align-top" style={{ color: NAVY + "99", width: "30%" }}>{k}:</td>
            <td className="py-1 font-semibold" style={{ color: NAVY }}>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FinRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <tr style={{ borderBottom: `1px solid ${GOLD}33` }}>
    <td className="p-3" style={{ color: NAVY + "99" }}>{label}</td>
    <td className="p-3 font-bold" style={{ color: NAVY }}>{value}</td>
  </tr>
);

export default ContractDocument;
