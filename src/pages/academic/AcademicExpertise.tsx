import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Target,
  CheckCircle,
  Star,
  Brain,
  TrendingUp,
  Globe,
  ChevronRight,
  User,
  Calendar,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

import ConsultationForm from '@/components/ConsultationForm';

import Footer from '@/components/Footer';
const AcademicExpertise = () => {
  const expertiseAreas = [
    {
      icon: BookOpen,
      title: "العلوم الإنسانية",
      description: "التاريخ، الأدب، الفلسفة، علم الاجتماع",
      experts: 25,
      projects: 150,
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: Brain,
      title: "العلوم الطبيعية",
      description: "الفيزياء، الكيمياء، الأحياء، الرياضيات",
      experts: 20,
      projects: 120,
      color: "from-emerald-600 to-teal-600"
    },
    {
      icon: TrendingUp,
      title: "العلوم التطبيقية",
      description: "الهندسة، الطب، الصيدلة، التكنولوجيا",
      experts: 30,
      projects: 200,
      color: "from-purple-600 to-pink-600"
    },
    {
      icon: Globe,
      title: "العلوم الاجتماعية",
      description: "الاقتصاد، العلوم السياسية، الإعلام",
      experts: 18,
      projects: 90,
      color: "from-amber-600 to-orange-600"
    }
  ];

  const teamFeatures = [
    {
      icon: User,
      title: "خبراء متخصصون",
      description: "فريق من الأكاديميين والباحثين المتمرسين",
      stat: "93 خبير"
    },
    {
      icon: Calendar,
      title: "سنوات من الخبرة",
      description: "خبرة تراكمية في مختلف المجالات الأكاديمية",
      stat: "15+ سنة"
    },
    {
      icon: Award,
      title: "مشاريع مكتملة",
      description: "مشاريع أكاديمية وبحثية نجحت بامتياز",
      stat: "560+ مشروع"
    },
    {
      icon: Briefcase,
      title: "شراكات أكاديمية",
      description: "تعاون مع مؤسسات تعليمية رائدة",
      stat: "40+ شراكة"
    }
  ];

  const qualityStandards = [
    "مراجعة متعددة المستويات من قبل الخبراء",
    "التزام بالمعايير الأكاديمية المعتمدة دولياً",
    "استخدام أحدث الأدوات والمنهجيات البحثية",
    "ضمان الأصالة والجودة العلمية",
    "متابعة مستمرة وتحديث للمحتوى",
    "تقييم دوري لجودة الخدمات المقدمة"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-tl from-emerald-500/15 via-teal-500/20 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200 dark:border-blue-700 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GraduationCap className="h-4 w-4" />
              خبرة أكاديمية متخصصة
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-arabic-formal font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                خبراء أكاديميون
              </span>
              <br />
              في خدمتك
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              فريق متميز من الأكاديميين والباحثين المتخصصين في مختلف المجالات العلمية
              <span className="text-blue-600 dark:text-blue-400 font-semibold"> بخبرة تزيد عن 15 عاماً</span>
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium">
                تواصل مع الخبراء
                <ChevronRight className="mr-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950">
                تصفح التخصصات
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Expertise Areas */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-4">
              مجالات تخصصنا
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تغطية شاملة لجميع التخصصات الأكاديمية والبحثية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertiseAreas.map((area, index) => {
              const IconComponent = area.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-foreground">
                        {area.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {area.description}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {area.experts} خبير
                        </span>
                        <span className="text-emerald-600 font-medium">
                          {area.projects} مشروع
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Features */}
      <section className="py-16 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-4">
              فريق العمل المتميز
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              أرقام ومؤشرات تؤكد تميز فريقنا الأكاديمي
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-800 dark:to-blue-950/30">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {feature.stat}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-6">
                معايير الجودة الأكاديمية
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                نلتزم بأعلى معايير الجودة الأكاديمية المعترف بها دولياً لضمان تقديم خدمات متميزة
              </p>

              <div className="space-y-4">
                {qualityStandards.map((standard, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{standard}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl"></div>
                <div className="relative z-10">
                  <Star className="h-12 w-12 mb-6" />
                  <h3 className="text-2xl font-bold mb-4">ضمان الجودة الشامل</h3>
                  <p className="text-blue-100 leading-relaxed">
                    نضمن لك الحصول على خدمة أكاديمية متميزة تلبي أعلى المعايير المهنية والعلمية، 
                    مع إمكانية المراجعة والتعديل حتى تحقيق الرضا التام.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <ConsultationForm />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-6">
              فريق متميز في خدمتك
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              نحن هنا لمساعدتك في تحقيق أهدافك الأكاديمية والبحثية بأعلى مستوى من الجودة والمهنية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                تواصل معنا الآن
                <ChevronRight className="mr-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                استعرض أعمالنا
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      
          <Footer />
    </div>
  );
};

export default AcademicExpertise;