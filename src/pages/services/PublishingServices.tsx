import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Globe, FileText, Award, Users, Clock, Shield, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const PublishingServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "النشر في المجلات العلمية",
      description: "نساعدكم في نشر أبحاثكم في أفضل المجلات العلمية المحكمة",
      features: ["اختيار المجلة المناسبة", "إعداد المخطوط", "متابعة عملية المراجعة"]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "النشر الدولي",
      description: "خدمات النشر في المجلات الدولية المفهرسة",
      features: ["مجلات ISI", "مجلات Scopus", "مجلات Q1 & Q2"]
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "إعداد المخطوطات",
      description: "إعداد وتنسيق المخطوطات وفقاً لمعايير المجلات",
      features: ["تنسيق أكاديمي", "مراجعة لغوية", "ضبط المراجع"]
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "خدمات ما بعد النشر",
      description: "خدمات متابعة وترويج البحوث المنشورة",
      features: ["ترويج البحث", "زيادة الاقتباسات", "التسويق الأكاديمي"]
    }
  ];

  const features = [
    { icon: <Users className="w-6 h-6" />, title: "خبراء النشر", description: "فريق متخصص في النشر الأكاديمي والعلمي" },
    { icon: <Clock className="w-6 h-6" />, title: "متابعة مستمرة", description: "متابعة دائمة لعملية النشر حتى القبول" },
    { icon: <Shield className="w-6 h-6" />, title: "ضمان الجودة", description: "ضمان الجودة والمعايير الأكاديمية العالية" },
    { icon: <Zap className="w-6 h-6" />, title: "شبكة واسعة", description: "شبكة واسعة من المجلات والناشرين المعتمدين" }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 text-lg px-6 py-2" variant="secondary">
              <BookOpen className="w-5 h-5 mr-2" />
              خدمات النشر العلمي المتخصص
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              النشر العلمي المتميز
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              نساعدكم في نشر أبحاثكم في أفضل المجلات العلمية المحكمة محلياً وعالمياً
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => navigate('/order-now')}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                ابدأ النشر الآن
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4"
                onClick={() => navigate('/pricing')}
              >
                عرض الأسعار
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-foreground">خدمات النشر العلمي</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              نوفر مجموعة شاملة من خدمات النشر العلمي في أفضل المجلات المحكمة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl text-center">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 text-center">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">مميزات خدمات النشر</h2>
            <p className="text-muted-foreground text-lg">ما يميز خدمات النشر العلمي لدينا</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">انشر بحثك في أفضل المجلات</h2>
            <p className="text-xl text-muted-foreground mb-8">
              اتخذ الخطوة الأولى نحو النشر الناجح لبحثك العلمي
            </p>
            <Button 
              size="lg" 
              className="text-lg px-12 py-4"
              onClick={() => navigate('/order-now')}
            >
              ابدأ رحلة النشر
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PublishingServices;