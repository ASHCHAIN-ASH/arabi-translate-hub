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
  Zap, RefreshCw, FileText
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

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      const { data: svc } = await supabase.from('services').select('*').eq('id', id).maybeSingle();
      if (svc) {
        setService(svc);
        if (svc.category_id) {
          const [catRes, relatedRes] = await Promise.all([
            supabase.from('service_categories').select('*').eq('id', svc.category_id).maybeSingle(),
            supabase.from('services').select('*').eq('category_id', svc.category_id).eq('is_active', true).neq('id', id).limit(4),
          ]);
          if (catRes.data) setCategory(catRes.data);
          if (relatedRes.data) setRelatedServices(relatedRes.data);
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

  const features = [
    { icon: Shield, title: 'سرية تامة', desc: 'نضمن حماية بياناتك وخصوصية عملك بالكامل' },
    { icon: Award, title: 'جودة عالية', desc: 'فريق متخصص يضمن أعلى معايير الجودة' },
    { icon: Zap, title: 'تنفيذ سريع', desc: 'نلتزم بالمواعيد المتفق عليها دون تأخير' },
    { icon: Clock, title: 'دعم مستمر', desc: 'فريق الدعم متاح لمتابعة طلبك حتى الاستلام' },
  ];

  return (
    <ClientLayout>
      <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6" dir="rtl">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/client-services')} className="gap-2 text-muted-foreground">
            <ArrowRight className="w-4 h-4" />
            العودة لخدماتنا
          </Button>
        </motion.div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="h-2 bg-gradient-to-r from-primary to-blue-600" />
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  {category && (
                    <Badge variant="outline" className="text-xs">{category.name_ar || category.name}</Badge>
                  )}
                  <h1 className="text-2xl lg:text-3xl font-bold">{service.name_ar || service.name}</h1>
                  {service.description && (
                    <p className="text-muted-foreground leading-relaxed max-w-xl">{service.description}</p>
                  )}
                  {service.unit && (
                    <p className="text-sm text-muted-foreground">
                      وحدة القياس: <span className="font-medium text-foreground">{service.unit}</span>
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  <div className="bg-muted/50 rounded-2xl p-5 text-center space-y-3 min-w-[200px]">
                    <p className="text-sm text-muted-foreground">السعر</p>
                    <p className="text-lg font-bold text-primary">يُحدد بعد المراجعة</p>
                    <Button
                      onClick={() => navigate(`/orders/new?service=${service.id}`)}
                      className="w-full gap-2 shadow-md"
                      size="lg"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      اطلب الآن
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {features.map((f, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* How it works */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold mb-5">كيف تطلب هذه الخدمة؟</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { step: '1', title: 'أرسل طلبك', desc: 'اضغط "اطلب الآن" وأضف ملاحظاتك ومرفقاتك' },
                  { step: '2', title: 'استلم عرض السعر', desc: 'سيراجع فريقنا الطلب ويرسل لك عرض سعر مفصل' },
                  { step: '3', title: 'استلم العمل', desc: 'بعد موافقتك يبدأ التنفيذ وتستلم العمل بالجودة المطلوبة' },
                ].map((s, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{s.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-lg font-bold mb-4">خدمات مشابهة</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {relatedServices.map((rs) => (
                <Card
                  key={rs.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border hover:border-primary/20"
                  onClick={() => navigate(`/client-services/${rs.id}`)}
                >
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-bold text-sm line-clamp-2">{rs.name_ar || rs.name}</h3>
                    {rs.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{rs.description}</p>
                    )}
                    <Button size="sm" variant="ghost" className="w-full gap-1 text-primary text-xs mt-2">
                      <CheckCircle className="w-3 h-3" />
                      عرض التفاصيل
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-950/20">
            <CardContent className="p-6 text-center space-y-3">
              <h2 className="text-lg font-bold">جاهز لبدء طلبك؟</h2>
              <p className="text-sm text-muted-foreground">أرسل طلبك الآن وسيتواصل معك فريقنا خلال ساعات</p>
              <Button onClick={() => navigate(`/orders/new?service=${service.id}`)} size="lg" className="gap-2 shadow-md">
                <ShoppingCart className="w-5 h-5" />
                اطلب الخدمة الآن
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ClientLayout>
  );
};

export default ServiceDetail;
