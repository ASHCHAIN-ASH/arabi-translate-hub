import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Sparkles, 
  ArrowLeft,
  Bell,
  TrendingUp,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';

const AffiliateMarketing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50" dir="rtl">
      <Header />
      
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 right-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute bottom-32 left-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-blue-200/30 rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Main Content */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-8 shadow-lg"
            >
              <Clock className="h-12 w-12 text-white" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6">
              <motion.span
                animate={{ backgroundPosition: ["0%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent bg-[length:200%_100%]"
              >
                قريباً
              </motion.span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              برنامج التسويق بالعمولة الجديد قادم قريباً
            </p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center justify-center gap-2 text-slate-500 mb-12"
            >
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span>نعمل على إطلاق تجربة استثنائية</span>
              <Sparkles className="h-5 w-5 text-amber-500" />
            </motion.div>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {[
              {
                icon: TrendingUp,
                title: "عمولات مجزية",
                description: "نسب عمولة تنافسية",
                color: "text-green-600",
                bgColor: "bg-green-100/50"
              },
              {
                icon: Users,
                title: "شبكة واسعة",
                description: "انضم لعائلة المسوقين",
                color: "text-blue-600",
                bgColor: "bg-blue-100/50"
              },
              {
                icon: Award,
                title: "مكافآت خاصة",
                description: "برنامج حوافز متميز",
                color: "text-purple-600",
                bgColor: "bg-purple-100/50"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.5 }}
                      className={`w-14 h-14 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <feature.icon className={`h-7 w-7 ${feature.color}`} />
                    </motion.div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-blue-200/50 shadow-xl">
              <CardContent className="p-8">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg"
                >
                  <Bell className="h-8 w-8 text-white" />
                </motion.div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                  كن أول من يعلم بالإطلاق
                </h2>
                <p className="text-slate-600 mb-6">
                  سنخبرك فور إطلاق البرنامج الجديد مع عروض حصرية للمشتركين الأوائل
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full shadow-lg"
                    onClick={() => window.location.href = '/'}
                  >
                    <Zap className="ml-2 h-5 w-5" />
                    العودة للرئيسية
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Back Button */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/90 transition-all duration-300"
            >
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة للصفحة الرئيسية
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AffiliateMarketing;