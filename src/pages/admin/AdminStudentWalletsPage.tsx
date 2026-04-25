import React, { useEffect, useMemo, useState } from 'react';
import { Wallet, Search, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import AdminLayout from '@/components/admin/AdminLayout';

interface WalletRow {
  id: string;
  user_id: string;
  points_balance: number;
  pending_points: number;
  redeemed_points: number;
  lifetime_earned_points: number;
  status: string;
  updated_at: string;
}

interface ProfileRow {
  user_id: string;
  full_name: string | null;
  email: string | null;
}

export default function AdminStudentWalletsPage() {
  const [wallets, setWallets] = useState<WalletRow[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileRow>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const { data: ws, error: wErr } = await (supabase as any)
        .from('student_wallets')
        .select('*')
        .order('lifetime_earned_points', { ascending: false })
        .limit(200);
      if (wErr) throw wErr;
      setWallets(ws || []);

      const ids = (ws || []).map((w: WalletRow) => w.user_id);
      if (ids.length) {
        const { data: profs } = await (supabase as any)
          .from('student_profiles')
          .select('user_id, full_name, email')
          .in('user_id', ids);
        const map: Record<string, ProfileRow> = {};
        (profs || []).forEach((p: ProfileRow) => { map[p.user_id] = p; });
        setProfiles(map);
      }
    } catch (e: any) {
      setError(e?.message || 'تعذّر تحميل المحافظ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const ch = supabase.channel('admin-wallets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_wallets' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return wallets;
    const q = search.toLowerCase();
    return wallets.filter(w => {
      const p = profiles[w.user_id];
      return (
        (p?.full_name || '').toLowerCase().includes(q) ||
        (p?.email || '').toLowerCase().includes(q) ||
        w.user_id.toLowerCase().includes(q)
      );
    });
  }, [wallets, profiles, search]);

  const totalPoints = wallets.reduce((s, w) => s + (w.points_balance || 0), 0);
  const totalLifetime = wallets.reduce((s, w) => s + (w.lifetime_earned_points || 0), 0);

  return (
    <AdminLayout title="محافظ الطلاب">
      <div dir="rtl" className="space-y-6 p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={Users} label="عدد المحافظ" value={wallets.length} color="bg-violet-500" />
          <StatCard icon={Wallet} label="إجمالي الرصيد الحالي" value={totalPoints} color="bg-emerald-500" />
          <StatCard icon={TrendingUp} label="إجمالي ما تم كسبه" value={totalLifetime} color="bg-cyan-500" />
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ابحث بالاسم أو البريد أو معرف المستخدم…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {error && (
              <div className="flex items-center gap-2 p-4 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}
            {loading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : filtered.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">لا توجد محافظ مطابقة</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-xs">
                    <tr>
                      <th className="p-3 text-right font-medium">الطالب</th>
                      <th className="p-3 text-right font-medium">الرصيد</th>
                      <th className="p-3 text-right font-medium">قيد المراجعة</th>
                      <th className="p-3 text-right font-medium">مُستبدلة</th>
                      <th className="p-3 text-right font-medium">إجمالي مكتسب</th>
                      <th className="p-3 text-right font-medium">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(w => {
                      const p = profiles[w.user_id];
                      return (
                        <tr key={w.id} className="border-t hover:bg-muted/30">
                          <td className="p-3">
                            <div className="font-medium">{p?.full_name || '—'}</div>
                            <div className="text-xs text-muted-foreground">{p?.email || w.user_id.slice(0, 8)}</div>
                          </td>
                          <td className="p-3 font-bold tabular-nums">{w.points_balance.toLocaleString('ar-SA')}</td>
                          <td className="p-3 tabular-nums text-amber-600">{w.pending_points.toLocaleString('ar-SA')}</td>
                          <td className="p-3 tabular-nums text-slate-500">{w.redeemed_points.toLocaleString('ar-SA')}</td>
                          <td className="p-3 tabular-nums text-emerald-600">{w.lifetime_earned_points.toLocaleString('ar-SA')}</td>
                          <td className="p-3">
                            <Badge variant={w.status === 'active' ? 'default' : 'destructive'}>
                              {w.status === 'active' ? 'نشطة' : w.status}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{value.toLocaleString('ar-SA')}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
