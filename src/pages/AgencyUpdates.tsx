import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { Button } from "@/components/ui/button";
import { 
  Rocket,
  Sparkles, 
  TrendingUp, 
  Bell,
  Home,
  Zap,
  Clock
} from "lucide-react";

const AgencyUpdates = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingWhatsAppButton />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/95 to-primary/5">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 6 + 2 + 'px',
                height: Math.random() * 6 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                background: `hsl(var(--primary) / ${Math.random() * 0.3 + 0.1})`
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10" dir="rtl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Modern Icon Container */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 150
              }}
              className="mb-12 flex justify-center"
            >
              <div className="relative">
                {/* Main Icon Circle */}
                <motion.div
                  className="relative w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center shadow-2xl"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px hsl(var(--primary) / 0.3)",
                      "0 0 40px hsl(var(--primary) / 0.5)",
                      "0 0 20px hsl(var(--primary) / 0.3)"
                    ]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      y: [0, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Rocket className="w-20 h-20 text-primary" />
                  </motion.div>
                </motion.div>
                
                {/* Pulse Rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ 
                      scale: [1, 1.5, 2],
                      opacity: [0.8, 0.4, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <motion.h1 
                className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-l from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% center", "200% center", "0% center"]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                قريباً
              </motion.h1>
              
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-5 h-5 text-primary" />
                </motion.div>
                <span className="text-primary font-medium">تحت التطوير</span>
              </motion.div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-16 space-y-4"
            >
              <p className="text-2xl md:text-3xl font-semibold text-foreground">
                تحديثات الوكالة
              </p>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                نعمل على إطلاق منصة متكاملة لآخر الأخبار والإنجازات والتحديثات الحصرية
              </p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto"
            >
              {[
                { icon: Sparkles, title: "محتوى حصري", desc: "أخبار وتحديثات مميزة" },
                { icon: TrendingUp, title: "تحديثات مستمرة", desc: "متابعة دورية للإنجازات" },
                { icon: Bell, title: "إشعارات فورية", desc: "تنبيهات لحظية" },
                { icon: Clock, title: "سرعة النشر", desc: "تحديثات في الوقت الفعلي" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.8 + index * 0.1,
                    duration: 0.5
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="group p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                >
                  <motion.div
                    className="mb-4 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon className="w-7 h-7 text-primary" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Progress Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mb-12"
            >
              <div className="max-w-md mx-auto p-6 rounded-2xl bg-card/30 border border-border/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-foreground">التقدم في التطوير</p>
                  <motion.p 
                    className="text-lg font-bold text-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                  >
                    80%
                  </motion.p>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                    style={{ backgroundSize: '200% 100%' }}
                    initial={{ width: "0%", backgroundPosition: "0% center" }}
                    animate={{ 
                      width: "80%",
                      backgroundPosition: ["0% center", "200% center", "0% center"]
                    }}
                    transition={{ 
                      width: { duration: 1.5, ease: "easeOut", delay: 1.5 },
                      backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <Button
                size="lg"
                className="gap-2 group px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all"
                onClick={() => window.location.href = '/'}
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                العودة للرئيسية
                <motion.span
                  animate={{ x: [-3, 3, -3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-xl"
                >
                  ←
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AgencyUpdates;
