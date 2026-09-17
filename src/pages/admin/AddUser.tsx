import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, UserPlus, Loader2, Mail, User, Phone, Lock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/data/legacy/client';

const AddUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user' as 'user' | 'moderator' | 'admin',
    send_welcome: true,
    auto_confirm: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = 'الاسم مطلوب';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'بريد غير صحيح';
    if (form.password.length < 6) e.password = 'كلمة المرور 6 أحرف على الأقل';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let p = '';
    for (let i = 0; i < 10; i++) p += chars[Math.floor(Math.random() * chars.length)];
    setForm({ ...form, password: p });
    toast.success('تم توليد كلمة مرور قوية');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-create-user', { body: form });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`تم إنشاء حساب ${form.full_name} بنجاح`, { duration: 4000 });
      setTimeout(() => navigate('/adminfekrah/users'), 800);
    } catch (err: any) {
      toast.error(err.message || 'فشل إنشاء المستخدم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                <UserPlus className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">إنشاء مستخدم جديد</CardTitle>
                <p className="text-sm text-muted-foreground">إنشاء حساب فعلي مع توثيق فوري ودور قابل للتحديد</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/adminfekrah/users')}>
              <ArrowRight className="w-4 h-4 ml-2" /> رجوع
            </Button>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2 mb-1.5"><User className="w-3.5 h-3.5" /> الاسم الكامل *</Label>
                  <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className={errors.full_name ? 'border-destructive' : ''} disabled={loading} />
                  {errors.full_name && <p className="text-xs text-destructive mt-1">{errors.full_name}</p>}
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-1.5"><Mail className="w-3.5 h-3.5" /> البريد الإلكتروني *</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={errors.email ? 'border-destructive' : ''} disabled={loading} dir="ltr" />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-1.5"><Phone className="w-3.5 h-3.5" /> رقم الهاتف</Label>
                  <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="05xxxxxxxx" disabled={loading} dir="ltr" />
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-1.5"><Shield className="w-3.5 h-3.5" /> الدور</Label>
                  <Select value={form.role} onValueChange={(v: any) => setForm({ ...form, role: v })} disabled={loading}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">مستخدم</SelectItem>
                      <SelectItem value="moderator">مشرف</SelectItem>
                      <SelectItem value="admin">مدير</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="flex items-center gap-2"><Lock className="w-3.5 h-3.5" /> كلمة المرور *</Label>
                    <Button type="button" size="sm" variant="ghost" onClick={generatePassword} className="text-xs h-7">
                      توليد كلمة مرور قوية
                    </Button>
                  </div>
                  <Input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={errors.password ? 'border-destructive' : ''} disabled={loading} dir="ltr" />
                  {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                </div>
              </div>

              <div className="space-y-2 p-4 bg-muted/40 rounded-lg border">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.auto_confirm} onChange={(e) => setForm({ ...form, auto_confirm: e.target.checked })} />
                  تأكيد البريد الإلكتروني تلقائياً (يستطيع تسجيل الدخول مباشرة)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" checked={form.send_welcome} onChange={(e) => setForm({ ...form, send_welcome: e.target.checked })} />
                  إرسال بريد ترحيبي يحتوي على بيانات الدخول
                </label>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80" disabled={loading} size="lg">
                {loading ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري الإنشاء...</> : <><UserPlus className="w-4 h-4 ml-2" /> إنشاء المستخدم</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </AdminLayout>
  );
};

export default AddUser;
