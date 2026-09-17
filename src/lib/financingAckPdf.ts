// مولّد PDF رسمي لإقرارات التمويل — تصميم بنكي رسمي مع دعم كامل للعربية
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '@/data/legacy/client';
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
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
  } catch { return iso; }
};

function escapeHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// عرض البنود مع معالجة الحالات القديمة (r1, r2...) كرسالة بديلة
function renderClause(c: string, idx: number): string {
  const looksLikeId = /^[a-z]\d{1,3}$/i.test(c.trim());
  if (looksLikeId) {
    return `<div style="display:flex; gap:12px; padding:10px 0; border-bottom:1px solid #f1f5f9;">
      <div style="flex-shrink:0; width:26px; height:26px; background:#1e3a8a; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px;">${idx + 1}</div>
      <div style="flex:1; color:#64748b; font-size:12px; padding-top:4px;">بند موثَّق برقم مرجعي <strong style="color:#0f172a; font-family:monospace;">${escapeHtml(c)}</strong> (سجلّ سابق)</div>
    </div>`;
  }
  return `<div style="display:flex; gap:12px; padding:12px 0; border-bottom:1px solid #f1f5f9;">
    <div style="flex-shrink:0; width:26px; height:26px; background:#1e3a8a; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px;">${idx + 1}</div>
    <div style="flex:1; color:#1f2937; font-size:13px; line-height:1.9; text-align:justify;">${escapeHtml(c)}</div>
  </div>`;
}

