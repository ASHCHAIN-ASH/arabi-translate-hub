/**
 * يفرض استخدام الأرقام اللاتينية (الإنجليزية) في جميع عمليات التنسيق
 * عبر اعتراض toLocaleString و Intl.NumberFormat / Intl.DateTimeFormat
 * عند تمرير locale عربي، يتم استبداله بـ "ar-u-nu-latn" الذي يحافظ على
 * الصياغة العربية لكن مع أرقام لاتينية.
 */

const ARABIC_DIGITS_RE = /[\u0660-\u0669\u06F0-\u06F9]/g;
const DIGIT_MAP: Record<string, string> = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
  '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
};

const toLatinDigits = (s: string): string =>
  s.replace(ARABIC_DIGITS_RE, (d) => DIGIT_MAP[d] ?? d);

const normalizeLocale = (locale: any): any => {
  if (!locale) return 'en-US';
  if (typeof locale === 'string') {
    if (locale.startsWith('ar')) {
      return locale.includes('-u-nu-') ? locale : `${locale}-u-nu-latn`;
    }
    return locale;
  }
  if (Array.isArray(locale)) return locale.map(normalizeLocale);
  return locale;
};

export function installLatinDigitsEnforcer() {
  // Number.prototype.toLocaleString
  const origNumToLocale = Number.prototype.toLocaleString;
  Number.prototype.toLocaleString = function (locales?: any, options?: any) {
    const result = origNumToLocale.call(this, normalizeLocale(locales), options);
    return toLatinDigits(result);
  };

  // Date.prototype.toLocaleString / toLocaleDateString / toLocaleTimeString
  const origDateLocale = Date.prototype.toLocaleString;
  Date.prototype.toLocaleString = function (locales?: any, options?: any) {
    const r = origDateLocale.call(this, normalizeLocale(locales), options);
    return toLatinDigits(r);
  };
  const origDateDate = Date.prototype.toLocaleDateString;
  Date.prototype.toLocaleDateString = function (locales?: any, options?: any) {
    const r = origDateDate.call(this, normalizeLocale(locales), options);
    return toLatinDigits(r);
  };
  const origDateTime = Date.prototype.toLocaleTimeString;
  Date.prototype.toLocaleTimeString = function (locales?: any, options?: any) {
    const r = origDateTime.call(this, normalizeLocale(locales), options);
    return toLatinDigits(r);
  };

  // Intl.NumberFormat
  const OrigNumberFormat = Intl.NumberFormat;
  // @ts-ignore
  Intl.NumberFormat = function (locales?: any, options?: any) {
    const inst = new OrigNumberFormat(normalizeLocale(locales), options);
    const origFormat = inst.format.bind(inst);
    inst.format = (v: number) => toLatinDigits(origFormat(v));
    return inst;
  } as any;
  (Intl.NumberFormat as any).prototype = OrigNumberFormat.prototype;
  // @ts-ignore
  Intl.NumberFormat.supportedLocalesOf = OrigNumberFormat.supportedLocalesOf;

  // Intl.DateTimeFormat
  const OrigDTF = Intl.DateTimeFormat;
  // @ts-ignore
  Intl.DateTimeFormat = function (locales?: any, options?: any) {
    const inst = new OrigDTF(normalizeLocale(locales), options);
    const origFormat = inst.format.bind(inst);
    inst.format = (v?: Date | number) => toLatinDigits(origFormat(v));
    return inst;
  } as any;
  (Intl.DateTimeFormat as any).prototype = OrigDTF.prototype;
  // @ts-ignore
  Intl.DateTimeFormat.supportedLocalesOf = OrigDTF.supportedLocalesOf;
}
