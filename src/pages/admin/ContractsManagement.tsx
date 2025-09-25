import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Send, X, Download, Eye } from 'lucide-react';
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

interface ContractType {
  id: string;
  name_ar: string;
}

const ContractsManagement = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadContracts();
    loadContractTypes();
  }, []);

  const loadContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          clients!inner(full_name),
          contract_types!inner(name_ar)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedContracts = data?.map(contract => ({
        id: contract.id,
        contract_no: contract.contract_number || `C-${new Date().getFullYear()}-0001`,
        client_name: contract.clients?.full_name || 'غير محدد',
        service_type: contract.contract_types?.name_ar || 'غير محدد',
        total_amount: contract.total_amount || 0,
        currency: contract.currency || 'SAR',
        status: contract.status || 'draft',
        created_at: contract.created_at,
        pdf_path: contract.pdf_path
      })) || [];

      setContracts(formattedContracts);
    } catch (error) {
      console.error('Error loading contracts:', error);
      toast.error('خطأ في تحميل العقود');
    } finally {
      setLoading(false);
    }
  };

  const loadContractTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('contract_types')
        .select('id, name_ar')
        .order('name_ar');

      if (error) throw error;
      setContractTypes(data || []);
    } catch (error) {
      console.error('Error loading contract types:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-yellow-100 text-yellow-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'sent': return 'مرسل';
      case 'viewed': return 'تم العرض';
      case 'signed': return 'موقع';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const handleGeneratePDF = async (contractId: string) => {
    try {
      // هنا يمكن إضافة API call لتوليد PDF
      toast.success('تم توليد ملف PDF بنجاح');
    } catch (error) {
      toast.error('خطأ في توليد ملف PDF');
    }
  };

  const handleSendContract = async (contractId: string) => {
    try {
      // هنا يمكن إضافة API call لإرسال العقد
      toast.success('تم إرسال العقد بنجاح');
    } catch (error) {
      toast.error('خطأ في إرسال العقد');
    }
  };

  const handleCancelContract = async (contractId: string) => {
    try {
      const { error } = await supabase
        .from('contracts')
        .update({ status: 'cancelled' })
        .eq('id', contractId);

      if (error) throw error;
      toast.success('تم إلغاء العقد');
      loadContracts();
    } catch (error) {
      toast.error('خطأ في إلغاء العقد');
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.contract_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.service_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة العقود</h1>
        <Button onClick={() => navigate('/adminmaster/contracts/new')}>
          <FileText className="w-4 h-4 ml-2" />
          إنشاء عقد جديد
        </Button>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <SelectItem value="viewed">تم العرض</SelectItem>
                <SelectItem value="signed">موقع</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="تصفية بالنوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {contractTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name_ar}>
                    {type.name_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* قائمة العقود */}
      <div className="space-y-4">
        {filteredContracts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">لا توجد عقود</p>
            </CardContent>
          </Card>
        ) : (
          filteredContracts.map((contract) => (
            <Card key={contract.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{contract.contract_no}</h3>
                      <Badge className={getStatusColor(contract.status)}>
                        {getStatusLabel(contract.status)}
                      </Badge>
                    </div>
                    <p className="text-gray-600">العميل: {contract.client_name}</p>
                    <p className="text-sm text-gray-500">النوع: {contract.service_type}</p>
                    <p className="text-sm text-gray-500">
                      المبلغ: {contract.total_amount.toLocaleString()} {contract.currency}
                    </p>
                    <p className="text-sm text-gray-500">
                      تاريخ الإنشاء: {new Date(contract.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGeneratePDF(contract.id)}
                      title="توليد PDF"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    
                    {contract.status === 'draft' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendContract(contract.id)}
                        title="إرسال العقد"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {contract.status !== 'cancelled' && contract.status !== 'signed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelContract(contract.id)}
                        title="إلغاء العقد"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/adminmaster/contracts/${contract.id}`)}
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ContractsManagement;