function buildHtml(rec: AckRecord, applicationCode?: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.dir = 'rtl';
  wrapper.lang = 'ar';
  // استخدام خطوط النظام الموثوقة لتجنّب كسر النصوص العربية
  wrapper.style.cssText = `
    width: 794px; padding: 0; background: #ffffff; color: #0f172a;
    font-family: "Tahoma", "Arial", "Segoe UI", sans-serif;
    line-height: 1.7; box-sizing: border-box; position: fixed;
    top: -20000px; right: 0; overflow: hidden;
    -webkit-font-smoothing: antialiased;
  `;

  const clauses = Array.isArray(rec.accepted_clauses) ? rec.accepted_clauses : [];
  const refNo = rec.id.slice(0, 8).toUpperCase();
  const shortHash = rec.evidence_sha256.slice(0, 16).toUpperCase();
  const title = rec.ack_title || FINANCING_ACK_TITLES_AR[rec.ack_type];

  wrapper.innerHTML = `
    <!-- شريط علوي رسمي -->
    <div style="background:#1e3a8a; padding:24px 48px; color:#ffffff;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:11px; color:#bfdbfe; letter-spacing:2px; margin-bottom:4px;">FEKRAHEDU PAYLATER</div>
          <div style="font-size:22px; font-weight:700;">فكرة باي ليتر</div>
        </div>
        <div style="text-align:left;">
          <div style="font-size:11px; color:#bfdbfe; margin-bottom:4px;">DIGITAL ACKNOWLEDGMENT</div>
          <div style="font-size:14px; font-weight:600;">إقرار رقمي موثَّق</div>
        </div>
      </div>
    </div>

    <!-- معلومات الوثيقة -->
    <div style="background:#f8fafc; padding:16px 48px; border-bottom:1px solid #e2e8f0;">
      <table style="width:100%; border-collapse:collapse; font-size:12px;">
        <tr>
          <td style="padding:4px 0; color:#64748b; width:30%;">رقم المرجع</td>
          <td style="padding:4px 0; color:#0f172a; font-weight:600; font-family:monospace;">${refNo}</td>
          <td style="padding:4px 0; color:#64748b; width:25%;">حالة الوثيقة</td>
          <td style="padding:4px 0;"><span style="background:#dcfce7; color:#15803d; padding:3px 10px; border-radius:4px; font-weight:700; font-size:10px;">سارية وموثَّقة</span></td>
        </tr>
        ${applicationCode ? `<tr>
          <td style="padding:4px 0; color:#64748b;">رقم طلب التمويل</td>
          <td style="padding:4px 0; color:#0f172a; font-weight:600; font-family:monospace;" colspan="3">${escapeHtml(applicationCode)}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:4px 0; color:#64748b;">تاريخ الإصدار</td>
          <td style="padding:4px 0; color:#0f172a;" colspan="3">${fmtDate(new Date().toISOString())}</td>
        </tr>
      </table>
    </div>

    <!-- المحتوى الرئيسي -->
    <div style="padding:32px 48px;">
      <!-- عنوان الإقرار -->
      <div style="text-align:center; margin-bottom:28px;">
        <div style="font-size:11px; color:#1e3a8a; letter-spacing:3px; margin-bottom:8px; font-weight:600;">عنوان الإقرار</div>
        <div style="font-size:22px; font-weight:700; color:#0f172a; padding-bottom:14px; border-bottom:3px double #1e3a8a; display:inline-block; padding-left:24px; padding-right:24px;">${escapeHtml(title)}</div>
      </div>

      <!-- بنود الإقرار -->
      <div style="margin-bottom:28px;">
        <div style="background:#1e3a8a; color:#fff; padding:10px 16px; font-size:13px; font-weight:700; border-radius:6px 6px 0 0;">
          بنود الإقرار الموقَّع عليها
        </div>
        <div style="border:1px solid #e2e8f0; border-top:none; border-radius:0 0 6px 6px; padding:8px 18px; background:#ffffff;">
          ${clauses.length > 0
            ? clauses.map((c, i) => renderClause(c, i)).join('')
            : '<div style="padding:20px; text-align:center; color:#94a3b8; font-size:12px;">لا توجد بنود مسجّلة لهذا الإقرار.</div>'}
        </div>
      </div>

      <!-- بيانات التوقيع -->
      <div style="margin-bottom:24px;">
        <div style="background:#1e3a8a; color:#fff; padding:10px 16px; font-size:13px; font-weight:700; border-radius:6px 6px 0 0;">
          بيانات التوقيع
        </div>
        <table style="width:100%; border-collapse:collapse; border:1px solid #e2e8f0; border-top:none; border-radius:0 0 6px 6px; font-size:12px;">
          <tr>
            <td style="padding:12px 16px; background:#f8fafc; color:#64748b; width:30%; border-bottom:1px solid #f1f5f9;">اسم الموقِّع</td>
            <td style="padding:12px 16px; color:#0f172a; font-weight:600; border-bottom:1px solid #f1f5f9;">${escapeHtml(rec.signer_name)}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px; background:#f8fafc; color:#64748b; border-bottom:1px solid #f1f5f9;">التوقيع الإلكتروني</td>
            <td style="padding:12px 16px; color:#1e3a8a; font-weight:700; font-size:16px; border-bottom:1px solid #f1f5f9;">${escapeHtml(rec.signature_text)}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px; background:#f8fafc; color:#64748b; border-bottom:1px solid #f1f5f9;">تاريخ ووقت التوقيع</td>
            <td style="padding:12px 16px; color:#0f172a; border-bottom:1px solid #f1f5f9;">${fmtDate(rec.signed_at)}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px; background:#f8fafc; color:#64748b;">معرّف المستخدم</td>
            <td style="padding:12px 16px; color:#475569; font-family:monospace; font-size:10px; word-break:break-all;">${rec.user_id}</td>
          </tr>
        </table>
      </div>

      <!-- البصمة الرقمية -->
      <div style="background:#0f172a; color:#fff; padding:16px 20px; border-radius:6px; margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div style="font-size:12px; font-weight:700;">البصمة الرقمية SHA-256</div>
          <div style="font-size:10px; color:#94a3b8;">المعرّف المختصر: <span style="color:#fff; font-family:monospace; font-weight:700;">${shortHash}</span></div>
        </div>
        <div style="font-family:monospace; font-size:10px; color:#cbd5e1; word-break:break-all; background:rgba(255,255,255,0.05); padding:10px 12px; border-radius:4px; line-height:1.6;">${rec.evidence_sha256}</div>
      </div>

      ${rec.user_agent ? `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; padding:10px 14px; margin-bottom:20px; font-size:10px; color:#64748b;">
        <strong style="color:#334155;">بصمة الجهاز:</strong> ${escapeHtml(rec.user_agent)}
      </div>` : ''}

      <!-- مربع التوثيق القانوني -->
      <div style="border:2px solid #1e3a8a; border-radius:6px; padding:16px; background:#f0f9ff;">
        <div style="font-size:12px; font-weight:700; color:#1e3a8a; margin-bottom:8px; text-align:center;">شهادة التوثيق الإلكتروني</div>
        <div style="font-size:11px; color:#334155; line-height:1.9; text-align:justify;">
          هذه الوثيقة صادرة آلياً من نظام <strong>فكرة باي ليتر</strong> وتُعدّ إقراراً رقمياً موثَّقاً ذا حجّية قانونية كاملة وفق نظام التعاملات الإلكترونية السعودي الصادر بالمرسوم الملكي رقم (م/18) ونظام التنفيذ السعودي رقم (م/53). يمكن التحقق من صحة هذه الوثيقة عبر مطابقة البصمة الرقمية SHA-256 المدوّنة أعلاه مع السجل المحفوظ في قاعدة البيانات.
        </div>
      </div>
    </div>

    <!-- ذيل رسمي -->
    <div style="background:#1e3a8a; color:#bfdbfe; padding:14px 48px; font-size:10px; display:flex; justify-content:space-between;">
      <div>© فكرة باي ليتر — جميع الحقوق محفوظة</div>
      <div>وثيقة رقم ${refNo}</div>
    </div>
  `;
  return wrapper;
}

export async function downloadAcknowledgmentPdf(params: {
  applicationId: string;
  ackType: FinancingAcknowledgmentType;
  applicationCode?: string;
  userId?: string;
}) {
  const { applicationId, ackType, applicationCode, userId } = params;

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
    if ((document as any).fonts?.ready) {
      try { await (document as any).fonts.ready; } catch { /* ignore */ }
    }
    // مهلة قصيرة لضمان تشكيل النص العربي
    await new Promise((r) => setTimeout(r, 150));

    const canvas = await html2canvas(node, {
      scale: 2.5,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      letterRendering: true,
      allowTaint: false,
    } as any);

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    const pageW = pdf.internal.pageSize.getWidth();   // 210mm
    const pageH = pdf.internal.pageSize.getHeight();  // 297mm
    const margin = 0; // التصميم يتضمن padding داخلي

    const imgW = pageW - margin * 2;
    const imgH = (canvas.height * imgW) / canvas.width;

    if (imgH <= pageH) {
      pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', margin, margin, imgW, imgH, undefined, 'FAST');
    } else {
      // تقسيم على عدة صفحات بسلاسة
      const pageHeightPx = (pageH * canvas.width) / imgW;
      let renderedHeight = 0;
      let pageNum = 0;
      while (renderedHeight < canvas.height) {
        const sliceHeight = Math.min(pageHeightPx, canvas.height - renderedHeight);
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, renderedHeight, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
        }
        if (pageNum > 0) pdf.addPage();
        const sliceImgH = (sliceHeight * imgW) / canvas.width;
        pdf.addImage(pageCanvas.toDataURL('image/png', 1.0), 'PNG', margin, margin, imgW, sliceImgH, undefined, 'FAST');
        renderedHeight += sliceHeight;
        pageNum++;
      }
    }

    const codePart = applicationCode || applicationId.slice(0, 8);
    pdf.save(`acknowledgment-${ackType}-${codePart}.pdf`);
  } finally {
    document.body.removeChild(node);
  }
}
