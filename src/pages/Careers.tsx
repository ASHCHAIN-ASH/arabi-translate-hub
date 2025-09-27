import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  MapPin, 
  Clock,
  CheckCircle,
  Send,
  FileText,
  Mail,
  Phone,
  User,
  GraduationCap,
  Award,
  Target,
  ArrowRight,
  Star,
  Globe,
  TrendingUp,
  Building,
  Sparkles,
  Zap,
  Heart,
  Coffee,
  Wifi,
  Home,
  Laptop,
  Calendar,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import careersBackground from '@/assets/careers-background.jpg';

interface JobApplication {
  position: string;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  education: string;
  skills: string;
  motivation: string;
}

const Careers = () => {
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [formData, setFormData] = useState<JobApplication>({
    position: '',
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    skills: '',
    motivation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobs = [
    {
      id: 'translator-ar-en',
      title: '🌟 مترجم عربي - إنجليزي',
      department: 'خدمات الترجمة المتقدمة',
      type: 'دوام جزئي',
      location: '🏠 عن بُعد',
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      description: 'انضم لفريقنا المتميز كمترجم محترف! ستعمل على ترجمة المحتوى الأكاديمي والتجاري بأعلى معايير الجودة، مع مرونة كاملة في العمل من منزلك. نوفر لك بيئة إبداعية تساعدك على تطوير مهاراتك وتحقيق أهدافك المهنية.',
      requirements: [
        '🎯 إتقان تام للغتين العربية والإنجليزية كتابة ومحادثة',
        '⭐ خبرة عملية لا تقل عن 3 سنوات في مجال الترجمة',
        '📜 شهادة جامعية في الترجمة أو اللغات أو مجال ذي صلة',
        '⚡ سرعة في الإنجاز مع الحفاظ على أعلى معايير الجودة',
        '🧠 مهارات تحليلية قوية وقدرة على فهم السياق الثقافي'
      ],
      benefits: ['💰 عمولة مجزية حسب الأداء', '⏰ مرونة كاملة في المواعيد', '📚 تدريب مستمر ومتطور', '🚀 فرص نمو لامحدودة']
    },
    {
      id: 'research-consultant',
      title: '🎓 مستشار الأبحاث الأكاديمية',
      department: 'الأبحاث والاستشارات العلمية',
      type: 'دوام كامل',
      location: '🌐 عن بُعد',
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'كن جزءاً من ثورة التعليم الأكاديمي! ساعد الطلاب والباحثين في تحقيق أحلامهم الأكاديمية من خلال إرشادهم في رحلتهم البحثية. ستعمل مع نخبة من الأكاديميين المتميزين في بيئة تشجع على الإبداع والابتكار.',
      requirements: [
        '🎓 درجة الماجستير أو الدكتوراه في تخصص أكاديمي معترف',
        '🔬 خبرة واسعة في منهجيات البحث العلمي والأكاديمي',
        '📊 إتقان برامج التحليل الإحصائي (SPSS, R, أو مماثل)',
        '📝 مهارات كتابة أكاديمية متقدمة باللغتين العربية والإنجليزية',
        '💬 مهارات تواصل استثنائية وصبر في التعامل مع الطلاب'
      ],
      benefits: ['🏆 راتب تنافسي وحوافز أداء', '🩺 تأمين صحي شامل', '🌟 بيئة عمل محفزة ومبدعة', '📈 برامج تطوير مهني متقدمة']
    },
    {
      id: 'content-writer',
      title: '✍️ كاتب المحتوى الأكاديمي',
      department: 'الكتابة والإبداع الأكاديمي',
      type: 'دوام جزئي',
      location: '🏡 عن بُعد',
      gradient: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'اطلق إبداعك في عالم الكتابة الأكاديمية! انضم لفريق من الكتاب المتميزين واكتب محتوى أكاديمي عالي الجودة يساهم في تطوير المعرفة العلمية. ستحصل على حرية إبداعية كاملة مع دعم فني متواصل.',
      requirements: [
        '📚 شهادة جامعية في تخصص أكاديمي ذي صلة بمجال الكتابة',
        '✨ مهارات كتابة إبداعية متقدمة باللغة العربية',
        '🔍 خبرة في البحث الأكاديمي والتوثيق العلمي',
        '⏱️ انضباط في المواعيد والتزام بمعايير الجودة',
        '🎨 قدرة على التكيف مع أساليب كتابة متنوعة'
      ],
      benefits: ['🎭 حرية إبداعية كاملة', '📖 مشاريع متنوعة وشيقة', '🧑‍🎓 تطوير مهارات مستمر', '🤝 شبكة علاقات مهنية واسعة']
    },
    {
      id: 'customer-support',
      title: '💬 أخصائي تجربة العملاء',
      department: 'السعادة وخدمة العملاء',
      type: 'دوام كامل',
      location: '🌍 عن بُعد',
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      description: 'كن سفير السعادة لعملائنا! انضم لفريق خدمة العملاء المتميز واجعل كل تفاعل مع عملائنا تجربة استثنائية لا تُنسى. ستعمل في بيئة داعمة ومرحة تقدر جهودك وتحتفي بإنجازاتك.',
      requirements: [
        '💖 شغف حقيقي بمساعدة الآخرين وحل مشاكلهم',
        '🗣️ مهارات تواصل استثنائية وصبر لا محدود',
        '💻 إجادة استخدام الحاسوب وأنظمة إدارة العملاء',
        '🌟 قدرة على العمل تحت الضغط بإيجابية وحماس',
        '🤝 روح الفريق ومهارات تعاون متقدمة'
      ],
      benefits: ['🏠 بيئة عمل ودية ومرحة', '📚 تدريب شامل ومتطور', '🎯 حوافز أداء جذابة', '⬆️ فرص ترقي واضحة']
    },
    {
      id: 'social-media',
      title: '📱 مدير وسائل التواصل',
      department: 'التسويق الرقمي والإبداع',
      type: 'دوام جزئي',
      location: '🚀 عن بُعد',
      gradient: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      description: 'اجعل صوتنا يصل للعالم! قد فريق التسويق الرقمي وأبدع محتوى جذاب يلهم متابعينا ويبني مجتمعاً رقمياً نشطاً. ستحصل على حرية إبداعية كاملة لتجربة أحدث الاتجاهات في عالم التسويق الرقمي.',
      requirements: [
        '🎨 خبرة في إدارة منصات التواصل الاجتماعي المختلفة',
        '📸 مهارات تصميم وإنتاج محتوى بصري جذاب',
        '📈 فهم عميق لمقاييس الأداء والتحليلات الرقمية',
        '✍️ قدرة على كتابة محتوى جذاب ومؤثر',
        '⚡ معرفة بأحدث الاتجاهات في التسويق الرقمي'
      ],
      benefits: ['🎪 حرية إبداعية لامحدودة', '📊 أدوات تسويقية متطورة', '🌟 فرصة بناء العلامة التجارية', '🎓 تدريب على أحدث التقنيات']
    },
    {
      id: 'graphic-designer',
      title: '🎨 مصمم جرافيك إبداعي',
      department: 'التصميم والهوية البصرية',
      type: 'دوام جزئي',
      location: '🎭 عن بُعد',
      gradient: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      description: 'حول أفكارنا إلى تحف بصرية! انضم لفريق التصميم المبدع وساهم في خلق هوية بصرية مميزة تعكس قيمنا وتجذب العملاء. ستعمل على مشاريع متنوعة تتحدى إبداعك وتطور مهاراتك الفنية.',
      requirements: [
        '🖌️ إتقان برامج التصميم (Adobe Creative Suite, Figma)',
        '👁️ حس فني متميز وفهم عميق لأسس التصميم',
        '💡 قدرة على ترجمة الأفكار إلى تصاميم بصرية مؤثرة',
        '📐 خبرة في تصميم الهوية البصرية والمواد التسويقية',
        '🔄 مرونة في التعامل مع التعديلات والتطوير المستمر'
      ],
      benefits: ['🎨 مشاريع إبداعية متنوعة', '💻 أدوات تصميم متطورة', '🏆 اعتراف بالإنجازات الإبداعية', '📚 ورش تطوير فني مستمرة']
    }
  ];

  const handleInputChange = (field: keyof JobApplication, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // تعيين الوظيفة المحددة في الفورم
  useEffect(() => {
    if (selectedJob) {
      const job = jobs.find(j => j.id === selectedJob);
      if (job) {
        setFormData(prev => ({ ...prev, position: job.title }));
      }
    }
  }, [selectedJob]);

  const handleJobApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Starting job application submission...");
      
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.position) {
        console.log("Validation failed - missing fields:", {
          fullName: !!formData.fullName,
          email: !!formData.email,
          position: !!formData.position
        });
        throw new Error("يرجى ملء جميع الحقول المطلوبة");
      }

      // Set position from selected job
      const job = jobs.find(j => j.id === selectedJob);
      const updatedFormData = {
        ...formData,
        position: job?.title || formData.position
      };

      console.log("Calling Edge Function with data:", updatedFormData);

      // Call Edge Function to send emails
      const { data, error } = await supabase.functions.invoke('send-job-application', {
        body: updatedFormData,
      });

      console.log("Edge Function response:", { data, error });

      if (error) {
        console.error("Edge Function error:", error);
        throw new Error(error.message || "حدث خطأ أثناء إرسال الطلب");
      }

      toast({
        title: "تم إرسال طلبك بنجاح! 🎉",
        description: "تم إرسال تنبيه للإدارة وإيميل تأكيد لك. سنتواصل معك خلال 3-5 أيام عمل.",
      });

      // Reset form
      setFormData({
        position: '',
        fullName: '',
        email: '',
        phone: '',
        experience: '',
        education: '',
        skills: '',
        motivation: ''
      });
      setSelectedJob(null);
    } catch (error: any) {
      console.error("Job application error:", error);
      toast({
        title: "خطأ في الإرسال",
        description: error.message || "حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedJob) {
    const job = jobs.find(j => j.id === selectedJob);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50" dir="rtl">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <Button
              variant="outline"
              onClick={() => setSelectedJob(null)}
              className="mb-6 bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              العودة للوظائف
              <ArrowRight className="mr-2 h-4 w-4" />
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Job Details */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className={`h-fit bg-gradient-to-br ${job?.gradient} text-white shadow-2xl border-0 overflow-hidden relative`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                      >
                        <Briefcase className="h-8 w-8 text-white" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-2xl text-white">{job?.title}</CardTitle>
                        <p className="text-white/80 text-lg">{job?.department}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-6">
                      <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all duration-300">
                        <Clock className="h-4 w-4 ml-2" />
                        {job?.type}
                      </Badge>
                      <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all duration-300">
                        <MapPin className="h-4 w-4 ml-2" />
                        {job?.location}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-8 relative z-10">
                    <div>
                      <h3 className="font-bold text-xl mb-4 text-white flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        وصف الوظيفة
                      </h3>
                      <p className="text-white/90 leading-relaxed text-lg">{job?.description}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-xl mb-4 text-white flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        المتطلبات
                      </h3>
                      <ul className="space-y-3">
                        {job?.requirements.map((req, index) => (
                          <motion.li 
                            key={index} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <CheckCircle className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                            <span className="text-white/90 leading-relaxed">{req}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-xl mb-4 text-white flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        المزايا
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {job?.benefits.map((benefit, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center"
                          >
                            <span className="text-white/90 text-sm font-medium">{benefit}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Application Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-white/90 backdrop-blur-lg shadow-2xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center"
                      >
                        <Send className="h-5 w-5 text-white" />
                      </motion.div>
                      تقدم للوظيفة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleJobApplication} className="space-y-6">
                        <input
                          type="hidden"
                          value={job?.title || ''}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                        />
                      
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-slate-700 font-medium">الاسم الكامل *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          required
                          className="border-slate-200 focus:border-blue-500 transition-colors"
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 font-medium">البريد الإلكتروني *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          className="border-slate-200 focus:border-blue-500 transition-colors"
                          placeholder="example@email.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-700 font-medium">رقم الهاتف *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                          className="border-slate-200 focus:border-blue-500 transition-colors"
                          placeholder="05xxxxxxxx"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-slate-700 font-medium">سنوات الخبرة</Label>
                        <Select onValueChange={(value) => handleInputChange('experience', value)}>
                          <SelectTrigger className="border-slate-200 focus:border-blue-500">
                            <SelectValue placeholder="اختر سنوات الخبرة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1">أقل من سنة</SelectItem>
                            <SelectItem value="1-3">1-3 سنوات</SelectItem>
                            <SelectItem value="3-5">3-5 سنوات</SelectItem>
                            <SelectItem value="5-10">5-10 سنوات</SelectItem>
                            <SelectItem value="10+">أكثر من 10 سنوات</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="education" className="text-slate-700 font-medium">المؤهل العلمي</Label>
                        <Input
                          id="education"
                          value={formData.education}
                          onChange={(e) => handleInputChange('education', e.target.value)}
                          placeholder="مثال: بكالوريوس في اللغة الإنجليزية"
                          className="border-slate-200 focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skills" className="text-slate-700 font-medium">المهارات الرئيسية</Label>
                        <Textarea
                          id="skills"
                          value={formData.skills}
                          onChange={(e) => handleInputChange('skills', e.target.value)}
                          placeholder="اذكر أهم مهاراتك ذات الصلة بالوظيفة"
                          className="border-slate-200 focus:border-blue-500 transition-colors"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="motivation" className="text-slate-700 font-medium">لماذا تريد العمل معنا؟ *</Label>
                        <Textarea
                          id="motivation"
                          value={formData.motivation}
                          onChange={(e) => handleInputChange('motivation', e.target.value)}
                          placeholder="اشرح دوافعك للانضمام لفريقنا واكتب ما يميزك"
                          className="border-slate-200 focus:border-blue-500 transition-colors"
                          rows={4}
                          required
                        />
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-medium shadow-lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب 🚀'}
                          <Send className="mr-2 h-5 w-5" />
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50" dir="rtl">
      <Header />
      
      {/* Hero Section with Background */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${careersBackground})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-indigo-800/70 to-purple-900/80"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-32 left-20 w-40 h-40 bg-blue-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-400/20 rounded-full blur-xl"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-2xl"
              >
                <Users className="h-12 w-12 text-white" />
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                انضم إلى عائلة
                <motion.span 
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                >
                  ماستر إيدو باث ✨
                </motion.span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
                اكتشف مستقبلك المهني معنا! نحن نبحث عن المواهب المبدعة للانضمام لفريقنا المتميز 
                <br />
                <span className="text-yellow-300">🌟 العمل عن بُعد • مرونة كاملة • نمو مهني • بيئة إبداعية 🌟</span>
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16"
            >
              {[
                {
                  icon: Target,
                  title: "🎯 رؤيتنا",
                  description: "بناء فريق من المبدعين والمتخصصين المتميزين",
                  color: "from-emerald-500 to-teal-600"
                },
                {
                  icon: Heart,
                  title: "💖 قيمنا",
                  description: "الجودة والإبداع والتطوير المستمر للجميع",
                  color: "from-pink-500 to-rose-600"
                },
                {
                  icon: TrendingUp,
                  title: "📈 نموك",
                  description: "بيئة محفزة للنمو المهني والشخصي اللامحدود",
                  color: "from-blue-500 to-indigo-600"
                },
                {
                  icon: Sparkles,
                  title: "✨ إبداعك",
                  description: "مساحة آمنة للإبداع والابتكار بحرية كاملة",
                  color: "from-purple-500 to-pink-600"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="group"
                >
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-all duration-500 h-full">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                      <p className="text-white/80 text-sm leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-blue-50/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                الوظائف المتاحة 🚀
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                اختر الوظيفة التي تناسب شغفك ومهاراتك وابدأ رحلتك المهنية معنا
                <br />
                <span className="text-blue-600 font-semibold">جميع الوظائف متاحة للعمل عن بُعد بمرونة كاملة! 🏠</span>
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group h-full"
                >
                  <Card className={`h-full bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative`}>
                    {/* Gradient Header */}
                    <div className={`h-2 bg-gradient-to-r ${job.gradient}`}></div>
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`w-14 h-14 ${job.bgColor} rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}
                          >
                            <Briefcase className={`h-7 w-7 ${job.iconColor}`} />
                          </motion.div>
                          <div>
                            <CardTitle className="text-lg leading-tight">{job.title}</CardTitle>
                            <p className="text-slate-600 text-sm font-medium">{job.department}</p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                        >
                          <Star className="h-5 w-5 text-amber-400" />
                        </motion.div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                          <Clock className="h-3 w-3 ml-1" />
                          {job.type}
                        </Badge>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                          <Home className="h-3 w-3 ml-1" />
                          {job.location}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <p className="text-slate-600 leading-relaxed line-clamp-4">
                        {job.description}
                      </p>
                      
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          أهم المتطلبات:
                        </h4>
                        <ul className="space-y-2">
                          {job.requirements.slice(0, 3).map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            onClick={() => setSelectedJob(job.id)}
                            className={`w-full bg-gradient-to-r ${job.gradient} hover:shadow-lg transform transition-all duration-300 text-white font-medium`}
                          >
                            عرض التفاصيل والتقديم
                            <ArrowRight className="mr-2 h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                لماذا ماستر إيدو باث؟ 🌟
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                انضم لبيئة عمل استثنائية تقدر إبداعك وتدعم نموك المهني
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Building,
                  title: "🏢 بيئة محترفة",
                  description: "مكان عمل يشجع على الإبداع والابتكار مع أحدث الأدوات",
                  color: "from-blue-500 to-cyan-600"
                },
                {
                  icon: GraduationCap,
                  title: "📚 تطوير مستمر",
                  description: "برامج تدريبية متطورة وورش عمل لتنمية مهاراتك باستمرار",
                  color: "from-green-500 to-emerald-600"
                },
                {
                  icon: Coffee,
                  title: "☕ مرونة العمل",
                  description: "اعمل من أي مكان في العالم بالمرونة التي تناسب حياتك",
                  color: "from-orange-500 to-red-600"
                },
                {
                  icon: Users,
                  title: "👥 فريق متميز",
                  description: "انضم لعائلة من المحترفين المبدعين والداعمين لبعضهم",
                  color: "from-purple-500 to-pink-600"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="group"
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 text-center h-full">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-800 mb-4 text-xl">{item.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-lg border border-blue-200/50 shadow-2xl">
              <CardContent className="p-12 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-8 shadow-lg"
                >
                  <MessageCircle className="h-10 w-10 text-white" />
                </motion.div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                  لم تجد الوظيفة المناسبة؟ 🤔
                </h2>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  لا تقلق! أرسل لنا سيرتك الذاتية وسنتواصل معك عند توفر فرصة تناسب مهاراتك الفريدة
                  <br />
                  <span className="text-blue-600 font-semibold">نحن دائماً نبحث عن المواهب المميزة! ✨</span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg shadow-lg"
                    >
                      <Mail className="ml-2 h-6 w-6" />
                      info@masteredupath.com
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-white/70 backdrop-blur-sm border-blue-200 hover:bg-white/90 px-8 py-4 text-lg"
                    >
                      <Phone className="ml-2 h-6 w-6" />
                      0500776343
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Careers;