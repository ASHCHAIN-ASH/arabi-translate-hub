import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  BookOpen, 
  Globe, 
  Award, 
  TrendingUp,
  Target,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import { UNIFIED_STATS, STATS_LABELS } from '@/constants/academicStats';
import { cn } from '@/lib/utils';

const ModernStatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: UNIFIED_STATS.studentsServed,
      suffix: '+',
      title: STATS_LABELS.studentsServed,
      description: 'من جميع أنحاء العالم يثقون بخدماتنا',
      color: {
        from: 'from-blue-500',
        to: 'to-cyan-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        text: 'text-blue-600 dark:text-blue-400'
      }
    },
    {
      icon: BookOpen,
      number: UNIFIED_STATS.researchCompleted,
      suffix: '+',
      title: STATS_LABELS.researchCompleted,
      description: 'من الأبحاث والمشاريع الأكاديمية المتميزة',
      color: {
        from: 'from-emerald-500',
        to: 'to-teal-500',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400'
      }
    },
    {
      icon: Globe,
      number: UNIFIED_STATS.countriesServed,
      suffix: '+',
      title: STATS_LABELS.countriesServed,
      description: 'نستقبل الطلبات الأكاديمية من جميع أنحاء العالم',
      color: {
        from: 'from-purple-500',
        to: 'to-pink-500',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        text: 'text-purple-600 dark:text-purple-400'
      }
    },
    {
      icon: Award,
      number: UNIFIED_STATS.satisfactionRate,
      suffix: '%',
      title: STATS_LABELS.satisfactionRate,
      description: 'معدل رضا استثنائي مع ضمان الجودة',
      color: {
        from: 'from-amber-500',
        to: 'to-orange-500',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400'
      }
    }
  ];

  const achievements = [
    {
      icon: TrendingUp,
      title: 'نمو مستمر',
      value: '250%',
      description: 'زيادة سنوية في عدد العملاء'
    },
    {
      icon: Target,
      title: 'دقة التسليم',
      value: '99.8%',
      description: 'التزام بالمواعيد المحددة'
    },
    {
      icon: CheckCircle2,
      title: 'جودة معتمدة',
      value: '100%',
      description: 'من مشاريعنا تجتاز معايير الجودة'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20 relative overflow-hidden" dir="rtl">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full mb-4 border border-blue-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              أرقام تتحدث عن التميز
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="text-slate-800 dark:text-white">إنجازاتنا في </span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              أرقام
            </span>
          </motion.h2>

          <motion.p
            className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            نفخر بثقة آلاف الطلاب والباحثين حول العالم، ونواصل تحقيق التميز الأكاديمي
          </motion.p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={cn(
                  "relative overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl group",
                  stat.color.border,
                  "bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                )}>
                  {/* Gradient overlay */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    stat.color.from,
                    stat.color.to
                  )} style={{ opacity: 0.05 }} />

                  <CardContent className="p-6 relative z-10">
                    {/* Icon */}
                    <motion.div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto",
                        stat.color.bg,
                        "group-hover:scale-110 transition-transform duration-300"
                      )}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className={cn("h-7 w-7", stat.color.text)} />
                    </motion.div>

                    {/* Number */}
                    <motion.div
                      className="mb-3"
                      initial={{ scale: 0.5 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                      <div className={cn(
                        "text-5xl font-bold text-center",
                        stat.color.text
                      )}>
                        <AnimatedCounter end={stat.number} suffix={stat.suffix} duration={2.5} />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 text-center mb-2">
                      {stat.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                      {stat.description}
                    </p>
                  </CardContent>

                  {/* Bottom accent line */}
                  <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300",
                    stat.color.from,
                    stat.color.to
                  )} />
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Achievements */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <motion.div
                key={index}
                className="relative group"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {achievement.value}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ModernStatsSection;