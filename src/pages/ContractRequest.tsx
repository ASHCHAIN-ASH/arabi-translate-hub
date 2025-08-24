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
  DollarSign,
  Calendar,
  Send,
  CheckCircle,
  Building,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { createContract } from '@/utils/supabaseContractService';
import { ServiceType } from '@/types/contract';

const ContractRequest = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contractId, setContractId] = useState('');
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientId: '',
    serviceType: '' as ServiceType,
    serviceTitle: '',
    serviceDescription: '',
    specifications: '',
    estimatedDuration: '',
    deliverables: '',
    totalAmount: '',
    paymentTerms: '',
    deliveryDate: '',
    additionalTerms: ''
  });

  const serviceTypes = [
    { value: 'translation-legal', label: 'ترجمة قانونية' },
    { value: 'translation-medical', label: 'ترجمة طبية' },
    { value: 'translation-technical', label: 'ترجمة تقنية' },
    { value: 'translation-business', label: 'ترجمة تجارية' },
    { value: 'translation-academic', label: 'ترجمة أكاديمية' },
    { value: 'translation-literary', label: 'ترجمة أدبية' },
    { value: 'translation-media', label: 'ترجمة إعلامية' },
    { value: 'research-thesis', label: 'كتابة رسائل علمية' },
    { value: 'research-plan', label: 'إعداد خطة البحث' },
    { value: 'research-analysis', label: 'التحليل الإحصائي' },
    { value: 'research-formatting', label: 'تنسيق الأبحاث' },
    { value: 'research-publication', label: 'النشر العلمي' },
    { value: 'research-consultation', label: 'استشارات أكاديمية' },
    { value: 'custom-service', label: 'خدمة مخصصة' }
  ] as const;

  const paymentTermsOptions = [
    'دفع مسبق 100%',
    'دفع مقدم 50% والباقي عند التسليم',
    'دفع مقدم 30% والباقي على دفعتين',
    'دفع عند التسليم',
    'شروط دفع مخصصة'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateClientId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'CL';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = [
      'clientName', 'clientPhone', 'clientEmail', 'serviceType', 
      'serviceTitle', 'serviceDescription', 'totalAmount', 'deliveryDate'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: 'خطأ في البيانات',
          description: 'يرجى ملء جميع الحقول المطلوبة',
          variant: 'destructive',
        });
        return;
      }
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
      const newClientId = generateClientId();
      
      const contractData = {
        clientId: newClientId,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        serviceType: formData.serviceType,
        status: 'draft' as const,
        serviceDetails: {
          title: formData.serviceTitle,
          description: formData.serviceDescription,
          specifications: formData.specifications ? JSON.parse(`{"details": "${formData.specifications}"}`) : {},
          attachments: [],
          estimatedDuration: formData.estimatedDuration || 'سيتم تحديده',
          deliverables: formData.deliverables ? formData.deliverables.split('\n') : []
        },
        contractContent: `هذا عقد بين الشركة والعميل ${formData.clientName} لتقديم خدمة ${formData.serviceTitle}`,
        totalAmount: parseFloat(formData.totalAmount),
        paymentTerms: formData.paymentTerms || 'سيتم الاتفاق عليها',
        deliveryDate: formData.deliveryDate,
        terms: formData.additionalTerms ? [
          {
            id: '1',
            title: 'شروط إضافية',
            content: formData.additionalTerms,
            required: false
          }
        ] : []
      };

      const newContractId = await createContract(contractData);
      setContractId(newContractId);
      setIsSubmitted(true);
      
      toast({
        title: 'تم إرسال طلب العقد بنجاح',
        description: 'سيتم مراجعة طلبكم والتواصل معكم قريباً',
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
                تم إرسال طلب العقد بنجاح!
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                شكراً لثقتكم بنا. سيتم مراجعة طلبكم وسيصلكم العقد خلال 24 ساعة.
              </p>
              
              <Card className="bg-gradient-card shadow-soft border-0 mb-8">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Label className="text-sm text-muted-foreground">رقم العقد</Label>
                    <div className="text-2xl font-bold text-primary font-mono mt-2 p-4 bg-primary/5 rounded-lg">
                      {contractId}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      احتفظ بهذا الرقم لمتابعة حالة العقد
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/client/dashboard'}
                  className="bg-gradient-primary"
                >
                  لوحة التحكم
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
                <FileText className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-arabic-title font-bold mb-4">
              طلب <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">عقد خدمة</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              احصل على عقد شامل ومفصل لخدمتك المطلوبة مع كافة التفاصيل والشروط
            </p>
          </motion.div>

          {/* Contract Request Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="max-w-4xl mx-auto shadow-soft border-0 bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-arabic-title">
                  بيانات طلب العقد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Client Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5" />
                      معلومات العميل
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="clientName" className="font-bold">
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
                        <Label htmlFor="clientPhone" className="font-bold">
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
                      <Label htmlFor="clientEmail" className="font-bold">
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
                  </div>

                  {/* Service Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      تفاصيل الخدمة
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="serviceType" className="font-bold">
                          نوع الخدمة *
                        </Label>
                        <Select onValueChange={(value) => handleInputChange('serviceType', value)} required>
                          <SelectTrigger className="bg-muted/50">
                            <SelectValue placeholder="اختر نوع الخدمة" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="text-sm font-semibold text-muted-foreground px-2 py-1">خدمات الترجمة</div>
                            {serviceTypes.filter(type => type.value.startsWith('translation')).map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                            <div className="text-sm font-semibold text-muted-foreground px-2 py-1 mt-2">خدمات البحوث الأكاديمية</div>
                            {serviceTypes.filter(type => type.value.startsWith('research')).map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                            <div className="text-sm font-semibold text-muted-foreground px-2 py-1 mt-2">خدمات أخرى</div>
                            {serviceTypes.filter(type => type.value === 'custom-service').map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="estimatedDuration" className="font-bold">
                          المدة المتوقعة
                        </Label>
                        <Input
                          id="estimatedDuration"
                          placeholder="مثال: 10 أيام عمل"
                          value={formData.estimatedDuration}
                          onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                          className="bg-muted/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceTitle" className="font-bold">
                        عنوان الخدمة *
                      </Label>
                      <Input
                        id="serviceTitle"
                        placeholder="أدخل عنوان واضح للخدمة المطلوبة"
                        value={formData.serviceTitle}
                        onChange={(e) => handleInputChange('serviceTitle', e.target.value)}
                        className="bg-muted/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceDescription" className="font-bold">
                        وصف الخدمة *
                      </Label>
                      <Textarea
                        id="serviceDescription"
                        placeholder="اشرح بالتفصيل الخدمة المطلوبة..."
                        value={formData.serviceDescription}
                        onChange={(e) => handleInputChange('serviceDescription', e.target.value)}
                        className="bg-muted/50 min-h-[120px]"
                        rows={5}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specifications" className="font-bold">
                        المواصفات الفنية
                      </Label>
                      <Textarea
                        id="specifications"
                        placeholder="أي مواصفات فنية أو متطلبات خاصة..."
                        value={formData.specifications}
                        onChange={(e) => handleInputChange('specifications', e.target.value)}
                        className="bg-muted/50"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliverables" className="font-bold">
                        المخرجات المتوقعة
                      </Label>
                      <Textarea
                        id="deliverables"
                        placeholder="اذكر المخرجات المطلوبة (كل مخرج في سطر منفصل)"
                        value={formData.deliverables}
                        onChange={(e) => handleInputChange('deliverables', e.target.value)}
                        className="bg-muted/50"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Financial and Schedule Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      المعلومات المالية والزمنية
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="totalAmount" className="font-bold">
                          التكلفة الإجمالية (ريال) *
                        </Label>
                        <Input
                          id="totalAmount"
                          type="number"
                          placeholder="0.00"
                          value={formData.totalAmount}
                          onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                          className="bg-muted/50"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deliveryDate" className="font-bold">
                          تاريخ التسليم المطلوب *
                        </Label>
                        <Input
                          id="deliveryDate"
                          type="date"
                          value={formData.deliveryDate}
                          onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                          className="bg-muted/50"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentTerms" className="font-bold">
                        شروط الدفع
                      </Label>
                      <Select onValueChange={(value) => handleInputChange('paymentTerms', value)}>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="اختر شروط الدفع" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentTermsOptions.map((term) => (
                            <SelectItem key={term} value={term}>
                              {term}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Additional Terms */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      شروط إضافية
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="additionalTerms" className="font-bold">
                        شروط أو ملاحظات إضافية
                      </Label>
                      <Textarea
                        id="additionalTerms"
                        placeholder="أي شروط أو ملاحظات إضافية تود إضافتها للعقد..."
                        value={formData.additionalTerms}
                        onChange={(e) => handleInputChange('additionalTerms', e.target.value)}
                        className="bg-muted/50"
                        rows={4}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-primary text-primary-foreground font-bold py-6 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2" />
                        جاري إرسال الطلب...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 ml-2" />
                        إرسال طلب العقد
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

export default ContractRequest;