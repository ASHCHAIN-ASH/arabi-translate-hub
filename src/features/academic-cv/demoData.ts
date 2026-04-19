import type { CVData } from './types';

const uid = (n: string) => `demo-${n}-${Math.random().toString(36).slice(2, 6)}`;

export const DEMO_CV_AR: CVData = {
  personal: {
    fullName: 'د. سارة عبدالله الشهري',
    jobTitle: 'باحثة دكتوراه في علم البيانات الصحية',
    email: 'sara.alshehri@research.edu',
    phone: '+966 50 123 4567',
    city: 'الرياض',
    country: 'السعودية',
    linkedin: 'linkedin.com/in/sara-alshehri',
    website: 'sara-research.com',
    photoUrl: '',
    summary:
      'باحثة دكتوراه متخصصة في تحليل البيانات الصحية باستخدام الذكاء الاصطناعي، مع 6 سنوات من الخبرة في النشر العلمي وقيادة المشاريع البحثية. حاصلة على منحة الملك سلمان للتميّز البحثي 2023، ولديّ 12 ورقة محكّمة في مجلات Q1.',
  },
  education: [
    { id: uid('e1'), institution: 'جامعة الملك سعود', degree: 'دكتوراه', field: 'علم البيانات الصحية', gpa: '4.92 / 5', startDate: '2021', endDate: 'حتى الآن', description: 'موضوع الأطروحة: نماذج التعلم العميق للتنبؤ المبكر بأمراض القلب.' },
    { id: uid('e2'), institution: 'جامعة الملك عبدالعزيز', degree: 'ماجستير', field: 'الإحصاء الحيوي', gpa: '4.85 / 5', startDate: '2018', endDate: '2021', description: 'مع مرتبة الشرف الأولى — رسالة الماجستير نُشرت في Nature Scientific Reports.' },
  ],
  experience: [
    { id: uid('x1'), company: 'مركز الملك فيصل للأبحاث', role: 'باحث رئيسي', startDate: '2022', endDate: 'حتى الآن', description: 'قيادة فريق بحثي مكوّن من 8 باحثين — مسؤولة عن مشروع تحليل بيانات 50,000 مريض، نتج عنه 4 أوراق محكّمة وتطبيق سريري عملي.' },
    { id: uid('x2'), company: 'وزارة الصحة', role: 'محلل بيانات أول', startDate: '2020', endDate: '2022', description: 'تطوير لوحات معلومات تفاعلية لمتابعة المؤشرات الوبائية على مستوى المملكة، مع توفير توصيات استراتيجية للقيادة.' },
  ],
  projects: [
    { id: uid('p1'), name: 'منصّة "صحّتي" للتنبؤ بالأمراض المزمنة', description: 'منصّة مبنيّة على الذكاء الاصطناعي تتنبّأ بمخاطر السكري قبل 3 سنوات بدقة 87%.', date: '2024', link: '' },
    { id: uid('p2'), name: 'مراجعة منهجية: AI in Healthcare', description: 'مراجعة منهجية شاملة لـ 142 ورقة بحثية حول تطبيقات الذكاء الاصطناعي في الرعاية الصحية، نُشرت في BMJ.', date: '2023', link: '' },
  ],
  skills: {
    technical: ['Python', 'R', 'SPSS', 'TensorFlow', 'SQL', 'Power BI', 'LaTeX', 'Tableau'],
    soft: ['القيادة', 'إدارة المشاريع', 'العرض العلمي', 'التفكير النقدي', 'العمل الجماعي'],
    languages: ['العربية (لغة أم)', 'الإنجليزية (متقدم — IELTS 8.0)', 'الفرنسية (متوسط)'],
  },
  courses: [
    { id: uid('c1'), name: 'Deep Learning Specialization', issuer: 'Coursera — Stanford', date: '2023' },
    { id: uid('c2'), name: 'Advanced Statistical Modeling', issuer: 'Harvard X', date: '2022' },
    { id: uid('c3'), name: 'GCP Professional Data Engineer', issuer: 'Google Cloud', date: '2024' },
  ],
  activities: [
    { id: uid('a1'), name: 'متطوّعة في جمعية البحث العلمي السعودية', description: 'تنظيم ورش عمل لطلاب الدراسات العليا حول كتابة الأبحاث.' },
    { id: uid('a2'), name: 'محكّمة في 3 مجلات علمية', description: 'IEEE Access · Healthcare Analytics · Saudi Medical Journal.' },
  ],
  references: '',
};

