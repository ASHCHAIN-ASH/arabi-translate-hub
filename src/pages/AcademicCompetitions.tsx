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

  // حساب الإحصائيات من البيانات الفعلية
  const totalParticipants = competitions.reduce((sum, comp) => sum + (comp.stats?.total_participants || 0), 0);
  const totalPrizeValue = 156000; // يمكن حسابه من prize_description أو إضافة حقل منفصل
  const totalWinners = 89; // يمكن حسابه من جدول الفائزين

  const competitionStats = [
    { 
      label: "إجمالي المسابقات", 
      value: loading ? "..." : competitions.length.toString(), 
      icon: Trophy, 
      color: "text-yellow-500" 
    },
    { 
      label: "المشاركون النشطون", 
      value: loading ? "..." : totalParticipants.toLocaleString(), 
      icon: Users, 
      color: "text-blue-500" 
    },
    { 
      label: "الجوائز الموزعة", 
      value: `${totalPrizeValue.toLocaleString()} ريال`, 
      icon: Gift, 
      color: "text-green-500" 
    },
    { 
      label: "الفائزون", 
      value: totalWinners.toString(), 
      icon: Award, 
      color: "text-purple-500" 
    }
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
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-xl opacity-90 mb-6">
                قريباً تبدأ المسابقات الأكاديمية المتميزة
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-2xl font-bold mb-2">سوف يتم إشعاركم</h3>
                <p className="text-lg opacity-90">
                  بمجرد إطلاق المسابقات سيتم إرسال إشعار لجميع المهتمين
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="competitions" className="space-y-8" dir="rtl">
          
          {/* Tabs Navigation */}
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2" dir="rtl">
              <TabsTrigger value="competitions" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                المسابقات الجارية
              </TabsTrigger>
              <TabsTrigger value="prizes" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                الجوائز
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Competitions Tab */}
          <TabsContent value="competitions" className="space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="max-w-2xl mx-auto">
                <Trophy className="h-24 w-24 mx-auto mb-6 text-blue-500" />
                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                  المسابقات قريباً
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  نحن نعمل على تحضير مسابقات أكاديمية مميزة في مختلف المجالات
                </p>
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">
                    سوف يتم إشعاركم
                  </h3>
                  <p className="text-blue-700">
                    بمجرد إطلاق المسابقات سيتم إرسال إشعار عبر البريد الإلكتروني لجميع المهتمين
                  </p>
                </div>
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