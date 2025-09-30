import React from 'react';
import { motion } from 'framer-motion';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimpleResearchForm } from "@/components/SimpleResearchForm";
import { 
  Scale, Heart, Building2, Briefcase, FlaskConical, Globe,
  GraduationCap, BookOpen, FileText, Calculator, Users, Palette,
  Code, TreePine, Languages, Music, ArrowRight, CheckCircle, Star
} from 'lucide-react';

const academicSpecializations = [
  {
    id: "law",
    title: "القانون والأنظمة",
    description: "أبحاث قانونية متخصصة في جميع فروع القانون",
    icon: <Scale className="h-10 w-10" />,
    gradient: "from-red-600 to-rose-600",
    services: ["رسائل ماجستير", "أطروحات دكتوراه", "بحوث قانونية", "دراسات حالة", "التحليل القانوني"],
    stats: { projects: "2000+", rating: "4.9/5", experts: "50+" }
  },
  {
    id: "medicine",
    title: "الطب والعلوم الصحية",
    description: "أبحاث طبية وصحية بأعلى معايير الجودة",
    icon: <Heart className="h-10 w-10" />,
    gradient: "from-pink-600 to-rose-600",
    services: ["أبحاث سريرية", "دراسات حالة", "مراجعات منهجية", "تحليل البيانات الطبية", "بحوث صيدلانية"],
    stats: { projects: "1500+", rating: "5.0/5", experts: "40+" }
  },
  {
    id: "engineering",
    title: "الهندسة والتقنية",
    description: "أبحاث هندسية تطبيقية ونظرية",
    icon: <Building2 className="h-10 w-10" />,
    gradient: "from-blue-600 to-cyan-600",
    services: ["بحوث هندسية", "دراسات فنية", "تصميم وتحليل", "محاكاة", "حلول تقنية"],
    stats: { projects: "2500+", rating: "4.8/5", experts: "60+" }
  },
  {
    id: "business",
    title: "إدارة الأعمال",
    description: "أبحاث في الإدارة والاقتصاد والتسويق",
    icon: <Briefcase className="h-10 w-10" />,
    gradient: "from-orange-600 to-amber-600",
    services: ["دراسات الجدوى", "خطط العمل", "التحليل الاستراتيجي", "أبحاث السوق", "دراسات مالية"],
    stats: { projects: "3000+", rating: "4.9/5", experts: "70+" }
  },
  {
    id: "sciences",
    title: "العلوم الطبيعية",
    description: "أبحاث في الفيزياء والكيمياء والأحياء",
    icon: <FlaskConical className="h-10 w-10" />,
    gradient: "from-purple-600 to-violet-600",
    services: ["تجارب معملية", "تحليل علمي", "دراسات بيئية", "بحوث تطبيقية", "نمذجة علمية"],
    stats: { projects: "1800+", rating: "4.9/5", experts: "45+" }
  },
  {
    id: "education",
    title: "التربية والتعليم",
    description: "أبحاث تربوية وتعليمية متخصصة",
    icon: <GraduationCap className="h-10 w-10" />,
    gradient: "from-green-600 to-emerald-600",
    services: ["مناهج تعليمية", "تقييم تربوي", "تقنيات التدريس", "سياسات تعليمية", "تطوير مهني"],
    stats: { projects: "2200+", rating: "4.8/5", experts: "55+" }
  },
  {
    id: "literature",
    title: "الآداب واللغات",
    description: "أبحاث أدبية ولغوية ونقدية",
    icon: <BookOpen className="h-10 w-10" />,
    gradient: "from-teal-600 to-cyan-600",
    services: ["نقد أدبي", "دراسات لغوية", "ترجمة أدبية", "تحليل نصوص", "بحوث ثقافية"],
    stats: { projects: "1600+", rating: "4.7/5", experts: "35+" }
  },
  {
    id: "accounting",
    title: "المحاسبة والمالية",
    description: "أبحاث محاسبية ومالية متقدمة",
    icon: <Calculator className="h-10 w-10" />,
    gradient: "from-indigo-600 to-blue-600",
    services: ["تحليل مالي", "محاسبة إدارية", "مراجعة حسابات", "دراسات ضريبية", "التخطيط المالي"],
    stats: { projects: "2400+", rating: "4.9/5", experts: "50+" }
  },
  {
    id: "social-sciences",
    title: "العلوم الاجتماعية",
    description: "أبحاث اجتماعية ونفسية وإنسانية",
    icon: <Users className="h-10 w-10" />,
    gradient: "from-yellow-600 to-orange-600",
    services: ["دراسات ميدانية", "استبيانات", "تحليل اجتماعي", "بحوث نفسية", "دراسات ثقافية"],
    stats: { projects: "2800+", rating: "4.8/5", experts: "65+" }
  },
  {
    id: "arts",
    title: "الفنون والتصميم",
    description: "أبحاث فنية وتصميمية إبداعية",
    icon: <Palette className="h-10 w-10" />,
    gradient: "from-fuchsia-600 to-pink-600",
    services: ["نقد فني", "دراسات تصميم", "تاريخ فن", "بحوث معمارية", "تحليل جمالي"],
    stats: { projects: "800+", rating: "4.7/5", experts: "25+" }
  },
  {
    id: "it",
    title: "تقنية المعلومات",
    description: "أبحاث في علوم الحاسب والذكاء الاصطناعي",
    icon: <Code className="h-10 w-10" />,
    gradient: "from-slate-600 to-gray-600",
    services: ["تطوير برمجيات", "أمن معلومات", "ذكاء اصطناعي", "قواعد بيانات", "شبكات"],
    stats: { projects: "2000+", rating: "4.9/5", experts: "55+" }
  },
  {
    id: "agriculture",
    title: "الزراعة والبيئة",
    description: "أبحاث زراعية وبيئية مستدامة",
    icon: <TreePine className="h-10 w-10" />,
    gradient: "from-lime-600 to-green-600",
    services: ["دراسات بيئية", "زراعة مستدامة", "موارد طبيعية", "تغير مناخي", "حفظ تنوع"],
    stats: { projects: "1200+", rating: "4.8/5", experts: "30+" }
  }
];

