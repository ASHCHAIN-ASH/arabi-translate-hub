import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Feather, Scroll, PenTool, Award, Heart } from "lucide-react";
import SmartPriceCalculator from "@/components/SmartPriceCalculator";

const LiteraryTranslation = () => {
  const literaryServices = [
    {
      title: "ترجمة الروايات والقصص",
      description: "ترجمة أدبية للروايات والقصص مع الحفاظ على الأسلوب",
      icon: BookOpen,
    },
    {
      title: "ترجمة الشعر والقصائد",
      description: "ترجمة شاعرية تحافظ على الإيقاع والمعنى الجمالي",
      icon: Feather,
    },
    {
      title: "ترجمة المخطوطات التراثية",
      description: "ترجمة متخصصة للمخطوطات والنصوص التراثية القديمة",
      icon: Scroll,
    },
    {
      title: "ترجمة المقالات الأدبية",
      description: "ترجمة المقالات والنقد الأدبي والدراسات الثقافية",
      icon: PenTool,
    },
  ];

  const literaryTypes = [
    "الروايات الكلاسيكية",
    "الأدب المعاصر",
    "الشعر العربي",
    "الشعر العالمي",
    "القصص القصيرة",
    "الأدب الشعبي",
    "النصوص المسرحية",
    "الأدب الفلسفي",
    "أدب الرحلات"
  ];

  const advantages = [
    "مترجمون أدباء ومتخصصون في الترجمة الأدبية",
    "حفظ الروح الأدبية والأسلوب الأصلي للنص",
    "فهم عميق للسياق الثقافي والتاريخي",
    "خبرة في ترجمة مختلف الأجناس الأدبية",
    "احترام خصوصية كل نص وأسلوب كاتبه",
    "مراجعة أدبية من قبل نقاد وأدباء متخصصين",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      {/* Header */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-pink-600 to-pink-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <BookOpen className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-arabic-title">
              خدمات الترجمة الأدبية
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-arabic-body">
              ترجمة أدبية راقية تحافظ على جمال النص وروحه الأصلية
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              اطلب ترجمة أدبية راقية
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-arabic-title text-gray-800">
              خدمات الترجمة الأدبية
            </h2>
            <p className="text-xl text-gray-600 font-arabic-body">
              نقدم ترجمة أدبية متقنة تجمع بين الدقة اللغوية والحس الجمالي
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {literaryServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-pink-100 rounded-lg">
                        <service.icon className="h-6 w-6 text-pink-600" />
                      </div>
                      <CardTitle className="font-arabic-title text-right">
                        {service.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 font-arabic-body text-right">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Literary Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-pink-100 to-purple-100 border-none">
              <CardContent className="p-8 text-center">
                <Heart className="h-16 w-16 mx-auto mb-6 text-pink-600" />
                <h3 className="text-3xl font-bold mb-6 font-arabic-title text-gray-800">
                  فلسفتنا في الترجمة الأدبية
                </h3>
                <p className="text-lg text-gray-700 font-arabic-body leading-relaxed max-w-4xl mx-auto">
                  نؤمن بأن الترجمة الأدبية ليست مجرد نقل كلمات من لغة إلى أخرى، بل هي إعادة خلق للنص في ثوب لغوي جديد مع الحفاظ على روحه وجماله الأصلي. نسعى إلى أن تكون ترجمتنا جسراً ثقافياً يربط بين الحضارات والشعوب.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Literary Types */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-pink-600 to-pink-800 text-white">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Scroll className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 font-arabic-title">
                    أنواع الأدب المتخصصة
                  </h3>
                  <p className="text-lg font-arabic-body">
                    نتعامل مع جميع الأجناس الأدبية بحرفية عالية
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {literaryTypes.map((type, index) => (
                    <Badge key={index} variant="secondary" className="p-3 text-center justify-center">
                      {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Translation Process */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-center mb-8 font-arabic-title text-gray-800">
              مراحل الترجمة الأدبية
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-pink-600">1</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 font-arabic-title">الدراسة التحليلية</h4>
                  <p className="text-sm text-gray-600 font-arabic-body">
                    دراسة عميقة للنص وسياقه التاريخي والثقافي
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-pink-600">2</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 font-arabic-title">الترجمة الأولية</h4>
                  <p className="text-sm text-gray-600 font-arabic-body">
                    ترجمة أولى تركز على المعنى والأسلوب
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-pink-600">3</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 font-arabic-title">التهذيب الأدبي</h4>
                  <p className="text-sm text-gray-600 font-arabic-body">
                    صقل النص وتحسين التعبير الأدبي
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-pink-600">4</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 font-arabic-title">المراجعة النهائية</h4>
                  <p className="text-sm text-gray-600 font-arabic-body">
                    مراجعة نهائية من قبل نقاد أدبيين
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Advantages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-center mb-8 font-arabic-title text-gray-800">
              مميزات خدماتنا الأدبية
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-pink-600 flex-shrink-0" />
                  <span className="font-arabic-body text-gray-700">
                    {advantage}
                  </span>
                </div>
              ))}
            </div>
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
                  احسب تكلفة الترجمة الأدبية
                </span>
              </h3>
              <p className="text-xl text-gray-600 font-arabic-body max-w-3xl mx-auto">
                احصل على تقدير دقيق لمشروع الترجمة الأدبية مع مراعاة التعقيد الأدبي والأسلوب
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
                  qualityLevel="expert"
                  onPriceChange={(price, details) => console.log('Literary translation price:', price)}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LiteraryTranslation;