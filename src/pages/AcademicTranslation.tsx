import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, FileText, Award, Users, Globe, Microscope, Calculator, FlaskConical, Atom, Library, PenTool } from "lucide-react";
import AdvancedTranslationForm from "@/components/AdvancedTranslationForm";

const AcademicTranslation = () => {
  const academicServices = [
    {
      title: "ترجمة الأطروحات والرسائل",
      description: "ترجمة أكاديمية دقيقة لرسائل الماجستير والدكتوراه والأبحاث الجامعية",
      icon: GraduationCap,
      level: "دكتوراه",
      features: ["منهجية أكاديمية", "مراجع علمية", "تدقيق أكاديمي"]
    },
    {
      title: "ترجمة الأوراق البحثية",
      description: "ترجمة الأبحاث والمقالات العلمية المنشورة في المجلات الأكاديمية المحكمة",
      icon: FileText,
      level: "بحثي",
      features: ["دقة علمية", "مصطلحات متخصصة", "معايير النشر"]
    },
    {
      title: "ترجمة الكتب الأكاديمية",
      description: "ترجمة الكتب العلمية والمراجع الأكاديمية والمناهج الدراسية",
      icon: BookOpen,
      level: "تعليمي",
      features: ["محتوى شامل", "تسلسل منطقي", "وضوح تعليمي"]
    },
    {
      title: "ترجمة المؤتمرات العلمية",
      description: "ترجمة أوراق المؤتمرات والندوات العلمية والعروض التقديمية الأكاديمية",
      icon: Users,
      level: "مؤتمرات",
      features: ["ترجمة فورية", "عروض تقديمية", "تفاعل مباشر"]
    }
  ];

  const academicFields = [
    { name: "العلوم الطبيعية", icon: Atom, publications: "500+" },
    { name: "الرياضيات", icon: Calculator, publications: "300+" },
    { name: "العلوم الطبية", icon: Microscope, publications: "450+" },
    { name: "العلوم الاجتماعية", icon: Users, publications: "400+" },
    { name: "الهندسة", icon: PenTool, publications: "350+" },
    { name: "الكيمياء", icon: FlaskConical, publications: "280+" },
    { name: "الأدب واللغات", icon: Library, publications: "320+" },
    { name: "التاريخ", icon: BookOpen, publications: "250+" }
  ];

  const qualityStandards = [
    {
      title: "دقة أكاديمية متميزة",
      description: "مترجمون أكاديميون متخصصون في مجالاتهم العلمية",
      icon: Award,
      standard: "PhD"
    },
    {
      title: "معايير النشر الدولية",
      description: "الالتزام بمعايير المجلات العلمية والمؤسسات الأكاديمية",
      icon: Globe,
      standard: "ISI/Scopus"
    },
    {
      title: "سرية البحث العلمي",
      description: "حماية الملكية الفكرية والبيانات البحثية الحساسة",
      icon: Library,
      standard: "NDA"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  const bookAnimation = {
    rotateY: [0, 10, -10, 0],
    scale: [1, 1.05, 1],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      {/* Academic Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Academic Elements Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            >
              {i % 3 === 0 ? (
                <BookOpen className="w-8 h-8 text-blue-300/50" />
              ) : i % 3 === 1 ? (
                <GraduationCap className="w-8 h-8 text-indigo-300/50" />
              ) : (
                <Award className="w-8 h-8 text-cyan-300/50" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="relative container mx-auto max-w-6xl px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: "spring" as const, stiffness: 80 }}
            className="text-center text-white"
          >
            <motion.div
              className="flex justify-center mb-10"
              animate={bookAnimation}
            >
              <div className="relative">
                <div className="p-8 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl backdrop-blur-sm border border-white/20 shadow-2xl">
                  <GraduationCap className="h-20 w-20" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                  }}
                >
                  <Award className="h-8 w-8 text-yellow-400" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -left-2"
                  animate={{
                    rotate: [0, 360],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                >
                  <Atom className="h-6 w-6 text-cyan-300" />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-8 font-arabic-title"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <span className="bg-gradient-to-r from-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                الترجمة الأكاديمية المتخصصة
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl mb-10 font-arabic-body max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              نبني جسور المعرفة بين الثقافات - ترجمة أكاديمية دقيقة تحافظ على الأصالة العلمية
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="text-lg px-10 py-4 bg-white text-indigo-600 hover:bg-white/90 shadow-xl font-bold"
                >
                  ابدأ مشروعك الأكاديمي
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-10 py-4 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  تصفح الأبحاث المترجمة
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-arabic-title">
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                خدمات الترجمة الأكاديمية
              </span>
            </h2>
            <p className="text-xl text-gray-600 font-arabic-body max-w-3xl mx-auto">
              نقدم ترجمة أكاديمية عالية الجودة تلبي معايير المؤسسات التعليمية والبحثية
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 mb-20"
          >
            {academicServices.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -8 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardHeader className="relative pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className="p-4 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl text-white shadow-lg"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                         transition={{ type: "spring" as const, stiffness: 300 }}
                      >
                        <service.icon className="h-6 w-6" />
                      </motion.div>
                      <div className="flex-1">
                        <CardTitle className="font-arabic-title text-right text-xl mb-2">
                          {service.title}
                        </CardTitle>
                        <Badge 
                          variant="secondary" 
                          className="bg-indigo-100 text-indigo-700"
                        >
                          {service.level}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <p className="text-gray-600 font-arabic-body text-right mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {service.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: idx * 0.1 + 0.3 }}
                        >
                          <Badge variant="outline" className="text-sm bg-indigo-50 border-indigo-200">
                            {feature}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Academic Fields */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-20"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 font-arabic-title text-gray-800">
              التخصصات الأكاديمية
            </h3>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {academicFields.map((field, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  className="group cursor-pointer"
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className="inline-flex p-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full text-white mb-4 shadow-lg"
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        transition={{ type: "spring" as const, stiffness: 300 }}
                      >
                        <field.icon className="h-6 w-6" />
                      </motion.div>
                      <h4 className="font-arabic-title font-semibold text-gray-800 text-sm mb-2">
                        {field.name}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {field.publications} بحث
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Quality Standards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-20"
          >
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white">
                <CardContent className="p-12">
                  <div className="text-center mb-12">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className="inline-block"
                    >
                      <Microscope className="h-20 w-20 mx-auto mb-6" />
                    </motion.div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 font-arabic-title">
                      معايير الجودة الأكاديمية
                    </h3>
                    <p className="text-xl font-arabic-body opacity-90 max-w-3xl mx-auto">
                      نلتزم بأعلى معايير الدقة الأكاديمية والأصالة العلمية في جميع ترجماتنا
                    </p>
                  </div>
                  
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-8"
                  >
                    {qualityStandards.map((standard, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="text-center"
                      >
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
                          <motion.div
                            className="inline-flex p-4 bg-white/20 rounded-full mb-6"
                            whileHover={{ scale: 1.1, rotate: 10 }}
                          >
                            <standard.icon className="h-8 w-8" />
                          </motion.div>
                          <Badge 
                            variant="secondary" 
                            className="mb-4 bg-white/20 text-white border-white/30"
                          >
                            {standard.standard}
                          </Badge>
                          <h4 className="text-xl font-bold mb-4 font-arabic-title">
                            {standard.title}
                          </h4>
                          <p className="font-arabic-body opacity-90 text-sm leading-relaxed">
                            {standard.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </div>
            </Card>
          </motion.div>

          {/* Advanced Translation Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <AdvancedTranslationForm 
              translationType="academic"
              title="طلب ترجمة أكاديمية متخصصة"
              description="ترجمة أكاديمية دقيقة للأبحاث والرسائل العلمية"
              gradientFrom="indigo-600"
              gradientTo="blue-600"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AcademicTranslation;