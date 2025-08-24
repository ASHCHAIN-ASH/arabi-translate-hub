import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Scale, 
  Briefcase, 
  Cog, 
  Stethoscope, 
  GraduationCap, 
  Zap, 
  Monitor, 
  BookOpen, 
  Microscope, 
  Building2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ColorShowcase = () => {
  const pageThemes = [
    {
      name: 'الصفحة الرئيسية',
      path: '/',
      icon: Building2,
      description: 'أزرق أكاديمي - يوحي بالثقة والمهنية',
      className: 'page-home',
      colors: ['#4F94FF', '#6BA3FF', '#FF7E3E']
    },
    {
      name: 'الترجمة القانونية',
      path: '/legal-translation',
      icon: Scale,
      description: 'أرجواني - يرمز للعدالة والقانون',
      className: 'page-legal',
      colors: ['#A855F7', '#C084FC', '#9333EA']
    },
    {
      name: 'الترجمة التجارية',
      path: '/business-translation',
      icon: Briefcase,
      description: 'أخضر - يرمز للنمو والازدهار',
      className: 'page-business',
      colors: ['#10B981', '#34D399', '#059669']
    },
    {
      name: 'الترجمة التقنية',
      path: '/technical-translation',
      icon: Cog,
      description: 'برتقالي - يوحي بالابتكار والتقنية',
      className: 'page-technical',
      colors: ['#FF7E3E', '#FF9F5A', '#ED5A0A']
    },
    {
      name: 'الترجمة الطبية',
      path: '/medical-translation',
      icon: Stethoscope,
      description: 'أحمر - يرمز للصحة والطوارئ الطبية',
      className: 'page-medical',
      colors: ['#EF4444', '#F87171', '#DC143C']
    },
    {
      name: 'الترجمة الأكاديمية',
      path: '/academic-translation',
      icon: GraduationCap,
      description: 'زمردي - يوحي بالتعليم والبحث العلمي',
      className: 'page-academic',
      colors: ['#06B6D4', '#22D3EE', '#0891B2']
    },
    {
      name: 'الترجمة الفورية',
      path: '/instant-translation',
      icon: Zap,
      description: 'وردي - يرمز للسرعة والحيوية',
      className: 'page-instant',
      colors: ['#EC4899', '#F472B6', '#DB2777']
    },
    {
      name: 'الترجمة الإعلامية',
      path: '/media-translation',
      icon: Monitor,
      description: 'بنفسجي - يوحي بالإبداع والفنون',
      className: 'page-media',
      colors: ['#8B5CF6', '#A78BFA', '#7C3AED']
    },
    {
      name: 'الترجمة الأدبية',
      path: '/literary-translation',
      icon: BookOpen,
      description: 'ذهبي - يرمز للأدب والثقافة',
      className: 'page-literary',
      colors: ['#F59E0B', '#FBBF24', '#D97706']
    },
    {
      name: 'خدمات البحث العلمي',
      path: '/research-services',
      icon: Microscope,
      description: 'أزرق داكن - يوحي بالعمق العلمي',
      className: 'page-research',
      colors: ['#3B82F6', '#60A5FA', '#2563EB']
    }
  ];

  return (
    <div className="min-h-screen bg-background py-16" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* العنوان */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-arabic-formal font-bold mb-6">
            نظام الألوان المخصص
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            كل صفحة لها نظام ألوان مميز يعكس طبيعة الخدمة ويوفر تجربة بصرية متناسقة
          </p>
        </motion.div>

        {/* شبكة عرض الألوان */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pageThemes.map((theme, index) => {
            const IconComponent = theme.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="h-full"
              >
                <Card className={`relative overflow-hidden bg-white dark:bg-slate-800 border-2 border-transparent hover:shadow-xl transition-all duration-500 h-full ${theme.className}`}>
                  
                  {/* خط علوي ملون */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
                  
                  <CardContent className="p-8 h-full flex flex-col">
                    
                    {/* الأيقونة والعنوان */}
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div 
                        className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg"
                        whileHover={{ 
                          rotate: [0, -5, 5, 0],
                          scale: 1.1
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className="h-8 w-8 text-white" />
                      </motion.div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-arabic-formal font-bold text-foreground mb-2">
                          {theme.name}
                        </h3>
                        <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
                      </div>
                    </div>
                    
                    {/* الوصف */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                      {theme.description}
                    </p>
                    
                    {/* عينة الألوان */}
                    <div className="space-y-4 mb-6">
                      <h4 className="text-sm font-medium text-foreground">عينة الألوان:</h4>
                      <div className="flex gap-2">
                        {theme.colors.map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-8 h-8 rounded-full shadow-sm border border-white/20"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* زر التجربة */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-auto"
                    >
                      <Link to={theme.path}>
                        <Button 
                          className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-white hover:opacity-90 transition-all duration-300"
                          size="lg"
                        >
                          عرض الصفحة
                        </Button>
                      </Link>
                    </motion.div>
                    
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* دعوة للعمل */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-arabic-formal font-bold mb-4">
              تجربة بصرية متميزة
            </h2>
            <p className="text-lg mb-6 opacity-90">
              كل خدمة لها هويتها البصرية الخاصة لتسهيل التنقل وتحسين تجربة المستخدم
            </p>
            <Link to="/">
              <Button 
                size="lg"
                className="bg-white text-slate-800 hover:bg-gray-100 font-medium px-8 py-3"
              >
                العودة للصفحة الرئيسية
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ColorShowcase;