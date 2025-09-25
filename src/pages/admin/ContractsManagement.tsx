import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Send, X, Download, Eye, Plus } from 'lucide-react';
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
    const matchesType = typeFilter === 'all' || contract.service_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FileText className="w-8 h-8 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">جاري تحميل العقود...</p>
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
              إدارة العقود
            </h1>
            <p className="text-muted-foreground mt-1">إدارة وتتبع جميع العقود والاتفاقيات</p>
          </div>
          <Button onClick={() => navigate('/adminmaster/contracts/new')} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 ml-2" />
            إنشاء عقد جديد
          </Button>
        </div>

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
                    <SelectItem key={type.id} value={type.id}>
                      {type.name_ar}
                    </SelectItem>
                  ))}
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
      </div>
    </AdminLayout>
  );
};

export default ContractsManagement;