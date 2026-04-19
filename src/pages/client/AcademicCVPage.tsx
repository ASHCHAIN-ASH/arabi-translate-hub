import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowRight, FileText, Languages, LayoutTemplate,
  User, GraduationCap, Briefcase, Lightbulb, Wrench, Award, HeartHandshake,
  Plus, Trash2, Eye, Download, Printer, Loader2, Crown, Sparkles, Check, Wand2,
} from 'lucide-react';
import { TemplateThumbnail } from '@/features/academic-cv/TemplateThumbnail';
import { DEMO_CV_AR, DEMO_CV_EN } from '@/features/academic-cv/demoData';
import ClientLayout from '@/components/client/ClientLayout';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useUserMembership } from '@/hooks/useMembership';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { useMyCV } from '@/features/academic-cv/useCv';
import { CVRenderer, TEMPLATES_META } from '@/features/academic-cv/templates';
import type { CVData, CVEducation, CVExperience, CVProject, CVCourse, CVActivity, CVTemplate } from '@/features/academic-cv/types';
import { exportNodeToPdf, printNode } from '@/features/academic-cv/exportPdf';

const uid = () => Math.random().toString(36).slice(2, 10);

const EXPORT_PRICE = 15;

const AcademicCVPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { membership } = useUserMembership();
  const { cv, loading, updateData, setLanguage, setTemplate, setTitle, purchaseExport } = useMyCV(user?.id);

  const previewRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<'personal' | 'education' | 'experience' | 'projects' | 'skills' | 'courses' | 'activities'>('personal');
  const [exporting, setExporting] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const lang = cv?.language ?? 'ar';
  const data: CVData | null = cv?.data ?? null;
  const isMember = !!membership;
  const alreadyPaid = cv?.status === 'paid';
  const needsPayment = !isMember && !alreadyPaid;

  // Full bilingual UI strings
  const T = lang === 'ar' ? {
    back: 'الرجوع', title: 'CV الأكاديمي الذكي',
    subtitle: 'صمّم سيرتك بقالب احترافي — حمّلها واطبعها مباشرة',
    print: 'طباعة', download: 'تحميل PDF', downloadPaid: `تحميل (${EXPORT_PRICE} ر.س)`,
    cvTitle: 'عنوان السيرة', placeholderTitle: 'سيرتي الذاتية', language: 'اللغة',
    freeMember: 'تصدير مجاني (عضو)', paidDone: 'تم الدفع — تحميل غير محدود',
    exportPrice: `تصدير: ${EXPORT_PRICE} ر.س`, pickTemplate: 'اختر قالباً واحداً',
    templateHint: '— يمكنك التبديل في أي وقت، وستُطبَّق نفس البيانات',
    livePreview: 'معاينة مباشرة', tryDemo: 'تعبئة بيانات تجريبية',
    demoFilled: 'تم تعبئة بيانات تجريبية — جرّب القوالب!',
    confirmPay: 'تأكيد الدفع', pay: 'ادفع وحمّل الآن', cancel: 'إلغاء',
    payDesc: 'تصدير وتحميل السيرة الذاتية كملف PDF احترافي.',
    pricePrefix: 'السعر:', priceSuffix: 'ر.س — تُخصم من محفظتك.',
    payNote: 'بعد الدفع يمكنك تحميل وطباعة هذه السيرة بدون رسوم إضافية.',
    tabs: { personal: 'البيانات الأساسية', education: 'التعليم', experience: 'الخبرات', projects: 'المشاريع', skills: 'المهارات', courses: 'الدورات', activities: 'الأنشطة' },
    fields: { fullName: 'الاسم الكامل *', jobTitle: 'المسمى الوظيفي', email: 'البريد الإلكتروني', phone: 'رقم الجوال', city: 'المدينة', country: 'الدولة', linkedin: 'LinkedIn', website: 'الموقع الشخصي', summary: 'النبذة الشخصية', summaryHint: 'اكتب نبذة قصيرة (3-5 أسطر) تلخّص خبراتك وأهدافك', level: 'المرحلة الدراسية', university: 'اسم الجهة التعليمية', degree: 'الدرجة / الشهادة', major: 'التخصص (اختياري)', gpa: 'المعدل (اختياري)', from: 'من', to: 'إلى', addEdu: 'إضافة تعليم', org: 'الجهة', role: 'المسمى', desc: 'الوصف', addExp: 'إضافة خبرة', projectName: 'اسم المشروع/البحث', date: 'التاريخ', addProject: 'إضافة مشروع', techSkills: 'مهارات تقنية (افصل بفاصلة)', softSkills: 'مهارات شخصية', langs: 'اللغات', course: 'الدورة/الشهادة', issuer: 'الجهة', addCourse: 'إضافة دورة', activity: 'النشاط', addActivity: 'إضافة نشاط' },
    levels: { high_school: 'الثانوية العامة', diploma: 'دبلوم', bachelor: 'بكالوريوس', master: 'ماجستير', phd: 'دكتوراه', other: 'أخرى' },
  } : {
    back: 'Back', title: 'Smart Academic CV',
    subtitle: 'Design a professional CV — download and print instantly',
    print: 'Print', download: 'Download PDF', downloadPaid: `Download (${EXPORT_PRICE} SAR)`,
    cvTitle: 'CV Title', placeholderTitle: 'My CV', language: 'Language',
    freeMember: 'Free export (member)', paidDone: 'Paid — unlimited downloads',
    exportPrice: `Export: ${EXPORT_PRICE} SAR`, pickTemplate: 'Pick one template',
    templateHint: '— switch anytime, same data applies',
    livePreview: 'Live Preview', tryDemo: 'Fill with sample data',
    demoFilled: 'Sample data loaded — try the templates!',
    confirmPay: 'Confirm Payment', pay: 'Pay & download', cancel: 'Cancel',
    payDesc: 'Export and download your CV as a professional PDF.',
    pricePrefix: 'Price:', priceSuffix: 'SAR — deducted from your wallet.',
    payNote: 'After payment, you can download and print this CV with no extra fees.',
    tabs: { personal: 'Personal', education: 'Education', experience: 'Experience', projects: 'Projects', skills: 'Skills', courses: 'Courses', activities: 'Activities' },
    fields: { fullName: 'Full Name *', jobTitle: 'Job Title', email: 'Email', phone: 'Phone', city: 'City', country: 'Country', linkedin: 'LinkedIn', website: 'Website', summary: 'Profile Summary', summaryHint: 'Write a short summary (3-5 lines) about your experience and goals', level: 'Education Level', university: 'Institution Name', degree: 'Degree / Certificate', major: 'Field (optional)', gpa: 'GPA (optional)', from: 'From', to: 'To', addEdu: 'Add Education', org: 'Organization', role: 'Role', desc: 'Description', addExp: 'Add Experience', projectName: 'Project / Research Name', date: 'Date', addProject: 'Add Project', techSkills: 'Technical Skills (comma-separated)', softSkills: 'Soft Skills', langs: 'Languages', course: 'Course / Certificate', issuer: 'Issuer', addCourse: 'Add Course', activity: 'Activity', addActivity: 'Add Activity' },
    levels: { high_school: 'High School', diploma: 'Diploma', bachelor: 'Bachelor', master: 'Master', phd: 'PhD', other: 'Other' },
  };
  const tabLabels = T.tabs;
  const fillDemo = () => { updateData(() => (lang === 'ar' ? DEMO_CV_AR : DEMO_CV_EN)); toast.success(T.demoFilled); };

  // ---- Mutators ----
  const setPersonal = (k: keyof CVData['personal'], v: string) =>
    updateData(d => ({ ...d, personal: { ...d.personal, [k]: v } }));

  const addEdu = () => updateData(d => ({ ...d, education: [...d.education, { id: uid(), level: 'bachelor', institution: '', degree: '', field: '', gpa: '', startDate: '', endDate: '', description: '' }] }));
  const updEdu = (id: string, patch: Partial<CVEducation>) => updateData(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, ...patch } : e) }));
  const delEdu = (id: string) => updateData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }));

  const addExp = () => updateData(d => ({ ...d, experience: [...d.experience, { id: uid(), company: '', role: '', startDate: '', endDate: '', description: '' }] }));
  const updExp = (id: string, patch: Partial<CVExperience>) => updateData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, ...patch } : e) }));
  const delExp = (id: string) => updateData(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }));

  const addProj = () => updateData(d => ({ ...d, projects: [...d.projects, { id: uid(), name: '', description: '', date: '' }] }));
  const updProj = (id: string, patch: Partial<CVProject>) => updateData(d => ({ ...d, projects: d.projects.map(e => e.id === id ? { ...e, ...patch } : e) }));
  const delProj = (id: string) => updateData(d => ({ ...d, projects: d.projects.filter(e => e.id !== id) }));

  const addCourse = () => updateData(d => ({ ...d, courses: [...d.courses, { id: uid(), name: '', issuer: '', date: '' }] }));
  const updCourse = (id: string, patch: Partial<CVCourse>) => updateData(d => ({ ...d, courses: d.courses.map(e => e.id === id ? { ...e, ...patch } : e) }));
  const delCourse = (id: string) => updateData(d => ({ ...d, courses: d.courses.filter(e => e.id !== id) }));

  const addAct = () => updateData(d => ({ ...d, activities: [...d.activities, { id: uid(), name: '', description: '' }] }));
  const updAct = (id: string, patch: Partial<CVActivity>) => updateData(d => ({ ...d, activities: d.activities.map(e => e.id === id ? { ...e, ...patch } : e) }));
  const delAct = (id: string) => updateData(d => ({ ...d, activities: d.activities.filter(e => e.id !== id) }));

  const setSkills = (k: 'technical' | 'soft' | 'languages', csv: string) =>
    updateData(d => ({ ...d, skills: { ...d.skills, [k]: csv.split(',').map(s => s.trim()).filter(Boolean) } }));

  // ---- Export flow ----
  const handleDownload = async () => {
    if (needsPayment) { setPaymentOpen(true); return; }
    if (!previewRef.current) return;
    setExporting(true);
    try {
      await exportNodeToPdf(previewRef.current, `${cv?.title || 'cv'}.pdf`);
      toast.success(lang === 'ar' ? 'تم تحميل الـ PDF' : 'PDF downloaded');
    } catch (e: any) {
      toast.error(e?.message || 'Export failed');
    } finally { setExporting(false); }
  };

  const handlePrint = () => {
    if (needsPayment) { setPaymentOpen(true); return; }
    if (!previewRef.current) return;
    printNode(previewRef.current, lang);
  };

  const confirmPay = async () => {
    try {
      const r = await purchaseExport();
      toast.success(r.was_free ? (lang === 'ar' ? 'مجاناً ✨' : 'Free ✨') : (lang === 'ar' ? `تم الخصم: ${r.charged} ر.س` : `Charged: ${r.charged} SAR`));
      setPaymentOpen(false);
      // Auto-trigger download
      setTimeout(() => handleDownload(), 200);
    } catch (e: any) {
      toast.error(e?.message || 'Payment failed');
    }
  };

  if (loading || !cv || !data) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Skeleton className="h-12 w-64 mb-4" />
          <div className="grid lg:grid-cols-2 gap-6">
            <Skeleton className="h-[600px]" />
            <Skeleton className="h-[600px]" />
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        <div className="container mx-auto px-3 sm:px-4 py-6 max-w-[1400px]">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6"
          >
            <div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/student')} className="mb-2 gap-1">
                <ArrowRight className="w-4 h-4" />
                <span>{T.back}</span>
              </Button>
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
                >
                  <FileText className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{T.title}</h1>
                  <p className="text-sm text-muted-foreground">{T.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={fillDemo} className="gap-2 border-dashed">
                <Wand2 className="w-4 h-4" /> {T.tryDemo}
              </Button>
              <Button variant="outline" onClick={handlePrint} disabled={exporting} className="gap-2">
                <Printer className="w-4 h-4" /> {T.print}
              </Button>
              <Button onClick={handleDownload} disabled={exporting} className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95">
                {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {needsPayment ? T.downloadPaid : T.download}
              </Button>
            </div>
          </motion.div>

          {/* Top controls: language + template + title */}
          <Card className="mb-5 border-border/60">
            <CardContent className="p-4 flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
              <div className="flex-1 min-w-0">
                <Label className="text-xs mb-1.5 block">{T.cvTitle}</Label>
                <Input value={cv.title} onChange={e => setTitle(e.target.value)} placeholder={T.placeholderTitle} />
              </div>
              <div>
                <Label className="text-xs mb-1.5 flex items-center gap-1"><Languages className="w-3.5 h-3.5" />{T.language}</Label>
                <div className="flex gap-2">
                  <Button size="sm" variant={lang === 'ar' ? 'default' : 'outline'} onClick={() => setLanguage('ar')}>عربي</Button>
                  <Button size="sm" variant={lang === 'en' ? 'default' : 'outline'} onClick={() => setLanguage('en')}>English</Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isMember ? (
                  <Badge className="gap-1 bg-amber-500/15 text-amber-700 border-amber-500/30"><Crown className="w-3 h-3" />{T.freeMember}</Badge>
                ) : alreadyPaid ? (
                  <Badge className="gap-1 bg-emerald-500/15 text-emerald-700 border-emerald-500/30"><Check className="w-3 h-3" />{T.paidDone}</Badge>
                ) : (
                  <Badge variant="outline" className="gap-1"><Sparkles className="w-3 h-3" />{T.exportPrice}</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Templates */}
          <Card className="mb-6 border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <LayoutTemplate className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">{T.pickTemplate}</h3>
                <span className="text-xs text-muted-foreground">{T.templateHint}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {TEMPLATES_META.map((t, idx) => {
                  const active = cv.template_key === t.key;
                  return (
                    <motion.button
                      key={t.key}
                      onClick={() => setTemplate(t.key as CVTemplate)}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.35 }}
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'relative text-start rounded-xl border-2 p-2.5 transition-colors hover:shadow-lg bg-card',
                        active ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-border/60 hover:border-primary/40'
                      )}
                    >
                      {active && (
                        <motion.div
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="absolute top-1.5 left-1.5 z-10 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
                        >
                          <Check className="w-3 h-3" />
                        </motion.div>
                      )}
                      <div className="mb-2 rounded-md overflow-hidden border border-border/40">
                        <TemplateThumbnail template={t.key} accent={t.accent} />
                      </div>
                      <div className="text-xs font-semibold leading-tight">{lang === 'ar' ? t.nameAr : t.nameEn}</div>
                      <div className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">{lang === 'ar' ? t.descAr : t.descEn}</div>
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Editor + Preview */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* EDITOR */}
            <Card className="border-border/60">
              <CardContent className="p-4">
                <Tabs value={tab} onValueChange={v => setTab(v as any)} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <TabsList className="grid grid-cols-4 lg:grid-cols-7 h-auto p-1 mb-4 gap-0.5">
                    <TabsTrigger value="personal" className="text-xs gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"><User className="w-3 h-3" /> {tabLabels.personal}</TabsTrigger>
                    <TabsTrigger value="education" className="text-xs gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"><GraduationCap className="w-3 h-3" /> {tabLabels.education}</TabsTrigger>
                    <TabsTrigger value="experience" className="text-xs gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"><Briefcase className="w-3 h-3" /> {tabLabels.experience}</TabsTrigger>
                    <TabsTrigger value="projects" className="text-xs gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"><Lightbulb className="w-3 h-3" /> {tabLabels.projects}</TabsTrigger>
                    <TabsTrigger value="skills" className="text-xs gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"><Wrench className="w-3 h-3" /> {tabLabels.skills}</TabsTrigger>
                    <TabsTrigger value="courses" className="text-xs gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"><Award className="w-3 h-3" /> {tabLabels.courses}</TabsTrigger>
                    <TabsTrigger value="activities" className="text-xs gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"><HeartHandshake className="w-3 h-3" /> {tabLabels.activities}</TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tab}
                      initial={{ opacity: 0, x: lang === 'ar' ? -8 : 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: lang === 'ar' ? 8 : -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TabsContent value="personal" className="space-y-3 mt-0">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Field label={T.fields.fullName} value={data.personal.fullName} onChange={v => setPersonal('fullName', v)} />
                          <Field label={T.fields.jobTitle} value={data.personal.jobTitle} onChange={v => setPersonal('jobTitle', v)} />
                          <Field label={T.fields.email} value={data.personal.email} onChange={v => setPersonal('email', v)} type="email" />
                          <Field label={T.fields.phone} value={data.personal.phone} onChange={v => setPersonal('phone', v)} />
                          <Field label={T.fields.city} value={data.personal.city} onChange={v => setPersonal('city', v)} />
                          <Field label={T.fields.country} value={data.personal.country} onChange={v => setPersonal('country', v)} />
                          <Field label={T.fields.linkedin} value={data.personal.linkedin || ''} onChange={v => setPersonal('linkedin', v)} />
                          <Field label={T.fields.website} value={data.personal.website || ''} onChange={v => setPersonal('website', v)} />
                        </div>
                        <div>
                          <Label className="text-xs mb-1.5 block">{T.fields.summary}</Label>
                          <Textarea value={data.personal.summary} onChange={e => setPersonal('summary', e.target.value)} rows={4} placeholder={T.fields.summaryHint} />
                        </div>
                      </TabsContent>

                      <TabsContent value="education" className="space-y-3 mt-0">
                        {data.education.map(e => (
                          <RowCard key={e.id} onDelete={() => delEdu(e.id)}>
                            <div className="grid sm:grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs mb-1 block">{T.fields.level}</Label>
                                <Select value={e.level || 'bachelor'} onValueChange={(v) => updEdu(e.id, { level: v as any })}>
                                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    {(Object.keys(T.levels) as Array<keyof typeof T.levels>).map(k => (
                                      <SelectItem key={k} value={k}>{T.levels[k]}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <Field label={T.fields.university} value={e.institution} onChange={v => updEdu(e.id, { institution: v })} />
                              <Field label={T.fields.degree} value={e.degree} onChange={v => updEdu(e.id, { degree: v })} />
                              <Field label={T.fields.major} value={e.field} onChange={v => updEdu(e.id, { field: v })} />
                              <Field label={T.fields.gpa} value={e.gpa || ''} onChange={v => updEdu(e.id, { gpa: v })} />
                              <Field label={T.fields.from} value={e.startDate} onChange={v => updEdu(e.id, { startDate: v })} placeholder="2020" />
                              <Field label={T.fields.to} value={e.endDate} onChange={v => updEdu(e.id, { endDate: v })} placeholder="2024" />
                            </div>
                          </RowCard>
                        ))}
                        <Button variant="outline" onClick={addEdu} className="w-full gap-2"><Plus className="w-4 h-4" /> {T.fields.addEdu}</Button>
                      </TabsContent>

                      <TabsContent value="experience" className="space-y-3 mt-0">
                        {data.experience.map(e => (
                          <RowCard key={e.id} onDelete={() => delExp(e.id)}>
                            <div className="grid sm:grid-cols-2 gap-2">
                              <Field label={T.fields.org} value={e.company} onChange={v => updExp(e.id, { company: v })} />
                              <Field label={T.fields.role} value={e.role} onChange={v => updExp(e.id, { role: v })} />
                              <Field label={T.fields.from} value={e.startDate} onChange={v => updExp(e.id, { startDate: v })} placeholder="2022" />
                              <Field label={T.fields.to} value={e.endDate} onChange={v => updExp(e.id, { endDate: v })} placeholder={lang === 'ar' ? 'حتى الآن' : 'Present'} />
                            </div>
                            <div className="mt-2">
                              <Label className="text-xs mb-1 block">{T.fields.desc}</Label>
                              <Textarea rows={3} value={e.description} onChange={ev => updExp(e.id, { description: ev.target.value })} />
                            </div>
                          </RowCard>
                        ))}
                        <Button variant="outline" onClick={addExp} className="w-full gap-2"><Plus className="w-4 h-4" /> {T.fields.addExp}</Button>
                      </TabsContent>

                      <TabsContent value="projects" className="space-y-3 mt-0">
                        {data.projects.map(p => (
                          <RowCard key={p.id} onDelete={() => delProj(p.id)}>
                            <div className="grid sm:grid-cols-2 gap-2">
                              <Field label={T.fields.projectName} value={p.name} onChange={v => updProj(p.id, { name: v })} />
                              <Field label={T.fields.date} value={p.date || ''} onChange={v => updProj(p.id, { date: v })} />
                            </div>
                            <div className="mt-2">
                              <Label className="text-xs mb-1 block">{T.fields.desc}</Label>
                              <Textarea rows={3} value={p.description} onChange={e => updProj(p.id, { description: e.target.value })} />
                            </div>
                          </RowCard>
                        ))}
                        <Button variant="outline" onClick={addProj} className="w-full gap-2"><Plus className="w-4 h-4" /> {T.fields.addProject}</Button>
                      </TabsContent>

                      <TabsContent value="skills" className="space-y-3 mt-0">
                        <Field label={T.fields.techSkills} value={data.skills.technical.join(', ')} onChange={v => setSkills('technical', v)} placeholder="Python, SPSS, LaTeX" />
                        <Field label={T.fields.softSkills} value={data.skills.soft.join(', ')} onChange={v => setSkills('soft', v)} placeholder={lang === 'ar' ? 'القيادة، التواصل، حل المشكلات' : 'Leadership, Communication, Problem-solving'} />
                        <Field label={T.fields.langs} value={data.skills.languages.join(', ')} onChange={v => setSkills('languages', v)} placeholder={lang === 'ar' ? 'العربية (لغة أم)، الإنجليزية (متقدم)' : 'Arabic (Native), English (Advanced)'} />
                      </TabsContent>

                      <TabsContent value="courses" className="space-y-3 mt-0">
                        {data.courses.map(c => (
                          <RowCard key={c.id} onDelete={() => delCourse(c.id)}>
                            <div className="grid sm:grid-cols-3 gap-2">
                              <Field label={T.fields.course} value={c.name} onChange={v => updCourse(c.id, { name: v })} />
                              <Field label={T.fields.issuer} value={c.issuer} onChange={v => updCourse(c.id, { issuer: v })} />
                              <Field label={T.fields.date} value={c.date || ''} onChange={v => updCourse(c.id, { date: v })} />
                            </div>
                          </RowCard>
                        ))}
                        <Button variant="outline" onClick={addCourse} className="w-full gap-2"><Plus className="w-4 h-4" /> {T.fields.addCourse}</Button>
                      </TabsContent>

                      <TabsContent value="activities" className="space-y-3 mt-0">
                        {data.activities.map(a => (
                          <RowCard key={a.id} onDelete={() => delAct(a.id)}>
                            <Field label={T.fields.activity} value={a.name} onChange={v => updAct(a.id, { name: v })} />
                            <div className="mt-2">
                              <Label className="text-xs mb-1 block">{T.fields.desc}</Label>
                              <Textarea rows={2} value={a.description || ''} onChange={e => updAct(a.id, { description: e.target.value })} />
                            </div>
                          </RowCard>
                        ))}
                        <Button variant="outline" onClick={addAct} className="w-full gap-2"><Plus className="w-4 h-4" /> {T.fields.addActivity}</Button>
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </Tabs>
              </CardContent>
            </Card>

            {/* PREVIEW */}
            <div className="lg:sticky lg:top-4 lg:self-start">
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" /> {T.livePreview}
              </div>
              <div className="rounded-xl border-2 border-border/60 bg-muted/30 p-2 sm:p-4 overflow-auto max-h-[80vh]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={cv.template_key + lang}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    ref={previewRef as any}
                    style={{
                      width: '210mm',
                      minHeight: '297mm',
                      margin: '0 auto',
                      background: 'white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)',
                      transform: 'scale(0.62)',
                      transformOrigin: lang === 'ar' ? 'top right' : 'top left',
                    }}
                    className="origin-top"
                  >
                    <CVRenderer template={cv.template_key} data={data} lang={lang} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> {T.confirmPay}</DialogTitle>
            <DialogDescription>
              {T.payDesc} <br />
              <strong className="text-foreground">{T.pricePrefix}</strong> {EXPORT_PRICE} {T.priceSuffix}
              <br /><span className="text-xs text-muted-foreground mt-2 block">{T.payNote}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>{T.cancel}</Button>
            <Button onClick={confirmPay} className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600">
              <Check className="w-4 h-4" /> {T.pay}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
};

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }> = ({ label, value, onChange, placeholder, type }) => (
  <div>
    <Label className="text-xs mb-1 block">{label}</Label>
    <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type} />
  </div>
);

const RowCard: React.FC<{ children: React.ReactNode; onDelete: () => void }> = ({ children, onDelete }) => (
  <div className="border border-border/60 rounded-lg p-3 relative bg-muted/20">
    <Button size="sm" variant="ghost" onClick={onDelete} className="absolute top-1 left-1 h-7 w-7 p-0 text-destructive hover:bg-destructive/10">
      <Trash2 className="w-3.5 h-3.5" />
    </Button>
    {children}
  </div>
);

export default AcademicCVPage;
