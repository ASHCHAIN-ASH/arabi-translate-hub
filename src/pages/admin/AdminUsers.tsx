import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users, Mail, Phone, Calendar, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  created_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
                      <TableRow>
                        <TableHead className="text-right">المستخدم</TableHead>
                        <TableHead className="text-right">البريد الإلكتروني</TableHead>
                        <TableHead className="text-right">الهاتف</TableHead>
                        <TableHead className="text-right">الدور</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">تاريخ التسجيل</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user, index) => (
                        <TableRow
                          key={user.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-white text-sm font-medium">
                                  {(user.name || user.email).charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">
                                  {user.name || 'بدون اسم'}
                                </p>
                                <p className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}...</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 min-w-0">
                              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                              <span className="text-sm truncate">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.phone ? (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="text-sm">{user.phone}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">غير متوفر</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.role === 'admin' ? 'default' : 'secondary'}
                              className="font-medium"
                            >
                              {user.role === 'admin' ? 'مدير' : 'عميل'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(user.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                              <span className="text-sm">
                                {new Date(user.created_at).toLocaleDateString('ar-SA', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => sendWelcomeEmail(user.id, user.email, user.name || user.email)}
                              >
                                <Mail className="w-3 h-3 ml-1" />
                                بريد ترحيبي
                              </Button>
                              {user.status === 'active' ? (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="text-xs"
                                  onClick={() => updateUserStatus(user.id, 'blocked')}
                                >
                                  حظر
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="text-xs"
                                  onClick={() => updateUserStatus(user.id, 'active')}
                                >
                                  تفعيل
                                </Button>
                              )}
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
      </motion.div>
    </AdminLayout>
  );
};

export default AdminUsers;