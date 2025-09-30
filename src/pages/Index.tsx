import React, { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bot, Bell, GraduationCap, BookOpen, Award, Users, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";

// Lazy load heavy components for better performance
const AcademicHeroSection = lazy(() => import("@/components/AcademicHeroSection"));
const AcademicFeatures = lazy(() => import("@/components/AcademicFeatures"));
const AcademicStats = lazy(() => import("@/components/AcademicStats"));
const ServiceSteps = lazy(() => import("@/components/ServiceSteps"));
const ServicesShowcase = lazy(() => import("@/components/ServicesShowcase"));
const MasterMembershipBanner = lazy(() => import("@/components/MasterMembershipBanner"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <WorkingHoursBannerRTL />
      
      {/* AI Service Alert Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-l from-primary via-primary-dark to-accent py-4 px-4"
        dir="rtl"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-primary/95 via-primary-dark/95 to-accent/95" />
        <div className="container mx-auto relative">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="shrink-0"
            >
              <Bell className="h-5 w-5 md:h-6 md:w-6 text-yellow-300" />
            </motion.div>
            <div className="flex-1">
              <p className="text-base md:text-lg font-semibold mb-1 text-white">
                🤖 خدمة جديدة: المراجعة المنهجية بالذكاء الاصطناعي
              </p>
              <p className="text-xs md:text-sm text-white/90">
                قم برفع بحثك واحصل على مراجعة شاملة فورية
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm"
                onClick={() => navigate('/research/ai-methodology-review')}
              >
                <Bot className="ml-2 h-4 w-4" />
                جرب الآن
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      <Header />
      
      {/* Academic Excellence Section */}
      <section className="relative py-12 md:py-16 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-l from-primary via-primary-dark to-accent bg-clip-text text-transparent">
              التميز الأكاديمي بمعايير عالمية
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              نقدم خدمات أكاديمية متكاملة تجمع بين الخبرة والجودة والالتزام بالمعايير الدولية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: GraduationCap,
                title: "خبراء أكاديميون",
                description: "فريق من الأساتذة والباحثين المتخصصين",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: BookOpen,
                title: "بحوث منشورة",
                description: "آلاف الأبحاث المنشورة في مجلات علمية محكمة",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: Award,
                title: "جودة معتمدة",
                description: "معايير الجودة وفق المعايير الدولية",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Users,
                title: "دعم مستمر",
                description: "متابعة وإرشاد طوال رحلتك البحثية",
                color: "from-orange-500 to-orange-600"
              },
              {
                icon: TrendingUp,
                title: "نجاح مضمون",
                description: "نسبة نجاح عالية في قبول الأبحاث",
                color: "from-red-500 to-red-600"
              },
              {
                icon: Shield,
                title: "سرية تامة",
                description: "حماية كاملة لبياناتك وأبحاثك",
                color: "from-indigo-500 to-indigo-600"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 group">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Hero Section with Suspense */}
      <Suspense fallback={<LoadingSpinner />}>
        <AcademicHeroSection />
      </Suspense>

      {/* Master Membership Banner */}
      <Suspense fallback={<LoadingSpinner />}>
        <MasterMembershipBanner />
      </Suspense>

      {/* Academic Features */}
      <Suspense fallback={<LoadingSpinner />}>
        <AcademicFeatures />
      </Suspense>

      {/* Academic Stats */}
      <Suspense fallback={<LoadingSpinner />}>
        <AcademicStats />
      </Suspense>

      {/* Service Steps */}
      <Suspense fallback={<LoadingSpinner />}>
        <ServiceSteps />
      </Suspense>

      {/* Services Showcase */}
      <Suspense fallback={<LoadingSpinner />}>
        <ServicesShowcase />
      </Suspense>

    </div>
  );
};

export default Index;