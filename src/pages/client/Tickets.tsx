import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Plus, MessageSquare, Search, Headphones, BookOpen, ChevronLeft, ChevronRight,
  Loader2, Clock, CheckCircle2, AlertCircle, Sparkles, Zap, Shield,
  Bell, Phone, HelpCircle, TrendingUp, Inbox, Filter, MessageCircle,
} from 'lucide-react';
import {
  SupportService, type Ticket, type KbArticle,
  STATUS_LABELS, PRIORITY_LABELS,
  STATUS_COLOR, PRIORITY_COLOR,
} from '@/utils/ticketsService';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const PAGE_SIZE = 8;

export default function ClientTickets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [kb, setKb] = useState<KbArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tab, setTab] = useState('tickets');
  const [page, setPage] = useState(1);
  const [pulse, setPulse] = useState(false);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [list, articles] = await Promise.all([
        SupportService.listForUser(user.id),
        SupportService.listKb(),
      ]);
      setTickets(list);
      setKb(articles);
    } catch (e: any) {
      toast.error('فشل التحميل', { description: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  // Realtime sync + visual pulse
  useEffect(() => {
    if (!user?.id) return;
    const ch = supabase.channel(`client-tickets-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets', filter: `user_id=eq.${user.id}` }, () => {
        setPulse(true);
        setTimeout(() => setPulse(false), 1200);
        load();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_messages' }, (payload: any) => {
        if (tickets.some(t => t.id === payload.new?.ticket_id) && payload.new?.sender_type === 'admin') {
          toast.success('💬 رد جديد من فريق الدعم', {
            description: 'سيصلك إشعار واتساب فوري',
            action: { label: 'فتح', onClick: () => navigate(`/support/tickets/${payload.new.ticket_id}`) },
          });
          setPulse(true);
          setTimeout(() => setPulse(false), 1200);
          load();
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line
  }, [user?.id, tickets.length]);

  // Redirect legacy ?new=1 links
  useEffect(() => {
    if (searchParams.get('new') === '1') {
      const next = new URLSearchParams(searchParams);
      next.delete('new');
      navigate(`/support/tickets/new${next.toString() ? `?${next.toString()}` : ''}`, { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const filtered = useMemo(() => tickets.filter(t => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'open' && !['open', 'in_progress', 'waiting'].includes(t.status)) return false;
      if (statusFilter === 'resolved' && !['resolved', 'closed'].includes(t.status)) return false;
    }
    if (!search) return true;
    const q = search.toLowerCase();
    return t.subject.toLowerCase().includes(q) || t.ticket_number.toLowerCase().includes(q);
  }), [tickets, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => ({
    open: tickets.filter(t => t.status === 'open' || t.status === 'in_progress' || t.status === 'waiting').length,
    progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
    unread: tickets.reduce((sum, t) => sum + (t.unread_for_client || 0), 0),
  }), [tickets]);

  // Avg response indicator (mock from real data)
  const avgResponseHours = useMemo(() => {
    const responded = tickets.filter(t => t.first_response_at);
    if (!responded.length) return null;
    const totalMs = responded.reduce((s, t) => {
      const diff = new Date(t.first_response_at!).getTime() - new Date(t.created_at).getTime();
      return s + Math.max(0, diff);
    }, 0);
    return Math.round(totalMs / responded.length / 3_600_000 * 10) / 10;
  }, [tickets]);

  if (loading) {
    return <ClientLayout><div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></ClientLayout>;
  }

  return (
    <ClientLayout>
      <TooltipProvider delayDuration={150}>
      <div className="p-3 sm:p-4 lg:p-6 space-y-5" dir="rtl">

        {/* === LUXURY HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 text-white shadow-xl"
        >
          {/* Decorative blobs */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-emerald-400/20 rounded-full blur-3xl" />

          <div className="relative p-5 sm:p-7">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/20 flex items-center justify-center shadow-lg shrink-0"
                >
                  <Headphones className="w-7 h-7 text-white" />
                </motion.div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">خدمة العملاء</h1>
                    <motion.div
                      animate={pulse ? { scale: [1, 1.2, 1] } : {}}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 backdrop-blur ring-1 ring-emerald-300/40 rounded-full text-[11px] font-bold"
                    >
                      <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                      مباشر
                    </motion.div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed max-w-xl">
                    تواصل لحظي مع فريق الدعم — كل تحديث يصلك فور حدوثه على المنصة وعلى واتساب.
                  </p>

                  {/* Live status pills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur rounded-full text-[11px] font-semibold">
                      <Zap className="w-3 h-3 text-yellow-300" /> ردود فورية
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur rounded-full text-[11px] font-semibold">
                      <MessageCircle className="w-3 h-3 text-emerald-300" /> إشعارات واتساب
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur rounded-full text-[11px] font-semibold">
                      <Shield className="w-3 h-3 text-sky-300" /> محادثات مشفّرة
                    </span>
                    {avgResponseHours !== null && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 backdrop-blur ring-1 ring-emerald-300/30 rounded-full text-[11px] font-semibold">
                        <Clock className="w-3 h-3" /> متوسط الرد: {avgResponseHours} س
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur gap-1.5">
                      <HelpCircle className="w-4 h-4" /> دليل
                    </Button>
                  </DialogTrigger>
                  <DialogContent dir="rtl" className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" />كيف يعمل الدعم؟</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 text-sm">
                      {[
                        { icon: Plus, t: 'افتح تذكرة', d: 'صف مشكلتك أو استفسارك بدقة وأرفق ملفات إن لزم.' },
                        { icon: Bell, t: 'استلم إشعارات لحظية', d: 'يصلك إشعار على المنصة وعلى واتساب فور رد الفريق.' },
                        { icon: MessageSquare, t: 'تواصل مباشر', d: 'محادثة مكتوبة مع الفريق داخل التذكرة بأي وقت.' },
                        { icon: CheckCircle2, t: 'حلّ موثّق', d: 'سجل كامل للمحادثة وتقييم رضاك بعد الحل.' },
                      ].map((s, i) => (
                        <div key={i} className="flex gap-3 items-start p-3 bg-muted/40 rounded-lg">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <s.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-sm">{s.t}</div>
                            <p className="text-xs text-muted-foreground mt-0.5">{s.d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  className="bg-white text-indigo-700 hover:bg-white/90 font-bold shadow-lg gap-1.5"
                  onClick={() => navigate('/support/tickets/new')}
                >
                  <Plus className="w-4 h-4" /> تذكرة جديدة
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* === KPI CARDS === */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'مفتوحة', value: stats.open, icon: Inbox, gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50', text: 'text-blue-700', tip: 'تذاكر تنتظر رد فريق الدعم أو ردك.' },
            { label: 'قيد المعالجة', value: stats.progress, icon: Clock, gradient: 'from-amber-500 to-orange-500', bg: 'from-amber-50 to-orange-50', text: 'text-amber-700', tip: 'تذاكر يعمل عليها فريق الدعم الآن.' },
            { label: 'محلولة', value: stats.resolved, icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-500', bg: 'from-emerald-50 to-teal-50', text: 'text-emerald-700', tip: 'تذاكر تم حلها وأُغلقت بنجاح.' },
            { label: 'غير مقروءة', value: stats.unread, icon: Bell, gradient: 'from-rose-500 to-pink-500', bg: 'from-rose-50 to-pink-50', text: 'text-rose-700', tip: 'رسائل جديدة من الدعم لم تُقرأ بعد.' },
          ].map((s, i) => (
            <Tooltip key={s.label}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3 }}
                >
                  <Card className={`relative overflow-hidden border-0 shadow-md bg-gradient-to-br ${s.bg} cursor-help`}>
                    <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${s.gradient}`} />
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md`}>
                          <s.icon className="w-5 h-5 text-white" />
                        </div>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50" />
                      </div>
                      <div className={`text-3xl font-black ${s.text}`}>{s.value}</div>
                      <div className="text-xs text-muted-foreground font-semibold mt-0.5">{s.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[220px] text-right">{s.tip}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* === WhatsApp realtime banner === */}
        {stats.unread > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-gradient-to-l from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-3 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                لديك {stats.unread} رد{stats.unread > 1 ? 'وداً' : ''} جديد{stats.unread > 1 ? 'ة' : ''} من فريق الدعم
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">سيصلك أيضاً إشعار واتساب فوري عند كل رد جديد</p>
            </div>
          </motion.div>
        )}

        {/* === TABS === */}
        <Tabs value={tab} onValueChange={setTab} dir="rtl">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="tickets" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <MessageSquare className="w-4 h-4" /> تذاكري
              {tickets.length > 0 && <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">{tickets.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="kb" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <BookOpen className="w-4 h-4" /> الأسئلة الشائعة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-3 mt-4">
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="ابحث بالموضوع أو رقم التذكرة..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 h-10" />
              </div>
              <div className="flex gap-1 bg-muted/40 p-1 rounded-lg">
                {[
                  { key: 'all', label: 'الكل' },
                  { key: 'open', label: 'مفتوحة' },
                  { key: 'resolved', label: 'محلولة' },
                ].map(f => (
                  <Button
                    key={f.key}
                    variant={statusFilter === f.key ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setStatusFilter(f.key)}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {pageItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-2 border-dashed rounded-2xl text-center py-14 px-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{search || statusFilter !== 'all' ? 'لا نتائج' : 'لا توجد تذاكر بعد'}</h3>
                  <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
                    {search || statusFilter !== 'all' ? 'جرّب تعديل البحث أو الفلتر.' : 'افتح تذكرتك الأولى وفريق الدعم سيتواصل معك خلال دقائق.'}
                  </p>
                  <Button onClick={() => navigate('/support/tickets/new')}>
                    <Plus className="w-4 h-4 ml-1.5" /> تذكرة جديدة
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {pageItems.map((t, i) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Card
                        className="border-0 shadow-sm hover:shadow-lg cursor-pointer transition-all group overflow-hidden relative"
                        onClick={() => navigate(`/support/tickets/${t.id}`)}
                      >
                        {/* Left status bar */}
                        <div className={`absolute top-0 right-0 bottom-0 w-1 ${
                          t.status === 'resolved' || t.status === 'closed' ? 'bg-emerald-500'
                          : t.status === 'in_progress' ? 'bg-amber-500'
                          : t.status === 'waiting' ? 'bg-purple-500'
                          : 'bg-blue-500'
                        }`} />

                        <CardContent className="p-4 flex items-start gap-3 pr-5">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <span className="text-[11px] font-mono font-bold text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">{t.ticket_number}</span>
                              <Badge variant="outline" className={`text-[10px] ${STATUS_COLOR[t.status]}`}>{STATUS_LABELS[t.status]}</Badge>
                              <Badge variant="outline" className={`text-[10px] ${PRIORITY_COLOR[t.priority]}`}>{PRIORITY_LABELS[t.priority]}</Badge>
                              {(t.unread_for_client || 0) > 0 && (
                                <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                  <Badge className="bg-rose-500 text-white text-[10px] gap-1">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                    {t.unread_for_client} جديد
                                  </Badge>
                                </motion.div>
                              )}
                            </div>
                            <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{t.subject}</h3>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1.5">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />
                                {t.last_message_at ? formatDistanceToNow(new Date(t.last_message_at), { addSuffix: true, locale: ar }) : '—'}
                              </span>
                              {t.first_response_at && (
                                <span className="flex items-center gap-1 text-emerald-600">
                                  <CheckCircle2 className="w-3 h-3" /> تم الرد
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all shrink-0 mt-1" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-2 pt-2">
                <p className="text-xs text-muted-foreground">
                  عرض {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} من {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <span className="text-xs font-bold px-2">{page} / {totalPages}</span>
                  <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="kb" className="space-y-2 mt-4">
            {kb.length === 0 ? (
              <Card className="border-2 border-dashed shadow-none">
                <CardContent className="text-center py-12 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto opacity-30 mb-3" />
                  لا توجد مقالات حالياً
                </CardContent>
              </Card>
            ) : kb.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      {a.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{a.content}</CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      </TooltipProvider>
    </ClientLayout>
  );
}
