import { motion } from "framer-motion";
import { 
  Shield, 
  Scale, 
  Copyright, 
  BookOpen, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Globe, 
  Users, 
  Building2, 
  Award, 
  Eye, 
  Ban, 
  Mail, 
  Phone, 
  Calendar,
  Star,
  Zap,
  Crown,
  Fingerprint,
  FileCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";

const IntellectualProperty = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" dir="rtl">
      <Header />
      <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white py-20 md:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 bg-blue-500/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-purple-500/20 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mb-8 shadow-2xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              الملكية الفكرية وحقوق النشر
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              حماية شاملة لجميع المحتويات والخدمات وفقاً لأعلى المعايير القانونية المحلية والدولية
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { icon: Scale, text: "حماية قانونية" },
                { icon: Globe, text: "معايير دولية" },
                { icon: Shield, text: "أمان تام" },
                { icon: Crown, text: "حقوق حصرية" }
              ].map(({ icon: Icon, text }, index) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
                >
                  <Icon className="h-5 w-5 text-blue-300" />
                  <span className="text-sm font-medium">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Warning Alert Section */}
      <section className="py-8 bg-gradient-to-r from-red-500 to-orange-600">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-red-200 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-red-800">تحذير قانوني مهم</h3>
                <p className="text-red-700">جميع المحتويات محمية قانونياً</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-6">
              <p className="text-red-800 text-base md:text-lg leading-relaxed mb-4">
                <strong>يُمنع منعاً باتاً</strong> نسخ أو استخدام أو توزيع أي من محتويات هذا الموقع أو خدماته دون الحصول على إذن كتابي مسبق من إدارة وكالة ماستر إيدو باث.
              </p>
              <p className="text-red-700 text-sm md:text-base">
                أي انتهاك لحقوق الملكية الفكرية يعرض المخالف للمساءلة القانونية والمطالبة بالتعويضات وفقاً للقوانين السعودية والدولية.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Protected Content Types */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                المحتويات المحمية
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                جميع عناصر الموقع والخدمات مشمولة بحماية الملكية الفكرية
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: FileText,
                  title: "النصوص والمحتوى",
                  description: "جميع النصوص والمقالات والوصف",
                  items: ["المقالات والأخبار", "وصف الخدمات", "المحتوى التسويقي", "النماذج والعقود"],
                  color: "blue"
                },
                {
                  icon: Eye,
                  title: "التصاميم البصرية",
                  description: "العناصر المرئية والجرافيكية",
                  items: ["الشعارات والرموز", "التصاميم والقوالب", "الصور والرسوم", "واجهة المستخدم"],
                  color: "purple"
                },
                {
                  icon: Zap,
                  title: "الأنظمة والبرمجيات",
                  description: "الحلول التقنية والبرمجية",
                  items: ["أكواد البرمجة", "قواعد البيانات", "الخوارزميات", "النظم المطورة"],
                  color: "green"
                },
                {
                  icon: BookOpen,
                  title: "المحتوى التعليمي",
                  description: "المواد والمناهج التدريبية",
                  items: ["الدورات التدريبية", "المناهج التعليمية", "الأدلة والكتب", "المواد المرجعية"],
                  color: "orange"
                },
                {
                  icon: Award,
                  title: "العلامات التجارية",
                  description: "الهوية التجارية والعلامات",
                  items: ["اسم الشركة", "الشعارات", "الألوان المميزة", "الشعارات الفرعية"],
                  color: "red"
                },
                {
                  icon: Users,
                  title: "الخدمات المبتكرة",
                  description: "الحلول والخدمات الحصرية",
                  items: ["منهجيات العمل", "العمليات المطورة", "الخدمات المبتكرة", "النماذج التجارية"],
                  color: "indigo"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="text-center pb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <item.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-800">{item.title}</CardTitle>
                      <CardDescription className="text-slate-600">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {item.items.map((subItem, subIndex) => (
                          <li key={subIndex} className="flex items-center gap-2 text-sm text-slate-700">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            {subItem}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Legal Framework */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                الإطار القانوني
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                حماية شاملة وفقاً للقوانين المحلية والدولية
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                {
                  title: "القوانين السعودية",
                  icon: Building2,
                  color: "green",
                  laws: [
                    "نظام حماية حقوق المؤلف السعودي",
                    "نظام العلامات التجارية",
                    "نظام براءات الاختراع والتصاميم",
                    "نظام مكافحة التجارة الإلكترونية المخالفة",
                    "أنظمة الهيئة السعودية للملكية الفكرية"
                  ]
                },
                {
                  title: "المعاهدات الدولية",
                  icon: Globe,
                  color: "blue",
                  laws: [
                    "اتفاقية برن لحماية المصنفات الأدبية والفنية",
                    "معاهدة منظمة التجارة العالمية (WTO)",
                    "اتفاقية باريس لحماية الملكية الصناعية",
                    "معاهدة التعاون بشأن البراءات (PCT)",
                    "بروتوكول مدريد للعلامات التجارية"
                  ]
                }
              ].map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <section.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-800">{section.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {section.laws.map((law, lawIndex) => (
                          <motion.li
                            key={lawIndex}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + lawIndex * 0.1, duration: 0.4 }}
                            className="flex items-start gap-3 text-slate-700"
                          >
                            <Scale className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm leading-relaxed">{law}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Prohibited Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                الأفعال المحظورة
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                هذه الأفعال تعتبر انتهاكاً صريحاً لحقوق الملكية الفكرية
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Ban,
                    title: "النسخ غير المصرح",
                    description: "نسخ أي محتوى دون إذن كتابي مسبق",
                    severity: "عالية"
                  },
                  {
                    icon: AlertCircle,
                    title: "التوزيع غير القانوني",
                    description: "مشاركة أو توزيع المحتوى المحمي",
                    severity: "عالية"
                  },
                  {
                    icon: FileCheck,
                    title: "الاستخدام التجاري",
                    description: "استخدام المحتوى لأغراض تجارية",
                    severity: "متوسطة"
                  },
                  {
                    icon: Fingerprint,
                    title: "انتحال الهوية",
                    description: "استخدام العلامات التجارية والشعارات",
                    severity: "عالية"
                  },
                  {
                    icon: Lock,
                    title: "الوصول غير المصرح",
                    description: "محاولة الوصول للمحتوى المحمي",
                    severity: "متوسطة"
                  },
                  {
                    icon: Copyright,
                    title: "إزالة حقوق الطبع",
                    description: "حذف أو تعديل إشعارات حقوق النشر",
                    severity: "عالية"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white rounded-xl p-6 border border-red-200 hover:border-red-300 transition-all duration-300 group hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <item.icon className="h-5 w-5 text-red-600" />
                      </div>
                      <Badge variant={item.severity === "عالية" ? "destructive" : "secondary"} className="text-xs">
                        {item.severity}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Legal Consequences */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                العواقب القانونية
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                الإجراءات المتخذة ضد المخالفين لحقوق الملكية الفكرية
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Scale,
                  title: "المساءلة القانونية",
                  description: "رفع دعاوى قضائية ضد المخالفين",
                  color: "red"
                },
                {
                  icon: Star,
                  title: "التعويضات المالية",
                  description: "المطالبة بتعويضات عن الأضرار",
                  color: "yellow"
                },
                {
                  icon: Ban,
                  title: "أوامر المنع",
                  description: "إصدار أوامر قضائية لمنع الانتهاك",
                  color: "orange"
                },
                {
                  icon: Building2,
                  title: "الإجراءات الإدارية",
                  description: "التبليغ للجهات المختصة",
                  color: "blue"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="pt-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <item.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-slate-800 mb-2">{item.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact for Legal Matters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0 shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-6">
                    <Mail className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    للاستفسارات القانونية والترخيص
                  </h3>
                  <p className="text-lg text-slate-300">
                    تواصل معنا للحصول على التراخيص أو للاستفسار حول حقوق الاستخدام
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <Mail className="h-8 w-8 text-blue-400 mx-auto" />
                    <h4 className="font-semibold">البريد الإلكتروني</h4>
                    <p className="text-blue-300">legal@masteredupath.com</p>
                  </div>
                  <div className="space-y-2">
                    <Phone className="h-8 w-8 text-green-400 mx-auto" />
                    <h4 className="font-semibold">الرقم الموحد</h4>
                    <p className="text-green-300">0559600824</p>
                  </div>
                  <div className="space-y-2">
                    <Calendar className="h-8 w-8 text-purple-400 mx-auto" />
                    <h4 className="font-semibold">أوقات الرد</h4>
                    <p className="text-purple-300">24-48 ساعة</p>
                  </div>
                </div>

                <Separator className="my-8 bg-slate-700" />

                 <div className="text-center">
                   <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                     <Link to="/license-request">
                       طلب ترخيص استخدام
                     </Link>
                   </Button>
                 </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Copyright Notice */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-slate-100 to-blue-50 rounded-2xl p-8 border border-slate-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 rounded-full mb-4">
                <Copyright className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">
                © 2024 وكالة ماستر إيدو باث للحلول التعليمية المتقدمة
              </h4>
              <p className="text-slate-600 mb-4">
                جميع الحقوق محفوظة. هذا الموقع ومحتوياته محمية بموجب قوانين الملكية الفكرية السعودية والدولية.
              </p>
              <div className="flex justify-center items-center gap-2 text-sm text-slate-500">
                <Lock className="h-4 w-4" />
                <span>محمي قانونياً منذ تاريخ النشر</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      </main>
    </div>
  );
};

export default IntellectualProperty;