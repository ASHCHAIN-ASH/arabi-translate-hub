import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Building2, Users, GraduationCap, Briefcase, ArrowLeft, CheckCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const InstitutionalPartnershipBanner = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Building2, text: "حلول مخصصة للمؤسسات التعليمية" },
    { icon: Users, text: "خصومات حصرية للجهات والشركات" },
    { icon: GraduationCap, text: "دعم شامل لمكاتب الطلاب" },
    { icon: Briefcase, text: "شراكات استراتيجية طويلة الأمد" }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-background to-muted/50 rounded-2xl shadow-xl border border-border/50 overflow-hidden backdrop-blur-sm">
            <div className="grid lg:grid-cols-2 gap-8 p-6 sm:p-8 lg:p-12">
              
              {/* Right side - Content */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    شراكات مؤسسية
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                    هل تمثل مؤسسة تعليمية أو شركة؟
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    انضم إلى شبكتنا من المؤسسات الأكاديمية والشركات الرائدة. نوفر حلولاً مخصصة وخصومات حصرية للجهات التي تخدم الطلاب والباحثين.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="pt-4"
                >
                  <Button
                    size="lg"
                    onClick={() => navigate('/contact-us')}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    ابدأ التعاون معنا
                    <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  </Button>
                </motion.div>
              </div>

              {/* Left side - Features grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (index * 0.1) }}
                    whileHover={{ scale: 1.05 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-relaxed">
                            {feature.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom strip */}
            <div className="bg-gradient-to-l from-primary/10 via-secondary/5 to-accent/10 px-6 sm:px-8 lg:px-12 py-4 border-t border-border/50">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    أكثر من 200 مؤسسة شريكة
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    عقود مرنة ومخصصة
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    دعم فني متواصل 24/7
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
