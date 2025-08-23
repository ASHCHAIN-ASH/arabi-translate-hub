import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Clock, Mic, MessageCircle, Users, Award } from "lucide-react";
import SmartPriceCalculator from "@/components/SmartPriceCalculator";
import realAudioTranslationImg from "@/assets/real-audio-translation.jpg";

const InstantTranslation = () => {
  const instantServices = [
    {
      title: "الترجمة الصوتية الفورية",
      description: "ترجمة فورية للمحادثات والاجتماعات المباشرة",
      icon: Mic,
    },
    {
      title: "ترجمة المؤتمرات",
      description: "خدمة ترجمة فورية للمؤتمرات والندوات الدولية",
      icon: Users,
    },
    {
      title: "ترجمة المكالمات",
      description: "ترجمة فورية للمكالمات التجارية والشخصية",
      icon: MessageCircle,
    },
    {
      title: "الترجمة التفاعلية",
      description: "ترجمة تفاعلية مباشرة للأحداث والفعاليات",
      icon: Zap,
    },
  ];

  const advantages = [
    "مترجمون محترفون متاحون على مدار الساعة",
    "ترجمة فورية بجودة عالية ودقة متناهية",
    "دعم أكثر من 50 لغة عالمية",
    "خدمة سريعة الاستجابة خلال دقائق",
    "تقنيات حديثة لضمان وضوح الصوت",
    "أسعار تنافسية مع خطط مرنة",
  ];

  const languages = [
    "العربية", "الإنجليزية", "الفرنسية", "الألمانية", "الإسبانية", "الإيطالية",
    "الروسية", "الصينية", "اليابانية", "الكورية", "التركية", "الفارسية"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white">
      {/* Header */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-teal-600 to-teal-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Zap className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-arabic-title">
              خدمات الترجمة الفورية
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-arabic-body">
              ترجمة فورية احترافية لجميع احتياجاتك في الوقت الفعلي
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                متاح 24/7
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                ترجمة فورية
              </Badge>
            </div>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              احجز جلسة ترجمة فورية
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
              خدمات الترجمة الفورية
            </h2>
            <p className="text-xl text-gray-600 font-arabic-body">
              نقدم حلول ترجمة فورية متطورة لجميع المناسبات والاحتياجات
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {instantServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-teal-100 rounded-lg">
                        <service.icon className="h-6 w-6 text-teal-600" />
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

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={realAudioTranslationImg}
                alt="خدمات الترجمة الفورية"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 font-arabic-title">
                  كسر حواجز اللغة في الوقت الفعلي
                </h3>
                <p className="text-lg font-arabic-body">
                  تواصل بثقة مع العالم بترجمة فورية دقيقة ومهنية
                </p>
              </div>
            </div>
          </motion.div>

          {/* Languages Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-teal-600 to-teal-800 text-white">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 font-arabic-title">
                    اللغات المتاحة
                  </h3>
                  <p className="text-lg font-arabic-body">
                    ندعم أكثر من 50 لغة عالمية للترجمة الفورية
                  </p>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                  {languages.map((lang, index) => (
                    <Badge key={index} variant="secondary" className="p-3 text-center justify-center">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How it Works */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-center mb-8 font-arabic-title text-gray-800">
              كيف تعمل الخدمة؟
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-teal-600">1</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 font-arabic-title">احجز الجلسة</h4>
                  <p className="text-gray-600 font-arabic-body">
                    احجز جلسة ترجمة فورية مع تحديد اللغات المطلوبة
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-teal-600">2</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 font-arabic-title">ابدأ الاتصال</h4>
                  <p className="text-gray-600 font-arabic-body">
                    ادخل إلى جلسة الترجمة وابدأ المحادثة مباشرة
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-teal-600">3</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2 font-arabic-title">تواصل بسهولة</h4>
                  <p className="text-gray-600 font-arabic-body">
                    تحدث بلغتك واتركنا نترجم لك في الوقت الفعلي
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
              مميزات خدمتنا
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-teal-600 flex-shrink-0" />
                  <span className="font-arabic-body text-gray-700">
                    {advantage}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-center mb-8 font-arabic-title text-gray-800">
              احسب تكلفة الترجمة الفورية
            </h3>
            <SmartPriceCalculator 
              files={[]}
              fromLanguage="ar"
              toLanguage="en"
              urgency="express"
              qualityLevel="premium"
              onPriceChange={(price, details) => console.log('Instant translation price:', price)}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default InstantTranslation;