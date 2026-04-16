import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import {
  ArrowRight, ShoppingCart, CheckCircle, Clock, Shield, Award,
  Zap, RefreshCw, FileText, Star, HeadphonesIcon, Eye,
  BookOpen, PenTool, Printer, BarChart3, GraduationCap,
  Languages, Mic, Globe, Video, Layers, Target, Lightbulb,
  MessageCircle, ThumbsUp, Lock, Truck
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

  const gradient = gradients[catIndex % gradients.length];
  const IconComp = getServiceIcon(service);

  const features = [
    { icon: Shield, title: 'سرية تامة', desc: 'نضمن حماية بياناتك وخصوصية عملك بالكامل', color: 'text-blue-600' },
    { icon: Award, title: 'جودة عالية', desc: 'فريق متخصص يضمن أعلى معايير الجودة الأكاديمية', color: 'text-amber-600' },
    { icon: Zap, title: 'تنفيذ سريع', desc: 'نلتزم بالمواعيد المتفق عليها دون أي تأخير', color: 'text-emerald-600' },
    { icon: HeadphonesIcon, title: 'دعم مستمر', desc: 'فريق الدعم متاح لمتابعة طلبك حتى الاستلام النهائي', color: 'text-violet-600' },
    { icon: Lock, title: 'حماية الملكية', desc: 'حقوق الملكية الفكرية محفوظة بالكامل لك', color: 'text-rose-600' },
    { icon: ThumbsUp, title: 'رضا مضمون', desc: 'نضمن رضاك التام مع إمكانية التعديل المجاني', color: 'text-cyan-600' },
  ];

  const steps = [
    { step: '1', title: 'أرسل طلبك', desc: 'اضغط "اطلب الآن" وأرفق ملاحظاتك وملفاتك', icon: ShoppingCart },
    { step: '2', title: 'استلم عرض السعر', desc: 'يراجع الفريق طلبك ويرسل عرض سعر مفصل', icon: FileText },
    { step: '3', title: 'المتابعة والتنفيذ', desc: 'تابع حالة طلبك لحظة بلحظة من لوحتك', icon: Eye },
    { step: '4', title: 'استلم العمل', desc: 'استلم العمل بالجودة المطلوبة وراجعه', icon: Truck },
  ];

  return (
    <ClientLayout>
      <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6" dir="rtl">
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

        {/* Hero Card */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className={`bg-gradient-to-r ${gradient} p-6 sm:p-8 text-white relative overflow-hidden`}>
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-16 translate-y-16 blur-2xl" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
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
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                    {service.name_ar || service.name}
                  </h1>
                  {service.description && (
                    <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-2xl">
                      {service.description}
                    </p>
                  )}
                  {service.unit && (
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Layers className="w-4 h-4" />
                      وحدة القياس: <span className="font-bold text-white">{service.unit}</span>
                    </div>
                  )}
                </div>

                {/* Order CTA */}
                <div className="shrink-0">
                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 text-center space-y-4 min-w-[220px] border border-white/20">
                    <div className="flex items-center justify-center gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                      ))}
                    </div>
                    <p className="text-sm text-white/80">موثوق من آلاف العملاء</p>
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
                    <p className="text-[11px] text-white/50">بدون التزام — احصل على عرض سعر مجاني</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            لماذا تختار هذه الخدمة؟
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <Card className="h-full border shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4 space-y-2.5">
                    <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center`}>
                      <f.icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <h3 className="font-bold text-sm">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How it works - Timeline */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-muted/30 px-6 py-4 border-b">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                كيف تطلب هذه الخدمة؟
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {steps.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="relative text-center"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                      <s.icon className="w-6 h-6" />
                    </div>
                    <div className="absolute top-7 left-0 right-[60%] h-0.5 bg-border hidden lg:block" style={{ display: i === 0 ? 'none' : undefined }} />
                    <h3 className="font-bold text-sm mb-1">{s.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                    <Badge variant="outline" className="mt-2 text-[10px]">الخطوة {s.step}</Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats / Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {[
            { value: '99%', label: 'نسبة الرضا', icon: ThumbsUp },
            { value: '24/7', label: 'دعم متواصل', icon: HeadphonesIcon },
            { value: '+5000', label: 'مشروع منجز', icon: CheckCircle },
            { value: '100%', label: 'سرية مضمونة', icon: Lock },
          ].map((stat, i) => (
            <Card key={i} className="border-0 bg-muted/30">
              <CardContent className="p-4 text-center">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xl font-black text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
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
                            <RsIcon className="w-4.5 h-4.5 text-primary" />
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
          <Card className={`border-0 shadow-xl overflow-hidden`}>
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
    </ClientLayout>
  );
};

export default ServiceDetail;
