// FekrahEdu PayLater — Bank account for manual transfers
// IBAN ثابت للتحويلات اليدوية (الدفعة الأولى)
export const FEKRAHEDU_PAYLATER_BANK = {
  bankName: 'البنك الأهلي السعودي (SNB)',
  beneficiaryName: 'FekrahEdu',
  iban: 'SA0000000000000000000000',
  accountNumber: '00000000000000',
  swift: 'NCBKSAJE',
} as const;

export const FINANCING_TEAMS = {
  followup: 'فريق المتابعة',
  credit: 'فريق الائتمان',
  funding: 'فريق التمويل',
  unified: 'فريق التمويل والائتمان والمتابعة',
  contact: '+966593799355',
  whatsappPrimary: '966593799355',
  email: 'info@fekrahedu.com',
} as const;
