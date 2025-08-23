import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedCounter from "./AnimatedCounter";
import { 
  GraduationCap, 
  Languages, 
  BookOpen, 
  Award,
  Globe,
  Users,
  TrendingUp,
  PenTool,
  Search,
  Trophy,
  Brain,
  Target,
  FileCheck,
  Lightbulb,
  Star,
  BarChart3,
  BookMarked,
  Microscope,
  Calculator,
  Library
} from "lucide-react";

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const allStats = [
    { 
      icon: GraduationCap, 
      number: 2500, 
      suffix: "+",
      title: "طالب تخرج",
      subtitle: "ماجستير ودكتوراه",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    { 
      icon: BookOpen, 
      number: 15000, 
      suffix: "+",
      title: "بحث منجز",
      subtitle: "للطلاب والباحثين",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    { 
      icon: Languages, 
      number: 180, 
      suffix: "+",
      title: "لغة مترجمة",
      subtitle: "خدمات ترجمة متخصصة",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    { 
      icon: Award, 
      number: 99.8, 
      suffix: "%",
      title: "معدل الرضا",
      subtitle: "من عملائنا الكرام",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    { 
      icon: Brain, 
      number: 320, 
      suffix: "+",
      title: "خبير متخصص",
      subtitle: "في فريق العمل",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    { 
      icon: Users, 
      number: 50000, 
      suffix: "+",
      title: "عميل راضي",
      subtitle: "حول العالم",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200"
    },
    { 
      icon: Globe, 
      number: 92, 
      suffix: "+",
      title: "دولة نخدمها",
      subtitle: "في جميع القارات",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200"
    },
    { 
      icon: Trophy, 
      number: 95, 
      suffix: "%",
      title: "نسبة النجاح",
      subtitle: "في المشاريع",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    { 
      icon: Target, 
      number: 48, 
      suffix: " ساعة",
      title: "وقت التسليم",
      subtitle: "المتوسط للمشاريع",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    { 
      icon: BookMarked, 
      number: 8500, 
      suffix: "+",
      title: "مقال علمي",
      subtitle: "تم إنجازه بتميز",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    { 
      icon: Calculator, 
      number: 950, 
      suffix: "+",
      title: "تحليل إحصائي",
      subtitle: "دقيق ومتخصص",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    { 
      icon: TrendingUp, 
      number: 15, 
      suffix: " سنة",
      title: "خبرة متراكمة",
      subtitle: "في الخدمات الأكاديمية",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="text-lg font-semibold px-6 py-3 bg-white border-gray-300 mb-8">
            إحصائياتنا الرائعة
          </Badge>
          
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            أرقامنا تتحدث عن تميزنا
          </h2>
          
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            بيانات موثقة تعكس جودة خدماتنا وثقه عملائنا في جميع أنحاء العالم
          </p>
        </div>

        {/* شبكة الإحصائيات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {allStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="group">
                <Card className={`
                  h-64 ${stat.bgColor} border-2 ${stat.borderColor} 
                  hover:border-gray-300 transition-all duration-300 
                  hover:shadow-xl hover:shadow-gray-200/50
                  rounded-2xl overflow-hidden
                `}>
                  <CardContent className="p-6 h-full flex flex-col justify-between text-center">
                    {/* الأيقونة */}
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                        <IconComponent className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </div>

                    {/* الرقم */}
                    <div className="mb-4">
                      <div className="text-4xl font-bold text-gray-800 mb-2">
                        <AnimatedCounter 
                          end={stat.number} 
                          duration={2.5} 
                          delay={index * 0.1}
                          suffix={stat.suffix}
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">
                        {stat.title}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {stat.subtitle}
                      </p>
                    </div>

                    {/* خط سفلي */}
                    <div className={`w-full h-1 ${stat.color.replace('text-', 'bg-')} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* شعار الثقه */}
        <div className="text-center mt-20">
          <Card className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl border-0 rounded-2xl">
            <CardContent className="px-12 py-8">
              <div className="flex items-center gap-6">
                <div>
                  <Star className="h-10 w-10 text-yellow-300" />
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">
                    وكالة الخدمات الأكاديمية الرائدة
                  </div>
                  <div className="text-lg opacity-90">
                    نخدم الطلاب والباحثين في 92+ دولة حول العالم
                  </div>
                </div>
                
                <div>
                  <Star className="h-10 w-10 text-yellow-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;