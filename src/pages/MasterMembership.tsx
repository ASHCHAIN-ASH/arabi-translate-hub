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
  ArrowLeft,
  Sparkles,
  Target,
  Zap,
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
    { 
      slug: "silver", 
      titleAr: "الفضية", 
      titleEn: "Silver", 
      baseSAR: 2400, 
      discountPct: 50, 
      cashbackPct: 7, 
      featured: false, 
      gradient: "from-slate-600 via-slate-500 to-slate-400",
      chipColor: "bg-yellow-300"
    },
    { 
      slug: "gold", 
      titleAr: "الذهبية", 
      titleEn: "Gold", 
      baseSAR: 4400, 
      discountPct: 50, 
      cashbackPct: 15, 
      featured: true, 
      gradient: "from-amber-500 via-yellow-500 to-yellow-600",
      chipColor: "bg-yellow-400"
    },
    { 
      slug: "platinum", 
      titleAr: "البلاتينية", 
      titleEn: "Platinum", 
      baseSAR: 7200, 
      discountPct: 50, 
      cashbackPct: 25, 
      featured: false, 
      gradient: "from-zinc-700 via-slate-600 to-slate-500",
      chipColor: "bg-slate-300"
    }
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
      title: 'خصومات حصرية',
      description: 'خصومات تصل إلى 35% على جميع خدمات الترجمة والبحث الأكاديمي',
      membership: ['فضية: 7%', 'ذهبية: 15%', 'بلاتينية: 25%']
    },
    {
      icon: Users,
      color: 'text-blue-600',
      title: 'دعم أولوية',
      description: 'دعم فني متخصص مع أولوية في الاستجابة والمتابعة',
      membership: ['فضية: دعم عادي', 'ذهبية: دعم أولوية', 'بلاتينية: دعم VIP']
    },
    {
      icon: BookOpen,
      color: 'text-green-600',
      title: 'مكتبة الموارد',
      description: 'وصول حصري لمكتبة شاملة من الموارد الأكاديمية والبحثية',
      membership: ['فضية: موارد أساسية', 'ذهبية: موارد متقدمة', 'بلاتينية: موارد شاملة']
    },
    {
      icon: Award,
      color: 'text-orange-600',
      title: 'شهادات معتمدة',
      description: 'حصول على شهادات معتمدة دولياً في مجال الترجمة والبحث',
      membership: ['فضية: شهادة أساسية', 'ذهبية: شهادة متقدمة', 'بلاتينية: شهادة خبير']
    },
    {
      icon: Shield,
      color: 'text-red-600',
      title: 'ضمان الجودة',
      description: 'ضمان شامل على جودة الخدمات مع إمكانية الاسترداد',
      membership: ['فضية: ضمان 30 يوم', 'ذهبية: ضمان 60 يوم', 'بلاتينية: ضمان 90 يوم']
    },
    {
      icon: MessageSquare,
      color: 'text-indigo-600',
      title: 'استشارات مجانية',
      description: 'جلسات استشارية مجانية مع خبراء في المجال الأكاديمي',
      membership: ['فضية: استشارة واحدة', 'ذهبية: 3 استشارات', 'بلاتينية: استشارات مفتوحة']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" dir="rtl">
      <WorkingHoursBannerRTL />
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* خلفية متحركة */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-8"
            >
              <Crown className="h-12 w-12 text-white" />
            </motion.div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              عضوية ماستر إيدو باث
            </h1>
            
            <p className="text-2xl opacity-90 max-w-4xl mx-auto mb-8 leading-relaxed">
              انضم إلى مجتمع النخبة من المترجمين والباحثين الأكاديميين واحصل على تجربة استثنائية
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 text-lg"
            >
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span>خصومات حصرية</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Target className="w-5 h-5 text-green-400" />
                <span>دعم متميز</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Zap className="w-5 h-5 text-blue-400" />
                <span>موارد حصرية</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <Tabs defaultValue="benefits" className="space-y-12">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-14 bg-white/80 backdrop-blur-sm shadow-lg border border-purple-100">
              <TabsTrigger 
                value="plans" 
                className="flex items-center gap-3 text-lg font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <Crown className="h-5 w-5" />
                العضويات
              </TabsTrigger>
              <TabsTrigger 
                value="benefits" 
                className="flex items-center gap-3 text-lg font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
              >
                <Gift className="h-5 w-5" />
                المزايا
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Benefits Section */}
          <TabsContent value="benefits" className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                مزايا عضوية ماستر
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                استمتع بمجموعة شاملة من المزايا الحصرية المصممة خصيصاً لتلبية احتياجاتك الأكاديمية والمهنية
              </p>
            </motion.div>
            
            <div className="grid gap-8 lg:grid-cols-2 max-w-7xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100 
                  }}
                  className="group"
                >
                  <Card className="p-8 hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-purple-200 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 hover:from-purple-50/50 hover:to-blue-50/50 overflow-hidden relative h-full">
                    {/* تأثير الضوء المتحرك */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-full group-hover:translate-x-0"></div>
                    
                    <div className="flex items-start gap-6 relative z-10">
                      <div className="flex-1 text-right">
                        <motion.h3 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                          className="text-2xl font-bold mb-4 text-gray-800"
                        >
                          {benefit.title}
                        </motion.h3>
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                          className="text-gray-600 mb-6 text-lg leading-relaxed"
                        >
                          {benefit.description}
                        </motion.p>
                        <div className="space-y-3">
                          {benefit.membership.map((level, idx) => (
                            <motion.div 
                              key={idx} 
                              initial={{ opacity: 0, x: 30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: index * 0.1 + 0.4 + idx * 0.1, 
                                duration: 0.3 
                              }}
                              className="flex items-center gap-3 justify-end bg-white/60 rounded-lg p-3"
                            >
                              <span className="text-gray-700 font-medium">{level}</span>
                              <motion.div
                                whileHover={{ scale: 1.3, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                              >
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* أيقونة متحركة */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ 
                          delay: index * 0.1 + 0.5, 
                          duration: 0.6,
                          type: "spring",
                          stiffness: 200 
                        }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <benefit.icon className="h-8 w-8 text-white" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Membership Plans */}
          <TabsContent value="plans" className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                اختر عضويتك المثالية
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                خطط عضوية مصممة بعناية لتناسب جميع احتياجاتك الأكاديمية والمهنية
              </p>
            </motion.div>
            
            <div className="mx-auto max-w-7xl px-6 py-12 bg-gradient-to-br from-white via-purple-50/50 to-blue-50/50 rounded-3xl border border-purple-100 shadow-2xl backdrop-blur-sm">
              {/* خلفية أكاديمية زخرفية */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-50 h-50 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                {/* رموز أكاديمية في الخلفية */}
                <BookOpen className="absolute top-20 left-24 w-12 h-12 text-blue-200/60 transform -rotate-12 animate-float" />
                <Award className="absolute bottom-24 right-20 w-10 h-10 text-indigo-200/60 transform rotate-12 animate-float delay-500" />
                <Trophy className="absolute top-24 right-1/4 w-8 h-8 text-purple-200/60 transform -rotate-45 animate-float delay-1000" />
                <Globe className="absolute bottom-20 left-1/4 w-10 h-10 text-blue-200/60 transform rotate-30 animate-float delay-300" />
                <Shield className="absolute top-1/3 left-16 w-6 h-6 text-indigo-200/60 transform -rotate-90 animate-float delay-700" />
                <Users className="absolute bottom-1/3 right-16 w-8 h-8 text-purple-200/60 transform rotate-15 animate-float delay-200" />
              </div>
              
              <div className="relative z-10 grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                {TIERS.map((tier, index) => {
                  const before = tier.baseSAR;
                  const after = finalPrice(before, tier.discountPct);
                  const cash = cashbackAmount(after, tier.cashbackPct);
                  
                  // رقم عشوائي من 6 أرقام للعميل
                  const customerNumber = Math.floor(100000 + Math.random() * 900000);
                  // اسم عميل عشوائي
                  const customerNames = ["أحمد محمد", "محمد سالم", "سعد خالد", "عبد الله أحمد", "فيصل العتيبي", "خالد الغامدي"];
                  const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
                  
                  return (
                    <motion.div
                      key={tier.slug}
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      whileHover={{ scale: 1.05, y: -10 }}
                      transition={{ 
                        delay: index * 0.2, 
                        duration: 0.6,
                        type: "spring",
                        stiffness: 100 
                      }}
                      className={`group relative ${tier.featured ? 'lg:scale-110 lg:-mt-8' : ''}`}
                    >
                      {tier.featured && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.2 + 0.3 }}
                          className="absolute -top-4 right-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-20"
                        >
                          الأكثر شعبية
                        </motion.div>
                      )}
                      
                      <Card className={`overflow-hidden border-2 transition-all duration-500 ${
                        tier.featured 
                          ? 'border-gradient-to-r from-orange-400 to-red-500 shadow-2xl' 
                          : 'border-purple-200 hover:border-purple-400 shadow-xl hover:shadow-2xl'
                      } bg-white/90 backdrop-blur-sm`}>
                        
                        {/* البطاقة الذكية المصغرة */}
                        <div className={`relative w-full h-48 rounded-t-xl p-6 text-white shadow-2xl bg-gradient-to-br ${tier.gradient} overflow-hidden`}>
                          
                          {/* أيقونات أنشطة الموقع في الخلفية */}
                          <div className="absolute inset-0 overflow-hidden opacity-25">
                            <BookOpen className="absolute top-8 right-8 w-8 h-8 text-white/70 transform rotate-12 animate-pulse" />
                            <Award className="absolute bottom-12 left-6 w-7 h-7 text-white/60 transform -rotate-12 animate-bounce" />
                            <Globe className="absolute top-16 left-8 w-7 h-7 text-white/60 transform rotate-45 animate-pulse" />
                            <Trophy className="absolute bottom-20 right-12 w-6 h-6 text-white/70 transform -rotate-45 animate-bounce" />
                            <Shield className="absolute top-20 right-20 w-7 h-7 text-white/60 transform rotate-12 animate-pulse" />
                            <MessageSquare className="absolute bottom-8 left-12 w-6 h-6 text-white/60 transform rotate-30 animate-bounce" />
                            <Users className="absolute top-12 left-16 w-7 h-7 text-white/60 transform -rotate-15 animate-pulse" />
                            <Download className="absolute bottom-16 right-6 w-6 h-6 text-white/70 transform rotate-25 animate-bounce" />
                          </div>
                          
                          {/* اسم الوكالة في أعلى البطاقة */}
                          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-center z-10">
                            <div className="text-xs font-bold tracking-widest opacity-95 drop-shadow-lg">
                              MASTER EDU PATH AGENCY
                            </div>
                          </div>
                          
                          {/* شريحة EMV في الأعلى يسار */}
                          <div className="absolute top-3 left-3 z-10">
                            <div className={`w-10 h-7 ${tier.chipColor} rounded-md shadow-lg flex items-center justify-center`}>
                              <div className="w-6 h-4 bg-yellow-600/50 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
                                <div className="bg-yellow-800/70 rounded-sm"></div>
                                <div className="bg-yellow-800/70 rounded-sm"></div>
                                <div className="bg-yellow-800/70 rounded-sm"></div>
                                <div className="bg-yellow-800/70 rounded-sm"></div>
                              </div>
                            </div>
                          </div>

                          {/* معلومات العميل في الوسط */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
                            <div className="text-xs opacity-85 mb-2 font-medium">وكالة ماستر إيدو باث</div>
                            <div className="text-lg font-bold mb-3 leading-tight drop-shadow-md">
                              {customerName}
                            </div>
                            <div className="text-xs opacity-85 mb-1">Customer ID</div>
                            <div className="font-mono text-2xl font-bold tracking-wider drop-shadow-lg">
                              {customerNumber}
                            </div>
                          </div>

                          {/* معلومات العضوية في الأسفل يسار */}
                          <div className="absolute bottom-3 left-4 text-left z-10">
                            <div className="text-xs opacity-85 leading-tight">عضوية ماستر</div>
                            <div className="text-lg font-bold leading-tight drop-shadow-md">{tier.titleAr}</div>
                            <div className="text-xs opacity-75 mt-1 leading-tight">انتهاء: 12/27</div>
                          </div>

                          {/* شعار Mastercard في أسفل يمين */}
                          <div className="absolute bottom-3 right-4 flex items-center gap-1 z-10">
                            <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400 -ml-1 shadow-sm"></div>
                            <span className="text-xs font-bold ml-2 tracking-wider drop-shadow-sm">MASTERCARD</span>
                          </div>

                          {/* تأثيرات بصرية */}
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none"></div>
                          <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                        </div>

                        <div className="p-8">
                          <div className="text-center mb-6">
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">{tier.titleAr}</h3>
                            <p className="text-gray-600">عضوية {tier.titleEn}</p>
                          </div>

                          <div className="space-y-6 mb-8">
                            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                              <span className="text-gray-600 font-medium">السعر قبل الخصم:</span>
                              <span className="line-through text-red-500 text-lg font-bold">{sar(before)}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                              <span className="text-green-700 font-bold text-lg">السعر بعد الخصم:</span>
                              <span className="text-green-600 text-2xl font-bold">{sar(after)}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                              <span className="text-purple-700 font-medium">كاش باك فوري:</span>
                              <span className="font-bold text-purple-600 text-xl">{sar(cash)}</span>
                            </div>
                          </div>

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              onClick={() => {
                                setSelectedPlan(tier);
                                setIsFormOpen(true);
                              }}
                              className={`w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 ${
                                tier.featured
                                  ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl'
                                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                              } text-white`}
                            >
                              <Crown className="w-5 h-5 ml-2" />
                              اشتراك الآن - {tier.titleAr}
                            </Button>
                          </motion.div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* قسم تنبيه الكاش باك */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="mt-16 relative"
              >
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-green-200 shadow-2xl overflow-hidden relative">
                  {/* أيقونة مركزية */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        <Gift className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                  </div>

                  {/* محتوى التنبيه الرئيسي */}
                  <div className="text-center mt-12">
                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="text-3xl font-bold text-green-800 mb-6"
                    >
                      ⚠️ تنبيه مهم للمشتركين - الكاش باك المضمون
                    </motion.h3>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-100 shadow-lg"
                    >
                      <p className="text-xl text-green-700 font-bold mb-6 leading-relaxed">
                        🎯 ستحصل على الكاش باك الفوري من مصدرين أساسيين:
                      </p>
                      
                      <div className="grid gap-6 md:grid-cols-2">
                        <motion.div
                          whileHover={{ scale: 1.02, x: -5 }}
                          className="bg-gradient-to-r from-emerald-100 to-teal-100 p-6 rounded-xl border-l-4 border-emerald-500 shadow-md"
                        >
                          <div className="flex items-center gap-4 mb-3 justify-end">
                            <h4 className="font-bold text-emerald-800 text-lg flex-1 text-right">من رسوم تأسيس العضوية</h4>
                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-white font-bold">١</span>
                            </div>
                          </div>
                          <p className="text-emerald-700 leading-relaxed text-right">
                            كاش باك فوري بنسبة العضوية المختارة من رسوم التأسيس
                          </p>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02, x: -5 }}
                          className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl border-l-4 border-green-500 shadow-md"
                        >
                          <div className="flex items-center gap-4 mb-3 justify-end">
                            <h4 className="font-bold text-green-800 text-lg flex-1 text-right">من جميع الطلبات المستقبلية</h4>
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-white font-bold">٢</span>
                            </div>
                          </div>
                          <p className="text-green-700 leading-relaxed text-right">
                            كاش باك مستمر من كل طلب تقوم به بعد الاشتراك
                          </p>
                        </motion.div>
                      </div>

                      {/* تفصيل النسب */}
                      <div className="mt-8 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6">
                        <h4 className="font-bold text-gray-800 mb-4 text-center text-lg">نسب الكاش باك حسب العضوية:</h4>
                        <div className="flex justify-center gap-8 flex-wrap">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-slate-400 rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
                              <span className="text-white font-bold text-lg">٢٥٪</span>
                            </div>
                            <span className="font-bold text-gray-700">البلاتينية</span>
                          </div>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
                              <span className="text-white font-bold text-lg">١٥٪</span>
                            </div>
                            <span className="font-bold text-gray-700">الذهبية</span>
                          </div>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mb-3 mx-auto shadow-lg">
                              <span className="text-white font-bold text-lg">٧٪</span>
                            </div>
                            <span className="font-bold text-gray-700">الفضية</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* دعوة للعمل */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="mt-8"
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.05, 1],
                          boxShadow: [
                            "0 10px 25px rgba(34, 197, 94, 0.3)",
                            "0 15px 35px rgba(34, 197, 94, 0.5)",
                            "0 10px 25px rgba(34, 197, 94, 0.3)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg cursor-pointer"
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Star className="w-6 h-6" />
                        </motion.div>
                        ابدأ الآن واحصل على كاش باك فوري!
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>

        {/* نموذج الاشتراك */}
        {selectedPlan && isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <MembershipSubscriptionForm
                plan={selectedPlan.titleAr}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MasterMembership;