import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Phone, Mail, Clock, Send, MessageCircle, Users, Award, Zap, MessageSquare,
  Globe2, Shield, CheckCircle2, Star, TrendingUp, HeartHandshake, Sparkles, 
  Building2, Target, Rocket, Facebook, Twitter, Instagram, Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import SEO from '@/components/SEO';
import contactHeroBackground from '@/assets/contact-hero-background.jpg';

const ContactUs = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    serviceType: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "خطأ في الإدخال",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-message', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          serviceType: formData.serviceType
        }
      });

      if (error) throw error;

      toast({
        title: "تم الإرسال بنجاح! ✅",
        description: "سنتواصل معك خلال 4 ساعات كحد أقصى",
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        serviceType: ''
      });
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      value: "info@masteredupath.com",
      description: "للاستفسارات العامة والدعم الفني"
    },
    {
      icon: Phone,
      title: "الهاتف والواتساب",
      value: "0559600824",
      description: "خطوط الدعم المتاحة للتواصل السريع والفعال"
    },
    {
      icon: MapPin,
      title: "العنوان",
      value: "المملكة العربية السعودية",
      description: "نخدم جميع مناطق المملكة"
    },
    {
      icon: Clock,
      title: "ساعات العمل",
      value: "السبت - الخميس: 10ص - 6م",
      description: "الجمعة: عطلة أسبوعية"
    }
  ];

  const services = [
    "الترجمة الأكاديمية",
    "الترجمة القانونية",
    "الترجمة الطبية",
    "الترجمة التجارية",
    "الترجمة التقنية",
    "خدمات البحث العلمي",
    "الاستشارات الأكاديمية",
    "خدمات التحرير والمراجعة",
    "خدمات النشر العلمي",
    "خدمات أخرى"
  ];

  const features = [
    {
      icon: Users,
      title: "فريق متخصص",
      description: "أكثر من 500 خبير أكاديمي ومترجم معتمد في جميع التخصصات",
      stats: "500+ خبير",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Award,
      title: "جودة معتمدة",
      description: "شهادات ISO وضمان جودة 100% مع مراجعة متعددة المستويات",
      stats: "100% ضمان",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: Zap,
      title: "سرعة في التسليم",
      description: "نلتزم بمواعيد التسليم المحددة مع إمكانية التسليم المستعجل",
      stats: "24/7 متاح",
      color: "from-orange-500 to-red-600"
    }
  ];

  const trustedPartners = [
    { name: "Harvard University", logo: "🎓" },
    { name: "MIT", logo: "🏛️" },
    { name: "Stanford", logo: "🌟" },
    { name: "Oxford", logo: "📚" },
    { name: "Cambridge", logo: "🎯" },
    { name: "Yale", logo: "🏆" }
  ];

  const achievements = [
    { icon: CheckCircle2, number: "10,000+", label: "مشروع منجز", color: "text-blue-500" },
    { icon: Users, number: "5,000+", label: "عميل راضٍ", color: "text-green-500" },
    { icon: Globe2, number: "50+", label: "دولة حول العالم", color: "text-purple-500" },
    { icon: Star, number: "4.9/5", label: "تقييم العملاء", color: "text-yellow-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10" dir="rtl">
      <SEO 
        title="تواصل معنا - MasterEduPath | استفسارات الخدمات الأكاديمية"
        description="تواصل مع فريق MasterEduPath للحصول على استشارة مجانية حول خدماتنا الأكاديمية والبحثية. نرد على استفساراتك خلال 4 ساعات. اتصل: +966559600824"
        keywords="تواصل معنا, استشارة أكاديمية مجانية, دعم عملاء MasterEduPath, استفسارات بحثية, خدمة عملاء 24/7"
        url="https://ac43130c-4bba-404a-ade5-b9d62d1f8904.lovableproject.com/contact-us"
        type="ContactPage"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "تواصل معنا - MasterEduPath",
          "description": "صفحة التواصل مع وكالة MasterEduPath",
          "mainEntity": {
            "@type": "Organization",
            "name": "MasterEduPath Agency",
            "telephone": "+966559600824",
            "email": "info@masteredupath.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "جدة",
              "addressCountry": "SA"
            }
          }
        }}
      />
      <Header />
      
      <main className="pt-16">
        {/* Hero Section with Animated Background */}
        <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${contactHeroBackground})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/90 backdrop-blur-[2px]" />
            </div>
            
            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * 600,
                  scale: Math.random() * 0.5 + 0.5
                }}
                animate={{ 
                  y: [null, Math.random() * -200],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: Math.random() * 3 + 2, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-5xl mx-auto"
            >
              {/* Animated Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring", bounce: 0.5 }}
                className="mb-6 sm:mb-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20">
                  <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
              </motion.div>

              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 text-white drop-shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <motion.span
                  initial={{ display: "inline-block" }}
                  animate={{ 
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.5)",
                      "0 0 40px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  تواصل معنا
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl sm:text-2xl lg:text-3xl text-white/95 mb-8 sm:mb-10 leading-relaxed drop-shadow-lg px-4 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                شريكك الموثوق في التميز الأكاديمي والبحثي
                <br />
                <span className="text-lg sm:text-xl text-white/80">نخدم عملاءنا على مدار الساعة بأعلى معايير الجودة</span>
              </motion.p>

              {/* Achievements Bar */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1 + 0.7,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <achievement.icon className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 ${achievement.color}`} />
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{achievement.number}</div>
                    <div className="text-xs sm:text-sm text-white/80">{achievement.label}</div>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Feature Badges */}
              <motion.div 
                className="flex flex-wrap justify-center gap-3 sm:gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50, rotate: -10 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ 
                      delay: index * 0.15 + 1,
                      duration: 0.6,
                      type: "spring"
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Badge variant="outline" className="px-5 sm:px-7 py-3 sm:py-4 text-sm sm:text-base font-semibold bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 transition-all duration-300 shadow-lg">
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                      {feature.title}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Trusted Partners Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-muted/30 via-background to-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 sm:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                <Sparkles className="inline-block w-6 h-6 sm:w-8 sm:h-8 mb-2 text-primary" />
                {" "}شركاؤنا حول العالم{" "}
                <Sparkles className="inline-block w-6 h-6 sm:w-8 sm:h-8 mb-2 text-accent" />
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                نفخر بثقة أفضل المؤسسات الأكاديمية العالمية
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {trustedPartners.map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.5,
                    type: "spring"
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -10,
                    rotateZ: [0, -5, 5, 0]
                  }}
                  className="relative group"
                >
                  <Card className="p-6 sm:p-8 hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 bg-card/60 backdrop-blur-sm">
                    <div className="text-center">
                      <motion.div 
                        className="text-4xl sm:text-5xl mb-3"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {partner.logo}
                      </motion.div>
                      <p className="text-xs sm:text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                        {partner.name}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-2 xl:order-1"
              >
                <Card className="shadow-2xl border-2 border-primary/20 bg-card/80 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 overflow-hidden relative group">
                  {/* Card Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardHeader className="text-center relative z-10 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-6 sm:p-8 border-b-2 border-primary/10">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="mb-4"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1">
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                          <Send className="w-7 h-7 sm:w-9 sm:h-9 text-primary" />
                        </div>
                      </div>
                    </motion.div>
                    
                    <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      أرسل رسالتك الآن
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-3 text-muted-foreground">
                      <Clock className="inline-block w-4 h-4 ml-1 text-primary" />
                      نضمن الرد خلال 4 ساعات كحد أقصى
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6 sm:p-8 relative z-10">
                    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-7">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="block text-sm font-medium mb-2 text-right">الاسم الكامل *</label>
                          <Input
                            type="text"
                            placeholder="اكتب اسمك الكامل"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                            className="h-10 sm:h-12 text-right"
                            dir="rtl"
                          />
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="block text-sm font-medium mb-2 text-right">البريد الإلكتروني *</label>
                          <Input
                            type="email"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                            className="h-10 sm:h-12 text-right"
                            dir="rtl"
                          />
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="block text-sm font-medium mb-2 text-right">رقم الهاتف</label>
                          <Input
                            type="tel"
                            placeholder="0559600824"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="h-10 sm:h-12 text-right"
                            dir="rtl"
                          />
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="block text-sm font-medium mb-2 text-right">نوع الخدمة</label>
                          <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                            <SelectTrigger className="h-10 sm:h-12 text-right" dir="rtl">
                              <SelectValue placeholder="اختر نوع الخدمة" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((service, index) => (
                                <SelectItem key={index} value={service} className="text-right">{service}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <label className="block text-sm font-medium mb-2 text-right">موضوع الرسالة</label>
                        <Input
                          type="text"
                          placeholder="اكتب موضوع رسالتك"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          className="h-10 sm:h-12 text-right"
                          dir="rtl"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <label className="block text-sm font-medium mb-2 text-right">محتوى الرسالة *</label>
                        <Textarea
                          placeholder="اكتب رسالتك بالتفصيل..."
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          required
                          className="min-h-28 sm:min-h-32 text-right resize-none"
                          dir="rtl"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          type="submit" 
                          className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 transition-all duration-500 shadow-2xl hover:shadow-3xl relative overflow-hidden group"
                          disabled={loading}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          {loading ? (
                            <div className="flex items-center gap-3 relative z-10">
                              <span>جار الإرسال...</span>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 justify-center relative z-10">
                              <Rocket className="w-6 h-6" />
                              <span>إرسال الرسالة الآن</span>
                              <Sparkles className="w-5 h-5" />
                            </div>
                          )}
                        </Button>
                      </motion.div>

                      {/* Trust Indicators */}
                      <motion.div 
                        className="flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-500" />
                          <span>محمي بالكامل</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-500" />
                          <span>استجابة سريعة</span>
                        </div>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6 sm:space-y-8 order-1 xl:order-2"
              >
                <motion.div 
                  className="text-center xl:text-right"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="inline-block mb-4"
                  >
                    <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30">
                      <Phone className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                    </div>
                  </motion.div>
                  
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    معلومات التواصل
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    <HeartHandshake className="inline-block w-5 h-5 ml-1 text-primary" />
                    نحن متواجدون دائماً لخدمتك
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-4 sm:gap-5">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 50, scale: 0.8, rotate: 5 }}
                      whileInView={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: index * 0.15,
                        duration: 0.6,
                        type: "spring"
                      }}
                      whileHover={{ scale: 1.03, y: -5, rotate: -1 }}
                    >
                      <Card className="p-5 sm:p-7 hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl hover:from-card/80 hover:to-card/60 relative overflow-hidden group">
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        
                        <div className="flex items-start gap-4 sm:gap-5 relative z-10">
                          <motion.div 
                            className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 shadow-lg"
                            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <info.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                          </motion.div>
                          <div className="flex-1 text-right">
                            <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                              {info.title}
                            </h3>
                            {info.title === "الهاتف والواتساب" ? (
                              <div className="space-y-2 sm:space-y-3">
                                <div className="bg-primary/5 rounded-lg p-2 sm:p-3 border border-primary/20">
                                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                                    <a 
                                      href="tel:0559600824" 
                                      className="text-primary hover:text-secondary transition-colors font-medium text-sm sm:text-base"
                                      dir="ltr"
                                    >
                                      0559600824
                                    </a>
                                    <span className="text-xs sm:text-sm font-semibold text-primary">الرقم الأساسي</span>
                                  </div>
                                  <a 
                                    href="https://wa.me/966559600824" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-700 transition-colors font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                                  >
                                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                                    واتساب
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <p className="text-primary font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                                {info.value}
                              </p>
                            )}
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {info.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Social Media Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-8"
                >
                  <Card className="p-6 sm:p-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 hover:border-primary/30 transition-all duration-500">
                    <div className="text-center space-y-5">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <div className="inline-flex items-center gap-2 mb-3">
                          <Sparkles className="w-6 h-6 text-primary" />
                          <h3 className="text-xl sm:text-2xl font-bold">تابعنا على وسائل التواصل</h3>
                          <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">كن على اطلاع بآخر الأخبار والعروض الحصرية</p>
                      </motion.div>
                      
                      <div className="flex justify-center gap-4 flex-wrap">
                        {[
                          { 
                            Icon: Facebook, 
                            href: "https://facebook.com/masteredupath", 
                            label: "فيسبوك",
                            color: "from-blue-500 to-blue-700",
                            hoverColor: "hover:shadow-blue-500/50"
                          },
                          { 
                            Icon: Twitter, 
                            href: "https://twitter.com/masteredupath", 
                            label: "تويتر",
                            color: "from-sky-400 to-sky-600",
                            hoverColor: "hover:shadow-sky-500/50"
                          },
                          { 
                            Icon: Instagram, 
                            href: "https://instagram.com/masteredupath", 
                            label: "انستغرام",
                            color: "from-pink-500 to-purple-600",
                            hoverColor: "hover:shadow-pink-500/50"
                          },
                          { 
                            Icon: Linkedin, 
                            href: "https://linkedin.com/company/masteredupath", 
                            label: "لينكدإن",
                            color: "from-blue-600 to-blue-800",
                            hoverColor: "hover:shadow-blue-700/50"
                          }
                        ].map(({ Icon, href, label, color, hoverColor }, idx) => (
                          <motion.a
                            key={idx}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg ${hoverColor} hover:shadow-xl transition-all duration-300`}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-foreground">
                              {label}
                            </span>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Why Choose Us Section */}
                <motion.div 
                  className="space-y-6 sm:space-y-8 mt-10 sm:mt-14"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div 
                    className="text-center xl:text-right"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="inline-block mb-4"
                    >
                      <div className="p-3 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20">
                        <Target className="w-8 h-8 text-primary" />
                      </div>
                    </motion.div>
                    
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      <Star className="inline-block w-6 h-6 sm:w-8 sm:h-8 mb-1 text-yellow-500" />
                      {" "}لماذا تختارنا؟{" "}
                      <Star className="inline-block w-6 h-6 sm:w-8 sm:h-8 mb-1 text-yellow-500" />
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      المزايا التي تجعلنا الخيار الأول والأفضل
                    </p>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:gap-5">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 30, scale: 0.8, rotate: -5 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: index * 0.15,
                          duration: 0.6,
                          type: "spring"
                        }}
                        whileHover={{ scale: 1.05, y: -5, rotate: 2 }}
                      >
                        <Card className="p-5 sm:p-7 hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 hover:from-primary/20 hover:via-secondary/10 hover:to-accent/20 group relative overflow-hidden">
                          {/* Animated Background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          
                          <div className="flex items-center gap-4 text-right relative z-10">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <Badge className={`bg-gradient-to-r ${feature.color} text-white text-xs sm:text-sm px-3 py-1.5 shadow-lg`}>
                                    <TrendingUp className="w-3 h-3 ml-1" />
                                    {feature.stats}
                                  </Badge>
                                </motion.div>
                                <h4 className="font-bold text-base sm:text-lg group-hover:text-primary transition-colors duration-300">
                                  {feature.title}
                                </h4>
                              </div>
                              <p className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300 leading-relaxed">
                                {feature.description}
                              </p>
                            </div>
                            <motion.div 
                              className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${feature.color} shadow-xl`}
                              whileHover={{ 
                                rotate: [0, -10, 10, -10, 10, 0],
                                scale: 1.15
                              }}
                              transition={{ duration: 0.6 }}
                            >
                              <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </motion.div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Response Time Alert */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring" }}
                    whileHover={{ scale: 1.03, y: -5 }}
                  >
                    <Card className="p-6 sm:p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-2 border-green-300 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600 transition-all duration-500 relative overflow-hidden group shadow-lg hover:shadow-2xl">
                      {/* Animated Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <motion.div
                          animate={{ 
                            backgroundPosition: ["0% 0%", "100% 100%"]
                          }}
                          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                          className="w-full h-full"
                          style={{
                            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                          }}
                        />
                      </div>
                      
                      <div className="text-center relative z-10">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                          className="inline-block mb-4"
                        >
                          <div className="p-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-xl">
                            <Zap className="w-8 h-8 text-white" />
                          </div>
                        </motion.div>
                        
                        <h4 className="font-bold text-green-800 dark:text-green-200 text-xl sm:text-2xl mb-2 flex items-center justify-center gap-3">
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            ⚡
                          </motion.span>
                          استجابة فورية وسريعة
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                          >
                            ⚡
                          </motion.span>
                        </h4>
                        <p className="text-sm sm:text-base text-green-700 dark:text-green-300 leading-relaxed">
                          نضمن لك الرد على استفسارك خلال{" "}
                          <motion.span 
                            className="font-bold text-lg text-green-900 dark:text-green-100"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            4 ساعات كحد أقصى
                          </motion.span>{" "}
                          <br className="hidden sm:block" />
                          خلال أوقات العمل الرسمية
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactUs;