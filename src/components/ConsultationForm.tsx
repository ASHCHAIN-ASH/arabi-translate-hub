import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  FileText, 
  Clock,
  Send,
  CheckCircle 
} from 'lucide-react';
import { supabase } from '@/data/legacy/client';
import { toast } from 'sonner';
import { z } from 'zod';

interface ConsultationFormData {
  fullName: string;
  email: string;
  phone: string;
  university: string;
  academicLevel: string;
  specialization: string;
  serviceType: string;
  projectTitle: string;
  projectDescription: string;
  deadline: string;
  additionalNotes: string;
}

const consultationSchema = z.object({
  fullName: z.string().trim().min(2, { message: 'الاسم يجب أن يكون حرفين على الأقل' }).max(100, { message: 'الاسم طويل جداً' }),
  email: z.string().trim().email({ message: 'بريد إلكتروني غير صالح' }).max(255),
  phone: z.string().trim().min(8, { message: 'رقم الهاتف قصير جداً' }).max(20, { message: 'رقم الهاتف طويل جداً' }).regex(/^[0-9+\-\s()]+$/, { message: 'رقم هاتف غير صالح' }),
  university: z.string().trim().max(100).optional().or(z.literal('')),
  academicLevel: z.enum(['bachelor','master','phd','researcher','other']).optional().or(z.literal('')),
  specialization: z.string().trim().max(100).optional().or(z.literal('')),
  serviceType: z.string().trim().min(1, { message: 'يرجى اختيار نوع الخدمة' }),
  projectTitle: z.string().trim().max(150).optional().or(z.literal('')),
  projectDescription: z.string().trim().max(1000).optional().or(z.literal('')),
  deadline: z.string().trim().optional().or(z.literal('')),
  additionalNotes: z.string().trim().max(500).optional().or(z.literal('')),
});

