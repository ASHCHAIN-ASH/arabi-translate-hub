import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Send, Phone, Mail, MapPin, Clock, CheckCircle,
  FileText, Calendar, User, MessageSquare
} from 'lucide-react';

const categoryData: Record<string, { 
  title: string; 
  color: string;
  description: string;
  specializations: string[];
  researchTypes: string[];
}> = {
  academic: {
    title: "الأبحاث الأكاديمية",
    color: "from-blue-600 to-cyan-600",
    description: "نقدم خدمات بحثية متخصصة للطلاب والباحثين في مختلف التخصصات الأكاديمية، مع ضمان الجودة والالتزام بالمعايير الأكاديمية العالمية.",
    specializations: ["القانون", "الطب", "الهندسة", "الإدارة", "العلوم", "التربية", "الآداب", "المحاسبة", "علوم اجتماعية", "فنون", "IT", "زراعة"],
    researchTypes: ["ماجستير", "دكتوراه", "بحث علمي", "ورقة علمية", "دراسة حالة"]
  },
  scientific: {
    title: "البحوث العلمية",
    color: "from-purple-600 to-pink-600",
    description: "فريقنا من الخبراء المتخصصين في العلوم الطبيعية والتطبيقية يساعدك في إجراء أبحاث علمية دقيقة ومبتكرة.",
    specializations: ["الأحياء", "الكيمياء", "الفيزياء", "علوم بيئية", "جيولوجيا", "علم مواد", "تقنية حيوية", "علوم طاقة", "تقنية نانو", "فلك"],
    researchTypes: ["بحث تجريبي", "دراسة معملية", "بحث تطبيقي", "مراجعة علمية", "تحليل بيانات"]
  },
  business: {
    title: "أبحاث الأعمال",
    color: "from-orange-600 to-amber-600",
    description: "نساعدك في إعداد دراسات وأبحاث الأعمال الاحترافية التي تدعم قراراتك الاستراتيجية وتطور مشاريعك.",
    specializations: ["إدارة أعمال", "اقتصاد", "محاسبة", "مالية", "تسويق", "موارد بشرية", "إدارة عمليات", "أعمال دولية", "ريادة أعمال", "تحليل بيانات"],
    researchTypes: ["دراسة جدوى", "خطة عمل", "بحث سوق", "تحليل استراتيجي", "دراسة مالية"]
  },
  social: {
    title: "البحوث الاجتماعية",
    color: "from-green-600 to-emerald-600",
    description: "نوفر لك خدمات بحثية متميزة في العلوم الإنسانية والاجتماعية مع استخدام أحدث المنهجيات البحثية.",
    specializations: ["علم النفس", "التربية", "علم الاجتماع", "خدمة اجتماعية", "إعلام", "أنثروبولوجيا", "جغرافيا", "تاريخ", "فلسفة", "دراسات أسرية"],
    researchTypes: ["دراسة ميدانية", "بحث استبياني", "دراسة تحليلية", "بحث نوعي", "بحث كمي"]
  },
  legal: {
    title: "البحوث القانونية",
    color: "from-red-600 to-rose-600",
    description: "فريق من الخبراء القانونيين يقدم لك أبحاث قانونية دقيقة ومتخصصة في مختلف فروع القانون.",
    specializations: ["قانون عام", "قانون خاص", "قانون جنائي", "شريعة إسلامية", "قانون دولي", "قانون عمل", "قانون عقاري", "حقوق إنسان", "قانون بيئي", "أحوال شخصية"],
    researchTypes: ["بحث قانوني", "دراسة مقارنة", "تحليل قضائي", "بحث فقهي", "دراسة تشريعية"]
  },
  medical: {
    title: "الأبحاث الطبية",
    color: "from-rose-600 to-pink-600",
    description: "نساعدك في إعداد الأبحاث الطبية والصحية وفق أعلى المعايير العلمية والأخلاقية المتبعة عالمياً.",
    specializations: ["طب سريري", "صيدلة", "تمريض", "صحة عامة", "مختبرات طبية", "طب أسنان", "أشعة", "علم نفس صحي", "طب أطفال", "تغذية"],
    researchTypes: ["دراسة سريرية", "بحث طبي", "مراجعة منهجية", "دراسة حالة", "تحليل بيانات طبية"]
  }
};

