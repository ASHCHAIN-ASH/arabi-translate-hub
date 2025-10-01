import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User, Mail, Phone, FileText, Calendar, 
  MessageSquare, Send, CheckCircle2, Loader2
} from 'lucide-react';

interface EditingServiceFormProps {
  serviceTitle: string;
  serviceType: string;
  specializations?: string[];
  documentTypes?: string[];
}

export const EditingServiceForm = ({
  serviceTitle,
  serviceType,
  specializations = ['أدبي', 'علمي', 'تقني', 'أكاديمي', 'تجاري', 'قانوني'],
  documentTypes = ['بحث', 'رسالة ماجستير', 'أطروحة دكتوراه', 'كتاب', 'مقال', 'تقرير', 'وثيقة']
}: EditingServiceFormProps) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    specialization: '',
    documentType: '',
    fullName: '',
    email: '',
    phone: '',
    wordCount: '',
    deadline: '',
    details: ''
  });

  const normalizeArabicNumbers = (str: string) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    let result = str;
    arabicNumbers.forEach((arabic, index) => {
      result = result.replace(new RegExp(arabic, 'g'), englishNumbers[index]);
    });
    
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error('الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }

    if (formData.details && formData.details.length < 30) {
      toast.error('التفاصيل يجب أن تكون 30 حرفاً على الأقل');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('send-research-service-request', {
        body: {
          serviceTitle,
          serviceType,
          ...formData,
          phone: normalizeArabicNumbers(formData.phone)
        }
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success('تم إرسال طلبك بنجاح! سنتواصل معك قريباً');
      
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          specialization: '',
          documentType: '',
          fullName: '',
          email: '',
          phone: '',
          wordCount: '',
          deadline: '',
          details: ''
        });
      }, 3000);

    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'حدث خطأ في إرسال الطلب');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="p-12 text-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="mx-auto w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle2 className="w-16 h-16 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">
            تم إرسال طلبك بنجاح! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            سيتم التواصل معك خلال 24 ساعة
          </p>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="p-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {serviceTitle}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            املأ النموذج وسنتواصل معك في أقرب وقت
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* نوع الخدمة */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                التخصص *
              </Label>
              <Select value={formData.specialization} onValueChange={(v) => setFormData(prev => ({ ...prev, specialization: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر التخصص" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                نوع الوثيقة *
              </Label>
              <Select value={formData.documentType} onValueChange={(v) => setFormData(prev => ({ ...prev, documentType: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الوثيقة" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* معلومات الاتصال */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                الاسم الكامل *
              </Label>
              <Input
                required
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني *
              </Label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4" />
                رقم الهاتف *
              </Label>
              <Input
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="05xxxxxxxx"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                عدد الكلمات التقريبي
              </Label>
              <Input
                value={formData.wordCount}
                onChange={(e) => setFormData(prev => ({ ...prev, wordCount: e.target.value }))}
                placeholder="مثال: 5000 كلمة"
              />
            </div>
          </div>

          {/* تفاصيل العمل */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              الموعد النهائي *
            </Label>
            <Input
              required
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4" />
              تفاصيل إضافية (30 حرف على الأقل)
            </Label>
            <Textarea
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              placeholder="أضف تفاصيل عن العمل المطلوب، المتطلبات الخاصة، أو أي ملاحظات..."
              rows={5}
              className="resize-none"
            />
            {formData.details && (
              <p className={`text-sm mt-2 ${formData.details.length >= 30 ? 'text-green-600' : 'text-red-600'}`}>
                {formData.details.length} / 30 حرف
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 w-5 h-5 animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              <>
                إرسال الطلب
                <Send className="mr-2 w-5 h-5" />
              </>
            )}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};
