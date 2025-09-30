import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Mail, Building2, BookOpen, MessageSquare, Upload, CheckCircle } from 'lucide-react';

const ResearchRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    university: '',
    researchType: '',
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.university || !formData.researchType) {
      toast.error('الرجاء تعبئة جميع الحقول المطلوبة');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('الرجاء إدخال بريد إلكتروني صحيح');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // توليد رقم الطلب
      const orderNumber = `RO${Date.now().toString().slice(-8)}`;
      
      const { error } = await supabase.functions.invoke('send-research-order', {
        body: {
          category: 'academic',
          categoryTitle: 'طلب بحث أكاديمي',
          specialization: formData.researchType,
          researchType: formData.researchType,
          fullName: formData.fullName,
          email: formData.email,
          phone: '',
          researchTitle: formData.university,
          deadline: '',
          details: formData.notes,
          orderNumber: orderNumber,
        }
      });

      if (error) throw error;

      setIsSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        university: '',
        researchType: '',
        notes: '',
      });
      
      setTimeout(() => setIsSuccess(false), 5000);
      
    } catch (error: any) {
      console.error('Error submitting research request:', error);
      toast.error('حدث خطأ في إرسال الطلب. الرجاء المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a225d] via-[#1e3a8a] to-[#0087ff]">
      <Header />
      
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12">
            {isSuccess ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  ✅ تم استلام طلبك بنجاح!
                </h2>
                <p className="text-lg text-gray-600">
                  سيتم التواصل معك عبر البريد الإلكتروني قريباً
                </p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    طلب بحث أكاديمي
                  </h1>
                  <p className="text-gray-600 text-lg">
                    املأ النموذج وسنتواصل معك في أقرب وقت
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-right flex items-center gap-2 text-gray-700">
                      <FileText className="w-4 h-4" />
                      الاسم الكامل *
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      className="text-right"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-right flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4" />
                      البريد الإلكتروني *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@email.com"
                      className="text-right"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-right flex items-center gap-2 text-gray-700">
                      <Building2 className="w-4 h-4" />
                      الجامعة / الجهة *
                    </Label>
                    <Input
                      id="university"
                      value={formData.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      placeholder="أدخل اسم الجامعة أو الجهة"
                      className="text-right"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="researchType" className="text-right flex items-center gap-2 text-gray-700">
                      <BookOpen className="w-4 h-4" />
                      نوع البحث *
                    </Label>
                    <Select value={formData.researchType} onValueChange={(value) => handleInputChange('researchType', value)}>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر نوع البحث" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="بحث جامعي">بحث جامعي</SelectItem>
                        <SelectItem value="مقال علمي">مقال علمي</SelectItem>
                        <SelectItem value="رسالة ماجستير">رسالة ماجستير</SelectItem>
                        <SelectItem value="أطروحة دكتوراه">أطروحة دكتوراه</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-right flex items-center gap-2 text-gray-700">
                      <MessageSquare className="w-4 h-4" />
                      الملاحظات (اختياري)
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="أضف أي ملاحظات أو تفاصيل إضافية..."
                      className="text-right min-h-[120px]"
                      rows={5}
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#0087ff] to-[#0a225d] hover:from-[#0a225d] hover:to-[#0087ff] transition-all duration-300"
                    >
                      {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                    </Button>
                  </motion.div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResearchRequest;
