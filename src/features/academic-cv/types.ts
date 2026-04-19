export type CVLanguage = 'ar' | 'en';
export type CVTemplate = 'minimal' | 'modern' | 'elegant' | 'clean' | 'compact' | 'creative';

export interface CVPersonal {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  linkedin?: string;
  website?: string;
  photoUrl?: string;
  summary: string;
}

export type EducationLevel =
  | 'high_school'
  | 'diploma'
  | 'bachelor'
  | 'master'
  | 'phd'
  | 'other';

export interface CVEducation {
  id: string;
  level?: EducationLevel;
  institution: string;
  degree: string;
  field: string;
  gpa?: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface CVExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CVProject {
  id: string;
  name: string;
  description: string;
  date?: string;
  link?: string;
}

export interface CVCourse {
  id: string;
  name: string;
  issuer: string;
  date?: string;
}

export interface CVActivity {
  id: string;
  name: string;
  description?: string;
}

export interface CVSkills {
  technical: string[];
  soft: string[];
  languages: string[];
}

export interface CVData {
  personal: CVPersonal;
  education: CVEducation[];
  experience: CVExperience[];
  projects: CVProject[];
  skills: CVSkills;
  courses: CVCourse[];
  activities: CVActivity[];
  references?: string;
}

export const EMPTY_CV: CVData = {
  personal: {
    fullName: '', jobTitle: '', email: '', phone: '',
    city: '', country: '', linkedin: '', website: '', photoUrl: '', summary: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: { technical: [], soft: [], languages: [] },
  courses: [],
  activities: [],
  references: '',
};

export interface AcademicCVRow {
  id: string;
  user_id: string;
  title: string;
  language: CVLanguage;
  template_key: CVTemplate;
  data: CVData;
  status: 'draft' | 'pending_payment' | 'paid' | 'archived';
  exports_count: number;
  last_exported_at: string | null;
  // Purchase-lock fields (server-managed)
  locked_template_key: CVTemplate | null;
  paid_at: string | null;
  paid_amount: number | null;
  template_swap_used: boolean;
  template_swap_deadline: string | null;
  purchase_id: string | null;
  created_at: string;
  updated_at: string;
}
