import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, ArrowLeft, Gift, Star } from "lucide-react";
import { Link } from "react-router-dom";
import vipMembershipCards from "@/assets/platinum-membership-card.jpg";

const MasterMembershipBanner = () => {
  return (
    <section className="py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent z-10" />
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-2 left-4 w-6 h-6 border border-white/30 rounded-full animate-pulse" />
            <div className="absolute top-4 right-8 w-4 h-4 bg-white/20 rounded-full animate-bounce" />
            <div className="absolute bottom-2 left-16 w-3 h-3 bg-white/30 rounded-full animate-pulse" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-center relative z-20 py-6 px-8">
            
            {/* Content Side */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1 text-xs">
                    <Crown className="h-3 w-3 ml-1" />
                    عضوية حصرية
                  </Badge>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-3 w-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
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
                  <span className="text-white mr-2">الحصرية</span>
                </h2>

                <motion.p 
                  className="text-white/90 mb-4 text-sm lg:text-base leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  انضم إلى نخبة الباحثين والأكاديميين واحصل على خدمات متميزة مع امتيازات حصرية
                </motion.p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      asChild
                      size="sm"
                      className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-6 py-2 text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link to="/master-membership">
                        <Sparkles className="h-4 w-4 ml-2" />
                        اشترك الآن
                        <ArrowLeft className="h-4 w-4 mr-2" />
                      </Link>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      asChild
                      size="sm"
                      className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/50 hover:border-white font-medium px-4 py-2 text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link to="/master-membership">
                        <Gift className="h-4 w-4 ml-2" />
                        تفاصيل العضوية
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            
            {/* Image Side */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={vipMembershipCards}
                    alt="بطاقة العضوية البلاتينية"
                    className="w-full h-24 lg:h-32 object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  
                  {/* Floating Platinum Badge */}
                  <motion.div
                    className="absolute top-1 right-1 bg-slate-600 text-white px-2 py-1 rounded-full shadow-lg text-xs font-bold"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  >
                    PLATINUM
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MasterMembershipBanner;