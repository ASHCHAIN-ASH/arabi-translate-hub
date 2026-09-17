import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Search, Loader2, Eye, Phone, User, Calendar, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { RESEARCH_STATUSES, PRIORITIES, getStatus, getPriority } from '@/utils/researchPublicationStatuses';

type SortKey = 'created_at' | 'estimated_amount' | 'title';

export default function AdminResearchPublications() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('research_publications')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel('admin-research-pubs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'research_publications' }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = useMemo(() => {
    let arr = items.filter(i => {
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && i.priority !== priorityFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        const hay = `${i.title || ''} ${i.client_name || ''} ${i.client_phone || ''} ${i.request_number || ''} ${i.field || ''} ${i.target_journal || ''}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
    arr = [...arr].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (sortKey === 'estimated_amount') {
        return sortDir === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av);
      }
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return arr;
  }, [items, search, statusFilter, priorityFilter, sortKey, sortDir]);

  const stats = useMemo(() => {
    const total = items.length;
    const totalRevenue = items.reduce((sum, i) => sum + Number(i.final_amount || i.estimated_amount || 0), 0);
    const active = items.filter(i => ['under_review', 'quoted', 'approved', 'in_progress'].includes(i.status)).length;
    const completed = items.filter(i => i.status === 'published').length;
    return { total, totalRevenue, active, completed };
  }, [items]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('desc'); }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-5" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600 text-white rounded-3xl p-6 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">سجل طلبات النشر</h1>
              <p className="text-white/85 text-sm">إدارة طلبات نشر الأبحاث، عقودها، عروض الأسعار، والفواتير الضريبية</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">إجمالي الطلبات</div>
            <div className="text-3xl font-black text-indigo-700">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">طلبات نشطة</div>
            <div className="text-3xl font-black text-cyan-700">{stats.active}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">منشورة</div>
            <div className="text-3xl font-black text-emerald-700">{stats.completed}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">إجمالي الإيرادات</div>
            <div className="text-2xl font-black text-amber-700">{stats.totalRevenue.toLocaleString('ar-SA')} ر.س</div>
          </Card>
        </div>

        <Card className="p-3 flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالعنوان، العميل، الهاتف، رقم الطلب..." className="pr-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="الحالة" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              {RESEARCH_STATUSES.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.emoji} {s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="الأولوية" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأولويات</SelectItem>
              {PRIORITIES.map(p => <SelectItem key={p.value} value={p.value}>{p.emoji} {p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </Card>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" /></div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">لا توجد طلبات تطابق الفلاتر الحالية</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الطلب</TableHead>
                    <TableHead className="text-right cursor-pointer" onClick={() => toggleSort('title')}>
                      <div className="flex items-center gap-1">العنوان <ArrowUpDown className="w-3 h-3" /></div>
                    </TableHead>
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right">التخصص</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الأولوية</TableHead>
                    <TableHead className="text-right cursor-pointer" onClick={() => toggleSort('estimated_amount')}>
                      <div className="flex items-center gap-1">المبلغ <ArrowUpDown className="w-3 h-3" /></div>
                    </TableHead>
                    <TableHead className="text-right cursor-pointer" onClick={() => toggleSort('created_at')}>
                      <div className="flex items-center gap-1">التاريخ <ArrowUpDown className="w-3 h-3" /></div>
                    </TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(item => {
                    const st = getStatus(item.status);
                    const pr = getPriority(item.priority);
                    const amount = item.final_amount || item.estimated_amount;
                    const StIcon = st.icon;
                    return (
                      <TableRow key={item.id} className="hover:bg-muted/40 cursor-pointer" onClick={() => navigate(`/adminfekrah/research/${item.id}`)}>
                        <TableCell className="font-mono text-xs">{item.request_number}</TableCell>
                        <TableCell className="font-bold max-w-[260px] truncate">{item.title}</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium flex items-center gap-1"><User className="w-3 h-3" />{item.client_name}</div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{item.client_phone}</div>
                        </TableCell>
                        <TableCell className="text-sm">{item.field}</TableCell>
                        <TableCell>
                          <Badge className={`${st.color} text-white border-0 gap-1`}>
                            <StIcon className="w-3 h-3" />
                            {st.label}
                          </Badge>
                        </TableCell>
                        <TableCell><Badge className={`${pr.color} text-white border-0`}>{pr.emoji} {pr.label}</Badge></TableCell>
                        <TableCell className="font-bold text-emerald-700">
                          {amount ? `${Number(amount).toLocaleString('ar-SA')} ر.س` : <span className="text-muted-foreground text-xs">—</span>}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          <Calendar className="w-3 h-3 inline ml-1" />
                          {new Date(item.created_at).toLocaleDateString('ar-SA')}
                        </TableCell>
                        <TableCell onClick={e => e.stopPropagation()}>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/adminfekrah/research/${item.id}`)}>
                            <Eye className="w-4 h-4 ml-1" /> فتح
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
