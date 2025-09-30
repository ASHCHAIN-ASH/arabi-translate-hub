import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
  Sparkles, Send, User, Mail, Phone, MessageSquare,
  Calendar, FileText, CheckCircle2, Loader2
} from 'lucide-react';

interface FormData {
  specialization: string;
  researchType: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  researchTitle: string;
  deadline: string;
  details: string;
}

interface ModernResearchOrderFormProps {
  category: string;
  categoryTitle: string;
  categoryColor: string;
  specializations: string[];
  researchTypes: string[];
}

export const ModernResearchOrderForm = ({
  category,
  categoryTitle,
  categoryColor,
  specializations,
  researchTypes
}: ModernResearchOrderFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    specialization: '',
    researchType: '',
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    researchTitle: '',
    deadline: '',
    details: ''
  });

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceedStep1 = formData.specialization && formData.researchType;
  const canProceedStep2 = formData.fullName && formData.email && formData.phone;
  const canSubmit = canProceedStep1 && canProceedStep2 && formData.researchTitle && formData.deadline;

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast({
        title: "⚠️ بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-research-order', {
        body: {
          category,
          categoryTitle,
          ...formData,
          attachments: []
        }
      });

      if (error) throw error;

      setOrderNumber(data.orderNumber);
      setSubmitted(true);

      toast({
        title: "✅ تم إرسال الطلب بنجاح",
        description: `رقم الطلب: ${data.orderNumber}`,
      });

      setTimeout(() => {
        navigate('/research-services');
      }, 4000);

    } catch (error: any) {
      console.error('Error submitting order:', error);
      toast({
        title: "❌ حدث خطأ",
        description: error.message || "فشل في إرسال الطلب",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="p-8 text-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mx-auto w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-4"
          >
            تم استلام طلبك بنجاح! 🎉
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur p-6 rounded-lg mb-6"
          >
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">رقم الطلب</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {orderNumber}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-600 dark:text-gray-300 mb-6"
          >
            سيتم مراجعة طلبك والتواصل معك خلال 24 ساعة
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              onClick={() => navigate('/research-services')}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              العودة للخدمات
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <motion.div
                animate={{
                  scale: step === s ? 1.1 : 1,
                  backgroundColor: step >= s ? categoryColor : '#e5e7eb'
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold relative z-10"
              >
                {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
              </motion.div>
              {s < totalSteps && (
                <motion.div
                  animate={{
                    scaleX: step > s ? 1 : 0,
                    backgroundColor: categoryColor
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-1 flex-1 origin-left"
                  style={{ backgroundColor: step > s ? categoryColor : '#e5e7eb' }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 px-2">
          <span>نوع الخدمة</span>
          <span>بياناتك</span>
          <span>تفاصيل البحث</span>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Card className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl border-2">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div variants={containerVariants} className="space-y-6">
                <motion.div variants={itemVariants} className="text-center mb-6">
                  <Sparkles className="w-12 h-12 mx-auto mb-3" style={{ color: categoryColor }} />
                  <h3 className="text-2xl font-bold mb-2">{categoryTitle}</h3>
                  <p className="text-gray-600 dark:text-gray-400">اختر التخصص ونوع البحث</p>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label className="text-lg mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    التخصص *
                  </Label>
                  <Select value={formData.specialization} onValueChange={(v) => handleInputChange('specialization', v)}>
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map(spec => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label className="text-lg mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    نوع البحث *
                  </Label>
                  <Select value={formData.researchType} onValueChange={(v) => handleInputChange('researchType', v)}>
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder="اختر نوع البحث" />
                    </SelectTrigger>
                    <SelectContent>
                      {researchTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!canProceedStep1}
                    className="w-full h-14 text-lg"
                    style={{ backgroundColor: categoryColor }}
                  >
                    التالي
                    <Send className="mr-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div variants={containerVariants} className="space-y-6">
                <motion.div variants={itemVariants} className="text-center mb-6">
                  <User className="w-12 h-12 mx-auto mb-3" style={{ color: categoryColor }} />
                  <h3 className="text-2xl font-bold mb-2">معلوماتك الشخصية</h3>
                  <p className="text-gray-600 dark:text-gray-400">نحتاج بياناتك للتواصل معك</p>
                </motion.div>

                <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      الاسم الكامل *
                    </Label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      البريد الإلكتروني *
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@email.com"
                      className="h-12"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4" />
                      رقم الهاتف *
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="05xxxxxxxx"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4" />
                      واتساب (اختياري)
                    </Label>
                    <Input
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      placeholder="05xxxxxxxx"
                      className="h-12"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex gap-4">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 h-12"
                  >
                    السابق
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    className="flex-1 h-12"
                    style={{ backgroundColor: categoryColor }}
                  >
                    التالي
                    <Send className="mr-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div variants={containerVariants} className="space-y-6">
                <motion.div variants={itemVariants} className="text-center mb-6">
                  <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: categoryColor }} />
                  <h3 className="text-2xl font-bold mb-2">تفاصيل البحث</h3>
                  <p className="text-gray-600 dark:text-gray-400">أخبرنا عن بحثك</p>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4" />
                    عنوان البحث *
                  </Label>
                  <Input
                    value={formData.researchTitle}
                    onChange={(e) => handleInputChange('researchTitle', e.target.value)}
                    placeholder="أدخل عنوان بحثك"
                    className="h-12"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    الموعد النهائي *
                  </Label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="h-12"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Label className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    تفاصيل إضافية (اختياري)
                  </Label>
                  <Textarea
                    value={formData.details}
                    onChange={(e) => handleInputChange('details', e.target.value)}
                    placeholder="أضف أي تفاصيل إضافية عن بحثك..."
                    className="min-h-32"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="flex gap-4">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="flex-1 h-12"
                  >
                    السابق
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit || loading}
                    className="flex-1 h-14 text-lg font-bold"
                    style={{ backgroundColor: categoryColor }}
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
                </motion.div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};