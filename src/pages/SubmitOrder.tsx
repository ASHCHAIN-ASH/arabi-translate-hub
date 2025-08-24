import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  User,
  Phone,
  Mail,
  FileText,
  GraduationCap,
  Send,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { createOrder } from '@/utils/supabaseOrderService';

const SubmitOrder = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    title: '',
    degree: '',
    description: ''
  });

  const degrees = [
    'بكالوريوس',
    'ماجستير',
    'دكتوراه',
    'دبلوم عالي',
    'ماجستير إدارة الأعمال',
    'دكتوراه علوم الحاسوب',
    'ماجستير الهندسة',
    'دكتوراه الطب',
    'أخرى'
  ];

  const generateTrackingId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'TR';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.clientName || !formData.clientPhone || !formData.clientEmail || !formData.title || !formData.degree) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    // Phone validation
    if (formData.clientPhone.length < 10) {
      toast({
        title: 'خطأ في رقم الجوال',
        description: 'يرجى إدخال رقم جوال صحيح',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newTrackingId = generateTrackingId();
      const phoneLastFour = formData.clientPhone.slice(-4);
      
      await createOrder({
        trackingId: newTrackingId,
        phoneLastFour,
        title: formData.title,
        degree: formData.degree,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        clientEmail: formData.clientEmail
      });

      setTrackingId(newTrackingId);
      setIsSubmitted(true);
      
      toast({
        title: 'تم إرسال الطلب بنجاح',
        description: 'سيتم التواصل معكم قريباً',
      });
    } catch (error) {
      toast({
        title: 'خطأ في الإرسال',
        description: 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">
                تم إرسال طلبكم بنجاح!
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                شكراً لثقتكم بنا. سيتم مراجعة طلبكم والتواصل معكم خلال 24 ساعة.
              </p>
              
              <Card className="bg-gradient-card shadow-soft border-0 mb-8">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Label className="text-sm text-muted-foreground">رقم التتبع الخاص بك</Label>
                    <div className="text-2xl font-bold text-primary font-mono mt-2 p-4 bg-primary/5 rounded-lg">
                      {trackingId}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      احتفظ بهذا الرقم لتتبع حالة طلبك
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/order-tracking'}
                  className="bg-gradient-primary"
                >
                  تتبع الطلب الآن
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                >
                  العودة للرئيسية
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <div className="bg-primary/10 rounded-full p-4">
                <Send className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-arabic-title font-bold mb-4">
              تقديم <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">طلب جديد</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              احصل على المساعدة الأكاديمية المتخصصة التي تحتاجها
            </p>
          </motion.div>

          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="max-w-4xl mx-auto shadow-soft border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-arabic-title">
                  معلومات الطلب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="clientName" className="flex items-center gap-2 font-bold">
                        <User className="h-4 w-4" />
                        الاسم الكامل *
                      </Label>
                      <Input
                        id="clientName"
                        placeholder="أدخل اسمك الكامل"
                        value={formData.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        className="bg-muted/50"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="clientPhone" className="flex items-center gap-2 font-bold">
                        <Phone className="h-4 w-4" />
                        رقم الجوال *
                      </Label>
                      <Input
                        id="clientPhone"
                        placeholder="05xxxxxxxx"
                        value={formData.clientPhone}
                        onChange={(e) => handleInputChange('clientPhone', e.target.value.replace(/\D/g, ''))}
                        className="bg-muted/50"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientEmail" className="flex items-center gap-2 font-bold">
                      <Mail className="h-4 w-4" />
                      البريد الإلكتروني *
                    </Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.clientEmail}
                      onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                      className="bg-muted/50"
                      required
                    />
                  </div>

                  {/* Academic Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="degree" className="flex items-center gap-2 font-bold">
                        <GraduationCap className="h-4 w-4" />
                        الدرجة العلمية *
                      </Label>
                      <Select onValueChange={(value) => handleInputChange('degree', value)} required>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="اختر الدرجة العلمية" />
                        </SelectTrigger>
                        <SelectContent>
                          {degrees.map((degree) => (
                            <SelectItem key={degree} value={degree}>
                              {degree}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-2 font-bold">
                      <FileText className="h-4 w-4" />
                      عنوان البحث أو الموضوع *
                    </Label>
                    <Input
                      id="title"
                      placeholder="أدخل عنوان البحث أو الموضوع المطلوب"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="bg-muted/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-bold">
                      تفاصيل إضافية (اختياري)
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="أضف أي تفاصيل إضافية أو متطلبات خاصة..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="bg-muted/50 min-h-[120px]"
                      rows={5}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-primary text-primary-foreground font-bold py-6 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 ml-2" />
                        إرسال الطلب
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SubmitOrder;