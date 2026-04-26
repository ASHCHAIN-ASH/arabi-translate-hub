import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ScrollText,
  Search,
  Filter,
  ArrowUpRight,
  Loader2,
  Calendar,
  User,
  ShieldCheck,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { FINANCING_STATUS_LABELS_AR } from '@/lib/financing';

interface AuditRow {
  id: string;
  application_id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string | null;
  note: string | null;
  created_at: string;
  applicant_name?: string | null;
  changer_name?: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  under_review: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
  approved: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
  rejected: 'bg-destructive/10 text-destructive border-destructive/30',
  active: 'bg-primary/10 text-primary border-primary/30',
  completed: 'bg-muted text-foreground border-border',
  cancelled: 'bg-muted text-muted-foreground border-border',
};

const FinancingAuditTrail = () => {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // اجلب آخر 200 تغيير
      const { data: logs } = await supabase
        .from('financing_status_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (!logs?.length) {
        setRows([]);
        setLoading(false);
        return;
      }

      const appIds = [...new Set(logs.map((l) => l.application_id))];
      const userIds = [
        ...new Set(logs.map((l) => l.changed_by).filter(Boolean) as string[]),
      ];

      const [{ data: apps }, { data: profiles }] = await Promise.all([
        supabase
          .from('financing_applications')
          .select('id, applicant_full_name')
          .in('id', appIds),
        userIds.length
          ? supabase.from('profiles').select('id, full_name').in('id', userIds)
          : Promise.resolve({ data: [] }),
      ]);

      const appMap = new Map<string, string>(
        (apps || []).map((a: any) => [a.id as string, a.applicant_full_name as string])
      );
      const userMap = new Map<string, string>(
        (profiles || []).map((p: any) => [p.id as string, p.full_name as string])
      );

      setRows(
        logs.map((l: any) => ({
          ...l,
          applicant_name: appMap.get(l.application_id) || null,
          changer_name: l.changed_by ? userMap.get(l.changed_by) || null : null,
        }))
      );
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== 'all' && r.new_status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.applicant_name?.toLowerCase().includes(q) ||
          r.application_id.toLowerCase().includes(q) ||
          r.note?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [rows, search, statusFilter]);

  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => set.add(r.new_status));
    return Array.from(set);
  }, [rows]);

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <ScrollText className="w-7 h-7 text-primary" />
              سجل تدقيق التمويل
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              سجل كامل بكل تغييرات حالة طلبات التمويل
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            {filtered.length} عملية
          </Badge>
        </motion.div>

        <Card className="p-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث باسم العميل، رقم الطلب، أو الملاحظة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="فلترة بالحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {FINANCING_STATUS_LABELS_AR[s] || s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ShieldCheck className="w-10 h-10 mx-auto mb-2 opacity-30" />
              لا توجد سجلات
            </div>
          ) : (
            <ScrollArea className="max-h-[70vh]">
              <ul className="divide-y">
                {filtered.map((r, idx) => (
                  <motion.li
                    key={r.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        {r.old_status && (
                          <Badge
                            variant="outline"
                            className={STATUS_COLORS[r.old_status] || ''}
                          >
                            {FINANCING_STATUS_LABELS_AR[r.old_status] || r.old_status}
                          </Badge>
                        )}
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground rotate-180" />
                        <Badge
                          className={STATUS_COLORS[r.new_status] || ''}
                          variant="outline"
                        >
                          {FINANCING_STATUS_LABELS_AR[r.new_status] || r.new_status}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-xs h-7"
                      >
                        <Link to={`/adminmaster/financing/${r.application_id}`}>
                          عرض الطلب
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                        </Link>
                      </Button>
                    </div>

                    <div className="mt-2 grid sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span className="truncate">
                          {r.applicant_name || 'عميل غير معروف'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="truncate">
                          بواسطة: {r.changer_name || (r.changed_by ? 'مدير' : 'النظام')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(r.created_at).toLocaleString('en-GB')}</span>
                      </div>
                    </div>

                    {r.note && (
                      <p className="mt-2 text-sm bg-muted/40 rounded-lg p-2 text-foreground">
                        {r.note}
                      </p>
                    )}
                  </motion.li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default FinancingAuditTrail;
