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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/95 to-primary/5 py-12 md:py-20">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Animated Grid Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px), linear-gradient(hsl(var(--primary)) 1px, transparent 1px)`,
              backgroundSize: '80px 80px'
            }}
            animate={{
              backgroundPosition: ['0px 0px', '80px 80px']
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-sm"
              style={{
                width: Math.random() * 8 + 3 + 'px',
                height: Math.random() * 8 + 3 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                background: `hsl(var(--${i % 2 === 0 ? 'primary' : 'accent'}) / ${Math.random() * 0.4 + 0.2})`
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.3, 1]
              }}
              transition={{
                duration: 5 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10" dir="rtl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-6xl mx-auto"
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
              className="mb-8 sm:mb-10 md:mb-12 flex justify-center"
            >
              <div className="relative">
                {/* Main Icon Circle */}
                <motion.div
                  className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 backdrop-blur-xl border-2 border-primary/30 flex items-center justify-center shadow-2xl"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px hsl(var(--primary) / 0.3)",
                      "0 0 50px hsl(var(--primary) / 0.5)",
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
                    <Rocket className="w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-24 text-primary" />
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
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.7,
                      ease: "easeOut"
                    }}
                  />
                ))}

                {/* Floating Icons */}
                {[Sparkles, TrendingUp, Bell].map((Icon, i) => (
                  <motion.div
                    key={i}
                    className="absolute hidden md:block"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: [0, Math.cos((i * 120) * Math.PI / 180) * 100],
                      y: [0, Math.sin((i * 120) * Math.PI / 180) * 100],
                      rotate: [0, 360],
                      scale: [0.8, 1, 0.8],
                      opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6 sm:mb-8 md:mb-10 px-4"
            >
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-l from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent leading-tight"
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
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm shadow-lg"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </motion.div>
                <span className="text-primary font-medium text-sm sm:text-base">تحت التطوير</span>
              </motion.div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-10 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4 px-4"
            >
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                تحديثات الوكالة
              </p>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                نعمل على إطلاق منصة متكاملة لآخر الأخبار والإنجازات والتحديثات الحصرية من وكالتنا
              </p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-12 md:mb-16 max-w-6xl mx-auto px-4"
            >
              {[
                { icon: Sparkles, title: "محتوى حصري", desc: "أخبار وتحديثات مميزة", gradient: "from-primary/10 to-accent/10" },
                { icon: TrendingUp, title: "تحديثات مستمرة", desc: "متابعة دورية للإنجازات", gradient: "from-accent/10 to-primary/10" },
                { icon: Bell, title: "إشعارات فورية", desc: "تنبيهات لحظية", gradient: "from-primary/10 to-primary/20" },
                { icon: Clock, title: "سرعة النشر", desc: "تحديثات في الوقت الفعلي", gradient: "from-accent/10 to-accent/20" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.8 + index * 0.1,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -8,
                    transition: { duration: 0.2 }
                  }}
                  className={`group relative p-5 sm:p-6 rounded-2xl bg-gradient-to-br ${item.gradient} border border-border/50 backdrop-blur-sm hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden`}
                >
                  {/* Hover Effect Background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div
                      className="mb-3 sm:mb-4 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 shadow-lg"
                      whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                    </motion.div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5 sm:mb-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>

                  {/* Corner Decoration */}
                  <div className="absolute top-0 left-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-colors duration-300" />
                </motion.div>
              ))}
            </motion.div>

            {/* Progress Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mb-8 sm:mb-10 md:mb-12 px-4"
            >
              <div className="max-w-md mx-auto p-5 sm:p-6 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </motion.div>
                    <p className="text-sm sm:text-base font-semibold text-foreground">التقدم في التطوير</p>
                  </div>
                  <motion.p 
                    className="text-xl sm:text-2xl font-bold text-primary tabular-nums"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2, type: "spring" }}
                  >
                    85%
                  </motion.p>
                </div>
                
                <div className="relative h-3 sm:h-4 bg-muted rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <motion.div
                    className="relative h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full shadow-lg"
                    style={{ backgroundSize: '200% 100%' }}
                    initial={{ width: "0%", backgroundPosition: "0% center" }}
                    animate={{ 
                      width: "85%",
                      backgroundPosition: ["0% center", "200% center", "0% center"]
                    }}
                    transition={{ 
                      width: { duration: 2, ease: "easeOut", delay: 1.8 },
                      backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ['-100%', '200%']
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                      }}
                    />
                  </motion.div>
                </div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="text-xs sm:text-sm text-muted-foreground text-center mt-3"
                >
                  قريباً جداً...
                </motion.p>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="px-4"
            >
              <Button
                size="lg"
                className="gap-2 sm:gap-3 group px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
                onClick={() => window.location.href = '/'}
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                <span>العودة للرئيسية</span>
                <motion.span
                  animate={{ x: [-3, 3, -3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-lg sm:text-xl"
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