const ConsultationForm = () => {
  const [formData, setFormData] = useState<ConsultationFormData>({
    fullName: '',
    email: '',
    phone: '',
    university: '',
    academicLevel: '',
    specialization: '',
    serviceType: '',
    projectTitle: '',
    projectDescription: '',
    deadline: '',
    additionalNotes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ConsultationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق والتحقق من صحة البيانات
    const parsed = consultationSchema.safeParse(formData);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'يرجى التحقق من الحقول';
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-academic-expertise-inquiry', {
        body: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          university: formData.university,
          academicLevel: formData.academicLevel,
          specialization: formData.specialization,
          serviceType: formData.serviceType,
          projectTitle: formData.projectTitle,
          projectDescription: formData.projectDescription,
          deadline: formData.deadline,
          additionalNotes: formData.additionalNotes
        }
      });

      if (error) {
        console.error('Error sending consultation inquiry:', error);
        toast.error('حدث خطأ في إرسال الطلب. يرجى المحاولة لاحقاً');
        return;
      }

      toast.success('تم إرسال طلب الاستشارة بنجاح! سنتواصل معك قريباً');
      
      // إعادة تعيين النموذج
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        university: '',
        academicLevel: '',
        specialization: '',
        serviceType: '',
        projectTitle: '',
        projectDescription: '',
        deadline: '',
        additionalNotes: ''
      });

    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ في إرسال الطلب. يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20" dir="rtl">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 sm:mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200 dark:border-blue-700 rounded-full text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
            استشارة أكاديمية متخصصة
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-arabic-formal font-bold mb-3 sm:mb-4 px-2">
            احصل على استشارة أكاديمية مجانية
          </h2>
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            تواصل مع خبرائنا الأكاديميين للحصول على استشارة مخصصة لمشروعك البحثي أو الأكاديمي
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm mx-2 sm:mx-4 lg:mx-0">
            <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                نموذج طلب الاستشارة الأكاديمية
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* المعلومات الشخصية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      الاسم الكامل *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required
                      className="h-10 sm:h-12 text-right text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      البريد الإلكتروني *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="h-10 sm:h-12 text-right text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      رقم الهاتف *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+966XXXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      className="h-10 sm:h-12 text-right text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                      <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      الجامعة / المؤسسة التعليمية
                    </Label>
                    <Input
                      id="university"
                      type="text"
                      placeholder="اسم الجامعة أو المؤسسة"
                      value={formData.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      className="h-10 sm:h-12 text-right text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* المعلومات الأكاديمية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm font-semibold">المستوى الأكاديمي</Label>
                    <Select value={formData.academicLevel || undefined} onValueChange={(value) => handleInputChange('academicLevel', value)}>
                      <SelectTrigger className="h-10 sm:h-12 text-right text-sm sm:text-base">
                        <SelectValue placeholder="اختر المستوى الأكاديمي" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachelor">بكالوريوس</SelectItem>
                        <SelectItem value="master">ماجستير</SelectItem>
                        <SelectItem value="phd">دكتوراه</SelectItem>
                        <SelectItem value="researcher">باحث</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm font-semibold">التخصص</Label>
                    <Input
                      type="text"
                      placeholder="مجال التخصص"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      className="h-10 sm:h-12 text-right text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* نوع الخدمة المطلوبة */}
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    نوع الخدمة المطلوبة *
                  </Label>
                  <Select value={formData.serviceType || undefined} onValueChange={(value) => handleInputChange('serviceType', value)}>
                    <SelectTrigger className="h-10 sm:h-12 text-right text-sm sm:text-base">
                      <SelectValue placeholder="اختر نوع الخدمة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thesis-writing">كتابة الرسائل العلمية</SelectItem>
                      <SelectItem value="research-paper">إعداد البحوث العلمية</SelectItem>
                      <SelectItem value="data-analysis">تحليل البيانات الإحصائية</SelectItem>
                      <SelectItem value="literature-review">مراجعة الأدبيات</SelectItem>
                      <SelectItem value="academic-consultation">استشارة أكاديمية عامة</SelectItem>
                      <SelectItem value="proofreading">مراجعة وتدقيق</SelectItem>
                      <SelectItem value="translation">ترجمة أكاديمية</SelectItem>
                      <SelectItem value="other">خدمة أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* تفاصيل المشروع */}
                <div className="space-y-2">
                  <Label htmlFor="projectTitle" className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    عنوان المشروع / البحث
                  </Label>
                  <Input
                    id="projectTitle"
                    type="text"
                    placeholder="عنوان المشروع أو البحث"
                    value={formData.projectTitle}
                    onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                    className="h-10 sm:h-12 text-right text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectDescription" className="text-xs sm:text-sm font-semibold">
                    وصف المشروع / طبيعة المساعدة المطلوبة
                  </Label>
                  <Textarea
                    id="projectDescription"
                    placeholder="اكتب وصفاً مفصلاً للمشروع أو نوع المساعدة التي تحتاجها..."
                    value={formData.projectDescription}
                    onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                    rows={4}
                    className="resize-none text-right text-sm sm:text-base"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      الموعد النهائي المطلوب
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      className="h-10 sm:h-12 text-right text-sm sm:text-base"
                    />
                  </div>

                  <div className="md:pt-6 lg:pt-8">
                    <div className="text-xs sm:text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 sm:p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 inline ml-2" />
                      سنتواصل معك خلال 24 ساعة كحد أقصى
                    </div>
                  </div>
                </div>

                {/* ملاحظات إضافية */}
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes" className="text-xs sm:text-sm font-semibold">
                    ملاحظات إضافية
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="أي معلومات إضافية تود مشاركتها معنا..."
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    rows={3}
                    className="resize-none text-right text-sm sm:text-base"
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
                    className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                        <span className="text-sm sm:text-base">جاري الإرسال...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base">إرسال طلب الاستشارة</span>
                      </div>
                    )}
                  </Button>
                </motion.div>

                {/* معلومات الخصوصية */}
                <div className="text-center text-xs sm:text-sm text-muted-foreground pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="px-2">
                    بإرسال هذا النموذج، فإنك توافق على سياسة الخصوصية الخاصة بنا.
                    جميع المعلومات المرسلة ستبقى سرية ولن تُشارك مع أطراف ثالثة.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ConsultationForm;