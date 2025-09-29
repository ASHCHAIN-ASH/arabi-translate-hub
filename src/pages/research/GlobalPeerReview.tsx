import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Globe, 
  Award, 
  Clock,
  Eye,
  UserCheck,
  Construction,
  Mail
} from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const GlobalPeerReview = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();

  const features = [
    {
      title: "سرعة المراجعة",
      description: "مراجعة سريعة وفعالة للأبحاث العلمية خلال فترة قصيرة",
      icon: Clock,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "شفافية كاملة",
      description: "عملية شفافة مع إمكانية متابعة جميع مراحل المراجعة",
      icon: Eye,
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "اختيار المراجعين",
      description: "إمكانية اختيار المراجعين المناسبين حسب التخصص",
      icon: UserCheck,
      gradient: "from-indigo-500 to-indigo-600"
    },
    {
      title: "شهادات للمراجعين",
      description: "شهادات معتمدة للمراجعين المشاركين في العملية",
      icon: Award,
      gradient: "from-violet-500 to-violet-600"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-peer-review-interest', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim()
        }
      });

      if (error) {
        throw error;
      }

      setIsRegistered(true);
      toast({
        title: "تم التسجيل بنجاح!",
        description: "شكراً لتسجيل اهتمامك! سنقوم بإشعارك فور إطلاق الخدمة.",
      });
      
      setFormData({ name: "", email: "" });
    } catch (error) {
      console.error('Error registering interest:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <motion.div 
                className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Globe className="h-10 w-10" />
              </motion.div>
            </div>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              خدمة المراجعة التعاونية العالمية
            </motion.h1>
            <motion.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-6 w-6" />
                <Users className="h-6 w-6" />
              </div>
            </motion.div>
            <motion.p 
              className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              نقدم قريباً خدمة مبتكرة في عالم النشر العلمي، حيث سيتمكن الباحثون من الاستفادة من شبكة مراجعين عالميين لمراجعة أبحاثهم بسرعة وشفافية. الخدمة ستتيح للباحث اختيار المراجعين المناسبين وتلقي تقارير مراجعة احترافية خلال فترة قصيرة.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              مميزات الخدمة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              خدمة شاملة ومتكاملة للمراجعة العلمية العالمية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-card">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-card-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notice Section */}
      <section className="py-20 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center">
                    <Construction className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-amber-800 dark:text-amber-200">
                  تنويه
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg md:text-xl text-amber-700 dark:text-amber-300 mb-8 leading-relaxed">
                  هذه الخدمة قيد التطوير حالياً 🚧. تابعونا ليصلكم إشعار عند إطلاقها رسمياً.
                </p>
                
                {!isRegistered ? (
                  <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-200 mb-6">
                      سجل اهتمامك
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-amber-700 dark:text-amber-300">
                          الاسم الكامل
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-white dark:bg-background border-amber-200 dark:border-amber-800 focus:border-amber-400"
                          placeholder="أدخل اسمك الكامل"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-amber-700 dark:text-amber-300">
                          البريد الإلكتروني
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-white dark:bg-background border-amber-200 dark:border-amber-800 focus:border-amber-400"
                          placeholder="أدخل بريدك الإلكتروني"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                            جاري التسجيل...
                          </>
                        ) : (
                          <>
                            <Mail className="w-5 h-5 ml-2" />
                            سجل اهتمامك
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="max-w-md mx-auto text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-4">
                      شكراً لتسجيل اهتمامك!
                    </h3>
                    <p className="text-green-600 dark:text-green-400">
                      سنقوم بإشعارك فور إطلاق الخدمة.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GlobalPeerReview;