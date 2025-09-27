import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, CheckCircle, ArrowLeft, Sparkles, Award, Users, Zap, Shield, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import premiumMembershipCards from "@/assets/premium-membership-cards.jpg";

const MasterMembershipBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent z-10" />
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white/30 rounded-full animate-pulse" />
            <div className="absolute top-16 right-8 w-6 h-6 border-2 border-white/20 rounded-full animate-bounce" />
            <div className="absolute bottom-8 left-16 w-4 h-4 bg-white/20 rounded-full animate-pulse" />
            <div className="absolute bottom-16 right-16 w-10 h-10 border border-white/30 rounded-full animate-bounce" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center relative z-20">
            
            {/* Content Side */}
            <div className="p-8 lg:p-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2">
                    <Crown className="h-4 w-4 ml-2" />
                    عضوية حصرية
                  </Badge>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-white fill-current" />
                    ))}
                  </div>
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  <motion.span
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="bg-gradient-to-r from-yellow-200 via-white via-amber-200 to-yellow-200 bg-clip-text text-transparent bg-[length:200%_100%]"
                  >
                    عضوية ماستر
                  </motion.span>
                  <br />
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-white"
                  >
                    الحصرية
                  </motion.span>
                </h2>

                <motion.p 
                  className="text-xl text-white/90 mb-6 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    انضم إلى نخبة الباحثين والأكاديميين
                  </motion.span>
                  <br />
                  <motion.span
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                  >
                    واحصل على خدمات متميزة مع امتيازات حصرية
                  </motion.span>
                </motion.p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <motion.div 
                    className="flex items-center gap-3 text-white"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <motion.div 
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </motion.div>
                    <span className="font-medium">خدمات مميزة وحصرية</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-3 text-white"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    <motion.div 
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="h-4 w-4" />
                    </motion.div>
                    <span className="font-medium">أولوية في التنفيذ</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-3 text-white"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                  >
                    <motion.div 
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Award className="h-4 w-4" />
                    </motion.div>
                    <span className="font-medium">استشارات مجانية</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-3 text-white"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                  >
                    <motion.div 
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Shield className="h-4 w-4" />
                    </motion.div>
                    <span className="font-medium">دعم تقني متقدم</span>
                  </motion.div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      asChild
                      size="lg"
                      className="bg-white text-amber-600 hover:bg-gray-100 font-bold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link to="/master-membership">
                        <Sparkles className="h-5 w-5 ml-2" />
                        اشترك الآن
                        <ArrowLeft className="h-5 w-5 mr-2" />
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
                      className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-2 border-white/50 hover:border-white font-bold px-6 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link to="/master-membership">
                        <Gift className="h-5 w-5 ml-2" />
                        تفاصيل العضوية
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.8 }}
                >
                  <motion.span 
                    className="text-white/90 text-lg font-medium"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    ✨ احصل على امتيازات حصرية ✨
                  </motion.span>
                </motion.div>
              </motion.div>
            </div>

            {/* Image Side */}
            <div className="relative p-8 lg:p-12">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={premiumMembershipCards}
                    alt="بطاقات العضوية المميزة"
                    className="w-full h-80 object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  
                  {/* Floating Elements */}
                  <motion.div
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  >
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                      <Crown className="h-4 w-4" />
                      <span>VIP</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-2 rounded-full shadow-lg text-sm font-medium"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  >
                    ✓ نشط الآن
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse" />
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full opacity-30 animate-bounce" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MasterMembershipBanner;