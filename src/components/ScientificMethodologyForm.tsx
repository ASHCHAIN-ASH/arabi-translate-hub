import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { 
  Send, 
  User, 
  Phone, 
  Mail, 
  FileText,
  MessageSquare,
  Microscope,
  Calendar,
  BookOpen,
  Target,
  BarChart3,
  Settings
} from 'lucide-react';

interface MethodologyFormData {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  researchField: string;
  methodologyType: string;
  researchTitle: string;
  researchObjectives: string;
  expectedDuration: string;
  targetPopulation: string;
  dataCollectionMethods: string;
  analysisApproach: string;
  ethicalConsiderations: string;
  budgetRange: string;
  additionalNotes: string;
}

// Schema validation for form data
const methodologyFormSchema = z.object({
  fullName: z.string().trim().min(2, { message: 'الاسم الكامل مطلوب ويجب أن يكون حرفين على الأقل' }).max(100),
  email: z.string().trim().email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
  phone: z.string().trim().min(10, { message: 'رقم الهاتف مطلوب' }).max(15),
  organization: z.string().trim().min(2, { message: 'اسم المؤسسة مطلوب' }).max(150),
  position: z.string().trim().optional().or(z.literal('')),
  researchField: z.string().trim().min(1, { message: 'يرجى تحديد مجال البحث' }),
  methodologyType: z.string().trim().min(1, { message: 'يرجى اختيار نوع المنهجية' }),
  researchTitle: z.string().trim().min(5, { message: 'عنوان البحث مطلوب' }).max(200),
  researchObjectives: z.string().trim().min(10, { message: 'أهداف البحث مطلوبة' }).max(500),
  expectedDuration: z.string().trim().optional().or(z.literal('')),
  targetPopulation: z.string().trim().optional().or(z.literal('')),
  dataCollectionMethods: z.string().trim().optional().or(z.literal('')),
  analysisApproach: z.string().trim().optional().or(z.literal('')),
  ethicalConsiderations: z.string().trim().optional().or(z.literal('')),
  budgetRange: z.string().trim().optional().or(z.literal('')),
  additionalNotes: z.string().trim().max(1000).optional().or(z.literal('')),
});

