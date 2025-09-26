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

  const membershipPlans = [
    {
      id: 'silver',
      name: 'الفضية',
      nameEn: 'Silver',
      price: '1200',
      originalPrice: '2400',
      discount: '50%',
      cashback: '84',
      cashbackPercent: '7%',
      cardGradient: 'from-gray-400 via-gray-500 to-gray-600',
      gradient: 'from-gray-400 to-gray-600',
      chipColor: 'bg-yellow-400',
      popular: false
    },
    {
      id: 'gold',
      name: 'الذهبية',
      nameEn: 'Gold',
      price: '2200',
      originalPrice: '4400',
      discount: '50%',
      cashback: '330',
      cashbackPercent: '15%',
      cardGradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
      gradient: 'from-yellow-400 to-yellow-600',
      chipColor: 'bg-yellow-500',
      popular: true
    },
    {
      id: 'platinum',
      name: 'البلاتينية',
      nameEn: 'Platinum',
      price: '3600',
      originalPrice: '7200',
      discount: '50%',
      cashback: '900',
      cashbackPercent: '25%',
      cardGradient: 'from-slate-400 via-slate-500 to-slate-600',
      gradient: 'from-slate-400 to-slate-600',
      chipColor: 'bg-slate-400',
      popular: false
    }
  ];

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
      membership: ['7% للفضية (84 ريال)', '15% للذهبية (330 ريال)', '25% للبلاتينية (900 ريال)']
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
            
            <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 max-w-5xl mx-auto">
              {membershipPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 right-1/2 transform translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl">
                        <Crown className="inline-block w-3 h-3 ml-1" />
                        الأكثر طلبًا
                      </div>
                    </div>
                  )}
                  
                  {/* Bank Card - Real Credit Card Size */}
                  <div className={`
                    relative w-full aspect-[1.586/1] max-w-[320px] mx-auto rounded-xl overflow-hidden
                    bg-gradient-to-br ${plan.cardGradient}
                    shadow-xl hover:shadow-2xl transition-all duration-500 
                    border border-white/20
                    backdrop-blur-sm
                  `}>
                    {/* Card Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>

                    {/* Academic Background Icons */}
                    <div className="absolute inset-0 overflow-hidden">
                      <BookOpen className="absolute top-8 right-8 w-8 h-8 text-white/10 transform rotate-12" />
                      <Award className="absolute bottom-12 left-6 w-6 h-6 text-white/8 transform -rotate-12" />
                      <Globe className="absolute top-16 left-8 w-7 h-7 text-white/8 transform rotate-45" />
                      <Trophy className="absolute bottom-20 right-12 w-5 h-5 text-white/10 transform -rotate-45" />
                      <Shield className="absolute top-20 right-20 w-6 h-6 text-white/8 transform rotate-12" />
                      <MessageSquare className="absolute bottom-8 left-12 w-5 h-5 text-white/8 transform rotate-30" />
                      <Users className="absolute top-12 left-16 w-6 h-6 text-white/8 transform -rotate-15" />
                    </div>

                    {/* Bank Name - Top Right */}
                    <div className="absolute top-4 right-4 text-white text-xs font-bold opacity-90">
                      ماستر إيدو باث
                    </div>
                    
                    {/* Card Type - Top Left */}
                    <div className="absolute top-4 left-4">
                      <Crown className="w-5 h-5 text-yellow-300" />
                    </div>

                    {/* EMV Chip - Real position */}
                    <div className="absolute top-12 right-4 w-8 h-6 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-sm shadow-md">
                      <div className="absolute inset-0.5 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-sm">
                        <div className="w-full h-full grid grid-cols-3 gap-0.5 p-0.5">
                          <div className="bg-yellow-600/30 rounded-sm"></div>
                          <div className="bg-yellow-600/30 rounded-sm"></div>
                          <div className="bg-yellow-600/30 rounded-sm"></div>
                          <div className="bg-yellow-600/30 rounded-sm"></div>
                          <div className="bg-yellow-600/30 rounded-sm"></div>
                          <div className="bg-yellow-600/30 rounded-sm"></div>
                        </div>
                      </div>
                    </div>

                    {/* Membership Name - Bottom Left */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-sm font-bold" 
                           style={{ 
                             textShadow: '0 2px 0 rgba(0,0,0,0.5), 0 -1px 0 rgba(255,255,255,0.15), inset 0 1px 3px rgba(0,0,0,0.4)',
                             filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.4))'
                           }}>
                        عضوية {plan.name}
                      </div>
                    </div>

                    {/* Expiry & CVV */}
                    <div className="absolute bottom-8 right-4 flex gap-6 text-white text-xs">
                      <div>
                        <div className="opacity-80">صالح حتى</div>
                        <div className="font-mono font-bold">12/25</div>
                      </div>
                      <div>
                        <div className="opacity-80">CVV</div>
                        <div className="font-mono font-bold">***</div>
                      </div>
                    </div>

                    {/* Card Network */}
                    <div className="absolute bottom-4 right-4 text-white/60 text-xs font-bold">
                      MASTERCARD
                    </div>


                     {/* Small Discount Badge - Top Corner */}
                     <div className="absolute top-3 right-3">
                       <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-md transform rotate-3">
                         {plan.discount}
                       </div>
                     </div>

                     {/* Contactless Symbol */}
                    <div className="absolute top-12 left-4">
                      <div className="w-4 h-4 border-2 border-white/40 rounded-full relative">
                        <div className="absolute inset-1 border border-white/40 rounded-full"></div>
                        <div className="absolute inset-2 border border-white/40 rounded-full"></div>
                      </div>
                    </div>

                    {/* Holographic Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"></div>
                  </div>

                  {/* Card Details */}
                  <div className="mt-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plan.nameEn}</p>
                  </div>

                  {/* Subscribe Button */}
                  <div className="mt-4">
                     <Button 
                       onClick={() => {
                         setSelectedPlan(plan);
                         setIsFormOpen(true);
                       }}
                       className={`
                         w-full bg-gradient-to-r ${plan.gradient} 
                         hover:opacity-90 text-white font-bold py-4 text-base rounded-xl
                         shadow-lg hover:shadow-xl transition-all duration-300
                         hover:scale-105 border-0
                       `}
                     >
                       <Crown className="w-4 h-4 ml-2" />
                       اشترك الآن - 12 شهر
                     </Button>
                     
                      {/* Enhanced Price Display - Below Button */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-4 relative"
                      >
                        {/* Main Price Card */}
                        <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 backdrop-blur-sm rounded-xl px-6 py-4 shadow-xl border border-gray-200/50 relative overflow-hidden">
                          {/* Background Pattern */}
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full -translate-y-8 translate-x-8"></div>
                          <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-emerald-100/30 to-cyan-100/30 rounded-full translate-y-6 -translate-x-6"></div>
                          
                          {/* Price Content */}
                          <div className="relative z-10 text-center">
                            {/* Original Price */}
                            <div className="flex items-baseline justify-center gap-1 text-gray-500 text-sm line-through mb-1">
                              <span className="text-xs opacity-70">ريال</span>
                              <span className="font-medium">{plan.originalPrice}</span>
                            </div>
                            
                            {/* Current Price */}
                            <div className="flex items-baseline justify-center gap-1 text-gray-900 text-2xl font-bold mb-2">
                              <span className="text-base opacity-80 font-normal">ريال</span>
                              <span>{plan.price}</span>
                            </div>
                            
                            {/* Cashback */}
                            <div className="inline-flex items-baseline gap-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              <span className="text-xs opacity-90">ريال</span>
                              <span className="font-bold">{plan.cashback}</span>
                              <span className="text-xs">كاش باك فوري</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    
                     <div className="mt-3 text-center">
                       <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-3 rounded-full text-sm font-semibold border border-emerald-200">
                         <Gift className="w-4 h-4" />
                         <span>كاش باك فوري {plan.cashbackPercent}:</span>
                         <span className="font-bold">{plan.cashback}</span>
                         <span className="text-xs opacity-80">ريال</span>
                       </div>
                       <p className="text-xs text-gray-500 mt-2 font-medium">من رسوم التأسيس وجميع الطلبات</p>
                     </div>
                  </div>
                </motion.div>
              ))}
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