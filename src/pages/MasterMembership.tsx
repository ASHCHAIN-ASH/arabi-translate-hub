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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" dir="rtl">
      <WorkingHoursBannerRTL />
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 md:w-64 h-32 md:h-64 bg-gradient-to-r from-white/10 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 md:w-48 h-24 md:h-48 bg-gradient-to-l from-yellow-400/20 to-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 md:w-80 h-40 md:h-80 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            {/* Crown Icon with Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400/20 to-yellow-300/30 rounded-full mb-6 backdrop-blur-sm border border-yellow-300/30"
            >
              <motion.div
                animate={{ 
                  y: [0, -4, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Crown className="h-8 w-8 md:h-10 md:w-10 text-yellow-300" />
              </motion.div>
            </motion.div>

            {/* Title with Gradient Effect */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent"
            >
              عضوية ماستر
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl opacity-90 max-w-4xl mx-auto mb-8 leading-relaxed px-4"
            >
              انضم إلى مجتمع النخبة من المترجمين والباحثين واحصل على موارد حصرية ودعم متخصص
            </motion.p>

            {/* Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8 px-4"
            >
              {[
                { number: '10K+', label: 'عضو نشط', icon: Users },
                { number: '25+', label: 'لغة مدعومة', icon: Globe },
                { number: '99%', label: 'رضا العملاء', icon: Trophy },
                { number: '24/7', label: 'دعم فني', icon: Shield }
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                  >
                    <IconComponent className="h-6 w-6 text-yellow-300 mx-auto mb-2" />
                    <div className="text-xl md:text-2xl font-bold">{stat.number}</div>
                    <div className="text-xs md:text-sm opacity-80">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <Tabs defaultValue="plans" className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <TabsList className="grid w-full max-w-md md:max-w-lg grid-cols-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 p-1 rounded-xl">
              <TabsTrigger value="benefits" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300">
                <Gift className="h-4 w-4" />
                <span className="hidden sm:inline">المزايا</span>
                <span className="sm:hidden">المزايا</span>
              </TabsTrigger>
              <TabsTrigger value="plans" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300">
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">العضويات</span>
                <span className="sm:hidden">العضويات</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Membership Plans */}
          <TabsContent value="plans" className="space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800"
            >
              اختر العضوية المناسبة لك
            </motion.h2>
            
            <div className="grid gap-6 md:gap-8 lg:grid-cols-3 md:grid-cols-2 max-w-6xl mx-auto">
              {membershipPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ 
                    delay: index * 0.15, 
                    duration: 0.7,
                    type: "spring",
                    stiffness: 100
                  }}
                  className={`relative ${plan.popular ? 'md:scale-105 lg:scale-110' : ''} group`}
                >
                  {plan.popular && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.15 + 0.5, duration: 0.6 }}
                      className="absolute -top-3 md:-top-4 right-1/2 transform translate-x-1/2 z-20"
                    >
                      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs font-bold shadow-xl border border-orange-300/50">
                        <Crown className="inline-block w-3 h-3 ml-1" />
                        الأكثر طلبًا
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Bank Card - Responsive Size */}
                  <div className={`
                    relative w-full aspect-[1.586/1] max-w-[280px] md:max-w-[320px] mx-auto rounded-xl overflow-hidden
                    bg-gradient-to-br ${plan.cardGradient}
                    shadow-xl group-hover:shadow-2xl transition-all duration-500 
                    border border-white/20
                    backdrop-blur-sm
                    transform group-hover:scale-105
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

                    {/* Customer Details - Right Position */}
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-right text-white">
                      {/* Customer Name */}
                      <div 
                        className="text-sm font-bold mb-1 font-cinzel tracking-widest"
                        style={{ 
                          fontFamily: 'Cinzel, serif',
                          textShadow: `
                            0 3px 0 rgba(0,0,0,0.7),
                            0 -2px 0 rgba(255,255,255,0.2),
                            inset 0 2px 4px rgba(0,0,0,0.5),
                            0 0 10px rgba(0,0,0,0.3)
                          `,
                          filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.5))',
                          background: 'linear-gradient(45deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text'
                        }}
                      >
                        اسم العميل: وكالة ماستر إيدو باث
                      </div>
                      
                      {/* Customer ID */}
                      <div 
                        className="text-sm font-mono tracking-[0.3em] opacity-95"
                        style={{ 
                          fontFamily: 'Playfair Display, serif',
                          textShadow: `
                            0 2px 0 rgba(0,0,0,0.6),
                            0 -1px 0 rgba(255,255,255,0.15),
                            inset 0 1px 3px rgba(0,0,0,0.4),
                            0 0 8px rgba(0,0,0,0.2)
                          `,
                          filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.4))',
                          letterSpacing: '0.15em'
                        }}
                      >
                        {plan.id === 'silver' ? 'رقم العميل: 54321' : plan.id === 'gold' ? 'رقم العميل: 45326' : 'رقم العميل: 45329'}
                      </div>
                    </div>

                    {/* Membership Name - Bottom Left */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-sm font-bold" 
                           style={{ 
                             textShadow: '0 2px 0 rgba(0,0,0,0.5), 0 -1px 0 rgba(255,255,255,0.15), inset 0 1px 3px rgba(0,0,0,0.4)',
                             filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.4))'
                           }}>
                        العضوية {plan.name}
                      </div>
                    </div>

                    {/* Expiry */}
                    <div className="absolute bottom-8 right-4 text-white text-xs">
                      <div className="opacity-80">صالح حتى</div>
                      <div className="font-mono font-bold">12/25</div>
                    </div>

                    {/* Card Network */}
                    <div className="absolute bottom-4 right-4 text-white/60 text-xs font-bold">
                      MASTEREDUPATH
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
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                    className="mt-4 md:mt-6 text-center px-2"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{plan.nameEn}</p>
                  </motion.div>

                  {/* Subscribe Button */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.4, duration: 0.5 }}
                    className="mt-4 px-2"
                  >
                     <Button 
                       onClick={() => {
                         setSelectedPlan(plan);
                         setIsFormOpen(true);
                       }}
                       className={`
                         w-full bg-gradient-to-r ${plan.gradient} 
                         hover:opacity-90 text-white font-bold py-3 md:py-4 text-sm md:text-base rounded-xl
                         shadow-lg hover:shadow-xl transition-all duration-300
                         hover:scale-105 border-0 group-hover:shadow-2xl
                       `}
                     >
                       اشترك الآن - 12 شهر
                       <Crown className="w-4 h-4 mr-2" />
                     </Button>
                      
                       {/* Enhanced Price Display - Below Button */}
                       <motion.div 
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: index * 0.15 + 0.5, duration: 0.5 }}
                         className="mt-4 relative"
                       >
                         {/* Main Price Card */}
                         <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 backdrop-blur-sm rounded-xl px-4 md:px-6 py-3 md:py-4 shadow-xl border border-gray-200/50 relative overflow-hidden group-hover:shadow-2xl transition-shadow duration-300">
                          {/* Background Pattern */}
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full -translate-y-8 translate-x-8"></div>
                          <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-emerald-100/30 to-cyan-100/30 rounded-full translate-y-6 -translate-x-6"></div>
                          
                           {/* Price Content */}
                           <div className="relative z-10 text-center">
                             {/* Original Price */}
                             <div className="flex items-baseline justify-center gap-1 text-gray-500 text-xs md:text-sm line-through mb-1">
                               <span className="text-xs opacity-70">ريال</span>
                               <span className="font-medium">{plan.originalPrice}</span>
                             </div>
                             
                             {/* Current Price */}
                             <div className="flex items-baseline justify-center gap-1 text-gray-900 text-xl md:text-2xl font-bold mb-2">
                               <span className="text-sm md:text-base opacity-80 font-normal">ريال</span>
                               <span>{plan.price}</span>
                             </div>
                             
                             {/* Cashback */}
                             <div className="inline-flex items-baseline gap-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                               <span className="text-xs">كاش باك فوري</span>
                               <span className="font-bold">{plan.cashback}</span>
                               <span className="text-xs opacity-90">ريال</span>
                             </div>
                           </div>
                        </div>
                      </motion.div>
                    
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 + 0.6, duration: 0.5 }}
                        className="mt-3 text-center px-2"
                      >
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 md:px-5 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold border border-emerald-200">
                          <span className="text-xs opacity-80">ريال</span>
                          <span className="font-bold">{plan.cashback}</span>
                          <span>كاش باك فوري {plan.cashbackPercent}</span>
                          <Gift className="w-4 h-4" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 font-medium">من رسوم التأسيس وجميع الطلبات</p>
                      </motion.div>
                   </motion.div>
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
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800"
            >
              مزايا عضوية ماستر
            </motion.h2>
            
            <div className="grid gap-4 md:gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  whileHover={{ scale: 1.02, y: -8 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 120 
                  }}
                  className="group"
                >
                  <Card className="p-4 md:p-6 hover:shadow-xl transition-all duration-500 border-r-4 border-purple-500 bg-gradient-to-l from-purple-50/30 to-white hover:from-purple-50/50 hover:to-blue-50/30 overflow-hidden relative h-full">
                    {/* Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-full group-hover:translate-x-0"></div>
                    
                    <div className="flex items-start gap-4 md:gap-6 relative z-10">
                      <div className="flex-1 text-right">
                        <motion.h3 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                          className="text-lg md:text-xl font-bold mb-3 text-gray-800"
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
                          scale: 1.15, 
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
                        className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center flex-shrink-0 shadow-lg border border-gray-200/50 relative overflow-hidden"
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
                           <benefit.icon className={`h-6 w-6 md:h-8 md:w-8 ${benefit.color} transition-colors duration-300`} />
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
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center mt-12"
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white mx-4 md:mx-0 relative overflow-hidden">
                {/* Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <motion.div
                    animate={{ 
                      y: [0, -5, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Crown className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-yellow-300" />
                  </motion.div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4">وكالة ماستر إيدو باث</h3>
                  <p className="text-base md:text-lg mb-6">شريكك الموثوق في رحلة التعلم والتطوير المهني</p>
                </div>
              </div>
            </motion.div>
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