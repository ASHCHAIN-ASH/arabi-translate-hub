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
  name?: string;
  description?: string;
  category_id?: string;
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

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsServicesLoading(true);
      const { data, error } = await (supabase
        .from('services') as any)
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setServices((data || []) as Service[]);
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
        status: 'draft'
      };

      await sendContractNotifications(contractData);
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
    return <IconComponent className="h-5 w-5 text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            طلب عقد جديد
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            اختر الخدمات التي تحتاجها وأرسل طلب العقد للإدارة
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-3xl font-bold">إنشاء عقد جديد - التعاقد على الخدمات</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                املأ النموذج أدناه لإرسال طلب العقد للإدارة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-6"
              >
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-bold text-yellow-800 mb-2 text-lg">تنبيه مهم</h3>
                    <p className="text-yellow-700 leading-relaxed">
                      الأسعار المذكورة في هذا النموذج هي أسعار تقديرية فقط. الأسعار النهائية المعتمدة ستكون واردة في الفاتورة المرفقة مع العقد النهائي.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-2 border-blue-100 hover:border-blue-200 transition-all duration-300 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      معلومات العميل
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { id: 'clientName', label: 'الاسم الكامل *', type: 'text', placeholder: 'اسم العميل الكامل', value: newContract.clientName, field: 'clientName' },
                        { id: 'clientEmail', label: 'البريد الإلكتروني *', type: 'email', placeholder: 'example@email.com', value: newContract.clientEmail, field: 'clientEmail' },
                        { id: 'clientPhone', label: 'رقم الهاتف *', type: 'tel', placeholder: '+966xxxxxxxxx', value: newContract.clientPhone, field: 'clientPhone' },
                        { id: 'clientCompany', label: 'اسم الشركة (اختياري)', type: 'text', placeholder: 'اسم الشركة أو المؤسسة', value: newContract.clientCompany, field: 'clientCompany' }
                      ].map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                        >
                          <Label htmlFor={field.id} className="text-sm font-medium text-gray-700 mb-2 block">
                            {field.label}
                          </Label>
                          <Input
                            id={field.id}
                            type={field.type}
                            value={field.value}
                            onChange={(e) => setNewContract(prev => ({...prev, [field.field]: e.target.value}))}
                            placeholder={field.placeholder}
                            className="h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                          />
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      <Label htmlFor="clientAddress" className="text-sm font-medium text-gray-700 mb-2 block">
                        العنوان (اختياري)
                      </Label>
                      <Textarea
                        id="clientAddress"
                        value={newContract.clientAddress}
                        onChange={(e) => setNewContract(prev => ({...prev, clientAddress: e.target.value}))}
                        placeholder="العنوان الكامل"
                        rows={3}
                        className="text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                      />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Card className="border-2 border-green-100 hover:border-green-200 transition-all duration-300 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl text-green-800">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Package className="h-6 w-6 text-green-600" />
                      </div>
                      اختيار الخدمات *
                    </CardTitle>
                    <CardDescription className="mt-2 text-green-600 text-base">
                      اختر الخدمات التي تحتاج إليها من القائمة أدناه
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {isServicesLoading ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                      >
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
                        <p className="text-gray-500 text-lg">جاري تحميل الخدمات...</p>
                      </motion.div>
                    ) : services.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16"
                      >
                        <Package className="h-20 w-20 mx-auto mb-6 text-gray-300" />
                        <p className="text-xl text-gray-500">لا توجد خدمات متاحة حالياً</p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      >
                        {services.map((service, index) => (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 1.1 + (index * 0.1) }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card 
                              className={`cursor-pointer h-full transition-all duration-300 border-2 ${
                                newContract.selectedServices.includes(service.id) 
                                  ? 'border-blue-400 bg-blue-50 shadow-xl ring-4 ring-blue-100' 
                                  : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                              }`}
                              onClick={() => handleServiceToggle(service.id)}
                            >
                              <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                  <Checkbox
                                    checked={newContract.selectedServices.includes(service.id)}
                                    className="mt-1 h-5 w-5"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className="p-2 rounded-lg bg-blue-100">
                                        {getServiceIcon(service.category_id)}
                                      </div>
                                      <h3 className="font-bold text-gray-900 text-lg leading-tight">
                                        {service.name_ar}
                                      </h3>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                      {service.description_ar}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <Card className="border-2 border-purple-100 hover:border-purple-200 transition-all duration-300 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                    <CardTitle className="text-xl text-purple-800">تفاصيل إضافية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div>
                      <Label htmlFor="deliveryTimeframe" className="text-sm font-medium text-gray-700 mb-2 block">
                        الإطار الزمني المطلوب
                      </Label>
                      <Select 
                        value={newContract.deliveryTimeframe} 
                        onValueChange={(value) => setNewContract(prev => ({...prev, deliveryTimeframe: value}))}
                      >
                        <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-purple-400">
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
                      <Label htmlFor="additionalNotes" className="text-sm font-medium text-gray-700 mb-2 block">
                        ملاحظات إضافية
                      </Label>
                      <Textarea
                        id="additionalNotes"
                        value={newContract.additionalNotes}
                        onChange={(e) => setNewContract(prev => ({...prev, additionalNotes: e.target.value}))}
                        placeholder="أي تفاصيل إضافية أو متطلبات خاصة..."
                        rows={4}
                        className="text-base border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.3 }}
              >
                <Card className="border-2 border-gray-200 bg-gray-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={newContract.agreedTerms}
                        onCheckedChange={(checked) => setNewContract(prev => ({...prev, agreedTerms: !!checked}))}
                        className="mt-1 h-5 w-5"
                      />
                      <div className="text-base">
                        <p className="font-bold mb-3 text-gray-900">الموافقة على الشروط والأحكام *</p>
                        <p className="text-gray-700 leading-relaxed">
                          بالنقر على "إرسال طلب العقد"، أوافق على شروط وأحكام الخدمة وسياسة الخصوصية.
                          أتفهم أن الأسعار النهائية ستكون كما هو محدد في الفاتورة المرفقة مع العقد النهائي.
                          سيتم التواصل معي من قبل فريق الإدارة لتأكيد التفاصيل وإرسال العقد النهائي.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="flex gap-6 pt-6"
              >
                <Button 
                  onClick={handleCreateContract}
                  disabled={isCreatingContract || newContract.selectedServices.length === 0 || !newContract.agreedTerms}
                  className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  size="lg"
                >
                  {isCreatingContract ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      جاري الإرسال...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Send className="h-5 w-5" />
                      إرسال طلب العقد
                    </div>
                  )}
                </Button>
                
                <Button 
                  onClick={resetNewContract}
                  variant="outline"
                  disabled={isCreatingContract}
                  className="px-8 h-14 text-lg border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02]"
                  size="lg"
                >
                  إعادة تعيين
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ContractManagement;