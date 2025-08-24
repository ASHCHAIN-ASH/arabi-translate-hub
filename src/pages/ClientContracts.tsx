import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { 
  FileText, 
  Search, 
  Eye, 
  Download,
  Filter,
  Calendar,
  DollarSign,
  Plus
} from 'lucide-react';
import { Contract, ContractStatus } from '@/types/contract';
import { getAllContracts, searchContracts } from '@/utils/supabaseContractService';

const ClientContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContracts();
  }, []);

  useEffect(() => {
    filterContracts();
  }, [contracts, searchTerm, statusFilter]);

  const loadContracts = async () => {
    try {
      setIsLoading(true);
      const allContracts = await getAllContracts();
      // In real app, filter by authenticated client
      setContracts(allContracts);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterContracts = async () => {
    let filtered = contracts;

    // Search filter
    if (searchTerm.trim()) {
      filtered = await searchContracts(searchTerm);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contract => contract.status === statusFilter);
    }

    setFilteredContracts(filtered);
  };

  const getStatusColor = (status: ContractStatus) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      signed: 'bg-emerald-100 text-emerald-800',
      active: 'bg-cyan-100 text-cyan-800',
      completed: 'bg-indigo-100 text-indigo-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: ContractStatus) => {
    const labels = {
      draft: 'مسودة',
      sent: 'مرسل',
      reviewed: 'تمت المراجعة',
      approved: 'موافق عليه',
      signed: 'موقع',
      active: 'نشط',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      expired: 'منتهي الصلاحية'
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

  const getActionButton = (contract: Contract) => {
    switch (contract.status) {
      case 'sent':
      case 'reviewed':
        return (
          <Button 
            size="sm"
            onClick={() => window.location.href = `/contract-approval?id=${contract.id}`}
          >
            مراجعة والموافقة
          </Button>
        );
      case 'approved':
      case 'signed':
      case 'active':
      case 'completed':
        return (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = `/contract-approval?id=${contract.id}`}
          >
            <Eye className="h-4 w-4 mr-2" />
            عرض
          </Button>
        );
      default:
        return (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = `/contract-approval?id=${contract.id}`}
          >
            <Eye className="h-4 w-4 mr-2" />
            عرض
          </Button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SidebarProvider>
        {/* Header */}
        <header className="h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="flex items-center gap-4 px-6">
            <SidebarTrigger className="ml-2" />
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">عقودي</h1>
            </div>
          </div>
        </header>

        <div className="flex min-h-screen w-full">
          <ClientSidebar />

          <main className="flex-1 p-6">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold">عقودي</h2>
                  <p className="text-muted-foreground">
                    جميع العقود الخاصة بك ومتابعة حالاتها
                  </p>
                </div>
                <Button 
                  onClick={() => window.location.href = '/contract-request'}
                  className="bg-gradient-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  طلب عقد جديد
                </Button>
              </div>
            </motion.div>

            {/* Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <Card>
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
                    
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ContractStatus | 'all')}>
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
                        <SelectItem value="expired">منتهي الصلاحية</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button onClick={loadContracts} variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      تحديث
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contracts List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isLoading ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>جاري تحميل العقود...</p>
                  </CardContent>
                </Card>
              ) : filteredContracts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">لا توجد عقود</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'لم يتم العثور على عقود مطابقة للفلاتر المحددة'
                        : 'لم تقم بإنشاء أي عقود بعد'
                      }
                    </p>
                    <Button onClick={() => window.location.href = '/contract-request'}>
                      <Plus className="h-4 w-4 mr-2" />
                      إنشاء عقد جديد
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredContracts.map((contract, index) => (
                    <motion.div
                      key={contract.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold">{contract.serviceDetails.title}</h3>
                                <Badge className={getStatusColor(contract.status)}>
                                  {getStatusLabel(contract.status)}
                                </Badge>
                              </div>
                              
                              <p className="text-muted-foreground mb-3">
                                {contract.serviceDetails.description}
                              </p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span>تاريخ الإنشاء: {formatDate(contract.createdAt)}</span>
                                </div>
                                
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <DollarSign className="h-4 w-4" />
                                  <span>القيمة: {contract.totalAmount.toLocaleString()} ر.س</span>
                                </div>
                                
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span>تاريخ التسليم: {contract.deliveryDate}</span>
                                </div>
                              </div>
                              
                              {contract.approvedAt && (
                                <div className="mt-2 text-sm text-green-600">
                                  تمت الموافقة في: {formatDate(contract.approvedAt)}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              {getActionButton(contract)}
                              
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ClientContracts;