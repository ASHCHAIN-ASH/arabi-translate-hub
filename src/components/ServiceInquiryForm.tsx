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
import { 
  Send, 
  User, 
  Phone, 
  Mail, 
  Languages, 
  Calendar, 
  DollarSign,
  FileText,
  MessageSquare
} from 'lucide-react';

interface ServiceInquiryFormProps {
  serviceType: string;
  serviceName: string;
  serviceIcon?: React.ReactNode;
  showLanguageFields?: boolean;
  showFileSizeField?: boolean;
  className?: string;
}

const ServiceInquiryForm: React.FC<ServiceInquiryFormProps> = ({
  serviceType,
  serviceName,
  serviceIcon,
  showLanguageFields = true,
  showFileSizeField = false,
  className = ""
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sourceLanguage: '',
    targetLanguage: '',
    projectDetails: '',
    deadline: '',
    budget: '',
    fileSize: '',
    additionalNotes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const languages = [
    { value: 'arabic', label: 'العربية' },
    { value: 'english', label: 'الإنجليزية' },
    { value: 'french', label: 'الفرنسية' },
    { value: 'spanish', label: 'الإسبانية' },
    { value: 'german', label: 'الألمانية' },
    { value: 'italian', label: 'الإيطالية' },
    { value: 'portuguese', label: 'البرتغالية' },
    { value: 'russian', label: 'الروسية' },
    { value: 'chinese', label: 'الصينية' },
    { value: 'japanese', label: 'اليابانية' },
    { value: 'korean', label: 'الكورية' },
    { value: 'hindi', label: 'الهندية' },
    { value: 'urdu', label: 'الأردية' },
    { value: 'turkish', label: 'التركية' },
    { value: 'persian', label: 'الفارسية' },
    { value: 'other', label: 'أخرى' }
  ];

  const budgetRanges = [
    { value: 'under-500', label: 'أقل من 500 ريال' },
    { value: '500-1000', label: '500 - 1000 ريال' },
    { value: '1000-2000', label: '1000 - 2000 ريال' },
    { value: '2000-5000', label: '2000 - 5000 ريال' },
    { value: '5000-10000', label: '5000 - 10000 ريال' },
    { value: 'above-10000', label: 'أكثر من 10000 ريال' },
    { value: 'flexible', label: 'مرن حسب الجودة' }
  ];

  const fileSizeOptions = [
    { value: '1-5', label: '1-5 صفحات/دقائق' },
    { value: '6-20', label: '6-20 صفحة/دقيقة' },
    { value: '21-50', label: '21-50 صفحة/دقيقة' },
    { value: '51-100', label: '51-100 صفحة/دقيقة' },
    { value: '100+', label: 'أكثر من 100 صفحة/دقيقة' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-service-inquiry', {
        body: {
          serviceType,
          ...formData
        }
      });

      if (error) {
        console.error('Error sending inquiry:', error);
        toast.error('حدث خطأ في إرسال الطلب، يرجى المحاولة مرة أخرى');
        return;
      }

      toast.success('تم إرسال طلبك بنجاح! سنتواصل معك خلال 4 ساعات.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        sourceLanguage: '',
        targetLanguage: '',
        projectDetails: '',
        deadline: '',
        budget: '',
        fileSize: '',
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
    <section className={`py-16 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <div className="flex items-center justify-center gap-3 mb-4">
                {serviceIcon}
                <CardTitle className="text-3xl font-arabic-formal font-bold">
                  اطلب خدمة {serviceName}
                </CardTitle>
              </div>
              <p className="text-blue-100 text-lg">
                احصل على عرض سعر مجاني ومخصص لاحتياجاتك
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* معلومات الاتصال */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      الاسم الكامل *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
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
                      className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
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
                    className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* حقول اللغات */}
                {showLanguageFields && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Languages className="h-4 w-4 text-blue-600" />
                        ترجمة من
                      </Label>
                      <Select value={formData.sourceLanguage} onValueChange={(value) => handleInputChange('sourceLanguage', value)}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="اختر اللغة المصدر" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Languages className="h-4 w-4 text-blue-600" />
                        ترجمة إلى
                      </Label>
                      <Select value={formData.targetLanguage} onValueChange={(value) => handleInputChange('targetLanguage', value)}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="اختر اللغة المطلوبة" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* حجم الملف/المشروع */}
                {showFileSizeField && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      حجم المشروع
                    </Label>
                    <Select value={formData.fileSize} onValueChange={(value) => handleInputChange('fileSize', value)}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="اختر حجم المشروع" />
                      </SelectTrigger>
                      <SelectContent>
                        {fileSizeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* تفاصيل المشروع */}
                <div className="space-y-2">
                  <Label htmlFor="projectDetails" className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    تفاصيل المشروع
                  </Label>
                  <Textarea
                    id="projectDetails"
                    placeholder="اشرح لنا تفاصيل مشروعك ومتطلباتك الخاصة..."
                    value={formData.projectDetails}
                    onChange={(e) => handleInputChange('projectDetails', e.target.value)}
                    rows={4}
                    className="border-2 border-gray-200 focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                {/* الموعد النهائي والميزانية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      الموعد المطلوب
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      className="border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      الميزانية المتوقعة
                    </Label>
                    <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="اختر نطاق الميزانية" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* ملاحظات إضافية */}
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes" className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    ملاحظات إضافية
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="أي معلومات إضافية تود مشاركتها معنا..."
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    rows={3}
                    className="border-2 border-gray-200 focus:border-blue-500 transition-colors resize-none"
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
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري الإرسال...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send className="h-5 w-5" />
                        إرسال الطلب مجاناً
                      </div>
                    )}
                  </Button>
                </motion.div>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                  <p>* سنتواصل معك خلال 4 ساعات كحد أقصى</p>
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

export default ServiceInquiryForm;