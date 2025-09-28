import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Download,
  Filter,
  Calendar,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Mail,
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
  Users
} from 'lucide-react';
import { Contract, ContractStatus, ServiceType } from '@/types/contract';
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
  const [contracts, setContracts] = useState<any[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  // تحميل العقود والخدمات عند بداية التحميل
  useEffect(() => {
    loadContracts();
    loadServices();
  }, []);

  // تطبيق الفلاتر
  useEffect(() => {
    filterContracts();
  }, [contracts, searchTerm, statusFilter]);

  const loadContracts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error loading contracts:', error);
      toast.error('خطأ في تحميل العقود');
    } finally {
      setIsLoading(false);
    }
  };

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

  const filterContracts = () => {
    let filtered = contracts;

    if (searchTerm.trim()) {
      filtered = filtered.filter(contract => 
        contract.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.client_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contract_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(contract => contract.status === statusFilter);
    }

    setFilteredContracts(filtered);
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

      // إرسال إشعارات بالإيميل
      await sendContractNotifications(data);

      toast.success('تم إنشاء العقد بنجاح وإرسال الإشعارات');
      setIsDialogOpen(false);
      resetNewContract();
      loadContracts();

    } catch (error) {
      console.error('Error creating contract:', error);
      toast.error('خطأ في إنشاء العقد');
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

  const downloadContractPDF = async (contractId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-contract-pdf', {
        body: { contract_id: contractId }
      });

      if (error) throw error;

      // تحميل ملف PDF
      const link = document.createElement('a');
      link.href = data.pdf_url;
      link.download = `contract-${contractId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('تم تحميل العقد بنجاح');
    } catch (error) {
      console.error('Error downloading contract:', error);
      toast.error('خطأ في تحميل العقد');
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      signed: 'bg-emerald-100 text-emerald-800',
      active: 'bg-cyan-100 text-cyan-800',
      completed: 'bg-indigo-100 text-indigo-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'مسودة',
      sent: 'مرسل',
      reviewed: 'تمت المراجعة',
      approved: 'موافق عليه',
      signed: 'موقع',
      active: 'نشط',
      completed: 'مكتمل',
      cancelled: 'ملغي'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getContractStats = () => {
    const stats = {
      total: contracts.length,
      pending: contracts.filter(c => ['draft', 'sent', 'reviewed'].includes(c.status)).length,
      approved: contracts.filter(c => c.status === 'approved').length,
      active: contracts.filter(c => c.status === 'active').length,
      completed: contracts.filter(c => c.status === 'completed').length
    };
    return stats;
  };

  const stats = getContractStats();

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
              إدارة <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">العقود</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نظام شامل لإدارة العقود الإلكترونية وموافقات العملاء على جميع الخدمات
            </p>
          </motion.div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">إجمالي العقود</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">في الانتظار</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{stats.approved}</div>
                <div className="text-sm text-muted-foreground">موافق عليها</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-sm text-muted-foreground">نشطة</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <XCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">مكتملة</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث في العقود..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="فلترة حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأحوال</SelectItem>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="sent">مرسل</SelectItem>
                  <SelectItem value="reviewed">تمت المراجعة</SelectItem>
                  <SelectItem value="approved">موافق عليه</SelectItem>
                  <SelectItem value="signed">موقع</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={loadContracts} variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                تحديث
              </Button>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    عقد جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">إنشاء عقد جديد - التعاقد على الخدمات</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6 p-4">
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
                              placeholder="05xxxxxxxx"
                            />
                          </div>
                          <div>
                            <Label htmlFor="clientCompany">الشركة/المؤسسة</Label>
                            <Input
                              id="clientCompany"
                              value={newContract.clientCompany}
                              onChange={(e) => setNewContract(prev => ({...prev, clientCompany: e.target.value}))}
                              placeholder="اسم الشركة (اختياري)"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="clientAddress">العنوان</Label>
                          <Textarea
                            id="clientAddress"
                            value={newContract.clientAddress}
                            onChange={(e) => setNewContract(prev => ({...prev, clientAddress: e.target.value}))}
                            placeholder="العنوان الكامل (اختياري)"
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
                          اختيار الخدمات
                        </CardTitle>
                        <CardDescription>
                          اختر الخدمات المطلوبة للتعاقد عليها (يمكن اختيار أكثر من خدمة)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isServicesLoading ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                            <p>جاري تحميل الخدمات...</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {services.map((service) => (
                              <Card
                                key={service.id}
                                className={`cursor-pointer transition-all duration-200 ${
                                  newContract.selectedServices.includes(service.id)
                                    ? 'ring-2 ring-primary bg-primary/5'
                                    : 'hover:shadow-md'
                                }`}
                                onClick={() => handleServiceToggle(service.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start space-x-3 space-x-reverse">
                                    <Checkbox
                                      checked={newContract.selectedServices.includes(service.id)}
                                      onChange={() => handleServiceToggle(service.id)}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold text-sm">{service.name_ar}</h3>
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {service.description_ar}
                                      </p>
                                      <Badge variant="outline" className="mt-2 text-xs">
                                        {service.category_id}
                                      </Badge>
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
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          تفاصيل إضافية
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="deliveryTimeframe">الإطار الزمني للتسليم</Label>
                          <Input
                            id="deliveryTimeframe"
                            value={newContract.deliveryTimeframe}
                            onChange={(e) => setNewContract(prev => ({...prev, deliveryTimeframe: e.target.value}))}
                            placeholder="مثال: خلال أسبوعين من بداية العمل"
                          />
                        </div>
                        <div>
                          <Label htmlFor="additionalNotes">ملاحظات إضافية</Label>
                          <Textarea
                            id="additionalNotes"
                            value={newContract.additionalNotes}
                            onChange={(e) => setNewContract(prev => ({...prev, additionalNotes: e.target.value}))}
                            placeholder="أي ملاحظات أو متطلبات خاصة..."
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* تنبيه مهم حول الأسعار */}
                    <Card className="border-orange-200 bg-orange-50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-orange-800 mb-1">تنبيه مهم حول التسعير</h3>
                            <p className="text-sm text-orange-700">
                              الأسعار النهائية للخدمات المختارة سيتم تحديدها وإدراجها في الفاتورة المرفقة مع العقد النهائي. 
                              سيتم التواصل معكم لمناقشة التفاصيل والأسعار قبل إصدار العقد النهائي.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* الموافقة على الشروط */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3 space-x-reverse">
                          <Checkbox
                            id="agreedTerms"
                            checked={newContract.agreedTerms}
                            onCheckedChange={(checked) => 
                              setNewContract(prev => ({...prev, agreedTerms: checked as boolean}))
                            }
                          />
                          <Label htmlFor="agreedTerms" className="text-sm cursor-pointer">
                            أوافق على <Button variant="link" className="p-0 h-auto text-sm">الشروط والأحكام</Button> الخاصة بالخدمات المختارة
                          </Label>
                        </div>
                      </CardContent>
                    </Card>

                    {/* أزرار التحكم */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          resetNewContract();
                        }}
                      >
                        إلغاء
                      </Button>
                      <Button
                        onClick={handleCreateContract}
                        disabled={isCreatingContract || !newContract.agreedTerms}
                        className="min-w-[120px]"
                      >
                        {isCreatingContract ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            جاري الإنشاء...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            إنشاء العقد
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Contracts List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>جاري تحميل العقود...</p>
            </div>
          ) : filteredContracts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">لا توجد عقود</h3>
                <p className="text-muted-foreground">لم يتم العثور على عقود مطابقة للفلاتر المحددة</p>
              </CardContent>
            </Card>
          ) : (
            filteredContracts.map((contract) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">عقد رقم: {contract.contract_number || contract.id?.substring(0, 8)}</h3>
                          <Badge className={getStatusColor(contract.status)}>
                            {getStatusLabel(contract.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {contract.client_name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {contract.client_email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {contract.client_phone}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(contract.created_at)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {contract.service_details?.services?.length || 0} خدمة
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadContractPDF(contract.id)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          تحميل PDF
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>تفاصيل العقد</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 p-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">اسم العميل</Label>
                                  <p className="text-sm text-muted-foreground">{contract.client_name}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">البريد الإلكتروني</Label>
                                  <p className="text-sm text-muted-foreground">{contract.client_email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">رقم الهاتف</Label>
                                  <p className="text-sm text-muted-foreground">{contract.client_phone}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">الحالة</Label>
                                  <Badge className={getStatusColor(contract.status)}>
                                    {getStatusLabel(contract.status)}
                                  </Badge>
                                </div>
                              </div>
                              
                              {contract.service_details?.services && (
                                <div>
                                  <Label className="text-sm font-medium">الخدمات المطلوبة</Label>
                                  <div className="mt-2 space-y-2">
                                    {contract.service_details.services.map((service: any, index: number) => (
                                      <div key={index} className="p-3 bg-muted rounded-lg">
                                        <h4 className="font-medium">{service.name}</h4>
                                        <p className="text-sm text-muted-foreground">{service.description}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {contract.service_details?.additional_notes && (
                                <div>
                                  <Label className="text-sm font-medium">ملاحظات إضافية</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{contract.service_details.additional_notes}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ContractManagement;