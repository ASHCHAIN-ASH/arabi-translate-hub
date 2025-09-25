import { motion } from "framer-motion";
import { 
  Crown, 
  Star, 
  CheckCircle, 
  Trophy, 
  Users, 
  BookOpen, 
  Award, 
  Zap, 
  Shield, 
  MessageSquare,
  Download,
  Headphones,
  Globe,
  Calendar,
  TrendingUp,
  Gift,
  Tag,
  Infinity,
  Mail,
  UserCheck,
  QrCode
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";

const MasterMembership = () => {
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
      chipColor: 'bg-yellow-400',
      features: [
        'خصم 10% على جميع الخدمات',
        'كاش باك 120 ريال سنوياً',
        'دخول لدورات شهرية مجانية',
        'شهادة مشاركة رقمية'
      ]
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
      chipColor: 'bg-white',
      features: [
        'خصم 20% على جميع الخدمات',
        'كاش باك 480 ريال سنوياً',
        'دخول غير محدود للدورات',
        'دعم فني مميز عبر البريد',
        'شهادة إنجاز معتمدة'
      ]
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
      chipColor: 'bg-cyan-400',
      features: [
        'خصم 35% على جميع الخدمات',
        'كاش باك 1,260 ريال سنوياً',
        'استشارة شهرية مجانية مع خبير',
        'أولوية في المسابقات الأكاديمية',
        'شهادة إنجاز معتمدة + توثيق QR'
      ]
    }
  ];

  const benefits = [
    {
      icon: BookOpen,
      title: 'مكتبة محتوى شاملة',
      description: 'وصول لآلاف المقالات والموارد التعليمية المتخصصة في الترجمة والأبحاث',
      color: 'text-blue-500'
    },
    {
      icon: Users,
      title: 'مجتمع من الخبراء',
      description: 'تفاعل مع شبكة من المترجمين والباحثين المحترفين من جميع أنحاء العالم',
      color: 'text-green-500'
    },
    {
      icon: Trophy,
      title: 'تطوير مهني مستمر',
      description: 'برامج تدريبية متقدمة وورش عمل تطبيقية لتطوير مهاراتك المهنية',
      color: 'text-purple-500'
    },
    {
      icon: Shield,
      title: 'دعم متخصص',
      description: 'فريق دعم متاح على مدار الساعة للإجابة على استفساراتك وحل مشاكلك',
      color: 'text-orange-500'
    }
  ];

  const resources = [
    {
      category: 'أدلة الترجمة',
      items: ['دليل الترجمة القانونية', 'دليل الترجمة الطبية', 'دليل الترجمة التقنية'],
      count: 25
    },
    {
      category: 'قوالب وأدوات',
      items: ['قوالب المذكرات', 'أدوات فحص الجودة', 'نماذج العقود'],
      count: 40
    },
    {
      category: 'دورات تدريبية',
      items: ['أساسيات البحث العلمي', 'تقنيات الترجمة المتقدمة', 'إدارة المشاريع'],
      count: 18
    },
    {
      category: 'ندوات ومحاضرات',
      items: ['ندوات شهرية مباشرة', 'أرشيف المحاضرات', 'جلسات أسئلة وأجوبة'],
      count: 50
    }
  ];

  const testimonials = [
    {
      name: 'د. سارة أحمد',
      role: 'مترجمة قانونية معتمدة',
      content: 'عضوية ماستر غيرت مسيرتي المهنية بالكامل. المحتوى عالي الجودة والدعم رائع.',
      rating: 5
    },
    {
      name: 'أحمد محمد',
      role: 'باحث أكاديمي',
      content: 'الموارد التعليمية والورش العملية ساعدتني كثيراً في تطوير أبحاثي وتحسين جودة كتابتي.',
      rating: 5
    },
    {
      name: 'فاطمة السالم',
      role: 'مديرة مشاريع ترجمة',
      content: 'المجتمع والشبكة المهنية التي وفرتها العضوية فتحت لي فرص عمل جديدة ومثمرة.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50" dir="rtl">
      
      {/* Working Hours Banner */}
      <WorkingHoursBannerRTL />
      
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
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
            <h1 className="text-5xl font-bold mb-6 font-arabic-title">
              عضوية ماستر
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              انضم إلى مجتمع النخبة من المترجمين والباحثين واحصل على موارد حصرية ودعم متخصص لتطوير مسيرتك المهنية
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: BookOpen, label: 'مكتبة شاملة', value: '1000+' },
                { icon: Users, label: 'عضو نشط', value: '5000+' },
                { icon: Trophy, label: 'شهادة معتمدة', value: '50+' },
                { icon: Gift, label: 'مورد حصري', value: '200+' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20"
                >
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="plans" className="space-y-8">
          
          {/* Tabs Navigation */}
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-lg grid-cols-4" dir="rtl">
              <TabsTrigger value="plans" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                الخطط
              </TabsTrigger>
              <TabsTrigger value="benefits" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                المزايا
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                الموارد
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                التقييمات
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Membership Plans */}
          <TabsContent value="plans" className="space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                اختر العضوية المناسبة لك
              </h2>
              
              <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 max-w-7xl mx-auto">
                {membershipPlans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
                  >
                    {/* Bank Card Style Container */}
                    <div className="relative group cursor-pointer">
                      {/* Featured Badge */}
                      {plan.popular && (
                        <div className="absolute -top-4 right-4 z-10">
                          <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            <Star className="inline-block w-4 h-4 ml-1" />
                            الأكثر طلبًا
                          </div>
                        </div>
                      )}
                      
                      {/* Bank Card */}
                      <div className={`
                        relative w-full h-56 rounded-2xl overflow-hidden
                        bg-gradient-to-br ${plan.cardGradient}
                        shadow-2xl transform transition-all duration-500 
                        hover:scale-105 hover:shadow-3xl hover:-translate-y-3
                        border border-white/10 backdrop-blur-sm perspective-1000
                        group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.4)]
                      `}>
                        {/* Card Texture Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
                        
                        {/* Bank Name & Logo */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <div className="text-white/90 text-xs font-bold tracking-widest">
                            ARABI TRANSLATE
                          </div>
                          <Crown className="w-5 h-5 text-white/80" />
                        </div>

                        {/* Card Chip */}
                        <div className={`absolute top-16 right-6 w-12 h-9 ${plan.chipColor} rounded-lg shadow-inner`}>
                          <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-lg flex items-center justify-center">
                            <div className="w-8 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-sm"></div>
                          </div>
                        </div>

                        {/* Contactless Payment Symbol */}
                        <div className="absolute top-16 left-6">
                          <div className="relative">
                            <div className="w-6 h-6 border-2 border-white/40 rounded-full"></div>
                            <div className="absolute -top-1 -left-1 w-8 h-8 border-2 border-white/30 rounded-full"></div>
                            <div className="absolute -top-2 -left-2 w-10 h-10 border-2 border-white/20 rounded-full"></div>
                          </div>
                        </div>

                        {/* Card Number Pattern */}
                        <div className="absolute top-28 right-6 text-white/60 text-sm font-mono tracking-widest">
                          •••• •••• •••• {plan.id === 'silver' ? '1234' : plan.id === 'gold' ? '5678' : '9012'}
                        </div>

                        {/* Membership Type */}
                        <div className="absolute bottom-14 right-6">
                          <div className="text-white/90 text-lg font-bold">{plan.name}</div>
                          <div className="text-white/70 text-xs font-bold tracking-widest">{plan.nameEn}</div>
                        </div>

                        {/* Validity */}
                        <div className="absolute bottom-6 right-6 text-white/60 text-xs">
                          <div>صالح حتى</div>
                          <div className="font-mono">12/25</div>
                        </div>

                        {/* Hologram Effect */}
                        <div className="absolute bottom-6 left-6 w-12 h-8 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded opacity-80 animate-pulse"></div>

                        {/* Price & Cashback */}
                        <div className="absolute top-4 left-4">
                          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                            <div className="text-white text-xs opacity-70 line-through">{plan.originalPrice} ريال</div>
                            <div className="text-white text-lg font-bold">{plan.price} ريال</div>
                            <div className="text-green-300 text-xs font-bold">كاش باك: {plan.cashback} ريال</div>
                          </div>
                        </div>

                        {/* Discount Badge */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            خصم {plan.discount}
                          </div>
                        </div>
                      </div>

                      {/* Features Card */}
                      <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">مميزات العضوية</h4>
                        <div className="space-y-3">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-gray-700">
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="text-sm font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Subscribe Button */}
                      <div className="mt-6">
                        <Button 
                          className={`
                            w-full bg-gradient-to-r ${plan.gradient} 
                            hover:opacity-90 text-white font-bold py-6 text-lg rounded-xl
                            shadow-lg hover:shadow-xl transition-all duration-300
                            border-0 hover:scale-105 relative overflow-hidden
                          `}
                          size="lg"
                        >
                          <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                          <div className="relative flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-1">
                              <Crown className="w-5 h-5" />
                              <span>اشترك الآن - 12 شهر</span>
                            </div>
                            <div className="text-sm opacity-90">
                              وفر {Math.round(((parseInt(plan.originalPrice.replace(',', '')) - parseInt(plan.price.replace(',', ''))) / parseInt(plan.originalPrice.replace(',', '')) * 100))}% سنوياً
                            </div>
                          </div>
                        </Button>
                        
                        {/* Cashback Info */}
                        <div className="mt-3 text-center">
                          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                            <Gift className="w-4 h-4" />
                            <span>كاش باك مضمون: {plan.cashback} ريال</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Benefits Section */}
          <TabsContent value="benefits" className="space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                لماذا عضوية ماستر؟
              </h2>
              
              <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow duration-300 h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center`}>
                          <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{benefit.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Resources Section */}
          <TabsContent value="resources" className="space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                مكتبة الموارد الحصرية
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                {resources.map((resource, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800">{resource.category}</h3>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {resource.count}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {resource.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Testimonials Section */}
          <TabsContent value="testimonials" className="space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                ما يقوله أعضاؤنا
              </h2>
              
              <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow duration-300 h-full">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, idx) => (
                          <Star key={idx} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-4 leading-relaxed">"{testimonial.content}"</p>
                      <div className="border-t pt-4">
                        <div className="font-semibold text-gray-800">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MasterMembership;