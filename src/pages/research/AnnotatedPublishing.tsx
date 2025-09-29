import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, MessageCircle, BarChart3, GraduationCap, Globe, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AnnotatedPublishing = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const features = [
    {
      icon: MessageCircle,
      title: 'شروحات جانبية للنقاط المعقدة',
      description: 'إضافة تعليقات وشروحات تفصيلية لتبسيط المفاهيم الصعبة'
    },
    {
      icon: BarChart3,
      title: 'رسوم توضيحية ورسوم بيانية تفاعلية',
      description: 'تحويل البيانات إلى رسوم بيانية تفاعلية وسهلة الفهم'
    },
    {
      icon: GraduationCap,
      title: 'نسخة أكثر سهولة للطلاب والباحثين',
      description: 'جعل البحث أكثر وصولاً وفهماً لجمهور أوسع'
    },
    {
      icon: Globe,
      title: 'تحسين فرص الاستشهاد والنشر',
      description: 'زيادة معدل القراءة والاستشهاد بالأبحاث العلمية'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        toast({
          title: "نوع ملف غير مدعوم",
          description: "يرجى رفع ملف PDF أو Word فقط",
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !file) {
      toast({
        title: "بيانات مفقودة",
        description: "يرجى تعبئة جميع الحقول المطلوبة ورفع الملف",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `annotated-publishing/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error('فشل في رفع الملف');
      }

      // Call edge function to send emails
      const { error: functionError } = await supabase.functions.invoke('annotated-publishing-service', {
        body: {
          ...formData,
          filePath,
          originalFileName: file.name
        }
      });

      if (functionError) {
        throw new Error('فشل في إرسال الطلب');
      }

      setIsSuccess(true);
      toast({
        title: "تم إرسال الطلب بنجاح ✅",
        description: "سيتواصل معك فريقنا قريباً"
      });

      // Reset form
      setFormData({ fullName: '', email: '', phone: '', notes: '' });
      setFile(null);
      
    } catch (error: any) {
      toast({
        title: "حدث خطأ",
        description: error.message || "فشل في إرسال الطلب، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white" dir="rtl">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="text-6xl mb-6">📑</div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                خدمة النشر المشروح
              </h1>
              <h2 className="text-3xl font-semibold text-gray-700 mb-8">
                Annotated Publishing
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                نوفر خدمة مبتكرة لتحويل المقالات والأبحاث العلمية إلى نسخة تفاعلية مشروحة، مع تعليقات جانبية ورسوم توضيحية تساعد على تبسيط المفاهيم المعقدة وجعل البحث أكثر وصولاً للقراء والباحثين.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-center mb-16 text-gray-800"
            >
              مميزات خدمة النشر المشروح
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-800">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-center leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Example Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold mb-16 text-gray-800"
            >
              مثال على النشر المشروح
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-2xl p-8 mx-auto max-w-4xl"
            >
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-12 bg-gradient-to-br from-blue-50 to-purple-50">
                <FileText className="w-24 h-24 mx-auto mb-6 text-blue-500" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  مثال تفاعلي قريباً
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  سيتم عرض مثال حي يوضح كيفية تحويل البحث التقليدي إلى نسخة مشروحة تفاعلية 
                  مع تعليقات جانبية ورسوم توضيحية مبسطة
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-center mb-16 text-gray-800"
            >
              اطلب خدمة النشر المشروح
            </motion.h2>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-green-50 border-2 border-green-200 rounded-2xl p-12 text-center"
              >
                <Check className="w-20 h-20 mx-auto mb-6 text-green-500" />
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  تم استلام طلبك ✅
                </h3>
                <p className="text-green-700 text-lg">
                  وسيتواصل معك فريقنا قريباً
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* File Upload */}
                      <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-3">
                          رفع ملف البحث (PDF أو Word) *
                        </label>
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                            <p className="text-gray-600 mb-2">
                              {file ? file.name : 'اضغط لرفع الملف'}
                            </p>
                            <p className="text-sm text-gray-500">
                              PDF, DOC, DOCX (حد أقصى 10MB)
                            </p>
                          </label>
                        </div>
                      </div>

                      {/* Full Name */}
                      <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-3">
                          الاسم الكامل *
                        </label>
                        <Input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="text-lg h-12"
                          placeholder="أدخل اسمك الكامل"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-3">
                          البريد الإلكتروني *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="text-lg h-12"
                          placeholder="example@email.com"
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-3">
                          رقم الجوال (اختياري)
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="text-lg h-12"
                          placeholder="+966xxxxxxxxx"
                        />
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-3">
                          ملاحظات إضافية (اختياري)
                        </label>
                        <Textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          className="text-lg min-h-[120px]"
                          placeholder="أي ملاحظات أو متطلبات خاصة للخدمة..."
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full text-xl h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-6 h-6 ml-2 animate-spin" />
                            جاري الإرسال...
                          </>
                        ) : (
                          'اطلب النشر المشروح'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </section>

        {/* Security Notice */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center"
            >
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold text-blue-800 mb-3">
                أمان وخصوصية البيانات
              </h3>
              <p className="text-blue-700 leading-relaxed">
                نضمن حماية كاملة لجميع الملفات والبيانات المرسلة، ولن يتم مشاركتها مع أي جهة خارجية.
                جميع الملفات محمية بأعلى معايير الأمان الرقمي.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AnnotatedPublishing;