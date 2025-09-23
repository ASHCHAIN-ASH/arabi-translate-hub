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
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Send className="w-4 h-4 ml-2" />
              طلب عرض سعر مخصص
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              احصل على عرض سعر مجاني
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              نقدم لك أفضل الأسعار التنافسية لخدمات الترجمة الاحترافية. املأ النموذج وسيتواصل معك فريق المبيعات خلال ساعة واحدة
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="backdrop-blur-sm bg-background/95 border shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-right">الاسم الكامل *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="أدخل اسمك الكامل"
                        className="text-right"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-right">البريد الإلكتروني *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@company.com"
                        className="text-right"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-right">رقم الهاتف</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+966 50 000 0000"
                        className="text-right"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-right">اسم الشركة</label>
                      <Input
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="اسم شركتك أو مؤسستك"
                        className="text-right"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <label className="block text-sm font-medium mb-2 text-right">نوع الخدمة المطلوبة *</label>
                    <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                      <SelectTrigger className="text-right">
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
                    <label className="block text-sm font-medium mb-2 text-right">الميزانية المتوقعة</label>
                    <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                      <SelectTrigger className="text-right">
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
                    <label className="block text-sm font-medium mb-2 text-right">تفاصيل المشروع</label>
                    <Textarea
                      value={formData.details}
                      onChange={(e) => handleInputChange('details', e.target.value)}
                      placeholder="اكتب تفاصيل مشروعك، نوع المحتوى، عدد الصفحات، اللغات المطلوبة، والمواعيد النهائية..."
                      className="text-right min-h-[120px]"
                      rows={5}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-center pt-4"
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 ml-2" />
                          إرسال الطلب
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
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">لماذا نحن الخيار الأفضل؟</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              نقدم خدمات ترجمة احترافية بأعلى معايير الجودة والدقة
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <CardContent className="p-6 sm:p-8">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
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