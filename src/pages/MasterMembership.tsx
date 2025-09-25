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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";
import MembershipSubscriptionForm from "@/components/MembershipSubscriptionForm";

const MasterMembership = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const membershipPlans = [
    {
      id: 'silver',
      name: 'العضوية الفضية',
      nameEn: 'SILVER MEMBER',
      price: '1,200',
      originalPrice: '1,440',
      discount: '10%',
      cashback: '120',
      popular: false,
      gradient: 'from-slate-500 via-slate-400 to-slate-600',
      cardGradient: 'from-slate-600 via-slate-500 to-slate-700',
      chipColor: 'bg-yellow-400'
    },
    {
      id: 'gold',
      name: 'العضوية الذهبية',
      nameEn: 'GOLD MEMBER',
      price: '2,400',
      originalPrice: '3,000',
      discount: '20%',
      cashback: '480',
      popular: true,
      gradient: 'from-yellow-500 via-amber-400 to-orange-500',
      cardGradient: 'from-amber-500 via-yellow-500 to-orange-600',
      chipColor: 'bg-white'
    },
    {
      id: 'platinum',
      name: 'العضوية البلاتينية',
      nameEn: 'PLATINUM MEMBER',
      price: '3,600',
      originalPrice: '5,520',
      discount: '35%',
      cashback: '1,260',
      popular: false,
      gradient: 'from-gray-800 via-slate-700 to-black',
      cardGradient: 'from-gray-900 via-slate-800 to-black',
      chipColor: 'bg-cyan-400'
    }
  ];

  const benefits = [
    {
      icon: Tag,
      title: 'خصومات مميزة',
      description: 'خصومات تصل إلى 35% على جميع خدمات الترجمة والبحث الأكاديمي',
      color: 'text-red-500',
      membership: ['10% للفضية', '20% للذهبية', '35% للبلاتينية']
    },
    {
      icon: Gift,
      title: 'كاش باك مضمون',
      description: 'استرداد نقدي سنوي مضمون يصل إلى 1,260 ريال حسب نوع العضوية',
      color: 'text-green-500',
      membership: ['120 ريال للفضية', '480 ريال للذهبية', '1,260 ريال للبلاتينية']
    },
    {
      icon: BookOpen,
      title: 'مكتبة محتوى شاملة',
      description: 'وصول لآلاف المقالات والموارد التعليمية المتخصصة في الترجمة والأبحاث',
      color: 'text-blue-500',
      membership: ['محدود للفضية', 'متقدم للذهبية', 'غير محدود للبلاتينية']
    },
    {
      icon: Users,
      title: 'مجتمع من الخبراء',
      description: 'تفاعل مع شبكة من المترجمين والباحثين المحترفين من جميع أنحاء العالم',
      color: 'text-purple-500',
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
              <TabsTrigger value="plans" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                العضويات
              </TabsTrigger>
              <TabsTrigger value="benefits" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                المزايا
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Membership Plans */}
          <TabsContent value="plans" className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              اختر العضوية المناسبة لك
            </h2>
            
            <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 max-w-7xl mx-auto">
              {membershipPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-6 right-1/2 transform translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl">
                        <Crown className="inline-block w-4 h-4 ml-1" />
                        الأكثر طلبًا
                      </div>
                    </div>
                  )}
                  
                  {/* Bank Card - Arabic RTL Design */}
                  <div className={`
                    relative w-full h-80 rounded-[20px] overflow-hidden
                    bg-gradient-to-br ${plan.cardGradient}
                    shadow-2xl transition-all duration-500 
                    hover:shadow-3xl
                    border border-white/20
                    backdrop-blur-sm
                  `}>
                    {/* Card Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                    {/* Card Header - Arabic positioning */}
                    <div className="absolute top-6 right-6 text-white text-sm font-bold opacity-90">
                      وكالة ماستر إيدو باث
                    </div>
                    <div className="absolute top-6 left-6">
                      <Crown className="w-8 h-8 text-yellow-300" />
                    </div>

                    {/* Chip - Real bank card position */}
                    <div className="absolute top-20 right-6 w-14 h-10 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-lg shadow-lg">
                      <div className="absolute inset-1 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md">
                        <div className="w-full h-full bg-gradient-to-br from-transparent via-white/20 to-transparent rounded-md"></div>
                      </div>
                    </div>

                    {/* Card Number - Arabic positioning */}
                    <div className="absolute top-36 right-6 text-white font-mono text-lg tracking-widest">
                      {plan.id === 'silver' ? '5432 1098 7654 ••••' : plan.id === 'gold' ? '4532 1098 7654 ••••' : '4532 1098 7654 ••••'}
                    </div>

                    {/* Membership Level - Arabic positioning */}
                    <div className="absolute bottom-20 right-6 text-white">
                      <div className="text-xl font-bold">{plan.name}</div>
                      <div className="text-sm opacity-80 mt-1">{plan.nameEn}</div>
                    </div>

                    {/* Expiry Date */}
                    <div className="absolute bottom-12 right-6 text-white/80 text-sm">
                      <div>صالح حتى</div>
                      <div className="font-mono">12/25</div>
                    </div>

                    {/* Card Network Logo */}
                    <div className="absolute bottom-6 right-6 text-white/60 text-xs font-bold">
                      MASTERCARD
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-6 left-20 bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <div className="text-white/70 text-sm line-through">{plan.originalPrice} ريال</div>
                      <div className="text-white text-2xl font-bold">{plan.price}</div>
                      <div className="text-green-300 text-sm font-medium">كاش باك: {plan.cashback}</div>
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-28 left-6 transform -rotate-12 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                      خصم {plan.discount}
                    </div>

                    {/* Holographic Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"></div>
                  </div>

                  {/* Subscribe Button */}
                  <div className="mt-8">
                    <Button 
                      onClick={() => {
                        setSelectedPlan(plan);
                        setIsFormOpen(true);
                      }}
                      className={`
                        w-full bg-gradient-to-r ${plan.gradient} 
                        hover:opacity-90 text-white font-bold py-8 text-xl rounded-2xl
                        shadow-xl hover:shadow-2xl transition-all duration-300
                        hover:scale-105 border-0
                      `}
                    >
                      <Crown className="w-6 h-6 ml-3" />
                      اشترك الآن - 12 شهر
                    </Button>
                    
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center gap-3 bg-green-50 text-green-700 px-6 py-3 rounded-full text-base font-medium">
                        <Gift className="w-5 h-5" />
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
            
            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="p-8 hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3 text-gray-800">{benefit.title}</h3>
                        <p className="text-gray-600 mb-4 text-lg leading-relaxed">{benefit.description}</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {benefit.membership.map((level, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">{level}</span>
                            </div>
                          ))}
                        </div>
                      </div>
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
    </div>
  );
};

export default MasterMembership;