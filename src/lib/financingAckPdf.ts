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
    width: 794px; min-height: 1123px; padding: 0; background: #ffffff; color: #0f172a;
    font-family: 'IBM Plex Sans Arabic', 'Cairo', system-ui, sans-serif;
    line-height: 1.8; box-sizing: border-box; position: fixed; top: -10000px; right: 0;
    overflow: hidden;
  `;

  const clauses = Array.isArray(rec.accepted_clauses) ? rec.accepted_clauses : [];
  const refNo = rec.id.slice(0, 8).toUpperCase();
  const shortHash = rec.evidence_sha256.slice(0, 12).toUpperCase();

  wrapper.innerHTML = `
    <!-- شريط علوي ملوّن -->
    <div style="height: 8px; background: linear-gradient(90deg, #1e3a8a 0%, #3b82f6 50%, #1e3a8a 100%);"></div>

    <div style="padding: 40px 56px 32px; position: relative;">
      <!-- علامة مائية -->
      <div style="position:absolute; top: 280px; left: 50%; transform: translateX(-50%) rotate(-28deg);
                  font-size: 110px; font-weight: 900; color: rgba(30,58,138,0.04);
                  letter-spacing: 12px; pointer-events: none; user-select: none; white-space: nowrap;">
        موثَّق رقمياً
      </div>

      <!-- الترويسة -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 28px;">
        <div>
          <div style="font-size: 10px; color:#64748b; letter-spacing:3px; font-weight:600;">MASTER PAYLATER · ماستر باي ليتر</div>
          <div style="font-size: 26px; font-weight: 900; color:#1e3a8a; margin-top:6px; line-height:1.2;">إقرار رقمي موثَّق</div>
          <div style="font-size: 11px; color:#475569; margin-top:4px;">Digital Notarized Acknowledgment</div>
        </div>
        <div style="text-align:left; font-size:10px; color:#475569; line-height:1.9;">
          <div><span style="color:#94a3b8;">رقم الإقرار</span> &nbsp;<span style="font-family: 'SF Mono', monospace; font-weight:700; color:#0f172a;">${refNo}</span></div>
          ${applicationCode ? `<div><span style="color:#94a3b8;">طلب التمويل</span> &nbsp;<span style="font-family: 'SF Mono', monospace; font-weight:700; color:#0f172a;">${applicationCode}</span></div>` : ''}
          <div><span style="color:#94a3b8;">حالة الوثيقة</span> &nbsp;<span style="background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:4px; font-weight:700; font-size:9px;">سارية ✓</span></div>
        </div>
      </div>

      <div style="height: 2px; background: linear-gradient(90deg, #1e3a8a, transparent); margin-bottom: 24px;"></div>

      <!-- عنوان الإقرار -->
      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                  border-right: 5px solid #1e3a8a; border-radius: 8px;
                  padding: 18px 22px; margin-bottom: 24px;">
        <div style="font-size: 10px; color:#1e40af; font-weight:700; margin-bottom:6px; letter-spacing:1px;">عنوان الإقرار</div>
        <div style="font-size: 19px; font-weight: 800; color:#0f172a;">${escapeHtml(rec.ack_title || FINANCING_ACK_TITLES_AR[rec.ack_type])}</div>
      </div>

      <!-- بنود الإقرار -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight:800; color:#1e3a8a; margin-bottom: 12px;
                    padding: 8px 14px; background:#f8fafc; border-radius:6px;
                    display:inline-block;">📜 بنود الإقرار المُوقَّع عليها</div>
        <ol style="padding-right: 24px; margin: 0; font-size: 12.5px; color:#1f2937;">
          ${clauses.length > 0
            ? clauses.map((c) => `<li style="margin-bottom: 12px; padding-right: 6px; line-height:1.85;">${escapeHtml(c)}</li>`).join('')
            : '<li style="color:#94a3b8;">لا توجد بنود مسجّلة.</li>'}
        </ol>
      </div>

      <!-- بيانات الموقّع -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px;">
        <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:10px; padding:14px;">
          <div style="font-size: 9px; color:#64748b; margin-bottom:6px; letter-spacing:1px; font-weight:700;">اسم الموقِّع</div>
          <div style="font-size: 15px; font-weight:800; color:#0f172a;">${escapeHtml(rec.signer_name)}</div>
        </div>
        <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:10px; padding:14px;">
          <div style="font-size: 9px; color:#64748b; margin-bottom:6px; letter-spacing:1px; font-weight:700;">تاريخ ووقت التوقيع</div>
          <div style="font-size: 13px; font-weight:700; color:#0f172a;">${fmtDate(rec.signed_at)}</div>
        </div>
        <div style="background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); border:1.5px solid #fde047; border-radius:10px; padding:14px;">
          <div style="font-size: 9px; color:#854d0e; margin-bottom:6px; letter-spacing:1px; font-weight:700;">التوقيع الإلكتروني</div>
          <div style="font-size: 22px; font-weight:800; color:#1e3a8a; font-family: 'Brush Script MT', 'Segoe Script', cursive;">${escapeHtml(rec.signature_text)}</div>
        </div>
        <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:10px; padding:14px;">
          <div style="font-size: 9px; color:#64748b; margin-bottom:6px; letter-spacing:1px; font-weight:700;">معرّف المستخدم</div>
          <div style="font-size: 10px; font-family: 'SF Mono', monospace; color:#334155; word-break: break-all; line-height:1.5;">${rec.user_id}</div>
        </div>
      </div>

      <!-- البصمة الرقمية -->
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius:10px; padding:16px 18px; margin-bottom:14px; color:#ffffff;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="font-size: 11px; font-weight:800; letter-spacing:1px;">🔒 البصمة الرقمية SHA-256</div>
          <div style="font-size: 10px; color:#bfdbfe;">معرّف مختصر: <span style="font-family:monospace; color:#fff; font-weight:700;">${shortHash}</span></div>
        </div>
        <div style="font-family: 'SF Mono', monospace; font-size: 9.5px; color:#dbeafe; word-break: break-all; line-height:1.6; background: rgba(0,0,0,0.2); padding:8px 10px; border-radius:6px;">${rec.evidence_sha256}</div>
      </div>

      ${rec.user_agent ? `
      <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:6px; padding:8px 12px; margin-bottom:14px; font-size:9px; color:#64748b; line-height:1.5;">
        <strong style="color:#334155;">بصمة الجهاز:</strong> ${escapeHtml(rec.user_agent)}
      </div>` : ''}

      <!-- الذيل القانوني -->
      <div style="border-top: 2px solid #1e3a8a; padding-top: 14px; margin-top:18px;">
        <div style="font-size: 10px; color:#475569; text-align: center; line-height:1.8;">
          هذه الوثيقة صادرة آلياً من نظام <strong style="color:#1e3a8a;">Master PayLater</strong> وتُعدّ إقراراً رقمياً موثّقاً ذا حجّية قانونية كاملة وفق
          <br/>نظام التعاملات الإلكترونية السعودي (المرسوم الملكي م/18) ونظام التنفيذ السعودي (م/53).
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:14px; font-size:9px; color:#94a3b8;">
          <div>📅 تاريخ إنشاء الوثيقة: ${fmtDate(new Date().toISOString())}</div>
          <div>للتحقق: استخدم رقم الإقرار <strong style="color:#475569;">${refNo}</strong></div>
        </div>
      </div>
    </div>

    <!-- شريط سفلي -->
    <div style="height: 6px; background: linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%); margin-top: 12px;"></div>
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
