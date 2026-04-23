-- Backfill financing metadata on existing financing contracts so the contract viewer
-- can re-render the rich legal template with correct down payment, monthly installment, etc.
UPDATE public.contracts c
SET metadata = COALESCE(c.metadata, '{}'::jsonb) || jsonb_build_object(
  'application_id', fa.id::text,
  'source', 'financing',
  'down_payment', fa.down_payment,
  'monthly_installment', fa.monthly_installment,
  'duration_months', fa.duration_months,
  'financing', jsonb_build_object(
    'financedAmount', fa.total_amount,
    'downPayment', fa.down_payment,
    'monthlyInstallment', fa.monthly_installment,
    'durationMonths', fa.duration_months,
    'firstInstallmentDate', to_char((now() + interval '30 days')::date, 'YYYY-MM-DD'),
    'applicationId', fa.id::text
  )
)
FROM public.financing_applications fa
WHERE c.template_type = 'financing'
  AND c.user_id = fa.user_id
  AND ROUND(c.total_amount::numeric, 2) = ROUND(fa.total_amount::numeric, 2)
  AND (c.metadata IS NULL OR c.metadata->'financing' IS NULL);

-- Force regeneration on next view by clearing cached content (the app re-builds from template + metadata)
UPDATE public.contracts
SET content = NULL
WHERE template_type = 'financing';