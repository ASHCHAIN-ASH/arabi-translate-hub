import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Percent, Heart, FileText, BookOpen, Wallet, Users } from "lucide-react";
import enagoHeroBg from "@/assets/enago-hero-bg.jpg";

const ServicesShowcase = () => {
  const benefits = [
    {
      id: 1,
      title: "خصم يصل إلى 50%",
      description: "كل دولار تنفقه يعني توفيراً يصل إلى 50% للطلب التالي. قيمة الخصم المتراكمة لا تنتهي أبداً",
      icon: Percent,
      logoText: "PREMIUM DISCOUNT",
      position: "top-16 left-4",
      cardClass: "w-72"
    },
    {
      id: 2,
      title: "محرروك المفضلون",
      description: "احفظ محرريك المفضلين وسنقوم بإعطائهم الأولوية للعمل على مهامك المستقبلية",
      icon: Heart,
      logoText: "MyEditors",
      logoClass: "bg-red-500 text-white px-2 py-1 rounded text-sm font-bold",
      position: "top-16 right-4",
      cardClass: "w-72"
    },
    {
      id: 3,
      title: "حسابي الشخصي",
      description: "تتبع المهام، تحميل الملفات المسلمة والفواتير، واطلب خدمات ما بعد البيع من لوحة التحكم",
      icon: FileText,
      logoText: "MyPage Account",
      logoClass: "bg-red-500 text-white px-2 py-1 rounded text-sm font-bold",
      position: "bottom-32 left-4",
      cardClass: "w-72"
    },
    {
      id: 4,
      title: "المصادر الأكاديمية",
      description: "يمكنك الوصول إلى أكثر من 6000 مقالة أكاديمية لدينا في 9 لغات وحضور ورش العمل من قبل قادة المعرفة في الصناعة مجاناً",
      icon: BookOpen,
      logoText: "Academic Resources",
      logoClass: "bg-red-500 text-white px-2 py-1 rounded text-sm font-bold",
      position: "bottom-32 right-4",
      cardClass: "w-72"
    },
    {
      id: 5,
      title: "محفظة البحث",
      description: "احفظ صندوق البحث الخاص بك عندما تكون مخطوطتك جاهزة، واكسب قسائم أمازون ونقود كاش باك",
      icon: Wallet,
      logoText: "Enago Wallet",
      logoClass: "bg-red-500 text-white px-2 py-1 rounded text-sm font-bold",
      position: "bottom-4 left-1/4 transform -translate-x-1/2",
      cardClass: "w-80"
    },
    {
      id: 6,
      title: "برنامج الإحالة",
      description: "قم بإحالة صديق لكسب كوبونات نقدية وتجميع قيمة الخصم لحتى 50% خصم على طلبك التالي",
      icon: Users,
      logoText: "Referral Program",
      logoClass: "bg-red-500 text-white px-2 py-1 rounded text-sm font-bold",
      position: "bottom-4 right-1/4 transform translate-x-1/2",
      cardClass: "w-80"
    }
  ];

  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-6">
            مزايا مجتمع وكالة ماستر إيدو باث
          </h2>
        </motion.div>

        {/* التصميم الدائري */}
        <div className="relative flex items-center justify-center min-h-[800px]">
          {/* الصورة المركزية */}
          <motion.div 
            className="relative z-10 w-80 h-80 rounded-full overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img 
              src={enagoHeroBg} 
              alt="خدماتنا الاحترافية"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* البطاقات الموزعة */}
          <div className="absolute inset-0">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={benefit.id}
                  className={`absolute ${benefit.position}`}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card className={`${benefit.cardClass} bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border-0`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* الأيقونة أو الشعار */}
                        <div className="flex-shrink-0">
                          {benefit.logoClass ? (
                            <div className={benefit.logoClass}>
                              {benefit.logoText}
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <IconComponent className="h-6 w-6 text-yellow-600" />
                            </div>
                          )}
                        </div>
                        
                        {/* المحتوى */}
                        <div className="flex-1 text-right">
                          <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-lg leading-tight">
                            {benefit.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesShowcase;