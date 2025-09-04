import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Key,
  Ban,
  CheckCircle,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useCustomers, Customer } from '@/hooks/useCustomers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface PasswordChangeModal {
  isOpen: boolean;
  customer: Customer | null;
}

interface StatusChangeModal {
  isOpen: boolean;
  customer: Customer | null;
}

interface EditProfileModal {
  isOpen: boolean;
  customer: Customer | null;
}

const AdminCustomers = () => {
  const { customers, stats, loading, error, updateCustomerPassword, updateCustomerStatus, updateCustomerProfile, deleteCustomer, refresh } = useCustomers();
  
  // تشخيص البيانات
  console.log('🔍 AdminCustomers Debug Info:', {
    customersCount: customers.length,
    customersData: customers,
    stats,
    loading,
    error
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [passwordModal, setPasswordModal] = useState<PasswordChangeModal>({ isOpen: false, customer: null });
  const [statusModal, setStatusModal] = useState<StatusChangeModal>({ isOpen: false, customer: null });
  const [editModal, setEditModal] = useState<EditProfileModal>({ isOpen: false, customer: null });
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [editFormData, setEditFormData] = useState({ full_name: '', phone: '' });

  // تصفية العملاء
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // الحصول على لون الشارة حسب الحالة
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">نشط</Badge>;
      case 'blocked':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">محظور</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">غير نشط</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // التعامل مع تغيير كلمة المرور
  const handlePasswordChange = async () => {
    if (!passwordModal.customer || !newPassword) return;

    try {
      const result = await updateCustomerPassword(passwordModal.customer.id, newPassword);
      
      if (result.success) {
        toast.success('تم تحديث كلمة المرور بنجاح');
        setPasswordModal({ isOpen: false, customer: null });
        setNewPassword('');
      } else {
        toast.error(result.message || 'فشل في تحديث كلمة المرور');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث كلمة المرور');
    }
  };

  // التعامل مع تغيير الحالة
  const handleStatusChange = async () => {
    if (!statusModal.customer || !newStatus) return;

    try {
      const result = await updateCustomerStatus(statusModal.customer.id, newStatus, statusReason);
      
      if (result.success) {
        toast.success('تم تحديث حالة العميل بنجاح');
        setStatusModal({ isOpen: false, customer: null });
        setNewStatus('');
        setStatusReason('');
      } else {
        toast.error(result.message || 'فشل في تحديث الحالة');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الحالة');
    }
  };

  // التعامل مع تحديث الملف الشخصي
  const handleProfileEdit = async () => {
    if (!editModal.customer) return;

    try {
      const result = await updateCustomerProfile(editModal.customer.id, editFormData);
      
      if (result.success) {
        toast.success('تم تحديث بيانات العميل بنجاح');
        setEditModal({ isOpen: false, customer: null });
        setEditFormData({ full_name: '', phone: '' });
      } else {
        toast.error(result.message || 'فشل في تحديث البيانات');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث البيانات');
    }
  };

  // التعامل مع حذف العميل
  const handleDeleteCustomer = async (customer: Customer) => {
    if (!confirm(`هل أنت متأكد من حذف العميل ${customer.full_name}؟`)) return;

    try {
      const result = await deleteCustomer(customer.id);
      
      if (result.success) {
        toast.success('تم حذف العميل بنجاح');
      } else {
        toast.error('فشل في حذف العميل');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف العميل');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل بيانات العملاء...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">خطأ في تحميل بيانات العملاء</p>
            <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">إدارة العملاء</h1>
            <p className="text-muted-foreground">إدارة جميع عملاء النظام بالتفصيل</p>
          </div>
          <div className="text-sm text-muted-foreground">
            إجمالي العملاء: {stats.total}
          </div>
        </motion.div>

        {/* الإحصائيات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العملاء النشطون</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العملاء المحظورون</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">جديد اليوم</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.newToday}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* البحث والتصفية */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="البحث عن عميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="تصفية بالحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="blocked">محظور</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* جدول العملاء */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                قائمة العملاء ({filteredCustomers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العميل</TableHead>
                      <TableHead>معلومات الاتصال</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>التحقق</TableHead>
                      <TableHead>تاريخ التسجيل</TableHead>
                      <TableHead>آخر دخول</TableHead>
                      <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                   <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                            جاري تحميل العملاء...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-red-500">
                          خطأ في تحميل العملاء: {error}
                          <Button onClick={() => window.location.reload()} className="mt-2 block mx-auto">
                            إعادة المحاولة
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center text-muted-foreground">
                            <Users className="h-12 w-12 mb-4 text-muted-foreground/50" />
                            <h3 className="text-lg font-medium mb-2">لا يوجد عملاء</h3>
                            <p className="text-sm mb-4">
                              {searchTerm || statusFilter !== 'all' 
                                ? 'لا يوجد عملاء مطابقون لمعايير البحث' 
                                : 'لم يتم تسجيل أي عملاء بعد'
                              }
                            </p>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => {
                                  setSearchTerm('');
                                  setStatusFilter('all');
                                }} 
                                variant="outline"
                                size="sm"
                              >
                                مسح المرشحات
                              </Button>
                              <Button 
                                onClick={() => window.location.reload()} 
                                variant="default"
                                size="sm"
                              >
                                تحديث الصفحة
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{customer.full_name}</div>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {customer.phone || 'غير محدد'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(customer.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {customer.email_verified && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                البريد محقق
                              </Badge>
                            )}
                            {customer.phone_verified && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                الهاتف محقق
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(customer.created_at).toLocaleDateString('ar-SA')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {customer.last_login_at 
                              ? new Date(customer.last_login_at).toLocaleDateString('ar-SA')
                              : 'لم يدخل بعد'
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => {
                                  setPasswordModal({ isOpen: true, customer });
                                  setNewPassword('');
                                }}
                              >
                                <Key className="mr-2 h-4 w-4" />
                                تغيير كلمة المرور
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem 
                                onClick={() => {
                                  setEditModal({ isOpen: true, customer });
                                  setEditFormData({
                                    full_name: customer.full_name,
                                    phone: customer.phone || ''
                                  });
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                تعديل البيانات
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                              
                              {customer.status === 'active' ? (
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setStatusModal({ isOpen: true, customer });
                                    setNewStatus('blocked');
                                  }}
                                  className="text-red-600"
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  حظر العميل
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setStatusModal({ isOpen: true, customer });
                                    setNewStatus('active');
                                  }}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  تفعيل العميل
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />

                              <DropdownMenuItem 
                                onClick={() => handleDeleteCustomer(customer)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                حذف العميل
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                     ))
                    )}
                   </TableBody>
                 </Table>
               </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Modal تغيير كلمة المرور */}
      <Dialog open={passwordModal.isOpen} onOpenChange={(open) => setPasswordModal({ isOpen: open, customer: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تغيير كلمة المرور - {passwordModal.customer?.full_name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
              <div className="relative mt-1">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordModal({ isOpen: false, customer: null })}>
              إلغاء
            </Button>
            <Button onClick={handlePasswordChange} disabled={!newPassword}>
              تحديث كلمة المرور
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal تغيير الحالة */}
      <Dialog open={statusModal.isOpen} onOpenChange={(open) => setStatusModal({ isOpen: open, customer: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تغيير حالة العميل - {statusModal.customer?.full_name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-status">الحالة الجديدة</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة الجديدة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                  <SelectItem value="blocked">محظور</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status-reason">سبب التغيير (اختياري)</Label>
              <Textarea
                id="status-reason"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="اكتب سبب تغيير الحالة..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusModal({ isOpen: false, customer: null })}>
              إلغاء
            </Button>
            <Button onClick={handleStatusChange} disabled={!newStatus}>
              تحديث الحالة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal تعديل البيانات */}
      <Dialog open={editModal.isOpen} onOpenChange={(open) => setEditModal({ isOpen: open, customer: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل بيانات العميل - {editModal.customer?.full_name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">الاسم الكامل</Label>
              <Input
                id="edit-name"
                value={editFormData.full_name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="الاسم الكامل"
              />
            </div>

            <div>
              <Label htmlFor="edit-phone">رقم الهاتف</Label>
              <Input
                id="edit-phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="رقم الهاتف"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModal({ isOpen: false, customer: null })}>
              إلغاء
            </Button>
            <Button onClick={handleProfileEdit}>
              تحديث البيانات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCustomers;