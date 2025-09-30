import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, FileText, Microscope, Scale, Heart, Building2,
  Briefcase, GraduationCap, FlaskConical, Calculator, Globe,
  Rocket, ArrowRight, CheckCircle, Star, Users
} from 'lucide-react';

const researchCategories = [
  {
    id: "academic-research",
    title: "الأبحاث الأكاديمية",
    description: "خدمات بحثية متكاملة للماجستير والدكتوراه في جميع التخصصات",
    icon: <GraduationCap className="h-12 w-12" />,
    gradient: "from-blue-600 via-blue-500 to-cyan-500",
    stats: { projects: "5000+", rating: "4.9/5" },
    href: "/research/academic",
    specializations: [
      { name: "القانون", icon: <Scale className="h-4 w-4" /> },
      { name: "الطب", icon: <Heart className="h-4 w-4" /> },
      { name: "الهندسة", icon: <Building2 className="h-4 w-4" /> },
      { name: "الإدارة", icon: <Briefcase className="h-4 w-4" /> },
      { name: "العلوم", icon: <FlaskConical className="h-4 w-4" /> },
      { name: "المزيد...", icon: <Globe className="h-4 w-4" /> }
    ]
  },
  {
    id: "scientific-research",
    title: "البحوث العلمية والتطبيقية",
    description: "أبحاث علمية متخصصة في العلوم الطبيعية والتطبيقية والتجريبية",
    icon: <Microscope className="h-12 w-12" />,
    gradient: "from-purple-600 via-purple-500 to-pink-500",
    stats: { projects: "3000+", rating: "4.8/5" },
    href: "/research/scientific",
    specializations: [
      { name: "الأحياء", icon: <FlaskConical className="h-4 w-4" /> },
      { name: "الكيمياء", icon: <FlaskConical className="h-4 w-4" /> },
      { name: "الفيزياء", icon: <Calculator className="h-4 w-4" /> },
      { name: "البيئة", icon: <Globe className="h-4 w-4" /> },
      { name: "التقنية", icon: <Building2 className="h-4 w-4" /> },
      { name: "المزيد...", icon: <Microscope className="h-4 w-4" /> }
    ]
  },
  {
    id: "business-research",
    title: "أبحاث الأعمال والاقتصاد",
    description: "دراسات وأبحاث متخصصة في إدارة الأعمال والاقتصاد والتسويق",
    icon: <Briefcase className="h-12 w-12" />,
    gradient: "from-orange-600 via-orange-500 to-amber-500",
    stats: { projects: "4000+", rating: "4.9/5" },
    href: "/research/business",
    specializations: [
      { name: "الإدارة", icon: <Briefcase className="h-4 w-4" /> },
      { name: "الاقتصاد", icon: <Calculator className="h-4 w-4" /> },
      { name: "المحاسبة", icon: <Calculator className="h-4 w-4" /> },
      { name: "التسويق", icon: <Globe className="h-4 w-4" /> },
      { name: "المالية", icon: <Calculator className="h-4 w-4" /> },
      { name: "المزيد...", icon: <Briefcase className="h-4 w-4" /> }
    ]
  },
  {
    id: "social-research",
    title: "البحوث الاجتماعية والإنسانية",
    description: "أبحاث في العلوم الاجتماعية والنفسية والتربوية والإنسانية",
    icon: <Users className="h-12 w-12" />,
    gradient: "from-green-600 via-green-500 to-emerald-500",
    stats: { projects: "3500+", rating: "4.8/5" },
    href: "/research/social",
    specializations: [
      { name: "علم النفس", icon: <Heart className="h-4 w-4" /> },
      { name: "التربية", icon: <GraduationCap className="h-4 w-4" /> },
      { name: "الاجتماع", icon: <Users className="h-4 w-4" /> },
      { name: "الإعلام", icon: <Globe className="h-4 w-4" /> },
      { name: "الخدمة", icon: <Heart className="h-4 w-4" /> },
      { name: "المزيد...", icon: <BookOpen className="h-4 w-4" /> }
    ]
  },
  {
    id: "legal-research",
    title: "البحوث القانونية والشرعية",
    description: "أبحاث متخصصة في القانون والشريعة والأنظمة القانونية",
    icon: <Scale className="h-12 w-12" />,
    gradient: "from-red-600 via-red-500 to-rose-500",
    stats: { projects: "2500+", rating: "4.9/5" },
    href: "/research/legal",
    specializations: [
      { name: "القانون العام", icon: <Scale className="h-4 w-4" /> },
      { name: "القانون الخاص", icon: <Scale className="h-4 w-4" /> },
      { name: "الشريعة", icon: <BookOpen className="h-4 w-4" /> },
      { name: "الأنظمة", icon: <FileText className="h-4 w-4" /> },
      { name: "الدولي", icon: <Globe className="h-4 w-4" /> },
      { name: "المزيد...", icon: <Scale className="h-4 w-4" /> }
    ]
  },
  {
    id: "medical-research",
    title: "الأبحاث الطبية والصحية",
    description: "أبحاث طبية وصحية متخصصة في جميع المجالات الطبية",
    icon: <Heart className="h-12 w-12" />,
    gradient: "from-rose-600 via-pink-500 to-fuchsia-500",
    stats: { projects: "2000+", rating: "5.0/5" },
    href: "/research/medical",
    specializations: [
      { name: "الطب", icon: <Heart className="h-4 w-4" /> },
      { name: "الصيدلة", icon: <FlaskConical className="h-4 w-4" /> },
      { name: "التمريض", icon: <Heart className="h-4 w-4" /> },
      { name: "الصحة", icon: <Heart className="h-4 w-4" /> },
      { name: "التغذية", icon: <FlaskConical className="h-4 w-4" /> },
      { name: "المزيد...", icon: <Microscope className="h-4 w-4" /> }
    ]
  }
];

