import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  ArrowRight, Send, Paperclip, Download, MessageSquare, History,
  DollarSign, ShoppingBag, ShieldAlert, Wrench, Ticket as TicketIcon,
  CheckCircle2, Clock, AlertCircle, FileText, Loader2, User, Sparkles,
  Star, Zap, Eye, ExternalLink, Lightbulb, Wand2, BookOpen, X,
} from 'lucide-react';
import { supabase } from '@/data/legacy/client';
import {
  SupportService, type Ticket, type TicketMessage, type TicketTimelineEntry,
  type TicketAttachment, type TicketPresence, type QuickReply,
  CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS,
  CATEGORY_COLOR, STATUS_COLOR, PRIORITY_COLOR,
} from '@/utils/ticketsService';
import { toast } from 'sonner';
import { format, formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns';
import { ar } from 'date-fns/locale';

const CATEGORY_ICONS: Record<string, any> = {
  billing: DollarSign,
  technical: Wrench,
  complaint: ShieldAlert,
  suggestion: Sparkles,
  general: TicketIcon,
};

interface Props {
  ticketId: string;
  currentUserId: string;
  isAdmin: boolean;
  backTo: string;
  displayName?: string;
}

function SLABadge({ ticket }: { ticket: Ticket }) {
  if (!ticket.sla_due_at || ticket.status === 'resolved' || ticket.status === 'closed') return null;
  const due = new Date(ticket.sla_due_at).getTime();
  const now = Date.now();
  const overdue = now > due;
  const within = !overdue && (due - now) < 60 * 60 * 1000;
  const cls = overdue
    ? 'bg-rose-500/15 text-rose-600 border-rose-500/30'
    : within
    ? 'bg-amber-500/15 text-amber-600 border-amber-500/30'
    : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
  return (
    <Badge variant="outline" className={`gap-1 ${cls}`}>
      <Clock className="w-3 h-3" />
      {overdue ? 'متأخرة' : `استحقاق خلال ${formatDistanceToNowStrict(new Date(ticket.sla_due_at), { locale: ar })}`}
    </Badge>
  );
}

export default function TicketDetailView({ ticketId, currentUserId, isAdmin, backTo, displayName }: Props) {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [timeline, setTimeline] = useState<TicketTimelineEntry[]>([]);
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
  const [linked, setLinked] = useState<{ invoice?: any; order?: any; customer?: any }>({});
  const [presence, setPresence] = useState<TicketPresence[]>([]);
  const [otherTyping, setOtherTyping] = useState<boolean>(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<{ label: string; content: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [csatOpen, setCsatOpen] = useState(false);
  const [csatRating, setCsatRating] = useState(5);
  const [csatComment, setCsatComment] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<any>(null);

  const load = async () => {
    try {
      const t = await SupportService.get(ticketId);
      if (!t) { toast.error('التذكرة غير موجودة'); navigate(backTo); return; }
      setTicket(t);
      const [msgs, tl, atts, qr] = await Promise.all([
        SupportService.getMessages(ticketId),
        SupportService.getTimeline(ticketId),
        SupportService.getAttachments(ticketId),
        isAdmin ? SupportService.listQuickReplies() : Promise.resolve([]),
      ]);
      setMessages(msgs);
      setTimeline(tl);
      setAttachments(atts);
      setQuickReplies(qr);

      // Mark as read
      SupportService.markRead(ticketId, isAdmin).catch(() => {});

      const linkedData: any = {};
      if (t.related_invoice_id) {
        const { data } = await supabase.from('invoices').select('id, invoice_number, total_amount, paid_amount, remaining_amount, status, currency').eq('id', t.related_invoice_id).maybeSingle();
        linkedData.invoice = data;
      }
      if (t.related_order_id) {
        const { data } = await supabase.from('service_orders').select('id, tracking_id, service_name, current_status, total_amount').eq('id', t.related_order_id).maybeSingle();
        linkedData.order = data;
      }
      if (t.customer_id) {
        const { data } = await supabase.from('customers').select('id, name, email, phone, customer_code').eq('id', t.customer_id).maybeSingle();
        linkedData.customer = data;
      } else if (t.user_id) {
        const { data } = await supabase.from('customers').select('id, name, email, phone, customer_code').eq('user_id', t.user_id).maybeSingle();
        linkedData.customer = data;
      }
      setLinked(linkedData);
    } catch (e: any) {
      toast.error('فشل التحميل', { description: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [ticketId]);

  // Realtime subscriptions
  useEffect(() => {
    const ch = supabase.channel(`support-${ticketId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${ticketId}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ticket_timeline', filter: `ticket_id=eq.${ticketId}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ticket_attachments', filter: `ticket_id=eq.${ticketId}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets', filter: `id=eq.${ticketId}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ticket_presence', filter: `ticket_id=eq.${ticketId}` }, async () => {
        const p = await SupportService.getPresence(ticketId);
        setPresence(p.filter(x => x.user_id !== currentUserId));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ticket_typing', filter: `ticket_id=eq.${ticketId}` }, async () => {
        const t = await SupportService.getTyping(ticketId, currentUserId);
        setOtherTyping(t.length > 0);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line
  }, [ticketId]);

  // Heartbeat presence every 30s
  useEffect(() => {
    const userType = isAdmin ? 'admin' : 'client';
    SupportService.heartbeat(ticketId, currentUserId, userType, displayName);
    const i = setInterval(() => SupportService.heartbeat(ticketId, currentUserId, userType, displayName), 30000);
    return () => {
      clearInterval(i);
      SupportService.leavePresence(ticketId, currentUserId).catch(() => {});
    };
  }, [ticketId, currentUserId, isAdmin, displayName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = (value: string) => {
    setReply(value);
    const userType = isAdmin ? 'admin' : 'client';
    if (value.trim()) {
      SupportService.setTyping(ticketId, currentUserId, userType, true).catch(() => {});
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        SupportService.setTyping(ticketId, currentUserId, userType, false).catch(() => {});
      }, 3000);
    }
  };

  const handleSend = async () => {
    if (!reply.trim() || !ticket) return;
    setSending(true);
    try {
      await SupportService.sendMessage(ticketId, currentUserId, isAdmin ? 'admin' : 'client', reply.trim());
      setReply('');
      SupportService.setTyping(ticketId, currentUserId, isAdmin ? 'admin' : 'client', false).catch(() => {});
    } catch (e: any) {
      toast.error('فشل الإرسال', { description: e.message });
    } finally {
      setSending(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !ticket) return;
    setUploading(true);
    try {
      await SupportService.uploadAttachment(ticketId, currentUserId, file, isAdmin);
      toast.success('تم رفع الملف');
    } catch (err: any) {
      toast.error('فشل الرفع', { description: err.message });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!ticket) return;
    try {
      await SupportService.update(ticket.id, { status });
      toast.success('تم تحديث الحالة');
    } catch (e: any) { toast.error('فشل', { description: e.message }); }
  };

  const handlePriorityChange = async (priority: string) => {
    if (!ticket) return;
    try {
      await SupportService.update(ticket.id, { priority });
      toast.success('تم تحديث الأولوية');
    } catch (e: any) { toast.error('فشل', { description: e.message }); }
  };

  const downloadFile = async (a: TicketAttachment) => {
    try {
      const url = await SupportService.getSignedUrl(a.storage_path);
      window.open(url, '_blank');
    } catch (e: any) { toast.error('فشل', { description: e.message }); }
  };

  const requestAiReplies = async () => {
    if (!ticket) return;
    setAiLoading(true);
    try {
      const data = await SupportService.ai('suggest_reply', {
        context: `${ticket.subject}\n${ticket.description || ''}`,
        messages: messages.slice(-10),
      });
      setAiSuggestions(data?.replies || []);
    } catch (e: any) { toast.error('تعذّر توليد الردود', { description: e.message }); }
    finally { setAiLoading(false); }
  };

  const requestAiSummary = async () => {
    if (!ticket) return;
    setAiLoading(true);
    try {
      const data = await SupportService.ai('summarize', {
        context: `${ticket.subject}\n${ticket.description || ''}`,
        messages,
      });
      setAiSummary(data?.summary || '');
    } catch (e: any) { toast.error('تعذّر التلخيص', { description: e.message }); }
    finally { setAiLoading(false); }
  };

  const submitCsat = async () => {
    if (!ticket) return;
    try {
      await SupportService.submitCsat(ticket.id, csatRating, csatComment);
      toast.success('شكراً لتقييمك!');
      setCsatOpen(false);
    } catch (e: any) { toast.error('فشل الإرسال', { description: e.message }); }
  };

  const showCsatPrompt = useMemo(() =>
    !isAdmin && ticket && (ticket.status === 'resolved' || ticket.status === 'closed') && !ticket.csat_submitted_at
  , [isAdmin, ticket]);

  if (loading || !ticket) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const Icon = CATEGORY_ICONS[ticket.category] || TicketIcon;

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-start gap-2 sm:gap-3 flex-wrap">
        <Button variant="ghost" size="icon" onClick={() => navigate(backTo)} className="rounded-full shrink-0 h-9 w-9 sm:h-10 sm:w-10">
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border shrink-0 ${CATEGORY_COLOR[ticket.category] || CATEGORY_COLOR.general}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base sm:text-xl md:text-2xl font-bold flex items-center gap-2 flex-wrap leading-tight">
            <span className="break-words">{ticket.subject}</span>
            <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">{ticket.ticket_number}</span>
          </h1>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <Badge variant="outline" className={`${CATEGORY_COLOR[ticket.category]} text-[10px] sm:text-xs`}>{CATEGORY_LABELS[ticket.category] || ticket.category}</Badge>
            <Badge variant="outline" className={`${STATUS_COLOR[ticket.status]} text-[10px] sm:text-xs`}>{STATUS_LABELS[ticket.status] || ticket.status}</Badge>
            <Badge variant="outline" className={`${PRIORITY_COLOR[ticket.priority]} text-[10px] sm:text-xs`}>{PRIORITY_LABELS[ticket.priority] || ticket.priority}</Badge>
            <SLABadge ticket={ticket} />
            {presence.length > 0 && (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <Eye className="w-3 h-3" />
                {presence[0].user_type === 'admin' ? 'الفريق متصل' : 'العميل متصل'}
              </Badge>
            )}
            <span className="text-[10px] sm:text-xs text-muted-foreground">{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true, locale: ar })}</span>
          </div>
        </div>
      </div>

      {/* CSAT Prompt */}
      {showCsatPrompt && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-3 sm:p-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-5 h-5 text-emerald-600" />
              <span>كيف كانت تجربتك مع فريق الدعم؟</span>
            </div>
            <Button size="sm" onClick={() => setCsatOpen(true)}>قيّم الخدمة</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Main: Chat + Timeline + Attachments */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          <Tabs defaultValue="chat" dir="rtl">
            <TabsList className="w-full h-auto">
              <TabsTrigger value="chat" className="gap-1 sm:gap-2 flex-1 text-[11px] sm:text-sm px-2 sm:px-3">
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>المحادثة</span> ({messages.length})
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-1 sm:gap-2 flex-1 text-[11px] sm:text-sm px-2 sm:px-3">
                <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> السجل ({timeline.length})
              </TabsTrigger>
              <TabsTrigger value="files" className="gap-1 sm:gap-2 flex-1 text-[11px] sm:text-sm px-2 sm:px-3">
                <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>المرفقات</span> ({attachments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0 flex flex-col h-[60vh]">
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-muted/20">
                    {ticket.description && (
                      <div className="bg-card border rounded-lg p-3 text-sm">
                        <div className="text-xs text-muted-foreground mb-1">وصف التذكرة</div>
                        {ticket.description}
                      </div>
                    )}
                    {messages.length === 0 && !ticket.description && (
                      <div className="text-center text-muted-foreground py-12">
                        <MessageSquare className="w-10 h-10 mx-auto opacity-30 mb-2" />
                        لا توجد رسائل بعد. ابدأ المحادثة الآن.
                      </div>
                    )}
                    {messages.map((m) => {
                      const mine = m.sender_id === currentUserId;
                      const isAdminMsg = m.sender_type === 'admin';
                      return (
                        <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            mine ? 'bg-primary text-primary-foreground' :
                            isAdminMsg ? 'bg-emerald-500/10 border border-emerald-500/20' :
                            'bg-card border'
                          }`}>
                            <div className="text-[10px] opacity-70 mb-1 flex items-center gap-1">
                              {isAdminMsg ? <ShieldAlert className="w-3 h-3" /> : <User className="w-3 h-3" />}
                              {isAdminMsg ? 'الدعم' : 'العميل'}
                              <span>·</span>
                              {format(new Date(m.created_at), 'HH:mm', { locale: ar })}
                            </div>
                            <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                          </div>
                        </div>
                      );
                    })}
                    {otherTyping && (
                      <div className="flex justify-start">
                        <div className="bg-card border rounded-2xl px-4 py-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </span>
                          يكتب الآن...
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* AI Suggestions (admin only) */}
                  {isAdmin && aiSuggestions.length > 0 && (
                    <div className="border-t bg-violet-500/5 p-2 space-y-1">
                      <div className="text-[10px] text-violet-600 font-medium px-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> اقتراحات ذكية
                      </div>
                      {aiSuggestions.map((s, i) => (
                        <button key={i}
                          onClick={() => setReply(s.content)}
                          className="w-full text-right text-xs p-2 rounded border bg-card hover:bg-violet-500/10 transition-colors">
                          <span className="font-medium text-violet-600">{s.label}:</span> {s.content.slice(0, 100)}...
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="border-t p-2 sm:p-3 flex items-end gap-1.5 sm:gap-2 bg-card">
                    <input ref={fileRef} type="file" hidden onChange={handleUpload} />
                    <Button variant="outline" size="icon" onClick={() => fileRef.current?.click()} disabled={uploading} title="إرفاق" className="shrink-0 h-9 w-9 sm:h-10 sm:w-10">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                    </Button>

                    {isAdmin && (
                      <>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="icon" title="ردود سريعة" className="shrink-0 h-9 w-9 sm:h-10 sm:w-10">
                              <Zap className="w-4 h-4 text-amber-500" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-80 max-h-80 overflow-y-auto">
                            <div className="text-xs font-medium mb-2">قوالب جاهزة</div>
                            <div className="space-y-1">
                              {quickReplies.map(q => (
                                <button key={q.id}
                                  onClick={() => setReply(q.content)}
                                  className="w-full text-right p-2 rounded text-xs hover:bg-muted">
                                  <div className="font-medium">{q.title}</div>
                                  <div className="text-muted-foreground line-clamp-2">{q.content}</div>
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Button variant="outline" size="icon" onClick={requestAiReplies} disabled={aiLoading} title="اقتراحات AI" className="shrink-0 h-9 w-9 sm:h-10 sm:w-10">
                          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 text-violet-500" />}
                        </Button>
                      </>
                    )}

                    <Textarea
                      value={reply}
                      onChange={(e) => handleTyping(e.target.value)}
                      placeholder="اكتب رسالتك..."
                      rows={2}
                      className="flex-1 resize-none text-sm min-h-[40px]"
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    />
                    <Button onClick={handleSend} disabled={!reply.trim() || sending} size="icon" className="shrink-0 self-stretch h-auto w-10 sm:w-auto sm:px-4 sm:gap-2">
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span className="hidden sm:inline">إرسال</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  {timeline.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12"><History className="w-10 h-10 mx-auto opacity-30 mb-2" />لا يوجد سجل</div>
                  ) : (
                    <div className="relative pr-6">
                      <div className="absolute right-2.5 top-2 bottom-2 w-px bg-border" />
                      {timeline.map((t) => (
                        <div key={t.id} className="relative pb-4 pr-2">
                          <div className="absolute right-[-22px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                          <div className="text-sm font-medium">{t.action_label}</div>
                          {t.description && <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>}
                          <div className="text-[10px] text-muted-foreground/70 mt-1">{format(new Date(t.created_at), 'PPp', { locale: ar })}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 space-y-2">
                  {attachments.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12"><Paperclip className="w-10 h-10 mx-auto opacity-30 mb-2" />لا توجد مرفقات</div>
                  ) : attachments.map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-5 h-5 text-primary shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{a.file_name}</div>
                          <div className="text-xs text-muted-foreground">{(a.file_size / 1024).toFixed(1)} KB · {a.uploaded_by_admin ? 'الدعم' : 'العميل'}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => downloadFile(a)}><Download className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {isAdmin && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-primary" />إجراءات الإدارة</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">الحالة</label>
                  <Select value={ticket.status} onValueChange={handleStatusChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">الأولوية</label>
                  <Select value={ticket.priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRIORITY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={requestAiSummary} disabled={aiLoading}>
                  {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-violet-500" />}
                  تلخيص ذكي للتذكرة
                </Button>
                {aiSummary && (
                  <div className="text-xs p-2 rounded bg-violet-500/5 border border-violet-500/20">
                    {aiSummary}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {linked.customer && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><User className="w-4 h-4 text-primary" />العميل</CardTitle></CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="font-medium">{linked.customer.name}</div>
                {linked.customer.email && <div className="text-xs text-muted-foreground">{linked.customer.email}</div>}
                {linked.customer.phone && <div className="text-xs text-muted-foreground">{linked.customer.phone}</div>}
                {linked.customer.customer_code && <Badge variant="outline" className="font-mono text-[10px]">#{linked.customer.customer_code}</Badge>}
              </CardContent>
            </Card>
          )}

          {linked.invoice && (
            <Card className="border-0 shadow-sm border-emerald-500/20">
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-600" />فاتورة مرتبطة</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">رقم</span>
                  <span className="font-mono">{linked.invoice.invoice_number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المبلغ</span>
                  <span className="font-bold">{linked.invoice.total_amount} {linked.invoice.currency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الحالة</span>
                  <Badge variant="outline" className="text-[10px]">{linked.invoice.status}</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => navigate(isAdmin ? `/adminfekrah/invoices/${linked.invoice.id}` : `/invoices`)}>
                  <ExternalLink className="w-3 h-3" /> عرض الفاتورة
                </Button>
              </CardContent>
            </Card>
          )}

          {linked.order && (
            <Card className="border-0 shadow-sm border-blue-500/20">
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-blue-600" />طلب مرتبط</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المتابعة</span>
                  <span className="font-mono text-xs">{linked.order.tracking_id}</span>
                </div>
                {linked.order.service_name && <div className="text-xs">{linked.order.service_name}</div>}
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => navigate(isAdmin ? `/adminfekrah/service-orders/${linked.order.id}` : `/orders/${linked.order.id}`)}>
                  <ExternalLink className="w-3 h-3" /> عرض الطلب
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* CSAT dialog */}
      <Dialog open={csatOpen} onOpenChange={setCsatOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تقييم الخدمة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setCsatRating(n)} className="p-1">
                  <Star className={`w-8 h-8 ${n <= csatRating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'}`} />
                </button>
              ))}
            </div>
            <Textarea placeholder="ملاحظاتك (اختياري)" value={csatComment} onChange={(e) => setCsatComment(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCsatOpen(false)}>إلغاء</Button>
            <Button onClick={submitCsat}>إرسال التقييم</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
