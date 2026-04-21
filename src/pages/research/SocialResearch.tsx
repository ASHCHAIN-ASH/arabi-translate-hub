import React from 'react';
import { motion } from 'framer-motion';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimpleResearchForm } from "@/components/SimpleResearchForm";
import Footer from '@/components/Footer';
import { 
  Users, Heart, GraduationCap, BookOpen, Globe, 
  Brain, MessageCircle, UserCheck, Home, Radio,
  ArrowRight, CheckCircle, Star
} from 'lucide-react';

const socialSpecializations = [
  {
    id: "psychology",
    title: "علم النفس",
    description: "أبحاث نفسية سريرية وتربوية واجتماعية",
    icon: <Brain className="h-10 w-10" />,
    gradient: "from-purple-600 to-violet-600",
    services: ["علم نفس سريري", "علم نفس تربوي", "علم نفس اجتماعي", "علم نفس نمو", "قياس نفسي"],
    stats: { projects: "1100+", rating: "4.9/5", experts: "32+" }
  },
  {
    id: "education",
    title: "علوم التربية",
    description: "أبحاث تربوية ومناهج وطرق تدريس",
    icon: <GraduationCap className="h-10 w-10" />,
    gradient: "from-green-600 to-emerald-600",
    services: ["مناهج وتدريس", "تقنيات تعليم", "إدارة تربوية", "قياس وتقويم", "تربية خاصة"],
    stats: { projects: "1300+", rating: "4.8/5", experts: "38+" }
  },
  {
    id: "sociology",
    title: "علم الاجتماع",
    description: "دراسات اجتماعية وثقافية وديموغرافية",
    icon: <Users className="h-10 w-10" />,
    gradient: "from-blue-600 to-cyan-600",
    services: ["علم اجتماع حضري", "علم اجتماع أسري", "ديموغرافيا", "تغير اجتماعي", "مشكلات اجتماعية"],
    stats: { projects: "900+", rating: "4.7/5", experts: "26+" }
  },
  {
    id: "social-work",
    title: "الخدمة الاجتماعية",
    description: "أبحاث في الخدمة الاجتماعية والرعاية",
    icon: <Heart className="h-10 w-10" />,
    gradient: "from-pink-600 to-rose-600",
    services: ["رعاية اجتماعية", "خدمة فردية", "خدمة جماعية", "تنمية مجتمعية", "تخطيط اجتماعي"],
    stats: { projects: "750+", rating: "4.8/5", experts: "22+" }
  },
  {
    id: "media",
    title: "الإعلام والاتصال",
    description: "أبحاث إعلامية واتصالية حديثة",
    icon: <Radio className="h-10 w-10" />,
    gradient: "from-orange-600 to-amber-600",
    services: ["إعلام رقمي", "علاقات عامة", "إعلان", "صحافة", "اتصال جماهيري"],
    stats: { projects: "850+", rating: "4.7/5", experts: "25+" }
  },
  {
    id: "anthropology",
    title: "علم الإنسان (الأنثروبولوجيا)",
    description: "دراسات أنثروبولوجية وثقافية",
    icon: <UserCheck className="h-10 w-10" />,
    gradient: "from-teal-600 to-cyan-600",
    services: ["أنثروبولوجيا ثقافية", "أنثروبولوجيا اجتماعية", "إثنوغرافيا", "فولكلور", "تراث"],
    stats: { projects: "400+", rating: "4.6/5", experts: "15+" }
  },
  {
    id: "geography",
    title: "الجغرافيا البشرية",
    description: "أبحاث جغرافية بشرية واجتماعية",
    icon: <Globe className="h-10 w-10" />,
    gradient: "from-indigo-600 to-blue-600",
    services: ["جغرافيا سكان", "جغرافيا حضرية", "جغرافيا اقتصادية", "تخطيط إقليمي", "GIS"],
    stats: { projects: "550+", rating: "4.7/5", experts: "18+" }
  },
  {
    id: "history",
    title: "التاريخ",
    description: "أبحاث تاريخية وتوثيقية متخصصة",
    icon: <BookOpen className="h-10 w-10" />,
    gradient: "from-amber-600 to-orange-600",
    services: ["تاريخ حديث", "تاريخ إسلامي", "تاريخ اجتماعي", "وثائق تاريخية", "منهج تاريخي"],
    stats: { projects: "650+", rating: "4.8/5", experts: "20+" }
  },
  {
    id: "philosophy",
    title: "الفلسفة",
    description: "أبحاث فلسفية ومنطقية وأخلاقية",
    icon: <MessageCircle className="h-10 w-10" />,
    gradient: "from-violet-600 to-purple-600",
    services: ["فلسفة إسلامية", "فلسفة غربية", "أخلاق", "منطق", "فلسفة علم"],
    stats: { projects: "350+", rating: "4.7/5", experts: "12+" }
  },
  {
    id: "family-studies",
    title: "دراسات الأسرة",
    description: "أبحاث في الأسرة والطفولة والمرأة",
    icon: <Home className="h-10 w-10" />,
    gradient: "from-rose-600 to-pink-600",
    services: ["دراسات أسرية", "تنمية طفل", "قضايا المرأة", "إرشاد أسري", "علاقات أسرية"],
    stats: { projects: "600+", rating: "4.8/5", experts: "18+" }
  }
];

const SocialResearch = () => {
  const specializations = socialSpecializations.map(s => s.title);
  const researchTypes = ['بحث اجتماعي', 'رسالة ماجستير', 'أطروحة دكتوراه', 'دراسة ميدانية', 'تقرير بحثي'];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-green-50/20 to-background">
      <Header />
      
      <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
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
            <Users className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 animate-float" />
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              البحوث الاجتماعية والإنسانية
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl text-green-200">فهم المجتمع والإنسان</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed text-green-100">
              أبحاث في العلوم الاجتماعية والنفسية والتربوية والإنسانية
              <br />
              بمنهجية علمية دقيقة وموثوقة
            </p>
            
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
              ابدأ بحثك
              <ArrowRight className="h-5 w-5 mr-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 px-6 py-2 text-base">
              العلوم الإنسانية
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              جميع التخصصات الاجتماعية والإنسانية
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {socialSpecializations.map((spec, index) => (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                  <div className={`bg-gradient-to-r ${spec.gradient} p-5 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm"
                      >
                        {spec.icon}
                      </motion.div>
                      <div className="flex flex-wrap gap-2">
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
                    <div>
                      <h4 className="text-xs font-semibold mb-2 text-muted-foreground">الخدمات:</h4>
                      <div className="space-y-1">
                        {spec.services.slice(0, 3).map((service, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{service}</span>
                          </div>
                        ))}
                        <div className="text-xs text-primary font-medium">+ المزيد</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{spec.stats.experts} خبير</span>
                      </div>
                    </div>

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
      <section id="order-form" className="py-20 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-950">
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
            category="social"
            categoryTitle="الأبحاث الاجتماعية"
            specializations={specializations}
            researchTypes={researchTypes}
          />
        </div>
      </section>
          <Footer />
    </div>
  );
};

export default SocialResearch;
