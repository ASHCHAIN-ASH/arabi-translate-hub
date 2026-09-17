import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/data/legacy/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User, Mail, Phone, FileText, Calendar, 
  MessageSquare, Send, CheckCircle2, Loader2, Sparkles
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
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-full max-w-2xl mx-auto"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-8 sm:p-12 text-center relative">
              {/* Background Animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-green-500/10"
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.1), rgba(34, 197, 94, 0.1))',
                    'linear-gradient(225deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.1))',
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.1), rgba(34, 197, 94, 0.1))'
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    duration: 0.8 
                  }}
                  className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-6 shadow-2xl"
                >
                  <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                >
                  تم إرسال طلبك بنجاح! 🎉
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-base sm:text-lg mb-6"
                >
                  سيتم التواصل معك خلال 24 ساعة
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-2 text-sm text-emerald-600"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>شكراً لثقتك بنا</span>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="overflow-hidden shadow-2xl">
        <div className="relative">
          {/* Header Background */}
          <div className="absolute inset-0 h-32 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10" />
          
          <CardContent className="relative p-6 sm:p-8 lg:p-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8 sm:mb-10"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {serviceTitle}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                املأ النموذج وسنتواصل معك في أقرب وقت
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* نوع الخدمة */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label className="flex items-center gap-2 mb-2 text-sm sm:text-base">
                    <FileText className="w-4 h-4" />
                    التخصص *
                  </Label>
                  <Select value={formData.specialization} onValueChange={(v) => setFormData(prev => ({ ...prev, specialization: v }))}>
                    <SelectTrigger className="h-11 sm:h-12">
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map(spec => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Label className="flex items-center gap-2 mb-2 text-sm sm:text-base">
                    <FileText className="w-4 h-4" />
                    نوع الوثيقة *
                  </Label>
                  <Select value={formData.documentType} onValueChange={(v) => setFormData(prev => ({ ...prev, documentType: v }))}>
                    <SelectTrigger className="h-11 sm:h-12">
                      <SelectValue placeholder="اختر نوع الوثيقة" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>

              {/* معلومات الاتصال */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label className="flex items-center gap-2 mb-2 text-sm sm:text-base">
                    <User className="w-4 h-4" />
                    الاسم الكامل *
                  </Label>
                  <Input
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="أدخل اسمك الكامل"
                    className="h-11 sm:h-12"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Label className="flex items-center gap-2 mb-2 text-sm sm:text-base">
                    <Mail className="w-4 h-4" />
                    البريد الإلكتروني *
                  </Label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="example@email.com"
                    className="h-11 sm:h-12"
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label className="flex items-center gap-2 mb-2 text-sm sm:text-base">
                    <Phone className="w-4 h-4" />
                    رقم الهاتف *
                  </Label>
                  <Input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="05xxxxxxxx"
                    className="h-11 sm:h-12"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Label className="flex items-center gap-2 mb-2 text-sm sm:text-base">
                    <FileText className="w-4 h-4" />
                    عدد الكلمات التقريبي
                  </Label>
                  <Input
                    value={formData.wordCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, wordCount: e.target.value }))}
                    placeholder="مثال: 5000 كلمة"
                    className="h-11 sm:h-12"
                  />
                </motion.div>
              </div>

              {/* تفاصيل العمل */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label className="flex items-center gap-2 mb-2 text-sm sm:text-base">
                  <Calendar className="w-4 h-4" />
                  الموعد النهائي *
                </Label>
                <Input
                  required
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-11 sm:h-12"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <Label className="flex items-center gap-2 mb-2 text-sm sm:text-base">
                  <MessageSquare className="w-4 h-4" />
                  تفاصيل إضافية (30 حرف على الأقل)
                </Label>
                <Textarea
                  value={formData.details}
                  onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                  placeholder="أضف تفاصيل عن العمل المطلوب، المتطلبات الخاصة، أو أي ملاحظات..."
                  rows={5}
                  className="resize-none text-sm sm:text-base"
                />
                <AnimatePresence>
                  {formData.details && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`text-xs sm:text-sm mt-2 ${formData.details.length >= 30 ? 'text-green-600' : 'text-orange-600'}`}
                    >
                      {formData.details.length} / 30 حرف
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 shadow-lg hover:shadow-xl transition-all"
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري الإرسال...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        إرسال الطلب
                        <Send className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};