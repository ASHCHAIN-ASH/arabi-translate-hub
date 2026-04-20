import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import NavigationSidebar from '@/components/admin/NavigationSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Inbox as InboxIcon, Mail, Phone, Search, Send, RefreshCcw, CheckCircle2, Loader2, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import SEO from '@/components/SEO';

interface InboxMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  subject: string | null;
  message: string;
  form_type: string;
  service_type: string | null;
  source_page: string | null;
  status: 'new' | 'open' | 'replied' | 'closed' | string;
  priority: string;
  reply_count: number;
  last_activity_at: string;
  created_at: string;
  metadata: Record<string, any>;
}

interface InboxReply {
  id: string;
  message_id: string;
  admin_name: string | null;
  admin_email: string | null;
  body: string;
  delivery_status: string;
  delivery_error: string | null;
  created_at: string;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  new:     { label: 'جديد',  color: 'bg-blue-500/15 text-blue-700 border-blue-200' },
  open:    { label: 'مفتوح', color: 'bg-amber-500/15 text-amber-700 border-amber-200' },
  replied: { label: 'تم الرد', color: 'bg-emerald-500/15 text-emerald-700 border-emerald-200' },
  closed:  { label: 'مغلق', color: 'bg-muted text-muted-foreground border-border' },
};

const FORM_LABEL: Record<string, string> = {
  contact: 'تواصل',
  service_inquiry: 'استفسار خدمة',
  admission: 'قبول جامعي',
  careers: 'توظيف',
  license: 'ترخيص',
  document_translation: 'ترجمة وثائق',
  student_service_order: 'طلب خدمة طلابية',
  academic_expertise: 'استشارة أكاديمية',
  peer_review: 'مراجعة أقران',
};

