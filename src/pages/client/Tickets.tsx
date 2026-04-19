import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Plus, MessageSquare, Search, Headphones, BookOpen,
  ChevronLeft, Loader2,
} from 'lucide-react';
import {
  SupportService, type Ticket, type KbArticle,
  STATUS_LABELS, PRIORITY_LABELS,
  STATUS_COLOR, PRIORITY_COLOR,
} from '@/utils/ticketsService';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function ClientTickets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [kb, setKb] = useState<KbArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('tickets');

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

  // Realtime
  useEffect(() => {
    if (!user?.id) return;
    const ch = supabase.channel(`client-tickets-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets', filter: `user_id=eq.${user.id}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line
  }, [user?.id]);

  // Redirect legacy ?new=1 links to dedicated new ticket page (preserve prefill params)
  useEffect(() => {
    if (searchParams.get('new') === '1') {
      const next = new URLSearchParams(searchParams);
      next.delete('new');
      navigate(`/support/tickets/new${next.toString() ? `?${next.toString()}` : ''}`, { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  const filtered = useMemo(() => tickets.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.subject.toLowerCase().includes(q) || t.ticket_number.toLowerCase().includes(q);
  }), [tickets, search]);

  const stats = useMemo(() => ({
    open: tickets.filter(t => t.status === 'open' || t.status === 'in_progress' || t.status === 'waiting').length,
    progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
    unread: tickets.reduce((sum, t) => sum + (t.unread_for_client || 0), 0),
  }), [tickets]);

  if (loading) {
    return <ClientLayout><div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></ClientLayout>;
  }

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2">
              <Headphones className="w-6 h-6 text-primary" />
              خدمة العملاء
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">تواصل مع فريق الدعم — ردود سريعة، حضور لحظي، وتتبع كامل</p>
          </div>
          <Button size="sm" className="shrink-0 gap-1.5" onClick={() => navigate('/support/tickets/new')}>
            <Plus className="w-4 h-4" />
            تذكرة جديدة
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'مفتوحة', value: stats.open, color: 'bg-blue-500/10 text-blue-600' },
            { label: 'قيد المعالجة', value: stats.progress, color: 'bg-amber-500/10 text-amber-600' },
            { label: 'محلولة', value: stats.resolved, color: 'bg-emerald-500/10 text-emerald-600' },
            { label: 'غير مقروءة', value: stats.unread, color: 'bg-rose-500/10 text-rose-600' },
          ].map(s => (
            <Card key={s.label} className="border-0 shadow-sm">
              <CardContent className={`p-4 ${s.color}`}>
                <div className="text-3xl font-bold">{s.value}</div>
                <div className="text-xs opacity-80 mt-1">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={tab} onValueChange={setTab} dir="rtl">
          <TabsList>
            <TabsTrigger value="tickets" className="gap-2"><MessageSquare className="w-4 h-4" /> تذاكري</TabsTrigger>
            <TabsTrigger value="kb" className="gap-2"><BookOpen className="w-4 h-4" /> الأسئلة الشائعة</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="ابحث عن تذكرة..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
            </div>

            {filtered.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="text-center py-12">
                  <MessageSquare className="w-12 h-12 mx-auto opacity-30 mb-3" />
                  <p className="text-muted-foreground mb-4">لا توجد تذاكر بعد</p>
                  <Button onClick={() => setIsOpen(true)}><Plus className="w-4 h-4 ml-2" />تذكرة جديدة</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {filtered.map(t => (
                  <Card key={t.id} className="border-0 shadow-sm hover:shadow-md cursor-pointer transition-all"
                    onClick={() => navigate(`/support/tickets/${t.id}`)}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-mono text-muted-foreground">{t.ticket_number}</span>
                          <Badge variant="outline" className={`text-[10px] ${STATUS_COLOR[t.status]}`}>{STATUS_LABELS[t.status]}</Badge>
                          <Badge variant="outline" className={`text-[10px] ${PRIORITY_COLOR[t.priority]}`}>{PRIORITY_LABELS[t.priority]}</Badge>
                          {(t.unread_for_client || 0) > 0 && (
                            <Badge className="bg-rose-500 text-white text-[10px]">{t.unread_for_client} جديد</Badge>
                          )}
                        </div>
                        <h3 className="font-semibold truncate">{t.subject}</h3>
                        <div className="text-xs text-muted-foreground mt-1">
                          {t.last_message_at ? formatDistanceToNow(new Date(t.last_message_at), { addSuffix: true, locale: ar }) : '—'}
                        </div>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="kb" className="space-y-2">
            {kb.length === 0 ? (
              <Card className="border-0 shadow-sm"><CardContent className="text-center py-12 text-muted-foreground"><BookOpen className="w-12 h-12 mx-auto opacity-30 mb-3" />لا توجد مقالات</CardContent></Card>
            ) : kb.map(a => (
              <Card key={a.id} className="border-0 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm">{a.title}</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">{a.content}</CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
}
