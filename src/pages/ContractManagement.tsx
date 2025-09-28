import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Plus, 
  Send,
  Package,
  Globe,
  BookOpen,
  Briefcase,
  Heart,
  Zap,
  Settings,
  Building,
  Phone,
  MapPin,
  User,
  AlertTriangle
} from 'lucide-react';
import Header from '@/components/Header';

interface Service {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  category_id: string;
  is_active: boolean;
}

interface NewContract {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  clientAddress: string;
  selectedServices: string[];
  additionalNotes: string;
  deliveryTimeframe: string;
  agreedTerms: boolean;
}

const ContractManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [newContract, setNewContract] = useState<NewContract>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    clientAddress: '',
    selectedServices: [],
    additionalNotes: '',
    deliveryTimeframe: '',
    agreedTerms: false
  });

  // تحميل الخدمات عند بداية التحميل
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsServicesLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .eq('show_to_clients', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('خطأ في تحميل الخدمات');
    } finally {
      setIsServicesLoading(false);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setNewContract(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const handleCreateContract = async () => {
    try {
      if (!newContract.clientName || !newContract.clientEmail || !newContract.clientPhone) {
        toast.error('يرجى ملء جميع الحقول المطلوبة');
        return;
      }

      if (newContract.selectedServices.length === 0) {
        toast.error('يرجى اختيار خدمة واحدة على الأقل');
        return;
      }

      if (!newContract.agreedTerms) {
        toast.error('يرجى الموافقة على الشروط والأحكام');
        return;
      }

      setIsCreatingContract(true);

      // الحصول على تفاصيل الخدمات المختارة
      const selectedServiceDetails = services.filter(service => 
        newContract.selectedServices.includes(service.id)
      );

      const contractData = {
        client_name: newContract.clientName,
        client_email: newContract.clientEmail,
        client_phone: newContract.clientPhone,
        client_company: newContract.clientCompany || null,
        client_address: newContract.clientAddress || null,
        client_type: 'individual',
        contract_number: `CTR-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        service_type: 'multiple-services',
        service_price: 0,
        user_id: '00000000-0000-0000-0000-000000000000',
        service_details: {
          services: selectedServiceDetails.map(service => ({
            id: service.id,
            name: service.name_ar,
            description: service.description_ar,
            category: service.category_id
          })),
          additional_notes: newContract.additionalNotes,
          delivery_timeframe: newContract.deliveryTimeframe
        },
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('contracts')
        .insert([contractData])
        .select()
        .single();

      if (error) throw error;

      // إرسال إشعارات بالإيميل والواتساب للإدارة
      await sendContractNotifications(data);

      toast.success('تم إرسال طلب العقد بنجاح للإدارة! سيتم التواصل معكم قريباً');
      resetNewContract();

    } catch (error) {
      console.error('Error creating contract:', error);
      toast.error('خطأ في إرسال طلب العقد');
    } finally {
      setIsCreatingContract(false);
    }
  };

  const sendContractNotifications = async (contractData: any) => {
    try {
      // إرسال العقد للإدارة والعميل
      const { error } = await supabase.functions.invoke('send-contract-notification', {
        body: {
          contract: contractData,
          type: 'new_contract',
          recipients: {
            admin_email: 'info@masteredupath.com',
            client_email: contractData.client_email
          }
        }
      });

      if (error) {
        console.error('Error sending notifications:', error);
        toast.error('تم إنشاء العقد ولكن فشل في إرسال الإشعارات');
      }
    } catch (error) {
      console.error('Error in notification process:', error);
    }
  };

  const resetNewContract = () => {
    setNewContract({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientCompany: '',
      clientAddress: '',
      selectedServices: [],
      additionalNotes: '',
      deliveryTimeframe: '',
      agreedTerms: false
    });
  };

  const getServiceIcon = (categoryId: string) => {
    const icons: Record<string, any> = {
      'translation': Globe,
      'legal': Briefcase,
      'medical': Heart,
      'technical': Zap,
      'academic': BookOpen,
      'business': Building,
      'default': Package
    };
    
    const IconComponent = icons[categoryId] || icons.default;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4">
              طلب <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">عقد جديد</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              اختر الخدمات التي تحتاجها وأرسل طلب العقد للإدارة
            </p>
          </motion.div>
        </div>

        {/* Contract Creation Form */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">إنشاء عقد جديد - التعاقد على الخدمات</CardTitle>
              <CardDescription>
                املأ النموذج أدناه لإرسال طلب العقد للإدارة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* تنبيه مهم */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-1">تنبيه مهم</h3>
                    <p className="text-yellow-700 text-sm">
                      الأسعار المذكورة في هذا النموذج هي أسعار تقديرية فقط. الأسعار النهائية المعتمدة ستكون واردة في الفاتورة المرفقة مع العقد النهائي.
                    </p>
                  </div>
                </div>
              </div>

              {/* معلومات العميل */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    معلومات العميل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">الاسم الكامل *</Label>
                      <Input
                        id="clientName"
                        value={newContract.clientName}
                        onChange={(e) => setNewContract(prev => ({...prev, clientName: e.target.value}))}
                        placeholder="اسم العميل الكامل"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail">البريد الإلكتروني *</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={newContract.clientEmail}
                        onChange={(e) => setNewContract(prev => ({...prev, clientEmail: e.target.value}))}
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone">رقم الهاتف *</Label>
                      <Input
                        id="clientPhone"
                        value={newContract.clientPhone}
                        onChange={(e) => setNewContract(prev => ({...prev, clientPhone: e.target.value}))}
                        placeholder="+966xxxxxxxxx"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientCompany">اسم الشركة (اختياري)</Label>
                      <Input
                        id="clientCompany"
                        value={newContract.clientCompany}
                        onChange={(e) => setNewContract(prev => ({...prev, clientCompany: e.target.value}))}
                        placeholder="اسم الشركة أو المؤسسة"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="clientAddress">العنوان (اختياري)</Label>
                    <Textarea
                      id="clientAddress"
                      value={newContract.clientAddress}
                      onChange={(e) => setNewContract(prev => ({...prev, clientAddress: e.target.value}))}
                      placeholder="العنوان الكامل"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* اختيار الخدمات */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    اختيار الخدمات *
                  </CardTitle>
                  <CardDescription>
                    اختر الخدمات التي تحتاج إليها من القائمة أدناه
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isServicesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>جاري تحميل الخدمات...</p>
                    </div>
                  ) : services.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد خدمات متاحة حالياً</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {services.map((service) => (
                        <Card 
                          key={service.id}
                          className={`cursor-pointer transition-colors hover:border-primary ${
                            newContract.selectedServices.includes(service.id) 
                              ? 'border-primary bg-primary/5' 
                              : ''
                          }`}
                          onClick={() => handleServiceToggle(service.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={newContract.selectedServices.includes(service.id)}
                                onChange={() => handleServiceToggle(service.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {getServiceIcon(service.category_id)}
                                  <h3 className="font-semibold">{service.name_ar}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {service.description_ar}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* تفاصيل إضافية */}
              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل إضافية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="deliveryTimeframe">الإطار الزمني المطلوب</Label>
                    <Select 
                      value={newContract.deliveryTimeframe} 
                      onValueChange={(value) => setNewContract(prev => ({...prev, deliveryTimeframe: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الإطار الزمني المطلوب" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">عاجل (3-5 أيام)</SelectItem>
                        <SelectItem value="standard">عادي (1-2 أسبوع)</SelectItem>
                        <SelectItem value="extended">ممتد (3-4 أسابيع)</SelectItem>
                        <SelectItem value="flexible">مرن (حسب المتاح)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="additionalNotes">ملاحظات إضافية</Label>
                    <Textarea
                      id="additionalNotes"
                      value={newContract.additionalNotes}
                      onChange={(e) => setNewContract(prev => ({...prev, additionalNotes: e.target.value}))}
                      placeholder="أي تفاصيل إضافية أو متطلبات خاصة..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* الشروط والأحكام */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={newContract.agreedTerms}
                      onCheckedChange={(checked) => setNewContract(prev => ({...prev, agreedTerms: !!checked}))}
                      className="mt-1"
                    />
                    <div className="text-sm">
                      <p className="font-medium mb-2">الموافقة على الشروط والأحكام *</p>
                      <p className="text-muted-foreground">
                        بالنقر على "إرسال طلب العقد"، أوافق على شروط وأحكام الخدمة وسياسة الخصوصية.
                        أتفهم أن الأسعار النهائية ستكون كما هو محدد في الفاتورة المرفقة مع العقد النهائي.
                        سيتم التواصل معي من قبل فريق الإدارة لتأكيد التفاصيل وإرسال العقد النهائي.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* أزرار الإجراءات */}
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={handleCreateContract}
                  disabled={isCreatingContract || newContract.selectedServices.length === 0 || !newContract.agreedTerms}
                  className="flex-1"
                >
                  {isCreatingContract ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      إرسال طلب العقد
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={resetNewContract}
                  variant="outline"
                  disabled={isCreatingContract}
                >
                  إعادة تعيين
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ContractManagement;