const OrderResearchService = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const categoryInfo = category ? categoryData[category] : categoryData.academic;

  const [formData, setFormData] = useState({
    specialization: '',
    researchType: '',
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    researchTitle: '',
    deadline: '',
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // استدعاء edge function لحفظ الطلب وإرسال الإيميل
      const { data, error } = await supabase.functions.invoke('send-research-order', {
        body: {
          category: category || 'academic',
          categoryTitle: categoryInfo.title,
          ...formData
        }
      });

      if (error) throw error;

      toast({
        title: "✅ تم إرسال الطلب بنجاح",
        description: `رقم طلبك: ${data.orderNumber}. سنتواصل معك قريباً`,
        duration: 5000,
      });

      // إعادة توجيه بعد 3 ثواني
      setTimeout(() => {
        navigate('/research-services');
      }, 3000);

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "❌ حدث خطأ",
        description: error.message || "فشل إرسال الطلب. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-gray-50 to-background">
      <Header />
      
      {/* Hero Section */}
      <section className={`relative py-16 md:py-20 overflow-hidden bg-gradient-to-r ${categoryInfo.color}`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FileText className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 animate-float" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              اطلب خدمة
              <br />
              {categoryInfo.title}
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto leading-relaxed">
              {categoryInfo.description}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle className="h-5 w-5" />
                <span>استجابة سريعة</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle className="h-5 w-5" />
                <span>فريق متخصص</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle className="h-5 w-5" />
                <span>جودة عالية</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-b">
                <CardTitle className="text-2xl md:text-3xl">نموذج طلب الخدمة</CardTitle>
                <CardDescription className="text-base">
                  يرجى ملء جميع الحقول المطلوبة للحصول على أفضل خدمة
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* معلومات البحث */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-primary border-b pb-2">معلومات البحث</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="specialization">التخصص *</Label>
                        <Select
                          value={formData.specialization}
                          onValueChange={(value) => setFormData({...formData, specialization: value})}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر التخصص" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryInfo.specializations.map(spec => (
                              <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="researchType">نوع البحث *</Label>
                        <Select
                          value={formData.researchType}
                          onValueChange={(value) => setFormData({...formData, researchType: value})}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع البحث" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryInfo.researchTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="researchTitle">عنوان البحث *</Label>
                      <Input
                        id="researchTitle"
                        value={formData.researchTitle}
                        onChange={(e) => setFormData({...formData, researchTitle: e.target.value})}
                        placeholder="أدخل عنوان البحث أو الموضوع"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="deadline">الموعد النهائي للتسليم *</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* معلومات الاتصال */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-primary border-b pb-2">معلومات الاتصال</h3>
                    
                    <div>
                      <Label htmlFor="fullName">الاسم الكامل *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        placeholder="أدخل اسمك الكامل"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">البريد الإلكتروني *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="example@email.com"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">رقم الهاتف *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+966 5X XXX XXXX"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="whatsapp">رقم الواتساب</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                        placeholder="+966 5X XXX XXXX"
                      />
                    </div>
                  </div>

                  {/* تفاصيل إضافية */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-primary border-b pb-2">تفاصيل إضافية</h3>
                    
                    <div>
                      <Label htmlFor="details">تفاصيل البحث ومتطلبات خاصة</Label>
                      <Textarea
                        id="details"
                        value={formData.details}
                        onChange={(e) => setFormData({...formData, details: e.target.value})}
                        placeholder="أضف أي تفاصيل إضافية أو متطلبات خاصة..."
                        rows={5}
                      />
                    </div>

                  </div>

                  {/* زر الإرسال */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg py-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 ml-2" />
                        إرسال الطلب
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* معلومات التواصل */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Card className="text-center p-6 border-primary/20 hover:border-primary transition-all">
                <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h4 className="font-bold mb-2">الهاتف</h4>
                <p className="text-sm text-muted-foreground">+966 50 123 4567</p>
              </Card>

              <Card className="text-center p-6 border-primary/20 hover:border-primary transition-all">
                <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h4 className="font-bold mb-2">البريد الإلكتروني</h4>
                <p className="text-sm text-muted-foreground">info@masteredupath.com</p>
              </Card>

              <Card className="text-center p-6 border-primary/20 hover:border-primary transition-all">
                <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h4 className="font-bold mb-2">ساعات العمل</h4>
                <p className="text-sm text-muted-foreground">الأحد - الخميس: 9 صباحاً - 6 مساءً</p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OrderResearchService;
