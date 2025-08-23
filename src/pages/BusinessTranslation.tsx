import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, FileText, TrendingUp, Users, Globe, Award } from "lucide-react";
import realBusinessServicesImg from "@/assets/real-business-services.jpg";

const BusinessTranslation = () => {
  const businessServices = [
    {
      title: "ترجمة المراسلات التجارية",
      description: "ترجمة الخطابات والإيميلات والاتفاقيات التجارية",
      icon: FileText,
    },
    {
      title: "ترجمة التقارير المالية",
      description: "ترجمة البيانات المالية والتقارير السنوية والميزانيات",
      icon: TrendingUp,
    },
    {
      title: "ترجمة المواقع التجارية",
      description: "ترجمة مواقع الشركات والمتاجر الإلكترونية",
      icon: Globe,
    },
    {
      title: "ترجمة العروض التقديمية",
      description: "ترجمة العروض والبرزنتيشن والكتالوجات",
      icon: Users,
    },
  ];

  const advantages = [
    "فهم عميق للمصطلحات التجارية والاقتصادية",
    "خبرة في مختلف القطاعات التجارية",
    "ترجمة معتمدة ومقبولة دولياً",
    "سرعة في التسليم مع ضمان الجودة",
    "سرية تامة لجميع المعلومات التجارية",
    "فريق متخصص في الترجمة التجارية",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-orange-600 to-orange-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <Briefcase className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-arabic-title">
              خدمات الترجمة التجارية
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-arabic-body">
              نساعد شركتك على التوسع عالمياً بترجمة احترافية لجميع المستندات التجارية
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              احصل على عرض سعر مجاني
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
              خدماتنا في الترجمة التجارية
            </h2>
            <p className="text-xl text-gray-600 font-arabic-body">
              نقدم حلول ترجمة شاملة لجميع احتياجاتك التجارية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {businessServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <service.icon className="h-6 w-6 text-orange-600" />
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
                src={realBusinessServicesImg}
                alt="خدمات الترجمة التجارية"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 font-arabic-title">
                  شريكك الموثوق في التوسع العالمي
                </h3>
                <p className="text-lg font-arabic-body">
                  نساعد الشركات على كسر حواجز اللغة والوصول لأسواق جديدة
                </p>
              </div>
            </div>
          </motion.div>

          {/* Advantages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-center mb-8 font-arabic-title text-gray-800">
              لماذا تختار خدماتنا؟
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-orange-600 flex-shrink-0" />
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

export default BusinessTranslation;