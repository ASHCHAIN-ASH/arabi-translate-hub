import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowRight, ArrowLeft, FileText, Languages, LayoutTemplate,
  User, GraduationCap, Briefcase, Lightbulb, Wrench, Award, HeartHandshake,
  Plus, Trash2, Eye, Download, Printer, Loader2, Crown, Sparkles, Check,
} from 'lucide-react';
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

  const tabsAr: Record<string, string> = {
    personal: 'البيانات الأساسية', education: 'التعليم', experience: 'الخبرات',
    projects: 'المشاريع', skills: 'المهارات', courses: 'الدورات', activities: 'الأنشطة',
  };
  const tabsEn: Record<string, string> = {
    personal: 'Personal', education: 'Education', experience: 'Experience',
    projects: 'Projects', skills: 'Skills', courses: 'Courses', activities: 'Activities',
  };
  const tabLabels = lang === 'ar' ? tabsAr : tabsEn;

  // ---- Mutators ----
  const setPersonal = (k: keyof CVData['personal'], v: string) =>
    updateData(d => ({ ...d, personal: { ...d.personal, [k]: v } }));

  const addEdu = () => updateData(d => ({ ...d, education: [...d.education, { id: uid(), institution: '', degree: '', field: '', gpa: '', startDate: '', endDate: '', description: '' }] }));
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
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/student')} className="mb-2 gap-1">
                <ArrowRight className="w-4 h-4" />
                <span>الرجوع</span>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">CV الأكاديمي الذكي</h1>
                  <p className="text-sm text-muted-foreground">صمّم سيرتك بقالب احترافي — حمّلها واطبعها مباشرة</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handlePrint} disabled={exporting} className="gap-2">
                <Printer className="w-4 h-4" /> طباعة
              </Button>
              <Button onClick={handleDownload} disabled={exporting} className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95">
                {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {needsPayment ? `تحميل (${EXPORT_PRICE} ر.س)` : 'تحميل PDF'}
              </Button>
            </div>
          </div>

          {/* Top controls: language + template + title */}
          <Card className="mb-5 border-border/60">
            <CardContent className="p-4 flex flex-col lg:flex-row gap-4 items-stretch lg:items-end">
              <div className="flex-1 min-w-0">
                <Label className="text-xs mb-1.5 block">عنوان السيرة</Label>
                <Input value={cv.title} onChange={e => setTitle(e.target.value)} placeholder="سيرتي الذاتية" />
              </div>
              <div>
                <Label className="text-xs mb-1.5 flex items-center gap-1"><Languages className="w-3.5 h-3.5" />اللغة</Label>
                <div className="flex gap-2">
                  <Button size="sm" variant={lang === 'ar' ? 'default' : 'outline'} onClick={() => setLanguage('ar')}>عربي</Button>
                  <Button size="sm" variant={lang === 'en' ? 'default' : 'outline'} onClick={() => setLanguage('en')}>English</Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isMember ? (
                  <Badge className="gap-1 bg-amber-500/15 text-amber-700 border-amber-500/30"><Crown className="w-3 h-3" />تصدير مجاني (عضو)</Badge>
                ) : alreadyPaid ? (
                  <Badge className="gap-1 bg-emerald-500/15 text-emerald-700 border-emerald-500/30"><Check className="w-3 h-3" />تم الدفع — تحميل غير محدود</Badge>
                ) : (
                  <Badge variant="outline" className="gap-1"><Sparkles className="w-3 h-3" />تصدير: {EXPORT_PRICE} ر.س</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Templates */}
          <Card className="mb-6 border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <LayoutTemplate className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">اختر قالباً واحداً</h3>
                <span className="text-xs text-muted-foreground">— يمكنك التبديل في أي وقت، وستُطبَّق نفس البيانات</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {TEMPLATES_META.map(t => {
                  const active = cv.template_key === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setTemplate(t.key as CVTemplate)}
                      className={cn(
                        'relative text-right rounded-xl border-2 p-3 transition-all hover:shadow-md',
                        active ? 'border-primary bg-primary/5 shadow-md' : 'border-border/60 hover:border-primary/40'
                      )}
                    >
                      {active && (
                        <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      <div className="h-12 rounded-md mb-2 border" style={{ background: `linear-gradient(135deg, ${t.accent}15, ${t.accent}05)` }}>
                        <div className="h-1.5 rounded-t-md" style={{ background: t.accent }} />
                      </div>
                      <div className="text-xs font-semibold leading-tight">{lang === 'ar' ? t.nameAr : t.nameEn}</div>
                      <div className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">{lang === 'ar' ? t.descAr : t.descEn}</div>
                    </button>
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
                <Tabs value={tab} onValueChange={v => setTab(v as any)} dir="rtl">
                  <TabsList className="grid grid-cols-4 lg:grid-cols-7 h-auto p-1 mb-4">
                    <TabsTrigger value="personal" className="text-xs gap-1"><User className="w-3 h-3" /> {tabLabels.personal}</TabsTrigger>
                    <TabsTrigger value="education" className="text-xs gap-1"><GraduationCap className="w-3 h-3" /> {tabLabels.education}</TabsTrigger>
                    <TabsTrigger value="experience" className="text-xs gap-1"><Briefcase className="w-3 h-3" /> {tabLabels.experience}</TabsTrigger>
                    <TabsTrigger value="projects" className="text-xs gap-1"><Lightbulb className="w-3 h-3" /> {tabLabels.projects}</TabsTrigger>
                    <TabsTrigger value="skills" className="text-xs gap-1"><Wrench className="w-3 h-3" /> {tabLabels.skills}</TabsTrigger>
                    <TabsTrigger value="courses" className="text-xs gap-1"><Award className="w-3 h-3" /> {tabLabels.courses}</TabsTrigger>
                    <TabsTrigger value="activities" className="text-xs gap-1"><HeartHandshake className="w-3 h-3" /> {tabLabels.activities}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Field label="الاسم الكامل *" value={data.personal.fullName} onChange={v => setPersonal('fullName', v)} />
                      <Field label="المسمى الوظيفي" value={data.personal.jobTitle} onChange={v => setPersonal('jobTitle', v)} />
                      <Field label="البريد الإلكتروني" value={data.personal.email} onChange={v => setPersonal('email', v)} type="email" />
                      <Field label="رقم الجوال" value={data.personal.phone} onChange={v => setPersonal('phone', v)} />
                      <Field label="المدينة" value={data.personal.city} onChange={v => setPersonal('city', v)} />
                      <Field label="الدولة" value={data.personal.country} onChange={v => setPersonal('country', v)} />
                      <Field label="LinkedIn" value={data.personal.linkedin || ''} onChange={v => setPersonal('linkedin', v)} />
                      <Field label="الموقع الشخصي" value={data.personal.website || ''} onChange={v => setPersonal('website', v)} />
                    </div>
                    <div>
                      <Label className="text-xs mb-1.5 block">النبذة الشخصية / Profile</Label>
                      <Textarea value={data.personal.summary} onChange={e => setPersonal('summary', e.target.value)} rows={4} placeholder="اكتب نبذة قصيرة (3-5 أسطر) تلخّص خبراتك وأهدافك" />
                    </div>
                  </TabsContent>

                  <TabsContent value="education" className="space-y-3">
                    {data.education.map(e => (
                      <RowCard key={e.id} onDelete={() => delEdu(e.id)}>
                        <div className="grid sm:grid-cols-2 gap-2">
                          <Field label="الجامعة" value={e.institution} onChange={v => updEdu(e.id, { institution: v })} />
                          <Field label="الدرجة" value={e.degree} onChange={v => updEdu(e.id, { degree: v })} />
                          <Field label="التخصص" value={e.field} onChange={v => updEdu(e.id, { field: v })} />
                          <Field label="المعدل (اختياري)" value={e.gpa || ''} onChange={v => updEdu(e.id, { gpa: v })} />
                          <Field label="من" value={e.startDate} onChange={v => updEdu(e.id, { startDate: v })} placeholder="2020" />
                          <Field label="إلى" value={e.endDate} onChange={v => updEdu(e.id, { endDate: v })} placeholder="2024" />
                        </div>
                      </RowCard>
                    ))}
                    <Button variant="outline" onClick={addEdu} className="w-full gap-2"><Plus className="w-4 h-4" /> إضافة تعليم</Button>
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-3">
                    {data.experience.map(e => (
                      <RowCard key={e.id} onDelete={() => delExp(e.id)}>
                        <div className="grid sm:grid-cols-2 gap-2">
                          <Field label="الجهة" value={e.company} onChange={v => updExp(e.id, { company: v })} />
                          <Field label="المسمى" value={e.role} onChange={v => updExp(e.id, { role: v })} />
                          <Field label="من" value={e.startDate} onChange={v => updExp(e.id, { startDate: v })} placeholder="2022" />
                          <Field label="إلى" value={e.endDate} onChange={v => updExp(e.id, { endDate: v })} placeholder="حتى الآن" />
                        </div>
                        <div className="mt-2">
                          <Label className="text-xs mb-1 block">الوصف</Label>
                          <Textarea rows={3} value={e.description} onChange={ev => updExp(e.id, { description: ev.target.value })} />
                        </div>
                      </RowCard>
                    ))}
                    <Button variant="outline" onClick={addExp} className="w-full gap-2"><Plus className="w-4 h-4" /> إضافة خبرة</Button>
                  </TabsContent>

                  <TabsContent value="projects" className="space-y-3">
                    {data.projects.map(p => (
                      <RowCard key={p.id} onDelete={() => delProj(p.id)}>
                        <div className="grid sm:grid-cols-2 gap-2">
                          <Field label="اسم المشروع/البحث" value={p.name} onChange={v => updProj(p.id, { name: v })} />
                          <Field label="التاريخ" value={p.date || ''} onChange={v => updProj(p.id, { date: v })} />
                        </div>
                        <div className="mt-2">
                          <Label className="text-xs mb-1 block">الوصف</Label>
                          <Textarea rows={3} value={p.description} onChange={e => updProj(p.id, { description: e.target.value })} />
                        </div>
                      </RowCard>
                    ))}
                    <Button variant="outline" onClick={addProj} className="w-full gap-2"><Plus className="w-4 h-4" /> إضافة مشروع</Button>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-3">
                    <Field label="مهارات تقنية (افصل بفاصلة)" value={data.skills.technical.join(', ')} onChange={v => setSkills('technical', v)} placeholder="Python, SPSS, LaTeX" />
                    <Field label="مهارات شخصية" value={data.skills.soft.join(', ')} onChange={v => setSkills('soft', v)} placeholder="القيادة، التواصل، حل المشكلات" />
                    <Field label="اللغات" value={data.skills.languages.join(', ')} onChange={v => setSkills('languages', v)} placeholder="العربية (لغة أم)، الإنجليزية (متقدم)" />
                  </TabsContent>

                  <TabsContent value="courses" className="space-y-3">
                    {data.courses.map(c => (
                      <RowCard key={c.id} onDelete={() => delCourse(c.id)}>
                        <div className="grid sm:grid-cols-3 gap-2">
                          <Field label="الدورة/الشهادة" value={c.name} onChange={v => updCourse(c.id, { name: v })} />
                          <Field label="الجهة" value={c.issuer} onChange={v => updCourse(c.id, { issuer: v })} />
                          <Field label="التاريخ" value={c.date || ''} onChange={v => updCourse(c.id, { date: v })} />
                        </div>
                      </RowCard>
                    ))}
                    <Button variant="outline" onClick={addCourse} className="w-full gap-2"><Plus className="w-4 h-4" /> إضافة دورة</Button>
                  </TabsContent>

                  <TabsContent value="activities" className="space-y-3">
                    {data.activities.map(a => (
                      <RowCard key={a.id} onDelete={() => delAct(a.id)}>
                        <Field label="النشاط" value={a.name} onChange={v => updAct(a.id, { name: v })} />
                        <div className="mt-2">
                          <Label className="text-xs mb-1 block">الوصف</Label>
                          <Textarea rows={2} value={a.description || ''} onChange={e => updAct(a.id, { description: e.target.value })} />
                        </div>
                      </RowCard>
                    ))}
                    <Button variant="outline" onClick={addAct} className="w-full gap-2"><Plus className="w-4 h-4" /> إضافة نشاط</Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* PREVIEW */}
            <div className="lg:sticky lg:top-4 lg:self-start">
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" /> معاينة مباشرة
              </div>
              <div className="rounded-xl border-2 border-border/60 bg-muted/30 p-2 sm:p-4 overflow-auto max-h-[80vh]">
                <div
                  ref={previewRef}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> تأكيد الدفع</DialogTitle>
            <DialogDescription>
              تصدير وتحميل السيرة الذاتية كملف PDF احترافي. <br />
              <strong className="text-foreground">السعر:</strong> {EXPORT_PRICE} ر.س — تُخصم من محفظتك.
              <br /><span className="text-xs text-muted-foreground mt-2 block">بعد الدفع يمكنك تحميل وطباعة هذه السيرة بدون رسوم إضافية.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>إلغاء</Button>
            <Button onClick={confirmPay} className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600">
              <Check className="w-4 h-4" /> ادفع وحمّل الآن
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
