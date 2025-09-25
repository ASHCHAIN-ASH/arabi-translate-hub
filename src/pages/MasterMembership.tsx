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
      price: '120',
      originalPrice: '240',
      discount: '50%',
      cashback: '120',
      cardGradient: 'from-gray-400 via-gray-500 to-gray-600',
      gradient: 'from-gray-400 to-gray-600',
      chipColor: 'bg-yellow-400',
      popular: false
    },
    {
      id: 'gold',
      name: 'الذهبية',
      nameEn: 'Gold',
      price: '480',
      originalPrice: '960',
      discount: '50%',
      cashback: '480',
      cardGradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
      gradient: 'from-yellow-400 to-yellow-600',
      chipColor: 'bg-yellow-500',
      popular: true
    },
    {
      id: 'platinum',
      name: 'البلاتينية',
      nameEn: 'Platinum',
      price: '1260',
      originalPrice: '2520',
      discount: '50%',
      cashback: '1260',
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
      title: 'كاش باك مضمون',
      description: 'استرداد نقدي مضمون يصل إلى 1,260 ريال حسب نوع الاشتراك الاختياري',
      membership: ['ريال للفضية 120', 'ريال للذهبية 480', 'ريال للبلاتينية 1,260']
    },
    {
      icon: BookOpen,
      color: 'text-green-600',
      title: 'مكتبة محتوى شاملة',
      description: 'وصول لآلاف المقالات والموارد التعليمية المتخصصة في الترجمة والأبحاث',
      membership: ['محدود للفضية', 'متقدم للذهبية', 'غير محدود للبلاتينية']
    },
    {
      icon: MessageSquare,
      color: 'text-indigo-600',
      title: 'مجتمع من الخبراء',
      description: 'تفاعل مع شبكة من المترجمين والباحثين المحترفين من جميع أنحاء العالم',
      membership: ['نقاشات عامة', 'ورش عمل مباشرة', 'مجموعة VIP حصرية']
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

                    {/* Card Number */}
                    <div className="absolute top-20 right-4 text-white font-mono text-sm tracking-wider">
                      {plan.id === 'silver' ? '5432 **** **** 1234' : plan.id === 'gold' ? '4532 **** **** 5678' : '4532 **** **** 9012'}
                    </div>

                    {/* Card Holder Name */}
                    <div className="absolute bottom-14 right-4 text-white">
                      <div className="text-xs opacity-80 mb-1">اسم حامل البطاقة</div>
                      <div className="text-sm font-bold">عضوية {plan.name}</div>
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

                    {/* Price Badge */}
                    <div className="absolute top-4 left-12 bg-white/15 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                      <div className="text-white/70 text-xs line-through">{plan.originalPrice} ريال</div>
                      <div className="text-white text-lg font-bold">{plan.price}</div>
                      <div className="text-green-300 text-xs">كاش باك: {plan.cashback}</div>
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-16 left-4 transform -rotate-12 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
                      {plan.discount}
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
                    
                    <div className="mt-3 text-center">
                      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
                        <Gift className="w-4 h-4" />
                        كاش باك مضمون: {plan.cashback} ريال
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Benefits Section */}
          <TabsContent value="benefits" className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              مزايا عضوية ماستر
            </h2>
            
            <div className="flex flex-col gap-8 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, x: -5 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <Card className="p-8 hover:shadow-xl transition-all duration-500 border-r-4 border-purple-500 bg-gradient-to-l from-purple-50/50 to-white">
                    <div className="flex items-start gap-8">
                      <div className="flex-1 text-right">
                        <motion.h3 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2 + 0.2, duration: 0.5 }}
                          className="text-2xl font-bold mb-4 text-gray-800"
                        >
                          {benefit.title}
                        </motion.h3>
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                          className="text-gray-600 mb-6 text-lg leading-relaxed"
                        >
                          {benefit.description}
                        </motion.p>
                        <div className="grid gap-4 sm:grid-cols-1">
                          {benefit.membership.map((level, idx) => (
                            <motion.div 
                              key={idx} 
                              initial={{ opacity: 0, x: 30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.2 + 0.4 + idx * 0.1, duration: 0.4 }}
                              className="flex items-center gap-3 justify-end"
                            >
                              <span className="text-gray-700 font-medium">{level}</span>
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ delay: index * 0.2, duration: 0.6, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 shadow-lg"
                      >
                        <benefit.icon className={`h-10 w-10 ${benefit.color}`} />
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