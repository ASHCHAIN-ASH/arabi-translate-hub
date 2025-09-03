import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Users, Mail, Phone, Calendar, Filter, Key, Edit, Eye, EyeOff, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  created_at: string;
  last_login?: string;
  email_verified?: boolean;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [passwordChangeModal, setPasswordChangeModal] = useState<{isOpen: boolean, userId: string, userName: string, userEmail: string}>({
    isOpen: false,
    userId: '',
    userName: '',
    userEmail: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [sendEmailNotification, setSendEmailNotification] = useState(true);

  useEffect(() => {
    fetchUsers();
    
    // إعداد التحديث اللحظي مع معالجة أفضل للأخطاء
    const subscription = supabase
      .channel('users_realtime_channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'users'
      }, (payload) => {
        console.log('New user added via realtime:', payload);
        const newUser = payload.new as User;
        setUsers(prevUsers => {
          // تجنب الإضافة المكررة
          if (prevUsers.some(u => u.id === newUser.id)) {
            return prevUsers;
          }
          return [newUser, ...prevUsers];
        });
        toast.success(`مستخدم جديد انضم: ${newUser.name || newUser.email}`, {
          description: `تم تسجيل ${newUser.email} بنجاح`,
          duration: 5000,
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users'
      }, (payload) => {
        console.log('User updated via realtime:', payload);
        const updatedUser = payload.new as User;
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === updatedUser.id ? updatedUser : user
          )
        );
        toast.info(`تم تحديث بيانات المستخدم: ${updatedUser.name || updatedUser.email}`);
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'users'
      }, (payload) => {
        console.log('User deleted via realtime:', payload);
        const deletedUserId = payload.old.id;
        setUsers(prevUsers => 
          prevUsers.filter(user => user.id !== deletedUserId)
        );
        toast.error(`تم حذف المستخدم`);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime subscription active for users table');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error in realtime subscription');
          toast.error('خطأ في التحديث المباشر');
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        toast.error(`خطأ في جلب بيانات المستخدمين: ${error.message}`);
        return;
      }
      
      console.log('Fetched users:', data);
      setUsers(data || []);
      
      if (data && data.length > 0) {
        toast.success(`تم جلب ${data.length} مستخدم بنجاح`);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('خطأ في الاتصال بقاعدة البيانات');
    } finally {
      setLoading(false);
    }
  };

  const sendWelcomeEmail = async (userId: string, userEmail: string, userName: string) => {
    try {
      await supabase.functions.invoke('send-welcome-email', {
        body: {
          user_email: userEmail,
          user_name: userName,
          user_id: userId
        }
      });
      toast.success(`تم إرسال بريد ترحيبي إلى ${userName}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      toast.error('خطأ في إرسال البريد الإلكتروني');
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      toast.success('تم تحديث حالة المستخدم بنجاح');
    } catch (error) {
      toast.error('خطأ في تحديث حالة المستخدم');
    }
  };

  const openPasswordChangeModal = (userId: string, userName: string, userEmail: string) => {
    setPasswordChangeModal({
      isOpen: true,
      userId,
      userName,
      userEmail
    });
    setNewPassword('');
    setConfirmPassword('');
    setSendEmailNotification(true);
  };

  const closePasswordChangeModal = () => {
    setPasswordChangeModal({
      isOpen: false,
      userId: '',
      userName: '',
      userEmail: ''
    });
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setSendEmailNotification(true);
  };

  const updateUserPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
      return;
    }

    try {
      setUpdatingPassword(true);
      
      // استخدام Edge Function لتحديث كلمة المرور مع خيار إرسال البريد الإلكتروني
      const { data, error } = await supabase.functions.invoke('update-user-password', {
        body: {
          userId: passwordChangeModal.userId,
          newPassword: newPassword,
          adminUserId: (await supabase.auth.getUser()).data.user?.id,
          sendEmail: sendEmailNotification
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // رسائل مختلفة بناءً على حالة إرسال البريد الإلكتروني
      if (sendEmailNotification) {
        if (data.emailSent) {
          toast.success(`✅ تم تحديث كلمة مرور ${passwordChangeModal.userName} وتم إرسال إشعار بالبريد الإلكتروني بنجاح`);
        } else {
          toast.success(`تم تحديث كلمة مرور ${passwordChangeModal.userName} بنجاح ولكن فشل في إرسال البريد الإلكتروني`);
        }
      } else {
        toast.success(`تم تحديث كلمة مرور ${passwordChangeModal.userName} بنجاح`);
      }

      closePasswordChangeModal();
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(`خطأ في تحديث كلمة المرور: ${error.message || 'حدث خطأ غير متوقع'}`);
    } finally {
      setUpdatingPassword(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      blocked: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      active: 'نشط',
      inactive: 'غير نشط',
      blocked: 'محظور',
      pending: 'في الانتظار'
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || colors.inactive}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AdminLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-arabic-formal font-bold text-foreground">إدارة المستخدمين</h1>
                <p className="text-muted-foreground">إدارة ومتابعة جميع المستخدمين المسجلين</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {users.length} مستخدم
              </Badge>
              <Button
                onClick={() => window.location.href = '/admin/add-user'}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Users className="w-4 h-4" />
                إضافة مستخدم جديد
              </Button>
            </div>
          </div>

        {/* إحصائيات سريعة */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">المستخدمون النشطون</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">في الانتظار</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {users.filter(u => u.status === 'pending').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">محظور</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.status === 'blocked').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">هذا الشهر</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter(u => {
                    const userDate = new Date(u.created_at);
                    const currentDate = new Date();
                    return userDate.getMonth() === currentDate.getMonth() && 
                           userDate.getFullYear() === currentDate.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* فلاتر البحث */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="البحث عن مستخدم..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-input bg-background px-3 py-2 rounded-md text-sm"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">نشط</option>
                  <option value="pending">في الانتظار</option>
                  <option value="inactive">غير نشط</option>
                  <option value="blocked">محظور</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* جدول المستخدمين */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">قائمة المستخدمين</h2>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد مستخدمون
                </div>
                ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="text-right font-semibold">المستخدم</TableHead>
                        <TableHead className="text-right font-semibold">معلومات الاتصال</TableHead>
                        <TableHead className="text-right font-semibold">الدور والحالة</TableHead>
                        <TableHead className="text-right font-semibold">معلومات إضافية</TableHead>
                        <TableHead className="text-right font-semibold">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user, index) => (
                        <TableRow
                          key={user.id}
                          className="hover:bg-muted/50 transition-colors border-b"
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-white text-sm font-medium">
                                  {(user.name || user.email).charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-foreground text-base">
                                  {user.name || 'بدون اسم'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ID: {user.id.slice(0, 8)}...
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell className="py-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="text-sm truncate max-w-[200px]">{user.email}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                  <span className="text-sm">{user.phone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell className="py-4">
                            <div className="space-y-2">
                              <Badge 
                                variant={user.role === 'admin' ? 'default' : 'secondary'}
                                className="font-medium"
                              >
                                {user.role === 'admin' ? 'مدير' : 'عميل'}
                              </Badge>
                              <div>
                                {getStatusBadge(user.status)}
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell className="py-4">
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span>
                                  {new Date(user.created_at).toLocaleDateString('ar-SA', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              {user.last_login && (
                                <div className="text-xs text-muted-foreground">
                                  آخر دخول: {new Date(user.last_login).toLocaleDateString('ar-SA')}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell className="py-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs px-2 py-1"
                                  onClick={() => sendWelcomeEmail(user.id, user.email, user.name || user.email)}
                                >
                                  <Mail className="w-3 h-3" />
                                </Button>
                                 <Button
                                   size="sm"
                                   variant="outline" 
                                   className="text-xs px-2 py-1"
                                   onClick={() => openPasswordChangeModal(user.id, user.name || user.email, user.email)}
                                 >
                                  <Key className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-1">
                                {user.status === 'active' ? (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="text-xs px-2 py-1 flex-1"
                                    onClick={() => updateUserStatus(user.id, 'blocked')}
                                  >
                                    حظر
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="text-xs px-2 py-1 flex-1"
                                    onClick={() => updateUserStatus(user.id, 'active')}
                                  >
                                    تفعيل
                                  </Button>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Modal تعديل كلمة المرور */}
        <Dialog open={passwordChangeModal.isOpen} onOpenChange={closePasswordChangeModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-right">تعديل كلمة المرور</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="text-sm text-muted-foreground text-center p-3 bg-muted/50 rounded-lg">
                تعديل كلمة مرور المستخدم: <span className="font-medium text-foreground">{passwordChangeModal.userName}</span>
                <br />
                البريد الإلكتروني: <span className="font-medium text-foreground">{passwordChangeModal.userEmail}</span>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Label htmlFor="newPassword" className="text-sm font-medium">كلمة المرور الجديدة</Label>
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="كلمة المرور الجديدة"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10 mt-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-0 top-6 h-10 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">تأكيد كلمة المرور</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="تأكيد كلمة المرور"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <input
                    type="checkbox"
                    id="sendEmailNotification"
                    checked={sendEmailNotification}
                    onChange={(e) => setSendEmailNotification(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <Label htmlFor="sendEmailNotification" className="text-sm font-medium cursor-pointer">
                      📧 إرسال إشعار بالبريد الإلكتروني للمستخدم
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      عند تفعيل هذا الخيار، سيتم إرسال بريد إلكتروني للمستخدم يحتوي على:
                    </p>
                    <ul className="text-xs text-muted-foreground mt-1 mr-4">
                      <li>• كلمة المرور الجديدة</li>
                      <li>• تفاصيل من قام بالتغيير</li>
                      <li>• تاريخ ووقت التغيير</li>
                      <li>• تعليمات الأمان</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <strong>متطلبات كلمة المرور:</strong>
                <ul className="mt-1 mr-4">
                  <li>• كلمة المرور يجب أن تكون 6 أحرف على الأقل</li>
                  <li>• تأكد من تطابق كلمة المرور مع التأكيد</li>
                  <li>• سيتم تطبيق التغيير فوراً</li>
                </ul>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={closePasswordChangeModal}
                  disabled={updatingPassword}
                >
                  إلغاء
                </Button>
                <Button 
                  onClick={updateUserPassword}
                  disabled={updatingPassword || !newPassword || !confirmPassword}
                  className="flex items-center gap-2"
                >
                  {updatingPassword ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري التحديث...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4" />
                      {sendEmailNotification ? 'تحديث وإرسال إشعار' : 'تحديث كلمة المرور'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminUsers;