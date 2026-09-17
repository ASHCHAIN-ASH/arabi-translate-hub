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
import Header from '@/components/Header';
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";
import MembershipSubscriptionForm from "@/components/MembershipSubscriptionForm";

import Footer from '@/components/Footer';
const FekrahMembership = () => {
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
      title: 'خصومات أكاديمية مميزة',
      description: 'خصومات تصل إلى 35% على جميع خدمات الترجمة والبحث الأكاديمي المعتمدة دولياً',
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
      title: 'مكتبة المحتوى الأكاديمي',
      description: 'وصول لآلاف المقالات والموارد التعليمية المتخصصة المعتمدة من الجامعات العالمية',
      membership: ['محدود للفضية', 'متقدم للذهبية', 'غير محدود للبلاتينية']
    },
    {
      icon: MessageSquare,
      color: 'text-indigo-600',
      title: 'مجتمع النخبة الأكاديمية',
      description: 'تفاعل مع شبكة من المترجمين والباحثين المحترفين والخبراء المعتمدين دولياً',
      membership: ['نقاشات عامة', 'ورش عمل مباشرة', 'مجموعة VIP حصرية']
    },
    {
      icon: Award,
      color: 'text-orange-600',
      title: 'شهادات معتمدة دولياً',
      description: 'احصل على شهادات معتمدة في الترجمة والبحث الأكاديمي معترف بها عالمياً',
      membership: ['شهادة أساسية', 'شهادة متقدمة', 'شهادة خبير معتمد']
    },
    {
      icon: Shield,
      color: 'text-red-600',
      title: 'ضمان الجودة العالمية',
      description: 'ضمان جودة الترجمة مع إمكانية المراجعة والتعديل المجاني حسب المعايير الدولية',
      membership: ['مراجعة واحدة', 'مراجعتان', 'مراجعات غير محدودة']
    },
    {
      icon: Download,
      color: 'text-teal-600',
      title: 'أدوات حصرية متطورة',
      description: 'وصول لأدوات الترجمة والبحث المتطورة والحصرية المطورة بأحدث التقنيات',
      membership: ['أدوات أساسية', 'أدوات متقدمة', 'جميع الأدوات المتاحة']
    },
    {
      icon: Globe,
      color: 'text-cyan-600',
      title: 'دعم متعدد اللغات',
      description: 'دعم فني متخصص بأكثر من 35 لغة عالمية مع خبراء متخصصين في كل لغة',
      membership: ['15 لغة', '25 لغة', '35+ لغة']
    },
    {
      icon: Tag,
      color: 'text-pink-600',
      title: 'عروض حصرية متميزة',
      description: 'وصول مبكر للعروض والخدمات الجديدة قبل الآخرين مع خصومات إضافية',
      membership: ['إشعارات العروض', 'وصول مبكر', 'عروض VIP حصرية']
    },
    {
      icon: UserCheck,
      color: 'text-violet-600',
      title: 'دعم شخصي مخصص',
      description: 'مدير حساب شخصي متخصص للمساعدة في جميع احتياجاتك الأكاديمية والمهنية',
      membership: ['دعم عام', 'دعم أولوية', 'مدير حساب مخصص']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50" dir="rtl">
      <WorkingHoursBannerRTL />
      <Header />
      
      {/* Corporate Academic Hero Section */}
      <section className="relative py-20 md:py-28 lg:py-36 bg-gradient-to-bl from-indigo-900 via-blue-800 to-slate-900 overflow-hidden">
        {/* Corporate Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.1)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-l from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600"></div>
        </div>

        {/* Floating Academic Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0.1, 0.4, 0.1],
                scale: [0.5, 1.5, 0.5],
                y: [0, -30, 0]
              }}
              transition={{ 
                duration: 10 + i * 0.8,
                repeat: Infinity,
                delay: i * 0.6
              }}
              className="absolute w-3 h-3 bg-white/20 rounded-full shadow-lg"
              style={{
                left: `${5 + (i * 6)}%`,
                top: `${15 + (i % 4) * 20}%`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-center text-white max-w-6xl mx-auto"
          >
            {/* Corporate Logo & Certification */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.3, type: "spring", stiffness: 80 }}
              className="flex items-center justify-center mb-10"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 40px rgba(59, 130, 246, 0.4)",
                      "0 0 60px rgba(99, 102, 241, 0.5)",
                      "0 0 40px rgba(59, 130, 246, 0.4)"
                    ]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center border-4 border-white/30 backdrop-blur-sm shadow-2xl"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 8, -8, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Crown className="h-12 w-12 md:h-16 md:w-16 text-white" />
                  </motion.div>
                </motion.div>
                
                {/* Certification Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -bottom-3 -right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl border-2 border-white/30"
                >
                  معتمد دولياً
                </motion.div>
              </div>
            </motion.div>

            {/* Corporate Academic Title */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-l from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent leading-tight">
                عضوية فكرة
              </h1>
              <div className="w-40 h-1.5 bg-gradient-to-l from-blue-500 to-indigo-500 mx-auto rounded-full mb-8"></div>
              <h2 className="text-xl md:text-3xl font-semibold text-blue-200 mb-4">
                Master Academic Membership Program
              </h2>
              <div className="text-sm md:text-base text-blue-300 font-medium">
                برنامج العضوية الأكاديمية المتميز • ISO 9001 Certified
              </div>
            </motion.div>

            {/* Corporate Mission Statement */}
            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-xl md:text-2xl lg:text-3xl text-blue-100 leading-relaxed max-w-5xl mx-auto mb-12 px-4"
            >
              انضم إلى النخبة الأكاديمية العالمية واحصل على موارد حصرية ودعم متخصص من خبراء معتمدين دولياً في أكثر من 35 دولة
            </motion.p>

            {/* Corporate Achievement Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-5xl mx-auto mt-16"
            >
              {[
                { number: '75K+', label: 'عضو نشط عالمياً', icon: Users, color: 'from-blue-500 to-cyan-500' },
                { number: '35+', label: 'لغة عالمية', icon: Globe, color: 'from-indigo-500 to-purple-500' },
                { number: '99.9%', label: 'معدل الرضا', icon: Trophy, color: 'from-emerald-500 to-teal-500' },
                { number: '24/7', label: 'دعم متخصص', icon: Shield, color: 'from-orange-500 to-red-500' }
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    whileHover={{ 
                      scale: 1.08, 
                      y: -8,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                    }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 1.2 + index * 0.15,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/30 hover:bg-white/20 transition-all duration-500 shadow-xl"
                  >
                    <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl`}>
                      <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </div>
                    <div className="text-2xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-sm md:text-base text-blue-200 font-medium leading-tight">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Corporate Content Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <Tabs defaultValue="plans" className="space-y-16">
          {/* Corporate Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >
            <TabsList className="grid w-full max-w-2xl grid-cols-2 bg-white/95 backdrop-blur-lg border-2 border-gray-200/50 p-2 rounded-3xl shadow-2xl">
              <TabsTrigger 
                value="benefits" 
                className="flex items-center gap-4 rounded-2xl py-4 px-8 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-700 font-bold text-base"
              >
                <Gift className="h-6 w-6" />
                <span>المزايا الأكاديمية</span>
              </TabsTrigger>
              <TabsTrigger 
                value="plans" 
                className="flex items-center gap-4 rounded-2xl py-4 px-8 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-700 font-bold text-base"
              >
                <Crown className="h-6 w-6" />
                <span>العضويات المتميزة</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Corporate Membership Plans */}
          <TabsContent value="plans" className="space-y-16">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-l from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                العضويات الأكاديمية المتميزة
              </h2>
              <div className="w-32 h-2 bg-gradient-to-l from-indigo-500 to-blue-600 mx-auto rounded-full mb-8"></div>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
                اختر الخطة المناسبة لاحتياجاتك الأكاديمية والمهنية مع ضمان الجودة العالمية والاعتماد الدولي
              </p>
            </motion.div>
            
            <div className="grid gap-10 lg:grid-cols-3 md:grid-cols-2 max-w-7xl mx-auto">
              {membershipPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 80, rotateX: 20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  whileHover={{ 
                    y: -15, 
                    scale: 1.02,
                    rotateY: 3,
                    boxShadow: "0 30px 60px rgba(0,0,0,0.2)"
                  }}
                  transition={{ 
                    delay: index * 0.25, 
                    duration: 1,
                    type: "spring",
                    stiffness: 80
                  }}
                  className={`relative ${plan.popular ? 'lg:scale-110 z-20' : 'z-10'} group`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0, y: 40 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.25 + 1, duration: 0.8 }}
                      className="absolute -top-8 right-1/2 transform translate-x-1/2 z-30"
                    >
                      <div className="relative">
                        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-8 py-3 rounded-full text-base font-bold shadow-2xl border-3 border-white/40 backdrop-blur-sm">
                          <Crown className="inline-block w-5 h-5 ml-3" />
                          الأكثر اختياراً
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-full blur-xl opacity-60 -z-10"></div>
                      </div>
                    </motion.div>
                  )}
                   
                  {/* Corporate Membership Card */}
                  <motion.div
                    initial={{ opacity: 0, rotateY: -20 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    transition={{ delay: index * 0.25 + 0.5, duration: 0.8 }}
                    className="relative"
                  >
                    {/* Main Card Container */}
                    <div className={`
                      relative w-full aspect-[1.586/1] max-w-[350px] mx-auto rounded-3xl overflow-hidden
                      bg-gradient-to-br ${plan.cardGradient}
                      shadow-2xl group-hover:shadow-4xl transition-all duration-700 
                      border-3 border-white/40
                      backdrop-blur-sm
                      transform-gpu
                      before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/15 before:to-transparent before:z-10
                    `}>
                      {/* Corporate Background Elements */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/8 rounded-full translate-y-12 -translate-x-12"></div>
                        
                        {/* Academic Background Icons */}
                        <BookOpen className="absolute top-8 right-8 w-10 h-10 text-white/15 transform rotate-12" />
                        <Award className="absolute bottom-12 left-6 w-8 h-8 text-white/12 transform -rotate-12" />
                        <Globe className="absolute top-16 left-8 w-9 h-9 text-white/12 transform rotate-45" />
                        <Trophy className="absolute bottom-20 right-12 w-7 h-7 text-white/15 transform -rotate-45" />
                        <Shield className="absolute top-20 right-20 w-8 h-8 text-white/12 transform rotate-12" />
                      </div>

                      {/* Corporate Header */}
                      <div className="absolute top-6 right-6 text-white text-sm font-bold opacity-95 z-20">
                        فكرة إيدو الأكاديمية
                      </div>
                      
                      <div className="absolute top-6 left-6 z-20">
                        <Crown className="w-6 h-6 text-yellow-300" />
                      </div>

                      {/* EMV Chip - Corporate Style */}
                      <div className="absolute top-16 right-6 w-10 h-7 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-md shadow-lg z-20">
                        <div className="absolute inset-1 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-sm">
                          <div className="w-full h-full grid grid-cols-3 gap-0.5 p-0.5">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className="bg-yellow-600/40 rounded-sm"></div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Corporate Member Info */}
                      <div className="absolute top-1/2 right-6 transform -translate-y-1/2 text-right text-white z-20">
                        <div 
                          className="text-base font-bold mb-2 tracking-wide"
                          style={{ 
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                            filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'
                          }}
                        >
                          العضو الأكاديمي المعتمد
                        </div>
                        
                        <div 
                          className="text-sm font-mono tracking-wider opacity-95"
                          style={{ 
                            textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                            letterSpacing: '0.1em'
                          }}
                        >
                          {plan.id === 'silver' ? 'رقم العضوية: AC-2024-001' : 
                           plan.id === 'gold' ? 'رقم العضوية: AC-2024-002' : 
                           'رقم العضوية: AC-2024-003'}
                        </div>
                      </div>

                      {/* Membership Level */}
                      <div className="absolute bottom-6 left-6 text-white z-20">
                        <div className="text-base font-bold" 
                             style={{ 
                               textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                               filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'
                             }}>
                          عضوية {plan.name}
                        </div>
                        <div className="text-xs opacity-80 mt-1">{plan.nameEn} Member</div>
                      </div>

                      {/* Validity & Network */}
                      <div className="absolute bottom-6 right-6 text-white text-sm z-20">
                        <div className="opacity-85 text-xs">صالحة حتى</div>
                        <div className="font-mono font-bold">12/2025</div>
                      </div>

                      <div className="absolute bottom-2 right-6 text-white/70 text-xs font-bold z-20">
                        fekrahedu
                      </div>

                      {/* Contactless Symbol */}
                      <div className="absolute top-16 left-6 z-20">
                        <div className="w-5 h-5 border-2 border-white/50 rounded-full relative">
                          <div className="absolute inset-1 border border-white/40 rounded-full"></div>
                          <div className="absolute inset-2 border border-white/40 rounded-full"></div>
                        </div>
                      </div>

                      {/* Holographic Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 z-30"></div>
                    </div>
                  </motion.div>

                  {/* Corporate Plan Details */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.25 + 0.8, duration: 0.6 }}
                    className="mt-8 text-center px-2"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{plan.name}</h3>
                    <p className="text-gray-600 text-base mb-6 font-medium">{plan.nameEn} Professional</p>
                  </motion.div>

                  {/* Corporate Subscribe Button */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.25 + 1, duration: 0.6 }}
                    className="mt-6 px-2"
                  >
                     <Button 
                       onClick={() => {
                         setSelectedPlan(plan);
                         setIsFormOpen(true);
                       }}
                       className={`
                         w-full bg-gradient-to-r ${plan.gradient} 
                         hover:opacity-90 text-white font-bold py-5 text-lg rounded-2xl
                         shadow-2xl hover:shadow-3xl transition-all duration-500
                         hover:scale-105 border-0 group-hover:shadow-4xl
                       `}
                     >
                       اشترك الآن - خطة سنوية
                       <Crown className="w-5 h-5 mr-3" />
                     </Button>
                      
                     {/* Enhanced Price Display */}
                     <motion.div 
                       initial={{ opacity: 0, y: 30 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: index * 0.25 + 1.2, duration: 0.6 }}
                       className="mt-6 relative"
                     >
                       <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-200/50 relative overflow-hidden">
                         {/* Background Pattern */}
                         <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full -translate-y-10 translate-x-10"></div>
                         <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-emerald-100/40 to-cyan-100/40 rounded-full translate-y-8 -translate-x-8"></div>
                         
                         <div className="relative z-10 text-center">
                           {/* Original Price */}
                           <div className="flex items-baseline justify-center gap-2 text-gray-500 text-base line-through mb-2">
                             <span className="text-sm opacity-70">ريال</span>
                             <span className="font-medium">{plan.originalPrice}</span>
                           </div>
                           
                           {/* Current Price */}
                           <div className="flex items-baseline justify-center gap-2 text-gray-900 text-3xl font-bold mb-4">
                             <span className="text-lg opacity-80 font-normal">ريال</span>
                             <span>{plan.price}</span>
                           </div>
                           
                           {/* Cashback */}
                           <div className="inline-flex items-baseline gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-base font-semibold shadow-lg">
                             <span className="text-sm">كاش باك فوري</span>
                             <span className="font-bold">{plan.cashback}</span>
                             <span className="text-sm opacity-90">ريال</span>
                           </div>
                         </div>
                       </div>
                     </motion.div>
                    
                     <motion.div 
                       initial={{ opacity: 0, y: 30 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: index * 0.25 + 1.4, duration: 0.6 }}
                       className="mt-4 text-center px-2"
                     >
                       <div className="inline-flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full text-base font-semibold border border-emerald-200 shadow-lg">
                         <span className="text-sm opacity-80">ريال</span>
                         <span className="font-bold">{plan.cashback}</span>
                         <span>كاش باك {plan.cashbackPercent}</span>
                         <Gift className="w-5 h-5" />
                       </div>
                       <p className="text-sm text-gray-500 mt-3 font-medium">من رسوم التأسيس وجميع الطلبات المستقبلية</p>
                     </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Corporate Cashback Notice */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-20 max-w-7xl mx-auto px-4"
            >
              <div className="relative bg-gradient-to-l from-emerald-50 via-green-50 to-teal-50 border-3 border-emerald-200 rounded-3xl p-8 md:p-12 shadow-3xl overflow-hidden" dir="rtl">
                {/* Corporate Background */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-l from-emerald-100/50 to-green-100/50 opacity-70"></div>
                  <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-bl from-emerald-300/30 to-green-300/30 rounded-full -translate-y-16 md:-translate-y-24 -translate-x-16 md:-translate-x-24 animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-28 h-28 md:w-40 md:h-40 bg-gradient-to-tr from-teal-300/30 to-emerald-300/30 rounded-full translate-y-14 md:translate-y-20 translate-x-14 md:translate-x-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 text-right">
                  {/* Corporate Alert Icon */}
                  <motion.div 
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1.2, duration: 0.8, type: "spring", stiffness: 100 }}
                    className="flex items-center justify-center mb-8"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.15, 1],
                        rotate: [0, -10, 10, 0],
                        boxShadow: [
                          "0 10px 30px rgba(16, 185, 129, 0.4)",
                          "0 15px 40px rgba(16, 185, 129, 0.5)",
                          "0 10px 30px rgba(16, 185, 129, 0.4)"
                        ]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-bl from-emerald-400 via-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-3xl border-4 border-white/40 backdrop-blur-sm"
                    >
                      <motion.div
                        animate={{ 
                          y: [0, -5, 0],
                          rotate: [0, -20, 20, 0]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Gift className="w-12 h-12 md:w-14 md:h-14 text-white" />
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  <div className="text-center">
                    <motion.h3 
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4, duration: 0.8 }}
                      className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-800 mb-8 px-2 text-right"
                    >
                      ⚠️ تنبيه مهم للأعضاء - برنامج الكاش باك المضمون
                    </motion.h3>

                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6, duration: 0.8 }}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-emerald-100 shadow-2xl"
                    >
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8, duration: 0.6 }}
                        className="text-xl md:text-2xl text-emerald-700 font-semibold mb-8 leading-relaxed text-right"
                      >
                        🎯 ستحصل على الكاش باك المضمون من مصدرين أساسيين:
                      </motion.p>
                      
                      {/* Corporate Sources */}
                      <div className="grid gap-6 md:gap-8 lg:grid-cols-2 mb-8">
                        <motion.div
                          initial={{ opacity: 0, x: 60 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.03, y: -8 }}
                          transition={{ delay: 2, duration: 0.6 }}
                          className="bg-gradient-to-l from-emerald-100 via-emerald-50 to-teal-100 p-6 md:p-8 rounded-2xl border-r-4 border-emerald-500 shadow-xl hover:shadow-2xl transition-all duration-500 order-1"
                        >
                          <div className="flex items-center gap-4 mb-4 flex-row-reverse">
                            <motion.div 
                              whileHover={{ scale: 1.15, rotate: -8 }}
                              className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-bl from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl"
                            >
                              <span className="text-white font-bold text-lg md:text-xl">1</span>
                            </motion.div>
                            <h4 className="font-bold text-emerald-800 text-lg md:text-xl text-right flex-1">من رسوم تأسيس العضوية</h4>
                          </div>
                          <p className="text-emerald-700 text-base leading-relaxed text-right">
                            كاش باك فوري مضمون بنسبة العضوية المختارة من رسوم التأسيس
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -60 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.03, y: -8 }}
                          transition={{ delay: 2.2, duration: 0.6 }}
                          className="bg-gradient-to-l from-green-100 via-green-50 to-emerald-100 p-6 md:p-8 rounded-2xl border-r-4 border-green-500 shadow-xl hover:shadow-2xl transition-all duration-500 order-2"
                        >
                          <div className="flex items-center gap-4 mb-4 flex-row-reverse">
                            <motion.div 
                              whileHover={{ scale: 1.15, rotate: -8 }}
                              className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-bl from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-xl"
                            >
                              <span className="text-white font-bold text-lg md:text-xl">2</span>
                            </motion.div>
                            <h4 className="font-bold text-green-800 text-lg md:text-xl text-right flex-1">من جميع الطلبات المستقبلية</h4>
                          </div>
                          <p className="text-green-700 text-base leading-relaxed text-right">
                            كاش باك مستمر مضمون من كل طلب تقوم به بعد الاشتراك
                          </p>
                        </motion.div>
                      </div>

                      {/* Corporate Percentage Breakdown */}
                      <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.4, duration: 0.8 }}
                        className="bg-gradient-to-l from-slate-50 via-gray-50 to-slate-50 rounded-2xl p-6 md:p-8 shadow-inner"
                      >
                        <h4 className="font-bold text-gray-800 mb-6 text-center text-lg md:text-xl">نسب الكاش باك المضمونة حسب العضوية:</h4>
                        <div className="flex justify-center gap-6 md:gap-12 flex-wrap" dir="rtl">
                          {[
                            { percentage: '25%', name: 'البلاتينية', color: 'bg-gradient-to-bl from-slate-400 to-slate-500', delay: 2.6 },
                            { percentage: '15%', name: 'الذهبية', color: 'bg-gradient-to-bl from-yellow-400 to-yellow-500', delay: 2.8 },
                            { percentage: '7%', name: 'الفضية', color: 'bg-gradient-to-bl from-gray-400 to-gray-500', delay: 3 }
                          ].map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ scale: 1.15, y: -5 }}
                              transition={{ delay: item.delay, duration: 0.6, type: "spring", stiffness: 150 }}
                              className="text-center"
                            >
                              <div className={`w-16 h-16 md:w-20 md:h-20 ${item.color} rounded-full flex items-center justify-center mb-3 mx-auto shadow-xl border-3 border-white`}>
                                <span className="text-white font-bold text-base md:text-lg">{item.percentage}</span>
                              </div>
                              <span className="text-sm md:text-base font-semibold text-gray-700">{item.name}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Corporate CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 40, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 3.2, duration: 0.8 }}
                      className="mt-8"
                    >
                      <div className="inline-flex items-center gap-4 bg-gradient-to-l from-emerald-500 via-green-500 to-emerald-600 text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-bold shadow-3xl border border-emerald-400/40 backdrop-blur-sm hover:shadow-4xl transition-all duration-500 hover:scale-105 flex-row-reverse text-lg">
                        <motion.div
                          animate={{ x: [0, -8, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Gift className="w-6 h-6 md:w-7 md:h-7" />
                        </motion.div>
                        <span className="text-lg md:text-xl">ابدأ الآن واحصل على كاش باك مضمون!</span>
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          <Star className="w-6 h-6 md:w-7 md:h-7" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Corporate Benefits Section */}
          <TabsContent value="benefits" className="space-y-12">
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-l from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent"
            >
              مزايا العضوية الأكاديمية المتميزة
            </motion.h2>
            
            <div className="grid gap-8 lg:grid-cols-2 max-w-7xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  whileHover={{ scale: 1.02, y: -10 }}
                  transition={{ 
                    delay: index * 0.15, 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100 
                  }}
                  className="group"
                >
                  <Card className="p-8 hover:shadow-2xl transition-all duration-700 border-r-4 border-indigo-500 bg-gradient-to-l from-indigo-50/50 to-white hover:from-indigo-50/70 hover:to-blue-50/50 overflow-hidden relative h-full shadow-xl">
                    {/* Corporate Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-full group-hover:translate-x-0"></div>
                    
                    <div className="flex items-start gap-8 relative z-10">
                      <div className="flex-1 text-right">
                        <motion.h3 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.15 + 0.3, duration: 0.6 }}
                          className="text-2xl font-bold mb-4 text-gray-800"
                        >
                          {benefit.title}
                        </motion.h3>
                        <motion.p 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.15 + 0.4, duration: 0.6 }}
                          className="text-gray-600 mb-6 text-base leading-relaxed"
                        >
                          {benefit.description}
                        </motion.p>
                        <div className="space-y-3">
                          {benefit.membership.map((level, idx) => (
                            <motion.div 
                              key={idx} 
                              initial={{ opacity: 0, x: 40 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: index * 0.15 + 0.5 + idx * 0.1, 
                                duration: 0.4 
                              }}
                              className="flex items-center gap-3 justify-end"
                            >
                              <span className="text-gray-700 text-base font-medium">{level}</span>
                              <motion.div
                                whileHover={{ scale: 1.3, rotate: 360 }}
                                transition={{ duration: 0.4 }}
                              >
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Corporate Animated Icon */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: 12,
                          y: -8,
                          boxShadow: "0 15px 30px rgba(0,0,0,0.2)"
                        }}
                        transition={{ 
                          delay: index * 0.15, 
                          duration: 0.8, 
                          type: "spring", 
                          stiffness: 150 
                        }}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center flex-shrink-0 shadow-2xl border border-gray-200/60 relative overflow-hidden"
                      >
                        {/* Icon Glow Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-indigo-100/60 to-blue-100/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          initial={false}
                          animate={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        />
                        
                        {/* Floating Icon */}
                        <motion.div
                          animate={{ 
                            y: [0, -3, 0],
                            rotate: [0, 3, -3, 0]
                          }}
                          transition={{ 
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.3
                          }}
                          className="relative z-10"
                        >
                          <benefit.icon className={`h-10 w-10 ${benefit.color} transition-colors duration-500`} />
                        </motion.div>

                        {/* Sparkle Effect */}
                        <motion.div
                          className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full opacity-0"
                          animate={{ 
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.2, 0.5]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.4
                          }}
                        />
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Corporate CTA Section */}
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-center mt-20"
            >
              <div className="bg-gradient-to-l from-indigo-600 to-blue-700 rounded-3xl p-12 text-white mx-4 md:mx-0 relative overflow-hidden shadow-3xl">
                {/* Corporate Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-60"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-400/30 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/30 rounded-full translate-y-16 -translate-x-16"></div>
                
                <div className="relative z-10">
                  <motion.div
                    animate={{ 
                      y: [0, -8, 0],
                      rotate: [0, 8, -8, 0]
                    }}
                    transition={{ 
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Crown className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 text-yellow-300" />
                  </motion.div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">وكالة فكرة إيدو الأكاديمية</h3>
                  <p className="text-xl md:text-2xl mb-8">شريكك الموثوق في رحلة التميز الأكاديمي والتطوير المهني العالمي</p>
                  <div className="text-base md:text-lg text-blue-200 font-medium">
                    معتمدة دولياً • ISO 9001 • أكثر من 75,000 عضو حول العالم
                  </div>
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

export default FekrahMembership;