import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  EyeOff,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Clock,
  Settings,
  Star,
  TrendingUp,
  Activity
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
        return (
          <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20 transition-colors">
            <CheckCircle className="w-3 h-3 ml-1" />
            نشط
          </Badge>
        );
      case 'blocked':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 transition-colors">
            <Ban className="w-3 h-3 ml-1" />
            محظور
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-muted text-muted-foreground border-muted hover:bg-muted/80 transition-colors">
            <Clock className="w-3 h-3 ml-1" />
            غير نشط
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // الحصول على شارة التحقق
  const getVerificationBadge = (customer: Customer) => {
    const badges = [];
    if (customer.email_verified) {
      badges.push(
        <Badge key="email" variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
          <Mail className="w-3 h-3 ml-1" />
          البريد محقق
        </Badge>
      );
    }
    if (customer.phone_verified) {
      badges.push(
        <Badge key="phone" variant="outline" className="text-xs bg-accent/10 text-accent-foreground border-accent/20">
          <Phone className="w-3 h-3 ml-1" />
          الهاتف محقق
        </Badge>
      );
    }
    if (badges.length === 0) {
      badges.push(
        <Badge key="none" variant="outline" className="text-xs bg-muted/50 text-muted-foreground border-muted">
          <Shield className="w-3 h-3 ml-1" />
          غير محقق
        </Badge>
      );
    }
    return badges;
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

        <AnimatePresence mode="wait">
          {/* الإحصائيات */}
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي العملاء</CardTitle>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <TrendingUp className="w-3 h-3 ml-1" />
                  جميع المستخدمين
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-success">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">العملاء النشطون</CardTitle>
                <div className="p-2 bg-success/10 rounded-full">
                  <UserCheck className="h-4 w-4 text-success" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{stats.active}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Activity className="w-3 h-3 ml-1" />
                  حسابات فعالة
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-destructive">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">العملاء المحظورون</CardTitle>
                <div className="p-2 bg-destructive/10 rounded-full">
                  <UserX className="h-4 w-4 text-destructive" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.blocked}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Ban className="w-3 h-3 ml-1" />
                  حسابات محظورة
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-accent">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">جديد اليوم</CardTitle>
                <div className="p-2 bg-accent/10 rounded-full">
                  <Star className="h-4 w-4 text-accent-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent-foreground">{stats.newToday}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3 ml-1" />
                  مسجلين جدد
                </div>
              </CardContent>
            </Card>
          </motion.div>
          </motion.div>

          {/* البحث والتصفية */}
          <motion.div
            key="filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-lg border p-4"
          >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث بالاسم أو البريد الإلكتروني..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center gap-2 min-w-[160px]">
                <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="تصفية بالحالة" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-success" />
                        نشط
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        غير نشط
                      </div>
                    </SelectItem>
                    <SelectItem value="blocked">
                      <div className="flex items-center gap-2">
                        <Ban className="w-3 h-3 text-destructive" />
                        محظور
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              عرض {filteredCustomers.length} من {stats.total} عميل
            </div>
          </div>
          </motion.div>

          {/* جدول العملاء */}
          <motion.div
            key="customers-table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <Card className="shadow-sm">
              <CardHeader className="pb-6 border-b">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  قائمة العملاء
                  <Badge variant="secondary" className="ml-2">
                    {filteredCustomers.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b bg-muted/30">
                        <TableHead className="font-semibold text-foreground py-4 px-6 min-w-[280px]">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            بيانات العميل
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-foreground py-4 px-4 min-w-[140px]">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            الهاتف
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-foreground py-4 px-4 min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            الحالة
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-foreground py-4 px-4 min-w-[180px]">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            حالة التحقق
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-foreground py-4 px-4 min-w-[140px]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            تاريخ التسجيل
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-foreground py-4 px-4 min-w-[140px]">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            آخر دخول
                          </div>
                        </TableHead>
                        <TableHead className="text-center font-semibold text-foreground py-4 px-4 min-w-[100px]">
                          <div className="flex items-center justify-center gap-2">
                            <Settings className="w-4 h-4" />
                            الإجراءات
                          </div>
                        </TableHead>
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
                      filteredCustomers.map((customer, index) => (
                      <motion.tr
                        key={customer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="hover:bg-muted/30 transition-all duration-200 border-b group"
                      >
                        <TableCell className="py-6 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/10">
                              <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground text-base mb-1 truncate">
                                {customer.full_name}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{customer.email}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-foreground font-medium">
                              {customer.phone || 'غير محدد'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-4">
                          {getStatusBadge(customer.status)}
                        </TableCell>
                        <TableCell className="py-6 px-4">
                          <div className="flex flex-wrap gap-1">
                            {getVerificationBadge(customer)}
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-4">
                          <div className="text-sm">
                            <div className="font-medium text-foreground">
                              {new Date(customer.created_at).toLocaleDateString('ar-SA', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(customer.created_at).getFullYear()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6 px-4">
                          <div className="text-sm">
                            {customer.last_login_at ? (
                              <>
                                <div className="font-medium text-foreground">
                                  {new Date(customer.last_login_at).toLocaleDateString('ar-SA', {
                                    day: 'numeric',
                                    month: 'short'
                                  })}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(customer.last_login_at).getFullYear()}
                                </div>
                              </>
                            ) : (
                              <span className="text-muted-foreground">لم يدخل بعد</span>
                            )}
                          </div>
                        </TableCell>
                         <TableCell className="py-6 px-4">
                           <div className="flex items-center justify-center">
                             <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                 <Button 
                                   variant="ghost" 
                                   size="sm"
                                   className="h-9 w-9 p-0 hover:bg-primary/10 transition-all duration-200 rounded-full opacity-60 group-hover:opacity-100"
                                 >
                                   <MoreVertical className="h-4 w-4" />
                                 </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="z-50 w-48">
                                 <DropdownMenuItem 
                                   onClick={() => {
                                     setPasswordModal({ isOpen: true, customer });
                                     setNewPassword('');
                                   }}
                                   className="cursor-pointer gap-2 py-2.5"
                                 >
                                   <Key className="h-4 w-4 text-primary" />
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
                                   className="cursor-pointer gap-2 py-2.5"
                                 >
                                   <Edit className="h-4 w-4 text-accent-foreground" />
                                   تعديل البيانات
                                 </DropdownMenuItem>

                                 <DropdownMenuSeparator />
                                 
                                 {customer.status === 'active' ? (
                                   <DropdownMenuItem 
                                     onClick={() => {
                                       setStatusModal({ isOpen: true, customer });
                                       setNewStatus('blocked');
                                     }}
                                     className="text-destructive cursor-pointer gap-2 py-2.5"
                                   >
                                     <Ban className="h-4 w-4" />
                                     حظر العميل
                                   </DropdownMenuItem>
                                 ) : (
                                   <DropdownMenuItem 
                                     onClick={() => {
                                       setStatusModal({ isOpen: true, customer });
                                       setNewStatus('active');
                                     }}
                                     className="text-success cursor-pointer gap-2 py-2.5"
                                   >
                                     <CheckCircle className="h-4 w-4" />
                                     تفعيل العميل
                                   </DropdownMenuItem>
                                 )}

                                 <DropdownMenuSeparator />

                                 <DropdownMenuItem 
                                   onClick={() => handleDeleteCustomer(customer)}
                                   className="text-destructive cursor-pointer gap-2 py-2.5"
                                 >
                                   <Trash2 className="h-4 w-4" />
                                   حذف العميل
                                 </DropdownMenuItem>
                               </DropdownMenuContent>
                             </DropdownMenu>
                           </div>
                         </TableCell>
                       </motion.tr>
                     ))
                    )}
                   </TableBody>
                 </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
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