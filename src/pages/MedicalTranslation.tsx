import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stethoscope, Heart, FileText, Shield, Award, Users } from "lucide-react";
import SmartPriceCalculator from "@/components/SmartPriceCalculator";

const MedicalTranslation = () => {
  const medicalServices = [
    {
      title: "ترجمة التقارير الطبية",
      description: "ترجمة التقارير والفحوصات الطبية والأشعة والتحاليل",
      icon: FileText,
    },
    {
      title: "ترجمة الوصفات الطبية",
      description: "ترجمة الوصفات الطبية وتعليمات الدواء والجرعات",
      icon: Heart,
    },
    {
      title: "ترجمة الأبحاث الطبية",
      description: "ترجمة الأبحاث والدراسات الطبية والمقالات العلمية",
      icon: Users,
    },
    {
      title: "ترجمة المعدات الطبية",
      description: "ترجمة دليل الاستخدام للأجهزة والمعدات الطبية",
      icon: Stethoscope,
    },
  ];

  const specializations = [
    "الطب العام",
    "طب القلب",
    "الجراحة",
    "طب الأطفال", 
    "طب النساء والولادة",
    "طب العيون",
    "طب الأسنان",
    "الطب النفسي",
    "طب الأورام",
    "التخدير والعناية المركزة",
    "الطب الباطني",
    "طب الطوارئ"
  ];

  const advantages = [
    "مترجمون أطباء ومتخصصون في المجال الطبي",
    "فهم دقيق للمصطلحات الطبية المعقدة",
    "التزام تام بسرية المعلومات الطبية",
    "ترجمة معتمدة ومقبولة من المؤسسات الطبية",
    "مراجعة طبية متخصصة لضمان الدقة",
    "خبرة في جميع التخصصات الطبية",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: "spring" as const, stiffness: 80 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Stethoscope className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-arabic-title">
              خدمات الترجمة الطبية
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-arabic-body">
              ترجمة طبية دقيقة وموثوقة على يد أطباء ومترجمين متخصصين
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              احصل على ترجمة طبية آمنة
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
              خدماتنا في الترجمة الطبية
            </h2>
            <p className="text-xl text-gray-600 font-arabic-body">
              نقدم ترجمة طبية احترافية تضمن الدقة والسرية التامة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {medicalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <service.icon className="h-6 w-6 text-green-600" />
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

          {/* Medical Specializations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-green-600 to-green-800 text-white">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Shield className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 font-arabic-title">
                    التخصصات الطبية المتاحة
                  </h3>
                  <p className="text-lg font-arabic-body">
                    نغطي جميع التخصصات الطبية بدقة عالية
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {specializations.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="p-3 text-center justify-center">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-16"
          >
            <Card className="border-2 border-green-200">
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-2xl font-bold mb-4 font-arabic-title text-gray-800">
                  السرية والأمان
                </h3>
                <p className="text-lg text-gray-600 font-arabic-body mb-6">
                  نلتزم بأعلى معايير السرية والخصوصية للمعلومات الطبية وفقاً للمعايير الدولية
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <strong>حماية البيانات:</strong> تشفير جميع الملفات والوثائق
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <strong>اتفاقية السرية:</strong> جميع المترجمين موقعون على اتفاقية سرية
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Advantages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-center mb-8 font-arabic-title text-gray-800">
              لماذا تختار ترجمتنا الطبية؟
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-green-600 flex-shrink-0" />
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
              احسب تكلفة الترجمة الطبية
            </h3>
            <SmartPriceCalculator 
              files={[]}
              fromLanguage="ar"
              toLanguage="en"
              urgency="standard"
              qualityLevel="expert"
              onPriceChange={(price, details) => console.log('Medical translation price:', price)}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MedicalTranslation;