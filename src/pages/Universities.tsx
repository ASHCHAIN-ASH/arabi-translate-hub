import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, GraduationCap, Building2, Globe, Award } from "lucide-react";
import universityPlaceholder from "@/assets/university-placeholder.png";

const Universities = () => {
  const saudiPublicUniversities = [
    {
      name: "جامعة الملك سعود",
      nameEn: "King Saud University",
      logo: "https://www.ksu.edu.sa/sites/KSU/assets/images/logos/ksu_logo_en.png",
      website: "https://www.ksu.edu.sa",
      city: "الرياض",
      established: "1957"
    },
    {
      name: "جامعة الملك عبدالعزيز",
      nameEn: "King Abdulaziz University", 
      logo: "https://www.kau.edu.sa/Files/165/Files/151942_KAU-Logo.png",
      website: "https://www.kau.edu.sa",
      city: "جدة",
      established: "1967"
    },
    {
      name: "جامعة الملك فهد للبترول والمعادن",
      nameEn: "King Fahd University of Petroleum & Minerals",
      logo: "https://www.kfupm.edu.sa/SiteCollectionImages/en/deanships/library/about/kfupm-logo.png",
      website: "https://www.kfupm.edu.sa",
      city: "الظهران",
      established: "1963"
    },
    {
      name: "جامعة أم القرى",
      nameEn: "Umm Al-Qura University",
      logo: "https://uqu.edu.sa/lib/img/logo.png",
      website: "https://uqu.edu.sa",
      city: "مكة المكرمة",
      established: "1981"
    },
    {
      name: "الجامعة الإسلامية بالمدينة المنورة",
      nameEn: "Islamic University of Madinah",
      logo: "https://www.iu.edu.sa/site_images/logo-ar.png",
      website: "https://www.iu.edu.sa",
      city: "المدينة المنورة",
      established: "1961"
    },
    {
      name: "جامعة الإمام محمد بن سعود الإسلامية",
      nameEn: "Imam Mohammad Ibn Saud Islamic University",
      logo: "https://imamu.edu.sa/sites/default/files/imamu-logo.png",
      website: "https://imamu.edu.sa",
      city: "الرياض",
      established: "1953"
    },
    {
      name: "جامعة الملك فيصل",
      nameEn: "King Faisal University",
      logo: "https://www.kfu.edu.sa/sites/Home/Style%20Library/ar/images/logo.png",
      website: "https://www.kfu.edu.sa",
      city: "الأحساء",
      established: "1975"
    },
    {
      name: "جامعة الملك خالد",
      nameEn: "King Khalid University",
      logo: "https://www.kku.edu.sa/sites/default/files/general_files/kku_logo.png",
      website: "https://www.kku.edu.sa",
      city: "أبها",
      established: "1998"
    },
    {
      name: "جامعة طيبة",
      nameEn: "Taibah University",
      logo: "https://www.taibahu.edu.sa/Pages/AR/Style%20Library/images/logo.png",
      website: "https://www.taibahu.edu.sa",
      city: "المدينة المنورة",
      established: "2003"
    },
    {
      name: "جامعة القصيم",
      nameEn: "Qassim University",
      logo: "https://www.qu.edu.sa/content/qu/ar/jcr:content/contentPar/image.img.png",
      website: "https://www.qu.edu.sa",
      city: "بريدة",
      established: "2004"
    },
    {
      name: "جامعة طيف",
      nameEn: "Taif University",
      logo: "https://www.tu.edu.sa/Style%20Library/images/logo-ar.png",
      website: "https://www.tu.edu.sa",
      city: "الطائف",
      established: "2003"
    },
    {
      name: "جامعة جازان",
      nameEn: "Jazan University",
      logo: "https://www.jazanu.edu.sa/Style%20Library/JU/images/logo.png",
      website: "https://www.jazanu.edu.sa",
      city: "جازان",
      established: "2006"
    },
    {
      name: "جامعة الحدود الشمالية",
      nameEn: "Northern Border University",
      logo: "https://www.nbu.edu.sa/Style%20Library/NBU/images/logo.png",
      website: "https://www.nbu.edu.sa",
      city: "عرعر",
      established: "2007"
    },
    {
      name: "جامعة الأميرة نورة بنت عبدالرحمن",
      nameEn: "Princess Nourah bint Abdulrahman University",
      logo: "https://www.pnu.edu.sa/arr/Style%20Library/PNU/images/logo.png",
      website: "https://www.pnu.edu.sa",
      city: "الرياض",
      established: "2008"
    }
  ];

  const saudiPrivateUniversities = [
    {
      name: "جامعة الأمير سلطان",
      nameEn: "Prince Sultan University",
      logo: "https://www.psu.edu.sa/sites/psu/Style%20Library/PSU/Images/logo.png",
      website: "https://www.psu.edu.sa",
      city: "الرياض",
      established: "1999"
    },
    {
      name: "جامعة عفت",
      nameEn: "Effat University",
      logo: "https://www.effatuniversity.edu.sa/English/Style%20Library/EU/Images/effat-logo.png",
      website: "https://www.effatuniversity.edu.sa",
      city: "جدة",
      established: "1999"
    },
    {
      name: "جامعة الفيصل",
      nameEn: "Alfaisal University",
      logo: "https://www.alfaisal.edu/sites/default/files/alfaisal-logo.png",
      website: "https://www.alfaisal.edu",
      city: "الرياض",
      established: "2002"
    },
    {
      name: "جامعة دار العلوم",
      nameEn: "Dar Al Uloom University",
      logo: "https://www.dau.edu.sa/sites/dau/Style%20Library/Images/logo.png",
      website: "https://www.dau.edu.sa",
      city: "الرياض",
      established: "2008"
    },
    {
      name: "الجامعة العربية المفتوحة",
      nameEn: "Arab Open University",
      logo: "https://www.arabou.edu.kw/sites/default/files/aou-logo.png",
      website: "https://www.aou.edu.sa",
      city: "الرياض",
      established: "2002"
    },
    {
      name: "جامعة الأمير محمد بن فهد",
      nameEn: "Prince Mohammad Bin Fahd University",
      logo: "https://www.pmu.edu.sa/Style%20Library/PMU/images/logo.png",
      website: "https://www.pmu.edu.sa",
      city: "الخبر",
      established: "2006"
    },
    {
      name: "جامعة رياض العلم",
      nameEn: "Riyadh Elm University",
      logo: "https://www.riyadh.edu.sa/Style%20Library/REU/images/logo.png",
      website: "https://www.riyadh.edu.sa",
      city: "الرياض",
      established: "2004"
    },
    {
      name: "كليات الفارابي",
      nameEn: "Al-Farabi Colleges",
      logo: "https://www.farabicollege.edu.sa/sites/default/files/farabi-logo.png",
      website: "https://www.farabicollege.edu.sa",
      city: "الرياض",
      established: "1996"
    }
  ];

  const gulfUniversities = [
    {
      name: "جامعة الكويت",
      nameEn: "Kuwait University",
      logo: "https://www.ku.edu.kw/themes/ku/images/logo.png",
      website: "https://www.ku.edu.kw",
      city: "الكويت",
      country: "الكويت"
    },
    {
      name: "جامعة الإمارات العربية المتحدة",
      nameEn: "United Arab Emirates University",
      logo: "https://www.uaeu.ac.ae/assets/images/logo-uaeu.png",
      website: "https://www.uaeu.ac.ae",
      city: "العين",
      country: "الإمارات"
    },
    {
      name: "جامعة قطر",
      nameEn: "Qatar University",
      logo: "https://www.qu.edu.qa/static/img/qu-logo.png",
      website: "https://www.qu.edu.qa",
      city: "الدوحة",
      country: "قطر"
    },
    {
      name: "جامعة البحرين",
      nameEn: "University of Bahrain",
      logo: "https://www.uob.edu.bh/assets/images/logo.png",
      website: "https://www.uob.edu.bh",
      city: "المنامة",
      country: "البحرين"
    },
    {
      name: "الجامعة الأمريكية في دبي",
      nameEn: "American University of Dubai",
      logo: "https://www.aud.edu/images/AUD-logo.png",
      website: "https://www.aud.edu",
      city: "دبي",
      country: "الإمارات"
    },
    {
      name: "الجامعة الأمريكية في الشارقة",
      nameEn: "American University of Sharjah",
      logo: "https://www.aus.edu/info/abt/logo/aus-logo.png",
      website: "https://www.aus.edu",
      city: "الشارقة",
      country: "الإمارات"
    },
    {
      name: "جامعة الخليج العربي",
      nameEn: "Arabian Gulf University",
      logo: "https://www.agu.edu.bh/images/logo.png",
      website: "https://www.agu.edu.bh",
      city: "المنامة",
      country: "البحرين"
    },
    {
      name: "جامعة زايد",
      nameEn: "Zayed University",
      logo: "https://www.zu.ac.ae/images/zu-logo.png",
      website: "https://www.zu.ac.ae",
      city: "أبوظبي",
      country: "الإمارات"
    }
  ];

  const internationalUniversities = [
    {
      name: "جامعة هارفارد",
      nameEn: "Harvard University",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Harvard-Logo.png",
      website: "https://www.harvard.edu",
      city: "كامبريدج",
      country: "الولايات المتحدة"
    },
    {
      name: "معهد ماساتشوستس للتكنولوجيا",
      nameEn: "Massachusetts Institute of Technology",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/MIT-Logo.png",
      website: "https://www.mit.edu",
      city: "كامبريدج",
      country: "الولايات المتحدة"
    },
    {
      name: "جامعة ستانفورد",
      nameEn: "Stanford University",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Stanford-Logo.png",
      website: "https://www.stanford.edu",
      city: "ستانفورد",
      country: "الولايات المتحدة"
    },
    {
      name: "جامعة أكسفورد",
      nameEn: "University of Oxford",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Oxford-Logo.png",
      website: "https://www.ox.ac.uk",
      city: "أكسفورد",
      country: "المملكة المتحدة"
    },
    {
      name: "جامعة كامبريدج",
      nameEn: "University of Cambridge",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Cambridge-Logo.png",
      website: "https://www.cam.ac.uk",
      city: "كامبريدج",
      country: "المملكة المتحدة"
    },
    {
      name: "جامعة كاليفورنيا - بيركلي",
      nameEn: "University of California, Berkeley",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/UC-Berkeley-Logo.png",
      website: "https://www.berkeley.edu",
      city: "بيركلي",
      country: "الولايات المتحدة"
    },
    {
      name: "جامعة كولومبيا",
      nameEn: "Columbia University",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Columbia-Logo.png",
      website: "https://www.columbia.edu",
      city: "نيويورك",
      country: "الولايات المتحدة"
    },
    {
      name: "معهد كاليفورنيا للتكنولوجيا",
      nameEn: "California Institute of Technology",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Caltech-Logo.png",
      website: "https://www.caltech.edu",
      city: "باسادينا",
      country: "الولايات المتحدة"
    },
    {
      name: "جامعة ييل",
      nameEn: "Yale University",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Yale-Logo.png",
      website: "https://www.yale.edu",
      city: "نيو هيفن",
      country: "الولايات المتحدة"
    },
    {
      name: "جامعة برينستون",
      nameEn: "Princeton University",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Princeton-Logo.png",
      website: "https://www.princeton.edu",
      city: "برينستون",
      country: "الولايات المتحدة"
    },
    {
      name: "الكلية الإمبراطورية لندن",
      nameEn: "Imperial College London",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Imperial-College-London-Logo.png",
      website: "https://www.imperial.ac.uk",
      city: "لندن",
      country: "المملكة المتحدة"
    },
    {
      name: "كلية لندن الجامعية",
      nameEn: "University College London",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/UCL-Logo.png",
      website: "https://www.ucl.ac.uk",
      city: "لندن",
      country: "المملكة المتحدة"
    }
  ];

  const UniversityCard = ({ university, type }: { university: any, type: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/30 hover:from-white hover:to-primary/5">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            {/* University Logo */}
            <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-md flex items-center justify-center p-2 mb-4 overflow-hidden">
              <img 
                src={university.logo}
                alt={`${university.name} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = universityPlaceholder;
                }}
              />
            </div>

            {/* University Name */}
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-gray-800 leading-tight">{university.name}</h3>
              <p className="text-sm text-gray-600 font-medium">{university.nameEn}</p>
            </div>

            {/* Location and Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4" />
                <span>{university.city}</span>
                {university.country && <span>، {university.country}</span>}
              </div>
              {university.established && (
                <Badge variant="secondary" className="text-xs">
                  تأسست {university.established}
                </Badge>
              )}
            </div>

            {/* Visit Button */}
            <Button
              asChild
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <a 
                href={university.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                زيارة الموقع
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const SectionHeader = ({ title, icon: Icon, description, color }: { title: string, icon: any, description: string, color: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <div className={`inline-flex items-center justify-center w-16 h-16 ${color} rounded-full mb-6`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">{description}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white" dir="rtl">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-blue-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full mb-6">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              دليل الجامعات الشامل
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              اكتشف أفضل الجامعات في المملكة العربية السعودية ودول الخليج والعالم. 
              نقدم لك دليلاً شاملاً للجامعات الحكومية والأهلية والدولية المعتمدة.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="text-sm px-4 py-2 bg-gradient-to-r from-primary to-blue-600 hover:shadow-md">
                <Award className="h-4 w-4 mr-2" />
                جامعات معتمدة
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Globe className="h-4 w-4 mr-2" />
                معترف بها دولياً
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Saudi Public Universities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="الجامعات السعودية الحكومية"
            icon={GraduationCap}
            description="أعرق الجامعات الحكومية في المملكة العربية السعودية التي تقدم تعليماً عالي الجودة ومعترفاً به دولياً"
            color="bg-gradient-to-br from-green-500 to-emerald-600"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {saudiPublicUniversities.map((university, index) => (
              <UniversityCard key={index} university={university} type="public" />
            ))}
          </div>
        </div>
      </section>

      {/* Saudi Private Universities */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="الجامعات السعودية الأهلية"
            icon={Building2}
            description="مؤسسات تعليمية خاصة رائدة تقدم برامج أكاديمية متميزة ومواكبة لمتطلبات سوق العمل"
            color="bg-gradient-to-br from-blue-500 to-indigo-600"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {saudiPrivateUniversities.map((university, index) => (
              <UniversityCard key={index} university={university} type="private" />
            ))}
          </div>
        </div>
      </section>

      {/* Gulf Universities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="الجامعات الخليجية"
            icon={Globe}
            description="أبرز الجامعات في دول مجلس التعاون الخليجي التي تتميز بالتطور الأكاديمي والبحثي"
            color="bg-gradient-to-br from-purple-500 to-violet-600"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gulfUniversities.map((university, index) => (
              <UniversityCard key={index} university={university} type="gulf" />
            ))}
          </div>
        </div>
      </section>

      {/* International Universities */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-slate-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="الجامعات الأمريكية والدولية"
            icon={Award}
            description="أفضل الجامعات العالمية المرموقة التي تحتل مراكز متقدمة في التصنيفات الدولية"
            color="bg-gradient-to-br from-red-500 to-rose-600"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {internationalUniversities.map((university, index) => (
              <UniversityCard key={index} university={university} type="international" />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">هل تحتاج مساعدة في اختيار الجامعة المناسبة؟</h2>
            <p className="text-xl mb-8 opacity-90">
              فريقنا من الاستشاريين التعليميين جاهز لمساعدتك في اختيار الجامعة والتخصص المناسب لطموحاتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-primary hover:bg-gray-50 shadow-lg"
              >
                <a href="/contact-us">تواصل معنا الآن</a>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
              >
                <a href="/services/consultation-services">استشارة مجانية</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Universities;