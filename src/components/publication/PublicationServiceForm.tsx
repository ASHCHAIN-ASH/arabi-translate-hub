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
  User, Mail, Phone, FileText, BookOpen, 
  MessageSquare, Send, CheckCircle2, Loader2, Sparkles, GraduationCap
} from 'lucide-react';

interface PublicationServiceFormProps {
  serviceTitle: string;
  serviceType: string;
  researchFields?: string[];
  publicationTypes?: string[];
}

export const PublicationServiceForm = ({
  serviceTitle,
  serviceType,
  researchFields = ['علوم إنسانية', 'علوم طبيعية', 'هندسة', 'طب', 'إدارة أعمال', 'قانون', 'تربية', 'علوم اجتماعية'],
  publicationTypes = ['مقال علمي', 'ورقة مؤتمر', 'فصل كتاب', 'كتاب', 'مراجعة منهجية', 'دراسة حالة']
}: PublicationServiceFormProps) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    researchField: '',
    publicationType: '',
    fullName: '',
    email: '',
    phone: '',
    researchTitle: '',
    targetJournal: '',
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

    if (formData.details && formData.details.length < 50) {
      toast.error('التفاصيل يجب أن تكون 50 حرفاً على الأقل');
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
          researchField: '',
          publicationType: '',
          fullName: '',
          email: '',
          phone: '',
          researchTitle: '',
          targetJournal: '',
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
                className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10"
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
                    'linear-gradient(225deg, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))',
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))'
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
                  className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-2xl"
                >
                  <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
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
                  className="flex items-center justify-center gap-2 text-sm text-blue-600"
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
          <div className="absolute inset-0 h-32 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10" />
          
          <CardContent className="relative p-6 sm:p-8 lg:p-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8 sm:mb-10"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm px-6 py-3 rounded-full mb-4">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-semibold">نشر أكاديمي متميز</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {serviceTitle}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                املأ النموذج وسنتواصل معك في أقرب وقت
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* نوع البحث والمجال */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label className="flex items-center gap-2 mb-2 text-sm sm:text-base">
                    <BookOpen className="w-4 h-4" />
                    المجال البحثي *
                  </Label>
                  <Select value={formData.researchField} onValueChange={(v) => setFormData(prev => ({ ...prev, researchField: v }))}>
                    <SelectTrigger className="h-11 sm:h-12">
                      <SelectValue placeholder="اختر المجال البحثي" />
                    </SelectTrigger>
                    <SelectContent>
                      {researchFields.map(field => (
                        <SelectItem key={field} value={field}>{field}</SelectItem>
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
                    نوع المنشور *
                  </Label>
                  <Select value={formData.publicationType} onValueChange={(v) => setFormData(prev => ({ ...prev, publicationType: v }))}>
                    <SelectTrigger className="h-11 sm:h-12">
                      <SelectValue placeholder="اختر نوع المنشور" />
                    </SelectTrigger>
                    <SelectContent>
                      {publicationTypes.map(type => (
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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

              {/* تفاصيل البحث */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Label className="flex items-center gap-2 mb-2 text-sm sm:text-base">
                  <FileText className="w-4 h-4" />
                  عنوان البحث *
                </Label>
                <Input
                  required
                  value={formData.researchTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, researchTitle: e.target.value }))}
                  placeholder="عنوان البحث المراد نشره"
                  className="h-11 sm:h-12"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label className="flex items-center gap-2 mb-2 text-sm sm:text-base">
                  <BookOpen className="w-4 h-4" />
                  المجلة المستهدفة (اختياري)
                </Label>
                <Input
                  value={formData.targetJournal}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetJournal: e.target.value }))}
                  placeholder="اسم المجلة أو المؤتمر المستهدف"
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
                  تفاصيل إضافية (50 حرف على الأقل)
                </Label>
                <Textarea
                  value={formData.details}
                  onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                  placeholder="أضف تفاصيل عن البحث، المتطلبات الخاصة، أو أي ملاحظات..."
                  rows={5}
                  className="resize-none text-sm sm:text-base"
                />
                <AnimatePresence>
                  {formData.details && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`text-xs sm:text-sm mt-2 ${formData.details.length >= 50 ? 'text-green-600' : 'text-orange-600'}`}
                    >
                      {formData.details.length} / 50 حرف
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
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
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
