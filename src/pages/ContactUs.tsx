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
      value: "0500776343 | 0559600824",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10" dir="rtl">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${contactHeroBackground})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-secondary/70 to-accent/80 backdrop-blur-[1px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white drop-shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                تواصل معنا
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed drop-shadow-md px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                نحن هنا لخدمتك على مدار الساعة. تواصل معنا للحصول على أفضل خدمات الترجمة والبحث الأكاديمي
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap justify-center gap-3 sm:gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.15 + 0.8,
                      duration: 0.6,
                      type: "spring"
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge variant="outline" className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 transition-colors">
                      {feature.title}
                      <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="order-2 xl:order-1"
              >
                <Card className="shadow-2xl border-0 bg-card/60 backdrop-blur-md hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  <CardHeader className="text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-6 sm:p-8">
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center justify-center gap-3">
                      <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      أرسل رسالتك
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-2">
                      املأ النموذج أدناه وسنتواصل معك خلال 4 ساعات كحد أقصى
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                            placeholder="0500776343"
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
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          type="submit" 
                          className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 transition-all duration-500 shadow-lg hover:shadow-xl"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="flex items-center gap-3">
                              <span>جار الإرسال...</span>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 justify-center">
                              <span>إرسال الرسالة</span>
                              <Send className="w-5 h-5" />
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="space-y-6 sm:space-y-8 order-1 xl:order-2"
              >
                <div className="text-center xl:text-right">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    معلومات التواصل
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    تواصل معنا عبر إحدى الطرق التالية
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ 
                        delay: index * 0.1 + 0.7,
                        duration: 0.6
                      }}
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <Card className="p-4 sm:p-6 hover:shadow-xl transition-all duration-500 border-0 bg-card/40 backdrop-blur-lg hover:bg-card/60">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <motion.div 
                            className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                          >
                            <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
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
                                      href="tel:0500776343" 
                                      className="text-primary hover:text-secondary transition-colors font-medium text-sm sm:text-base"
                                      dir="ltr"
                                    >
                                      0500776343
                                    </a>
                                    <span className="text-xs sm:text-sm font-semibold text-primary">الرقم الأساسي</span>
                                  </div>
                                  <a 
                                    href="https://wa.me/9660500776343" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-700 transition-colors font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                                  >
                                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                                    واتساب
                                  </a>
                                </div>
                                
                                <div className="bg-secondary/5 rounded-lg p-2 sm:p-3 border border-secondary/20">
                                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                                    <a 
                                      href="tel:0559600824" 
                                      className="text-secondary hover:text-primary transition-colors font-medium text-sm sm:text-base"
                                      dir="ltr"
                                    >
                                      0559600824
                                    </a>
                                    <span className="text-xs sm:text-sm font-semibold text-secondary">الرقم الثانوي</span>
                                  </div>
                                  <a 
                                    href="https://wa.me/9660559600824" 
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

                {/* Why Choose Us Section */}
                <motion.div 
                  className="space-y-4 sm:space-y-6 mt-8 sm:mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  <div className="text-center xl:text-right">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      لماذا تختارنا؟
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      اكتشف المزايا التي تجعلنا الخيار الأول
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 30, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ 
                          delay: index * 0.15 + 1.4,
                          duration: 0.6
                        }}
                        whileHover={{ scale: 1.03, y: -3 }}
                      >
                        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-500 border-0 bg-gradient-to-r from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 group">
                          <div className="flex items-center gap-3 text-right">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1 sm:mb-2">
                                <Badge className={`bg-gradient-to-r ${feature.color} text-white text-xs px-2 py-1`}>
                                  {feature.stats}
                                </Badge>
                                <h4 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors duration-300">
                                  {feature.title}
                                </h4>
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                                {feature.description}
                              </p>
                            </div>
                            <motion.div 
                              className={`p-2 sm:p-3 rounded-full bg-gradient-to-br ${feature.color} shadow-lg`}
                              whileHover={{ rotate: 360, scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                            >
                              <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </motion.div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Response Time Alert */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 2.0, duration: 0.8 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <Card className="p-4 sm:p-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-green-200 hover:border-green-300 transition-all duration-500 relative overflow-hidden group">
                      <div className="text-center">
                        <h4 className="font-bold text-green-800 text-base sm:text-lg mb-1 sm:mb-2 flex items-center justify-center gap-2">
                          <span>⚡</span>
                          استجابة سريعة
                        </h4>
                        <p className="text-xs sm:text-sm text-green-700">
                          نضمن لك الرد على استفسارك خلال{" "}
                          <span className="font-bold">4 ساعات كحد أقصى</span>{" "}
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