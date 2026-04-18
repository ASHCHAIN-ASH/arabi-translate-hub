import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Crown, Sparkles, Search, Plus, Minus, RefreshCw, Award, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface UserPointsRow {
  user_id: string;
  total_points: number;
  lifetime_earned: number;
  lifetime_spent: number;
  current_level_id: string | null;
  full_name?: string;
  email?: string;
  level_name?: string;
}

const AdminGamification: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserPointsRow[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [target, setTarget] = useState<UserPointsRow | null>(null);
  const [adjustPoints, setAdjustPoints] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('');

  const load = async () => {
    setLoading(true);
    const [pts, lv, rw, profiles] = await Promise.all([
      (supabase as any).from('user_points').select('*').order('total_points', { ascending: false }).limit(200),
      (supabase as any).from('gamification_levels').select('*').order('sort_order'),
      (supabase as any).from('gamification_rewards').select('*').order('cost_points'),
      (supabase as any).from('profiles').select('id, full_name'),
    ]);
    const lvMap = new Map((lv.data || []).map((l: any) => [l.id, l.name_ar]));
    const profMap = new Map((profiles.data || []).map((p: any) => [p.id, p.full_name]));
    const rows: UserPointsRow[] = (pts.data || []).map((p: any) => ({
      ...p,
      full_name: profMap.get(p.user_id) || '—',
      level_name: p.current_level_id ? lvMap.get(p.current_level_id) : 'مبتدئ',
    }));
    setUsers(rows);
    setLevels(lv.data || []);
    setRewards(rw.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(u =>
      (u.full_name || '').toLowerCase().includes(q) ||
      u.user_id.toLowerCase().includes(q));
  }, [users, search]);

  const totals = useMemo(() => ({
    totalUsers: users.length,
    totalPoints: users.reduce((s, u) => s + (u.total_points || 0), 0),
    avgPoints: users.length ? Math.round(users.reduce((s, u) => s + u.total_points, 0) / users.length) : 0,
  }), [users]);

  const submitAdjust = async () => {
    if (!target || !adjustPoints || !adjustReason.trim()) {
      toast({ title: 'املأ كل الحقول', variant: 'destructive' });
      return;
    }
    const { error } = await (supabase as any).rpc('award_points', {
      _user_id: target.user_id,
      _base_points: adjustPoints,
      _source_type: 'manual_admin',
      _source_id: `${Date.now()}`,
      _description: adjustReason,
      _apply_multiplier: false,
      _metadata: { adjusted_at: new Date().toISOString() },
    });
    if (error) {
      toast({ title: 'فشل التعديل', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'تم تعديل النقاط بنجاح' });
    setAdjustOpen(false);
    setAdjustPoints(0);
    setAdjustReason('');
    setTarget(null);
    load();
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6" dir="rtl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-700 to-rose-700" />
          <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center ring-2 ring-white/30">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold mb-2">
                  <Sparkles className="w-3 h-3" /> Gamification
                </div>
                <h1 className="text-2xl sm:text-3xl font-black">إدارة النقاط والمكافآت</h1>
                <p className="text-white/85 text-sm mt-1">المستويات، المكافآت، وتعديل النقاط مع سجل تدقيق</p>
              </div>
            </div>
            <Button onClick={load} className="bg-white/20 backdrop-blur border border-white/30 text-white hover:bg-white/30">
              <RefreshCw className="w-4 h-4 ml-2" /> تحديث
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'مستخدمون لهم نقاط', value: totals.totalUsers, icon: Users, color: 'from-indigo-500 to-purple-600' },
            { label: 'إجمالي النقاط بالنظام', value: totals.totalPoints, icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
            { label: 'متوسط النقاط/مستخدم', value: totals.avgPoints, icon: Award, color: 'from-amber-500 to-orange-600' },
          ].map(s => (
            <Card key={s.label} className="p-4 border-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="text-2xl font-black tabular-nums">{s.value.toLocaleString('ar-SA')}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="users">المستخدمون</TabsTrigger>
            <TabsTrigger value="levels">المستويات</TabsTrigger>
            <TabsTrigger value="rewards">المكافآت</TabsTrigger>
          </TabsList>

          {/* Users */}
          <TabsContent value="users">
            <Card className="p-5 border-0 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input placeholder="ابحث بالاسم أو المعرّف..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
              </div>
              {loading ? (
                <div className="text-center py-10 text-muted-foreground">جاري التحميل...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-right">
                        <th className="p-2">المستخدم</th>
                        <th className="p-2">المستوى</th>
                        <th className="p-2">النقاط</th>
                        <th className="p-2">إجمالي مكتسب</th>
                        <th className="p-2">إجمالي مصروف</th>
                        <th className="p-2">إجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(u => (
                        <tr key={u.user_id} className="border-b hover:bg-muted/30">
                          <td className="p-2">
                            <div className="font-medium">{u.full_name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{u.user_id.slice(0, 8)}...</div>
                          </td>
                          <td className="p-2"><Badge variant="secondary">{u.level_name}</Badge></td>
                          <td className="p-2 font-bold tabular-nums">{u.total_points.toLocaleString('ar-SA')}</td>
                          <td className="p-2 tabular-nums text-emerald-600">+{u.lifetime_earned.toLocaleString('ar-SA')}</td>
                          <td className="p-2 tabular-nums text-rose-600">-{u.lifetime_spent.toLocaleString('ar-SA')}</td>
                          <td className="p-2">
                            <Button size="sm" variant="outline" onClick={() => { setTarget(u); setAdjustOpen(true); }}>
                              تعديل
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">لا توجد بيانات</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Levels */}
          <TabsContent value="levels">
            <Card className="p-5 border-0 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold">المستويات</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {levels.map(l => (
                  <div key={l.id} className="p-4 rounded-2xl border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">{l.name_ar}</span>
                      <Badge style={{ backgroundColor: l.badge_color || '#888', color: '#fff' }}>
                        {l.badge_label || l.slug}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">يبدأ من <b>{l.required_points.toLocaleString('ar-SA')}</b> نقطة</div>
                    <div className="text-xs text-muted-foreground mt-2 font-mono">{l.slug}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">إدارة المستويات تتم حالياً عبر قاعدة البيانات. واجهة CRUD كاملة قابلة للإضافة لاحقاً.</p>
            </Card>
          </TabsContent>

          {/* Rewards */}
          <TabsContent value="rewards">
            <Card className="p-5 border-0 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-fuchsia-500" />
                <h2 className="text-lg font-bold">المكافآت</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map(r => (
                  <div key={r.id} className="p-4 rounded-2xl border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">{r.title_ar}</span>
                      <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'نشطة' : 'موقوفة'}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{r.description_ar || '—'}</div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">التكلفة:</span>
                      <span className="font-bold">{r.cost_points.toLocaleString('ar-SA')} نقطة</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">تم استبدالها:</span>
                      <span className="font-bold">{r.total_redeemed} مرة</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Adjust dialog */}
        <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle>تعديل نقاط المستخدم</DialogTitle>
            </DialogHeader>
            {target && (
              <div className="space-y-4">
                <div className="text-sm">
                  <div className="font-bold">{target.full_name}</div>
                  <div className="text-muted-foreground">الرصيد الحالي: {target.total_points.toLocaleString('ar-SA')}</div>
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block">القيمة (موجبة لإضافة، سالبة لخصم)</label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setAdjustPoints(p => p - 50)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input type="number" value={adjustPoints} onChange={(e) => setAdjustPoints(Number(e.target.value))} className="text-center" />
                    <Button variant="outline" size="icon" onClick={() => setAdjustPoints(p => p + 50)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block">السبب (إلزامي — يُسجّل في audit)</label>
                  <Textarea value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} placeholder="مثال: تعويض عن خطأ تقني" />
                </div>
                <Button onClick={submitAdjust} className="w-full">تنفيذ</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminGamification;
