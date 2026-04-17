import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  ArrowRight, Send, Paperclip, Download, MessageSquare, History,
  DollarSign, ShoppingBag, ShieldAlert, Wrench, Ticket as TicketIcon,
  CheckCircle2, Clock, AlertCircle, FileText, Loader2, User, Hash,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  TicketsService, type Ticket, type TicketMessage, type TicketTimelineEntry,
  type TicketAttachment, CATEGORY_LABELS, STATUS_LABELS, PRIORITY_LABELS,
  CATEGORY_COLOR, STATUS_COLOR, PRIORITY_COLOR,
} from '@/utils/ticketsService';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const CATEGORY_ICONS: Record<string, any> = {
  financial: DollarSign,
  service_order: ShoppingBag,
  complaint: ShieldAlert,
  technical: Wrench,
  general: TicketIcon,
};

interface Props {
  ticketId: string;
  currentUserId: string;
  isAdmin: boolean;
  backTo: string;
}

export default function TicketDetailView({ ticketId, currentUserId, isAdmin, backTo }: Props) {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [timeline, setTimeline] = useState<TicketTimelineEntry[]>([]);
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
  const [linked, setLinked] = useState<{ invoice?: any; order?: any; customer?: any }>({});
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      const t = await TicketsService.get(ticketId);
      if (!t) { toast.error('التذكرة غير موجودة'); navigate(backTo); return; }
      setTicket(t);
      const [msgs, tl, atts] = await Promise.all([
        TicketsService.getMessages(ticketId),
        TicketsService.getTimeline(ticketId),
        TicketsService.getAttachments(ticketId),
      ]);
      setMessages(msgs);
      setTimeline(tl);
      setAttachments(atts);

      const linkedData: any = {};
      if (t.related_invoice_id) {
        const { data } = await supabase.from('invoices').select('id, invoice_number, total_amount, status, currency').eq('id', t.related_invoice_id).maybeSingle();
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

  useEffect(() => { load(); }, [ticketId]);

  useEffect(() => {
    const ch = supabase.channel(`ticket-${ticketId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${ticketId}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ticket_timeline', filter: `ticket_id=eq.${ticketId}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ticket_attachments', filter: `ticket_id=eq.${ticketId}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets', filter: `id=eq.${ticketId}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!reply.trim() || !ticket) return;
    setSending(true);
    try {
      await TicketsService.sendMessage(ticketId, currentUserId, isAdmin ? 'admin' : 'client', reply.trim());
      setReply('');
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
      await TicketsService.uploadAttachment(ticketId, currentUserId, file, isAdmin);
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
      await TicketsService.updateStatus(ticket.id, status as any);
      toast.success('تم تحديث الحالة');
    } catch (e: any) { toast.error('فشل', { description: e.message }); }
  };

  const handlePriorityChange = async (priority: string) => {
    if (!ticket) return;
    try {
      await TicketsService.updatePriority(ticket.id, priority as any);
      toast.success('تم تحديث الأولوية');
    } catch (e: any) { toast.error('فشل', { description: e.message }); }
  };

  const downloadFile = async (a: TicketAttachment) => {
    try {
      const url = await TicketsService.getSignedUrl(a.storage_path);
      window.open(url, '_blank');
    } catch (e: any) { toast.error('فشل', { description: e.message }); }
  };

  if (loading || !ticket) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const Icon = CATEGORY_ICONS[ticket.category] || TicketIcon;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4" dir="rtl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 flex-wrap">
        <Button variant="ghost" size="icon" onClick={() => navigate(backTo)} className="rounded-full">
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${CATEGORY_COLOR[ticket.category] || CATEGORY_COLOR.general}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2 flex-wrap">
            {ticket.subject}
            <span className="text-xs font-mono text-muted-foreground">{ticket.ticket_number}</span>
          </h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="outline" className={CATEGORY_COLOR[ticket.category]}>{CATEGORY_LABELS[ticket.category]}</Badge>
            <Badge variant="outline" className={STATUS_COLOR[ticket.status]}>{STATUS_LABELS[ticket.status]}</Badge>
            <Badge variant="outline" className={PRIORITY_COLOR[ticket.priority]}>{PRIORITY_LABELS[ticket.priority]}</Badge>
            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true, locale: ar })}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main: Chat + Timeline + Attachments */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="chat" dir="rtl">
            <TabsList className="flex-row-reverse w-full">
              <TabsTrigger value="chat" className="gap-2 flex-1"><MessageSquare className="w-4 h-4" /> المحادثة ({messages.length})</TabsTrigger>
              <TabsTrigger value="timeline" className="gap-2 flex-1"><History className="w-4 h-4" /> السجل ({timeline.length})</TabsTrigger>
              <TabsTrigger value="files" className="gap-2 flex-1"><Paperclip className="w-4 h-4" /> المرفقات ({attachments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0 flex flex-col h-[60vh]">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
                    {ticket.description && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border rounded-lg p-3 text-sm">
                        <div className="text-xs text-muted-foreground mb-1">وصف التذكرة</div>
                        {ticket.description}
                      </motion.div>
                    )}
                    {messages.length === 0 && !ticket.description && (
                      <div className="text-center text-muted-foreground py-12">
                        <MessageSquare className="w-10 h-10 mx-auto opacity-30 mb-2" />
                        لا توجد رسائل بعد. ابدأ المحادثة الآن.
                      </div>
                    )}
                    <AnimatePresence>
                      {messages.map((m) => {
                        const mine = m.sender_id === currentUserId;
                        const isAdminMsg = m.sender_type === 'admin';
                        return (
                          <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                              mine ? 'bg-primary text-primary-foreground' : isAdminMsg ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-card border'
                            }`}>
                              <div className="text-[10px] opacity-70 mb-1 flex items-center gap-1">
                                {isAdminMsg ? <ShieldAlert className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                {isAdminMsg ? 'الإدارة' : 'العميل'}
                                <span>·</span>
                                {format(new Date(m.created_at), 'HH:mm', { locale: ar })}
                              </div>
                              <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="border-t p-3 flex items-end gap-2 bg-card">
                    <input ref={fileRef} type="file" hidden onChange={handleUpload} />
                    <Button variant="outline" size="icon" onClick={() => fileRef.current?.click()} disabled={uploading} title="إرفاق">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                    </Button>
                    <Textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="اكتب رسالتك..."
                      rows={2}
                      className="flex-1 resize-none"
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    />
                    <Button onClick={handleSend} disabled={!reply.trim() || sending} className="gap-2 self-stretch">
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      إرسال
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
                      <AnimatePresence>
                        {timeline.map((t, i) => (
                          <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="relative pb-4 pr-2">
                            <div className="absolute right-[-22px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                            <div className="text-sm font-medium">{t.action_label}</div>
                            {t.description && <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>}
                            <div className="text-[10px] text-muted-foreground/70 mt-1">{format(new Date(t.created_at), 'PPp', { locale: ar })}</div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
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
                    <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="w-5 h-5 text-primary shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{a.file_name}</div>
                          <div className="text-xs text-muted-foreground">{(a.file_size / 1024).toFixed(1)} KB · {a.uploaded_by_admin ? 'الإدارة' : 'العميل'}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => downloadFile(a)}><Download className="w-4 h-4" /></Button>
                    </motion.div>
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
              <CardHeader className="pb-3"><CardTitle className="text-sm">إجراءات الإدارة</CardTitle></CardHeader>
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
              </CardContent>
            </Card>
          )}

          {linked.customer && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><User className="w-4 h-4" /> العميل</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="font-medium">{linked.customer.name}</div>
                {linked.customer.customer_code && (
                  <div className="text-xs flex items-center gap-1.5 font-mono">
                    <Hash className="w-3 h-3" />{linked.customer.customer_code}
                  </div>
                )}
                {linked.customer.email && <div className="text-xs text-muted-foreground truncate">{linked.customer.email}</div>}
                {linked.customer.phone && <div className="text-xs text-muted-foreground">{linked.customer.phone}</div>}
                {isAdmin && (
                  <Link to={`/adminmaster/customers/${linked.customer.id}`} className="text-xs text-primary hover:underline block pt-1">عرض ملف العميل ←</Link>
                )}
              </CardContent>
            </Card>
          )}

          {linked.invoice && (
            <Card className="border-0 shadow-sm border-r-4 border-r-emerald-500">
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-600" /> فاتورة مرتبطة</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="font-mono font-bold">{linked.invoice.invoice_number}</div>
                <div className="text-xs text-muted-foreground">الإجمالي: {linked.invoice.total_amount} {linked.invoice.currency}</div>
                <Badge variant="outline" className="text-[10px]">{linked.invoice.status}</Badge>
                <Link to={isAdmin ? `/adminmaster/invoices/${linked.invoice.id}` : `/invoices`} className="text-xs text-primary hover:underline block pt-1">فتح الفاتورة ←</Link>
              </CardContent>
            </Card>
          )}

          {linked.order && (
            <Card className="border-0 shadow-sm border-r-4 border-r-blue-500">
              <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-blue-600" /> طلب مرتبط</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="font-mono font-bold">{linked.order.tracking_id}</div>
                <div className="text-xs text-muted-foreground">{linked.order.service_name}</div>
                <Badge variant="outline" className="text-[10px]">{linked.order.current_status}</Badge>
                <Link to={isAdmin ? `/adminmaster/service-orders/${linked.order.id}` : `/orders`} className="text-xs text-primary hover:underline block pt-1">فتح الطلب ←</Link>
              </CardContent>
            </Card>
          )}

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-sm">معلومات</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              <InfoLine label="تاريخ الإنشاء" value={format(new Date(ticket.created_at), 'PPp', { locale: ar })} />
              {ticket.last_message_at && <InfoLine label="آخر رسالة" value={formatDistanceToNow(new Date(ticket.last_message_at), { addSuffix: true, locale: ar })} />}
              {ticket.resolved_at && <InfoLine label="تم الحل في" value={format(new Date(ticket.resolved_at), 'PPp', { locale: ar })} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const InfoLine = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-2"><span className="text-muted-foreground">{label}</span><span className="font-medium text-left">{value}</span></div>
);
