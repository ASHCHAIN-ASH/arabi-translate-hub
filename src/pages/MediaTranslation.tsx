import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Newspaper, Radio, Camera, Award, Play } from "lucide-react";
import SmartPriceCalculator from "@/components/SmartPriceCalculator";
import realVideoTranslationImg from "@/assets/real-video-translation.jpg";

const MediaTranslation = () => {
  const mediaServices = [
    {
      title: "ترجمة الأفلام والمسلسلات",
      description: "ترجمة وعمل ترجمة فورية للأفلام والمحتوى المرئي",
      icon: Video,
    },
    {
      title: "ترجمة الأخبار والتقارير",
      description: "ترجمة النشرات الإخبارية والتقارير الصحفية",
      icon: Newspaper,
    },
    {
      title: "ترجمة البودكاست والراديو",
      description: "ترجمة المحتوى الصوتي والبرامج الإذاعية",
      icon: Radio,
    },
    {
      title: "ترجمة المحتوى الرقمي",
      description: "ترجمة محتوى وسائل التواصل الاجتماعي والمواقع",
      icon: Camera,
    },
  ];

  const mediaTypes = [
    "الأفلام الوثائقية",
    "المسلسلات التلفزيونية",
    "الإعلانات التجارية",
    "البرامج التعليمية",
    "المحتوى الترفيهي",
    "التقارير الإخبارية",
    "المقابلات الصحفية",
    "البودكاست",
    "الفيديوهات التسويقية"
  ];

  const advantages = [
    "فريق متخصص في ترجمة المحتوى الإعلامي",
    "مراعاة السياق الثقافي والاجتماعي",
    "تزامن دقيق مع الصوت والصورة",
    "خبرة في جميع أنواع المحتوى الإعلامي",
    "ضمان جودة الترجمة والتوقيت",
    "دعم جميع صيغ الملفات الصوتية والمرئية",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Header */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Video className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-arabic-title">
              خدمات الترجمة الإعلامية
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-arabic-body">
              ترجمة احترافية للمحتوى الإعلامي والمرئي بجودة عالية ودقة متناهية
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              اطلب ترجمة إعلامية
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
              خدمات الترجمة الإعلامية
            </h2>
            <p className="text-xl text-gray-600 font-arabic-body">
              نقدم حلول ترجمة شاملة لجميع أنواع المحتوى الإعلامي والترفيهي
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {mediaServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <service.icon className="h-6 w-6 text-red-600" />
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
                src={realVideoTranslationImg}
                alt="خدمات الترجمة الإعلامية"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 font-arabic-title">
                  نجعل المحتوى الإعلامي يتحدث بجميع اللغات
                </h3>
                <p className="text-lg font-arabic-body">
                  ترجمة دقيقة ومتزامنة للمحتوى المرئي والصوتي
                </p>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Media Types */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-red-600 to-red-800 text-white">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Camera className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 font-arabic-title">
                    أنواع المحتوى الإعلامي
                  </h3>
                  <p className="text-lg font-arabic-body">
                    نتعامل مع جميع أنواع المحتوى الإعلامي والترفيهي
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {mediaTypes.map((type, index) => (
                    <Badge key={index} variant="secondary" className="p-3 text-center justify-center">
                      {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Process */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-center mb-8 font-arabic-title text-gray-800">
              عملية الترجمة الإعلامية
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-red-600">1</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 font-arabic-title">تحليل المحتوى</h4>
                  <p className="text-sm text-gray-600 font-arabic-body">
                    دراسة المحتوى وتحديد أسلوب الترجمة المناسب
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-red-600">2</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 font-arabic-title">الترجمة النصية</h4>
                  <p className="text-sm text-gray-600 font-arabic-body">
                    ترجمة النص مع مراعاة السياق والثقافة
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-red-600">3</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 font-arabic-title">التزامن والتوقيت</h4>
                  <p className="text-sm text-gray-600 font-arabic-body">
                    ضبط التوقيت والتزامن مع الصوت والصورة
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-red-600">4</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 font-arabic-title">المراجعة النهائية</h4>
                  <p className="text-sm text-gray-600 font-arabic-body">
                    مراجعة شاملة وضمان الجودة
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
              مميزات خدماتنا الإعلامية
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-red-600 flex-shrink-0" />
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
              احسب تكلفة الترجمة الإعلامية
            </h3>
            <SmartPriceCalculator 
              files={[]}
              fromLanguage="ar"
              toLanguage="en"
              urgency="standard"
              wordCount={0}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MediaTranslation;