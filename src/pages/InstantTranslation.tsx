import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Clock, Smartphone, MessageSquare, Globe, Mic, Video, FileText, Star, CheckCircle, Timer, Users } from "lucide-react";
import SmartPriceCalculator from "@/components/SmartPriceCalculator";

const InstantTranslation = () => {
  const instantServices = [
    {
      title: "ترجمة فورية للنصوص",
      description: "ترجمة سريعة ودقيقة للنصوص القصيرة والرسائل في ثوانٍ معدودة",
      icon: MessageSquare,
      speed: "10 ثوانٍ",
      features: ["ترجمة فورية", "دقة عالية", "متعدد اللغات"]
    },
    {
      title: "ترجمة صوتية مباشرة",
      description: "تحويل الكلام المنطوق إلى نص مترجم في الوقت الفعلي",
      icon: Mic,
      speed: "مباشر",
      features: ["تحويل صوتي", "ترجمة فورية", "جودة صوتية عالية"]
    },
    {
      title: "ترجمة الصور والوثائق",
      description: "استخراج النص من الصور وترجمته فوراً باستخدام التقنيات المتطورة",
      icon: FileText,
      speed: "30 ثانية",
      features: ["استخراج نص", "ترجمة تلقائية", "معالجة صور"]
    },
    {
      title: "ترجمة المحادثات المباشرة",
      description: "ترجمة المحادثات والاجتماعات في الوقت الفعلي لتسهيل التواصل",
      icon: Video,
      speed: "في الوقت الفعلي",
      features: ["محادثات مباشرة", "متعدد المتحدثين", "ترجمة متزامنة"]
    }
  ];

  const languages = [
    { code: "ar", name: "العربية", flag: "🇸🇦", popularity: 95 },
    { code: "en", name: "الإنجليزية", flag: "🇺🇸", popularity: 100 },
    { code: "fr", name: "الفرنسية", flag: "🇫🇷", popularity: 85 },
    { code: "es", name: "الإسبانية", flag: "🇪🇸", popularity: 90 },
    { code: "de", name: "الألمانية", flag: "🇩🇪", popularity: 80 },
    { code: "it", name: "الإيطالية", flag: "🇮🇹", popularity: 75 },
    { code: "pt", name: "البرتغالية", flag: "🇵🇹", popularity: 70 },
    { code: "ru", name: "الروسية", flag: "🇷🇺", popularity: 85 },
    { code: "zh", name: "الصينية", flag: "🇨🇳", popularity: 95 },
    { code: "ja", name: "اليابانية", flag: "🇯🇵", popularity: 80 },
    { code: "ko", name: "الكورية", flag: "🇰🇷", popularity: 75 },
    { code: "hi", name: "الهندية", flag: "🇮🇳", popularity: 85 }
  ];

  const features = [
    {
      title: "سرعة البرق",
      description: "ترجمة فورية في ثوانٍ معدودة باستخدام أحدث التقنيات",
      icon: Zap,
      metric: "< 5 ثوانٍ"
    },
    {
      title: "دقة متقدمة",
      description: "ذكاء اصطناعي متطور يضمن دقة الترجمة والسياق",
      icon: Star,
      metric: "96.5%"
    },
    {
      title: "متاح 24/7",
      description: "خدمة متاحة على مدار الساعة بدون انقطاع",
      icon: Clock,
      metric: "24/7"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
        type: "spring",
        stiffness: 120,
        damping: 12
      }
    }
  };

  const electricAnimation = {
    scale: [1, 1.1, 1],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* Electric Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Electric Animation Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1.5, 0.5],
                rotate: [0, 360],
              }}
              transition={{
                duration: 1.5 + Math.random() * 1,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <Zap className="w-4 h-4 text-yellow-300" />
            </motion.div>
          ))}
        </div>

        <div className="relative container mx-auto max-w-6xl px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            className="text-center text-white"
          >
            <motion.div
              className="flex justify-center mb-10"
              animate={electricAnimation}
            >
              <div className="relative">
                <div className="p-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl backdrop-blur-sm border border-white/30 shadow-2xl">
                  <Zap className="h-20 w-20" />
                </div>
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-yellow-300 rounded-full"
                    style={{
                      top: `${20 + i * 20}%`,
                      left: `${20 + i * 20}%`,
                    }}
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
            
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-8 font-arabic-title"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <span className="bg-gradient-to-r from-yellow-200 to-orange-300 bg-clip-text text-transparent">
                الترجمة الفورية السريعة
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl mb-10 font-arabic-body max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              ترجمة بسرعة البرق ودقة فائقة - كسر حاجز اللغة في ثوانٍ معدودة مع تقنية الذكاء الاصطناعي
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
                  className="text-lg px-10 py-4 bg-white text-orange-600 hover:bg-white/90 shadow-xl font-bold"
                >
                  جرب الترجمة الفورية الآن
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-10 py-4 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  شاهد العرض التوضيحي
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
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
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                خدمات الترجمة الفورية
              </span>
            </h2>
            <p className="text-xl text-gray-600 font-arabic-body max-w-3xl mx-auto">
              حلول ترجمة سريعة ومتطورة لجميع احتياجاتك الفورية
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 mb-20"
          >
            {instantServices.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -8 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardHeader className="relative pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white shadow-lg"
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <service.icon className="h-6 w-6" />
                      </motion.div>
                      <div className="flex-1">
                        <CardTitle className="font-arabic-title text-right text-xl mb-2">
                          {service.title}
                        </CardTitle>
                        <Badge 
                          variant="secondary" 
                          className="bg-orange-100 text-orange-700"
                        >
                          {service.speed}
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
                          <Badge variant="outline" className="text-sm bg-orange-50 border-orange-200">
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

          {/* Languages Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-20"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 font-arabic-title text-gray-800">
              اللغات المدعومة فورياً
            </h3>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {languages.map((lang, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="group cursor-pointer"
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{lang.flag}</div>
                      <h4 className="font-arabic-title font-semibold text-gray-800 text-sm mb-2">
                        {lang.name}
                      </h4>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <motion.div 
                          className="bg-gradient-to-r from-orange-400 to-red-500 h-1 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${lang.popularity}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-20"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 font-arabic-title text-gray-800">
              مميزات الترجمة الفورية
            </h3>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="text-center group"
                >
                  <Card className="border-0 shadow-xl h-full bg-gradient-to-br from-white to-orange-50 hover:shadow-2xl transition-all duration-500">
                    <CardContent className="p-8">
                      <motion.div
                        className="relative inline-flex p-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full text-white mb-6 shadow-lg"
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <feature.icon className="h-10 w-10" />
                        <motion.div
                          className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full px-2 py-1 text-xs font-bold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {feature.metric}
                        </motion.div>
                      </motion.div>
                      
                      <h4 className="text-xl font-bold mb-4 font-arabic-title text-gray-800">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 font-arabic-body leading-relaxed">
                        {feature.description}
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
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  احسب تكلفة الترجمة الفورية
                </span>
              </h3>
              <p className="text-xl text-gray-600 font-arabic-body max-w-3xl mx-auto">
                احصل على تقدير فوري لخدمات الترجمة السريعة مع أسعار تنافسية
              </p>
            </div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-red-100 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative">
                <SmartPriceCalculator 
                  files={[]}
                  fromLanguage="ar"
                  toLanguage="en"
                  urgency="express"
                  qualityLevel="premium"
                  onPriceChange={(price, details) => console.log('Instant translation price:', price)}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default InstantTranslation;