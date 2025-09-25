import { motion } from "framer-motion";
import { 
  Trophy, 
  Award, 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  Lightbulb, 
  Languages, 
  BookOpen, 
  Target, 
  Star, 
  Gift, 
  ChevronRight,
  Download,
  Upload,
  Medal,
  Crown,
  Zap,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";
import CompetitionCard from "@/components/CompetitionCard";
import CompetitionLeaderboard from "@/components/CompetitionLeaderboard";
import { useCompetitions } from "@/hooks/useCompetitions";

const AcademicCompetitions = () => {
  const { competitions, loading, fetchCompetition, registerParticipation } = useCompetitions();
  
  const handleRegister = async (competitionId: string) => {
    await registerParticipation(competitionId, 'user-temp-id');
  };

  const handleViewDetails = (competitionId: string) => {
    // Navigate to competition details
    window.location.href = `/academic-competitions/${competitionId}`;
  };

  const activeCompetitions = [
    {
      id: 1,
      title: "مسابقة البحث العلمي في الذكاء الاصطناعي",
      type: "research",
      category: "مسابقات بحثية",
      description: "قدم بحثًا مبتكرًا في مجال الذكاء الاصطناعي وتطبيقاته في التعليم",
      deadline: "2024-02-15",
      prize: "5,000 ريال + شهادة معتمدة + نشر البحث",
      participants: 156,
      status: "جارية",
      difficulty: "متقدم",
      duration: "30 يوم",
      requirements: ["بحث أصلي غير منشور", "2000-3000 كلمة", "مراجع علمية موثقة"],
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      id: 2,
      title: "تحدي الحالة الدراسية: شركة ناشئة في السعودية",
      type: "case-study",
      category: "مسابقات مهارات عملية",
      description: "حل مشكلة تسويقية حقيقية لشركة ناشئة وضع استراتيجية شاملة",
      deadline: "2024-02-10",
      prize: "3,000 ريال + استشارة مجانية",
      participants: 89,
      status: "جارية",
      difficulty: "متوسط",
      duration: "15 يوم",
      requirements: ["عرض تقديمي", "خطة تنفيذية", "تحليل السوق"],
      icon: Target,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      id: 3,
      title: "اختبار المعرفة الأسبوعي - إدارة المشاريع",
      type: "quiz",
      category: "مسابقات أسئلة وأجوبة",
      description: "اختبار تفاعلي في إدارة المشاريع مع أسئلة متعددة الخيارات",
      deadline: "2024-01-28",
      prize: "1,000 ريال للفائز الأول",
      participants: 234,
      status: "جارية",
      difficulty: "مبتدئ",
      duration: "30 دقيقة",
      requirements: ["إجابة سريعة ودقيقة", "تسجيل مسبق"],
      icon: Zap,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    },
    {
      id: 4,
      title: "مسابقة المقال الأكاديمي - مستقبل التعليم",
      type: "writing",
      category: "مسابقات الكتابة الأكاديمية",
      description: "اكتب مقالًا علميًا عن مستقبل التعليم الرقمي في المملكة",
      deadline: "2024-02-20",
      prize: "نشر المقال + 2,000 ريال",
      participants: 67,
      status: "قريبًا",
      difficulty: "متوسط",
      duration: "20 يوم",
      requirements: ["500-1000 كلمة", "منهجية علمية", "مراجع موثقة"],
      icon: BookOpen,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      id: 5,
      title: "تحدي الترجمة الطبية",
      type: "translation",
      category: "مسابقات الترجمة",
      description: "ترجمة نصوص طبية متخصصة من الإنجليزية إلى العربية",
      deadline: "2024-02-12",
      prize: "4,000 ريال + دورة ترجمة مجانية",
      participants: 123,
      status: "جارية",
      difficulty: "متقدم",
      duration: "10 أيام",
      requirements: ["خبرة في الترجمة الطبية", "دقة عالية", "التزام بالمصطلحات"],
      icon: Languages,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50"
    },
    {
      id: 6,
      title: "مسابقة الابتكار التعليمي",
      type: "innovation",
      category: "مسابقات الابتكار",
      description: "اقترح حلولًا مبتكرة لتطوير التعليم عن بُعد",
      deadline: "2024-03-01",
      prize: "10,000 ريال + دعم تنفيذ الفكرة",
      participants: 45,
      status: "قريبًا",
      difficulty: "متقدم",
      duration: "45 يوم",
      requirements: ["فكرة أصلية", "خطة تنفيذية", "نموذج أولي"],
      icon: Lightbulb,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    }
  ];

  const winners = [
    {
      name: "د. أحمد محمد الأحمدي",
      competition: "مسابقة البحث العلمي في الأمن السيبراني",
      prize: "المركز الأول - 8,000 ريال",
      image: "/api/placeholder/60/60",
      achievement: "بحث مبتكر في حماية البيانات"
    },
    {
      name: "سارة عبدالله القرشي", 
      competition: "تحدي الترجمة الأدبية",
      prize: "المركز الأول - 5,000 ريال",
      image: "/api/placeholder/60/60",
      achievement: "ترجمة متميزة لنص أدبي معاصر"
    },
    {
      name: "محمد علي الشهراني",
      competition: "مسابقة الابتكار التقني",
      prize: "المركز الثاني - 6,000 ريال",
      image: "/api/placeholder/60/60", 
      achievement: "تطبيق ذكي لإدارة المشاريع"
    }
  ];

  const competitionStats = [
    { label: "إجمالي المسابقات", value: "24", icon: Trophy, color: "text-yellow-500" },
    { label: "المشاركون النشطون", value: "1,247", icon: Users, color: "text-blue-500" },
    { label: "الجوائز الموزعة", value: "156,000 ريال", icon: Gift, color: "text-green-500" },
    { label: "الفائزون", value: "89", icon: Award, color: "text-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" dir="rtl">
      
      {/* Working Hours Banner */}
      <WorkingHoursBannerRTL />
      
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-blue-600 to-purple-700 overflow-hidden">
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
              <Trophy className="h-10 w-10 text-yellow-300" />
            </div>
            <h1 className="text-5xl font-bold mb-6 font-arabic-title">
              المسابقات الأكاديمية
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              شارك في المسابقات الأكاديمية المتنوعة واحصل على جوائز قيمة وشهادات معتمدة وانشر إنجازاتك العلمية
            </p>
            
            {/* Competition Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {competitionStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20"
                >
                  <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="active" className="space-y-8">
          
          {/* Tabs Navigation */}
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                المسابقات الجارية
              </TabsTrigger>
              <TabsTrigger value="winners" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                الفائزون
              </TabsTrigger>
              <TabsTrigger value="prizes" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                الجوائز
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Active Competitions */}
          <TabsContent value="active" className="space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                المسابقات المتاحة حاليًا
              </h2>
              
              <div className="grid gap-6 md:gap-8">
                {activeCompetitions.map((competition, index) => (
                  <motion.div
                    key={competition.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border-r-4 border-r-primary">
                      <div className="md:flex">
                        
                        {/* Competition Icon & Status */}
                        <div className="md:w-1/6 flex md:flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-white">
                          <div className={`w-16 h-16 rounded-full ${competition.bgColor} flex items-center justify-center mb-4`}>
                            <competition.icon className={`h-8 w-8 ${competition.color}`} />
                          </div>
                          <Badge 
                            variant={competition.status === 'جارية' ? 'default' : 'secondary'}
                            className="whitespace-nowrap"
                          >
                            {competition.status}
                          </Badge>
                        </div>

                        {/* Main Content */}
                        <CardContent className="md:w-5/6 p-6">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            
                            {/* Competition Details */}
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Badge variant="outline" className="text-xs">
                                  {competition.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {competition.difficulty}
                                </Badge>
                              </div>
                              
                              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                {competition.title}
                              </h3>
                              
                              <p className="text-gray-600 mb-4 leading-relaxed">
                                {competition.description}
                              </p>

                              {/* Competition Info Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  <span>ينتهي: {new Date(competition.deadline).toLocaleDateString('ar-SA')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="h-4 w-4 text-primary" />
                                  <span>المدة: {competition.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Users className="h-4 w-4 text-primary" />
                                  <span>{competition.participants} مشارك</span>
                                </div>
                              </div>

                              {/* Requirements */}
                              <div className="mb-4">
                                <h4 className="font-semibold mb-2 text-gray-800">متطلبات المشاركة:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {competition.requirements.map((req, idx) => (
                                    <div key={idx} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      {req}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Prize */}
                              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                                <Gift className="h-5 w-5 text-yellow-600" />
                                <span className="font-semibold text-yellow-800">الجائزة: {competition.prize}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 md:w-48">
                              <Button className="w-full group" size="lg">
                                <Upload className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
                                شارك الآن
                              </Button>
                              <Button variant="outline" className="w-full group">
                                <FileText className="ml-2 h-4 w-4" />
                                تفاصيل أكثر
                                <ChevronRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                              <Button variant="ghost" size="sm" className="w-full">
                                <Download className="ml-2 h-4 w-4" />
                                تحميل الشروط
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Winners Section */}
          <TabsContent value="winners" className="space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                قاعة الشرف - الفائزون
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {winners.map((winner, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <CardContent className="p-6 text-center">
                        <div className="relative mb-4">
                          <img 
                            src={winner.image} 
                            alt={winner.name}
                            className="w-20 h-20 rounded-full mx-auto border-4 border-yellow-300"
                          />
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Crown className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {winner.name}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-2">{winner.competition}</p>
                        
                        <Badge className="mb-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                          {winner.prize}
                        </Badge>
                        
                        <p className="text-xs text-gray-500 italic">{winner.achievement}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* More Winners Button */}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg" className="group">
                  عرض جميع الفائزين
                  <ArrowRight className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* Prizes & Benefits */}
          <TabsContent value="prizes" className="space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                الجوائز والمنافع
              </h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                
                {/* Material Prizes */}
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-6 w-6 text-yellow-500" />
                      جوائز مادية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>جوائز نقدية تصل إلى 10,000 ريال</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>كوبونات خصم على الدورات</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>هدايا تعليمية قيمة</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Academic Benefits */}
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Medal className="h-6 w-6 text-blue-500" />
                      منافع أكاديمية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-blue-500" />
                      <span>شهادات معتمدة مع رمز تحقق</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-blue-500" />
                      <span>نشر الأعمال المتميزة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-blue-500" />
                      <span>استشارات أكاديمية مجانية</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Career Benefits */}
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-6 w-6 text-green-500" />
                      منافع مهنية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-green-500" />
                      <span>نشر على LinkedIn والموقع</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-green-500" />
                      <span>شبكة تواصل مع الخبراء</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-green-500" />
                      <span>فرص تدريب وعمل</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Special Offers */}
              <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-lg border border-primary/20">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4 text-primary">عروض خاصة للمشاركين</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-sm">
                      <Gift className="h-5 w-5 text-primary" />
                      <span>خصم 50% على دورات الترجمة للمشاركين</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-sm">
                      <Award className="h-5 w-5 text-primary" />
                      <span>عضوية مميزة لمدة سنة للفائزين</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center p-8 bg-gradient-to-br from-primary via-blue-600 to-purple-700 rounded-2xl text-white"
        >
          <Trophy className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
          <h3 className="text-3xl font-bold mb-4">ابدأ رحلتك نحو التميز الأكاديمي</h3>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            انضم إلى مجتمع المتميزين وشارك في المسابقات الأكاديمية لتطوير مهاراتك والحصول على جوائز قيمة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Trophy className="ml-2 h-5 w-5" />
              ابدأ المشاركة الآن
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              تواصل معنا للاستفسار
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AcademicCompetitions;