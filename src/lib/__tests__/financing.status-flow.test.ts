import { describe, it, expect } from 'vitest';
import {
  validateFinancingStatusTransition,
  FINANCING_STATUS_SEQUENCE,
} from '@/lib/financing';

describe('validateFinancingStatusTransition — تسلسل حالات التمويل', () => {
  it('يسمح بالتقدّم خطوة واحدة في المسار الرسمي', () => {
    expect(validateFinancingStatusTransition('submitted', 'documents_pending').ok).toBe(true);
    expect(validateFinancingStatusTransition('approved', 'execution_deed').ok).toBe(true);
    expect(validateFinancingStatusTransition('execution_deed', 'active').ok).toBe(true);
  });

  it('⛔ يمنع تفعيل الرصيد قبل صدور السند التنفيذي', () => {
    const r1 = validateFinancingStatusTransition('approved', 'active');
    expect(r1.ok).toBe(false);
    expect(r1.reason).toMatch(/السند التنفيذي/);

    const r2 = validateFinancingStatusTransition('waiting_down_payment', 'active');
    expect(r2.ok).toBe(false);

    const r3 = validateFinancingStatusTransition('submitted', 'active');
    expect(r3.ok).toBe(false);
  });

  it('⛔ يمنع الانتقال إلى completed قبل execution_deed', () => {
    const r = validateFinancingStatusTransition('approved', 'completed');
    expect(r.ok).toBe(false);
  });

  it('يضمن أن execution_deed يسبق active في التسلسل الرسمي', () => {
    const seq = FINANCING_STATUS_SEQUENCE as readonly string[];
    expect(seq.indexOf('execution_deed')).toBeLessThan(seq.indexOf('active'));
  });

  it('يمنع القفز فوق المراحل ويذكر المراحل المفقودة', () => {
    const r = validateFinancingStatusTransition('submitted', 'execution_deed');
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/لا يمكن القفز/);
  });

  it('يسمح بالرجوع خطوة واحدة لتصحيح الإدخال', () => {
    expect(validateFinancingStatusTransition('under_review', 'documents_pending').ok).toBe(true);
    expect(validateFinancingStatusTransition('execution_deed', 'approved').ok).toBe(true);
  });

  it('يمنع الرجوع لأكثر من خطوة واحدة', () => {
    const r = validateFinancingStatusTransition('execution_deed', 'submitted');
    expect(r.ok).toBe(false);
  });

  it('يسمح بالمسارات الاستثنائية من أي حالة', () => {
    expect(validateFinancingStatusTransition('submitted', 'rejected').ok).toBe(true);
    expect(validateFinancingStatusTransition('approved', 'cancelled').ok).toBe(true);
    expect(validateFinancingStatusTransition('active', 'overdue').ok).toBe(true);
  });

  it('يسمح بإعادة فتح طلب من حالة استثنائية إلى submitted/under_review فقط', () => {
    expect(validateFinancingStatusTransition('rejected', 'submitted').ok).toBe(true);
    expect(validateFinancingStatusTransition('cancelled', 'under_review').ok).toBe(true);
    expect(validateFinancingStatusTransition('rejected', 'active').ok).toBe(false);
    expect(validateFinancingStatusTransition('overdue', 'execution_deed').ok).toBe(false);
  });

  it('يرفض الحالات غير المعروفة', () => {
    const r = validateFinancingStatusTransition('submitted', 'unknown_status');
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/غير معروفة/);
  });

  it('يسمح بنفس الحالة (no-op)', () => {
    expect(validateFinancingStatusTransition('approved', 'approved').ok).toBe(true);
  });

  it('🛡️ سيناريو شامل: لا يمكن أبداً الوصول إلى active دون المرور على execution_deed', () => {
    const seq = FINANCING_STATUS_SEQUENCE as readonly string[];
    // جرّب كل حالة قبل execution_deed وتأكد أنها لا تستطيع القفز إلى active
    const deedIdx = seq.indexOf('execution_deed');
    for (let i = 0; i < deedIdx; i++) {
      const from = seq[i];
      const r = validateFinancingStatusTransition(from, 'active');
      expect(r.ok, `يجب أن يُرفض الانتقال من ${from} إلى active`).toBe(false);
    }
    // فقط من execution_deed يُسمح
    expect(validateFinancingStatusTransition('execution_deed', 'active').ok).toBe(true);
  });
});
