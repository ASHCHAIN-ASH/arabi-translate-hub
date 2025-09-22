import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Building2, 
  GraduationCap, 
  Globe, 
  Users, 
  Award, 
  BookOpen,
  Star,
  CheckCircle
} from "lucide-react";

const AcademicPartnerships = () => {
  const globalPartners = [
    {
      name: "جامعة هارفارد",
      nameEn: "Harvard University",
      country: "الولايات المتحدة",
      type: "جامعة بحثية",
      specialty: "الطب والأعمال",
      logo: "🎓",
      rating: 5,
      students: "23,000+"
    },
    {
      name: "جامعة أكسفورد",
      nameEn: "Oxford University", 
      country: "المملكة المتحدة",
      type: "جامعة عريقة",
      specialty: "الآداب والعلوم",
      logo: "🏛️",
      rating: 5,
      students: "24,000+"
    },
    {
      name: "معهد MIT",
      nameEn: "Massachusetts Institute of Technology",
      country: "الولايات المتحدة", 
      type: "معهد تقني",
      specialty: "الهندسة والتكنولوجيا",
      logo: "🔬",
      rating: 5,
      students: "11,000+"
    },
    {
      name: "جامعة كامبريدج",
      nameEn: "Cambridge University",
      country: "المملكة المتحدة",
      type: "جامعة بحثية",
      specialty: "العلوم والرياضيات",
      logo: "📚",
      rating: 5,
      students: "24,000+"
    },
    {
      name: "جامعة ستانفورد",
      nameEn: "Stanford University",
      country: "الولايات المتحدة",
      type: "جامعة خاصة",
      specialty: "التكنولوجيا والأعمال",
      logo: "🌟",
      rating: 5,
      students: "17,000+"
    },
    {
      name: "جامعة الملك سعود",
      nameEn: "King Saud University",
      country: "المملكة العربية السعودية",
      type: "جامعة حكومية",
      specialty: "الطب والهندسة",
      logo: "🏛️",
      rating: 4.8,
      students: "65,000+"
    }
  ];

  const stats = [
    {
      number: "500+",
      label: "جامعة شريكة",
      icon: Building2,
      color: "text-blue-600"
    },
    {
      number: "50+",
      label: "دولة حول العالم",
      icon: Globe,
      color: "text-green-600"
    },
    {
      number: "100,000+",
      label: "طالب استفاد",
      icon: Users,
      color: "text-purple-600"
    },
    {
      number: "25+",
      label: "سنة خبرة",
      icon: Award,
      color: "text-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      {/* خلفية ديناميكية */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* العنوان الرئيسي */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center"
            >
              <GraduationCap className="h-8 w-8 text-white" />
            </motion.div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-arabic-title font-bold text-foreground mb-6">
            شراكاتنا <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">الأكاديمية العالمية</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نفخر بشراكتنا مع أفضل الجامعات والمؤسسات الأكاديمية العالمية لتقديم خدمات تعليمية متميزة
          </p>
        </motion.div>

        {/* إحصائيات سريعة */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-soft hover:shadow-medium transition-all duration-300"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  <IconComponent className={`h-10 w-10 mx-auto mb-3 ${stat.color}`} />
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-1">{stat.number}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* شبكة الشركاء */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {globalPartners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group hover-lift bg-gradient-card border-0 shadow-soft hover:shadow-strong transition-all duration-300 overflow-hidden">
                <CardContent className="p-6">
                  {/* شعار وتقييم */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl mb-2">{partner.logo}</div>
                    <div className="flex items-center gap-1">
                      {[...Array(Math.floor(partner.rating))].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-sm text-muted-foreground mr-1">{partner.rating}</span>
                    </div>
                  </div>

                  {/* اسم الجامعة */}
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 font-english">
                    {partner.nameEn}
                  </p>

                  {/* معلومات الجامعة */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 text-blue-500 ml-2" />
                      <span className="text-muted-foreground">{partner.country}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Building2 className="h-4 w-4 text-green-500 ml-2" />
                      <span className="text-muted-foreground">{partner.type}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <BookOpen className="h-4 w-4 text-purple-500 ml-2" />
                      <span className="text-muted-foreground">{partner.specialty}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 text-orange-500 ml-2" />
                      <span className="text-muted-foreground">{partner.students} طالب</span>
                    </div>
                  </div>

                  {/* علامة الشراكة */}
                  <div className="flex items-center justify-center py-2 px-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">شريك معتمد</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* دعوة للعمل */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-primary text-primary-foreground border-0 shadow-strong">
            <CardContent className="p-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Award className="h-8 w-8 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-4">انضم إلى شبكتنا الأكاديمية</h3>
              <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                احصل على خدمات تعليمية متميزة مدعومة بشراكاتنا العالمية مع أفضل الجامعات والمؤسسات الأكاديمية
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-0 shadow-medium"
                >
                  تعرف على خدماتنا الأكاديمية
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  تواصل معنا
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default AcademicPartnerships;