const AcademicResearch = () => {
  const specializations = academicSpecializations.map(s => s.title);
  const researchTypes = ['بحث جامعي', 'رسالة ماجستير', 'أطروحة دكتوراه', 'مقال علمي', 'تقرير بحثي'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 to-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GraduationCap className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 animate-float" />
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              الأبحاث الأكاديمية
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl text-blue-200">في جميع التخصصات</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed text-blue-100">
              خدمات بحثية أكاديمية متكاملة للماجستير والدكتوراه في أكثر من 50 تخصص
              <br />
              بأعلى معايير الجودة الأكاديمية العالمية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                اطلب خدمة بحثية
                <ArrowRight className="h-5 w-5 mr-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 text-lg px-8 py-6">
                <FileText className="h-5 w-5 ml-2" />
                نماذج أعمالنا
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Specializations Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 px-6 py-2 text-base">
              اختر تخصصك
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              جميع التخصصات الأكاديمية
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              فريق متخصص من الباحثين والأكاديميين في كل تخصص لضمان أعلى جودة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {academicSpecializations.map((spec, index) => (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                  {/* Gradient Header */}
                  <div className={`bg-gradient-to-r ${spec.gradient} p-5 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm"
                      >
                        {spec.icon}
                      </motion.div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                          {spec.stats.projects}
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                          <Star className="h-3 w-3 ml-1 fill-current" />
                          {spec.stats.rating}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                      {spec.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {spec.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Services */}
                    <div>
                      <h4 className="text-xs font-semibold mb-2 text-muted-foreground">الخدمات المتاحة:</h4>
                      <div className="space-y-1">
                        {spec.services.slice(0, 3).map((service, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{service}</span>
                          </div>
                        ))}
                        <div className="text-xs text-primary font-medium">+ {spec.services.length - 3} خدمات أخرى</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{spec.stats.experts} خبير</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button className="w-full" size="sm" onClick={() => {
                      document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                      اطلب الخدمة
                      <ArrowRight className="h-4 w-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <section id="order-form" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">اطلب خدمتك البحثية الآن</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              املأ النموذج وسيتواصل معك فريقنا المتخصص خلال 24 ساعة
            </p>
          </motion.div>
          
          <SimpleResearchForm
            category="academic"
            categoryTitle="الأبحاث الأكاديمية"
            specializations={specializations}
            researchTypes={researchTypes}
          />
        </div>
      </section>
    </div>
  );
};

export default AcademicResearch;
