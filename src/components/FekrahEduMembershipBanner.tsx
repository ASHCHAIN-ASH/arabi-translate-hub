import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, ArrowRight, Gift, Star, Zap, Award, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FekrahEduMembershipBanner = () => {
  const membershipTiers = [
    {
      name: 'الفضية',
      nameEn: 'SILVER',
      gradient: 'from-gray-400 via-gray-500 to-gray-600',
      price: '1,200',
      features: ['خصم 15%', 'دعم عادي', 'خدمات محدودة']
    },
    {
      name: 'الذهبية',
      nameEn: 'GOLD',
      gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
      price: '2,200',
      features: ['خصم 25%', 'دعم أولوية', 'جميع الخدمات'],
      popular: true
    },
    {
      name: 'البلاتينية',
      nameEn: 'PLATINUM',
      gradient: 'from-slate-300 via-slate-400 to-slate-500',
      price: '3,600',
      features: ['خصم 40%', 'دعم VIP', 'خدمات حصرية']
    }
  ];

  const benefits = [
    { icon: Zap, text: "أولوية عالية في التنفيذ", color: "text-blue-400" },
    { icon: Award, text: "استشارات أكاديمية مجانية", color: "text-emerald-400" },
    { icon: Gift, text: "خصومات حصرية متميزة", color: "text-purple-400" },
    { icon: Shield, text: "دعم تقني متقدم 24/7", color: "text-amber-400" }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-slate-950 dark:via-violet-950 dark:to-purple-950 relative overflow-hidden">
      
      {/* خلفية متحركة */}
      <div className="absolute inset-0 opacity-30">
        <motion.div 
          className="absolute top-20 right-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-purple-400/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center p-8 md:p-12">
            
            {/* المحتوى النصي */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* الشارة */}
                <div className="flex items-center gap-4 mb-6 flex-wrap">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md px-4 py-2 text-sm font-medium">
                    <Crown className="h-4 w-4 ml-2 text-yellow-300" />
                    عضوية حصرية ومتميزة
                  </Badge>
                  
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + star * 0.1, duration: 0.3 }}
                      >
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* العنوان */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  <motion.span
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="bg-gradient-to-r from-yellow-200 via-white to-amber-200 bg-clip-text text-transparent bg-[length:300%_100%]"
                  >
                    عضوية FekrahEdu
                  </motion.span>
                  <br />
                  <span className="text-white/95">
                    الأكاديمية الحصرية
                  </span>
                </h2>

                {/* الوصف */}
                <p className="text-white/90 mb-8 text-lg leading-relaxed">
                  انضم إلى نخبة الباحثين والأكاديميين المتميزين واحصل على خدمات فائقة الجودة مع امتيازات حصرية ودعم متخصص
                </p>

                {/* المزايا */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {benefits.map((benefit, index) => {
                    const IconComponent = benefit.icon;
                    return (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 text-white/95"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                          <IconComponent className={`h-5 w-5 ${benefit.color}`} />
                        </div>
                        <span className="font-medium text-base">{benefit.text}</span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* الأزرار */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      asChild
                      size="lg"
                      className="bg-white text-blue-700 hover:bg-gray-50 font-bold px-8 shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
                    >
                      <Link to="/fekrahedu-membership">
                        <Sparkles className="h-5 w-5 ml-2" />
                        اشترك الآن
                        <ArrowRight className="h-5 w-5 mr-2" />
                      </Link>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      asChild
                      size="lg"
                      variant="outline"
                      className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border-2 border-white/40 font-bold px-8 w-full sm:w-auto"
                    >
                      <Link to="/fekrahedu-membership">
                        <Gift className="h-5 w-5 ml-2" />
                        تفاصيل العضوية
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                {/* معلومة إضافية */}
                <motion.div
                  className="mt-6 flex items-center gap-2 text-white/80 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>متاح الآن - انضم لآلاف الأعضاء المتميزين</span>
                </motion.div>
              </motion.div>
            </div>
            
            {/* بطاقات العضويات */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="grid grid-cols-3 gap-4">
                  {membershipTiers.map((tier, index) => (
                    <motion.div
                      key={tier.name}
                      initial={{ opacity: 0, y: 50, rotateY: -20 }}
                      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                      whileHover={{ 
                        y: -12,
                        rotateY: 5,
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                      transition={{ 
                        duration: 0.8, 
                        delay: index * 0.2,
                        type: "spring",
                        stiffness: 100
                      }}
                      viewport={{ once: true }}
                      className="relative group"
                      style={{ perspective: "1000px" }}
                    >
                      {/* شارة الأكثر طلباً */}
                      {tier.popular && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.5, duration: 0.5 }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-20 shadow-lg"
                        >
                          🔥
                        </motion.div>
                      )}

                      {/* البطاقة */}
                      <div className={`
                        relative w-full aspect-[1.586/1] rounded-xl overflow-hidden
                        bg-gradient-to-br ${tier.gradient}
                        shadow-xl group-hover:shadow-2xl transition-all duration-500
                        border-2 border-white/40
                        transform-gpu
                      `}>
                        {/* تأثيرات الخلفية */}
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                          <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/8 rounded-full translate-y-6 -translate-x-6" />
                        </div>

                        {/* نمط متحرك */}
                        <motion.div
                          className="absolute inset-0 opacity-20"
                          animate={{
                            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                          }}
                          transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          style={{
                            background: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                            backgroundSize: "6px 6px"
                          }}
                        />

                        {/* محتوى البطاقة */}
                        <div className="absolute inset-0 flex flex-col justify-between p-3 text-white z-10">
                          {/* الأعلى */}
                          <div className="flex justify-between items-start">
                            <div className="text-xs font-bold opacity-90">ماستر</div>
                            <Crown className="w-3 h-3 text-yellow-300" />
                          </div>
                          
                          {/* الوسط */}
                          <div className="text-center space-y-1">
                            <div className="text-lg font-bold">{tier.name}</div>
                            <div className="text-xs opacity-80">{tier.nameEn}</div>
                            <div className="text-sm font-bold bg-white/20 rounded-full px-2 py-0.5 inline-block">
                              {tier.price} ر.س
                            </div>
                          </div>
                          
                          {/* الأسفل */}
                          <div className="space-y-0.5">
                            {tier.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-1 text-xs">
                                <CheckCircle className="w-2.5 h-2.5" />
                                <span className="text-xs">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FekrahEduMembershipBanner;
