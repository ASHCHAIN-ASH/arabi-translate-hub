import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, FileText, Search, BookOpen, Award, Star } from "lucide-react";
import SmartPriceCalculator from "@/components/SmartPriceCalculator";

const AcademicTranslation = () => {
  const academicServices = [
    {
      title: "ترجمة الأطروحات والرسائل",
      description: "ترجمة رسائل الماجستير والدكتوراه والأطروحات الجامعية",
      icon: GraduationCap,
    },
    {
      title: "ترجمة الأبحاث العلمية",
      description: "ترجمة البحوث والدراسات والأوراق العلمية المحكمة",
      icon: Search,
    },
    {
      title: "ترجمة المناهج التعليمية",
      description: "ترجمة الكتب الدراسية والمناهج والمواد التعليمية",
      icon: BookOpen,
    },
    {
      title: "ترجمة الوثائق الأكاديمية",
      description: "ترجمة الشهادات والسجلات الأكاديمية والوثائق الجامعية",
      icon: FileText,
    },
  ];

  const academicFields = [
    "العلوم الطبيعية",
    "العلوم الإنسانية",
    "الطب والعلوم الصحية",
    "الهندسة والتكنولوجيا",
    "العلوم الاجتماعية",
    "الاقتصاد والإدارة",
    "القانون والعلوم السياسية",
    "التربية وعلم النفس",
    "اللغات والآداب",
    "الفنون والإعلام",
    "الزراعة والبيئة",
    "الرياضيات والإحصاء"
  ];

  const advantages = [
    "مترجمون حاملو درجات علمية عليا",
    "فهم عميق للمنهجية العلمية والأكاديمية",
    "دقة في ترجمة المصطلحات العلمية المتخصصة",
    "احترام معايير التوثيق والمراجع العلمية",
    "خبرة في متطلبات النشر الأكاديمي",
    "ترجمة معتمدة ومقبولة من الجامعات العالمية",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Header */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <GraduationCap className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-arabic-title">
              خدمات الترجمة الأكاديمية
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-arabic-body">
              ترجمة أكاديمية دقيقة ومتخصصة للأبحاث والدراسات العلمية
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              احصل على ترجمة أكاديمية معتمدة
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
              خدمات الترجمة الأكاديمية
            </h2>
            <p className="text-xl text-gray-600 font-arabic-body">
              نقدم ترجمة أكاديمية احترافية تلبي أعلى المعايير العلمية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {academicServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <service.icon className="h-6 w-6 text-indigo-600" />
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

          {/* Academic Standards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-indigo-100 to-purple-100 border-none">
              <CardContent className="p-8 text-center">
                <Star className="h-16 w-16 mx-auto mb-6 text-indigo-600" />
                <h3 className="text-3xl font-bold mb-6 font-arabic-title text-gray-800">
                  معايير الترجمة الأكاديمية
                </h3>
                <p className="text-lg text-gray-700 font-arabic-body leading-relaxed max-w-4xl mx-auto mb-8">
                  نلتزم بأعلى المعايير الأكاديمية العالمية في الترجمة، مع التركيز على الدقة العلمية والأمانة الأكاديمية
                </p>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <strong className="text-indigo-600">دقة المحتوى:</strong> ترجمة دقيقة للمفاهيم العلمية
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <strong className="text-indigo-600">المنهجية:</strong> احترام المنهجية العلمية والبحثية
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <strong className="text-indigo-600">التوثيق:</strong> الحفاظ على أسلوب التوثيق والمراجع
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Academic Fields */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <BookOpen className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 font-arabic-title">
                    التخصصات الأكاديمية
                  </h3>
                  <p className="text-lg font-arabic-body">
                    نغطي جميع المجالات الأكاديمية والعلمية
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {academicFields.map((field, index) => (
                    <Badge key={index} variant="secondary" className="p-3 text-center justify-center">
                      {field}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quality Assurance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-center mb-8 font-arabic-title text-gray-800">
              ضمان الجودة الأكاديمية
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-indigo-600">1</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 font-arabic-title">التحليل الأولي</h4>
                  <p className="text-sm text-gray-600 font-arabic-body">
                    تحليل النص وتحديد المنهجية والمصطلحات
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-indigo-600">2</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 font-arabic-title">الترجمة المتخصصة</h4>
                  <p className="text-sm text-gray-600 font-arabic-body">
                    ترجمة بواسطة خبراء في نفس التخصص
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-indigo-600">3</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 font-arabic-title">المراجعة الأكاديمية</h4>
                  <p className="text-sm text-gray-600 font-arabic-body">
                    مراجعة من قبل أكاديميين متخصصين
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-indigo-600">4</span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 font-arabic-title">التدقيق النهائي</h4>
                  <p className="text-sm text-gray-600 font-arabic-body">
                    تدقيق شامل للمحتوى والمراجع
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
              مميزات خدماتنا الأكاديمية
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-indigo-600 flex-shrink-0" />
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
              احسب تكلفة الترجمة الأكاديمية
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

export default AcademicTranslation;