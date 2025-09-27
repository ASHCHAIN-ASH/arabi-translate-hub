import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, ArrowLeft, Gift, Star, Zap, Award } from "lucide-react";
import { Link } from "react-router-dom";
import threeMembershipCards from "@/assets/three-membership-cards.jpg";

const MasterMembershipBanner = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-l from-indigo-600 via-blue-600 to-purple-700 rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-gradient-xy"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5" />
            {/* Floating Elements */}
            <motion.div
              className="absolute top-4 left-8 w-2 h-2 bg-white/40 rounded-full"
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-8 right-12 w-3 h-3 bg-white/30 rounded-full"
              animate={{ 
                y: [0, -15, 0],
                x: [0, 5, 0],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              className="absolute bottom-6 left-16 w-4 h-4 border border-white/25 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.25, 0.6, 0.25]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
              className="absolute bottom-8 right-20 w-1.5 h-1.5 bg-white/35 rounded-full"
              animate={{ 
                y: [0, -8, 0],
                opacity: [0.35, 0.7, 0.35]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-center relative z-20 py-6 lg:py-8 px-4 lg:px-10">
            
            {/* Content Side - 3 columns */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                {/* Header Badge */}
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(255, 255, 255, 0.3)",
                        "0 0 0 8px rgba(255, 255, 255, 0.1)",
                        "0 0 0 0 rgba(255, 255, 255, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Badge className="bg-white/15 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-2 text-sm font-medium transition-all duration-300">
                      <Crown className="h-4 w-4 ml-2 text-yellow-300" />
                      عضوية حصرية ومتميزة
                    </Badge>
                  </motion.div>
                  
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + star * 0.1, duration: 0.3 }}
                      >
                        <Star className="h-4 w-4 text-yellow-400 fill-current drop-shadow-sm" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Main Title */}
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                  <motion.span
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="bg-gradient-to-r from-yellow-200 via-white via-yellow-300 to-amber-200 bg-clip-text text-transparent bg-[length:300%_100%] drop-shadow-sm"
                    style={{
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}
                  >
                    عضوية ماستر
                  </motion.span>
                  <br />
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-white/95 drop-shadow-sm"
                  >
                    الأكاديمية الحصرية
                  </motion.span>
                </h2>

                {/* Description */}
                <motion.p 
                  className="text-white/90 mb-6 text-base lg:text-lg leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <motion.span
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    انضم إلى نخبة الباحثين والأكاديميين المتميزين
                  </motion.span>
                  <br />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    transition={{ duration: 1, delay: 1.2 }}
                  >
                    واحصل على خدمات فائقة الجودة مع امتيازات حصرية ودعم متخصص
                  </motion.span>
                </motion.p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: Zap, text: "أولوية عالية في التنفيذ", delay: 1 },
                    { icon: Award, text: "استشارات أكاديمية مجانية", delay: 1.1 },
                    { icon: Gift, text: "خصومات حصرية متميزة", delay: 1.2 },
                    { icon: Crown, text: "دعم تقني متقدم 24/7", delay: 1.3 }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 text-white/95"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: feature.delay }}
                    >
                      <motion.div 
                        className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20"
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
                        animate={{ 
                          boxShadow: [
                            "0 0 0 0 rgba(255, 255, 255, 0.2)",
                            "0 0 0 4px rgba(255, 255, 255, 0.1)",
                            "0 0 0 0 rgba(255, 255, 255, 0.2)"
                          ]
                        }}
                        transition={{ 
                          boxShadow: { duration: 2, repeat: Infinity, delay: index * 0.5 }
                        }}
                      >
                        <feature.icon className="h-4 w-4 drop-shadow-sm" />
                      </motion.div>
                      <span className="font-medium text-sm lg:text-base drop-shadow-sm">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      asChild
                      size="lg"
                      className="bg-white text-blue-700 hover:bg-gray-50 font-bold px-8 py-3 text-base shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
                    >
                      <Link to="/master-membership">
                        <Sparkles className="h-5 w-5 ml-2" />
                        اشترك الآن
                        <ArrowLeft className="h-5 w-5 mr-2" />
                      </Link>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.7 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      asChild
                      size="lg"
                      variant="outline"
                      className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border-2 border-white/40 hover:border-white/60 font-bold px-6 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link to="/master-membership">
                        <Gift className="h-5 w-5 ml-2" />
                        تفاصيل العضوية
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                {/* Bottom Info */}
                <motion.div
                  className="mt-6 flex items-center gap-6 text-white/80 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2 }}
                >
                  <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>متاح الآن - انضم لآلاف الأعضاء</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Cards Side - 2 columns */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Three Membership Cards */}
                <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 justify-center items-center px-2">
                  {[
                    {
                      name: 'الفضية',
                      nameEn: 'SILVER',
                      gradient: 'from-gray-400 via-gray-500 to-gray-600',
                      chipColor: 'bg-yellow-400',
                      delay: 0,
                      price: '1,200'
                    },
                    {
                      name: 'الذهبية',
                      nameEn: 'GOLD',
                      gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
                      chipColor: 'bg-yellow-500',
                      delay: 0.2,
                      popular: true,
                      price: '2,200'
                    },
                    {
                      name: 'البلاتينية',
                      nameEn: 'PLATINUM',
                      gradient: 'from-slate-400 via-slate-500 to-slate-600',
                      chipColor: 'bg-slate-400',
                      delay: 0.4,
                      price: '3,600'
                    }
                  ].map((card, index) => (
                    <motion.div
                      key={card.name}
                      initial={{ opacity: 0, y: 50, rotateY: -30 }}
                      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                      whileHover={{ 
                        y: -8,
                        rotateY: 3,
                        rotateX: 3,
                        scale: 1.03,
                        transition: { duration: 0.3 }
                      }}
                      transition={{ 
                        duration: 0.8, 
                        delay: card.delay,
                        type: "spring",
                        stiffness: 100
                      }}
                      viewport={{ once: true }}
                      className="relative group flex-1 min-w-0"
                      style={{ perspective: "1000px" }}
                    >
                      {/* Popular Badge */}
                      {card.popular && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.5, duration: 0.5 }}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold z-20 shadow-lg"
                        >
                          <span className="hidden sm:inline">الأكثر طلباً</span>
                          <span className="sm:hidden">🔥</span>
                        </motion.div>
                      )}

                      {/* Card Container */}
                      <div className={`
                        relative w-full aspect-[1.586/1] max-w-[120px] sm:max-w-[140px] lg:max-w-[160px] mx-auto rounded-lg sm:rounded-xl overflow-hidden
                        bg-gradient-to-br ${card.gradient}
                        shadow-lg sm:shadow-xl group-hover:shadow-2xl transition-all duration-500
                        border border-white/40 backdrop-blur-sm
                        transform-gpu
                      `}>
                        {/* Card Background Effects */}
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="absolute top-0 right-0 w-6 sm:w-8 h-6 sm:h-8 bg-white/10 rounded-full -translate-y-3 sm:-translate-y-4 translate-x-3 sm:translate-x-4" />
                          <div className="absolute bottom-0 left-0 w-4 sm:w-6 h-4 sm:h-6 bg-white/8 rounded-full translate-y-2 sm:translate-y-3 -translate-x-2 sm:-translate-x-3" />
                        </div>

                        {/* Animated Background Pattern */}
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
                            backgroundSize: "4px 4px sm:6px sm:6px"
                          }}
                        />

                        {/* Card Content - Reorganized Layout */}
                        <div className="absolute inset-0 flex flex-col justify-between p-1 sm:p-1.5 text-white z-10">
                          {/* Top Section */}
                          <div className="flex justify-between items-start">
                            <div className="text-xs font-bold opacity-90">
                              <span className="hidden sm:inline">ماستر</span>
                              <span className="sm:hidden text-xs">M</span>
                            </div>
                            <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-300" />
                          </div>
                          
                          {/* Center Section - Main Info */}
                          <div className="text-center space-y-0.5">
                            <motion.div 
                              className="text-xs sm:text-sm font-bold drop-shadow-sm"
                              animate={{
                                opacity: [0.8, 1, 0.8]
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: index * 0.3
                              }}
                            >
                              {card.name}
                            </motion.div>
                            <motion.div 
                              className="text-yellow-300 font-bold text-xs sm:text-sm drop-shadow-sm"
                              animate={{
                                scale: [1, 1.05, 1]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.4
                              }}
                            >
                              {card.price} ﷼
                            </motion.div>
                          </div>
                          
                          {/* Bottom Section */}
                          <div className="flex justify-between items-end text-xs">
                            <motion.div 
                              className="font-mono tracking-wider opacity-90"
                              animate={{
                                opacity: [0.7, 1, 0.7]
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: index * 0.3
                              }}
                            >
                              <span className="hidden sm:inline">**** {(1234 + index).toString()}</span>
                              <span className="sm:hidden">****</span>
                            </motion.div>
                            <div className="opacity-70">12/25</div>
                          </div>
                        </div>

                        {/* Contactless Symbol */}
                        <motion.div
                          className="absolute bottom-2.5 sm:bottom-3 left-1 sm:left-1.5 text-white/60 z-10"
                          animate={{
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: index * 0.7
                          }}
                        >
                          <div className="text-xs">📶</div>
                        </motion.div>

                        {/* Glowing Edge Effect */}
                        <motion.div
                          className="absolute inset-0 rounded-lg sm:rounded-xl"
                          animate={{
                            boxShadow: [
                              `0 0 8px rgba(255, 255, 255, 0.2)`,
                              `0 0 16px rgba(255, 255, 255, 0.4)`,
                              `0 0 8px rgba(255, 255, 255, 0.2)`
                            ]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.4
                          }}
                        />

                        {/* Holographic Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg sm:rounded-xl"
                          animate={{
                            x: ["-100%", "100%"]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 1 + 2,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Cards Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="text-center mt-3 sm:mt-4"
                >
                  <motion.span 
                    className="text-white/90 text-xs sm:text-sm font-medium px-2"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨ اختر المستوى المناسب لك ✨
                  </motion.span>
                </motion.div>

                {/* Floating Elements Around Cards */}
                <motion.div
                  className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-sm"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-sm"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                />
              </motion.div>
            </div>
          </div>

          {/* Bottom Accent Line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 2 }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default MasterMembershipBanner;