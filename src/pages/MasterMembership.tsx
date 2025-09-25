import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Crown, 
  Star, 
  CheckCircle, 
  Trophy, 
  Users, 
  BookOpen, 
  Award, 
  Shield, 
  MessageSquare,
  Download,
  Globe,
  Gift,
  Tag,
  UserCheck,
  CreditCard,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";
import MembershipSubscriptionForm from "@/components/MembershipSubscriptionForm";

const MasterMembership = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // البيانات الديناميكية لبطاقات العضوية
  const TIERS = [
    { slug: "silver",    titleAr: "الفضية",    titleEn: "Silver",    baseSAR: 2400, discountPct: 50, cashbackPct: 7,  featured: false,  gradient: "from-slate-600 to-slate-400" },
    { slug: "gold",      titleAr: "الذهبية",   titleEn: "Gold",      baseSAR: 4400, discountPct: 50, cashbackPct: 15, featured: true,   gradient: "from-amber-500 to-yellow-600" },
    { slug: "platinum",  titleAr: "البلاتينية",titleEn: "Platinum",  baseSAR: 7200, discountPct: 50, cashbackPct: 25, featured: false,  gradient: "from-zinc-700 to-slate-500" }
  ];

  // دوال التنسيق والحساب
  const toArabic = (n: number) => new Intl.NumberFormat('ar-SA').format(n);
  const sar = (n: number) => `${toArabic(n)} ريال`;
  const finalPrice = (base: number, discountPct: number) => Math.round(base * (1 - discountPct/100));
  const cashbackAmount = (finalP: number, cashbackPct: number) => Math.round(finalP * (cashbackPct/100));

  const benefits = [
    {
      icon: Trophy,
      color: 'text-purple-600',
      title: 'خصومات مميزة',
      description: 'خصومات تصل إلى %35 على جميع خدمات الترجمة والبحث الأكاديمي',
      membership: ['للفضية 10%', 'للذهبية 20%', 'للبلاتينية 35%']
    },
    {
      icon: Users,
      color: 'text-blue-600',
      title: 'كاش باك فوري مضمون',
      description: 'استرداد نقدي فوري من رسوم تأسيس العضوية ومن جميع الطلبات بعد الاشتراك',
      membership: [`7% للفضية (${sar(cashbackAmount(finalPrice(2400, 50), 7))})`, 
                   `15% للذهبية (${sar(cashbackAmount(finalPrice(4400, 50), 15))})`, 
                   `25% للبلاتينية (${sar(cashbackAmount(finalPrice(7200, 50), 25))})`]
    },
    {
      icon: BookOpen,
      color: 'text-green-600',
      title: 'مكتبة محتوى شاملة',
      description: 'وصول لآلاف المقالات والموارد التعليمية المتخصصة',
      membership: ['محدود للفضية', 'متقدم للذهبية', 'غير محدود للبلاتينية']
    },
    {
      icon: MessageSquare,
      color: 'text-indigo-600',
      title: 'مجتمع من الخبراء',
      description: 'تفاعل مع شبكة من المترجمين والباحثين المحترفين',
      membership: ['نقاشات عامة', 'ورش عمل مباشرة', 'مجموعة VIP حصرية']
    },
    {
      icon: Award,
      color: 'text-orange-600',
      title: 'شهادات معتمدة',
      description: 'احصل على شهادات معتمدة في الترجمة والبحث الأكاديمي',
      membership: ['شهادة أساسية', 'شهادة متقدمة', 'شهادة خبير معتمد']
    },
    {
      icon: Shield,
      color: 'text-red-600',
      title: 'ضمان الجودة',
      description: 'ضمان جودة الترجمة مع إمكانية المراجعة والتعديل المجاني',
      membership: ['مراجعة واحدة', 'مراجعتان', 'مراجعات غير محدودة']
    },
    {
      icon: Download,
      color: 'text-teal-600',
      title: 'أدوات حصرية',
      description: 'وصول لأدوات الترجمة والبحث المتطورة والحصرية',
      membership: ['أدوات أساسية', 'أدوات متقدمة', 'جميع الأدوات المتاحة']
    },
    {
      icon: Globe,
      color: 'text-cyan-600',
      title: 'دعم متعدد اللغات',
      description: 'دعم فني متخصص بأكثر من 15 لغة عالمية',
      membership: ['5 لغات', '10 لغات', '15+ لغة']
    },
    {
      icon: Tag,
      color: 'text-pink-600',
      title: 'عروض حصرية',
      description: 'وصول مبكر للعروض والخدمات الجديدة قبل الآخرين',
      membership: ['إشعارات العروض', 'وصول مبكر', 'عروض VIP حصرية']
    },
    {
      icon: UserCheck,
      color: 'text-violet-600',
      title: 'دعم شخصي مخصص',
      description: 'مدير حساب شخصي للمساعدة في جميع احتياجاتك',
      membership: ['دعم عام', 'دعم أولوية', 'مدير حساب مخصص']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50" dir="rtl">
      <WorkingHoursBannerRTL />
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
              <Crown className="h-10 w-10 text-yellow-300" />
            </div>
            <h1 className="text-5xl font-bold mb-6">عضوية ماستر</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              انضم إلى مجتمع النخبة من المترجمين والباحثين واحصل على موارد حصرية ودعم متخصص
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="plans" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-lg grid-cols-2">
              <TabsTrigger value="benefits" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                المزايا
              </TabsTrigger>
              <TabsTrigger value="plans" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                العضويات
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Membership Plans */}
          <TabsContent value="plans" className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              اختر العضوية المناسبة لك
            </h2>
            
            <div dir="rtl" className="mx-auto max-w-6xl px-4 py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-3xl border border-blue-100 shadow-inner">
              {/* خلفية أكاديمية زخرفية */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute top-10 right-10 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-100/30 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-100/20 rounded-full blur-3xl"></div>
                
                {/* رموز أكاديمية في الخلفية */}
                <BookOpen className="absolute top-16 right-20 w-12 h-12 text-blue-100/40 transform rotate-12" />
                <Award className="absolute bottom-20 left-16 w-10 h-10 text-indigo-100/40 transform -rotate-12" />
                <Trophy className="absolute top-20 left-1/4 w-8 h-8 text-purple-100/40 transform rotate-45" />
                <Globe className="absolute bottom-16 right-1/4 w-10 h-10 text-blue-100/40 transform -rotate-30" />
                <Shield className="absolute top-1/3 right-12 w-6 h-6 text-indigo-100/40 transform rotate-90" />
                <Users className="absolute bottom-1/3 left-12 w-8 h-8 text-purple-100/40 transform -rotate-15" />
              </div>
              
              <div className="relative z-10 grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-items-center">
                {TIERS.map(tier => {
                  const before = tier.baseSAR;
                  const after  = finalPrice(before, tier.discountPct);
                  const cash   = cashbackAmount(after, tier.cashbackPct);
                  
                  // رقم عشوائي من 6 أرقام للعميل
                  const customerNumber = Math.floor(100000 + Math.random() * 900000);
                  // اسم عميل عشوائي
                  const customerNames = ["أحمد محمد", "فاطمة علي", "محمد سالم", "نورا أحمد", "سعد خالد", "مريم يوسف"];
                  const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
                  
                  // ألوان وتدرجات البطاقات الأساسية
                  const cardStyles = {
                    silver: { 
                      gradient: "from-gray-400 via-gray-500 to-gray-600", 
                      chipColor: "bg-yellow-300"
                    },
                    gold: { 
                      gradient: "from-yellow-400 via-yellow-500 to-amber-600", 
                      chipColor: "bg-yellow-200"
                    },
                    platinum: { 
                      gradient: "from-slate-300 via-slate-400 to-slate-500", 
                      chipColor: "bg-gray-200"
                    }
                  };

                  const style = cardStyles[tier.slug as keyof typeof cardStyles];

                  return (
                    <div key={tier.slug} className="relative group w-full max-w-xs">
                      {tier.featured && (
                        <div className="absolute -top-3 right-1/2 transform translate-x-1/2 z-20 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          الأكثر طلباً
                        </div>
                      )}

                      {/* البطاقة الذكية مصغرة */}
                      <div className={`relative w-full h-44 rounded-xl p-4 text-white shadow-xl bg-gradient-to-br ${style.gradient} overflow-hidden transform transition-all duration-300 hover:scale-105`}>
                        
                        {/* اسم الوكالة في أعلى البطاقة */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-center">
                          <div className="text-xs font-bold tracking-widest opacity-90 drop-shadow-md">
                            MASTER EDU PATH AGENCY
                          </div>
                        </div>
                        
                        {/* شريحة EMV في الأعلى يسار */}
                        <div className="absolute top-2 left-2">
                          <div className={`w-8 h-6 ${style.chipColor} rounded-sm shadow-sm flex items-center justify-center`}>
                            <div className="w-5 h-3 bg-yellow-600/40 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
                              <div className="bg-yellow-800/60 rounded-sm"></div>
                              <div className="bg-yellow-800/60 rounded-sm"></div>
                              <div className="bg-yellow-800/60 rounded-sm"></div>
                              <div className="bg-yellow-800/60 rounded-sm"></div>
                            </div>
                          </div>
                        </div>

                        {/* معلومات العميل في الوسط */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                          <div className="text-xs opacity-80 mb-2">وكالة ماستر إيدو باث</div>
                          <div className="text-sm font-bold mb-3 leading-tight">
                            {customerName}
                          </div>
                          <div className="text-xs opacity-80 mb-1">Customer ID</div>
                          <div className="font-mono text-xl font-bold tracking-wider drop-shadow-lg">
                            {customerNumber}
                          </div>
                        </div>

                        {/* معلومات العضوية في الأسفل يسار */}
                        <div className="absolute bottom-2 left-3 text-left">
                          <div className="text-xs opacity-80 leading-tight">عضوية ماستر</div>
                          <div className="text-sm font-bold leading-tight">{tier.titleAr}</div>
                          <div className="text-xs opacity-70 mt-1 leading-tight">انتهاء: 12/27</div>
                        </div>

                        {/* شعار Mastercard في أسفل يمين */}
                        <div className="absolute bottom-2 right-3 flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-400 -ml-1"></div>
                          <span className="text-xs font-bold ml-1 tracking-wider">MASTERCARD</span>
                        </div>

                        {/* تأثيرات بصرية */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5 blur-xl"></div>
                        <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-black/10 blur-lg"></div>
                      </div>

                      {/* معلومات السعر تحت البطاقة */}
                      <div className="mt-4 bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">السعر الأساسي:</span>
                          <span className="text-sm font-medium line-through text-gray-500">{toArabic(before)} ريال</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">نسبة الخصم:</span>
                          <span className="text-sm font-bold text-red-600">{toArabic(tier.discountPct)}%</span>
                        </div>
                        
                        <div className="flex items-center justify-between border-t pt-2">
                          <span className="text-base font-semibold text-gray-800">السعر بعد الخصم:</span>
                          <span className="text-lg font-bold text-green-600">{toArabic(after)} ريال</span>
                        </div>
                        
                        <div className="flex items-center justify-between bg-emerald-50 rounded-md p-2">
                          <span className="text-sm font-medium text-emerald-700">كاش باك فوري:</span>
                          <span className="text-sm font-bold text-emerald-600">{sar(cash)}</span>
                        </div>
                      </div>

                      {/* معلومات العضوية */}
                      <div className="mt-4 px-2 text-center space-y-3">
                        <div className="space-y-1">
                          <div className="text-lg font-bold text-gray-800 leading-tight">{tier.titleAr}</div>
                          <div className="text-sm text-gray-500 leading-tight">{tier.titleEn}</div>
                        </div>
                        
                        {/* مزايا مختصرة */}
                        <div className="space-y-2 text-sm text-gray-600 py-2">
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="leading-tight">اشتراك 12 شهر كامل</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="leading-tight">دعم فني متخصص</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Award className="w-4 h-4 text-purple-500 flex-shrink-0" />
                            <span className="leading-tight">شهادة إنجاز رقمية</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => {
                            setSelectedPlan({
                              id: tier.slug,
                              name: tier.titleAr,
                              nameEn: tier.titleEn,
                              price: toArabic(after),
                              originalPrice: toArabic(before),
                              discount: `${tier.discountPct}%`,
                              cashback: toArabic(cash),
                              cashbackPercent: `${tier.cashbackPct}%`,
                            });
                            setIsFormOpen(true);
                          }}
                          className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-md"
                        >
                          <Crown className="w-4 h-4 ml-2 inline-block" />
                          اشترك الآن - 12 شهر
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <p className="mt-8 text-xs text-gray-600 text-center max-w-2xl mx-auto leading-relaxed relative z-10">
                * جميع الأرقام بصيغة عربية و"ريال" مثبتة بعد الرقم. الحساب تلقائي من القيم أعلاه.
                <br />
                ** يشمل الاشتراك جميع المزايا لمدة 12 شهراً مع ضمان استرداد الكاش باك فورياً.
              </p>
            </div>

            {/* Cashback Notice - Attractive Alert */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-12 max-w-5xl mx-auto"
            >
              <div className="relative bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-2xl p-8 shadow-xl overflow-hidden">
                {/* Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-100/30 to-emerald-100/30 opacity-50"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200/20 rounded-full translate-y-12 -translate-x-12"></div>

                <div className="relative z-10">
                  {/* Alert Icon with Animation */}
                  <div className="flex items-center justify-center mb-6">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <motion.div
                        animate={{ 
                          y: [0, -2, 0],
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Gift className="w-8 h-8 text-white" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Main Alert Content */}
                  <div className="text-center">
                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="text-2xl font-bold text-green-800 mb-4"
                    >
                      ⚠️ تنبيه مهم للمشتركين - الكاش باك المضمون
                    </motion.h3>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-100"
                    >
                      <p className="text-lg text-green-700 font-semibold mb-4 leading-relaxed">
                        🎯 ستحصل على الكاش باك الفوري من مصدرين أساسيين:
                      </p>
                      
                      <div className="grid gap-4 md:grid-cols-2 text-right">
                        <motion.div
                          whileHover={{ scale: 1.02, x: -5 }}
                          className="bg-gradient-to-r from-emerald-100 to-teal-100 p-4 rounded-lg border-r-4 border-emerald-500 order-2 md:order-1"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">1</span>
                            </div>
                            <h4 className="font-bold text-emerald-800">من رسوم تأسيس العضوية</h4>
                          </div>
                          <p className="text-emerald-700 text-sm">
                            كاش باك فوري بنسبة العضوية المختارة من رسوم التأسيس
                          </p>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02, x: -5 }}
                          className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg border-r-4 border-green-500 order-1 md:order-2"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">2</span>
                            </div>
                            <h4 className="font-bold text-green-800">من جميع الطلبات المستقبلية</h4>
                          </div>
                          <p className="text-green-700 text-sm">
                            كاش باك مستمر من كل طلب تقوم به بعد الاشتراك
                          </p>
                        </motion.div>
                      </div>

                      {/* Percentage Breakdown */}
                      <div className="mt-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-800 mb-3 text-center">نسب الكاش باك حسب العضوية:</h4>
                        <div className="flex justify-center gap-6 flex-wrap">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mb-2 mx-auto">
                              <span className="text-white font-bold text-sm">7%</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">الفضية</span>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-2 mx-auto">
                              <span className="text-white font-bold text-sm">15%</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">الذهبية</span>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-slate-400 rounded-full flex items-center justify-center mb-2 mx-auto">
                              <span className="text-white font-bold text-sm">25%</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">البلاتينية</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="mt-6"
                    >
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Star className="w-5 h-5" />
                        </motion.div>
                        ابدأ الآن واحصل على كاش باك فوري!
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Benefits Section */}
          <TabsContent value="benefits" className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              مزايا عضوية ماستر
            </h2>
            
            <div className="grid gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100 
                  }}
                  className="group"
                >
                  <Card className="p-6 hover:shadow-xl transition-all duration-500 border-r-4 border-purple-500 bg-gradient-to-l from-purple-50/30 to-white hover:from-purple-50/50 hover:to-blue-50/30 overflow-hidden relative h-full">
                    {/* Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-full group-hover:translate-x-0"></div>
                    
                    <div className="flex items-start gap-6 relative z-10">
                      <div className="flex-1 text-right">
                        <motion.h3 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                          className="text-xl font-bold mb-3 text-gray-800"
                        >
                          {benefit.title}
                        </motion.h3>
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                          className="text-gray-600 mb-4 text-sm leading-relaxed"
                        >
                          {benefit.description}
                        </motion.p>
                        <div className="space-y-2">
                          {benefit.membership.map((level, idx) => (
                            <motion.div 
                              key={idx} 
                              initial={{ opacity: 0, x: 30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: index * 0.1 + 0.4 + idx * 0.1, 
                                duration: 0.3 
                              }}
                              className="flex items-center gap-2 justify-end"
                            >
                              <span className="text-gray-700 text-sm font-medium">{level}</span>
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Animated Icon */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: 10,
                          y: -5,
                          boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                        }}
                        transition={{ 
                          delay: index * 0.1, 
                          duration: 0.6, 
                          type: "spring", 
                          stiffness: 200 
                        }}
                        className="w-16 h-16 rounded-xl bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center flex-shrink-0 shadow-lg border border-gray-200/50 relative overflow-hidden"
                      >
                        {/* Icon Glow Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={false}
                          animate={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        />
                        
                        {/* Floating Icon */}
                        <motion.div
                          animate={{ 
                            y: [0, -2, 0],
                            rotate: [0, 2, -2, 0]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.2
                          }}
                          className="relative z-10"
                        >
                          <benefit.icon className={`h-8 w-8 ${benefit.color} transition-colors duration-300`} />
                        </motion.div>

                        {/* Sparkle Effect */}
                        <motion.div
                          className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full opacity-0"
                          animate={{ 
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3
                          }}
                        />
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
                <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-2xl font-bold mb-4">وكالة ماستر إيدو باث</h3>
                <p className="text-lg mb-6">شريكك الموثوق في رحلة التعلم والتطوير المهني</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Subscription Form */}
      {selectedPlan && (
        <MembershipSubscriptionForm
          plan={selectedPlan}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedPlan(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default MasterMembership;