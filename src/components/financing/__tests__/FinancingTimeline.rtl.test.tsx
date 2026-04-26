import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FinancingTimeline } from '../FinancingTimeline';

describe('FinancingTimeline — ترتيب المراحل في واجهة RTL', () => {
  const renderRtl = (status: string) =>
    render(
      <div dir="rtl">
        <FinancingTimeline currentStatus={status} />
      </div>
    );

  it('يعرض جميع مراحل التمويل بالترتيب الصحيح', () => {
    renderRtl('submitted');
    const labels = [
      'استلام الطلب',
      'التقييم الائتماني',
      'سداد الدفعة الأولى',
      'الموافقة النهائية',
      'تفعيل الرصيد',
    ];
    labels.forEach((l) => expect(screen.getByText(l)).toBeInTheDocument());
  });

  it('🛡️ "تفعيل الرصيد" يظهر بعد "الموافقة النهائية" في DOM order', () => {
    const { container } = renderRtl('active');
    const html = container.innerHTML;
    const idxApproval = html.indexOf('الموافقة النهائية');
    const idxActive = html.indexOf('تفعيل الرصيد');
    expect(idxApproval).toBeGreaterThan(-1);
    expect(idxActive).toBeGreaterThan(-1);
    // تفعيل الرصيد يأتي بعد الموافقة في ترتيب DOM (الذي يُعرض بصرياً يميناً→يساراً في RTL)
    expect(idxActive).toBeGreaterThan(idxApproval);
  });

  it('يحافظ على اتجاه RTL في الحاوية الأم', () => {
    const { container } = renderRtl('approved');
    const rtlWrapper = container.querySelector('[dir="rtl"]');
    expect(rtlWrapper).not.toBeNull();
  });

  it('عند الحالة rejected تظهر شارة "تم الإلغاء"', () => {
    renderRtl('rejected');
    expect(screen.getByText('تم الإلغاء')).toBeInTheDocument();
  });
});