const ScientificMethodologyForm = () => {
  const [formData, setFormData] = useState<MethodologyFormData>({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    researchField: '',
    methodologyType: '',
    researchTitle: '',
    researchObjectives: '',
    expectedDuration: '',
    targetPopulation: '',
    dataCollectionMethods: '',
    analysisApproach: '',
    ethicalConsiderations: '',
    budgetRange: '',
    additionalNotes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const researchFields = [
    { value: 'medical', label: 'الطب وعلوم الصحة' },
    { value: 'engineering', label: 'الهندسة والتكنولوجيا' },
    { value: 'social-sciences', label: 'العلوم الاجتماعية' },
    { value: 'education', label: 'التربية وعلم النفس' },
    { value: 'business', label: 'إدارة الأعمال والاقتصاد' },
    { value: 'literature', label: 'الأدب واللغات' },
    { value: 'law', label: 'القانون والشريعة' },
    { value: 'natural-sciences', label: 'العلوم الطبيعية' },
    { value: 'computer-science', label: 'علوم الحاسب وتقنية المعلومات' },
    { value: 'agriculture', label: 'الزراعة والبيئة' },
    { value: 'other', label: 'مجال آخر' }
  ];

  const methodologyTypes = [
    { value: 'quantitative', label: 'منهجية كمية (Quantitative)' },
    { value: 'qualitative', label: 'منهجية نوعية (Qualitative)' },
    { value: 'mixed-methods', label: 'منهجية مختلطة (Mixed Methods)' },
    { value: 'experimental', label: 'منهجية تجريبية (Experimental)' },
    { value: 'case-study', label: 'دراسة حالة (Case Study)' },
    { value: 'survey', label: 'منهجية مسحية (Survey)' },
    { value: 'ethnographic', label: 'منهجية إثنوغرافية' },
    { value: 'action-research', label: 'بحث إجرائي (Action Research)' },
    { value: 'systematic-review', label: 'مراجعة منهجية' },
    { value: 'meta-analysis', label: 'التحليل البعدي (Meta-Analysis)' }
  ];

  const budgetRanges = [
    { value: 'under-5000', label: 'أقل من 5,000 ريال' },
    { value: '5000-15000', label: '5,000 - 15,000 ريال' },
    { value: '15000-30000', label: '15,000 - 30,000 ريال' },
    { value: '30000-50000', label: '30,000 - 50,000 ريال' },
    { value: '50000-100000', label: '50,000 - 100,000 ريال' },
    { value: 'above-100000', label: 'أكثر من 100,000 ريال' },
    { value: 'flexible', label: 'مرن حسب الخدمة المطلوبة' }
  ];

  const durationOptions = [
    { value: '1-3months', label: '1-3 أشهر' },
    { value: '3-6months', label: '3-6 أشهر' },
    { value: '6-12months', label: '6-12 شهر' },
    { value: '1-2years', label: '1-2 سنة' },
    { value: 'above-2years', label: 'أكثر من سنتين' },
    { value: 'flexible', label: 'مرن' }
  ];

  const handleInputChange = (field: keyof MethodologyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      methodologyFormSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-methodology-inquiry', {
        body: {
          serviceType: 'scientific-methodology',
          ...formData
        }
      });

      if (error) {
        console.error('Error sending methodology inquiry:', error);
        toast.error('حدث خطأ في إرسال الطلب، يرجى المحاولة مرة أخرى');
        return;
      }

      toast.success('تم إرسال طلب المنهجية العلمية بنجاح! سنتواصل معك خلال 4 ساعات.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        position: '',
        researchField: '',
        methodologyType: '',
        researchTitle: '',
        researchObjectives: '',
        expectedDuration: '',
        targetPopulation: '',
        dataCollectionMethods: '',
        analysisApproach: '',
        ethicalConsiderations: '',
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
    <section className="py-16 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 dark:from-emerald-950/20 dark:to-blue-950/20" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Microscope className="h-8 w-8" />
                <CardTitle className="text-3xl font-arabic-formal font-bold">
                  طلب تصميم منهجية علمية
                </CardTitle>
              </div>
              <p className="text-emerald-100 text-lg">
                احصل على منهجية علمية موثوقة ومتطورة مصممة خصيصاً لبحثك
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* معلومات الباحث */}
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    معلومات الباحث
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                        الاسم الكامل *
                        <User className="h-4 w-4 text-emerald-600" />
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                        className="border-2 border-gray-200 focus:border-emerald-500 transition-colors text-right"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                        رقم الهاتف *
                        <Phone className="h-4 w-4 text-emerald-600" />
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="05xxxxxxxx"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className="border-2 border-gray-200 focus:border-emerald-500 transition-colors text-right"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                        البريد الإلكتروني *
                        <Mail className="h-4 w-4 text-emerald-600" />
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="border-2 border-gray-200 focus:border-emerald-500 transition-colors text-left"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization" className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                        المؤسسة/الجامعة *
                        <BookOpen className="h-4 w-4 text-emerald-600" />
                      </Label>
                      <Input
                        id="organization"
                        type="text"
                        placeholder="اسم المؤسسة أو الجامعة"
                        value={formData.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        required
                        className="border-2 border-gray-200 focus:border-emerald-500 transition-colors text-right"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="position" className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                      المنصب/الدرجة العلمية
                      <Settings className="h-4 w-4 text-emerald-600" />
                    </Label>
                    <Input
                      id="position"
                      type="text"
                      placeholder="مثال: طالب دكتوراه، أستاذ مساعد، باحث..."
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="border-2 border-gray-200 focus:border-emerald-500 transition-colors text-right"
                    />
                  </div>
                </div>

                {/* معلومات البحث */}
                <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    معلومات البحث
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                        مجال البحث *
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </Label>
                      <Select value={formData.researchField} onValueChange={(value) => handleInputChange('researchField', value)}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 text-right">
                          <SelectValue placeholder="اختر مجال البحث" />
                        </SelectTrigger>
                        <SelectContent>
                          {researchFields.map((field) => (
                            <SelectItem key={field.value} value={field.value} className="text-right">
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                        نوع المنهجية *
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                      </Label>
                      <Select value={formData.methodologyType} onValueChange={(value) => handleInputChange('methodologyType', value)}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 text-right">
                          <SelectValue placeholder="اختر نوع المنهجية" />
                        </SelectTrigger>
                        <SelectContent>
                          {methodologyTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="text-right">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="researchTitle" className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                      عنوان البحث *
                      <FileText className="h-4 w-4 text-blue-600" />
                    </Label>
                    <Input
                      id="researchTitle"
                      type="text"
                      placeholder="أدخل عنوان البحث أو الموضوع المقترح"
                      value={formData.researchTitle}
                      onChange={(e) => handleInputChange('researchTitle', e.target.value)}
                      required
                      className="border-2 border-gray-200 focus:border-blue-500 transition-colors text-right"
                    />
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="researchObjectives" className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                      أهداف البحث *
                      <Target className="h-4 w-4 text-blue-600" />
                    </Label>
                    <Textarea
                      id="researchObjectives"
                      placeholder="اشرح الأهداف الرئيسية لبحثك والنتائج المتوقعة..."
                      value={formData.researchObjectives}
                      onChange={(e) => handleInputChange('researchObjectives', e.target.value)}
                      required
                      rows={4}
                      className="border-2 border-gray-200 focus:border-blue-500 transition-colors resize-none text-right"
                    />
                  </div>
                </div>

                {/* تفاصيل المنهجية */}
                <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-4 flex items-center gap-2">
                    <Microscope className="h-5 w-5" />
                    تفاصيل المنهجية
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                        المدة المتوقعة
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </Label>
                      <Select value={formData.expectedDuration} onValueChange={(value) => handleInputChange('expectedDuration', value)}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500 text-right">
                          <SelectValue placeholder="اختر المدة المتوقعة" />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map((duration) => (
                            <SelectItem key={duration.value} value={duration.value} className="text-right">
                              {duration.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                        الميزانية المتوقعة
                        <Settings className="h-4 w-4 text-purple-600" />
                      </Label>
                      <Select value={formData.budgetRange} onValueChange={(value) => handleInputChange('budgetRange', value)}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500 text-right">
                          <SelectValue placeholder="اختر نطاق الميزانية" />
                        </SelectTrigger>
                        <SelectContent>
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
                    <Label htmlFor="targetPopulation" className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                      العينة المستهدفة
                      <User className="h-4 w-4 text-purple-600" />
                    </Label>
                    <Textarea
                      id="targetPopulation"
                      placeholder="اوصف العينة أو المجتمع المستهدف للدراسة..."
                      value={formData.targetPopulation}
                      onChange={(e) => handleInputChange('targetPopulation', e.target.value)}
                      rows={3}
                      className="border-2 border-gray-200 focus:border-purple-500 transition-colors resize-none text-right"
                    />
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="dataCollectionMethods" className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                      طرق جمع البيانات
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                    </Label>
                    <Textarea
                      id="dataCollectionMethods"
                      placeholder="اذكر الطرق المفضلة لجمع البيانات (استبيان، مقابلات، ملاحظة...)..."
                      value={formData.dataCollectionMethods}
                      onChange={(e) => handleInputChange('dataCollectionMethods', e.target.value)}
                      rows={3}
                      className="border-2 border-gray-200 focus:border-purple-500 transition-colors resize-none text-right"
                    />
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="analysisApproach" className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                      منهج التحليل
                      <Settings className="h-4 w-4 text-purple-600" />
                    </Label>
                    <Textarea
                      id="analysisApproach"
                      placeholder="اشرح المنهج المطلوب لتحليل البيانات (إحصائي، نوعي، مختلط...)..."
                      value={formData.analysisApproach}
                      onChange={(e) => handleInputChange('analysisApproach', e.target.value)}
                      rows={3}
                      className="border-2 border-gray-200 focus:border-purple-500 transition-colors resize-none text-right"
                    />
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="ethicalConsiderations" className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                      الاعتبارات الأخلاقية
                      <FileText className="h-4 w-4 text-purple-600" />
                    </Label>
                    <Textarea
                      id="ethicalConsiderations"
                      placeholder="اذكر أي اعتبارات أخلاقية خاصة بالبحث..."
                      value={formData.ethicalConsiderations}
                      onChange={(e) => handleInputChange('ethicalConsiderations', e.target.value)}
                      rows={3}
                      className="border-2 border-gray-200 focus:border-purple-500 transition-colors resize-none text-right"
                    />
                  </div>
                </div>

                {/* ملاحظات إضافية */}
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes" className="text-sm font-medium flex items-center gap-2 justify-end text-right">
                    ملاحظات إضافية
                    <MessageSquare className="h-4 w-4 text-slate-600" />
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="أي معلومات إضافية تود مشاركتها حول بحثك أو متطلبات خاصة..."
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    rows={4}
                    className="border-2 border-gray-200 focus:border-slate-500 transition-colors resize-none text-right"
                  />
                </div>

                {/* زر الإرسال */}
                <motion.div
                  className="pt-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 text-lg font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري إرسال الطلب...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 flex-row-reverse">
                        طلب تصميم المنهجية العلمية
                        <Send className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </motion.div>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                  <p>* سيقوم فريق الخبراء بالتواصل معك خلال 4 ساعات</p>
                  <p className="mt-1">🔬 سنقوم بتصميم منهجية علمية شاملة ومناسبة لبحثك</p>
                  <p className="mt-1">🔒 معلوماتك محمية ولن يتم مشاركتها مع أي طرف ثالث</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ScientificMethodologyForm;