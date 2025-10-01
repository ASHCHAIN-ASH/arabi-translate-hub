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
  User, Mail, Phone, FileText,
  Send, CheckCircle2, Loader2, Upload
} from 'lucide-react';

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
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error('الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('send-research-service-request', {
        body: {
          serviceTitle,
          serviceType,
          ...formData
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
            />
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
              placeholder="أضف تفاصيل طلبك هنا... (اختياري)"
              rows={5}
              className="text-base resize-none"
            />
            <p className="text-sm text-muted-foreground mt-2">
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
