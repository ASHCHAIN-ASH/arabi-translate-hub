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
  User, Mail, Phone, FileText, GraduationCap,
  Send, CheckCircle2, Loader2, Upload
} from 'lucide-react';

const SPECIALIZATIONS = [
  'الطب البشري',
  'طب الأسنان',
  'الصيدلة',
  'التمريض',
  'الهندسة المدنية',
  'الهندسة الكهربائية',
  'الهندسة الميكانيكية',
  'الهندسة الكيميائية',
  'هندسة الحاسب',
  'علوم الحاسب',
  'تقنية المعلومات',
  'إدارة الأعمال',
  'المحاسبة',
  'التسويق',
  'الإدارة المالية',
  'الموارد البشرية',
  'القانون',
  'الشريعة الإسلامية',
  'العلوم السياسية',
  'التربية وعلم النفس',
  'التربية الخاصة',
  'رياض الأطفال',
  'اللغة العربية',
  'اللغة الإنجليزية',
  'الترجمة',
  'الإعلام والاتصال',
  'العلاقات العامة',
  'علم الاجتماع',
  'الخدمة الاجتماعية',
  'علم النفس',
  'الكيمياء',
  'الفيزياء',
  'الأحياء',
  'الرياضيات',
  'الإحصاء',
  'الاقتصاد',
  'العمارة',
  'التصميم الداخلي',
  'السياحة والضيافة',
  'إدارة المستشفيات',
  'الصحة العامة',
  'تخصص آخر'
];

interface ResearchServiceFormProps {
  serviceTitle: string;
  serviceType: string;
}

export const ResearchServiceForm = ({ serviceTitle, serviceType }: ResearchServiceFormProps) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    details: ''
  });

  const normalizeArabicNumbers = (str: string) => {
    const arabicToEnglish: { [key: string]: string } = {
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    };
    return str.replace(/[٠-٩]/g, (digit) => arabicToEnglish[digit]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || formData.fullName.length < 2) {
      toast.error('الاسم يجب أن يكون حرفين على الأقل');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      toast.error('البريد الإلكتروني غير صحيح');
      return;
    }

    const normalizedPhone = normalizeArabicNumbers(formData.phone);
    const phoneRegex = /^05\d{8}$/;
    if (!normalizedPhone || !phoneRegex.test(normalizedPhone)) {
      toast.error('رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام');
      return;
    }

    if (!formData.specialization) {
      toast.error('يرجى اختيار التخصص الجامعي');
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
          fullName: '',
          email: '',
          phone: '',
          specialization: '',
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
        <Card className="p-12 text-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-0 shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
          >
            <CheckCircle2 className="w-16 h-16 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">
            تم استلام طلبك بنجاح! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            سنتواصل معك قريباً عبر البريد الإلكتروني أو الهاتف
          </p>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="p-8 md:p-10 bg-card/95 backdrop-blur-sm shadow-2xl border-0">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            اطلب الخدمة الآن
          </h2>
          <p className="text-muted-foreground text-lg">
            {serviceTitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* الاسم الكامل */}
          <div>
            <Label className="flex items-center gap-2 mb-2 text-base font-semibold">
              <User className="w-5 h-5 text-primary" />
              الاسم الكامل *
            </Label>
            <Input
              required
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="أدخل اسمك الكامل"
              className="h-12 text-base"
            />
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <Label className="flex items-center gap-2 mb-2 text-base font-semibold">
              <Mail className="w-5 h-5 text-primary" />
              البريد الإلكتروني *
            </Label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="example@email.com"
              className="h-12 text-base"
            />
          </div>

          {/* رقم الهاتف */}
          <div>
            <Label className="flex items-center gap-2 mb-2 text-base font-semibold">
              <Phone className="w-5 h-5 text-primary" />
              رقم الهاتف *
            </Label>
            <Input
              required
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="05xxxxxxxx"
              className="h-12 text-base"
              maxLength={10}
              pattern="^05\d{8}$"
            />
          </div>

          {/* التخصص الجامعي */}
          <div>
            <Label className="flex items-center gap-2 mb-2 text-base font-semibold">
              <GraduationCap className="w-5 h-5 text-primary" />
              التخصص الجامعي *
            </Label>
            <Select
              value={formData.specialization}
              onValueChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="اختر تخصصك الجامعي" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {SPECIALIZATIONS.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* تفاصيل الطلب */}
          <div>
            <Label className="flex items-center gap-2 mb-2 text-base font-semibold">
              <FileText className="w-5 h-5 text-primary" />
              تفاصيل الطلب
            </Label>
            <Textarea
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              placeholder="أضف تفاصيل طلبك هنا... (30 حرفاً على الأقل إذا أردت إضافة تفاصيل)"
              rows={5}
              className="text-base resize-none"
              minLength={30}
            />
            <p className="text-sm text-muted-foreground mt-2">
              {formData.details.length > 0 && (
                <span className={formData.details.length >= 30 ? 'text-emerald-600' : 'text-amber-600'}>
                  {formData.details.length} / 30 حرفاً على الأقل
                </span>
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              💡 يمكنك إرفاق الملفات لاحقاً عبر البريد الإلكتروني
            </p>
          </div>

          {/* زر الإرسال */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 shadow-lg transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 w-6 h-6 animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              <>
                إرسال الطلب
                <Send className="mr-2 w-6 h-6" />
              </>
            )}
          </Button>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              📧 سيتم إرسال تأكيد الطلب إلى بريدك الإلكتروني
            </p>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};
