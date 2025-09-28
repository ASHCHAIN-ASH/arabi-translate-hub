import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
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
  AlertCircle
} from 'lucide-react';
import { Contract, ContractStatus, ServiceType } from '@/types/contract';
import { getAllContracts, searchContracts, updateContractStatus, getContractsByStatus } from '@/utils/supabaseContractService';
import Header from '@/components/Header';

const ContractManagement = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // تحميل العقود عند بداية التحميل
  useEffect(() => {
    loadContracts();
  }, []);

  // تطبيق الفلاتر
  useEffect(() => {
    filterContracts();
  }, [contracts, searchTerm, statusFilter]);

  const loadContracts = async () => {
    try {
      setIsLoading(true);
      const contractsData = await getAllContracts();
      setContracts(contractsData);
    } catch (error) {
      console.error('Error loading contracts:', error);
      toast.error('خطأ في تحميل العقود');
    } finally {
      setIsLoading(false);
    }
  };

  const filterContracts = async () => {
    let filtered = contracts;

    // فلترة حسب البحث
    if (searchTerm.trim()) {
      filtered = await searchContracts(searchTerm);
    }

    // فلترة حسب الحالة
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contract => contract.status === statusFilter);
    }

    setFilteredContracts(filtered);
  };

  const handleStatusUpdate = async (contractId: string, newStatus: ContractStatus) => {
    try {
      await updateContractStatus(contractId, newStatus);
      toast.success('تم تحديث حالة العقد بنجاح');
      loadContracts();
    } catch (error) {
      console.error('Error updating contract status:', error);
      toast.error('خطأ في تحديث حالة العقد');
    }
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

  const getServiceTypeLabel = (serviceType: ServiceType) => {
    const labels = {
      'translation-legal': 'ترجمة قانونية',
      'translation-business': 'ترجمة تجارية',
      'translation-technical': 'ترجمة تقنية',
      'translation-medical': 'ترجمة طبية',
      'translation-academic': 'ترجمة أكاديمية',
      'translation-literary': 'ترجمة أدبية',
      'translation-media': 'ترجمة إعلامية',
      'research-thesis': 'رسالة علمية',
      'research-plan': 'خطة بحث',
      'research-analysis': 'تحليل إحصائي',
      'research-formatting': 'تنسيق أكاديمي',
      'research-publication': 'خدمات النشر',
      'research-consultation': 'استشارة أكاديمية',
      'custom-service': 'خدمة مخصصة'
    };
    return labels[serviceType] || serviceType;
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
              نظام شامل لإدارة العقود الإلكترونية وموافقات العملاء
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

              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    عقد جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>إنشاء عقد جديد</DialogTitle>
                  </DialogHeader>
                  <div className="p-4">
                    <p className="text-center text-muted-foreground">
                      سيتم إضافة نموذج إنشاء العقود قريباً
                    </p>
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
                          <h3 className="text-lg font-semibold">{contract.serviceDetails.title}</h3>
                          <Badge className={getStatusColor(contract.status)}>
                            {getStatusLabel(contract.status)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{contract.serviceDetails.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {contract.clientName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(contract.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {contract.totalAmount.toLocaleString()} ريال
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {getServiceTypeLabel(contract.serviceType)}
                        </Badge>
                        
                        <Select
                          value={contract.status}
                          onValueChange={(value) => handleStatusUpdate(contract.id, value as ContractStatus)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
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
                            <Tabs defaultValue="details" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">التفاصيل</TabsTrigger>
                                <TabsTrigger value="content">محتوى العقد</TabsTrigger>
                                <TabsTrigger value="history">التاريخ</TabsTrigger>
                              </TabsList>
                              <TabsContent value="details" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">اسم العميل</label>
                                    <p className="text-sm text-muted-foreground">{contract.clientName}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">البريد الإلكتروني</label>
                                    <p className="text-sm text-muted-foreground">{contract.clientEmail}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">رقم الهاتف</label>
                                    <p className="text-sm text-muted-foreground">{contract.clientPhone}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">نوع الخدمة</label>
                                    <p className="text-sm text-muted-foreground">{getServiceTypeLabel(contract.serviceType)}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">التكلفة الإجمالية</label>
                                    <p className="text-sm text-muted-foreground">{contract.totalAmount.toLocaleString()} ريال</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">تاريخ التسليم</label>
                                    <p className="text-sm text-muted-foreground">{contract.deliveryDate}</p>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="content">
                                <div className="bg-muted p-4 rounded-lg">
                                  <pre className="whitespace-pre-wrap text-sm">{contract.contractContent}</pre>
                                </div>
                              </TabsContent>
                              <TabsContent value="history">
                                <div className="space-y-2 text-sm">
                                  <div>تاريخ الإنشاء: {formatDate(contract.createdAt)}</div>
                                  <div>آخر تحديث: {formatDate(contract.updatedAt)}</div>
                                  {contract.approvedAt && (
                                    <div>تاريخ الموافقة: {formatDate(contract.approvedAt)}</div>
                                  )}
                                </div>
                              </TabsContent>
                            </Tabs>
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
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