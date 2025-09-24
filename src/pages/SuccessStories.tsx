import { motion } from "framer-motion";
import { 
  Star, ArrowLeft, Trophy, Users, Clock, Target, CheckCircle, Quote,
  Building2, Briefcase, Globe, TrendingUp, Award, Shield, Zap,
  FileText, Calendar, MapPin, Phone, Mail, Eye, EyeOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useState } from "react";

const SuccessStories = () => {
  const [showDetails, setShowDetails] = useState<{[key: number]: boolean}>({});

  const toggleDetails = (id: number) => {
    setShowDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const successStories = [
    {
      id: 1,
      title: "توطين منصة تجارة إلكترونية عالمية للسوق السعودية",
      clientCode: "ع.م.ت",
      clientTitle: "مدير التوطين - شركة تجارة إلكترونية عالمية",
      industry: "التجارة الإلكترونية",
      location: "الرياض، السعودية",
      projectDate: "يناير 2024",
      challenge: "شركة تجارة إلكترونية عالمية تضم أكثر من 50 مليون منتج أرادت دخول السوق السعودية. التحدي كان في توطين واجهة المستخدم، أوصاف المنتجات، نظام الدفع، وسياسات الإرجاع لتتماشى مع القوانين المحلية والثقافة السعودية.",
      solution: "فريق متعدد التخصصات من 12 خبيراً شمل مترجمين، مطورين، ومستشارين قانونيين. قمنا بتوطين أكثر من 3.2 مليون كلمة، تكييف 15,000 صفحة منتج، وإعداد نظام دفع متوافق مع البنوك السعودية.",
      results: [
        "زيادة معدل التحويل بنسبة 420% في الشهر الأول",
        "وصول إلى 2.8 مليون مستخدم سعودي في 6 أشهر", 
        "تحقيق رضا العملاء بنسبة 97.3% حسب تقييمات المتجر",
        "توفير 12 شهراً من الوقت المخطط له للمشروع",
        "زيادة قيمة المبيعات الشهرية إلى 85 مليون ريال"
      ],
      duration: "5 أشهر",
      budget: "3.2 مليون ريال",
      wordsCount: "3.2 مليون كلمة",
      languages: ["العربية السعودية", "الإنجليزية"],
      rating: 5,
      testimonial: "لم أتوقع هذا المستوى من الاحترافية والفهم العميق لثقافتنا المحلية. فريق MasterEduPath لم يكتفِ بالترجمة، بل قدم حلولاً إبداعية جعلت منتجنا يبدو كأنه مُصمم خصيصاً للسوق السعودية.",
      featured: true,
      category: "تجاري",
      tags: ["توطين", "تجارة إلكترونية", "تقنية", "قانوني"],
      metrics: {
        roi: "340%",
        users: "2.8M",
        conversion: "+420%",
        satisfaction: "97.3%"
      }
    },
    {
      id: 2,
      title: "ترجمة وثائق اندماج شركات دولية بقيمة 2.5 مليار دولار",
      clientCode: "د.ا.م",
      clientTitle: "المستشار القانوني الأول - مجموعة استثمارية دولية",
      industry: "الاستثمار والقانون",
      location: "دبي، الإمارات",
      projectDate: "مارس 2024",
      challenge: "عملية اندماج معقدة بين 3 شركات دولية تتطلب ترجمة أكثر من 850 وثيقة قانونية ومالية من 5 لغات مختلفة، مع ضمان الدقة القانونية الكاملة وضيق الوقت (45 يوم فقط).",
      solution: "تشكيل فريق طوارئ من 25 متخصص: محامين مترجمين، خبراء ماليين، ومحررين قانونيين. العمل على مدار الساعة بنظام ورديات، مع استخدام تقنيات الذكاء الاصطناعي للمساعدة والتدقيق المستمر.",
      results: [
        "إنجاز المشروع قبل الموعد المحدد بـ 8 أيام",
        "دقة قانونية 100% - لم تُسجل أي أخطاء أو تعديلات",
        "توفير 2.8 مليون دولار مقارنة بالمكاتب القانونية الدولية",
        "إتمام الصفقة بنجاح بقيمة 2.5 مليار دولار"
      ],
      duration: "37 يوم (من أصل 45)",
      budget: "1.8 مليون ريال",
      wordsCount: "1.4 مليون كلمة",
      languages: ["العربية", "الإنجليزية", "الفرنسية", "الألمانية", "الصينية"],
      rating: 5,
      testimonial: "في 20 سنة من خبرتي في القانون التجاري، لم أر فريقاً يعمل بهذه الكفاءة تحت ضغط الوقت. الدقة القانونية والسرعة في التنفيذ كانت استثنائية.",
      featured: true,
      category: "قانوني",
      tags: ["اندماج", "قانون تجاري", "وثائق مالية", "ترجمة فورية"],
      metrics: {
        dealValue: "$2.5B",
        accuracy: "100%",
        timeSaved: "8 أيام",
        costSaving: "$2.8M"
      }
    },
    {
      id: 3,
      title: "توطين نظام إدارة مستشفيات ذكي للقطاع الصحي السعودي",
      clientCode: "م.ص.ا",
      clientTitle: "مدير تقنية المعلومات - مجموعة مستشفيات رائدة",
      industry: "التكنولوجيا الطبية",
      location: "جدة، السعودية", 
      projectDate: "فبراير 2024",
      challenge: "نظام إدارة مستشفيات متقدم يخدم أكثر من 15 مستشفى يحتاج توطين شامل يتضمن المصطلحات الطبية، الأدوية، الإجراءات، وتكامل مع أنظمة وزارة الصحة السعودية والتأمين الصحي.",
      solution: "فريق متخصص من الأطباء المترجمين، صيادلة، ومطورين تقنيين. تم إنشاء قاموس طبي موحد يضم 45,000 مصطلح طبي، وتطوير واجهات مخصصة للأطباء والممرضين العرب.",
      results: [
        "تدريب 2,400 عامل في القطاع الطبي بنجاح",
        "تقليل أخطاء إدخال البيانات الطبية بنسبة 89%",
        "زيادة كفاءة التشغيل في المستشفيات بنسبة 67%",
        "حصول على شهادة اعتماد من وزارة الصحة السعودية"
      ],
      duration: "4 أشهر",
      budget: "2.1 مليون ريال", 
      wordsCount: "2.8 مليون كلمة",
      languages: ["العربية الطبية", "الإنجليزية الطبية"],
      rating: 5,
      testimonial: "الخبرة الطبية لفريق MasterEduPath واضحة في كل تفصيل. فهموا احتياجاتنا الطبية وقدموا حلولاً تقنية تتكامل مع بيئة العمل في المستشفيات السعودية.",
      featured: false,
      category: "طبي",
      tags: ["أنظمة طبية", "مستشفيات", "صحة رقمية", "وزارة الصحة"],
      metrics: {
        hospitals: "15",
        staff: "2,400",
        accuracy: "+89%", 
        efficiency: "+67%"
      }
    }
  ];

  const statistics = [
    {
      number: "2,100+",
      label: "مشروع مكتمل بنجاح",
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: "مشاريع متنوعة في جميع القطاعات"
    },
    {
      number: "99.2%",
      label: "معدل رضا العملاء",
      icon: Star,
      color: "text-green-600", 
      bgColor: "bg-green-50",
      description: "حسب استطلاعات مستقلة"
    },
    {
      number: "127M+",
      label: "كلمة مترجمة",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50", 
      description: "بأعلى معايير الجودة"
    },
    {
      number: "850+",
      label: "عميل راض ومستمر",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "في 47 دولة حول العالم"
    },
    {
      number: "15.8B",
      label: "قيمة المشاريع (ريال)",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "إجمالي قيم المشاريع"
    },
    {
      number: "72hr",
      label: "زمن الاستجابة",
      icon: Clock,
      color: "text-orange-600", 
      bgColor: "bg-orange-50",
      description: "للمشاريع العاجلة"
    }
  ];

  const categories = [
    { label: "الكل", value: "all", count: successStories.length },
    { label: "تجاري", value: "تجاري", count: 1 },
    { label: "قانوني", value: "قانوني", count: 1 },
    { label: "طبي", value: "طبي", count: 1 }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const filteredStories = selectedCategory === "all" 
    ? successStories 
    : successStories.filter(story => story.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-r from-primary via-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-purple-600/10 opacity-30"></div>
          <div className="absolute top-5 md:top-10 right-5 md:right-10 w-16 h-16 md:w-32 md:h-32 bg-white/10 rounded-full animate-float blur-xl"></div>
          <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-12 h-12 md:w-24 md:h-24 bg-white/10 rounded-full animate-float blur-xl" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-2xl"
            >
              <Trophy className="h-8 w-8 md:h-10 md:w-10 text-white drop-shadow-lg" />
            </motion.div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 font-arabic-title leading-tight">
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                قصص نجاح حقيقية
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl opacity-95 mb-6 md:mb-8 leading-relaxed px-4">
              شاهد كيف غيّرنا مسار الأعمال وحققنا نتائج استثنائية لعملائنا في جميع أنحاء المنطقة
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
              <Button size="lg" className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 font-semibold w-full sm:w-auto shadow-xl">
                <Award className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                شارك قصة نجاحك
              </Button>
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 w-full sm:w-auto backdrop-blur-sm">
                <Phone className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                استشارة مجانية
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 md:py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 font-arabic-title">إنجازاتنا بالأرقام</h2>
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
              أرقام حقيقية تعكس التزامنا بتحقيق النتائج الاستثنائية لعملائنا
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 300
                }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ${stat.bgColor} h-full`}>
                  <CardContent className="pt-4 md:pt-6 pb-4 md:pb-6 text-center">
                    <stat.icon className={`h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 md:mb-3 ${stat.color} group-hover:scale-110 transition-transform`} />
                    <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">{stat.number}</h3>
                    <p className="text-slate-700 font-medium text-xs md:text-sm mb-1">{stat.label}</p>
                    <p className="text-xs text-slate-500 hidden lg:block leading-relaxed">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 md:py-8 bg-gradient-to-r from-slate-100 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 md:gap-4"
          >
            {categories.map((category) => (
              <motion.button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                  selectedCategory === category.value
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {category.label} ({category.count})
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-arabic-title">
              قصص نجاح موثقة ومؤكدة
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              كل قصة تحكي رحلة حقيقية من التحدي إلى النجاح، مع عملاء حقيقيين وأرقام موثقة
            </p>
          </motion.div>

          <div className="space-y-8 md:space-y-12">
            {filteredStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
              >
                <Card className={`overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-0 ${
                  story.featured ? 'ring-2 ring-primary/30 bg-gradient-to-br from-white to-blue-50/30' : 'bg-white'
                }`}>
                  {/* Featured Badge */}
                  {story.featured && (
                    <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-semibold">قصة نجاح مميزة</span>
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                    </div>
                  )}

                  <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 p-4 md:p-6 lg:p-8">
                      <CardHeader className="px-0 pt-0 pb-4 md:pb-6">
                        <div className="space-y-4 md:space-y-6">
                          {/* Header Info */}
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className={`${
                                  story.category === 'تجاري' ? 'bg-blue-100 text-blue-800' :
                                  story.category === 'قانوني' ? 'bg-red-100 text-red-800' :
                                  story.category === 'طبي' ? 'bg-green-100 text-green-800' :
                                  'bg-purple-100 text-purple-800'
                                } hover:opacity-80 transition-opacity`}>
                                  <Building2 className="w-3 h-3 ml-1" />
                                  {story.industry}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  <Calendar className="w-3 h-3 ml-1" />
                                  {story.projectDate}
                                </Badge>
                              </div>
                              
                              <CardTitle className="text-xl md:text-2xl lg:text-3xl leading-tight font-arabic-title">
                                {story.title}
                              </CardTitle>
                              
                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-primary" />
                                  {story.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Briefcase className="h-4 w-4 text-primary" />
                                  {story.clientCode}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex sm:flex-col items-center sm:items-end gap-2">
                              <div className="flex text-yellow-500">
                                {[...Array(story.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                                ))}
                              </div>
                              <span className="text-xs text-slate-500">تقييم العميل</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="px-0 space-y-6 md:space-y-8">
                        {/* Challenge */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.6 }}
                          viewport={{ once: true }}
                        >
                          <h4 className="font-bold text-lg md:text-xl mb-3 flex items-center gap-2 text-red-600">
                            <Target className="h-5 w-5 md:h-6 md:w-6" />
                            التحدي والمشكلة
                          </h4>
                          <div className="bg-red-50 border-r-4 border-red-500 p-4 md:p-6 rounded-lg">
                            <p className="text-slate-800 leading-relaxed text-sm md:text-base">{story.challenge}</p>
                          </div>
                        </motion.div>

                        {/* Solution */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                          viewport={{ once: true }}
                        >
                          <h4 className="font-bold text-lg md:text-xl mb-3 flex items-center gap-2 text-blue-600">
                            <CheckCircle className="h-5 w-5 md:h-6 md:w-6" />
                            الحل والاستراتيجية
                          </h4>
                          <div className="bg-blue-50 border-r-4 border-blue-500 p-4 md:p-6 rounded-lg">
                            <p className="text-slate-800 leading-relaxed text-sm md:text-base">{story.solution}</p>
                          </div>
                        </motion.div>

                        {/* Results */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6, duration: 0.6 }}
                          viewport={{ once: true }}
                        >
                          <h4 className="font-bold text-lg md:text-xl mb-4 flex items-center gap-2 text-green-600">
                            <Trophy className="h-5 w-5 md:h-6 md:w-6" />
                            النتائج والإنجازات المحققة
                          </h4>
                          <div className="bg-green-50 border-r-4 border-green-500 p-4 md:p-6 rounded-lg">
                            <div className="space-y-3">
                              {story.results.map((result, idx) => (
                                <motion.div 
                                  key={idx} 
                                  className="flex items-start gap-3 group hover:bg-white p-2 md:p-3 rounded-lg transition-colors"
                                  whileHover={{ x: 5 }}
                                  initial={{ opacity: 0, y: 10 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 * idx, duration: 0.4 }}
                                  viewport={{ once: true }}
                                >
                                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-slate-800 text-sm md:text-base leading-relaxed font-medium">{result}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>

                        {/* Key Metrics */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                          viewport={{ once: true }}
                        >
                          <h4 className="font-bold text-lg md:text-xl mb-4 flex items-center gap-2 text-purple-600">
                            <TrendingUp className="h-5 w-5 md:h-6 md:w-6" />
                            المؤشرات الرئيسية
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                            {Object.entries(story.metrics).map(([key, value], idx) => (
                              <motion.div
                                key={key}
                                className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 md:p-4 rounded-lg text-center border border-purple-100 hover:border-purple-200 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx, duration: 0.4 }}
                                viewport={{ once: true }}
                              >
                                <div className="text-lg md:text-xl font-bold text-purple-600">{value}</div>
                                <div className="text-xs text-slate-600 mt-1 capitalize">{key}</div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Testimonial */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1, duration: 0.6 }}
                          viewport={{ once: true }}
                          className="relative"
                        >
                          <div className="bg-gradient-to-r from-slate-100 to-blue-50 p-6 md:p-8 rounded-xl border border-slate-200 relative">
                            <Quote className="h-8 w-8 md:h-10 md:w-10 text-primary/30 absolute top-4 right-4" />
                            <div className="relative z-10">
                              <p className="text-slate-800 italic leading-relaxed mb-4 md:mb-6 text-sm md:text-base pr-8 md:pr-12">
                                &ldquo;{story.testimonial}&rdquo;
                              </p>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-primary text-sm md:text-base">{story.clientCode}</p>
                                  <p className="text-xs md:text-sm text-slate-600">{story.clientTitle}</p>
                                </div>
                                <motion.button
                                  onClick={() => toggleDetails(story.id)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
                                >
                                  {showDetails[story.id] ? (
                                    <>
                                      <EyeOff className="h-4 w-4" />
                                      إخفاء التفاصيل
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="h-4 w-4" />
                                      عرض التفاصيل
                                    </>
                                  )}
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Extended Details */}
                        {showDetails[story.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="bg-slate-50 p-6 rounded-xl border-2 border-dashed border-slate-200">
                              <h5 className="font-bold mb-4 text-slate-800">تفاصيل إضافية محمية</h5>
                              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">الميزانية:</span> {story.budget}
                                </div>
                                <div>
                                  <span className="font-medium">الكلمات المترجمة:</span> {story.wordsCount}
                                </div>
                                <div className="sm:col-span-2">
                                  <span className="font-medium">الوسوم:</span> {story.tags.join(" • ")}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 lg:p-8">
                      <div className="space-y-6 md:space-y-8 sticky top-4">
                        {/* Project Info */}
                        <div className="text-center space-y-4 md:space-y-6">
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xl"
                          >
                            <Building2 className="h-6 w-6 md:h-8 md:w-8 text-white" />
                          </motion.div>
                          
                          <div>
                            <h5 className="font-bold text-primary text-lg md:text-xl">{story.clientCode}</h5>
                            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{story.clientTitle}</p>
                          </div>
                        </div>

                        {/* Project Details */}
                        <div className="space-y-4">
                          {[
                            { icon: Clock, label: "مدة المشروع", value: story.duration, color: "text-orange-500" },
                            { icon: Globe, label: "اللغات", value: story.languages.length, color: "text-blue-500" },
                            { icon: FileText, label: "حجم المحتوى", value: story.wordsCount, color: "text-green-500" }
                          ].map((detail, idx) => (
                            <motion.div
                              key={detail.label}
                              className="text-center p-3 md:p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-slate-100"
                              whileHover={{ y: -2, scale: 1.02 }}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * idx, duration: 0.4 }}
                              viewport={{ once: true }}
                            >
                              <detail.icon className={`h-4 w-4 md:h-5 md:w-5 ${detail.color} mx-auto mb-2`} />
                              <p className="text-xs md:text-sm font-medium text-slate-600 mb-1">{detail.label}</p>
                              <p className="text-sm md:text-lg font-bold text-slate-800">{detail.value}</p>
                            </motion.div>
                          ))}
                        </div>

                        {/* Languages */}
                        <div>
                          <h6 className="font-semibold mb-3 text-slate-700 text-sm md:text-base">اللغات المستخدمة</h6>
                          <div className="flex flex-wrap gap-2">
                            {story.languages.map((lang, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs bg-white hover:bg-slate-50">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="space-y-3">
                          <Button className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all text-sm md:text-base">
                            مشروع مشابه
                            <ArrowLeft className="ml-2 h-4 w-4" />
                          </Button>
                          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all text-sm md:text-base">
                            <Phone className="ml-2 h-4 w-4" />
                            استشارة مجانية
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12 md:mt-16"
          >
            <Card className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white border-0 shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid2\" width=\"40\" height=\"40\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 40 0 L 0 0 0 40\" fill=\"none\" stroke=\"white\" stroke-width=\"1\" opacity=\"0.1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid2)\" /%3E%3C/svg%3E')] opacity-30"></div>
              <CardContent className="py-8 md:py-16 relative z-10">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Trophy className="h-12 w-12 md:h-20 md:w-20 mx-auto mb-4 md:mb-8 opacity-90 drop-shadow-lg" />
                </motion.div>
                
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 font-arabic-title">
                  هل أنت مستعد لكتابة قصة نجاحك القادمة؟
                </h3>
                <p className="text-lg md:text-xl lg:text-2xl opacity-95 mb-6 md:mb-10 max-w-3xl mx-auto leading-relaxed">
                  دعنا نحول تحدياتك إلى إنجازات وأهدافك إلى قصص نجاح ملهمة
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center max-w-md mx-auto">
                  <Button size="lg" className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 font-semibold shadow-xl">
                    <Award className="ml-2 h-5 w-5" />
                    ابدأ مشروعك الآن
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 backdrop-blur-sm">
                    <Mail className="ml-2 h-5 w-5" />
                    احصل على عرض مجاني
                  </Button>
                </div>
                
                <motion.p 
                  className="text-sm opacity-80 mt-6"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✨ استشارة أولية مجانية - لا توجد التزامات
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SuccessStories;