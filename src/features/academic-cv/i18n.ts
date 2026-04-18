import type { CVLanguage } from './types';

export const T = {
  ar: {
    profile: 'النبذة الشخصية',
    education: 'التعليم',
    experience: 'الخبرات',
    projects: 'المشاريع والأبحاث',
    skills: 'المهارات',
    technicalSkills: 'مهارات تقنية',
    softSkills: 'مهارات شخصية',
    languages: 'اللغات',
    courses: 'الدورات والشهادات',
    activities: 'الأنشطة والتطوع',
    references: 'المراجع',
    contact: 'معلومات التواصل',
    present: 'حتى الآن',
    gpa: 'المعدل',
  },
  en: {
    profile: 'Profile',
    education: 'Education',
    experience: 'Experience',
    projects: 'Projects & Research',
    skills: 'Skills',
    technicalSkills: 'Technical Skills',
    softSkills: 'Soft Skills',
    languages: 'Languages',
    courses: 'Courses & Certifications',
    activities: 'Activities & Volunteering',
    references: 'References',
    contact: 'Contact',
    present: 'Present',
    gpa: 'GPA',
  },
} as const;

export const tr = (lang: CVLanguage, key: keyof typeof T.ar) => T[lang][key];
