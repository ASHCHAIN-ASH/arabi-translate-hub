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
  Send
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
      price: "99",
      period: "ريال لكل صفحة",
      description: "مثالية للأفراد والشركات الناشئة",
      features: [
        "ترجمة احترافية عالية الجودة",
        "مراجعة لغوية شاملة",
        "تسليم خلال 24-48 ساعة",
        "دعم فني مجاني",
        "ضمان الجودة لمدة شهر"
      ],
      badge: "الأكثر شعبية",
      color: "from-blue-500 to-purple-600"
    },
    {
      name: "الباقة المتقدمة",
      price: "149",
      period: "ريال لكل صفحة",
      description: "للشركات المتوسطة والمشاريع المعقدة",
      features: [
        "جميع مميزات الباقة الأساسية",
        "مراجعة من خبير ثاني",
        "ترجمة متخصصة حسب المجال",
        "تسليم سريع خلال 12-24 ساعة",
        "دعم أولوية على مدار الساعة",
        "تنسيق وتصميم احترافي"
      ],
      badge: "الأفضل للشركات",
      color: "from-purple-500 to-pink-600"
    },
    {
      name: "الباقة المؤسسية",
      price: "حسب المشروع",
      period: "أسعار خاصة",
      description: "حلول مخصصة للمؤسسات الكبرى",
      features: [
        "جميع مميزات الباقات السابقة",
        "فريق مخصص للمشروع",
        "مدير مشروع متخصص",
        "ترجمة فورية وعاجلة",
        "تدريب الفريق الداخلي",
        "اتفاقية مستوى خدمة مخصصة",
        "تكامل مع أنظمة الشركة"
      ],
      badge: "حلول مخصصة",
      color: "from-orange-500 to-red-600"
    }
  ];

  const companies = [
    { name: "أرامكو السعودية", logo: "🏢" },
    { name: "سابك", logo: "🏭" },
    { name: "البنك الأهلي", logo: "🏦" },
    { name: "STC", logo: "📱" },
    { name: "جامعة الملك سعود", logo: "🎓" },
    { name: "وزارة الصحة", logo: "🏥" },
    { name: "مدينة الملك عبدالعزيز للعلوم", logo: "🔬" },
    { name: "هيئة الاستثمار", logo: "💼" }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Star className="w-4 h-4 mr-2" />
              أسعار تنافسية وشفافة
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              باقات الترجمة المحترفة
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              اختر الباقة التي تناسب احتياجاتك وميزانيتك. جميع باقاتنا تشمل ضمان الجودة والدعم الفني المجاني
            </p>
          </motion.div>

          {/* Trusted Companies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-16"
          >
            <p className="text-center text-muted-foreground mb-8">يثق بنا أكثر من 500 شركة ومؤسسة</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {companies.map((company, index) => (
                <motion.div
                  key={company.name}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 px-4 py-2 bg-white/50 rounded-lg backdrop-blur-sm"
                >
                  <span className="text-2xl">{company.logo}</span>
                  <span className="text-sm font-medium text-muted-foreground">{company.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className={`relative ${index === 1 ? 'md:scale-105 z-10' : ''}`}
              >
                <Card className={`h-full border-2 hover:shadow-2xl transition-all duration-500 ${
                  index === 1 ? 'border-purple-200 shadow-xl' : 'border-gray-200 hover:border-blue-200'
                }`}>
                  {plan.badge && (
                    <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${plan.color}`}>
                      {plan.badge}
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8 pt-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                      {index === 0 && <Zap className="w-8 h-8 text-white" />}
                      {index === 1 && <Crown className="w-8 h-8 text-white" />}
                      {index === 2 && <Sparkles className="w-8 h-8 text-white" />}
                    </div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-primary">{plan.price}</span>
                      <span className="text-muted-foreground text-sm block">{plan.period}</span>
                    </div>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: featureIndex * 0.1, duration: 0.5 }}
                          className="flex items-start gap-3"
                        >
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full bg-gradient-to-r ${plan.color} hover:shadow-lg transition-all duration-300`}
                      size="lg"
                    >
                      اطلب عرض سعر مخصص
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <Send className="w-4 h-4 mr-2" />
                اطلب عرض سعر مخصص
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                احصل على عرض سعر مجاني
              </h2>
              <p className="text-muted-foreground text-lg">
                املأ النموذج وسيتواصل معك فريق المبيعات خلال ساعة واحدة
              </p>
            </div>

            <Card className="backdrop-blur-sm bg-white/70 border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="أدخل اسمك الكامل"
                        className="bg-white/80"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@company.com"
                        className="bg-white/80"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+966 50 000 0000"
                        className="bg-white/80"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <label className="block text-sm font-medium mb-2">اسم الشركة</label>
                      <Input
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="اسم شركتك أو مؤسستك"
                        className="bg-white/80"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <label className="block text-sm font-medium mb-2">نوع الخدمة المطلوبة *</label>
                    <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="اختر نوع الخدمة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">ترجمة الوثائق</SelectItem>
                        <SelectItem value="website">ترجمة المواقع الإلكترونية</SelectItem>
                        <SelectItem value="audio">ترجمة صوتية</SelectItem>
                        <SelectItem value="video">ترجمة الفيديو</SelectItem>
                        <SelectItem value="legal">ترجمة قانونية</SelectItem>
                        <SelectItem value="medical">ترجمة طبية</SelectItem>
                        <SelectItem value="technical">ترجمة تقنية</SelectItem>
                        <SelectItem value="academic">ترجمة أكاديمية</SelectItem>
                        <SelectItem value="business">ترجمة تجارية</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <label className="block text-sm font-medium mb-2">الميزانية المتوقعة</label>
                    <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="اختر الميزانية المتوقعة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-1000">أقل من 1,000 ريال</SelectItem>
                        <SelectItem value="1000-5000">1,000 - 5,000 ريال</SelectItem>
                        <SelectItem value="5000-10000">5,000 - 10,000 ريال</SelectItem>
                        <SelectItem value="10000-25000">10,000 - 25,000 ريال</SelectItem>
                        <SelectItem value="25000-50000">25,000 - 50,000 ريال</SelectItem>
                        <SelectItem value="over-50000">أكثر من 50,000 ريال</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <label className="block text-sm font-medium mb-2">تفاصيل المشروع</label>
                    <Textarea
                      value={formData.details}
                      onChange={(e) => handleInputChange('details', e.target.value)}
                      placeholder="اكتب تفاصيل مشروعك، نوع المحتوى، عدد الصفحات، اللغات المطلوبة، والمواعيد النهائية..."
                      className="bg-white/80 min-h-[120px]"
                      rows={5}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-center"
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          إرسال الطلب
                          <Send className="w-5 h-5 mr-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">لماذا نحن الخيار الأفضل؟</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              نقدم خدمات ترجمة احترافية بأعلى معايير الجودة والدقة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "سرعة في التسليم",
                description: "نلتزم بالمواعيد النهائية ونقدم خدمة سريعة دون التضحية بالجودة"
              },
              {
                icon: Shield,
                title: "ضمان الجودة",
                description: "مراجعة متعددة المراحل وضمان الجودة لمدة شهر كامل"
              },
              {
                icon: Award,
                title: "خبرة 15 عام",
                description: "فريق من المترجمين المعتمدين مع خبرة تزيد عن 15 عام"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;