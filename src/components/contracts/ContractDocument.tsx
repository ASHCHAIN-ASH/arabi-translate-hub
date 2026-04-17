import React from "react";
import ReactMarkdown from "react-markdown";
import { ShieldCheck, Building2, User, Mail, Phone, IdCard, Calendar, DollarSign, FileText } from "lucide-react";
import type { ContractRow, ContractSignature } from "@/utils/supabaseContractService";

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
}

export const ContractDocument: React.FC<Props> = ({ contract, signature }) => {
  const total = Number(contract.total_amount || 0);
  const currency = contract.currency || "SAR";

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

      {/* Preamble */}
      <div
        className="rounded-lg px-5 py-4 mb-7 text-[13.5px] leading-loose"
        style={{ background: "#fff", borderRight: `4px solid ${GOLD}`, border: `1px solid ${GOLD}55` }}
      >
        بتاريخ <strong>{fmtDate(contract.created_at)}</strong>، أُبرم هذا العقد بين الطرفين أدناه وفقاً للأحكام
        الواردة فيه، ويُقدَّم حصرياً عبر منصة <strong>{PLATFORM.name}</strong> ({PLATFORM.domain}) بإشراف
        {" "}{PLATFORM.legal}.
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

      {/* Signature block */}
      <div style={{ borderTop: `2px solid ${GOLD}`, margin: "24px 0 18px" }} />
      <div className="text-center font-bold text-lg mb-5" style={{ color: NAVY }}>
        ◆ التوقيع والاعتماد ◆
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First party (platform) */}
        <div
          className="rounded-lg p-5 text-center"
          style={{ background: "#fff", border: `1px solid ${GOLD}66` }}
        >
          <p className="font-bold text-sm mb-1" style={{ color: NAVY }}>الطرف الأول</p>
          <p className="text-xs mb-4" style={{ color: NAVY }}>{PLATFORM.legal}</p>
          <div
            className="mx-auto flex items-center justify-center mb-3"
            style={{
              width: 110, height: 110,
              border: `3px double ${NAVY}`, borderRadius: "50%",
              background: CREAM,
            }}
          >
            <div className="text-center">
              <p className="text-[10px] m-0" style={{ color: NAVY }}>{PLATFORM.nameAr}</p>
              <p className="font-bold text-base m-0" style={{ color: NAVY }}>MUP</p>
              <p className="text-[9px] m-0" style={{ color: GOLD }}>{fmtDate(contract.created_at)}</p>
            </div>
          </div>
          <div
            className="inline-block px-3 py-1 text-xs font-bold rounded"
            style={{ background: GOLD + "33", color: NAVY, border: `1px solid ${GOLD}` }}
          >
            ✓ معتمد ومختوم رسمياً
          </div>
        </div>

        {/* Second party (client) */}
        <div
          className="rounded-lg p-5 text-center"
          style={{ background: "#fff", border: `1px solid ${GOLD}66` }}
        >
          <p className="font-bold text-sm mb-1" style={{ color: NAVY }}>الطرف الثاني</p>
          <p className="text-xs mb-4" style={{ color: NAVY }}>{contract.client_full_name || "—"}</p>
          {signature ? (
            <div
              className="rounded-lg p-3 text-xs space-y-1"
              style={{ background: CREAM, border: `1px dashed ${GOLD}` }}
            >
              <p className="font-bold" style={{ color: NAVY }}>✓ تم التوقيع إلكترونياً</p>
              <p
                style={{ fontFamily: "'Brush Script MT', cursive", fontSize: 22, color: NAVY }}
                className="my-2"
              >
                {signature.signature_text}
              </p>
              <p style={{ color: NAVY }}>التاريخ: {fmtDateTime(signature.signed_at)}</p>
              {signature.ip_address && <p style={{ color: NAVY + "99" }}>IP: {signature.ip_address}</p>}
              {signature.signer_id_number && <p style={{ color: NAVY + "99" }}>الهوية: {signature.signer_id_number}</p>}
            </div>
          ) : (
            <div
              className="rounded-lg p-6 text-xs"
              style={{ background: CREAM, border: `1px dashed ${NAVY}55`, color: NAVY + "99" }}
            >
              — لم يتم التوقيع بعد —
            </div>
          )}
        </div>
      </div>

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
