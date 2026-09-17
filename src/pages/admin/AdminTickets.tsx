import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search, RefreshCw, Ticket as TicketIcon, AlertCircle,
  CheckCircle2, Clock, ArrowLeft, DollarSign, ShoppingBag, ShieldAlert, Wrench, Filter,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { TicketsService, type Ticket, CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS, CATEGORY_COLOR, STATUS_COLOR, PRIORITY_COLOR } from '@/utils/ticketsService';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const CATEGORY_ICONS: Record<string, any> = {
  financial: DollarSign,
  service_order: ShoppingBag,
  complaint: ShieldAlert,
  technical: Wrench,
  general: TicketIcon,
};

export default function AdminTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [customers, setCustomers] = useState<Record<string, { name: string; customer_code?: string }>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const load = async () => {
    setLoading(true);
    try {
      const list = await TicketsService.listAll();
      setTickets(list);
      const userIds = [...new Set(list.map(t => t.user_id).filter(Boolean))];
      if (userIds.length) {
        const { data: cs } = await supabase.from('customers').select('user_id, name, customer_code').in('user_id', userIds);
        const map: Record<string, any> = {};
        (cs || []).forEach((c: any) => { if (c.user_id) map[c.user_id] = { name: c.name, customer_code: c.customer_code }; });
        setCustomers(map);
      }
    } catch (e: any) {
      toast.error('فشل تحميل التذاكر', { description: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const ch = supabase
      .channel('admin-tickets-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ticket_messages' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = useMemo(() => tickets.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const c = customers[t.user_id || ''];
      return t.subject.toLowerCase().includes(q)
        || t.ticket_number.toLowerCase().includes(q)
        || (c?.name || '').toLowerCase().includes(q)
        || (c?.customer_code || '').includes(q);
    }
    return true;
  }), [tickets, search, statusFilter, categoryFilter, priorityFilter, customers]);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
    urgent: tickets.filter(t => t.priority === 'urgent' && !['resolved', 'closed'].includes(t.status)).length,
  }), [tickets]);

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-6" dir="rtl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <TicketIcon className="w-8 h-8 text-primary" />
                إدارة تذاكر الدعم
              </h1>
              <p className="text-sm text-muted-foreground mt-1">إدارة كاملة للتذاكر مع ربط لحظي بالطلبات والفواتير</p>
            </div>
            <Button variant="outline" onClick={load} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'الإجمالي', value: stats.total, icon: TicketIcon, color: 'from-primary/20 to-primary/5 text-primary' },
            { label: 'مفتوحة', value: stats.open, icon: AlertCircle, color: 'from-blue-500/20 to-blue-500/5 text-blue-600' },
            { label: 'قيد المعالجة', value: stats.in_progress, icon: Clock, color: 'from-amber-500/20 to-amber-500/5 text-amber-600' },
            { label: 'تم الحل', value: stats.resolved, icon: CheckCircle2, color: 'from-emerald-500/20 to-emerald-500/5 text-emerald-600' },
            { label: 'عاجلة', value: stats.urgent, icon: ShieldAlert, color: 'from-red-500/20 to-red-500/5 text-red-600' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`bg-gradient-to-br ${s.color} border-0`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs opacity-80">{s.label}</div>
                    <div className="text-2xl font-bold">{s.value}</div>
                  </div>
                  <s.icon className="w-7 h-7 opacity-70" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs value={categoryFilter} onValueChange={setCategoryFilter} dir="rtl">
          <TabsList className="w-full justify-start gap-1 h-auto flex-wrap p-1">
            <TabsTrigger value="all" className="gap-2"><Filter className="w-3.5 h-3.5" /> الكل</TabsTrigger>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => {
              const Icon = CATEGORY_ICONS[k] || TicketIcon;
              return (
                <TabsTrigger key={k} value={k} className="gap-2">
                  <Icon className="w-3.5 h-3.5" /> {v}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="ابحث برقم التذكرة، الموضوع، اسم العميل، رقم الهوية..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-44"><SelectValue placeholder="الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="md:w-40"><SelectValue placeholder="الأولوية" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأولويات</SelectItem>
                {Object.entries(PRIORITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground"><RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2" />جاري التحميل...</div>
          ) : filtered.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <TicketIcon className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground">لا توجد تذاكر مطابقة</p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              {filtered.map((t, i) => {
                const customer = customers[t.user_id || ''];
                const Icon = CATEGORY_ICONS[t.category] || TicketIcon;
                return (
                  <motion.div key={t.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
                    <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5 group" onClick={() => navigate(`/adminfekrah/tickets/${t.id}`)}>
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${CATEGORY_COLOR[t.category] || CATEGORY_COLOR.general}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-mono text-muted-foreground">{t.ticket_number}</span>
                                <Badge variant="outline" className={`text-[10px] ${CATEGORY_COLOR[t.category]}`}>{CATEGORY_LABELS[t.category] || t.category}</Badge>
                                <Badge variant="outline" className={`text-[10px] ${STATUS_COLOR[t.status]}`}>{STATUS_LABELS[t.status] || t.status}</Badge>
                                <Badge variant="outline" className={`text-[10px] ${PRIORITY_COLOR[t.priority]}`}>{PRIORITY_LABELS[t.priority] || t.priority}</Badge>
                              </div>
                              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{t.subject}</h3>
                              {customer && (
                                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                                  <span>{customer.name}</span>
                                  {customer.customer_code && <span className="font-mono px-1.5 py-0.5 rounded bg-muted">#{customer.customer_code}</span>}
                                  {t.related_invoice_id && <span className="flex items-center gap-1 text-emerald-600"><DollarSign className="w-3 h-3" /> فاتورة مرتبطة</span>}
                                  {t.related_order_id && <span className="flex items-center gap-1 text-blue-600"><ShoppingBag className="w-3 h-3" /> طلب مرتبط</span>}
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground flex flex-col items-end gap-1 shrink-0">
                              <span>{formatDistanceToNow(new Date(t.created_at), { addSuffix: true, locale: ar })}</span>
                              <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
