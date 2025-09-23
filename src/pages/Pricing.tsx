import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Check, 
  Star, 
  Crown, 
  Zap, 
  Globe, 
  Phone, 
  Mail, 
  Building2,
  Clock,
  Shield,
  Award,
  Sparkles,
  ArrowRight,
  Send,
  Users,
  Target,
  Briefcase,
  TrendingUp,
  FileText,
  Headphones,
  CheckCircle2,
  Gift,
  Rocket,
  Diamond,
  Heart,
  MessageSquare,
  Calendar,
  DollarSign,
  Percent
} from "lucide-react";

const Pricing = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    details: "",
    budget: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const pricingPlans = [
    {
      name: "الباقة الأساسية",
      price: "199",
      originalPrice: "299",
      period: "ريال لكل صفحة",
      description: "مثالية للأفراد والشركات الناشئة",
      features: [
        "ترجمة احترافية عالية الجودة",
        "مراجعة لغوية شاملة", 
        "تسليم خلال 24-48 ساعة",
        "دعم فني مجاني",
        "ضمان الجودة لمدة شهر",
        "تنسيق أساسي للوثائق"
      ],
      badge: "الأكثر شعبية",
      color: "from-blue-500 via-blue-600 to-indigo-600",
      icon: Zap,
      popular: true
    },
    {
      name: "الباقة المتقدمة", 
      price: "299",
      originalPrice: "399",
      period: "ريال لكل صفحة",
      description: "للشركات المتوسطة والمشاريع المعقدة",
      features: [
        "جميع مميزات الباقة الأساسية",
        "مراجعة من خبير ثاني",
        "ترجمة متخصصة حسب المجال", 
        "تسليم سريع خلال 12-24 ساعة",
        "دعم أولوية على مدار الساعة",
        "تنسيق وتصميم احترافي",
        "ترجمة فورية للطوارئ",
        "استشارة مجانية"
      ],
      badge: "الأفضل للشركات",
      color: "from-purple-500 via-purple-600 to-pink-600",
      icon: Crown,
      popular: false
    },
    {
      name: "الباقة الذهبية",
      price: "يُحدد حسب المشروع",
      originalPrice: null,
      period: "أسعار خاصة مخفضة",
      description: "حلول مخصصة للمؤسسات الكبرى والمشاريع الضخمة",
      features: [
        "جميع مميزات الباقات السابقة",
        "فريق مخصص للمشروع",
        "مدير مشروع متخصص",
        "ترجمة فورية وعاجلة على مدار الساعة",
        "تدريب الفريق الداخلي",
        "اتفاقية مستوى خدمة مخصصة",
        "تكامل مع أنظمة الشركة",
        "خصم على المشاريع الكبيرة",
        "دعم تقني متقدم",
        "تقارير تفصيلية"
      ],
      badge: "حلول مؤسسية",
      color: "from-orange-500 via-red-500 to-pink-600", 
      icon: Diamond,
      popular: false
    }
  ];

  const features = [
    {
      icon: Clock,
      title: "تسليم سريع وموثوق",
      description: "نلتزم بالمواعيد النهائية مع ضمان أعلى معايير الجودة",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Shield,
      title: "ضمان الجودة المطلقة",
      description: "مراجعة متعددة المراحل مع ضمان استرداد كامل في حال عدم الرضا",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Award,
      title: "خبرة تزيد عن 15 عام",
      description: "فريق من المترجمين المعتمدين والمتخصصين في مختلف المجالات",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: Users,
      title: "فريق متخصص",
      description: "أكثر من 200 مترجم محترف في أكثر من 50 لغة عالمية",
      color: "from-indigo-400 to-indigo-600"
    },
    {
      icon: Headphones,
      title: "دعم على مدار الساعة",
      description: "فريق دعم متواصل 24/7 لضمان تجربة مثالية لعملائنا",
      color: "from-pink-400 to-pink-600"
    },
    {
      icon: Target,
      title: "دقة في التخصص",
      description: "ترجمة متخصصة في المجالات الطبية والقانونية والتقنية والأكاديمية",
      color: "from-orange-400 to-orange-600"
    }
  ];

  const stats = [
    { number: "10,000+", label: "مشروع مكتمل", icon: CheckCircle2 },
    { number: "500+", label: "عميل راضٍ", icon: Heart },
    { number: "50+", label: "لغة متاحة", icon: Globe },
    { number: "15+", label: "سنة خبرة", icon: Award }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.service) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/send-pricing-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZmNnd2V5a3FremRvZHJmbWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTAxNDUsImV4cCI6MjA2OTY2NjE0NX0.m8uOkaZsoTRbG90TW7xHVFUJJ5zrF7QTP4zMO1NpuvI`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send inquiry');

      toast({
        title: "تم إرسال طلبك بنجاح! ✅",
        description: "سيتواصل معك فريق المبيعات خلال ساعة واحدة"
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        details: "",
        budget: ""
      });

    } catch (error) {
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30" dir="rtl">
      
      {/* Header Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg px-6 py-2">
                <Sparkles className="w-5 h-5 ml-2" />
                عروض حصرية وأسعار تنافسية
              </Badge>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              باقات الترجمة الاحترافية
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              اختر الباقة التي تناسب احتياجاتك واحصل على أفضل خدمات الترجمة بأسعار تنافسية مع ضمان الجودة
            </motion.p>

            {/* Stats Section */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">اختر الباقة المناسبة لك</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              باقات مصممة خصيصاً لتلبية احتياجات مختلف أنواع العملاء مع أفضل الأسعار
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`relative ${plan.popular ? 'lg:scale-105 z-10' : ''}`}
              >
                <Card className={`h-full border-2 hover:shadow-2xl transition-all duration-500 ${
                  plan.popular ? 'border-purple-200 shadow-xl bg-gradient-to-br from-white to-blue-50/50' : 'border-gray-200 hover:border-blue-200'
                } overflow-hidden`}>
                  
                  {/* Popular Badge */}
                  {plan.badge && (
                    <motion.div 
                      className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r ${plan.color} shadow-lg`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.2 + 0.5, type: "spring" }}
                    >
                      <Crown className="w-4 h-4 inline ml-2" />
                      {plan.badge}
                    </motion.div>
                  )}

                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                    <div className={`w-full h-full bg-gradient-to-br ${plan.color} transform rotate-45 translate-x-16 -translate-y-16`} />
                  </div>
                  
                  <CardHeader className="text-center pb-8 pt-12 relative">
                    <motion.div 
                      className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <plan.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <CardTitle className="text-2xl mb-4">{plan.name}</CardTitle>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-4xl font-bold text-primary">{plan.price}</span>
                        {plan.originalPrice && (
                          <div className="flex flex-col">
                            <span className="text-lg text-muted-foreground line-through">{plan.originalPrice}</span>
                            <Badge variant="destructive" className="text-xs">
                              <Percent className="w-3 h-3 ml-1" />
                              خصم 33%
                            </Badge>
                          </div>
                        )}
                      </div>
                      <span className="text-muted-foreground text-sm block mt-2">{plan.period}</span>
                    </div>
                    
                    <CardDescription className="text-base leading-relaxed">{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: featureIndex * 0.1, duration: 0.5 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        className={`w-full bg-gradient-to-r ${plan.color} hover:shadow-xl transition-all duration-300 py-6 text-lg font-semibold`}
                        size="lg"
                      >
                        <Rocket className="w-5 h-5 ml-2" />
                        اطلب هذه الباقة الآن
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50/50 via-white to-purple-50/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">لماذا نحن الخيار الأمثل؟</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              نفتخر بتقديم خدمات ترجمة احترافية تتميز بالجودة العالية والدقة المطلقة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <motion.div 
                      className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring" }}
                    >
                      <feature.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                viewport={{ once: true }}
              >
                <Badge className="mb-6 bg-gradient-to-r from-green-500 to-blue-600 text-white text-lg px-6 py-2">
                  <Gift className="w-5 h-5 ml-2" />
                  عرض سعر مجاني فوري
                </Badge>
              </motion.div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                احصل على عرض سعر مخصص الآن
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                املأ النموذج وسيتواصل معك فريق المبيعات المتخصص خلال ساعة واحدة فقط
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <label className="block text-sm font-semibold mb-3 text-right flex items-center">
                          <Users className="w-4 h-4 ml-2 text-blue-500" />
                          الاسم الكامل *
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="أدخل اسمك الكامل"
                          className="text-right border-2 hover:border-blue-300 focus:border-blue-500 transition-colors py-6"
                          required
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <label className="block text-sm font-semibold mb-3 text-right flex items-center">
                          <Mail className="w-4 h-4 ml-2 text-blue-500" />
                          البريد الإلكتروني *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="example@company.com"
                          className="text-right border-2 hover:border-blue-300 focus:border-blue-500 transition-colors py-6"
                          required
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <label className="block text-sm font-semibold mb-3 text-right flex items-center">
                          <Phone className="w-4 h-4 ml-2 text-blue-500" />
                          رقم الهاتف
                        </label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+966 50 000 0000"
                          className="text-right border-2 hover:border-blue-300 focus:border-blue-500 transition-colors py-6"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <label className="block text-sm font-semibold mb-3 text-right flex items-center">
                          <Building2 className="w-4 h-4 ml-2 text-blue-500" />
                          اسم الشركة
                        </label>
                        <Input
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="اسم شركتك أو مؤسستك"
                          className="text-right border-2 hover:border-blue-300 focus:border-blue-500 transition-colors py-6"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <label className="block text-sm font-semibold mb-3 text-right flex items-center">
                        <Briefcase className="w-4 h-4 ml-2 text-blue-500" />
                        نوع الخدمة المطلوبة *
                      </label>
                      <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                        <SelectTrigger className="text-right border-2 hover:border-blue-300 focus:border-blue-500 py-6">
                          <SelectValue placeholder="اختر نوع الخدمة المطلوبة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="document">📄 ترجمة الوثائق والمستندات</SelectItem>
                          <SelectItem value="website">🌐 ترجمة المواقع الإلكترونية</SelectItem>
                          <SelectItem value="audio">🎵 ترجمة صوتية</SelectItem>
                          <SelectItem value="video">🎬 ترجمة الفيديو والمحتوى المرئي</SelectItem>
                          <SelectItem value="legal">⚖️ ترجمة قانونية متخصصة</SelectItem>
                          <SelectItem value="medical">🏥 ترجمة طبية</SelectItem>
                          <SelectItem value="technical">🔧 ترجمة تقنية</SelectItem>
                          <SelectItem value="academic">🎓 ترجمة أكاديمية وبحثية</SelectItem>
                          <SelectItem value="business">💼 ترجمة تجارية ومؤسسية</SelectItem>
                          <SelectItem value="other">🔄 أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <label className="block text-sm font-semibold mb-3 text-right flex items-center">
                        <DollarSign className="w-4 h-4 ml-2 text-blue-500" />
                        الميزانية المتوقعة
                      </label>
                      <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                        <SelectTrigger className="text-right border-2 hover:border-blue-300 focus:border-blue-500 py-6">
                          <SelectValue placeholder="اختر النطاق السعري المناسب" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-1000">💰 أقل من 1,000 ريال</SelectItem>
                          <SelectItem value="1000-5000">💰💰 1,000 - 5,000 ريال</SelectItem>
                          <SelectItem value="5000-10000">💰💰💰 5,000 - 10,000 ريال</SelectItem>
                          <SelectItem value="10000-25000">💎 10,000 - 25,000 ريال</SelectItem>
                          <SelectItem value="25000-50000">💎💎 25,000 - 50,000 ريال</SelectItem>
                          <SelectItem value="over-50000">💎💎💎 أكثر من 50,000 ريال</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <label className="block text-sm font-semibold mb-3 text-right flex items-center">
                        <FileText className="w-4 h-4 ml-2 text-blue-500" />
                        تفاصيل المشروع
                      </label>
                      <Textarea
                        value={formData.details}
                        onChange={(e) => handleInputChange('details', e.target.value)}
                        placeholder="اكتب تفاصيل مشروعك بالكامل: نوع المحتوى، عدد الصفحات، اللغات المطلوبة، الموعد النهائي، ومتطلبات خاصة..."
                        className="text-right min-h-[150px] border-2 hover:border-blue-300 focus:border-blue-500 transition-colors"
                        rows={6}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="text-center pt-6"
                    >
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 min-w-[300px]"
                          size="lg"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white ml-3"></div>
                              جاري الإرسال...
                            </>
                          ) : (
                            <>
                              <Send className="w-6 h-6 ml-3" />
                              أرسل طلبي واحصل على العرض
                            </>
                          )}
                        </Button>
                      </motion.div>
                      
                      <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center">
                        <Clock className="w-4 h-4 ml-2 text-green-500" />
                        رد سريع خلال ساعة واحدة فقط
                      </p>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;