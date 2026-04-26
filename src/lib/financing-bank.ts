// Master PayLater — Bank account for manual transfers
// IBAN ثابت للتحويلات اليدوية (الدفعة الأولى)
export const MASTER_PAYLATER_BANK = {
  bankName: 'البنك الأهلي السعودي (SNB)',
  beneficiaryName: 'منصة ماستر للخدمات الأكاديمية',
  iban: 'SA0000000000000000000000',
  accountNumber: '00000000000000',
  swift: 'NCBKSAJE',
} as const;

export const FINANCING_TEAMS = {
  followup: 'فريق المتابعة',
  credit: 'فريق الائتمان',
  funding: 'فريق التمويل',
  unified: 'فريق التمويل والائتمان والمتابعة',
  contact: '+966 50 077 6343',
  contactSecondary: '+966 55 960 0824',
  whatsappPrimary: '966500776343',
  whatsappSecondary: '966559600824',
  email: 'info@masteredupath.com',
} as const;
