import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield,
  Lock,
  Eye,
  FileCheck,
  Server,
  Key,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Settings,
  Globe,
  Database,
  ChevronRight,
  Clock,
  Award,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacySecurity = () => {
  const securityMeasures = [
    {
      icon: Lock,
      title: "تشفير متقدم",
      description: "تشفير جميع البيانات والملفات باستخدام أحدث معايير التشفير العالمية",
      features: ["تشفير AES-256", "تشفير SSL/TLS", "مفاتيح آمنة", "حماية متعددة الطبقات"],
      color: "from-blue-600 to-indigo-600",
      level: "عالي جداً"
    },
    {
      icon: Server,
      title: "خوادم آمنة",
      description: "استضافة البيانات في خوادم عالية الأمان مع مراقبة 24/7",
      features: ["مراكز بيانات معتمدة", "نسخ احتياطية آمنة", "مراقبة مستمرة", "حماية فيزيائية"],
      color: "from-emerald-600 to-teal-600",
      level: "محمي بالكامل"
    },
    {
      icon: UserCheck,
      title: "إدارة الهوية",
      description: "نظام متطور لإدارة الهويات والصلاحيات والوصول الآمن",
      features: ["مصادقة ثنائية", "إدارة الأذونات", "تسجيل العمليات", "مراجعة الوصول"],
      color: "from-purple-600 to-pink-600",
      level: "موثق ومراقب"
    },
    {
      icon: Eye,
      title: "سرية المحتوى",
      description: "التزام صارم بحماية سرية المحتوى والمعلومات البحثية",
      features: ["اتفاقيات سرية", "فصل البيانات", "حذف آمن", "عدم الكشف"],
      color: "from-red-600 to-rose-600",
      level: "سري للغاية"
    }
  ];

  const privacyPolicies = [
    {
      icon: FileCheck,
      title: "سياسة الخصوصية",
      description: "التزام كامل بحماية خصوصية العملاء وبياناتهم الشخصية",
      points: [
        "عدم مشاركة البيانات الشخصية",
        "جمع البيانات الضرورية فقط",
        "حق العميل في الوصول والتعديل",
        "شفافية في استخدام البيانات"
      ]
    },
    {
      icon: Database,
      title: "حماية البيانات",
      description: "تطبيق أعلى معايير حماية البيانات وفقاً للقوانين الدولية",
      points: [
        "الامتثال لقانون GDPR",
        "تشفير البيانات المخزنة",
        "نقل آمن للبيانات",
        "حذف البيانات عند الطلب"
      ]
    },
    {
      icon: Settings,
      title: "التحكم في البيانات",
      description: "منح العملاء التحكم الكامل في بياناتهم ومعلوماتهم",
      points: [
        "إعدادات الخصوصية المرنة",
        "تحكم في مشاركة البيانات",
        "إمكانية تصدير البيانات",
        "حذف البيانات نهائياً"
      ]
    },
    {
      icon: Globe,
      title: "الامتثال الدولي",
      description: "الالتزام بالمعايير والقوانين الدولية لحماية البيانات",
      points: [
        "معايير ISO 27001",
        "امتثال للقوانين المحلية",
        "شهادات أمان دولية",
        "مراجعة دورية للامتثال"
      ]
    }
  ];

  const securityCertifications = [
    {
      title: "ISO 27001",
      description: "شهادة أمن المعلومات الدولية",
      icon: Award,
      color: "text-blue-600"
    },
    {
      title: "SOC 2 Type II",
      description: "تدقيق أمني شامل للأنظمة",
      icon: Shield,
      color: "text-emerald-600"
    },
    {
      title: "GDPR Compliant",
      description: "امتثال كامل للوائح الأوروبية",
      icon: CheckCircle,
      color: "text-purple-600"
    },
    {
      title: "SSL Certificate",
      description: "شهادة تشفير الاتصالات",
      icon: Lock,
      color: "text-amber-600"
    }
  ];

  const stats = [
    { number: "256-bit", label: "مستوى التشفير", icon: Lock },
    { number: "99.9%", label: "وقت التشغيل", icon: Server },
    { number: "24/7", label: "مراقبة أمنية", icon: Eye },
    { number: "0", label: "تسريبات أمنية", icon: Shield }
  ];

  const threatProtection = [
    {
      threat: "الهجمات الإلكترونية",
      protection: "جدران حماية متقدمة وأنظمة كشف التسلل",
      status: "محمي"
    },
    {
      threat: "فقدان البيانات",
      protection: "نسخ احتياطية متعددة وآليات استرداد",
      status: "مؤمن"
    },
    {
      threat: "الوصول غير المصرح",
      protection: "مصادقة متعددة العوامل وإدارة الأذونات",
      status: "مراقب"
    },
    {
      threat: "تسريب المعلومات",
      protection: "تشفير شامل واتفاقيات سرية صارمة",
      status: "سري"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/20 dark:from-slate-950 dark:via-teal-950/30 dark:to-cyan-950/20">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-teal-500/20 via-cyan-500/15 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-tl from-cyan-500/15 via-blue-500/20 to-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600/10 to-cyan-600/10 border border-teal-200 dark:border-teal-700 rounded-full text-teal-700 dark:text-teal-300 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Shield className="h-4 w-4" />
              سرية وأمان متقدم
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-arabic-formal font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                حماية شاملة
              </span>
              <br />
              لبياناتك ومعلوماتك
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
              نضمن الحماية الكاملة لمعلوماتك الشخصية والبحثية بأعلى معايير الأمان
              <span className="text-teal-600 dark:text-teal-400 font-semibold"> والسرية المهنية</span>
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium">
                تعرف على الحماية
                <ChevronRight className="mr-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="border-teal-200 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950">
                سياسة الخصوصية
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/60 dark:bg-slate-800/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-4">
              إجراءات الأمان المتقدمة
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نطبق أحدث التقنيات والممارسات الأمنية لحماية بياناتك ومعلوماتك
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityMeasures.map((measure, index) => {
              const IconComponent = measure.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${measure.color}`}></div>
                    
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${measure.color} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-foreground">{measure.title}</h3>
                            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full">
                              {measure.level}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {measure.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {measure.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                            <span className="text-sm text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Privacy Policies */}
      <section className="py-16 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 dark:from-teal-950/20 dark:to-cyan-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-4">
              سياسات الخصوصية
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              التزامنا الكامل بحماية خصوصيتك وضمان سرية معلوماتك
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {privacyPolicies.map((policy, index) => {
              const IconComponent = policy.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-slate-800">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center">
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground text-center">
                      {policy.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      {policy.description}
                    </p>
                    <div className="space-y-2">
                      {policy.points.map((point, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-foreground">{point}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Threat Protection */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-6">
                الحماية من التهديدات
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                نوفر حماية شاملة ضد جميع أنواع التهديدات السيبرانية والأمنية
              </p>

              <div className="space-y-4">
                {threatProtection.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{item.threat}</h4>
                      <p className="text-sm text-muted-foreground">{item.protection}</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold rounded-full">
                      {item.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl"></div>
                <div className="relative z-10">
                  <Shield className="h-12 w-12 mb-6" />
                  <h3 className="text-2xl font-bold mb-4">حماية متعددة الطبقات</h3>
                  <p className="text-teal-100 leading-relaxed mb-6">
                    نطبق نهج الحماية متعددة الطبقات لضمان أقصى درجات الأمان لبياناتك،
                    مع مراقبة مستمرة 24/7 وأنظمة إنذار مبكر.
                  </p>
                  <ul className="space-y-2 text-teal-100">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      حماية على مستوى الشبكة
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      حماية على مستوى التطبيق
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      حماية على مستوى البيانات
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gradient-to-br from-white to-teal-50/30 dark:from-slate-800 dark:to-teal-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-4">
              الشهادات الأمنية
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              حاصلون على أهم الشهادات الأمنية الدولية التي تؤكد مستوى الحماية لدينا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityCertifications.map((cert, index) => {
              const IconComponent = cert.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <IconComponent className={`h-12 w-12 ${cert.color} mx-auto mb-4`} />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {cert.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-arabic-formal font-bold mb-6">
              بياناتك في أمان تام
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              اطمئن على سرية معلوماتك مع أعلى مستويات الحماية والأمان
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-teal-50">
                ابدأ بأمان
                <ChevronRight className="mr-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                اقرأ سياسة الخصوصية
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacySecurity;