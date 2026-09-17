import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/data/legacy/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { 
  Send, 
  User, 
  Phone, 
  Mail, 
  FileText,
  MessageSquare,
  Languages,
  Calendar,
  BookOpen,
  GraduationCap,
  Clock,
  DollarSign
} from 'lucide-react';

interface AcademicTranslationFormData {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  academicLevel: string;
  fieldOfStudy: string;
  documentType: string;
  sourceLanguage: string;
  targetLanguage: string;
  documentTitle: string;
  pageCount: string;
  wordCount: string;
  urgency: string;
  specialRequirements: string;
  certificationNeeded: string;
  budgetRange: string;
  additionalNotes: string;
}

// Schema validation for form data
const academicTranslationFormSchema = z.object({
  fullName: z.string().trim().min(2, { message: 'الاسم الكامل مطلوب ويجب أن يكون حرفين على الأقل' }).max(100),
  email: z.string().trim().email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
  phone: z.string().trim().min(10, { message: 'رقم الهاتف مطلوب' }).max(15),
  organization: z.string().trim().min(2, { message: 'اسم المؤسسة مطلوب' }).max(150),
  position: z.string().trim().optional().or(z.literal('')),
  academicLevel: z.string().trim().min(1, { message: 'يرجى تحديد المستوى الأكاديمي' }),
  fieldOfStudy: z.string().trim().min(1, { message: 'يرجى تحديد مجال الدراسة' }),
  documentType: z.string().trim().min(1, { message: 'يرجى تحديد نوع الوثيقة' }),
  sourceLanguage: z.string().trim().min(1, { message: 'يرجى تحديد اللغة المصدر' }),
  targetLanguage: z.string().trim().min(1, { message: 'يرجى تحديد اللغة المستهدفة' }),
  documentTitle: z.string().trim().min(5, { message: 'عنوان الوثيقة مطلوب' }).max(200),
  pageCount: z.string().trim().optional().or(z.literal('')),
  wordCount: z.string().trim().optional().or(z.literal('')),
  urgency: z.string().trim().min(1, { message: 'يرجى تحديد مستوى الأولوية' }),
  specialRequirements: z.string().trim().optional().or(z.literal('')),
  certificationNeeded: z.string().trim().min(1, { message: 'يرجى تحديد إذا كنت بحاجة لتصديق' }),
  budgetRange: z.string().trim().optional().or(z.literal('')),
  additionalNotes: z.string().trim().max(1000).optional().or(z.literal('')),
});

const AcademicTranslationForm = () => {
  const [formData, setFormData] = useState<AcademicTranslationFormData>({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    academicLevel: '',
    fieldOfStudy: '',
    documentType: '',
    sourceLanguage: '',
    targetLanguage: '',
    documentTitle: '',
    pageCount: '',
    wordCount: '',
    urgency: '',
    specialRequirements: '',
    certificationNeeded: '',
    budgetRange: '',
    additionalNotes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const academicLevels = [
    { value: 'bachelor', label: 'بكالوريوس' },
    { value: 'master', label: 'ماجستير' },
    { value: 'phd', label: 'دكتوراه' },
    { value: 'postdoc', label: 'ما بعد الدكتوراه' },
    { value: 'researcher', label: 'باحث' },
    { value: 'professor', label: 'أستاذ جامعي' },
    { value: 'other', label: 'أخرى' }
  ];

  const fieldsOfStudy = [
    { value: 'medicine', label: 'الطب وعلوم الصحة' },
    { value: 'engineering', label: 'الهندسة والتكنولوجيا' },
    { value: 'social-sciences', label: 'العلوم الاجتماعية' },
    { value: 'education', label: 'التربية وعلم النفس' },
    { value: 'business', label: 'إدارة الأعمال والاقتصاد' },
    { value: 'literature', label: 'الأدب واللغات' },
    { value: 'law', label: 'القانون والشريعة' },
    { value: 'natural-sciences', label: 'العلوم الطبيعية' },
    { value: 'computer-science', label: 'علوم الحاسب وتقنية المعلومات' },
    { value: 'agriculture', label: 'الزراعة والبيئة' },
    { value: 'arts', label: 'الفنون والتصميم' },
    { value: 'other', label: 'مجال آخر' }
  ];

  const documentTypes = [
    { value: 'thesis', label: 'رسالة جامعية (ماجستير/دكتوراه)' },
    { value: 'research-paper', label: 'بحث علمي' },
    { value: 'journal-article', label: 'مقال في مجلة علمية' },
    { value: 'conference-paper', label: 'ورقة مؤتمر' },
    { value: 'book', label: 'كتاب أكاديمي' },
    { value: 'report', label: 'تقرير بحثي' },
    { value: 'proposal', label: 'مقترح بحثي' },
    { value: 'abstract', label: 'ملخص بحثي' },
    { value: 'cv-academic', label: 'سيرة ذاتية أكاديمية' },
    { value: 'certificate', label: 'شهادة أكاديمية' },
    { value: 'transcript', label: 'كشف درجات' },
    { value: 'other', label: 'نوع آخر' }
  ];

  const languages = [
    { value: 'arabic', label: 'العربية' },
    { value: 'english', label: 'الإنجليزية' },
    { value: 'french', label: 'الفرنسية' },
    { value: 'german', label: 'الألمانية' },
    { value: 'spanish', label: 'الإسبانية' },
    { value: 'italian', label: 'الإيطالية' },
    { value: 'chinese', label: 'الصينية' },
    { value: 'japanese', label: 'اليابانية' },
    { value: 'korean', label: 'الكورية' },
    { value: 'russian', label: 'الروسية' },
    { value: 'turkish', label: 'التركية' },
    { value: 'urdu', label: 'الأردية' },
    { value: 'other', label: 'لغة أخرى' }
  ];

  const urgencyLevels = [
    { value: 'standard', label: 'عادي (5-7 أيام)' },
    { value: 'urgent', label: 'عاجل (2-4 أيام)' },
    { value: 'rush', label: 'طارئ (24-48 ساعة)' },
    { value: 'flexible', label: 'مرن' }
  ];

  const budgetRanges = [
    { value: 'under-500', label: 'أقل من 500 ريال' },
    { value: '500-1000', label: '500 - 1,000 ريال' },
    { value: '1000-2500', label: '1,000 - 2,500 ريال' },
    { value: '2500-5000', label: '2,500 - 5,000 ريال' },
    { value: '5000-10000', label: '5,000 - 10,000 ريال' },
    { value: 'above-10000', label: 'أكثر من 10,000 ريال' },
    { value: 'flexible', label: 'مرن حسب الخدمة المطلوبة' }
  ];

  const handleInputChange = (field: keyof AcademicTranslationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      academicTranslationFormSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-academic-translation-inquiry', {
        body: {
          serviceType: 'academic-translation',
          ...formData
        }
      });

      if (error) {
        console.error('Error sending academic translation inquiry:', error);
        toast.error('حدث خطأ في إرسال الطلب، يرجى المحاولة مرة أخرى');
        return;
      }

      toast.success('تم إرسال طلب الترجمة الأكاديمية بنجاح! سنتواصل معك خلال 4 ساعات.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        position: '',
        academicLevel: '',
        fieldOfStudy: '',
        documentType: '',
        sourceLanguage: '',
        targetLanguage: '',
        documentTitle: '',
        pageCount: '',
        wordCount: '',
        urgency: '',
        specialRequirements: '',
        certificationNeeded: '',
        budgetRange: '',
        additionalNotes: ''
      });

    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20" dir="rtl">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm overflow-hidden">
            <CardHeader className="text-center pb-6 sm:pb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Languages className="h-6 sm:h-7 md:h-8 w-6 sm:w-7 md:w-8" />
                <CardTitle className="text-xl sm:text-2xl md:text-3xl font-arabic-formal font-bold text-center">
                  طلب ترجمة أكاديمية متخصصة
                </CardTitle>
              </div>
              <p className="text-blue-100 text-sm sm:text-base md:text-lg px-2 sm:px-0">
                احصل على ترجمة أكاديمية دقيقة ومعتمدة لوثائقك العلمية والبحثية
              </p>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* معلومات العميل */}
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3 sm:mb-4 flex items-center gap-2">
                    <User className="h-4 sm:h-5 w-4 sm:w-5" />
                    معلومات العميل
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2 text-right">
                        <User className="h-4 w-4 text-blue-600" />
                        الاسم الكامل *
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                        className="border-2 border-gray-200 focus:border-blue-500 transition-colors text-right h-11 sm:h-10"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2 text-right">
                        <Phone className="h-4 w-4 text-blue-600" />
                        رقم الهاتف *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="05xxxxxxxx"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className="border-2 border-gray-200 focus:border-blue-500 transition-colors text-left h-11 sm:h-10"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-3 sm:mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2 text-right">
                        <Mail className="h-4 w-4 text-blue-600" />
                        البريد الإلكتروني *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="border-2 border-gray-200 focus:border-blue-500 transition-colors text-left h-11 sm:h-10"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization" className="text-sm font-medium flex items-center gap-2 text-right">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        المؤسسة/الجامعة *
                      </Label>
                      <Input
                        id="organization"
                        type="text"
                        placeholder="اسم المؤسسة أو الجامعة"
                        value={formData.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        required
                        className="border-2 border-gray-200 focus:border-blue-500 transition-colors text-right h-11 sm:h-10"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-3 sm:mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-sm font-medium flex items-center gap-2 text-right">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        المنصب/الدرجة العلمية
                      </Label>
                      <Input
                        id="position"
                        type="text"
                        placeholder="مثال: طالب دكتوراه، أستاذ مساعد، باحث..."
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className="border-2 border-gray-200 focus:border-blue-500 transition-colors text-right h-11 sm:h-10"
                        dir="rtl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2 text-right">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        المستوى الأكاديمي *
                      </Label>
                      <Select value={formData.academicLevel} onValueChange={(value) => handleInputChange('academicLevel', value)} dir="rtl">
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 text-right h-11 sm:h-10" dir="rtl">
                          <SelectValue placeholder="اختر المستوى الأكاديمي" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          {academicLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value} className="text-right">
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* معلومات الوثيقة */}
                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3 sm:mb-4 flex items-center gap-2">
                    <FileText className="h-4 sm:h-5 w-4 sm:w-5" />
                    معلومات الوثيقة
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2 text-right">
                        <BookOpen className="h-4 w-4 text-indigo-600" />
                        مجال الدراسة *
                      </Label>
                      <Select value={formData.fieldOfStudy} onValueChange={(value) => handleInputChange('fieldOfStudy', value)} dir="rtl">
                        <SelectTrigger className="border-2 border-gray-200 focus:border-indigo-500 text-right h-11 sm:h-10" dir="rtl">
                          <SelectValue placeholder="اختر مجال الدراسة" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          {fieldsOfStudy.map((field) => (
                            <SelectItem key={field.value} value={field.value} className="text-right">
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2 text-right">
                        <FileText className="h-4 w-4 text-indigo-600" />
                        نوع الوثيقة *
                      </Label>
                      <Select value={formData.documentType} onValueChange={(value) => handleInputChange('documentType', value)} dir="rtl">
                        <SelectTrigger className="border-2 border-gray-200 focus:border-indigo-500 text-right h-11 sm:h-10" dir="rtl">
                          <SelectValue placeholder="اختر نوع الوثيقة" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          {documentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="text-right">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="documentTitle" className="text-sm font-medium flex items-center gap-2 text-right">
                      <FileText className="h-4 w-4 text-indigo-600" />
                      عنوان الوثيقة *
                    </Label>
                    <Input
                      id="documentTitle"
                      type="text"
                      placeholder="أدخل عنوان الوثيقة المراد ترجمتها"
                      value={formData.documentTitle}
                      onChange={(e) => handleInputChange('documentTitle', e.target.value)}
                      required
                      className="border-2 border-gray-200 focus:border-indigo-500 transition-colors text-right h-11 sm:h-10"
                      dir="rtl"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2 text-right">
                        <Languages className="h-4 w-4 text-indigo-600" />
                        اللغة المصدر *
                      </Label>
                      <Select value={formData.sourceLanguage} onValueChange={(value) => handleInputChange('sourceLanguage', value)} dir="rtl">
                        <SelectTrigger className="border-2 border-gray-200 focus:border-indigo-500 text-right h-11 sm:h-10" dir="rtl">
                          <SelectValue placeholder="اختر اللغة المصدر" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value} className="text-right">
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2 text-right">
                        <Languages className="h-4 w-4 text-indigo-600" />
                        اللغة المستهدفة *
                      </Label>
                      <Select value={formData.targetLanguage} onValueChange={(value) => handleInputChange('targetLanguage', value)} dir="rtl">
                        <SelectTrigger className="border-2 border-gray-200 focus:border-indigo-500 text-right h-11 sm:h-10" dir="rtl">
                          <SelectValue placeholder="اختر اللغة المستهدفة" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value} className="text-right">
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* تفاصيل الترجمة */}
                <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-4 flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    تفاصيل الترجمة
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pageCount" className="text-sm font-medium flex items-center gap-2 text-right">
                        <FileText className="h-4 w-4 text-purple-600" />
                        عدد الصفحات
                      </Label>
                      <Input
                        id="pageCount"
                        type="number"
                        placeholder="عدد الصفحات"
                        value={formData.pageCount}
                        onChange={(e) => handleInputChange('pageCount', e.target.value)}
                        className="border-2 border-gray-200 focus:border-purple-500 transition-colors text-center h-11 sm:h-10"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wordCount" className="text-sm font-medium flex items-center gap-2 text-right">
                        <FileText className="h-4 w-4 text-purple-600" />
                        عدد الكلمات
                      </Label>
                      <Input
                        id="wordCount"
                        type="number"
                        placeholder="عدد الكلمات (تقريبي)"
                        value={formData.wordCount}
                        onChange={(e) => handleInputChange('wordCount', e.target.value)}
                        className="border-2 border-gray-200 focus:border-purple-500 transition-colors text-center h-11 sm:h-10"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2 text-right">
                        <Clock className="h-4 w-4 text-purple-600" />
                        مستوى الأولوية *
                      </Label>
                      <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)} dir="rtl">
                        <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500 text-right h-11 sm:h-10" dir="rtl">
                          <SelectValue placeholder="اختر مستوى الأولوية" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          {urgencyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value} className="text-right">
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2 text-right">
                        <GraduationCap className="h-4 w-4 text-purple-600" />
                        هل تحتاج تصديق؟ *
                      </Label>
                      <Select value={formData.certificationNeeded} onValueChange={(value) => handleInputChange('certificationNeeded', value)} dir="rtl">
                        <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500 text-right h-11 sm:h-10" dir="rtl">
                          <SelectValue placeholder="اختر إذا كنت بحاجة لتصديق" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          <SelectItem value="yes" className="text-right">نعم، أحتاج تصديق رسمي</SelectItem>
                          <SelectItem value="no" className="text-right">لا، ترجمة فقط</SelectItem>
                          <SelectItem value="notarized" className="text-right">تصديق من كاتب العدل</SelectItem>
                          <SelectItem value="embassy" className="text-right">تصديق من السفارة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2 text-right">
                        <DollarSign className="h-4 w-4 text-purple-600" />
                        الميزانية المتوقعة
                      </Label>
                      <Select value={formData.budgetRange} onValueChange={(value) => handleInputChange('budgetRange', value)} dir="rtl">
                        <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500 text-right h-11 sm:h-10" dir="rtl">
                          <SelectValue placeholder="اختر نطاق الميزانية" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          {budgetRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value} className="text-right">
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="specialRequirements" className="text-sm font-medium flex items-center gap-2 text-right">
                      <FileText className="h-4 w-4 text-purple-600" />
                      متطلبات خاصة
                    </Label>
                    <Textarea
                      id="specialRequirements"
                      placeholder="اذكر أي متطلبات خاصة للترجمة (اصطلاحات معينة، تنسيق محدد، مراجع...)..."
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                      rows={3}
                      className="border-2 border-gray-200 focus:border-purple-500 transition-colors resize-none text-right min-h-[80px] sm:min-h-[100px]"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* ملاحظات إضافية */}
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes" className="text-sm font-medium flex items-center gap-2 text-right">
                    <MessageSquare className="h-4 w-4 text-slate-600" />
                    ملاحظات إضافية
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="أي معلومات إضافية تود مشاركتها حول مشروع الترجمة..."
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    rows={3}
                    className="border-2 border-gray-200 focus:border-slate-500 transition-colors resize-none text-right min-h-[80px] sm:min-h-[100px]"
                    dir="rtl"
                  />
                </div>

                {/* زر الإرسال */}
                <motion.div
                  className="pt-4 sm:pt-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-h-[48px] sm:min-h-[52px]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm sm:text-base">جاري إرسال الطلب...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send className="h-4 sm:h-5 w-4 sm:w-5" />
                        <span className="text-sm sm:text-base">طلب الترجمة الأكاديمية</span>
                      </div>
                    )}
                  </Button>
                </motion.div>

                <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3 sm:mt-4 space-y-1 sm:space-y-2 px-2 sm:px-0">
                  <p>* سيقوم فريق الخبراء بالتواصل معك خلال 4 ساعات</p>
                  <p>📚 سنقوم بترجمة دقيقة ومعتمدة لوثائقك الأكاديمية</p>
                  <p>🔒 معلوماتك محمية ولن يتم مشاركتها مع أي طرف ثالث</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default AcademicTranslationForm;