export const DEMO_CV_EN: CVData = {
  personal: {
    fullName: 'Dr. Sarah A. Alshehri',
    jobTitle: 'PhD Researcher — Health Data Science',
    email: 'sara.alshehri@research.edu',
    phone: '+966 50 123 4567',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    linkedin: 'linkedin.com/in/sara-alshehri',
    website: 'sara-research.com',
    photoUrl: '',
    summary:
      'PhD researcher specializing in health data analytics using AI, with 6+ years of experience in scientific publishing and leading research projects. Recipient of the King Salman Research Excellence Grant (2023) with 12 peer-reviewed Q1 publications.',
  },
  education: [
    { id: uid('e1'), institution: 'King Saud University', degree: 'PhD', field: 'Health Data Science', gpa: '4.92 / 5', startDate: '2021', endDate: 'Present', description: 'Thesis: Deep learning models for early cardiovascular disease prediction.' },
    { id: uid('e2'), institution: 'King Abdulaziz University', degree: 'MSc', field: 'Biostatistics', gpa: '4.85 / 5', startDate: '2018', endDate: '2021', description: 'First Class Honors — thesis published in Nature Scientific Reports.' },
  ],
  experience: [
    { id: uid('x1'), company: 'King Faisal Research Center', role: 'Principal Investigator', startDate: '2022', endDate: 'Present', description: 'Leading a team of 8 researchers on a 50,000-patient study, producing 4 peer-reviewed papers and a clinical application.' },
    { id: uid('x2'), company: 'Ministry of Health', role: 'Senior Data Analyst', startDate: '2020', endDate: '2022', description: 'Developed nationwide interactive dashboards for epidemiological indicators with strategic recommendations to leadership.' },
  ],
  projects: [
    { id: uid('p1'), name: '"Sehati" Platform — Chronic Disease Prediction', description: 'AI-powered platform predicting diabetes risk 3 years in advance with 87% accuracy.', date: '2024', link: '' },
    { id: uid('p2'), name: 'Systematic Review: AI in Healthcare', description: 'Comprehensive systematic review of 142 papers on AI healthcare applications, published in BMJ.', date: '2023', link: '' },
  ],
  skills: {
    technical: ['Python', 'R', 'SPSS', 'TensorFlow', 'SQL', 'Power BI', 'LaTeX', 'Tableau'],
    soft: ['Leadership', 'Project Management', 'Scientific Presentation', 'Critical Thinking', 'Teamwork'],
    languages: ['Arabic (Native)', 'English (Advanced — IELTS 8.0)', 'French (Intermediate)'],
  },
  courses: [
    { id: uid('c1'), name: 'Deep Learning Specialization', issuer: 'Coursera — Stanford', date: '2023' },
    { id: uid('c2'), name: 'Advanced Statistical Modeling', issuer: 'Harvard X', date: '2022' },
    { id: uid('c3'), name: 'GCP Professional Data Engineer', issuer: 'Google Cloud', date: '2024' },
  ],
  activities: [
    { id: uid('a1'), name: 'Volunteer — Saudi Scientific Research Society', description: 'Organizing workshops for graduate students on academic writing.' },
    { id: uid('a2'), name: 'Reviewer in 3 scientific journals', description: 'IEEE Access · Healthcare Analytics · Saudi Medical Journal.' },
  ],
  references: '',
};
