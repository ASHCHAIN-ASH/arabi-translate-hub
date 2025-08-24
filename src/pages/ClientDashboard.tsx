import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ClientSidebar } from '@/components/ClientSidebar';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  Bell
} from 'lucide-react';
import { Contract, ContractStatus } from '@/types/contract';
import { getAllContracts } from '@/utils/supabaseContractService';

const ClientDashboard = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock client data - in real app, this would come from authentication
  const clientData = {
    name: 'أحمد محمد السعيد',
    email: 'ahmed@example.com',
    phone: '0501234567',
    joinDate: '2024-01-15'
  };

  useEffect(() => {
    loadClientContracts();
  }, []);

  const loadClientContracts = async () => {
    try {
      setIsLoading(true);
      // In real app, filter by client email/ID
      const allContracts = await getAllContracts();
      // Mock filter - in production, filter by authenticated user
      const clientContracts = allContracts.slice(0, 3);
      setContracts(clientContracts);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setIsLoading(false);
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

  const getContractStats = () => {
    const stats = {
      total: contracts.length,
      pending: contracts.filter(c => ['draft', 'sent', 'reviewed'].includes(c.status)).length,
      active: contracts.filter(c => c.status === 'active').length,
      completed: contracts.filter(c => c.status === 'completed').length,
      totalValue: contracts.reduce((sum, c) => sum + c.totalAmount, 0)
    };
    return stats;
  };

  const stats = getContractStats();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
              <h1 className="text-xl font-semibold">لوحة تحكم العميل</h1>
            </div>
          </div>
          
          <div className="mr-auto px-6">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex min-h-screen w-full">
          <ClientSidebar />

          <main className="flex-1 p-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-2">مرحباً، {clientData.name}</h2>
                <p className="text-muted-foreground">
                  يمكنك متابعة عقودك وطلب خدمات جديدة من خلال لوحة التحكم
                </p>
              </div>
            </motion.div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">إجمالي العقود</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                      </div>
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">في الانتظار</p>
                        <p className="text-2xl font-bold">{stats.pending}</p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">العقود النشطة</p>
                        <p className="text-2xl font-bold">{stats.active}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">إجمالي القيمة</p>
                        <p className="text-2xl font-bold">{stats.totalValue.toLocaleString()} ر.س</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>إجراءات سريعة</CardTitle>
                  <CardDescription>
                    الإجراءات الأكثر استخداماً
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      onClick={() => window.location.href = '/contract-request'}
                      className="bg-gradient-primary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      طلب عقد جديد
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/client/contracts'}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      مراجعة العقود
                    </Button>
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      جدولة اجتماع
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Contracts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>العقود الأخيرة</CardTitle>
                      <CardDescription>
                        آخر العقود التي تم التعامل معها
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/client/contracts'}
                    >
                      عرض الكل
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">جاري التحميل...</p>
                    </div>
                  ) : contracts.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">لا توجد عقود</h3>
                      <p className="text-muted-foreground mb-4">
                        لم تقم بإنشاء أي عقود بعد
                      </p>
                      <Button onClick={() => window.location.href = '/contract-request'}>
                        <Plus className="h-4 w-4 mr-2" />
                        إنشاء عقد جديد
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {contracts.map((contract) => (
                        <div 
                          key={contract.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{contract.serviceDetails.title}</h4>
                              <Badge className={getStatusColor(contract.status)}>
                                {getStatusLabel(contract.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {contract.serviceDetails.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(contract.createdAt)}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {contract.totalAmount.toLocaleString()} ر.س
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.location.href = `/contract-approval?id=${contract.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ClientDashboard;