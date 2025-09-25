import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Send, 
  X, 
  Download, 
  Eye, 
  Plus, 
  Calculator, 
  Save,
  Search,
  Filter,
  Users,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

interface Contract {
  id: string;
  contract_no: string;
  client_name: string;
  service_type: string;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
  pdf_path?: string;
}

interface Client {
  id: string;
  full_name: string;
}

const ContractsSystem = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewContractDialog, setShowNewContractDialog] = useState(false);
  const [contractNumber, setContractNumber] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    client_name: '',
    service_type: '',
    service_description: '',
    service_price: 0,
    currency: 'SAR',
    client_type: 'business',
    payment_terms: 'دفعة واحدة',
    contract_duration: '30 يوم'
  });

  const [calculations, setCalculations] = useState({
    subtotal: 0,
    vat_amount: 0,
    total_amount: 0
  });

  useEffect(() => {
    loadContracts();
    loadClients();
    generateContractNumber();
  }, []);

  const loadContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedContracts = data?.map(contract => ({
        id: contract.id,
        contract_no: contract.contract_number,
        client_name: contract.client_name,
        service_type: contract.service_type,
        total_amount: contract.service_price || 0,
        currency: contract.currency || 'SAR',
        status: contract.status || 'draft',
        created_at: contract.created_at,
        pdf_path: contract.contract_pdf_url
      })) || [];

      setContracts(formattedContracts);
    } catch (error) {
      console.error('Error loading contracts:', error);
      toast.error('خطأ في تحميل العقود');
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, display_name')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const formattedClients = data?.map(client => ({
        id: client.id,
        full_name: client.display_name || 'غير محدد'
      })) || [];
      setClients(formattedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const generateContractNumber = async () => {
    try {
      const { data, error } = await supabase.rpc('next_contract_number');
      if (error) throw error;
      setContractNumber(data || `MUP-${new Date().getFullYear()}-0001`);
    } catch (error) {
      console.error('Error generating contract number:', error);
      setContractNumber(`MUP-${new Date().getFullYear()}-0001`);
    }
  };

  const calculateTotals = () => {
    try {
      const price = Number(formData.service_price || 0);
      const vatPercent = 15;
      const vatAmount = +(price * vatPercent / 100).toFixed(2);
      const totalAmount = +(price + vatAmount).toFixed(2);

      setCalculations({
        subtotal: price,
        vat_amount: vatAmount,
        total_amount: totalAmount
      });

      toast.success('تم حساب الإجمالي');
    } catch (error) {
      toast.error('خطأ في حساب الإجمالي');
    }
  };

  const handleSaveContract = async () => {
    if (!formData.client_name || !formData.service_type) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);
      
      const contractData = {
        contract_number: contractNumber,
        client_name: formData.client_name,
        client_email: 'temp@example.com',
        client_phone: '000000000',
        client_type: formData.client_type,
        service_type: formData.service_type,
        service_description: formData.service_description,
        service_price: calculations.total_amount,
        currency: formData.currency,
        payment_terms: formData.payment_terms,
        contract_duration: formData.contract_duration,
        status: 'draft',
        user_id: 'temp-user-id'
      };

      const { error } = await supabase
        .from('contracts')
        .insert([contractData]);

      if (error) throw error;

      toast.success('تم حفظ العقد بنجاح');
      setShowNewContractDialog(false);
      loadContracts();
      generateContractNumber();
      
      // Reset form
      setFormData({
        client_name: '',
        service_type: '',
        service_description: '',
        service_price: 0,
        currency: 'SAR',
        client_type: 'business',
        payment_terms: 'دفعة واحدة',
        contract_duration: '30 يوم'
      });
    } catch (error) {
      console.error('Error saving contract:', error);
      toast.error('خطأ في حفظ العقد');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'sent': return 'مرسل';
      case 'signed': return 'موقع';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.contract_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleGeneratePDF = async (contractId: string) => {
    toast.success('سيتم إنشاء ملف PDF قريباً');
  };

  const handleSendContract = async (contractId: string) => {
    toast.success('سيتم إرسال العقد قريباً');
  };

  const handleCancelContract = async (contractId: string) => {
    try {
      const { error } = await supabase
        .from('contracts')
        .update({ status: 'cancelled' })
        .eq('id', contractId);

      if (error) throw error;
      
      toast.success('تم إلغاء العقد بنجاح');
      loadContracts();
    } catch (error) {
      console.error('Error cancelling contract:', error);
      toast.error('خطأ في إلغاء العقد');
    }
  };

  if (loading && contracts.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FileText className="w-8 h-8 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">جاري تحميل نظام العقود...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              نظام إدارة العقود
            </h1>
            <p className="text-muted-foreground mt-1">إدارة شاملة لجميع العقود والاتفاقيات</p>
          </div>
          
          <Dialog open={showNewContractDialog} onOpenChange={setShowNewContractDialog}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 ml-2" />
                إنشاء عقد جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إنشاء عقد جديد</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contract_no">رقم العقد</Label>
                      <Input
                        id="contract_no"
                        value={contractNumber}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="client_name">اسم العميل *</Label>
                      <Input
                        id="client_name"
                        value={formData.client_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                        placeholder="ادخل اسم العميل"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="service_type">نوع الخدمة *</Label>
                      <Input
                        id="service_type"
                        value={formData.service_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, service_type: e.target.value }))}
                        placeholder="مثال: ترجمة قانونية"
                      />
                    </div>
                    <div>
                      <Label htmlFor="client_type">نوع العميل</Label>
                      <Select value={formData.client_type} onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, client_type: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">فرد</SelectItem>
                          <SelectItem value="business">شركة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="service_description">وصف الخدمة</Label>
                    <Textarea
                      id="service_description"
                      value={formData.service_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, service_description: e.target.value }))}
                      placeholder="وصف تفصيلي للخدمة..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="service_price">سعر الخدمة *</Label>
                      <Input
                        id="service_price"
                        type="number"
                        value={formData.service_price}
                        onChange={(e) => setFormData(prev => ({ ...prev, service_price: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">العملة</Label>
                      <Select value={formData.currency} onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, currency: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAR">ريال سعودي</SelectItem>
                          <SelectItem value="USD">دولار أمريكي</SelectItem>
                          <SelectItem value="EUR">يورو</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={calculateTotals} variant="outline" className="w-full">
                        <Calculator className="w-4 h-4 ml-2" />
                        حساب
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>ملخص المبالغ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">المبلغ الأساسي:</span>
                        <span className="font-medium">{calculations.subtotal.toFixed(2)} {formData.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ضريبة (15%):</span>
                        <span className="font-medium">{calculations.vat_amount.toFixed(2)} {formData.currency}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-bold">
                          <span>الإجمالي:</span>
                          <span className="text-primary">{calculations.total_amount.toFixed(2)} {formData.currency}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <Button onClick={handleSaveContract} disabled={loading} className="w-full">
                      <Save className="w-4 h-4 ml-2" />
                      {loading ? 'جاري الحفظ...' : 'حفظ العقد'}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="contracts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contracts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              العقود
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              العملاء
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              القوالب
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contracts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  البحث والتصفية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="البحث برقم العقد أو اسم العميل..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="تصفية بالحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="sent">مرسل</SelectItem>
                      <SelectItem value="signed">موقع</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 ml-2" />
                  العقود ({filteredContracts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredContracts.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">لا توجد عقود مطابقة للبحث</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredContracts.map((contract) => (
                      <div
                        key={contract.id}
                        className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{contract.contract_no}</h3>
                              <Badge className={`${getStatusColor(contract.status)} text-xs`}>
                                {getStatusLabel(contract.status)}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-1">{contract.client_name}</p>
                            <p className="text-sm text-muted-foreground">{contract.service_type}</p>
                            <p className="text-xs text-muted-foreground">
                              تاريخ الإنشاء: {new Date(contract.created_at).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <p className="font-bold text-lg text-primary">
                              {contract.total_amount.toLocaleString()} {contract.currency}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGeneratePDF(contract.id)}
                                className="text-xs"
                              >
                                <Download className="w-3 h-3 ml-1" />
                                PDF
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSendContract(contract.id)}
                                className="text-xs"
                              >
                                <Send className="w-3 h-3 ml-1" />
                                إرسال
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/adminmaster/contracts/${contract.id}`)}
                                className="text-xs"
                              >
                                <Eye className="w-3 h-3 ml-1" />
                                عرض
                              </Button>
                              {contract.status !== 'cancelled' && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleCancelContract(contract.id)}
                                  className="text-xs"
                                >
                                  <X className="w-3 h-3 ml-1" />
                                  إلغاء
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">إدارة العملاء</h3>
                <p className="text-muted-foreground mb-4">
                  ستتم إضافة إدارة العملاء في التحديث القادم
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardContent className="text-center py-12">
                <Copy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">قوالب العقود</h3>
                <p className="text-muted-foreground mb-4">
                  ستتم إضافة نظام قوالب العقود في التحديث القادم
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ContractsSystem;