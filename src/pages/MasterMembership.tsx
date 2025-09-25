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
  Gift
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
      id: 'basic',
      name: 'العضوية الأساسية',
      price: '299',
      period: 'شهرياً',
      popular: false,
      color: 'from-blue-500 to-blue-600',
      features: [
        'وصول كامل للمدونة والمقالات',
        'تحميل الموارد التعليمية الأساسية',
        'المشاركة في النقاشات المجتمعية',
        'تحديثات أسبوعية بالمحتوى الجديد',
        'دعم فني أساسي'
      ]
    },
    {
      id: 'premium',
      name: 'العضوية المميزة',
      price: '599',
      period: 'شهرياً',
      popular: true,
      color: 'from-purple-500 to-purple-600',
      features: [
        'جميع مزايا العضوية الأساسية',
        'وصول حصري للمحتوى المتقدم',
        'ورش عمل شهرية مباشرة',
        'استشارات فردية مجانية (ساعة شهرياً)',
        'مكتبة موارد متقدمة',
        'شهادات إتمام معتمدة',
        'دعم أولوية على مدار الساعة'
      ]
    },
    {
      id: 'platinum',
      name: 'العضوية البلاتينية',
      price: '999',
      period: 'شهرياً',
      popular: false,
      color: 'from-amber-500 to-yellow-500',
      features: [
        'جميع مزايا العضوية المميزة',
        'جلسات تدريب شخصية أسبوعية',
        'وصول مبكر لجميع المحتويات الجديدة',
        'مجموعة VIP حصرية',
        'استشارات غير محدودة',
        'تقييم شخصي للمشاريع',
        'خصم 50% على جميع الخدمات'
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
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                اختر الخطة المناسبة لك
              </h2>
              
              <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                {membershipPlans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className={`relative ${plan.popular ? 'scale-105' : ''}`}
                  >
                    <Card className={`overflow-hidden border-2 ${plan.popular ? 'border-purple-300 shadow-2xl' : 'border-gray-200'} hover:shadow-xl transition-all duration-300`}>
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                          الأكثر شعبية
                        </div>
                      )}
                      
                      <CardHeader className="text-center pb-8 pt-8">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${plan.color} mx-auto mb-4 flex items-center justify-center`}>
                          {plan.id === 'basic' && <Star className="h-8 w-8 text-white" />}
                          {plan.id === 'premium' && <Crown className="h-8 w-8 text-white" />}
                          {plan.id === 'platinum' && <Trophy className="h-8 w-8 text-white" />}
                        </div>
                        <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                        <div className="text-center">
                          <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                          <span className="text-gray-600 mr-2">ريال</span>
                          <div className="text-sm text-gray-500">{plan.period}</div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          className={`w-full mt-6 bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold py-3 text-lg`}
                          size="lg"
                        >
                          اشترك الآن
                        </Button>
                      </CardContent>
                    </Card>
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