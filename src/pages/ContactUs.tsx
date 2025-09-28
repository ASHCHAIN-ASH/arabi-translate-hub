import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Users, Award, Zap, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
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

      // Reset form
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
      description: "للاستفسارات العامة والدعم الفني",
      action: "mailto:info@masteredupath.com"
    },
    {
      icon: Phone,
      title: "الهاتف والواتساب",
      value: "0500776343 | 0559600824",
      description: "خطوط الدعم المتاحة للتواصل السريع والفعال",
      action: null
    },
    {
      icon: MapPin,
      title: "العنوان",
      value: "المملكة العربية السعودية",
      description: "نخدم جميع مناطق المملكة",
      action: null
    },
    {
      icon: Clock,
      title: "ساعات العمل",
      value: "السبت - الخميس: 10ص - 6م",
      description: "الجمعة: عطلة أسبوعية",
      action: null
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
    },
    {
      icon: MessageCircle,
      title: "دعم مستمر",
      description: "فريق دعم متخصص متاح على مدار الساعة لخدمتكم",
      stats: "دعم فوري",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: Badge,
      title: "خبرة واسعة", 
      description: "أكثر من 15 عاماً في مجال الترجمة والخدمات الأكاديمية",
      stats: "15+ عام خبرة",
      color: "from-indigo-500 to-blue-600"
    },
    {
      icon: Users,
      title: "عملاء راضون",
      description: "أكثر من 10,000 عميل راضٍ حول العالم مع تقييم 5 نجوم",
      stats: "10k+ عميل",
      color: "from-emerald-500 to-cyan-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20" dir="rtl">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center relative overflow-hidden min-h-[600px] flex items-center">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${contactHeroBackground})`,
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-secondary/70 to-accent/80 backdrop-blur-[1px]" />
          </div>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-60 h-60 bg-secondary/20 rounded-full blur-3xl"
              animate={{
                x: [0, -40, 0],
                y: [0, 30, 0],
                scale: [1, 0.9, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="container mx-auto max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                تواصل معنا
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed drop-shadow-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                نحن هنا لخدمتك على مدار الساعة. تواصل معنا للحصول على أفضل خدمات الترجمة والبحث الأكاديمي
              </motion.p>
              
              <motion.div 
                className="flex justify-center gap-4 flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <AnimatePresence>
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.5, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: -50 }}
                      transition={{ 
                        delay: index * 0.15 + 0.8,
                        duration: 0.6,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge variant="outline" className="px-6 py-3 text-base font-medium bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 transition-colors cursor-default">
                        {feature.title}
                        <feature.icon className="w-5 h-5 ml-2" />
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="order-2 lg:order-1"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <Card className="shadow-2xl border-0 bg-card/60 backdrop-blur-md hover:shadow-3xl transition-all duration-500 overflow-hidden relative">
                  {/* Animated border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 animate-pulse opacity-50" />
                  
                  <CardHeader className="text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 relative z-10">
                    <motion.div
                      initial={{ rotate: -10, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                    >
                      <CardTitle className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <MessageCircle className="w-8 h-8 text-primary" />
                        </motion.div>
                        أرسل رسالتك
                      </CardTitle>
                    </motion.div>
                    <CardDescription className="text-base mt-2">
                      املأ النموذج أدناه وسنتواصل معك خلال 4 ساعات كحد أقصى
                    </CardDescription>
                  </CardHeader>
                
                <CardContent className="space-y-6 p-8 relative z-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <label className="block text-sm font-medium mb-2 text-right">الاسم الكامل *</label>
                        <motion.div whileFocus={{ scale: 1.02 }}>
                          <Input
                            type="text"
                            placeholder="اكتب اسمك الكامل"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                            className="h-12 text-right focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                            dir="rtl"
                          />
                        </motion.div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <label className="block text-sm font-medium mb-2 text-right">البريد الإلكتروني *</label>
                        <motion.div whileFocus={{ scale: 1.02 }}>
                          <Input
                            type="email"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                            className="h-12 text-right focus:ring-2 focus:ring-secondary/50 transition-all duration-300"
                            dir="rtl"
                          />
                        </motion.div>
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0, duration: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <label className="block text-sm font-medium mb-2 text-right">رقم الهاتف</label>
                        <motion.div whileFocus={{ scale: 1.02 }}>
                          <Input
                            type="tel"
                            placeholder="0500776343"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="h-12 text-right focus:ring-2 focus:ring-accent/50 transition-all duration-300"
                            dir="rtl"
                          />
                        </motion.div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1, duration: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <label className="block text-sm font-medium mb-2 text-right">نوع الخدمة</label>
                        <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                          <SelectTrigger className="h-12 text-right" dir="rtl">
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
                      transition={{ delay: 1.2, duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-right">موضوع الرسالة</label>
                      <motion.div whileFocus={{ scale: 1.02 }}>
                        <Input
                          type="text"
                          placeholder="اكتب موضوع رسالتك"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          className="h-12 text-right focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                          dir="rtl"
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3, duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-right">محتوى الرسالة *</label>
                      <motion.div whileFocus={{ scale: 1.02 }}>
                        <Textarea
                          placeholder="اكتب رسالتك بالتفصيل..."
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          required
                          className="min-h-32 text-right resize-none focus:ring-2 focus:ring-secondary/50 transition-all duration-300"
                          dir="rtl"
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4, duration: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 transition-all duration-500 shadow-lg hover:shadow-xl relative overflow-hidden group"
                        disabled={loading}
                      >
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                        
                        <div className="relative z-10">
                          {loading ? (
                            <motion.div 
                              className="flex items-center gap-3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <span>جار الإرسال...</span>
                              <motion.div 
                                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                            </motion.div>
                          ) : (
                            <motion.div 
                              className="flex items-center gap-3 justify-center"
                              whileHover={{ x: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <span>إرسال الرسالة</span>
                              <Send className="w-6 h-6" />
                            </motion.div>
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-8 order-1 lg:order-2"
            >
              <motion.div 
                className="text-center lg:text-right"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  معلومات التواصل
                </h2>
                <p className="text-lg text-muted-foreground">
                  تواصل معنا عبر إحدى الطرق التالية
                </p>
              </motion.div>

              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -50, scale: 0.9 }}
                      transition={{ 
                        delay: index * 0.1 + 0.9,
                        duration: 0.6,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {info.action ? (
                        <a 
                          href={info.action}
                          target={info.action.startsWith('http') ? "_blank" : "_self"}
                          rel={info.action.startsWith('http') ? "noopener noreferrer" : ""}
                          className="block"
                        >
                          <Card className="p-6 hover:shadow-xl transition-all duration-500 border-0 bg-card/40 backdrop-blur-lg hover:bg-card/60 cursor-pointer group relative overflow-hidden">
                            {/* Animated background on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            
                            <div className="flex items-start gap-4 relative z-10">
                              <motion.div 
                                className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300"
                                whileHover={{ rotate: 10, scale: 1.1 }}
                              >
                                <info.icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors duration-300" />
                              </motion.div>
                              <div className="flex-1 text-right">
                                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                                  {info.title}
                                </h3>
                                {info.title === "الهاتف والواتساب" ? (
                                  <div className="space-y-4 text-right w-full">
                                    {/* الرقم الأساسي */}
                                    <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <a 
                                            href="tel:0500776343" 
                                            className="text-primary hover:text-secondary transition-colors font-medium"
                                            dir="ltr"
                                          >
                                            0500776343
                                          </a>
                                          <Phone className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-semibold text-primary">الرقم الأساسي</span>
                                      </div>
                                      <div className="flex items-center justify-between mt-2">
                                        <a 
                                          href="https://wa.me/9660500776343" 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-green-600 hover:text-green-700 transition-colors font-medium flex items-center gap-2"
                                        >
                                          <MessageSquare className="w-4 h-4" />
                                          واتساب
                                        </a>
                                        <span className="text-xs text-muted-foreground">متاح 24/7</span>
                                      </div>
                                    </div>
                                    
                                    {/* الرقم الثانوي */}
                                    <div className="bg-secondary/5 rounded-lg p-3 border border-secondary/20">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <a 
                                            href="tel:0559600824" 
                                            className="text-secondary hover:text-primary transition-colors font-medium"
                                            dir="ltr"
                                          >
                                            0559600824
                                          </a>
                                          <Phone className="w-4 h-4 text-secondary" />
                                        </div>
                                        <span className="text-sm font-semibold text-secondary">الرقم الثانوي</span>
                                      </div>
                                      <div className="flex items-center justify-between mt-2">
                                        <a 
                                          href="https://wa.me/9660559600824" 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-green-600 hover:text-green-700 transition-colors font-medium flex items-center gap-2"
                                        >
                                          <MessageSquare className="w-4 h-4" />
                                          واتساب
                                        </a>
                                        <span className="text-xs text-muted-foreground">أوقات العمل</span>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-primary font-medium mb-2 group-hover:text-secondary transition-colors duration-300">
                                    {info.value}
                                  </p>
                                )}
                                <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 mt-2">
                                  {info.description}
                                </p>
                              </div>
                            </div>
                          </Card>
                        </a>
                      ) : (
                        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-card/40 backdrop-blur-sm hover:bg-card/60">
                          <div className="flex items-start gap-4">
                            <motion.div 
                              className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
                              whileHover={{ rotate: 10, scale: 1.1 }}
                            >
                              <info.icon className="w-6 h-6 text-primary" />
                            </motion.div>
                            <div className="flex-1 text-right">
                              <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                              <p className="text-primary font-medium mb-2">{info.value}</p>
                              <p className="text-sm text-muted-foreground">{info.description}</p>
                            </div>
                          </div>
                        </Card>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Features Cards */}
              <motion.div 
                className="space-y-6 mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                  className="text-center mb-8"
                >
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    لماذا تختارنا؟
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    اكتشف المزايا التي تجعلنا الخيار الأول للخدمات الأكاديمية والترجمة
                  </p>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, scale: 0.8 }}
                        transition={{ 
                          delay: index * 0.2 + 1.8,
                          duration: 0.7,
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          y: -10,
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card className="p-6 hover:shadow-2xl transition-all duration-500 border-0 bg-card/40 backdrop-blur-lg hover:bg-card/60 group relative overflow-hidden h-full">
                          {/* Animated gradient background */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                          
                          {/* Floating particles effect */}
                          <div className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
                          <div className="absolute bottom-6 left-6 w-1 h-1 bg-secondary/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                          
                          <div className="relative z-10 text-right h-full flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                              <motion.div 
                                className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}
                                whileHover={{ 
                                  rotate: [0, -10, 10, -5, 0], 
                                  scale: 1.1,
                                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                                }}
                                transition={{ duration: 0.6 }}
                              >
                                <feature.icon className="w-6 h-6 text-white" />
                              </motion.div>
                              
                              <div className="text-right flex-1">
                                <motion.div
                                  className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${feature.color} text-white text-xs font-bold mb-2`}
                                  animate={{ 
                                    scale: [1, 1.05, 1],
                                  }}
                                  transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                >
                                  {feature.stats}
                                </motion.div>
                                <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                                  {feature.title}
                                </h4>
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">
                                {feature.description}
                              </p>
                            </div>
                            
                            {/* Progress bar animation */}
                            <motion.div 
                              className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.div 
                                className={`h-full bg-gradient-to-r ${feature.color} rounded-full`}
                                initial={{ width: "0%" }}
                                whileHover={{ width: "100%" }}
                                transition={{ duration: 1, delay: 0.2 }}
                              />
                            </motion.div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                {/* Additional Benefits Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.0, duration: 0.8 }}
                  className="mt-12 p-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl border border-primary/10"
                >
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-primary mb-2">✨ مزايا إضافية</h4>
                    <p className="text-muted-foreground">خدمات متميزة تضمن تجربة استثنائية</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <motion.div 
                      className="p-4"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-2xl mb-2">🔒</div>
                      <h5 className="font-semibold mb-1">سرية تامة</h5>
                      <p className="text-sm text-muted-foreground">حماية كاملة لبياناتك ومشاريعك</p>
                    </motion.div>
                    
                    <motion.div 
                      className="p-4"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-2xl mb-2">🎯</div>
                      <h5 className="font-semibold mb-1">دقة عالية</h5>
                      <p className="text-sm text-muted-foreground">مراجعة دقيقة من قبل خبراء متخصصين</p>
                    </motion.div>
                    
                    <motion.div 
                      className="p-4"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-2xl mb-2">💎</div>
                      <h5 className="font-semibold mb-1">أسعار تنافسية</h5>
                      <p className="text-sm text-muted-foreground">جودة عالية بأسعار معقولة</p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Response Time Alert */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.8, type: "spring" }}
                whileHover={{ scale: 1.02, y: -3 }}
              >
                <Card className="p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-green-200 hover:border-green-300 transition-all duration-500 relative overflow-hidden group">
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-emerald-100/50 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                  
                  <div className="text-center relative z-10">
                    <motion.h4 
                      className="font-bold text-green-800 text-lg mb-2 flex items-center justify-center gap-2"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        ⚡
                      </motion.span>
                      استجابة سريعة
                    </motion.h4>
                    <p className="text-green-700 group-hover:text-green-800 transition-colors duration-300">
                      نضمن لك الرد على استفسارك خلال{" "}
                      <motion.span 
                        className="font-bold text-green-900"
                        animate={{ 
                          textShadow: [
                            "0 0 0px rgba(34, 197, 94, 0)",
                            "0 0 10px rgba(34, 197, 94, 0.5)",
                            "0 0 0px rgba(34, 197, 94, 0)"
                          ]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        4 ساعات كحد أقصى
                      </motion.span>{" "}
                      خلال أوقات العمل الرسمية
                    </p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;