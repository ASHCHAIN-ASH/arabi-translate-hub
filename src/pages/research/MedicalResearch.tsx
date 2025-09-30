import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, Stethoscope, Pill, FlaskConical, Brain, 
  Baby, Eye, Bone, Activity, Users,
  ArrowRight, CheckCircle, Star
} from 'lucide-react';

const medicalSpecializations = [
  {
    id: "clinical-medicine",
    title: "الطب السريري",
    description: "أبحاث سريرية في جميع التخصصات الطبية",
    icon: <Stethoscope className="h-10 w-10" />,
    gradient: "from-red-600 to-rose-600",
    services: ["دراسات سريرية", "تجارب علاجية", "حالات طبية", "بروتوكولات علاجية", "طب قائم على الأدلة"],
    stats: { projects: "600+", rating: "5.0/5", experts: "25+" }
  },
  {
    id: "pharmacy",
    title: "الصيدلة",
    description: "أبحاث صيدلانية وعقاقير ودوائية",
    icon: <Pill className="h-10 w-10" />,
    gradient: "from-green-600 to-emerald-600",
    services: ["صيدلة سريرية", "كيمياء دوائية", "صيدلانيات", "علم الأدوية", "سموم"],
    stats: { projects: "500+", rating: "4.9/5", experts: "20+" }
  },
  {
    id: "nursing",
    title: "التمريض",
    description: "أبحاث في علوم التمريض والرعاية الصحية",
    icon: <Heart className="h-10 w-10" />,
    gradient: "from-pink-600 to-rose-600",
    services: ["تمريض سريري", "إدارة تمريضية", "تمريض أطفال", "تمريض صحة عامة", "رعاية حرجة"],
    stats: { projects: "450+", rating: "4.8/5", experts: "18+" }
  },
  {
    id: "public-health",
    title: "الصحة العامة",
    description: "دراسات وأبحاث صحية وبائية",
    icon: <Activity className="h-10 w-10" />,
    gradient: "from-blue-600 to-cyan-600",
    services: ["وبائيات", "صحة مجتمع", "صحة بيئية", "إحصاء حيوي", "تعزيز صحة"],
    stats: { projects: "550+", rating: "4.9/5", experts: "22+" }
  },
  {
    id: "laboratory",
    title: "المختبرات الطبية",
    description: "أبحاث في التحاليل والمختبرات الطبية",
    icon: <FlaskConical className="h-10 w-10" />,
    gradient: "from-purple-600 to-violet-600",
    services: ["تحاليل طبية", "علم الأمراض", "أحياء دقيقة طبية", "كيمياء حيوية سريرية", "دم ومناعة"],
    stats: { projects: "400+", rating: "4.8/5", experts: "16+" }
  },
  {
    id: "dentistry",
    title: "طب الأسنان",
    description: "أبحاث في طب وجراحة الأسنان",
    icon: <Bone className="h-10 w-10" />,
    gradient: "from-teal-600 to-cyan-600",
    services: ["جراحة فم وأسنان", "تقويم أسنان", "أسنان أطفال", "زراعة أسنان", "علاج جذور"],
    stats: { projects: "350+", rating: "4.7/5", experts: "14+" }
  },
  {
    id: "radiology",
    title: "الأشعة والتصوير الطبي",
    description: "أبحاث في التصوير التشخيصي والعلاجي",
    icon: <Eye className="h-10 w-10" />,
    gradient: "from-indigo-600 to-blue-600",
    services: ["أشعة تشخيصية", "أشعة تداخلية", "رنين مغناطيسي", "أشعة نووية", "موجات فوق صوتية"],
    stats: { projects: "300+", rating: "4.8/5", experts: "12+" }
  },
  {
    id: "psychology-health",
    title: "علم النفس الصحي",
    description: "أبحاث نفسية صحية وطب نفسي",
    icon: <Brain className="h-10 w-10" />,
    gradient: "from-orange-600 to-amber-600",
    services: ["طب نفسي", "صحة نفسية", "علاج نفسي", "إدمان", "اضطرابات نفسية"],
    stats: { projects: "450+", rating: "4.9/5", experts: "18+" }
  },
  {
    id: "pediatrics",
    title: "طب الأطفال",
    description: "أبحاث طبية متخصصة في صحة الطفل",
    icon: <Baby className="h-10 w-10" />,
    gradient: "from-yellow-600 to-orange-600",
    services: ["طب حديثي ولادة", "نمو وتطور", "تغذية أطفال", "أمراض أطفال", "طوارئ أطفال"],
    stats: { projects: "400+", rating: "4.9/5", experts: "16+" }
  },
  {
    id: "nutrition",
    title: "التغذية العلاجية",
    description: "أبحاث في التغذية والحميات العلاجية",
    icon: <FlaskConical className="h-10 w-10" />,
    gradient: "from-lime-600 to-green-600",
    services: ["تغذية سريرية", "سمنة", "سوء تغذية", "حميات علاجية", "تغذية رياضية"],
    stats: { projects: "350+", rating: "4.8/5", experts: "14+" }
  }
];

const MedicalResearch = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-pink-50/20 to-background">
      <Header />
      
      <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 animate-float" />
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              الأبحاث الطبية والصحية
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl text-rose-200">أبحاث طبية متقدمة</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed text-rose-100">
              أبحاث طبية وصحية متخصصة في جميع المجالات الطبية
              <br />
              بأعلى معايير البحث الطبي العالمية
            </p>
            
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
              ابدأ بحثك الطبي
              <ArrowRight className="h-5 w-5 mr-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 px-6 py-2 text-base">
              التخصصات الطبية
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              جميع المجالات الطبية والصحية
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {medicalSpecializations.map((spec, index) => (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                  <div className={`bg-gradient-to-r ${spec.gradient} p-5 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm"
                      >
                        {spec.icon}
                      </motion.div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                          {spec.stats.projects}
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                          <Star className="h-3 w-3 ml-1 fill-current" />
                          {spec.stats.rating}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                      {spec.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {spec.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold mb-2 text-muted-foreground">الخدمات:</h4>
                      <div className="space-y-1">
                        {spec.services.slice(0, 3).map((service, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{service}</span>
                          </div>
                        ))}
                        <div className="text-xs text-primary font-medium">+ المزيد</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{spec.stats.experts} خبير</span>
                      </div>
                    </div>

                    <Button className="w-full" size="sm" onClick={() => navigate('/research/order/medical')}>
                      اطلب الخدمة
                      <ArrowRight className="h-4 w-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MedicalResearch;