const AdminInbox: React.FC = () => {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replies, setReplies] = useState<InboxReply[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [sending, setSending] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterForm, setFilterForm] = useState<string>('all');
  const [search, setSearch] = useState('');

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inbox_messages')
      .select('*')
      .order('last_activity_at', { ascending: false })
      .limit(300);
    if (error) toast.error('تعذر جلب الرسائل');
    else setMessages((data ?? []) as InboxMessage[]);
    setLoading(false);
  }, []);

  const fetchReplies = useCallback(async (id: string) => {
    setLoadingReplies(true);
    const { data, error } = await supabase
      .from('inbox_replies')
      .select('*')
      .eq('message_id', id)
      .order('created_at', { ascending: true });
    if (error) toast.error('تعذر جلب الردود');
    else setReplies((data ?? []) as InboxReply[]);
    setLoadingReplies(false);
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Realtime: new messages + new replies
  useEffect(() => {
    const channel = supabase
      .channel('inbox-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inbox_messages' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const row = payload.new as InboxMessage;
          setMessages((prev) => [row, ...prev.filter((m) => m.id !== row.id)]);
          toast.message('📩 رسالة جديدة', { description: `${row.sender_name} — ${row.subject ?? ''}` });
        } else if (payload.eventType === 'UPDATE') {
          const row = payload.new as InboxMessage;
          setMessages((prev) => prev.map((m) => (m.id === row.id ? row : m)));
        } else if (payload.eventType === 'DELETE') {
          const old = payload.old as InboxMessage;
          setMessages((prev) => prev.filter((m) => m.id !== old.id));
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'inbox_replies' }, (payload) => {
        const row = payload.new as InboxReply;
        if (row.message_id === selectedId) {
          setReplies((prev) => [...prev.filter((r) => r.id !== row.id), row]);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedId]);

  useEffect(() => {
    if (selectedId) {
      fetchReplies(selectedId);
      // Mark as open if currently new
      const m = messages.find((x) => x.id === selectedId);
      if (m?.status === 'new') {
        supabase.from('inbox_messages').update({ status: 'open' }).eq('id', selectedId).then(() => {});
      }
    } else {
      setReplies([]);
    }
  }, [selectedId, fetchReplies]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((m) => {
      if (filterStatus !== 'all' && m.status !== filterStatus) return false;
      if (filterForm !== 'all' && m.form_type !== filterForm) return false;
      if (!q) return true;
      return (
        m.sender_name.toLowerCase().includes(q) ||
        m.sender_email.toLowerCase().includes(q) ||
        (m.subject ?? '').toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, filterStatus, filterForm, search]);

  const selected = useMemo(
    () => messages.find((m) => m.id === selectedId) ?? null,
    [messages, selectedId],
  );

  const counts = useMemo(() => ({
    total: messages.length,
    new:   messages.filter((m) => m.status === 'new').length,
    open:  messages.filter((m) => m.status === 'open').length,
    replied: messages.filter((m) => m.status === 'replied').length,
  }), [messages]);

  const handleSendReply = async () => {
    if (!selected || !replyBody.trim()) return;
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('inbox-reply', {
        body: { messageId: selected.id, body: replyBody.trim() },
      });
      if (error) throw error;
      const status = (data as any)?.delivery_status;
      if (status === 'sent') toast.success('تم إرسال الرد للعميل');
      else toast.warning('تم حفظ الرد لكن فشل الإرسال البريدي');
      setReplyBody('');
    } catch (err: any) {
      toast.error('تعذر إرسال الرد', { description: err?.message });
    } finally {
      setSending(false);
    }
  };

  const setStatus = async (status: string) => {
    if (!selected) return;
    const { error } = await supabase.from('inbox_messages').update({ status }).eq('id', selected.id);
    if (error) toast.error('تعذر تحديث الحالة');
  };

  const formTypes = useMemo(() => {
    const set = new Set(messages.map((m) => m.form_type));
    return Array.from(set);
  }, [messages]);

  return (
    <SidebarProvider>
      <SEO title="صندوق الوارد | لوحة الإدارة" description="استقبال جميع رسائل الفورمات والرد عليها مباشرة" />
      <div className="min-h-screen flex w-full bg-background" dir="rtl">
        <NavigationSidebar />
        <SidebarInset>
          <header className="h-14 flex items-center gap-3 border-b px-4">
            <SidebarTrigger />
            <InboxIcon className="w-5 h-5 text-primary" />
            <h1 className="font-semibold">صندوق الوارد</h1>
            <div className="ms-auto flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">الإجمالي {counts.total}</Badge>
              <Badge className="bg-blue-500/15 text-blue-700 border-blue-200">جديد {counts.new}</Badge>
              <Badge className="bg-amber-500/15 text-amber-700 border-amber-200">مفتوح {counts.open}</Badge>
              <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-200">تم الرد {counts.replied}</Badge>
              <Button variant="ghost" size="sm" onClick={fetchMessages}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-0 h-[calc(100vh-3.5rem)]">
            {/* List */}
            <aside className="border-l overflow-hidden flex flex-col">
              <div className="p-3 border-b space-y-2 bg-muted/30">
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="ابحث بالاسم/البريد/الموضوع"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pe-9"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger><SelectValue placeholder="الحالة" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل الحالات</SelectItem>
                      <SelectItem value="new">جديد</SelectItem>
                      <SelectItem value="open">مفتوح</SelectItem>
                      <SelectItem value="replied">تم الرد</SelectItem>
                      <SelectItem value="closed">مغلق</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterForm} onValueChange={setFilterForm}>
                    <SelectTrigger><SelectValue placeholder="نوع الفورم" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل الفورمات</SelectItem>
                      {formTypes.map((t) => (
                        <SelectItem key={t} value={t}>{FORM_LABEL[t] ?? t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ScrollArea className="flex-1">
                {loading ? (
                  <div className="p-6 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> جاري التحميل...
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="p-10 text-center text-muted-foreground text-sm">لا توجد رسائل</div>
                ) : (
                  <ul className="divide-y">
                    {filtered.map((m) => {
                      const meta = STATUS_LABEL[m.status] ?? STATUS_LABEL.open;
                      const isActive = m.id === selectedId;
                      return (
                        <li key={m.id}>
                          <button
                            onClick={() => setSelectedId(m.id)}
                            className={`w-full text-right p-3 hover:bg-muted/50 transition ${isActive ? 'bg-primary/5 border-r-2 border-primary' : ''}`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {m.status === 'new' && <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />}
                              <span className="font-medium text-sm truncate flex-1">{m.sender_name}</span>
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                {formatDistanceToNow(new Date(m.last_activity_at), { addSuffix: true, locale: ar })}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground truncate mb-1">{m.subject ?? '(بدون موضوع)'}</div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-[10px] py-0">{FORM_LABEL[m.form_type] ?? m.form_type}</Badge>
                              <Badge className={`text-[10px] py-0 ${meta.color}`} variant="outline">{meta.label}</Badge>
                              {m.reply_count > 0 && (
                                <span className="text-[10px] text-muted-foreground">{m.reply_count} رد</span>
                              )}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </ScrollArea>
            </aside>

            {/* Conversation */}
            <main className="flex flex-col overflow-hidden bg-muted/20">
              {!selected ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <InboxIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    اختر رسالة لعرضها والرد عليها
                  </div>
                </div>
              ) : (
                <>
                  <div className="border-b bg-background p-4">
                    <div className="flex flex-wrap items-start gap-3 justify-between">
                      <div>
                        <div className="text-lg font-semibold">{selected.subject ?? '(بدون موضوع)'}</div>
                        <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-4">
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selected.sender_email}</span>
                          {selected.sender_phone && (
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {selected.sender_phone}</span>
                          )}
                          <span>الفورم: {FORM_LABEL[selected.form_type] ?? selected.form_type}</span>
                          {selected.service_type && <span>الخدمة: {selected.service_type}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={selected.status} onValueChange={setStatus}>
                          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">جديد</SelectItem>
                            <SelectItem value="open">مفتوح</SelectItem>
                            <SelectItem value="replied">تم الرد</SelectItem>
                            <SelectItem value="closed">مغلق</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="max-w-3xl mx-auto space-y-4">
                      {/* Original */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center justify-between">
                            <span>{selected.sender_name}</span>
                            <span className="text-xs text-muted-foreground font-normal">
                              {new Date(selected.created_at).toLocaleString('ar-SA')}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{selected.message}</p>
                        </CardContent>
                      </Card>

                      {loadingReplies ? (
                        <div className="text-center text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin inline" /></div>
                      ) : (
                        replies.map((r) => (
                          <Card key={r.id} className="border-primary/20 bg-primary/5">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  {r.admin_name ?? r.admin_email ?? 'الإدارة'}
                                </span>
                                <span className="text-xs text-muted-foreground font-normal">
                                  {new Date(r.created_at).toLocaleString('ar-SA')}
                                  {r.delivery_status !== 'sent' && (
                                    <Badge variant="destructive" className="ms-2 text-[10px]">{r.delivery_status}</Badge>
                                  )}
                                </span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="whitespace-pre-wrap text-sm leading-relaxed">{r.body}</p>
                              {r.delivery_error && (
                                <p className="text-xs text-destructive mt-2">{r.delivery_error}</p>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  <Separator />
                  <div className="p-4 bg-background">
                    <div className="max-w-3xl mx-auto space-y-2">
                      <Textarea
                        rows={4}
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        placeholder={`الرد إلى ${selected.sender_email}...`}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">سيُرسل الرد إلى بريد العميل ويُحفظ في سجل المحادثة</span>
                        <Button onClick={handleSendReply} disabled={sending || !replyBody.trim()}>
                          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ms-2" />}
                          إرسال الرد
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminInbox;
