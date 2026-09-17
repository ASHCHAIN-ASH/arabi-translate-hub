import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Building2, FileText, Calendar, MapPin, User, Mail, Phone,
  Hash, ShieldCheck, Scale, BookOpenCheck, Stamp,
} from 'lucide-react';

interface Props {
  contractNumber: string;
  title: string;
  content: string;
  totalAmount?: number | null;
  currency?: string | null;
  clientName?: string | null;
  clientEmail?: string | null;
  issueDateHijri?: string;
}

const SITE_NAME = 'منصة فكرة إيدو';
const PARENT = 'شركة علي صالح الشهري القابضة';

/**
 * عارض عقد بتصميم شركات احترافي RTL — ترويسة، علامة مائية،
 * جداول وأيقونات، تنسيق موحّد للقراءة قبل التوقيع.
 */
export const ContractDocumentView: React.FC<Props> = ({
  contractNumber, title, content, totalAmount, currency,
  clientName, clientEmail, issueDateHijri,
}) => {
  return (
    <div dir="rtl" className="contract-doc relative bg-white text-slate-900 font-[IBM_Plex_Sans_Arabic,Tajawal,Arial,sans-serif]">
      {/* علامة مائية */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
      >
        <Stamp className="w-[60%] h-[60%] text-slate-900/[0.03]" strokeWidth={0.5} />
      </div>

      {/* الترويسة الرسمية */}
      <header className="relative bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 text-white px-8 py-6 border-b-4 border-amber-400">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-lg ring-2 ring-white/20">
              <BookOpenCheck className="h-9 w-9 text-slate-900" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight leading-tight">{SITE_NAME}</h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                <span>تابعة لـ {PARENT}</span>
              </p>
            </div>
          </div>
          <div className="text-left hidden sm:block">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-md shadow">
              <ShieldCheck className="h-3.5 w-3.5" />
              عقد رسمي مُلزِم
            </div>
            <p className="text-[11px] text-slate-300 mt-2">وفقاً للأنظمة المعمول بها في المملكة العربية السعودية</p>
          </div>
        </div>
      </header>

      {/* شريط معلومات العقد */}
      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 border-b">
        <InfoCell icon={Hash} label="رقم العقد" value={contractNumber} mono />
        <InfoCell icon={Calendar} label="تاريخ التحرير" value={issueDateHijri || '—'} />
        <InfoCell icon={MapPin} label="مكان الإبرام" value="المملكة العربية السعودية" />
        <InfoCell
          icon={Scale}
          label="القيمة الإجمالية"
          value={
            totalAmount != null
              ? `${Number(totalAmount).toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ${currency || 'ر.س'}`
              : '—'
          }
          highlight
        />
      </div>

      {/* عنوان العقد */}
      <div className="relative px-8 pt-8 pb-4 text-center border-b border-dashed border-slate-300">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <span className="h-px w-10 bg-amber-400" />
          <FileText className="h-5 w-5 text-amber-600" />
          <span className="h-px w-10 bg-amber-400" />
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-snug">{title}</h2>
        {(clientName || clientEmail) && (
          <p className="mt-2 text-xs text-slate-500 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {clientName && (
              <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{clientName}</span>
            )}
            {clientEmail && (
              <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{clientEmail}</span>
            )}
          </p>
        )}
      </div>

      {/* محتوى العقد */}
      <article className="relative px-6 md:px-10 py-8 contract-prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>

      {/* تذييل قانوني */}
      <footer className="relative bg-slate-50 border-t border-slate-200 px-8 py-4 text-[11px] text-slate-500 leading-relaxed">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            هذه الوثيقة مُؤمَّنة وتحمل ختماً زمنياً وتوقيعاً إلكترونياً موثّقاً
          </span>
          <span className="font-mono">{contractNumber}</span>
        </div>
      </footer>

      {/* أنماط مخصّصة لـ Markdown داخل العقد */}
      <style>{`
        .contract-prose { color: #0f172a; line-height: 1.95; font-size: 15px; }
        .contract-prose h1 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 1.5rem 0 1rem; padding-bottom: .5rem; border-bottom: 2px solid #f59e0b; }
        .contract-prose h2 { font-size: 1.15rem; font-weight: 800; color: #1e293b; margin: 1.75rem 0 .75rem; padding: .5rem .75rem; background: linear-gradient(to left, #fef3c7, transparent); border-right: 4px solid #f59e0b; border-radius: 4px; }
        .contract-prose h3 { font-size: 1rem; font-weight: 700; color: #334155; margin: 1.25rem 0 .5rem; }
        .contract-prose p  { margin: .6rem 0; text-align: justify; }
        .contract-prose strong { color: #0f172a; font-weight: 700; }
        .contract-prose ul, .contract-prose ol { margin: .5rem 1.5rem; padding-right: .5rem; }
        .contract-prose ul { list-style: none; }
        .contract-prose ul > li { position: relative; padding-right: 1.25rem; margin: .35rem 0; }
        .contract-prose ul > li::before { content: "◆"; color: #f59e0b; position: absolute; right: 0; top: 0; font-size: .75rem; }
        .contract-prose ol { list-style: arabic-indic inside; }
        .contract-prose ol > li { margin: .35rem 0; padding-right: .5rem; }
        .contract-prose hr { margin: 1.5rem 0; border: 0; border-top: 1px dashed #cbd5e1; }
        .contract-prose blockquote { border-right: 4px solid #f59e0b; background: #fffbeb; padding: .75rem 1rem; margin: 1rem 0; border-radius: 4px; color: #78350f; }
        .contract-prose table { width: 100%; border-collapse: collapse; margin: 1rem 0; box-shadow: 0 1px 3px rgba(0,0,0,.06); border-radius: 6px; overflow: hidden; }
        .contract-prose thead { background: linear-gradient(to left, #1e293b, #334155); }
        .contract-prose thead th { color: #fff; font-weight: 700; padding: .65rem .85rem; text-align: right; font-size: .85rem; border: 1px solid #1e293b; }
        .contract-prose tbody td { padding: .55rem .85rem; border: 1px solid #e2e8f0; text-align: right; font-size: .85rem; background: #fff; }
        .contract-prose tbody tr:nth-child(even) td { background: #f8fafc; }
        .contract-prose tbody tr:hover td { background: #fef3c7; }
        .contract-prose code { background: #f1f5f9; padding: .1rem .35rem; border-radius: 3px; font-size: .85em; color: #0f172a; }
      `}</style>
    </div>
  );
};

const InfoCell: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}> = ({ icon: Icon, label, value, mono, highlight }) => (
  <div className={`bg-white px-4 py-3 ${highlight ? 'bg-amber-50' : ''}`}>
    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </div>
    <div className={`text-sm font-bold text-slate-900 ${mono ? 'font-mono' : ''} ${highlight ? 'text-amber-700' : ''}`}>
      {value}
    </div>
  </div>
);
