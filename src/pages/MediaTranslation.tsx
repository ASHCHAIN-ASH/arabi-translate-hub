import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Film, Tv, Radio, Headphones, Camera, Edit, Play, Pause, Volume2, Subtitles, Mic } from "lucide-react";
import SmartPriceCalculator from "@/components/SmartPriceCalculator";

const MediaTranslation = () => {
  const mediaServices = [
    {
      title: "ترجمة الأفلام والمسلسلات",
      description: "ترجمة وتوقيت الترجمات للأفلام والمسلسلات مع مراعاة السياق الثقافي",
      icon: Film,
      duration: "طويل المدى",
      features: ["توقيت دقيق", "سياق ثقافي", "جودة سينمائية"]
    },
    {
      title: "دبلجة صوتية احترافية",
      description: "دبلجة المحتوى الصوتي والمرئي بأصوات مميزة ومتنوعة",
      icon: Mic,
      duration: "متوسط",
      features: ["أصوات متنوعة", "تزامن صوتي", "جودة استوديو"]
    },
    {
      title: "ترجمة البودكاست والراديو",
      description: "ترجمة المحتوى الصوتي والبرامج الإذاعية والبودكاست",
      icon: Radio,
      duration: "سريع",
      features: ["ترجمة صوتية", "محتوى متخصص", "تحرير احترافي"]
    },
    {
      title: "ترجمة المحتوى التفاعلي",
      description: "ترجمة الألعاب والتطبيقات والمحتوى التفاعلي الرقمي",
      icon: Play,
      duration: "متغير",
      features: ["محتوى تفاعلي", "واجهات مستخدم", "تجربة سلسة"]
    }
  ];

  const mediaTypes = [
    { name: "الأفلام الوثائقية", icon: Camera, projects: "200+" },
    { name: "المسلسلات التلفزيونية", icon: Tv, projects: "150+" },
    { name: "الإعلانات التجارية", icon: Video, projects: "500+" },
    { name: "البودكاست", icon: Headphones, projects: "300+" },
    { name: "الألعاب الرقمية", icon: Play, projects: "100+" },
    { name: "المحتوى التعليمي", icon: Edit, projects: "400+" }
  ];

  const productionStages = [
    {
      title: "مرحلة ما قبل الإنتاج",
      description: "تحليل المحتوى وإعداد النصوص والتخطيط للترجمة",
      icon: Edit,
      stage: "التحضير"
    },
    {
      title: "مرحلة الإنتاج",
      description: "ترجمة وتوقيت وتحرير المحتوى بدقة احترافية",
      icon: Video,
      stage: "التنفيذ"
    },
    {
      title: "مرحلة ما بعد الإنتاج",
      description: "مراجعة نهائية وضبط الجودة وتسليم المنتج النهائي",
      icon: Film,
      stage: "الإنجاز"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        stiffness: 110,
        damping: 12
      }
    }
  };

  const filmVariants = {
    animate: {
      rotateY: [0, 10, -10, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      {/* Cinematic Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-600 to-red-700"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Film Reel Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 2) * 60}%`,
              }}
              animate={{
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              <div className="w-16 h-16 border-4 border-white/20 rounded-full">
                <div className="w-6 h-6 bg-white/30 rounded-full m-2"></div>
                {[...Array(8)].map((_, j) => (
                  <div
                    key={j}
                    className="absolute w-2 h-2 bg-white/40 rounded-full"
                    style={{
                      transform: `rotate(${j * 45}deg) translateY(-30px)`,
                      transformOrigin: "50% 30px"
                    }}
                  />
                ))}
              </div>
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
              variants={filmVariants}
              animate="animate"
            >
              <div className="relative">
                <div className="p-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl backdrop-blur-sm border border-white/20 shadow-2xl">
                  <Film className="h-20 w-20" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-8 font-arabic-title"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <span className="bg-gradient-to-r from-purple-200 to-pink-300 bg-clip-text text-transparent">
                ترجمة المحتوى الإعلامي
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl mb-10 font-arabic-body max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              نحن نعيد صياغة القصص بلغات متعددة - ترجمة احترافية للأفلام والمسلسلات والمحتوى الرقمي
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
                  className="text-lg px-10 py-4 bg-white text-purple-600 hover:bg-white/90 shadow-xl font-bold"
                >
                  ابدأ مشروعك الإعلامي
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-10 py-4 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  شاهد أعمالنا السابقة
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
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                خدمات الترجمة الإعلامية
              </span>
            </h2>
            <p className="text-xl text-gray-600 font-arabic-body max-w-3xl mx-auto">
              نقدم حلول ترجمة شاملة لجميع أنواع المحتوى الإعلامي والترفيهي
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 mb-20"
          >
            {mediaServices.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardHeader className="relative pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white shadow-lg"
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
                          className="bg-purple-100 text-purple-700"
                        >
                          {service.duration}
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
                          <Badge variant="outline" className="text-sm bg-purple-50 border-purple-200">
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

          {/* Media Types */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-20"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 font-arabic-title text-gray-800">
              أنواع المحتوى الإعلامي
            </h3>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 gap-6"
            >
              {mediaTypes.map((type, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  className="group cursor-pointer"
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className="inline-flex p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full text-white mb-4 shadow-lg"
                        whileHover={{ scale: 1.2, rotate: 15 }}
                         transition={{ type: "spring" as const, stiffness: 300 }}
                      >
                        <type.icon className="h-6 w-6" />
                      </motion.div>
                      <h4 className="font-arabic-title font-semibold text-gray-800 text-sm mb-2">
                        {type.name}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {type.projects} مشروع
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Production Stages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-20"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 font-arabic-title text-gray-800">
              مراحل الإنتاج الإعلامي
            </h3>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {productionStages.map((stage, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="text-center group"
                >
                  <Card className="border-0 shadow-xl h-full bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl transition-all duration-500">
                    <CardContent className="p-8">
                      <motion.div
                        className="relative inline-flex p-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full text-white mb-6 shadow-lg"
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        transition={{ type: "spring" as const, stiffness: 300 }}
                      >
                        <stage.icon className="h-10 w-10" />
                        <motion.div
                          className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full px-2 py-1 text-xs font-bold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {index + 1}
                        </motion.div>
                      </motion.div>
                      
                      <Badge 
                        variant="secondary" 
                        className="mb-4 bg-purple-100 text-purple-700"
                      >
                        {stage.stage}
                      </Badge>
                      <h4 className="text-xl font-bold mb-4 font-arabic-title text-gray-800">
                        {stage.title}
                      </h4>
                      <p className="text-gray-600 font-arabic-body leading-relaxed">
                        {stage.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Pricing Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 font-arabic-title">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  احسب تكلفة الترجمة الإعلامية
                </span>
              </h3>
              <p className="text-xl text-gray-600 font-arabic-body max-w-3xl mx-auto">
                احصل على تقدير دقيق لمشروع الترجمة الإعلامية مع مراعاة تعقيد المحتوى
              </p>
            </div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring" as const, stiffness: 100 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative">
                <SmartPriceCalculator 
                  files={[]}
                  fromLanguage="ar"
                  toLanguage="en"
                  urgency="standard"
                  qualityLevel="premium"
                  onPriceChange={(price, details) => console.log('Media translation price:', price)}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MediaTranslation;