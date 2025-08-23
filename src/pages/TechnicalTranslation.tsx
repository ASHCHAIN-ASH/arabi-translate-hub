import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Code, Cpu, Zap, Shield, Award } from "lucide-react";

const TechnicalTranslation = () => {
  const technicalServices = [
    {
      title: "ترجمة المستندات التقنية",
      description: "ترجمة الدليل الفني والكتيبات والمواصفات التقنية",
      icon: Settings,
    },
    {
      title: "ترجمة البرمجيات",
      description: "ترجمة واجهات البرامج والتطبيقات والمواقع التقنية",
      icon: Code,
    },
    {
      title: "ترجمة المعدات الصناعية",
      description: "ترجمة دليل التشغيل والصيانة للمعدات والآلات",
      icon: Cpu,
    },
    {
      title: "ترجمة براءات الاختراع",
      description: "ترجمة براءات الاختراع والوثائق التقنية المتخصصة",
      icon: Zap,
    },
  ];

  const advantages = [
    "مترجمون متخصصون في المجالات التقنية",
    "فهم عميق للمصطلحات العلمية والتقنية",
    "ترجمة دقيقة للمخططات والرسوم البيانية",
    "خبرة في مختلف التخصصات الهندسية",
    "الحفاظ على التنسيق الأصلي للمستندات",
    "مراجعة تقنية من قبل خبراء متخصصين",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Settings className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-arabic-title">
              خدمات الترجمة التقنية
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-arabic-body">
              ترجمة احترافية للمستندات التقنية والهندسية بأعلى معايير الدقة والجودة
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              احصل على استشارة مجانية
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
              خدماتنا في الترجمة التقنية
            </h2>
            <p className="text-xl text-gray-600 font-arabic-body">
              نقدم حلول ترجمة متخصصة لجميع المجالات التقنية والهندسية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {technicalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <service.icon className="h-6 w-6 text-purple-600" />
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

          {/* Technical Specializations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Shield className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 font-arabic-title">
                    التخصصات التقنية المتاحة
                  </h3>
                  <p className="text-lg font-arabic-body">
                    نغطي جميع المجالات التقنية والهندسية
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    "هندسة البرمجيات",
                    "الهندسة الميكانيكية", 
                    "الهندسة الكهربائية",
                    "تكنولوجيا المعلومات",
                    "الهندسة المدنية",
                    "الاتصالات والشبكات",
                    "الطاقة المتجددة",
                    "التصنيع والإنتاج",
                    "الأتمتة والروبوتات"
                  ].map((spec, index) => (
                    <Badge key={index} variant="secondary" className="p-3 text-center justify-center">
                      {spec}
                    </Badge>
                  ))}
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
              مميزات خدماتنا التقنية
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <span className="font-arabic-body text-gray-700">
                    {advantage}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default TechnicalTranslation;