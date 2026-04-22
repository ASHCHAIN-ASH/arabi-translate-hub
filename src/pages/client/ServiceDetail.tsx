import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ShoppingCart, CheckCircle, Clock, Shield, Award,
  Zap, RefreshCw, FileText, Star, HeadphonesIcon, Eye,
  BookOpen, PenTool, Printer, BarChart3, GraduationCap,
  Languages, Mic, Globe, Video, Layers, Target, Lightbulb,
  MessageCircle, ThumbsUp, Lock, Truck, TrendingUp, Users,
  Activity, Sparkles, Calculator, HelpCircle, Calendar,
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  unit: string | null;
  category_id: string | null;
}

interface ServiceCategory {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
}

const serviceIconMap: { keywords: string[]; icon: React.ElementType }[] = [
  { keywords: ['ترجمة نص', 'نصوص', 'text'], icon: FileText },
  { keywords: ['صوت', 'audio', 'صوتي'], icon: Mic },
  { keywords: ['فيديو', 'video', 'مرئي'], icon: Video },
  { keywords: ['موقع', 'website', 'ويب'], icon: Globe },
  { keywords: ['مستند', 'document', 'وثائق', 'ملف'], icon: FileText },
  { keywords: ['بحث', 'research', 'أكاديم'], icon: BookOpen },
  { keywords: ['تحرير', 'editing', 'تدقيق', 'مراجعة'], icon: PenTool },
  { keywords: ['نشر', 'publish', 'طباعة'], icon: Printer },
  { keywords: ['إحصا', 'statist', 'تحليل', 'spss'], icon: BarChart3 },
  { keywords: ['طالب', 'student', 'تعليم', 'واجب'], icon: GraduationCap },
  { keywords: ['ترجمة', 'translat', 'لغ'], icon: Languages },
  { keywords: ['استشار', 'consult'], icon: Lightbulb },
  { keywords: ['تنسيق', 'format'], icon: Layers },
  { keywords: ['عنوان', 'خطة', 'plan'], icon: Target },
];

function getServiceIcon(service: Service): React.ElementType {
  const name = ((service.name_ar || '') + ' ' + service.name + ' ' + (service.description || '')).toLowerCase();
  for (const entry of serviceIconMap) {
    if (entry.keywords.some(k => name.includes(k))) return entry.icon;
  }
  return FileText;
}

const gradients = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-red-600',
  'from-cyan-500 to-blue-600',
];

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [catIndex, setCatIndex] = useState(0);

  // Live stats
  const [activeOrders, setActiveOrders] = useState<number>(0);
  const [completedOrders, setCompletedOrders] = useState<number>(0);
  const [viewersNow, setViewersNow] = useState<number>(7);

  // Calculator
  const [qty, setQty] = useState<number>(10);
  const [urgency, setUrgency] = useState<'normal' | 'fast' | 'urgent'>('normal');

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      const { data: svc } = await supabase.from('services').select('*').eq('id', id).maybeSingle();
      if (svc) {
        setService(svc);
        if (svc.category_id) {
          const [catRes, relatedRes, allCats] = await Promise.all([
            supabase.from('service_categories').select('*').eq('id', svc.category_id).maybeSingle(),
            supabase.from('services').select('*').eq('category_id', svc.category_id).eq('is_active', true).neq('id', id).limit(6),
            supabase.from('service_categories').select('id').order('sort_order'),
          ]);
          if (catRes.data) setCategory(catRes.data);
          if (relatedRes.data) setRelatedServices(relatedRes.data);
          if (allCats.data) {
            const idx = allCats.data.findIndex((c: any) => c.id === svc.category_id);
            setCatIndex(Math.max(idx, 0));
          }
        }
      }
      setLoading(false);
    };
    load();
  }, [id]);

  // Live order stats from service_orders for this service
  useEffect(() => {
    if (!id) return;
    const fetchStats = async () => {
      try {
        const [activeRes, doneRes] = await Promise.all([
          supabase.from('service_orders').select('id', { count: 'exact', head: true })
            .eq('service_id', id).in('status', ['pending', 'in_progress', 'review']),
          supabase.from('service_orders').select('id', { count: 'exact', head: true })
            .eq('service_id', id).eq('status', 'completed'),
        ]);
        setActiveOrders(activeRes.count || 0);
        setCompletedOrders(doneRes.count || 0);
      } catch (e) {
        // silent fail — stats are non-critical
      }
    };
    fetchStats();

    const ch = supabase
      .channel(`svc-orders-${id}-${Math.random().toString(36).slice(2, 8)}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'service_orders', filter: `service_id=eq.${id}` },
        () => fetchStats())
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [id]);

  // Simulated live viewers tick (banking-style "people viewing now")
  useEffect(() => {
    const t = setInterval(() => {
      setViewersNow(v => Math.max(3, Math.min(28, v + (Math.random() > 0.5 ? 1 : -1))));
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const gradient = gradients[catIndex % gradients.length];
  const IconComp = service ? getServiceIcon(service) : FileText;

  const features = useMemo(() => ([
    { icon: Shield, title: 'سرية تامة', desc: 'نضمن حماية بياناتك وخصوصية عملك بالكامل', color: 'text-blue-600' },
    { icon: Award, title: 'جودة عالية', desc: 'فريق متخصص يضمن أعلى معايير الجودة الأكاديمية', color: 'text-amber-600' },
    { icon: Zap, title: 'تنفيذ سريع', desc: 'نلتزم بالمواعيد المتفق عليها دون أي تأخير', color: 'text-emerald-600' },
    { icon: HeadphonesIcon, title: 'دعم مستمر', desc: 'فريق الدعم متاح لمتابعة طلبك حتى الاستلام النهائي', color: 'text-violet-600' },
    { icon: Lock, title: 'حماية الملكية', desc: 'حقوق الملكية الفكرية محفوظة بالكامل لك', color: 'text-rose-600' },
    { icon: ThumbsUp, title: 'رضا مضمون', desc: 'نضمن رضاك التام مع إمكانية التعديل المجاني', color: 'text-cyan-600' },
  ]), []);

  const steps = useMemo(() => ([
    { step: '1', title: 'أرسل طلبك', desc: 'اضغط "اطلب الآن" وأرفق ملاحظاتك وملفاتك', icon: ShoppingCart },
    { step: '2', title: 'استلم عرض السعر', desc: 'يراجع الفريق طلبك ويرسل عرض سعر مفصل', icon: FileText },
    { step: '3', title: 'المتابعة والتنفيذ', desc: 'تابع حالة طلبك لحظة بلحظة من لوحتك', icon: Eye },
    { step: '4', title: 'استلم العمل', desc: 'استلم العمل بالجودة المطلوبة وراجعه', icon: Truck },
  ]), []);

  const faqs = useMemo(() => ([
    { q: 'كم يستغرق تنفيذ الخدمة؟', a: 'يعتمد ذلك على حجم الطلب ومستوى التعقيد. نحدد المدة بدقة عند إرسال عرض السعر، ويمكنك اختيار خيار التنفيذ المستعجل لتسريع الإنجاز.' },
    { q: 'هل يمكنني طلب تعديلات بعد التسليم؟', a: 'نعم — نوفر تعديلات مجانية ضمن نطاق الطلب لضمان رضاك التام عن النتيجة النهائية.' },
    { q: 'كيف يتم احتساب السعر؟', a: 'يُحدد السعر بناءً على وحدة القياس (عدد الكلمات، الصفحات، الساعات...) ومستوى الاستعجال. يمكنك استخدام الحاسبة التقديرية أعلاه للحصول على تقدير مبدئي.' },
    { q: 'هل بياناتي محمية؟', a: 'بالتأكيد. نلتزم بأعلى معايير السرية وحماية البيانات، وجميع الملفات مشفّرة ولا تُشارك مع أي طرف ثالث.' },
    { q: 'هل تقدمون فاتورة رسمية؟', a: 'نعم، نوفر فواتير ضريبية رسمية لجميع الطلبات بعد إتمام الدفع.' },
  ]), []);

  // Estimated price calculator (display-only — final price set by team)
  const estimate = useMemo(() => {
    const base = 50; // base unit price (display only)
    const urgencyMultiplier = urgency === 'urgent' ? 1.6 : urgency === 'fast' ? 1.25 : 1;
    const total = Math.max(qty, 1) * base * urgencyMultiplier;
    return Math.round(total);
  }, [qty, urgency]);

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ClientLayout>
    );
  }

  if (!service) {
    return (
      <ClientLayout>
        <div className="text-center py-20">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">الخدمة غير موجودة</h2>
          <Button onClick={() => navigate('/client-services')}>العودة للخدمات</Button>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6 pb-28 lg:pb-6" dir="rtl">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm">
          <Button variant="ghost" size="sm" onClick={() => navigate('/client-services')} className="gap-2 text-muted-foreground">
            <ArrowRight className="w-4 h-4" />
            خدماتنا
          </Button>
          {category && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground text-xs">{category.name_ar || category.name}</span>
            </>
          )}
        </motion.div>

        {/* Live Activity Strip */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border bg-card/60 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-foreground">
              {viewersNow}
            </span>
            <span className="text-muted-foreground">شخصاً يستعرضون الخدمة الآن</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-bold">{activeOrders}</span>
              <span className="text-muted-foreground">طلب نشط</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-bold">{completedOrders}</span>
              <span className="text-muted-foreground">مُنجز</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Card */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className={`bg-gradient-to-r ${gradient} p-6 sm:p-8 text-white relative overflow-hidden`}>
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-16 translate-y-16 blur-2xl" />
              {/* Subtle grid */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <motion.div
                      className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <IconComp className="w-7 h-7 text-white" />
                    </motion.div>
                    {category && (
                      <Badge className="bg-white/20 text-white border-white/30 text-xs">
                        {category.name_ar || category.name}
                      </Badge>
                    )}
                    <Badge className="bg-emerald-400/20 text-emerald-50 border-emerald-300/30 text-xs gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      متاح الآن
                    </Badge>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                    {service.name_ar || service.name}
                  </h1>
                  {service.description && (
                    <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-2xl">
                      {service.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    {service.unit && (
                      <div className="flex items-center gap-2 text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Layers className="w-4 h-4" />
                        وحدة القياس: <span className="font-bold text-white">{service.unit}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-bold text-white">{completedOrders}+</span> طلب منجز
                    </div>
                  </div>
                </div>

                {/* Order CTA */}
                <div className="shrink-0 w-full lg:w-auto">
                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 text-center space-y-4 lg:min-w-[240px] border border-white/20">
                    <div className="flex items-center justify-center gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                      ))}
                      <span className="text-xs text-white/80 mr-1">4.9</span>
                    </div>
                    <p className="text-xs text-white/70">موثوق من آلاف العملاء</p>
                    <div className="border-t border-white/20 pt-4">
                      <p className="text-xs text-white/60 mb-1">السعر</p>
                      <p className="text-lg font-bold">يُحدد بعد المراجعة</p>
                    </div>
                    <Button
                      onClick={() => navigate(`/orders/new?service=${service.id}`)}
                      className="w-full gap-2 bg-white text-gray-900 hover:bg-white/90 font-bold shadow-lg"
                      size="lg"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      اطلب الآن
                    </Button>
                    <p className="text-[11px] text-white/50">بدون التزام — عرض سعر مجاني</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Trust stats — banking-style tile row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {[
            { value: '99%', label: 'نسبة الرضا', icon: ThumbsUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
            { value: '24/7', label: 'دعم متواصل', icon: HeadphonesIcon, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
            { value: `${completedOrders || '+5000'}`, label: 'مشروع منجز', icon: CheckCircle, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/30' },
            { value: '100%', label: 'سرية مضمونة', icon: Lock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <Card className={`border ${stat.bg} hover:shadow-md transition-all`}>
                <CardContent className="p-4 text-center">
                  <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                  <p className="text-xl font-black text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Tabs Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 w-full h-auto p-1 bg-muted/50 rounded-2xl">
              <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm rounded-xl py-2.5 data-[state=active]:shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">نظرة عامة</span>
                <span className="sm:hidden">نظرة</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="gap-1.5 text-xs sm:text-sm rounded-xl py-2.5 data-[state=active]:shadow-md">
                <Star className="w-3.5 h-3.5" />
                المزايا
              </TabsTrigger>
              <TabsTrigger value="how" className="gap-1.5 text-xs sm:text-sm rounded-xl py-2.5 data-[state=active]:shadow-md">
                <Clock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">كيف تعمل</span>
                <span className="sm:hidden">آلية</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="gap-1.5 text-xs sm:text-sm rounded-xl py-2.5 data-[state=active]:shadow-md">
                <HelpCircle className="w-3.5 h-3.5" />
                أسئلة
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-5">
              <Card className="border shadow-sm">
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg mb-1">عن هذه الخدمة</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.description || 'خدمة احترافية متكاملة يقدمها فريق متخصص بأعلى معايير الجودة. نلتزم بتسليم عملك في الوقت المحدد مع ضمان السرية التامة والدعم المستمر.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t">
                    {[
                      { icon: Users, label: 'فريق متخصص', value: 'خبراء معتمدون' },
                      { icon: Calendar, label: 'مرونة المواعيد', value: 'حسب احتياجك' },
                      { icon: Shield, label: 'ضمان الجودة', value: 'تعديلات مجانية' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                        <item.icon className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <div className="text-[11px] text-muted-foreground">{item.label}</div>
                          <div className="text-sm font-bold">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="mt-5">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -3 }}
                  >
                    <Card className="h-full border shadow-sm hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4 space-y-2.5">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                          <f.icon className={`w-5 h-5 ${f.color}`} />
                        </div>
                        <h3 className="font-bold text-sm">{f.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* How it works Tab */}
            <TabsContent value="how" className="mt-5">
              <Card className="border shadow-sm overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {steps.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative text-center"
                      >
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                          <s.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-sm mb-1">{s.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                        <Badge variant="outline" className="mt-2 text-[10px]">الخطوة {s.step}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="mt-5">
              <Card className="border shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                      <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0">
                        <AccordionTrigger className="text-right hover:no-underline py-4 text-sm font-bold">
                          <div className="flex items-center gap-2 flex-1 text-right">
                            <span className={`w-6 h-6 rounded-lg bg-gradient-to-br ${gradient} text-white text-[11px] flex items-center justify-center shrink-0 font-black`}>
                              {i + 1}
                            </span>
                            {faq.q}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed pr-8">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Price Calculator */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className={`bg-gradient-to-r ${gradient} px-6 py-4 text-white flex items-center gap-2`}>
              <Calculator className="w-5 h-5" />
              <h2 className="text-base font-black">حاسبة السعر التقديرية</h2>
              <Badge className="mr-auto bg-white/20 text-white border-white/30 text-[10px]">
                تقديري
              </Badge>
            </div>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground">
                    الكمية {service.unit ? `(${service.unit})` : ''}
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value) || 1)}
                    className="h-11 rounded-xl text-base font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground">مدة التنفيذ</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {([
                      { v: 'normal' as const, label: 'عادي', sub: '×1' },
                      { v: 'fast' as const, label: 'سريع', sub: '×1.25' },
                      { v: 'urgent' as const, label: 'عاجل', sub: '×1.6' },
                    ]).map(o => (
                      <button
                        key={o.v}
                        onClick={() => setUrgency(o.v)}
                        className={`px-2 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                          urgency === o.v
                            ? `bg-gradient-to-br ${gradient} text-white border-transparent shadow-md`
                            : 'bg-card text-foreground border-border hover:border-primary/30'
                        }`}
                      >
                        <div>{o.label}</div>
                        <div className={`text-[10px] mt-0.5 ${urgency === o.v ? 'text-white/80' : 'text-muted-foreground'}`}>{o.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-muted/40 border-2 border-dashed p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">السعر التقديري</div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={estimate}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-baseline gap-1.5"
                    >
                      <span className="text-3xl font-black text-foreground">{estimate.toLocaleString('ar-SA')}</span>
                      <span className="text-sm font-bold text-muted-foreground">ر.س</span>
                    </motion.div>
                  </AnimatePresence>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    * السعر النهائي يُحدد بعد مراجعة الفريق لطلبك
                  </div>
                </div>
                <Button
                  onClick={() => navigate(`/orders/new?service=${service.id}`)}
                  size="lg"
                  className={`gap-2 rounded-full bg-gradient-to-r ${gradient} text-white border-0 shadow-md hover:shadow-xl transition-all`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  أطلب بهذا التقدير
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              خدمات مشابهة
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedServices.map((rs, i) => {
                const RsIcon = getServiceIcon(rs);
                return (
                  <motion.div
                    key={rs.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    whileHover={{ y: -3 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 border hover:border-primary/20 group overflow-hidden"
                      onClick={() => navigate(`/client-services/${rs.id}`)}
                    >
                      <div className={`h-1 bg-gradient-to-r ${gradient} opacity-40 group-hover:opacity-100 transition-opacity`} />
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <RsIcon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">{rs.name_ar || rs.name}</h3>
                            {rs.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{rs.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="flex-1 gap-1 text-xs text-muted-foreground h-8">
                            <Eye className="w-3 h-3" />
                            التفاصيل
                          </Button>
                          <Button
                            size="sm"
                            className={`flex-1 gap-1 text-xs h-8 rounded-full bg-gradient-to-r ${gradient} text-white border-0`}
                            onClick={(e) => { e.stopPropagation(); navigate(`/orders/new?service=${rs.id}`); }}
                          >
                            <ShoppingCart className="w-3 h-3" />
                            اطلب
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Final CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className={`bg-gradient-to-r ${gradient} p-8 text-white text-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-30" />
              <div className="relative z-10 space-y-4 max-w-lg mx-auto">
                <MessageCircle className="w-10 h-10 mx-auto opacity-80" />
                <h2 className="text-xl sm:text-2xl font-black">جاهز للبدء؟</h2>
                <p className="text-white/80 text-sm">أرسل طلبك الآن واحصل على عرض سعر مجاني خلال ساعات</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => navigate(`/orders/new?service=${service.id}`)}
                    size="lg"
                    className="gap-2 bg-white text-gray-900 hover:bg-white/90 font-bold shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    اطلب الخدمة الآن
                  </Button>
                  <Button
                    onClick={() => navigate('/contact')}
                    size="lg"
                    variant="outline"
                    className="gap-2 border-white/30 text-white hover:bg-white/10"
                  >
                    <MessageCircle className="w-5 h-5" />
                    تواصل معنا
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Sticky mobile bottom CTA */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-card/95 backdrop-blur-md border-t shadow-2xl"
        dir="rtl"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-muted-foreground">السعر</div>
            <div className="text-sm font-black truncate">يُحدد بعد المراجعة</div>
          </div>
          <Button
            onClick={() => navigate(`/orders/new?service=${service.id}`)}
            className={`gap-2 rounded-full bg-gradient-to-r ${gradient} text-white border-0 shadow-lg px-6`}
            size="lg"
          >
            <ShoppingCart className="w-4 h-4" />
            اطلب الآن
          </Button>
        </div>
      </motion.div>
    </ClientLayout>
  );
};

export default ServiceDetail;
