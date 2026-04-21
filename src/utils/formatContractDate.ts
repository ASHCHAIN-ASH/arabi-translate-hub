/**
 * Unified Arabic date formatter for contract pages (services + research).
 * Uses ar-SA locale with a stable, fully-Arabic long format:
 *   "١٤ شعبان ١٤٤٧ هـ" (or Gregorian fallback "١٤ نوفمبر ٢٠٢٥").
 *
 * Keep all contract headers consistent — never call toLocaleDateString
 * inline for header dates; import this helper instead.
 */

const HEADER_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const HEADER_DATETIME_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

const safeDate = (input: string | number | Date | null | undefined): Date | null => {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(d.getTime()) ? null : d;
};

/** Header date — e.g. "١٤ نوفمبر ٢٠٢٥". Returns "—" when missing/invalid. */
export const formatContractHeaderDate = (input: string | number | Date | null | undefined): string => {
  const d = safeDate(input);
  if (!d) return '—';
  try {
    return new Intl.DateTimeFormat('ar-SA', HEADER_DATE_OPTIONS).format(d);
  } catch {
    return d.toLocaleDateString('ar-SA', HEADER_DATE_OPTIONS);
  }
};

/** Header date+time — for timeline / signed_at fields. */
export const formatContractHeaderDateTime = (input: string | number | Date | null | undefined): string => {
  const d = safeDate(input);
  if (!d) return '—';
  try {
    return new Intl.DateTimeFormat('ar-SA', HEADER_DATETIME_OPTIONS).format(d);
  } catch {
    return d.toLocaleString('ar-SA', HEADER_DATETIME_OPTIONS);
  }
};
