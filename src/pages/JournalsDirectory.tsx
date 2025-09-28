import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, BookOpen, Globe, Award, Star, Users, TrendingUp,
  FileText, Calendar, Eye, Target, Check, ChevronLeft, Zap, Diamond,
  Crown, Shield, Microscope, Stethoscope, Calculator, Scale, Heart,
  Building2, Factory, Car, Plane, Computer, Network, Database, Code, Phone
} from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

// Journal card component with performance optimizations
const JournalCard = memo(({ journal, index }: { journal: any, index: number }) => {
  const IconComponent = journal.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="h-full group"
    >
      <Card className="h-full border-0 bg-gradient-to-br from-white/95 via-white to-gray-50/30 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu overflow-hidden relative">
        {/* Color accent bar */}
        <div 
          className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r opacity-80"
          style={{ backgroundColor: journal.color }}
        />
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-16 h-16 rounded-full border border-gray-100/50 opacity-30 group-hover:opacity-50 transition-opacity" />
        <div className="absolute bottom-4 left-4 w-10 h-10 rounded-full border border-gray-100/50 opacity-20 group-hover:opacity-40 transition-opacity" />

        <CardContent className="p-6 relative z-10">
          <div className="space-y-4">
            {/* Journal Icon and Title */}
            <div className="flex items-start gap-4">
              <motion.div 
                className="relative w-16 h-16 flex-shrink-0"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 rounded-xl bg-white shadow-lg group-hover:shadow-xl transition-shadow" />
                <div className="absolute inset-2 rounded-xl bg-white shadow-inner flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: `${journal.color}15` }}>
                  <IconComponent 
                    className="w-8 h-8 transition-all duration-300"
                    style={{ color: journal.color }}
                  />
                </div>
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"
                  style={{ backgroundColor: journal.color }}
                />
              </motion.div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-800 leading-tight line-clamp-2 mb-2">
                  {journal.nameAr}
                </h3>
                <p className="text-sm text-gray-600 font-medium line-clamp-2 mb-2">
                  {journal.nameEn}
                </p>
                
                {/* Impact Factor and Ratings */}
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {journal.impactFactor && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      IF: {journal.impactFactor}
                    </Badge>
                  )}
                  {journal.quartile && (
                    <Badge 
                      variant="outline" 
                      className="text-xs px-2 py-1"
                      style={{ 
                        color: journal.color,
                        backgroundColor: `${journal.color}15`,
                        borderColor: `${journal.color}30`
                      }}
                    >
                      {journal.quartile}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Journal Details */}
            <div className="space-y-3">
              {/* Publisher and ISSN */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  <span>{journal.publisher}</span>
                </div>
                {journal.issn && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-xs">{journal.issn}</span>
                  </>
                )}
              </div>

              {/* Journal Metrics */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {journal.citescore && (
                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3 text-blue-500" />
                    <span className="text-gray-600">CiteScore: <span className="font-semibold text-blue-600">{journal.citescore}</span></span>
                  </div>
                )}
                {journal.sjr && (
                  <div className="flex items-center gap-2">
                    <Award className="h-3 w-3 text-purple-500" />
                    <span className="text-gray-600">SJR: <span className="font-semibold text-purple-600">{journal.sjr}</span></span>
                  </div>
                )}
              </div>

              {/* Subject Areas */}
              {journal.subjects && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                    <Target className="h-3 w-3" />
                    <span>المجالات المتخصصة</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {journal.subjects.slice(0, 3).map((subject: string, idx: number) => (
                      <Badge 
                        key={idx}
                        variant="outline" 
                        className="text-xs px-2 py-1 bg-gray-50/50 border-gray-200 hover:bg-gray-100/50 transition-colors"
                      >
                        {subject}
                      </Badge>
                    ))}
                    {journal.subjects.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50/50">
                        +{journal.subjects.length - 3} أخرى
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Features */}
              {journal.features && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                    <Check className="h-3 w-3" />
                    <span>المميزات</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {journal.features.slice(0, 2).map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <Check className="h-2 w-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  size="sm"
                  className="w-full text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                  style={{ 
                    background: `linear-gradient(135deg, ${journal.color}, ${journal.color}CC)`,
                  }}
                >
                  <a 
                    href={journal.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 relative z-10"
                  >
                    <ExternalLink className="h-3 w-3" />
                    زيارة المجلة
                    <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300 skew-x-12" />
                  </a>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="px-3 border-2 hover:bg-primary/5"
                  style={{ borderColor: journal.color }}
                >
                  <Link to="/order-now" className="flex items-center gap-1">
                    <span className="text-xs">اطلب النشر</span>
                    <ChevronLeft className="h-3 w-3" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Section Header Component
const SectionHeader = ({ title, description, icon: Icon, color }: { title: string, description: string, icon: any, color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-12"
  >
    <div className="flex items-center justify-center gap-3 mb-4">
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
    </div>
    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">{description}</p>
  </motion.div>
);

const JournalsDirectory = () => {
  // Arabic/Regional Journals
  const arabicJournals = [
    {
      nameAr: "المجلة العربية للبحوث التربوية",
      nameEn: "Arab Journal of Educational Research",
      icon: BookOpen,
      website: "https://ajer.org.sa",
      publisher: "الجمعية السعودية للعلوم التربوية",
      issn: "2357-0407",
      impactFactor: "1.25",
      quartile: "Q2",
      citescore: "2.1",
      sjr: "0.45",
      color: "#2563EB",
      subjects: ["التربية", "علم النفس التربوي", "تقنيات التعليم", "المناهج", "الإدارة التربوية"],
      features: ["محكمة دولياً", "النشر المفتوح", "سرعة التحكيم"]
    },
    {
      nameAr: "المجلة السعودية للعلوم الطبية",
      nameEn: "Saudi Medical Journal",
      icon: Stethoscope,
      website: "https://smj.org.sa",
      publisher: "الجمعية السعودية الطبية",
      issn: "0379-5284",
      impactFactor: "2.45",
      quartile: "Q1",
      citescore: "3.2",
      sjr: "0.78",
      color: "#DC2626",
      subjects: ["الطب العام", "الطب الباطني", "الجراحة", "طب الأطفال", "النساء والولادة"],
      features: ["معتمدة ISI", "سرعة النشر", "تحكيم مزدوج"]
    },
    {
      nameAr: "مجلة جامعة الملك سعود للعلوم الهندسية",
      nameEn: "Journal of King Saud University - Engineering Sciences",
      icon: Factory,
      website: "https://jksues.org",
      publisher: "جامعة الملك سعود",
      issn: "1018-3639",
      impactFactor: "3.82",
      quartile: "Q1",
      citescore: "4.5",
      sjr: "1.12",
      color: "#7C3AED",
      subjects: ["الهندسة المدنية", "الهندسة الميكانيكية", "الهندسة الكهربائية", "الهندسة الكيميائية", "هندسة الحاسوب"],
      features: ["Scopus", "Web of Science", "النشر المفتوح"]
    },
    {
      nameAr: "المجلة العربية للعلوم الإدارية",
      nameEn: "Arab Journal of Administrative Sciences",
      icon: Building2,
      website: "https://ajas.ku.edu.kw",
      publisher: "جامعة الكويت",
      issn: "1029-855X",
      impactFactor: "1.65",
      quartile: "Q2",
      citescore: "2.8",
      sjr: "0.62",
      color: "#059669",
      subjects: ["إدارة الأعمال", "التسويق", "المحاسبة", "الموارد البشرية", "ريادة الأعمال"],
      features: ["محكمة عربياً", "تحكيم سريع", "نشر إلكتروني"]
    },
    {
      nameAr: "مجلة الدراسات الإسلامية",
      nameEn: "Journal of Islamic Studies",
      icon: BookOpen,
      website: "https://jis.org",
      publisher: "الجامعة الإسلامية بالمدينة المنورة",
      issn: "1658-6301",
      impactFactor: "0.85",
      quartile: "Q3",
      citescore: "1.4",
      color: "#16A34A",
      subjects: ["الدراسات الإسلامية", "الفقه", "العقيدة", "الحديث", "التفسير"],
      features: ["تحكيم شرعي", "نشر متعدد اللغات", "أرشيف رقمي"]
    },
    {
      nameAr: "المجلة العربية لعلوم الحاسوب",
      nameEn: "Arab Journal of Computer Science",
      icon: Computer,
      website: "https://ajcs.org",
      publisher: "الجمعية العربية لعلوم الحاسوب",
      issn: "2518-5985",
      impactFactor: "2.15",
      quartile: "Q2",
      citescore: "3.1",
      sjr: "0.89",
      color: "#3B82F6",
      subjects: ["علوم الحاسوب", "الذكاء الاصطناعي", "أمن المعلومات", "هندسة البرمجيات", "قواعد البيانات"],
      features: ["مفهرسة دولياً", "مراجعة سريعة", "النشر المفتوح"]
    }
  ];

  // International Journals
  const internationalJournals = [
    {
      nameAr: "مجلة الطبيعة",
      nameEn: "Nature",
      icon: Microscope,
      website: "https://nature.com",
      publisher: "Nature Publishing Group",
      issn: "0028-0836",
      impactFactor: "69.504",
      quartile: "Q1",
      citescore: "60.8",
      sjr: "18.32",
      color: "#DC2626",
      subjects: ["العلوم الطبيعية", "الفيزياء", "الكيمياء", "البيولوجيا", "علوم الأرض"],
      features: ["أعلى تأثير عالمياً", "مراجعة صارمة", "نشر سريع"]
    },
    {
      nameAr: "مجلة العلوم",
      nameEn: "Science",
      icon: Microscope,
      website: "https://science.org",
      publisher: "American Association for the Advancement of Science",
      issn: "0036-8075",
      impactFactor: "63.714",
      quartile: "Q1",
      citescore: "58.5",
      sjr: "17.45",
      color: "#7C3AED",
      subjects: ["العلوم متعددة التخصصات", "الطب", "الهندسة", "علوم الحاسوب", "البيئة"],
      features: ["مجلة رائدة عالمياً", "تحكيم دولي", "نشر أسبوعي"]
    },
    {
      nameAr: "مجلة لانست الطبية",
      nameEn: "The Lancet",
      icon: Stethoscope,
      website: "https://thelancet.com",
      publisher: "Elsevier",
      issn: "0140-6736",
      impactFactor: "202.731",
      quartile: "Q1",
      citescore: "71.4",
      sjr: "9.13",
      color: "#DC2626",
      subjects: ["الطب العام", "الصحة العامة", "الطب الباطني", "الجراحة", "طب الأطفال"],
      features: ["أعرق مجلة طبية", "تأثير عالمي", "مراجعة صارمة"]
    },
    {
      nameAr: "مجلة الإدارة الأكاديمية",
      nameEn: "Academy of Management Journal",
      icon: Building2,
      website: "https://aom.org/amj",
      publisher: "Academy of Management",
      issn: "0001-4273",
      impactFactor: "9.408",
      quartile: "Q1",
      citescore: "12.8",
      sjr: "4.52",
      color: "#059669",
      subjects: ["إدارة الأعمال", "السلوك التنظيمي", "الاستراتيجية", "القيادة", "الابتكار"],
      features: ["رائدة في الإدارة", "تحكيم متقدم", "تأثير أكاديمي عالي"]
    },
    {
      nameAr: "مجلة هارفارد للأعمال",
      nameEn: "Harvard Business Review",
      icon: Diamond,
      website: "https://hbr.org",
      publisher: "Harvard Business School",
      issn: "0017-8012",
      impactFactor: "4.65",
      quartile: "Q1",
      citescore: "6.2",
      sjr: "2.18",
      color: "#B91C1C",
      subjects: ["استراتيجية الأعمال", "القيادة", "الإدارة", "التسويق", "الابتكار"],
      features: ["مرجع عالمي", "خبراء دوليون", "تطبيق عملي"]
    },
    {
      nameAr: "مجلة آي تريبل إي للحاسوب",
      nameEn: "IEEE Computer",
      icon: Computer,
      website: "https://computer.org",
      publisher: "IEEE Computer Society",
      issn: "0018-9162",
      impactFactor: "3.872",
      quartile: "Q1",
      citescore: "5.1",
      sjr: "1.85",
      color: "#3B82F6",
      subjects: ["علوم الحاسوب", "هندسة البرمجيات", "الذكاء الاصطناعي", "الأمن السيبراني", "الحوسبة السحابية"],
      features: ["معيار التقنية", "مراجعة تقنية", "تطبيقات عملية"]
    },
    {
      nameAr: "مجلة الرياضيات التطبيقية",
      nameEn: "Journal of Applied Mathematics",
      icon: Calculator,
      website: "https://hindawi.com/journals/jam",
      publisher: "Hindawi",
      issn: "1110-757X",
      impactFactor: "1.182",
      quartile: "Q2",
      citescore: "2.4",
      sjr: "0.75",
      color: "#F59E0B",
      subjects: ["الرياضيات التطبيقية", "الإحصاء", "البحوث العملياتية", "النمذجة الرياضية", "التحليل العددي"],
      features: ["نشر مفتوح", "مراجعة سريعة", "تطبيقات متنوعة"]
    },
    {
      nameAr: "مجلة القانون الدولي",
      nameEn: "International Law Journal",
      icon: Scale,
      website: "https://ilj.org",
      publisher: "Oxford University Press",
      issn: "0020-7853",
      impactFactor: "2.156",
      quartile: "Q1",
      citescore: "3.8",
      sjr: "1.24",
      color: "#8B5CF6",
      subjects: ["القانون الدولي", "حقوق الإنسان", "القانون التجاري", "القانون البيئي", "التحكيم الدولي"],
      features: ["مرجع قانوني", "خبراء دوليون", "تحليل معمق"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-500/5 to-emerald-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Globe className="h-8 w-8 text-white" />
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                دليل المجلات العلمية
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              دليلك الشامل للمجلات العلمية المحكمة العربية والدولية المعتمدة للنشر الأكاديمي
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link to="/order-now" className="flex items-center gap-2">
                  <span className="text-lg">اطلب خدمة النشر</span>
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="border-2 border-blue-200 text-blue-700 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300" asChild>
                <Link to="/research/journal-publication" className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-lg">خدمات النشر</span>
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="text-3xl font-bold text-blue-600 mb-2">+150</div>
                <div className="text-gray-600 font-medium">مجلة علمية محكمة</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="text-3xl font-bold text-purple-600 mb-2">+50</div>
                <div className="text-gray-600 font-medium">تخصص أكاديمي</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="text-3xl font-bold text-emerald-600 mb-2">98%</div>
                <div className="text-gray-600 font-medium">معدل نجاح النشر</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Arabic Journals Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="المجلات العربية والإقليمية" 
            description="أهم المجلات العلمية المحكمة في المنطقة العربية والخليجية المعتمدة للنشر الأكاديمي والبحثي"
            icon={BookOpen}
            color="#2563EB"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {arabicJournals.map((journal, index) => (
              <JournalCard key={journal.nameEn} journal={journal} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* International Journals Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="المجلات الدولية المرموقة" 
            description="أبرز المجلات العلمية الدولية ذات التأثير العالي والمعتمدة في أهم قواعد البيانات العلمية"
            icon={Globe}
            color="#7C3AED"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {internationalJournals.map((journal, index) => (
              <JournalCard key={journal.nameEn} journal={journal} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ابدأ رحلتك في النشر العلمي
            </h2>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              احصل على الدعم الكامل من خبرائنا لنشر بحثك في أفضل المجلات العلمية المحكمة
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link to="/order-now" className="flex items-center gap-2">
                  <span className="text-lg font-semibold">اطلب استشارة مجانية</span>
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300" asChild>
                <Link to="/contact" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <span className="text-lg">تواصل معنا</span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default JournalsDirectory;