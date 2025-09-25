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
      <section className="relative py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 overflow-hidden" dir="rtl">
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

      <div className="container mx-auto px-4 py-16" dir="rtl">
        <Tabs defaultValue="plans" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-lg grid-cols-2">
              <TabsTrigger value="plans" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                الخطط
              </TabsTrigger>
              <TabsTrigger value="benefits" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                المزايا
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Membership Plans */}
          <TabsContent value="plans" className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              اختر العضوية المناسبة لك
            </h2>
            
            <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 max-w-6xl mx-auto">
              {membershipPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        <Star className="inline-block w-4 h-4 mr-1" />
                        الأكثر طلبًا
                      </div>
                    </div>
                  )}
                  
                  {/* Bank Card */}
                  <div className={`
                    relative w-full h-64 rounded-2xl overflow-hidden
                    bg-gradient-to-br ${plan.cardGradient}
                    shadow-2xl transition-all duration-500 
                    hover:shadow-3xl hover:-translate-y-2
                    border border-white/10
                  `}>
                    {/* Card Header */}
                    <div className="absolute top-4 left-4 text-white text-xs font-bold">
                      ARABI TRANSLATE
                    </div>
                    <Crown className="absolute top-4 right-4 w-5 h-5 text-white/80" />

                    {/* Chip */}
                    <div className={`absolute top-16 left-6 w-12 h-8 ${plan.chipColor} rounded-lg`}>
                      <div className="w-full h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-lg"></div>
                    </div>

                    {/* Card Number */}
                    <div className="absolute top-28 left-6 text-white/60 text-sm font-mono">
                      •••• •••• •••• {plan.id === 'silver' ? '1234' : plan.id === 'gold' ? '5678' : '9012'}
                    </div>

                    {/* Membership Info */}
                    <div className="absolute bottom-14 left-6 text-white">
                      <div className="text-lg font-bold">{plan.name}</div>
                      <div className="text-xs opacity-70">{plan.nameEn}</div>
                    </div>

                    {/* Agency */}
                    <div className="absolute bottom-6 left-6 text-white/70 text-xs">
                      <div>وكالة ماستر إيدو باث</div>
                      <div>MASTER EDU PATH AGENCY</div>
                    </div>

                    {/* Price */}
                    <div className="absolute top-4 right-16 bg-white/20 rounded-lg p-3">
                      <div className="text-white text-xs line-through opacity-70">{plan.originalPrice} ريال</div>
                      <div className="text-white text-lg font-bold">{plan.price} ريال</div>
                      <div className="text-green-300 text-xs">كاش باك: {plan.cashback}</div>
                    </div>

                    {/* Discount */}
                    <div className="absolute top-20 right-1/2 transform translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      خصم {plan.discount}
                    </div>
                  </div>

                  {/* Subscribe Button */}
                  <div className="mt-6">
                    <Button 
                      onClick={() => {
                        setSelectedPlan(plan);
                        setIsFormOpen(true);
                      }}
                      className={`
                        w-full bg-gradient-to-r ${plan.gradient} 
                        hover:opacity-90 text-white font-bold py-6 text-lg rounded-xl
                        shadow-lg hover:shadow-xl transition-all duration-300
                        hover:scale-105
                      `}
                    >
                      <Crown className="w-5 h-5 ml-2" />
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