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
      nameEn: 'Silver',
      discount: '10%',
      popular: false,
      gradient: 'from-slate-400 via-slate-300 to-slate-500',
      cardGradient: 'from-cyan-400 via-blue-400 to-indigo-500',
      features: [
        { text: 'خصم 10% على جميع الخدمات', icon: 'tag' },
        { text: 'دخول لدورات شهرية مجانية', icon: 'book' },
        { text: 'شهادة مشاركة رقمية', icon: 'award' }
      ]
    },
    {
      id: 'gold',
      name: 'العضوية الذهبية',
      nameEn: 'Gold',
      discount: '20%',
      popular: true,
      gradient: 'from-yellow-400 via-amber-400 to-orange-500',
      cardGradient: 'from-amber-400 via-yellow-400 to-orange-500',
      features: [
        { text: 'خصم 20% على جميع الخدمات', icon: 'tag' },
        { text: 'دخول غير محدود للدورات', icon: 'infinity' },
        { text: 'دعم فني مميز عبر البريد', icon: 'mail' },
        { text: 'شهادة إنجاز معتمدة', icon: 'award' }
      ]
    },
    {
      id: 'platinum',
      name: 'العضوية البلاتينية',
      nameEn: 'Platinum',
      discount: '35%',
      popular: false,
      gradient: 'from-gray-900 via-gray-700 to-slate-600',
      cardGradient: 'from-gray-800 via-slate-700 to-gray-900',
      features: [
        { text: 'خصم 35% على جميع الخدمات', icon: 'tag' },
        { text: 'استشارة شهرية مجانية مع خبير', icon: 'user-check' },
        { text: 'أولوية في المسابقات الأكاديمية', icon: 'trophy' },
        { text: 'شهادة إنجاز معتمدة + توثيق QR', icon: 'qr-code' }
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
                        relative w-full h-80 rounded-2xl p-6 
                        bg-gradient-to-br ${plan.cardGradient}
                        shadow-2xl transform transition-all duration-300 
                        hover:scale-105 hover:shadow-3xl hover:-translate-y-2
                        border border-white/20 backdrop-blur-sm
                        group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]
                      `}>
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-6">
                          <div className="text-white">
                            <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                            <p className="text-white/80 text-lg">{plan.nameEn}</p>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            {plan.id === 'silver' && <Award className="w-6 h-6 text-white" />}
                            {plan.id === 'gold' && <Crown className="w-6 h-6 text-white" />}
                            {plan.id === 'platinum' && <Trophy className="w-6 h-6 text-white" />}
                          </div>
                        </div>

                        {/* Discount Badge */}
                        <div className="absolute top-6 left-6">
                          <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg font-bold text-xl">
                            خصم {plan.discount}
                          </div>
                        </div>

                        {/* Card Chip Effect */}
                        <div className="absolute top-20 right-6 w-8 h-6 bg-white/30 rounded-md"></div>
                        
                        {/* Features List */}
                        <div className="space-y-3 mt-8">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-white">
                              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                {feature.icon === 'tag' && <Tag className="w-3 h-3" />}
                                {feature.icon === 'book' && <BookOpen className="w-3 h-3" />}
                                {feature.icon === 'award' && <Award className="w-3 h-3" />}
                                {feature.icon === 'infinity' && <Infinity className="w-3 h-3" />}
                                {feature.icon === 'mail' && <Mail className="w-3 h-3" />}
                                {feature.icon === 'user-check' && <UserCheck className="w-3 h-3" />}
                                {feature.icon === 'trophy' && <Trophy className="w-3 h-3" />}
                                {feature.icon === 'qr-code' && <QrCode className="w-3 h-3" />}
                              </div>
                              <span className="text-sm font-medium">{feature.text}</span>
                            </div>
                          ))}
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute bottom-6 left-6 opacity-20">
                          <div className="flex gap-2">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      {/* Subscribe Button */}
                      <div className="mt-6">
                        <Button 
                          className={`
                            w-full bg-gradient-to-r ${plan.gradient} 
                            hover:opacity-90 text-white font-bold py-4 text-lg rounded-xl
                            shadow-lg hover:shadow-xl transition-all duration-300
                            border-0 hover:scale-105
                          `}
                          size="lg"
                        >
                          <Crown className="w-5 h-5 ml-2" />
                          اشترك الآن
                        </Button>
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