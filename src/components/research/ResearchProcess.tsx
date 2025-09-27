import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Target, Rocket, CheckCircle } from 'lucide-react';

const processSteps = [
  {
    step: "01",
    title: "استشارة مجانية متخصصة",
    description: "جلسة استشارة شاملة مع خبراء أكاديميين لفهم احتياجاتك البحثية وتحديد الخطة المثلى",
    icon: <Lightbulb className="h-6 w-6" />,
    color: "bg-blue-500"
  },
  {
    step: "02",
    title: "وضع خطة العمل التفصيلية",
    description: "إعداد خطة عمل مفصلة مع جدول زمني واضح وتحديد المراحل والمسؤوليات",
    icon: <Target className="h-6 w-6" />,
    color: "bg-orange-500"
  },
  {
    step: "03",
    title: "التنفيذ المتقن والمتابعة",
    description: "فريق متخصص من الخبراء ينفذ العمل بأعلى معايير الجودة الأكاديمية مع متابعة مستمرة",
    icon: <Rocket className="h-6 w-6" />,
    color: "bg-green-500"
  },
  {
    step: "04",
    title: "المراجعة والتسليم النهائي",
    description: "مراجعة شاملة متعددة المستويات وتسليم العمل مع ضمان الجودة والدعم المستمر",
    icon: <CheckCircle className="h-6 w-6" />,
    color: "bg-purple-500"
  }
];

export const ResearchProcess = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-blue-900 dark:to-teal-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <Badge variant="secondary" className="mb-4 px-6 py-2 text-lg">
            🔄 منهجية العمل
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
            خطوات مدروسة نحو النجاح
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            منهجية عمل مُحكمة ومجربة تضمن تحقيق أفضل النتائج في كل مرحلة من مراحل مشروعكم البحثي
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-teal-500 transform -translate-x-1/2"></div>

          <div className="space-y-16">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`flex items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } flex-col lg:gap-16 gap-8`}
              >
                {/* Content Card */}
                <div className="flex-1 max-w-md">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`${step.color} p-4 rounded-2xl text-white shadow-lg`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-4xl font-bold text-gray-400/50 mb-2">
                          {step.step}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </motion.div>
                </div>

                {/* Timeline Circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  className="relative z-10 hidden lg:block"
                >
                  <div className={`${step.color} w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white font-bold text-xl border-4 border-white`}>
                    {step.step}
                  </div>
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
                </motion.div>

                {/* Spacer for alignment */}
                <div className="flex-1 max-w-md hidden lg:block"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};