const ResearchServices = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/30 to-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-teal-600/10"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-6 px-6 py-2 text-lg">
              🎯 مركز الأبحاث المتكامل
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent leading-tight">
              خدمات بحثية احترافية
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl">في جميع التخصصات</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              نقدم خدمات بحثية متكاملة في أكثر من <span className="font-bold text-primary">50 تخصص</span> أكاديمي وعلمي
              <br />
              بجودة عالية وأسعار تنافسية وضمان الجودة 100%
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Rocket className="h-5 w-5 ml-2" />
                ابدأ مشروعك البحثي
                <ArrowRight className="h-5 w-5 mr-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <FileText className="h-5 w-5 ml-2" />
                تحميل دليل الخدمات
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
          >
            {[
              { number: "20,000+", label: "بحث مكتمل", icon: <CheckCircle className="h-6 w-6" /> },
              { number: "50+", label: "تخصص متاح", icon: <BookOpen className="h-6 w-6" /> },
              { number: "98%", label: "رضا العملاء", icon: <Star className="h-6 w-6" /> },
              { number: "24/7", label: "دعم مستمر", icon: <Users className="h-6 w-6" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-primary/10 text-center"
              >
                <div className="text-primary mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Research Categories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              اختر مجال تخصصك
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نوفر خدمات بحثية متخصصة في جميع المجالات الأكاديمية والعلمية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {researchCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className="h-full overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                  onClick={() => navigate(category.href)}
                >
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${category.gradient} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm"
                      >
                        {category.icon}
                      </motion.div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                          {category.stats.projects}
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                          <Star className="h-3 w-3 ml-1 fill-current" />
                          {category.stats.rating}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {category.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Specializations */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-muted-foreground">التخصصات المتاحة:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {category.specializations.map((spec, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="text-primary">{spec.icon}</div>
                            <span>{spec.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full" variant="default">
                        استكشف الخدمات
                        <ArrowRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">لماذا تختار خدماتنا؟</h2>
            <p className="text-lg text-muted-foreground">نضمن لك التميز والجودة في كل مرحلة</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <CheckCircle className="h-8 w-8" />, title: "ضمان الجودة", desc: "مراجعة متعددة المستويات" },
              { icon: <Users className="h-8 w-8" />, title: "خبراء متخصصون", desc: "500+ باحث أكاديمي" },
              { icon: <Rocket className="h-8 w-8" />, title: "تسليم سريع", desc: "التزام بالمواعيد 100%" },
              { icon: <Star className="h-8 w-8" />, title: "دعم مستمر", desc: "متابعة حتى النجاح" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-lg"
              >
                <div className="text-primary mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResearchServices;
