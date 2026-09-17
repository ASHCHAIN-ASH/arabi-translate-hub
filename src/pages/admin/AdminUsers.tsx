import React, { useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Search, Users, Mail, Phone, Calendar, Filter, Key, Eye, EyeOff,
  Shield, ShieldCheck, UserPlus, RefreshCw, CheckCircle2, Activity, UserCog, Trash2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminUsers, AdminUser } from '@/hooks/useAdminUsers';
import { useNavigate } from 'react-router-dom';

const roleLabels: Record<string, string> = { admin: 'مدير', moderator: 'مشرف', user: 'مستخدم' };
const roleColors: Record<string, string> = {
  admin: 'bg-destructive/10 text-destructive border-destructive/20',
  moderator: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  user: 'bg-primary/10 text-primary border-primary/20',
};

const AdminUsers = () => {
  const navigate = useNavigate();
  const { users, loading, refresh } = useAdminUsers();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Password modal
  const [pwdTarget, setPwdTarget] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [sendPwdEmail, setSendPwdEmail] = useState(true);
  const [pwdLoading, setPwdLoading] = useState(false);

  // Role modal
  const [roleTarget, setRoleTarget] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'moderator' | 'user'>('user');
  const [roleLoading, setRoleLoading] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => users.filter((u) => {
    const s = search.toLowerCase();
    const matchSearch = !s || u.full_name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || (u.phone || '').includes(s);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  }), [users, search, roleFilter, statusFilter]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      verified: users.filter(u => u.email_verified).length,
      newToday: users.filter(u => new Date(u.created_at).toDateString() === today).length,
    };
  }, [users]);

  const handleUpdatePassword = async () => {
    if (!pwdTarget) return;
    if (newPassword.length < 6) return toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    if (newPassword !== confirmPassword) return toast.error('كلمتا المرور غير متطابقتين');
    setPwdLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-user-password', {
        body: { userId: pwdTarget.id, newPassword, sendEmail: sendPwdEmail },
      });
      if (error || data?.error) throw new Error(error?.message || data?.error);
      toast.success(`تم تحديث كلمة مرور ${pwdTarget.full_name}`);
      setPwdTarget(null); setNewPassword(''); setConfirmPassword('');
    } catch (e: any) {
      toast.error(e.message || 'فشل التحديث');
    } finally { setPwdLoading(false); }
  };

  const handleUpdateRole = async () => {
    if (!roleTarget) return;
    setRoleLoading(true);
    try {
      await supabase.from('user_roles').delete().eq('user_id', roleTarget.id);
      const { error } = await supabase.from('user_roles').insert({ user_id: roleTarget.id, role: newRole });
      if (error) throw error;
      toast.success(`تم تغيير الدور إلى "${roleLabels[newRole]}"`);
      setRoleTarget(null);
      refresh(true);
    } catch (e: any) {
      toast.error(e.message || 'فشل تغيير الدور');
    } finally { setRoleLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userId: deleteTarget.id },
      });
      // Fallback: if function missing, try direct delete via auth admin (won't work client-side)
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success('تم حذف المستخدم');
      setDeleteTarget(null);
      refresh(true);
    } catch (e: any) {
      toast.error(e.message || 'فشل الحذف');
    } finally { setDeleting(false); }
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
              <p className="text-muted-foreground text-sm">جميع حسابات النظام مع تحديث لحظي</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => refresh()} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
            <Button onClick={() => navigate('/adminfekrah/add-user')} className="bg-gradient-to-r from-primary to-primary/80">
              <UserPlus className="w-4 h-4 ml-2" />
              مستخدم جديد
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'إجمالي المستخدمين', value: stats.total, icon: Users, color: 'primary' },
            { label: 'المدراء', value: stats.admins, icon: ShieldCheck, color: 'destructive' },
            { label: 'محققو البريد', value: stats.verified, icon: CheckCircle2, color: 'success' },
            { label: 'جديد اليوم', value: stats.newToday, icon: Activity, color: 'amber-500' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="border-l-4" style={{ borderLeftColor: `hsl(var(--${s.color}))` }}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-2xl font-bold">{s.value}</p>
                  </div>
                  <s.icon className="w-8 h-8 text-muted-foreground/30" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="بحث بالاسم، البريد أو الهاتف..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[160px]"><SelectValue placeholder="الدور" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوار</SelectItem>
                <SelectItem value="admin">مدير</SelectItem>
                <SelectItem value="moderator">مشرف</SelectItem>
                <SelectItem value="user">مستخدم</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px]"><SelectValue placeholder="الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="blocked">محظور</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader><CardTitle className="text-base">قائمة المستخدمين ({filtered.length})</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">لا يوجد مستخدمون</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المستخدم</TableHead>
                      <TableHead className="text-right">الاتصال</TableHead>
                      <TableHead className="text-right">الدور</TableHead>
                      <TableHead className="text-right">آخر دخول</TableHead>
                      <TableHead className="text-right">إنضمام</TableHead>
                      <TableHead className="text-right">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filtered.map((u) => (
                        <motion.tr key={u.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="border-b hover:bg-muted/40 transition-colors">
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold">
                                {(u.full_name || u.email || '?').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold">{u.full_name || 'بدون اسم'}</p>
                                <p className="text-xs text-muted-foreground">ID: {u.id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-muted-foreground" /><span className="truncate max-w-[200px]">{u.email}</span>{u.email_verified && <CheckCircle2 className="w-3 h-3 text-success" />}</div>
                              {u.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-muted-foreground" /><span>{u.phone}</span></div>}
                            </div>
                          </TableCell>
                          <TableCell><Badge className={roleColors[u.role]}>{roleLabels[u.role]}</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString('ar-SA') : 'لم يدخل بعد'}
                          </TableCell>
                          <TableCell className="text-sm">{new Date(u.created_at).toLocaleDateString('ar-SA')}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="outline" onClick={() => { setPwdTarget(u); setNewPassword(''); setConfirmPassword(''); }} title="تغيير كلمة المرور">
                                <Key className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => { setRoleTarget(u); setNewRole(u.role); }} title="تغيير الدور">
                                <UserCog className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(u)} title="حذف">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Password Dialog */}
        <Dialog open={!!pwdTarget} onOpenChange={(o) => !o && setPwdTarget(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>تعديل كلمة المرور — {pwdTarget?.full_name}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="relative">
                <Label>كلمة المرور الجديدة</Label>
                <Input type={showPwd ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 pl-10" />
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowPwd(!showPwd)} className="absolute left-1 top-7">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <div>
                <Label>تأكيد كلمة المرور</Label>
                <Input type={showPwd ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1" />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={sendPwdEmail} onChange={(e) => setSendPwdEmail(e.target.checked)} />
                إرسال إشعار بالبريد الإلكتروني للمستخدم
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPwdTarget(null)}>إلغاء</Button>
              <Button onClick={handleUpdatePassword} disabled={pwdLoading}>{pwdLoading ? 'جاري...' : 'تحديث'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Role Dialog */}
        <Dialog open={!!roleTarget} onOpenChange={(o) => !o && setRoleTarget(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>تغيير دور — {roleTarget?.full_name}</DialogTitle></DialogHeader>
            <div className="py-4">
              <Label>الدور الجديد</Label>
              <Select value={newRole} onValueChange={(v: any) => setNewRole(v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">مستخدم</SelectItem>
                  <SelectItem value="moderator">مشرف</SelectItem>
                  <SelectItem value="admin">مدير</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRoleTarget(null)}>إلغاء</Button>
              <Button onClick={handleUpdateRole} disabled={roleLoading}>{roleLoading ? 'جاري...' : 'حفظ'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد حذف المستخدم</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم حذف <strong>{deleteTarget?.full_name}</strong> ({deleteTarget?.email}) نهائياً. هذا الإجراء لا يمكن التراجع عنه.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive hover:bg-destructive/90">
                {deleting ? 'جاري الحذف...' : 'حذف نهائي'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminUsers;
