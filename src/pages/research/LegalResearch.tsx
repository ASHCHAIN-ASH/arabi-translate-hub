import React from 'react';
import { motion } from 'framer-motion';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Scale, FileText, Gavel, BookOpen, Shield, 
  Globe, Building, UserCheck, Users,
  ArrowRight, CheckCircle, Star
} from 'lucide-react';

const legalSpecializations = [
  {
    id: "public-law",
    title: "القانون العام",
    description: "أبحاث في القانون الدستوري والإداري",
    icon: <Scale className="h-10 w-10" />,
    gradient: "from-red-600 to-rose-600",
    services: ["قانون دستوري", "قانون إداري", "قضاء إداري", "قانون مالي", "قانون عسكري"],
    stats: { projects: "800+", rating: "4.9/5", experts: "25+" }
  },
  {
    id: "private-law",
    title: "القانون الخاص",
    description: "أبحاث في القانون المدني والتجاري",
    icon: <FileText className="h-10 w-10" />,
    gradient: "from-blue-600 to-cyan-600",
    services: ["قانون مدني", "قانون تجاري", "قانون بحري", "عقود", "ملكية فكرية"],
    stats: { projects: "900+", rating: "4.9/5", experts: "28+" }
  },
  {
    id: "criminal-law",
    title: "القانون الجنائي",
    description: "أبحاث في القانون الجنائي والإجرائي",
    icon: <Gavel className="h-10 w-10" />,
    gradient: "from-orange-600 to-amber-600",
    services: ["قانون عقوبات", "إجراءات جنائية", "علم إجرام", "علم عقاب", "تحقيق جنائي"],
    stats: { projects: "700+", rating: "4.8/5", experts: "22+" }
  },
  {
    id: "sharia-law",
    title: "الشريعة الإسلامية",
    description: "أبحاث فقهية وشرعية متخصصة",
    icon: <BookOpen className="h-10 w-10" />,
    gradient: "from-green-600 to-emerald-600",
    services: ["فقه مقارن", "أصول فقه", "قضاء شرعي", "اقتصاد إسلامي", "سياسة شرعية"],
    stats: { projects: "1000+", rating: "5.0/5", experts: "35+" }
  },
  {
    id: "international-law",
    title: "القانون الدولي",
    description: "أبحاث في القانون الدولي العام والخاص",
    icon: <Globe className="h-10 w-10" />,
    gradient: "from-purple-600 to-violet-600",
    services: ["قانون دولي عام", "قانون دولي خاص", "منظمات دولية", "قانون دبلوماسي", "قانون بحار"],
    stats: { projects: "550+", rating: "4.8/5", experts: "18+" }
  },
  {
    id: "labor-law",
    title: "قانون العمل",
    description: "أبحاث في قانون العمل والضمان الاجتماعي",
    icon: <UserCheck className="h-10 w-10" />,
    gradient: "from-teal-600 to-cyan-600",
    services: ["عقود عمل", "ضمان اجتماعي", "علاقات عمل", "نقابات", "تأمينات"],
    stats: { projects: "600+", rating: "4.7/5", experts: "20+" }
  },
  {
    id: "real-estate-law",
    title: "القانون العقاري",
    description: "أبحاث في القانون العقاري والملكية",
    icon: <Building className="h-10 w-10" />,
    gradient: "from-indigo-600 to-blue-600",
    services: ["ملكية عقارية", "تسجيل عقاري", "تخطيط عمراني", "إيجارات", "رهن عقاري"],
    stats: { projects: "500+", rating: "4.8/5", experts: "16+" }
  },
  {
    id: "human-rights",
    title: "حقوق الإنسان",
    description: "أبحاث في حقوق الإنسان والحريات",
    icon: <Shield className="h-10 w-10" />,
    gradient: "from-pink-600 to-rose-600",
    services: ["حقوق أساسية", "حريات عامة", "قانون لاجئين", "قانون إنساني", "عدالة انتقالية"],
    stats: { projects: "450+", rating: "4.9/5", experts: "15+" }
  },
  {
    id: "environmental-law",
    title: "القانون البيئي",
    description: "أبحاث في التشريعات والقوانين البيئية",
    icon: <Globe className="h-10 w-10" />,
    gradient: "from-lime-600 to-green-600",
    services: ["حماية بيئة", "موارد طبيعية", "تنمية مستدامة", "تغير مناخي", "نفايات"],
    stats: { projects: "350+", rating: "4.7/5", experts: "12+" }
  },
  {
    id: "family-law",
    title: "قانون الأحوال الشخصية",
    description: "أبحاث في قانون الأسرة والأحوال الشخصية",
    icon: <Users className="h-10 w-10" />,
    gradient: "from-rose-600 to-pink-600",
    services: ["زواج وطلاق", "نفقة", "حضانة", "ميراث", "وصية"],
    stats: { projects: "750+", rating: "4.8/5", experts: "24+" }
  }
];

const LegalResearch = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-red-50/20 to-background">
      <Header />
      
      <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-red-600 via-rose-600 to-pink-600">
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
            <Scale className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 animate-float" />
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              البحوث القانونية والشرعية
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl text-red-200">أبحاث قانونية متخصصة</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed text-red-100">
              أبحاث متخصصة في القانون والشريعة والأنظمة القانونية
              <br />
              بأعلى معايير البحث القانوني والفقهي
            </p>
            
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
              ابدأ بحثك القانوني
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
              التخصصات القانونية
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              جميع فروع القانون والشريعة
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {legalSpecializations.map((spec, index) => (
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

                    <Button className="w-full" size="sm">
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
    </div>
  );
};

export default LegalResearch;
