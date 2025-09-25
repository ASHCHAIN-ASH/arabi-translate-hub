import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users, Lightbulb, Target, Clock, Shield, Award, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const ConsultationServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "الاستشارات الأكاديمية",
      description: "استشارات متخصصة في البحث العلمي والدراسات الأكاديمية",
      features: ["إرشاد أكاديمي", "خطط بحثية", "نصائح منهجية"]
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "الاستشارات الاستراتيجية",
      description: "استشارات في التخطيط الاستراتيجي وتطوير الأعمال",
      features: ["تحليل SWOT", "خطط العمل", "استراتيجيات النمو"]
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "الاستشارات الإبداعية",
      description: "استشارات في الإبداع والابتكار وحل المشكلات",
      features: ["حلول إبداعية", "عصف ذهني", "تطوير الأفكار"]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "الاستشارات الإدارية",
      description: "استشارات في الإدارة وتطوير الموارد البشرية",
      features: ["تطوير الفرق", "إدارة الأداء", "التدريب المهني"]
    }
  ];

  const features = [
    { icon: <Users className="w-6 h-6" />, title: "خبراء متخصصون", description: "فريق من الخبراء والمستشارين المتخصصين" },
    { icon: <Clock className="w-6 h-6" />, title: "مرونة في المواعيد", description: "جلسات استشارية مرنة تناسب جدولكم" },
    { icon: <Shield className="w-6 h-6" />, title: "سرية تامة", description: "ضمان الخصوصية والسرية التامة" },
    { icon: <Award className="w-6 h-6" />, title: "نتائج مضمونة", description: "حلول عملية ونتائج قابلة للتطبيق" }
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
              <MessageCircle className="w-5 h-5 mr-2" />
              الخدمات الاستشارية المتخصصة
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              استشارات متخصصة
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              نقدم خدمات استشارية متخصصة من خبراء في مختلف المجالات لمساعدتكم في تحقيق أهدافكم
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => navigate('/order-now')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                احجز استشارة الآن
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
            <h2 className="text-4xl font-bold mb-4 text-foreground">أنواع الخدمات الاستشارية</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              نوفر مجموعة شاملة من الخدمات الاستشارية في مختلف المجالات المتخصصة
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
            <h2 className="text-4xl font-bold mb-4">مميزات خدماتنا الاستشارية</h2>
            <p className="text-muted-foreground text-lg">ما يميز خدماتنا الاستشارية المتخصصة</p>
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
            <h2 className="text-4xl font-bold mb-6">احصل على استشارة متخصصة</h2>
            <p className="text-xl text-muted-foreground mb-8">
              تواصل مع خبرائنا المتخصصين للحصول على أفضل الحلول لتحدياتكم
            </p>
            <Button 
              size="lg" 
              className="text-lg px-12 py-4"
              onClick={() => navigate('/order-now')}
            >
              احجز جلسة استشارية
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ConsultationServices;