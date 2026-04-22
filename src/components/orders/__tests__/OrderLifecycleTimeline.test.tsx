import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderLifecycleTimeline } from '../OrderLifecycleTimeline';

describe('OrderLifecycleTimeline — نسبة الإنجاز', () => {
  it('يعرض 100% فوراً عند الانتقال إلى مكتمل حتى لو كانت progress قديمة', () => {
    render(<OrderLifecycleTimeline status="completed" progress={75} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.queryByText('75%')).not.toBeInTheDocument();
  });

  it('يعرض 100% عند مكتمل بدون تمرير progress', () => {
    render(<OrderLifecycleTimeline status="completed" />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('يحسب النسبة من ترتيب المرحلة عند in_progress', () => {
    render(<OrderLifecycleTimeline status="in_progress" progress={0} />);
    // in_progress هي المرحلة 9 من 11 => 82%
    expect(screen.getByText('82%')).toBeInTheDocument();
  });

  it('يحسب النسبة الصحيحة لمرحلة received (1/11 ≈ 9%)', () => {
    render(<OrderLifecycleTimeline status="received" progress={50} />);
    expect(screen.getByText('9%')).toBeInTheDocument();
  });

  it('يعرض حالة الإلغاء بدلاً من شريط النسبة', () => {
    render(<OrderLifecycleTimeline status="cancelled" progress={50} />);
    expect(screen.getByText('تم إلغاء الطلب')).toBeInTheDocument();
    expect(screen.queryByText('100%')).not.toBeInTheDocument();
  });

  it('يعرض اسم المرحلة الحالية: مكتمل', () => {
    render(<OrderLifecycleTimeline status="completed" progress={100} />);
    // يظهر اسم المرحلة في رأس البطاقة
    expect(screen.getAllByText('مكتمل').length).toBeGreaterThan(0);
  });
});
