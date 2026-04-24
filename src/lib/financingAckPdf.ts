// مولّد PDF رسمي لإقرارات التمويل — يدعم العربية عبر html2canvas + jsPDF
// يجلب الإقرار الموثّق من قاعدة البيانات ويُنتج وثيقة PDF مختومة بالبصمة الرقمية
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import { FINANCING_ACK_TITLES_AR, type FinancingAcknowledgmentType } from '@/lib/financing';

interface AckRecord {
  id: string;
  application_id: string;
  user_id: string;
  ack_type: FinancingAcknowledgmentType;
  ack_title: string;
  signer_name: string;
  accepted_clauses: string[] | null;
  signature_text: string;
  signed_at: string;
  user_agent: string | null;
  evidence_sha256: string;
  created_at?: string;
}

const fmtDate = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString('ar-SA', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
  } catch {
    return iso;
  }
};

function buildHtml(rec: AckRecord, applicationCode?: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.dir = 'rtl';
  wrapper.lang = 'ar';
  wrapper.style.cssText = `
    width: 794px; padding: 48px 56px; background: #ffffff; color: #0f172a;
    font-family: 'IBM Plex Sans Arabic', 'Cairo', system-ui, sans-serif;
    line-height: 1.7; box-sizing: border-box; position: fixed; top: -10000px; right: 0;
  `;

  const clauses = Array.isArray(rec.accepted_clauses) ? rec.accepted_clauses : [];

  wrapper.innerHTML = `
    <div style="border-bottom: 3px solid #1e3a8a; padding-bottom: 16px; margin-bottom: 24px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size: 11px; color:#64748b; letter-spacing:1px;">MASTER PAYLATER</div>
          <div style="font-size: 22px; font-weight: 800; color:#1e3a8a;">إقرار رقمي موثَّق</div>
        </div>
        <div style="text-align:left; font-size:11px; color:#475569;">
          <div>رقم الإقرار: <span style="font-family: monospace; color:#0f172a;">${rec.id.slice(0, 13).toUpperCase()}</span></div>
          ${applicationCode ? `<div>طلب التمويل: <span style="font-family: monospace; color:#0f172a;">${applicationCode}</span></div>` : ''}
        </div>
      </div>
    </div>

    <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border:1px solid #bfdbfe; border-radius: 12px; padding: 18px 22px; margin-bottom: 22px;">
      <div style="font-size: 11px; color:#1e40af; font-weight:700; margin-bottom:6px;">عنوان الإقرار</div>
      <div style="font-size: 18px; font-weight: 800; color:#0f172a;">${rec.ack_title || FINANCING_ACK_TITLES_AR[rec.ack_type]}</div>
    </div>

    <div style="margin-bottom: 18px;">
      <div style="font-size: 12px; font-weight:700; color:#1e3a8a; margin-bottom: 10px; padding-bottom:6px; border-bottom: 1px solid #e2e8f0;">بنود الإقرار المُوقَّع عليها</div>
      <ol style="padding-right: 22px; margin: 0; font-size: 13px; color:#1f2937;">
        ${clauses.map((c) => `<li style="margin-bottom: 10px;">${escapeHtml(c)}</li>`).join('')}
      </ol>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 22px;">
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px;">
        <div style="font-size: 10px; color:#64748b; margin-bottom:4px;">اسم الموقِّع</div>
        <div style="font-size: 14px; font-weight:700; color:#0f172a;">${escapeHtml(rec.signer_name)}</div>
      </div>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px;">
        <div style="font-size: 10px; color:#64748b; margin-bottom:4px;">تاريخ التوقيع</div>
        <div style="font-size: 13px; font-weight:700; color:#0f172a;">${fmtDate(rec.signed_at)}</div>
      </div>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px;">
        <div style="font-size: 10px; color:#64748b; margin-bottom:4px;">التوقيع الإلكتروني</div>
        <div style="font-size: 18px; font-weight:800; color:#1e3a8a; font-family: 'Brush Script MT', cursive;">${escapeHtml(rec.signature_text)}</div>
      </div>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px;">
        <div style="font-size: 10px; color:#64748b; margin-bottom:4px;">معرّف المستخدم</div>
        <div style="font-size: 11px; font-family: monospace; color:#0f172a; word-break: break-all;">${rec.user_id}</div>
      </div>
    </div>

    <div style="background:#fef3c7; border:1px solid #fcd34d; border-radius:10px; padding:14px; margin-bottom:18px;">
      <div style="font-size: 10px; color:#92400e; font-weight:700; margin-bottom:6px;">🔒 البصمة الرقمية (SHA-256)</div>
      <div style="font-family: monospace; font-size: 10px; color:#78350f; word-break: break-all; line-height:1.5;">${rec.evidence_sha256}</div>
    </div>

    ${rec.user_agent ? `
    <div style="background:#f1f5f9; border-radius:8px; padding:10px 14px; margin-bottom:18px; font-size:10px; color:#475569;">
      <strong style="color:#334155;">بصمة الجهاز:</strong> ${escapeHtml(rec.user_agent)}
    </div>` : ''}

    <div style="border-top: 2px solid #1e3a8a; padding-top: 14px; font-size: 10px; color:#64748b; text-align: center; line-height:1.6;">
      هذه الوثيقة صادرة آلياً من نظام Master PayLater وتُعدّ إقراراً رقمياً موثّقاً ذا حجّية قانونية كاملة وفق
      نظام التعاملات الإلكترونية السعودي (المرسوم الملكي م/18) ونظام التنفيذ السعودي (م/53).
      <br/>تم إنشاء هذه الوثيقة في: ${fmtDate(new Date().toISOString())}
    </div>
  `;
  return wrapper;
}

function escapeHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function downloadAcknowledgmentPdf(params: {
  applicationId: string;
  ackType: FinancingAcknowledgmentType;
  applicationCode?: string;
  userId?: string; // اختياري، لو لم يُمرَّر نأخذ المستخدم الحالي (للعميل)
}) {
  const { applicationId, ackType, applicationCode, userId } = params;

  // جلب السجل الموثَّق
  let q = supabase
    .from('financing_acknowledgments' as any)
    .select('*')
    .eq('application_id', applicationId)
    .eq('ack_type', ackType);
  if (userId) q = q.eq('user_id', userId);

  const { data, error } = await q.maybeSingle();
  if (error || !data) {
    throw new Error('لم يتم العثور على إقرار موثَّق لهذا الطلب');
  }

  const rec = data as unknown as AckRecord;
  const node = buildHtml(rec, applicationCode);
  document.body.appendChild(node);

  try {
    // ضمان جاهزية الخطوط
    if ((document as any).fonts?.ready) {
      try { await (document as any).fonts.ready; } catch { /* ignore */ }
    }
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    const canvas = await html2canvas(node, {
      scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false,
    });
    const img = canvas.toDataURL('image/png', 1.0);

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4', compress: true });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 24;
    const ratio = canvas.width / canvas.height;
    let imgW = pageW - margin * 2;
    let imgH = imgW / ratio;
    if (imgH > pageH - margin * 2) {
      imgH = pageH - margin * 2;
      imgW = imgH * ratio;
    }
    const x = (pageW - imgW) / 2;
    const y = margin;
    pdf.addImage(img, 'PNG', x, y, imgW, imgH, undefined, 'FAST');

    const codePart = applicationCode || applicationId.slice(0, 8);
    pdf.save(`acknowledgment-${ackType}-${codePart}.pdf`);
  } finally {
    document.body.removeChild(node);
  }
}
