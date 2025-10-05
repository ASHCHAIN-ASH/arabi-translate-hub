import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton';
import { Award, CheckCircle, ArrowRight, Sparkles, Layout, Download, Palette, FileType, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function PremiumTemplates() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    details: ''
  });

  const whatsappNumber = '+966500647447';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('send-student-service-order', {
        body: {
          ...formData,
          serviceTitle: 'قوالب خدمات ممتازة',
          serviceType: 'premium-templates'
        }
      });

      if (error) throw error;

      toast({
        title: "تم إرسال الطلب بنجاح",
        description: "سنتواصل معك قريباً",
      });

      setFormData({ fullName: '', email: '', phone: '', specialization: '', details: '' });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <FloatingWhatsAppButton />
      
      <div className="container px-4 mx-auto pt-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 hover:gap-3 transition-all">
          <ArrowRight className="w-4 h-4 rotate-180" />
          رجوع
        </Button>
      </div>
      
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-amber-500/10 to-yellow-600/10"></div>
        
        <div className="container relative z-10 px-4 mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl shadow-lg"
            >
              <Award className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              قوالب خدمات ممتازة
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              قوالب احترافية جاهزة لجميع أنواع الخدمات الأكاديمية بتصاميم متميزة
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">ما نقدمه في القوالب الممتازة</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Sparkles, title: 'تصاميم فاخرة', description: 'قوالب بتصاميم احترافية ومميزة' },
                { icon: Layout, title: 'تنوع كبير', description: 'قوالب لجميع أنواع الأعمال الأكاديمية' },
                { icon: Palette, title: 'قابلة للتخصيص', description: 'إمكانية تعديل القوالب حسب الحاجة' },
                { icon: FileType, title: 'صيغ متعددة', description: 'متاحة بصيغ Word وPowerPoint وغيرها' },
                { icon: Download, title: 'سهولة الاستخدام', description: 'قوالب سهلة وجاهزة للتحميل والاستخدام' },
                { icon: Star, title: 'جودة عالمية', description: 'قوالب بمعايير جودة عالمية' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all bg-card/80 backdrop-blur-sm">
                    <feature.icon className="w-12 h-12 text-amber-600 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-8 rounded-2xl border border-green-200 mb-12">
              <h3 className="text-2xl font-bold mb-4 text-center">📱 للتواصل الفوري عبر واتساب</h3>
              <div className="text-center">
                <a 
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:shadow-xl transition-all"
                >
                  {whatsappNumber} 💬
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Card className="p-8 shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-center">اطلب الخدمة الآن</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="fullName">الاسم الكامل *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">رقم الجوال *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialization">نوع القالب المطلوب</Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="mt-2"
                      placeholder="مثال: قالب بحث، عرض تقديمي، تقرير، إلخ..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="details">تفاصيل القالب المطلوب *</Label>
                    <Textarea
                      id="details"
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      required
                      rows={5}
                      className="mt-2"
                      placeholder="يرجى ذكر نوع القالب، الغرض منه، التفاصيل المطلوبة، الصيغة المفضلة، وأي متطلبات خاصة..."
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white py-6 text-lg font-bold">
                    {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
