import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookMarked, Search, Loader2, Eye, Trash2, Calendar, FileSignature, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/data/legacy/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { formatContractHeaderDate } from '@/utils/formatContractDate';

const CONTRACT_STATUSES: Record<string, { label: string; color: string }> = {
  draft: { label: 'مسودة', color: 'bg-slate-500' },
  pending_signature: { label: 'بانتظار التوقيع', color: 'bg-amber-500' },
  sent: { label: 'مُرسَل', color: 'bg-blue-500' },
  signed: { label: 'موقّع رسمياً', color: 'bg-emerald-600' },
  cancelled: { label: 'ملغى', color: 'bg-rose-500' },
  expired: { label: 'منتهي', color: 'bg-amber-600' },
};

export default function AdminResearchContracts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase.from('contracts') as any)
      .select('*, research_publications(title, client_name, client_phone, field, target_journal)')
      .not('publication_id', 'is', null)
      .order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel('admin-research-contracts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contracts' }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = useMemo(() => {
    return items.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        const pub = c.research_publications || {};
        const hay = `${c.title || ''} ${c.contract_number || ''} ${c.client_full_name || ''} ${c.client_phone || ''} ${pub.title || ''} ${pub.client_name || ''}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [items, search, statusFilter]);

  const deleteContract = async (id: string, num?: string) => {
    if (!confirm(`هل أنت متأكد من حذف العقد ${num || ''}؟ لا يمكن التراجع.`)) return;
    const { error } = await (supabase.from('contracts') as any).delete().eq('id', id);
    if (error) { toast({ title: 'تعذّر الحذف', description: error.message, variant: 'destructive' }); return; }
    toast({ title: '🗑️ تم حذف العقد' });
    load();
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <BookMarked className="w-7 h-7 text-indigo-600" />
                عقود خدمات النشر العلمي
              </h1>
              <p className="text-sm text-muted-foreground mt-1">إدارة جميع العقود الأكاديمية المرتبطة بطلبات النشر</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/adminfekrah/research')}>
              <ArrowRight className="w-4 h-4 ml-1" /> سجل طلبات النشر
            </Button>
          </div>
        </motion.div>

        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث برقم العقد، العنوان، اسم العميل..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                {Object.entries(CONTRACT_STATUSES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-12 text-center"><Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-600" /></div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <FileSignature className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground">لا توجد عقود نشر</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم العقد</TableHead>
                  <TableHead className="text-right">عنوان البحث</TableHead>
                  <TableHead className="text-right">العميل</TableHead>
                  <TableHead className="text-right">المجلة المستهدفة</TableHead>
                  <TableHead className="text-right">القيمة</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(c => {
                  const cs = CONTRACT_STATUSES[c.status] || { label: c.status, color: 'bg-slate-500' };
                  const pub = c.research_publications || {};
                  return (
                    <TableRow key={c.id} className="hover:bg-indigo-50/40">
                      <TableCell className="font-mono text-xs">{c.contract_number}</TableCell>
                      <TableCell className="font-semibold max-w-xs truncate">{pub.title || c.title}</TableCell>
                      <TableCell>{c.client_full_name || pub.client_name || '—'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{pub.target_journal || '—'}</TableCell>
                      <TableCell className="font-bold text-emerald-700">
                        {c.total_amount ? `${Number(c.total_amount).toLocaleString('ar-SA')} ر.س` : '—'}
                      </TableCell>
                      <TableCell><Badge className={`${cs.color} text-white border-0`}>{cs.label}</Badge></TableCell>
                      <TableCell className="text-xs">
                        <Calendar className="w-3 h-3 inline ml-1" />
                        {formatContractHeaderDate(c.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/adminfekrah/research/contracts/${c.id}`)}>
                            <Eye className="w-3 h-3 ml-1" /> فتح
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteContract(c.id, c.contract_number)} className="border-rose-300 text-rose-700 hover:bg-rose-50">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
