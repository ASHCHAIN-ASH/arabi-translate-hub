import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, GraduationCap, Building2, Globe, Award, Book, Users, Star, MapPin, Clock,
  Crown, Shield, Zap, Heart, Microscope, Calculator, Briefcase, Landmark, Brain,
  BookOpen, FlaskConical, Stethoscope, Scale, PaintbrushIcon, Trees, Atom,
  Diamond, Castle, Mountain, Waves, Sun, Moon, FileText, ChevronLeft, Phone
} from "lucide-react";
import { memo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// University card component with performance optimizations
const UniversityCard = memo(({ university, index }: { university: any, index: number }) => {
  const IconComponent = university.icon;

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
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80"
          style={{ backgroundColor: university.color }}
        />
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full border border-gray-100/50 opacity-30 group-hover:opacity-50 transition-opacity" />
        <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full border border-gray-100/50 opacity-20 group-hover:opacity-40 transition-opacity" />

        <CardContent className="p-6 sm:p-8 relative z-10">
          <div className="text-center space-y-4 sm:space-y-6">
            {/* University Icon */}
            <motion.div 
              className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto"
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 rounded-full bg-white shadow-lg group-hover:shadow-xl transition-shadow" />
              <div className="absolute inset-2 rounded-full bg-white shadow-inner flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: `${university.color}15` }}>
                <IconComponent 
                  className="w-12 h-12 sm:w-16 sm:h-16 transition-all duration-300"
                  style={{ color: university.color }}
                />
              </div>
              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"
                style={{ backgroundColor: university.color }}
              />
            </motion.div>

            {/* University Info */}
            <div className="space-y-3">
              <div className="space-y-2">
                <h3 className="font-bold text-lg sm:text-xl text-gray-800 leading-tight line-clamp-2">
                  {university.name}
                </h3>
                <p className="text-sm text-gray-600 font-medium line-clamp-1">
                  {university.nameEn}
                </p>
              </div>

              {/* Location and stats */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{university.city}</span>
                </div>
                {university.country && (
                  <>
                    <span>•</span>
                    <span>{university.country}</span>
                  </>
                )}
                {university.ranking && (
                  <>
                    <span>•</span>
                    <span className="text-amber-600 font-medium">{university.ranking}</span>
                  </>
                )}
              </div>

              {/* University stats */}
              {university.students && (
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Users className="h-3 w-3" />
                  <span>{university.students} طالب</span>
                </div>
              )}

              {/* Establishment date */}
              <Badge 
                variant="secondary" 
                className="text-xs px-3 py-1"
                style={{ 
                  color: university.color,
                  backgroundColor: `${university.color}15`,
                  borderColor: `${university.color}30`
                }}
              >
                <Clock className="h-3 w-3 mr-1" />
                تأسست {university.established}
              </Badge>

              {/* Top specialties */}
              {university.specialties && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1 text-xs font-medium text-gray-600">
                    <Book className="h-3 w-3" />
                    <span>التخصصات الرئيسية</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1">
                    {university.specialties.slice(0, 3).map((specialty: string, idx: number) => (
                      <Badge 
                        key={idx}
                        variant="outline" 
                        className="text-xs px-2 py-1 bg-gray-50/50 border-gray-200 hover:bg-gray-100/50 transition-colors"
                      >
                        {specialty}
                      </Badge>
                    ))}
                    {university.specialties.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50/50">
                        +{university.specialties.length - 3} أخرى
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Visit button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                className="w-full text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                style={{ 
                  background: `linear-gradient(135deg, ${university.color}, ${university.color}CC)`,
                }}
              >
                <a 
                  href={university.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 relative z-10"
                >
                  <ExternalLink className="h-4 w-4" />
                  زيارة الموقع الرسمي
                  <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300 skew-x-12" />
                </a>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

const Universities = () => {
  const saudiPublicUniversities = [
    {
      name: "جامعة الملك سعود",
      nameEn: "King Saud University",
      icon: Crown,
      website: "https://www.ksu.edu.sa",
      city: "الرياض",
      established: "1957",
      color: "#0D4F8C",
      ranking: "1 محلياً",
      students: "65,000+",
      faculties: ["الطب", "الهندسة", "العلوم", "الإدارة", "الحقوق", "الصيدلة", "التربية", "الآداب", "علوم الحاسب", "الزراعة"],
      specialties: ["طب الأسنان", "الهندسة المعمارية", "إدارة الأعمال", "علوم الحاسب الآلي", "الطب البشري"]
    },
    {
      name: "جامعة الملك عبدالعزيز",
      nameEn: "King Abdulaziz University", 
      icon: Waves,
      website: "https://www.kau.edu.sa",
      city: "جدة",
      established: "1967",
      color: "#1B4B93",
      ranking: "2 محلياً",
      students: "82,000+",
      faculties: ["الاقتصاد والإدارة", "الطب", "الهندسة", "العلوم البحرية", "الآداب والعلوم الإنسانية", "علوم الأرض", "الأرصاد والبيئة"],
      specialties: ["الاقتصاد الإسلامي", "الهندسة البحرية", "علوم البحار", "الجيولوجيا البترولية", "الأرصاد الجوية"]
    },
    {
      name: "جامعة الملك فهد للبترول والمعادن",
      nameEn: "King Fahd University of Petroleum & Minerals",
      icon: FlaskConical,
      website: "https://www.kfupm.edu.sa",
      city: "الظهران",
      established: "1963",
      color: "#2B5AA0",
      ranking: "1 تقنياً",
      students: "13,000+",
      faculties: ["الهندسة", "العلوم", "الأعمال", "علوم وهندسة الحاسب الآلي", "التصاميم البيئية"],
      specialties: ["هندسة البترول", "الهندسة الكيميائية", "علوم المواد", "هندسة الطيران", "الأمن السيبراني"]
    },
    {
      name: "جامعة أم القرى",
      nameEn: "Umm Al-Qura University",
      icon: Building2,
      website: "https://uqu.edu.sa",
      city: "مكة المكرمة",
      established: "1981",
      color: "#8B4513",
      ranking: "4 محلياً",
      students: "45,000+",
      faculties: ["الشريعة والدراسات الإسلامية", "اللغة العربية", "الدعوة وأصول الدين", "العلوم التطبيقية", "الطب"],
      specialties: ["الشريعة الإسلامية", "اللغة العربية وآدابها", "العلوم الإسلامية", "الدراسات القرآنية", "الفقه المقارن"]
    },
    {
      name: "الجامعة الإسلامية بالمدينة المنورة",
      nameEn: "Islamic University of Madinah",
      icon: BookOpen,
      website: "https://www.iu.edu.sa",
      city: "المدينة المنورة",
      established: "1961",
      color: "#228B22",
      ranking: "متخصصة",
      students: "25,000+",
      faculties: ["الشريعة", "الدعوة وأصول الدين", "القرآن الكريم والدراسات الإسلامية", "الحديث الشريف", "اللغة العربية"],
      specialties: ["علوم الحديث", "التفسير وعلوم القرآن", "الفقه وأصوله", "العقيدة والمذاهب المعاصرة", "الدعوة الإسلامية"]
    },
    {
      name: "جامعة الإمام محمد بن سعود الإسلامية",
      nameEn: "Imam Mohammad Ibn Saud Islamic University",
      icon: Shield,
      website: "https://imamu.edu.sa",
      city: "الرياض",
      established: "1953",
      color: "#006B3C",
      ranking: "متخصصة",
      students: "60,000+",
      faculties: ["الشريعة", "أصول الدين", "اللغة العربية", "العلوم الاجتماعية", "علوم الحاسب"],
      specialties: ["الشريعة الإسلامية", "العلوم الاجتماعية", "اللغة العربية", "أصول الدين", "الإعلام الإسلامي"]
    },
    {
      name: "جامعة الملك خالد",
      nameEn: "King Khalid University",
      icon: Mountain,
      website: "https://www.kku.edu.sa",
      city: "أبها",
      established: "1998",
      color: "#2E7D32",
      ranking: "5 محلياً",
      students: "65,000+",
      specialties: ["الطب", "الهندسة", "الحاسب الآلي", "التربية", "العلوم الإدارية"]
    },
    {
      name: "جامعة القصيم",
      nameEn: "Qassim University",
      icon: Trees,
      website: "https://www.qu.edu.sa",
      city: "بريدة",
      established: "2004",
      color: "#388E3C",
      ranking: "6 محلياً",
      students: "70,000+",
      specialties: ["الزراعة", "الطب البيطري", "الهندسة", "العلوم", "التربية"]
    },
    {
      name: "جامعة طيبة",
      nameEn: "Taibah University",
      icon: Sun,
      website: "https://www.taibahu.edu.sa",
      city: "المدينة المنورة",
      established: "2003",
      color: "#FF9800",
      ranking: "7 محلياً",
      students: "60,000+",
      specialties: ["الطب", "طب الأسنان", "الصيدلة", "الهندسة", "علوم الحاسب"]
    },
    {
      name: "جامعة جازان",
      nameEn: "Jazan University",
      icon: Waves,
      website: "https://www.jazanu.edu.sa",
      city: "جازان",
      established: "2006",
      color: "#00ACC1",
      ranking: "8 محلياً",
      students: "65,000+",
      specialties: ["الطب", "الهندسة", "العلوم البحرية", "الزراعة", "التربية"]
    }
  ];

  const saudiPrivateUniversities = [
    {
      name: "جامعة الأمير سلطان",
      nameEn: "Prince Sultan University",
      icon: Crown,
      website: "https://www.psu.edu.sa",
      city: "الرياض",
      established: "1999",
      color: "#1E40AF",
      ranking: "1 أهلياً",
      students: "8,000+",
      specialties: ["إدارة الأعمال", "الهندسة", "علوم الحاسب", "القانون", "العلوم الإنسانية"]
    },
    {
      name: "جامعة عفت",
      nameEn: "Effat University",
      icon: Heart,
      website: "https://www.effatuniversity.edu.sa",
      city: "جدة",
      established: "1999",
      color: "#7C3AED",
      ranking: "للبنات",
      students: "2,000+",
      specialties: ["الهندسة", "إدارة الأعمال", "التصميم", "علوم الحاسب", "العلوم الإنسانية"]
    },
    {
      name: "جامعة الفيصل",
      nameEn: "Alfaisal University",
      icon: Diamond,
      website: "https://www.alfaisal.edu",
      city: "الرياض",
      established: "2002",
      color: "#059669",
      ranking: "متميزة",
      students: "3,000+",
      specialties: ["الطب", "الصيدلة", "الهندسة", "الأعمال", "العلوم والتقنية"]
    },
    {
      name: "جامعة دار العلوم",
      nameEn: "Dar Al Uloom University",
      icon: BookOpen,
      website: "https://www.dau.edu.sa",
      city: "الرياض",
      established: "2008",
      color: "#8B5CF6",
      ranking: "أهلية متميزة",
      students: "5,000+",
      specialties: ["إدارة الأعمال", "الهندسة", "علوم الحاسب", "الطب", "الصيدلة"]
    },
    {
      name: "الجامعة العربية المفتوحة",
      nameEn: "Arab Open University",
      icon: Globe,
      website: "https://www.aou.edu.sa",
      city: "الرياض",
      established: "2002",
      color: "#DC2626",
      ranking: "تعليم مفتوح",
      students: "35,000+",
      specialties: ["إدارة الأعمال", "تقنية المعلومات", "اللغة الإنجليزية", "التربية", "العلوم الاجتماعية"]
    },
    {
      name: "جامعة الأمير محمد بن فهد",
      nameEn: "Prince Mohammad Bin Fahd University",
      icon: Zap,
      website: "https://www.pmu.edu.sa",
      city: "الخبر",
      established: "2006",
      color: "#F59E0B",
      ranking: "أهلية تقنية",
      students: "4,000+",
      specialties: ["الهندسة", "إدارة الأعمال", "علوم الحاسب", "التصميم", "العمارة"]
    }
  ];

  const gulfUniversities = [
    {
      name: "جامعة الكويت",
      nameEn: "Kuwait University",
      icon: Castle,
      website: "https://www.ku.edu.kw",
      city: "الكويت",
      country: "الكويت",
      established: "1966",
      color: "#1B5E20",
      ranking: "1 كويتياً",
      students: "40,000+",
      specialties: ["الطب", "الهندسة", "العلوم", "الآداب", "الحقوق"]
    },
    {
      name: "جامعة الإمارات العربية المتحدة",
      nameEn: "United Arab Emirates University",
      icon: Sun,
      website: "https://www.uaeu.ac.ae",
      city: "العين",
      country: "الإمارات",
      established: "1976",
      color: "#C62828",
      ranking: "1 إماراتياً",
      students: "14,000+",
      specialties: ["الطب", "الهندسة", "تقنية المعلومات", "الأعمال", "التربية"]
    },
    {
      name: "جامعة قطر",
      nameEn: "Qatar University",
      icon: Diamond,
      website: "https://www.qu.edu.qa",
      city: "الدوحة",
      country: "قطر",
      established: "1973",
      color: "#6A1B9A",
      ranking: "1 قطرياً",
      students: "23,000+",
      specialties: ["الهندسة", "الطب", "الصيدلة", "القانون", "الأعمال"]
    },
    {
      name: "جامعة البحرين",
      nameEn: "University of Bahrain",
      icon: Waves,
      website: "https://www.uob.edu.bh",
      city: "المنامة",
      country: "البحرين",
      established: "1986",
      color: "#E53E3E",
      ranking: "1 بحرينياً",
      students: "30,000+",
      specialties: ["الهندسة", "تقنية المعلومات", "إدارة الأعمال", "الطب", "التربية"]
    },
    {
      name: "جامعة السلطان قابوس",
      nameEn: "Sultan Qaboos University",
      icon: Crown,
      website: "https://www.squ.edu.om",
      city: "مسقط",
      country: "عُمان",
      established: "1986",
      color: "#805AD5",
      ranking: "1 عُمانياً",
      students: "18,000+",
      specialties: ["الطب", "الهندسة", "العلوم", "الزراعة", "التربية"]
    },
    {
      name: "الجامعة الأمريكية في دبي",
      nameEn: "American University of Dubai",
      icon: Building2,
      website: "https://www.aud.edu",
      city: "دبي",
      country: "الإمارات",
      established: "1995",
      color: "#1A202C",
      ranking: "أمريكية معتمدة",
      students: "2,500+",
      specialties: ["إدارة الأعمال", "الهندسة", "العمارة", "التصميم", "الإعلام"]
    }
  ];

  const internationalUniversities = [
    {
      name: "جامعة هارفارد",
      nameEn: "Harvard University",
      icon: Shield,
      website: "https://www.harvard.edu",
      city: "كامبريدج",
      country: "الولايات المتحدة",
      established: "1636",
      color: "#A51C30",
      ranking: "1 عالمياً",
      students: "23,000+",
      specialties: ["الطب", "القانون", "الأعمال", "السياسة العامة", "العلوم"]
    },
    {
      name: "معهد ماساتشوستس للتكنولوجيا",
      nameEn: "Massachusetts Institute of Technology",
      icon: Atom,
      website: "https://www.mit.edu",
      city: "كامبريدج",
      country: "الولايات المتحدة",
      established: "1861",
      color: "#8B0000",
      ranking: "1 تقنياً",
      students: "11,000+",
      specialties: ["الهندسة", "علوم الحاسب", "الفيزياء", "الكيمياء", "الاقتصاد"]
    },
    {
      name: "جامعة ستانفورد",
      nameEn: "Stanford University",
      icon: Trees,
      website: "https://www.stanford.edu",
      city: "ستانفورد",
      country: "الولايات المتحدة",
      established: "1885",
      color: "#8C1515",
      ranking: "2 عالمياً",
      students: "17,000+",
      specialties: ["علوم الحاسب", "الهندسة", "الأعمال", "الطب", "القانون"]
    },
    {
      name: "جامعة أكسفورد",
      nameEn: "University of Oxford",
      icon: BookOpen,
      website: "https://www.ox.ac.uk",
      city: "أكسفورد",
      country: "المملكة المتحدة",
      established: "1096",
      color: "#002147",
      ranking: "1 بريطانياً",
      students: "24,000+",
      specialties: ["الطب", "القانون", "الآداب", "العلوم", "الفلسفة"]
    },
    {
      name: "جامعة كامبريدج",
      nameEn: "University of Cambridge",
      icon: Award,
      website: "https://www.cam.ac.uk",
      city: "كامبريدج",
      country: "المملكة المتحدة",
      established: "1209",
      color: "#0F4C75",
      ranking: "2 بريطانياً",
      students: "21,000+",
      specialties: ["الرياضيات", "الفيزياء", "الهندسة", "الطب", "العلوم الطبيعية"]
    },
    {
      name: "جامعة تورونتو",
      nameEn: "University of Toronto",
      icon: Landmark,
      website: "https://www.utoronto.ca",
      city: "تورونتو",
      country: "كندا",
      established: "1827",
      color: "#003F7F",
      ranking: "1 كندياً",
      students: "97,000+",
      specialties: ["الطب", "الهندسة", "إدارة الأعمال", "علوم الحاسب", "الصيدلة"]
    },
    {
      name: "جامعة طوكيو",
      nameEn: "University of Tokyo",
      icon: Sun,
      website: "https://www.u-tokyo.ac.jp",
      city: "طوكيو",
      country: "اليابان",
      established: "1877",
      color: "#DD6B20",
      ranking: "1 آسيوياً",
      students: "28,000+",
      specialties: ["الهندسة", "العلوم", "الطب", "القانون", "الاقتصاد"]
    },
    {
      name: "جامعة ملبورن",
      nameEn: "University of Melbourne",
      icon: Globe,
      website: "https://www.unimelb.edu.au",
      city: "ملبورن",
      country: "أستراليا",
      established: "1853",
      color: "#00274C",
      ranking: "1 أسترالياً",
      students: "50,000+",
      specialties: ["الطب", "التجارة", "الهندسة", "القانون", "الفنون"]
    }
  ];

  const SectionHeader = ({ title, icon: Icon, description, color }: { title: string, icon: any, description: string, color: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-center mb-12 sm:mb-16"
    >
      <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 ${color} rounded-full mb-6 shadow-lg`}>
        <Icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
      </div>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">{title}</h2>
      <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">{description}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white" dir="rtl">
      <Header />
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary/10 via-blue-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary to-blue-600 rounded-full mb-6 shadow-xl">
              <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              دليل الجامعات الشامل
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              اكتشف أفضل الجامعات في المملكة العربية السعودية ودول الخليج والعالم مع معلومات شاملة عن التخصصات والبرامج الأكاديمية
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Badge className="text-sm px-4 py-2 bg-gradient-to-r from-primary to-blue-600 hover:shadow-md">
                <Award className="h-4 w-4 mr-2" />
                50+ جامعة معتمدة
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Globe className="h-4 w-4 mr-2" />
                معترف بها دولياً
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Book className="h-4 w-4 mr-2" />
                مئات التخصصات
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Saudi Public Universities */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            title="الجامعات السعودية الحكومية"
            icon={GraduationCap}
            description="أعرق الجامعات الحكومية في المملكة العربية السعودية التي تقدم تعليماً عالي الجودة ومعترفاً به دولياً"
            color="bg-gradient-to-br from-green-500 to-emerald-600"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {saudiPublicUniversities.map((university, index) => (
              <UniversityCard key={index} university={university} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Saudi Private Universities */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-16 right-16 w-36 h-36 bg-blue-300/40 rounded-full blur-3xl animate-bounce" />
          <div className="absolute bottom-16 left-16 w-44 h-44 bg-indigo-300/40 rounded-full blur-3xl animate-bounce" style={{ animationDelay: '0.7s' }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            title="الجامعات السعودية الأهلية"
            icon={Building2}
            description="مؤسسات تعليمية خاصة رائدة تقدم برامج أكاديمية متميزة ومواكبة لمتطلبات سوق العمل"
            color="bg-gradient-to-br from-blue-500 to-indigo-600"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {saudiPrivateUniversities.map((university, index) => (
              <UniversityCard key={index} university={university} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Gulf Universities */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50" />
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-20 left-20 w-40 h-40 bg-purple-300/50 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-24 right-24 w-32 h-32 bg-violet-300/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            title="الجامعات الخليجية"
            icon={Globe}
            description="أبرز الجامعات في دول مجلس التعاون الخليجي التي تتميز بالتطور الأكاديمي والبحثي"
            color="bg-gradient-to-br from-purple-500 to-violet-600"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {gulfUniversities.map((university, index) => (
              <UniversityCard key={index} university={university} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* International Universities */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-rose-50 to-orange-50" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-12 right-12 w-48 h-48 bg-red-200/40 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-12 left-12 w-40 h-40 bg-rose-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.8s' }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            title="الجامعات الأمريكية والدولية"
            icon={Award}
            description="أفضل الجامعات العالمية المرموقة التي تحتل مراكز متقدمة في التصنيفات الدولية"
            color="bg-gradient-to-br from-red-500 to-rose-600"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {internationalUniversities.map((university, index) => (
              <UniversityCard key={index} university={university} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">هل تحتاج مساعدة في اختيار الجامعة المناسبة؟</h2>
            <p className="text-lg sm:text-xl mb-8 opacity-90 leading-relaxed">
              فريقنا من الاستشاريين التعليميين جاهز لمساعدتك في اختيار الجامعة والتخصص المناسب لطموحاتك الأكاديمية والمهنية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-primary hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <a href="/contact-us">تواصل معنا الآن</a>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <a href="/services/consultation-services">استشارة مجانية</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Universities;