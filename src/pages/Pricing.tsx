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
    budget: "",
    files: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const pricingPlans = [
    // Removed pricing plans section as requested
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, files }));
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
      // Prepare data for submission (file info only, not actual files)
      const submissionData = {
        ...formData,
        files: formData.files.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      };

      const response = await fetch('https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/send-pricing-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZmNnd2V5a3FremRvZHJmbWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTAxNDUsImV4cCI6MjA2OTY2NjE0NX0.m8uOkaZsoTRbG90TW7xHVFUJJ5zrF7QTP4zMO1NpuvI`
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error('Failed to send inquiry');

      toast({
        title: "تم إرسال طلبك بنجاح! ✅",
        description: "سيتواصل معك فريق المبيعات خلال ٣ ساعات خلال أوقات الدوام"
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        details: "",
        budget: "",
        files: []
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30" dir="rtl" style={{ fontFamily: 'Arial, sans-serif' }}>
      
      {/* Header Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-right">
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
              <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg px-6 py-2 font-semibold">
                <Sparkles className="w-5 h-5 ml-2" />
                احصل على عرض أسعار مخصص
              </Badge>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              خدمات الترجمة الاحترافية
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              احصل على عرض أسعار مخصص لمشروعك واستمتع بأفضل خدمات الترجمة مع ضمان الجودة العالية
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

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50/50 via-white to-purple-50/50">
        <div className="container mx-auto px-4 text-right">
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
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="container mx-auto px-4 relative z-10 text-right">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                viewport={{ once: true }}
              >
                <Badge className="mb-6 bg-gradient-to-r from-green-500 to-blue-600 text-white text-lg px-8 py-3 font-bold shadow-lg">
                  <Gift className="w-6 h-6 ml-2" />
                  عرض سعر مجاني فوري
                </Badge>
              </motion.div>
              
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                احصل على عرض سعر مخصص الآن
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                املأ النموذج وسيتواصل معك فريق المبيعات المتخصص خلال ساعة واحدة فقط مع أفضل الأسعار التنافسية
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="backdrop-blur-lg bg-white/95 border-2 border-blue-100/50 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                <CardContent className="p-10">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid sm:grid-cols-2 gap-8">
                       <motion.div
                         initial={{ opacity: 0, x: -30 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.1, duration: 0.6 }}
                         viewport={{ once: true }}
                       >
                         <label className="block text-base font-bold mb-4 text-right flex items-center text-slate-700">
                           <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                             <Users className="w-5 h-5 text-white" />
                           </div>
                           <span>الاسم الكامل *</span>
                         </label>
                         <Input
                           value={formData.name}
                           onChange={(e) => handleInputChange('name', e.target.value)}
                           placeholder="أدخل اسمك الكامل"
                           className="text-right border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 transition-all duration-300 py-4 px-6 text-lg bg-blue-50/30 rounded-xl shadow-sm"
                           required
                         />
                       </motion.div>

                       <motion.div
                         initial={{ opacity: 0, x: 30 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.2, duration: 0.6 }}
                         viewport={{ once: true }}
                       >
                         <label className="block text-base font-bold mb-4 text-right flex items-center text-slate-700">
                           <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                             <Mail className="w-5 h-5 text-white" />
                           </div>
                           <span>البريد الإلكتروني *</span>
                         </label>
                         <Input
                           type="email"
                           value={formData.email}
                           onChange={(e) => handleInputChange('email', e.target.value)}
                           placeholder="example@company.com"
                           className="text-right border-2 border-green-200 hover:border-green-400 focus:border-green-600 transition-all duration-300 py-4 px-6 text-lg bg-green-50/30 rounded-xl shadow-sm text-left"
                           required
                         />
                       </motion.div>

                       <motion.div
                         initial={{ opacity: 0, x: -30 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.3, duration: 0.6 }}
                         viewport={{ once: true }}
                       >
                         <label className="block text-base font-bold mb-4 text-right flex items-center text-slate-700">
                           <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3">
                             <Phone className="w-5 h-5 text-white" />
                           </div>
                           <span>رقم الهاتف</span>
                         </label>
                         <Input
                           value={formData.phone}
                           onChange={(e) => handleInputChange('phone', e.target.value)}
                           placeholder="+966 50 000 0000"
                           className="text-right border-2 border-purple-200 hover:border-purple-400 focus:border-purple-600 transition-all duration-300 py-4 px-6 text-lg bg-purple-50/30 rounded-xl shadow-sm text-left"
                         />
                       </motion.div>

                       <motion.div
                         initial={{ opacity: 0, x: 30 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.4, duration: 0.6 }}
                         viewport={{ once: true }}
                       >
                         <label className="block text-base font-bold mb-4 text-right flex items-center text-slate-700">
                           <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mr-3">
                             <Building2 className="w-5 h-5 text-white" />
                           </div>
                           <span>اسم الشركة</span>
                         </label>
                         <Input
                           value={formData.company}
                           onChange={(e) => handleInputChange('company', e.target.value)}
                           placeholder="اسم شركتك أو مؤسستك"
                           className="text-right border-2 border-orange-200 hover:border-orange-400 focus:border-orange-600 transition-all duration-300 py-4 px-6 text-lg bg-orange-50/30 rounded-xl shadow-sm"
                         />
                       </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                       <label className="block text-base font-bold mb-4 text-right flex items-center text-slate-700">
                         <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                           <Briefcase className="w-5 h-5 text-white" />
                         </div>
                         <span>نوع الخدمة المطلوبة *</span>
                       </label>
                       <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                         <SelectTrigger className="text-right border-2 border-indigo-200 hover:border-indigo-400 focus:border-indigo-600 py-4 px-6 text-lg bg-indigo-50/30 rounded-xl shadow-sm" dir="rtl">
                           <SelectValue placeholder="اختر نوع الخدمة المطلوبة" />
                         </SelectTrigger>
                         <SelectContent className="text-right" dir="rtl">
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
                      transition={{ delay: 0.6, duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                       <label className="block text-base font-bold mb-4 text-right flex items-center text-slate-700">
                         <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mr-3">
                           <DollarSign className="w-5 h-5 text-white" />
                         </div>
                         <span>الميزانية المتوقعة</span>
                       </label>
                       <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                         <SelectTrigger className="text-right border-2 border-yellow-200 hover:border-yellow-400 focus:border-yellow-600 py-4 px-6 text-lg bg-yellow-50/30 rounded-xl shadow-sm" dir="rtl">
                           <SelectValue placeholder="اختر النطاق السعري المناسب" />
                         </SelectTrigger>
                         <SelectContent className="text-right" dir="rtl">
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
                       transition={{ delay: 0.7, duration: 0.6 }}
                       viewport={{ once: true }}
                     >
                       <label className="block text-base font-bold mb-4 text-right flex items-center text-slate-700">
                         <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mr-3">
                           <FileText className="w-5 h-5 text-white" />
                         </div>
                         <span>تفاصيل المشروع</span>
                       </label>
                       <Textarea
                         value={formData.details}
                         onChange={(e) => handleInputChange('details', e.target.value)}
                         placeholder="اكتب تفاصيل مشروعك بالكامل: نوع المحتوى، عدد الصفحات، اللغات المطلوبة، الموعد النهائي، ومتطلبات خاصة..."
                         className="text-right min-h-[180px] border-2 border-pink-200 hover:border-pink-400 focus:border-pink-600 transition-all duration-300 p-6 text-lg bg-pink-50/30 rounded-xl shadow-sm resize-none"
                         rows={7}
                       />
                     </motion.div>

                     {/* File Upload Section */}
                     <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.8, duration: 0.6 }}
                       viewport={{ once: true }}
                     >
                       <label className="block text-base font-bold mb-4 text-right flex items-center text-slate-700">
                         <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mr-3">
                           <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                           </svg>
                         </div>
                         <span>المرفقات (اختياري)</span>
                       </label>
                       <div className="relative">
                         <input
                           type="file"
                           multiple
                           onChange={handleFileChange}
                           accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                           className="w-full border-2 border-teal-200 hover:border-teal-400 focus:border-teal-600 transition-all duration-300 p-4 text-lg bg-teal-50/30 rounded-xl shadow-sm file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600 cursor-pointer"
                         />
                         {formData.files.length > 0 && (
                           <div className="mt-3 text-right">
                             <p className="text-sm text-teal-600 font-semibold mb-2">الملفات المحددة:</p>
                             <ul className="space-y-1">
                               {formData.files.map((file, index) => (
                                 <li key={index} className="text-sm text-gray-600 bg-teal-50 p-2 rounded-lg border border-teal-200">
                                   📎 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                 </li>
                               ))}
                             </ul>
                           </div>
                         )}
                       </div>
                       <p className="text-sm text-gray-500 mt-2 text-right">
                         يمكنك رفع ملفات بصيغ: PDF, Word, Excel, PowerPoint, الصور
                       </p>
                     </motion.div>

                     <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.9, duration: 0.6 }}
                       viewport={{ once: true }}
                       className="text-center pt-8"
                     >
                       <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                         <Button
                           type="submit"
                           disabled={isSubmitting}
                           className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-16 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 min-w-[350px] rounded-2xl border-2 border-white/20"
                           size="lg"
                         >
                           {isSubmitting ? (
                             <>
                               <div className="animate-spin rounded-full h-7 w-7 border-b-3 border-white ml-4"></div>
                               <span className="font-bold">جاري الإرسال...</span>
                             </>
                           ) : (
                             <>
                               <Send className="w-7 h-7 ml-4" />
                               <span className="font-bold">ارسل طلبك الان</span>
                             </>
                           )}
                         </Button>
                       </motion.div>
                       
                       <div className="flex items-center justify-center mt-6 space-x-6 space-x-reverse">
                         <div className="flex items-center text-green-600">
                           <Clock className="w-5 h-5 ml-2" />
                           <span className="font-semibold">رد سريع خلال ٣ ساعات خلال أوقات الدوام</span>
                         </div>
                         <div className="flex items-center text-blue-600">
                           <Shield className="w-5 h-5 ml-2" />
                           <span className="font-semibold">ضمان الجودة 100%</span>
                         </div>
                         <div className="flex items-center text-purple-600">
                           <Award className="w-5 h-5 ml-2" />
                           <span className="font-semibold">خدمة احترافية</span>
                         </div>
                       </div>
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