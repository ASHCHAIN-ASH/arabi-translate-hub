import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, GraduationCap, Building2, Globe, Award } from "lucide-react";

const Universities = () => {
  const saudiPublicUniversities = [
    {
      name: "جامعة الملك سعود",
      nameEn: "King Saud University",
      logo: "https://www.ksu.edu.sa/sites/ksu/assets/images/logos/ksu-logo.png",
      website: "https://www.ksu.edu.sa",
      city: "الرياض",
      established: "1957"
    },
    {
      name: "جامعة الملك عبدالعزيز",
      nameEn: "King Abdulaziz University", 
      logo: "https://www.kau.edu.sa/Style%20Library/KAU/images/logo-ar.png",
      website: "https://www.kau.edu.sa",
      city: "جدة",
      established: "1967"
    },
    {
      name: "جامعة الملك فهد للبترول والمعادن",
      nameEn: "King Fahd University of Petroleum & Minerals",
      logo: "https://www.kfupm.edu.sa/Style%20Library/KfupmEN/img/Logo.png",
      website: "https://www.kfupm.edu.sa",
      city: "الظهران",
      established: "1963"
    },
    {
      name: "جامعة أم القرى",
      nameEn: "Umm Al-Qura University",
      logo: "https://uqu.edu.sa/_catalogs/masterpage/UQU/images/logo.png",
      website: "https://uqu.edu.sa",
      city: "مكة المكرمة",
      established: "1981"
    },
    {
      name: "الجامعة الإسلامية بالمدينة المنورة",
      nameEn: "Islamic University of Madinah",
      logo: "https://www.iu.edu.sa/site_images/iu-logo.png",
      website: "https://www.iu.edu.sa",
      city: "المدينة المنورة",
      established: "1961"
    },
    {
      name: "جامعة الإمام محمد بن سعود الإسلامية",
      nameEn: "Imam Mohammad Ibn Saud Islamic University",
      logo: "https://imamu.edu.sa/Style%20Library/imamu/images/logo.png",
      website: "https://imamu.edu.sa",
      city: "الرياض",
      established: "1953"
    }
  ];

  const saudiPrivateUniversities = [
    {
      name: "جامعة الأمير سلطان",
      nameEn: "Prince Sultan University",
      logo: "https://www.psu.edu.sa/Style%20Library/psu/images/logo.png",
      website: "https://www.psu.edu.sa",
      city: "الرياض",
      established: "1999"
    },
    {
      name: "جامعة عفت",
      nameEn: "Effat University",
      logo: "https://www.effatuniversity.edu.sa/Style%20Library/effat/images/logo.png",
      website: "https://www.effatuniversity.edu.sa",
      city: "جدة",
      established: "1999"
    },
    {
      name: "جامعة الفيصل",
      nameEn: "Alfaisal University",
      logo: "https://www.alfaisal.edu/Style%20Library/alfaisal/images/logo.png",
      website: "https://www.alfaisal.edu",
      city: "الرياض",
      established: "2002"
    },
    {
      name: "جامعة دار العلوم",
      nameEn: "Dar Al Uloom University",
      logo: "https://www.dau.edu.sa/Style%20Library/dau/images/logo.png",
      website: "https://www.dau.edu.sa",
      city: "الرياض",
      established: "2008"
    }
  ];

  const gulfUniversities = [
    {
      name: "جامعة الكويت",
      nameEn: "Kuwait University",
      logo: "https://www.ku.edu.kw/Style%20Library/ku/images/logo.png",
      website: "https://www.ku.edu.kw",
      city: "الكويت",
      country: "الكويت"
    },
    {
      name: "جامعة الإمارات العربية المتحدة",
      nameEn: "United Arab Emirates University",
      logo: "https://www.uaeu.ac.ae/Style%20Library/uaeu/images/logo.png",
      website: "https://www.uaeu.ac.ae",
      city: "العين",
      country: "الإمارات"
    },
    {
      name: "جامعة قطر",
      nameEn: "Qatar University",
      logo: "https://www.qu.edu.qa/Style%20Library/qu/images/logo.png",
      website: "https://www.qu.edu.qa",
      city: "الدوحة",
      country: "قطر"
    },
    {
      name: "جامعة البحرين",
      nameEn: "University of Bahrain",
      logo: "https://www.uob.edu.bh/Style%20Library/uob/images/logo.png",
      website: "https://www.uob.edu.bh",
      city: "المنامة",
      country: "البحرين"
    }
  ];

  const internationalUniversities = [
    {
      name: "جامعة هارفارد",
      nameEn: "Harvard University",
      logo: "https://www.harvard.edu/wp-content/uploads/2021/02/harvard-university-logo.png",
      website: "https://www.harvard.edu",
      city: "كامبريدج",
      country: "الولايات المتحدة"
    },
    {
      name: "معهد ماساتشوستس للتكنولوجيا",
      nameEn: "Massachusetts Institute of Technology",
      logo: "https://web.mit.edu/graphicidentity/logo/logo-color.png",
      website: "https://www.mit.edu",
      city: "كامبريدج",
      country: "الولايات المتحدة"
    },
    {
      name: "جامعة ستانفورد",
      nameEn: "Stanford University",
      logo: "https://identity.stanford.edu/wp-content/uploads/sites/3/2020/06/wordmark-nospace-red.png",
      website: "https://www.stanford.edu",
      city: "ستانفورد",
      country: "الولايات المتحدة"
    },
    {
      name: "جامعة أكسفورد",
      nameEn: "University of Oxford",
      logo: "https://www.ox.ac.uk/sites/files/oxford/styles/ow_medium/public/media_wysiwyg/Oxford%20University.png",
      website: "https://www.ox.ac.uk",
      city: "أكسفورد",
      country: "المملكة المتحدة"
    },
    {
      name: "جامعة كامبريدج",
      nameEn: "University of Cambridge",
      logo: "https://www.cam.ac.uk/sites/www.cam.ac.uk/files/inner-images/logo.jpg",
      website: "https://www.cam.ac.uk",
      city: "كامبريدج",
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
            <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-md flex items-center justify-center p-2 mb-4">
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
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