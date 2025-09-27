import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  MapPin, 
  Clock,
  Calendar,
  DollarSign,
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
  Building
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
      title: 'مترجم عربي-إنجليزي',
      department: 'خدمات الترجمة',
      type: 'دوام جزئي',
      location: 'عن بُعد',
      salary: '2000-4000 ريال',
      description: 'نبحث عن مترجم محترف للترجمة بين العربية والإنجليزية للوثائق الأكاديمية والتجارية.',
      requirements: [
        'إجادة تامة للغتين العربية والإنجليزية',
        'خبرة لا تقل عن 3 سنوات في الترجمة',
        'شهادة في الترجمة أو اللغات (مفضل)',
        'القدرة على العمل تحت الضغط'
      ],
      benefits: ['راتب تنافسي', 'مرونة في العمل', 'تدريب مستمر', 'فرص للنمو']
    },
    {
      id: 'research-consultant',
      title: 'مستشار أبحاث أكاديمية',
      department: 'الأبحاث والاستشارات',
      type: 'دوام كامل',
      location: 'الرياض/عن بُعد',
      salary: '5000-8000 ريال',
      description: 'مطلوب مستشار أبحاث لمساعدة الطلاب والباحثين في تطوير أبحاثهم الأكاديمية.',
      requirements: [
        'درجة الماجستير أو الدكتوراه',
        'خبرة في البحث الأكاديمي',
        'معرفة بمناهج البحث العلمي',
        'مهارات تواصل ممتازة'
      ],
      benefits: ['تأمين صحي', 'إجازات مدفوعة', 'بيئة عمل محفزة', 'تطوير مهني']
    },
    {
      id: 'content-writer',
      title: 'كاتب محتوى أكاديمي',
      department: 'الكتابة الأكاديمية',
      type: 'دوام جزئي',
      location: 'عن بُعد',
      salary: '1500-3000 ريال',
      description: 'نحتاج لكاتب محتوى متخصص في الكتابة الأكاديمية والعلمية.',
      requirements: [
        'شهادة جامعية في تخصص ذي صلة',
        'خبرة في الكتابة الأكاديمية',
        'إجادة البحث والتوثيق',
        'دقة في المواعيد'
      ],
      benefits: ['مرونة كاملة', 'مشاريع متنوعة', 'تطوير مهارات', 'شبكة مهنية']
    },
    {
      id: 'customer-support',
      title: 'موظف خدمة عملاء',
      department: 'خدمة العملاء',
      type: 'دوام كامل',
      location: 'جدة',
      salary: '3000-5000 ريال',
      description: 'مطلوب موظف خدمة عملاء للتعامل مع استفسارات العملاء وتقديم الدعم.',
      requirements: [
        'مهارات تواصل ممتازة',
        'صبر وقدرة على حل المشاكل',
        'خبرة في خدمة العملاء (مفضل)',
        'إجادة استخدام الحاسوب'
      ],
      benefits: ['بيئة عمل ودية', 'تدريب شامل', 'حوافز أداء', 'نمو وظيفي']
    }
  ];

  const handleInputChange = (field: keyof JobApplication, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleJobApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "تم إرسال طلبك بنجاح! 🎉",
        description: "سنتواصل معك خلال 3-5 أيام عمل",
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
    } catch (error) {
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
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
      opacity: 1,
      transition: {
        duration: 0.6
      }
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
            className="max-w-4xl mx-auto"
          >
            <Button
              variant="outline"
              onClick={() => setSelectedJob(null)}
              className="mb-6"
            >
              العودة للوظائف
              <ArrowRight className="mr-2 h-4 w-4" />
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Job Details */}
              <Card className="h-fit">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{job?.title}</CardTitle>
                      <p className="text-slate-600">{job?.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {job?.type}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job?.location}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {job?.salary}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">وصف الوظيفة</h3>
                    <p className="text-slate-600 leading-relaxed">{job?.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">المتطلبات</h3>
                    <ul className="space-y-2">
                      {job?.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-600">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">المزايا</h3>
                    <div className="flex flex-wrap gap-2">
                      {job?.benefits.map((benefit, index) => (
                        <Badge key={index} variant="outline" className="text-green-700 border-green-200">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    تقدم للوظيفة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleJobApplication} className="space-y-4">
                    <input
                      type="hidden"
                      value={job?.title}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                    />
                    
                    <div>
                      <Label htmlFor="fullName">الاسم الكامل *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="experience">سنوات الخبرة</Label>
                      <Select onValueChange={(value) => handleInputChange('experience', value)}>
                        <SelectTrigger className="mt-1">
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

                    <div>
                      <Label htmlFor="education">المؤهل العلمي</Label>
                      <Input
                        id="education"
                        value={formData.education}
                        onChange={(e) => handleInputChange('education', e.target.value)}
                        placeholder="مثال: بكالوريوس في ..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="skills">المهارات الرئيسية</Label>
                      <Textarea
                        id="skills"
                        value={formData.skills}
                        onChange={(e) => handleInputChange('skills', e.target.value)}
                        placeholder="اذكر أهم مهاراتك ذات الصلة بالوظيفة"
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="motivation">لماذا تريد العمل معنا؟ *</Label>
                      <Textarea
                        id="motivation"
                        value={formData.motivation}
                        onChange={(e) => handleInputChange('motivation', e.target.value)}
                        placeholder="اشرح دوافعك للانضمام لفريقنا"
                        className="mt-1"
                        rows={4}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                      <Send className="mr-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-8 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
                انضم إلى
                <span className="text-gradient bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> فريقنا</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
                كن جزءاً من فريق متميز يقدم أفضل خدمات الترجمة والأبحاث الأكاديمية
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            >
              {[
                {
                  icon: Target,
                  title: "رؤيتنا",
                  description: "نسعى لتكوين فريق من الخبراء والمتخصصين"
                },
                {
                  icon: Award,
                  title: "قيمنا",
                  description: "الجودة والاحترافية والتطوير المستمر"
                },
                {
                  icon: TrendingUp,
                  title: "نموك",
                  description: "نوفر بيئة محفزة للنمو المهني والشخصي"
                }
              ].map((item, index) => (
                <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <item.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                    <p className="text-slate-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                الوظائف المتاحة
              </h2>
              <p className="text-xl text-slate-600">
                اختر الوظيفة التي تناسب مهاراتك وطموحاتك
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Briefcase className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <p className="text-slate-600 text-sm">{job.department}</p>
                          </div>
                        </div>
                        <Star className="h-5 w-5 text-amber-400" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.type}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {job.salary}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-slate-600 mb-4 line-clamp-3">
                        {job.description}
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <div>
                          <h4 className="font-medium text-slate-800 mb-2">أهم المتطلبات:</h4>
                          <ul className="space-y-1">
                            {job.requirements.slice(0, 2).map((req, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => setSelectedJob(job.id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-700 group-hover:to-indigo-700"
                      >
                        عرض التفاصيل والتقديم
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              لماذا ماستر إيدو باث؟
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                {
                  icon: Building,
                  title: "بيئة محترفة",
                  description: "نوفر بيئة عمل احترافية ومحفزة للإبداع"
                },
                {
                  icon: GraduationCap,
                  title: "تطوير مستمر",
                  description: "برامج تدريبية وتطويرية لتنمية مهاراتك"
                },
                {
                  icon: Globe,
                  title: "مرونة العمل",
                  description: "خيارات مرنة للعمل عن بُعد أو في المكتب"
                },
                {
                  icon: Users,
                  title: "فريق متميز",
                  description: "اعمل مع فريق من المحترفين والخبراء"
                }
              ].map((item, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
                  <CardContent className="p-6">
                    <item.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-blue-200/50 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                  لم تجد الوظيفة المناسبة؟
                </h2>
                <p className="text-slate-600 mb-6">
                  أرسل لنا سيرتك الذاتية وسنتواصل معك عند توفر فرصة تناسب مهاراتك
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    <Mail className="ml-2 h-5 w-5" />
                    careers@masteredupath.com
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/70"
                  >
                    <Phone className="ml-2 h-5 w-5" />
                    0500776343
                  </Button>
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