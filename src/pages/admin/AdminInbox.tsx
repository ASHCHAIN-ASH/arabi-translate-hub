import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { supabase } from '@/data/legacy/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox as InboxIcon, Mail, Phone, Search, Send, RefreshCcw, CheckCircle2, Loader2,
  MessageSquare, Briefcase, GraduationCap, FileSignature, Languages, BookOpen,
  HelpCircle, Sparkles, Archive, Globe, Clock, Reply, User2,
  Filter, AlertCircle, Activity, Pin, Star, Trash2, Volume2, VolumeX, Wand2,
  Keyboard, ArchiveRestore,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import SEO from '@/components/SEO';
import AdminLayout from '@/components/admin/AdminLayout';
import { InboxTemplatesDialog } from '@/components/admin/inbox/InboxTemplatesDialog';
import { InboxNotesPanel } from '@/components/admin/inbox/InboxNotesPanel';
import { InboxTagsEditor } from '@/components/admin/inbox/InboxTagsEditor';
import { InboxAnalyticsDialog } from '@/components/admin/inbox/InboxAnalyticsDialog';

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
  is_pinned: boolean;
  is_starred: boolean;
  is_archived: boolean;
  read_at: string | null;
  tags: string[];
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

const STATUS_META: Record<string, { label: string; chip: string; ring: string }> = {
  new:     { label: 'جديد',   chip: 'bg-blue-500/10 text-blue-700 border-blue-300/60 dark:text-blue-300',     ring: 'ring-blue-500/30' },
  open:    { label: 'مفتوح',  chip: 'bg-amber-500/10 text-amber-700 border-amber-300/60 dark:text-amber-300',  ring: 'ring-amber-500/30' },
  replied: { label: 'تم الرد', chip: 'bg-emerald-500/10 text-emerald-700 border-emerald-300/60 dark:text-emerald-300', ring: 'ring-emerald-500/30' },
  closed:  { label: 'مغلق',   chip: 'bg-muted text-muted-foreground border-border', ring: 'ring-muted/30' },
};

const FORM_META: Record<string, { label: string; icon: any; color: string }> = {
  contact:                { label: 'تواصل',          icon: MessageSquare, color: 'text-sky-600 bg-sky-500/10' },
  service_inquiry:        { label: 'استفسار خدمة',    icon: HelpCircle,    color: 'text-violet-600 bg-violet-500/10' },
  admission:              { label: 'قبول جامعي',      icon: GraduationCap, color: 'text-indigo-600 bg-indigo-500/10' },
  careers:                { label: 'توظيف',          icon: Briefcase,     color: 'text-emerald-600 bg-emerald-500/10' },
  license:                { label: 'ترخيص',          icon: FileSignature, color: 'text-amber-600 bg-amber-500/10' },
  document_translation:   { label: 'ترجمة وثائق',     icon: Languages,     color: 'text-rose-600 bg-rose-500/10' },
  student_service_order:  { label: 'طلب طلابي',       icon: BookOpen,      color: 'text-teal-600 bg-teal-500/10' },
  academic_expertise:     { label: 'استشارة أكاديمية', icon: Sparkles,      color: 'text-fuchsia-600 bg-fuchsia-500/10' },
  peer_review:            { label: 'مراجعة أقران',    icon: CheckCircle2,  color: 'text-cyan-600 bg-cyan-500/10' },
};

const getInitials = (name: string) =>
  name?.trim().split(/\s+/).slice(0, 2).map((n) => n[0]).join('').toUpperCase() || '؟';

const getFormMeta = (type: string) =>
  FORM_META[type] ?? { label: type, icon: MessageSquare, color: 'text-muted-foreground bg-muted' };

const SOUND_PREF_KEY = 'inbox.soundEnabled';

const AdminInbox: React.FC = () => {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replies, setReplies] = useState<InboxReply[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [sending, setSending] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterForm, setFilterForm] = useState<string>('all');
  const [filterView, setFilterView] = useState<'inbox' | 'starred' | 'archived'>('inbox');
  const [search, setSearch] = useState('');
  const [soundOn, setSoundOn] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.localStorage.getItem(SOUND_PREF_KEY) === '1'
  );
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const lastTopIdRef = useRef<string | null>(null);

  // ---------- Sound ----------
  const playPing = useCallback(() => {
    if (!soundOn) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880; g.gain.value = 0.05;
      o.start(); o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      o.stop(ctx.currentTime + 0.4);
    } catch { /* noop */ }
  }, [soundOn]);

  // ---------- Fetchers ----------
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inbox_messages')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('last_activity_at', { ascending: false })
      .limit(500);
    if (error) toast.error('تعذر جلب الرسائل');
    else setMessages((data ?? []) as InboxMessage[]);
    setLoading(false);
  }, []);

  const fetchReplies = useCallback(async (id: string) => {
    setLoadingReplies(true);
    const { data, error } = await supabase
      .from('inbox_replies').select('*')
      .eq('message_id', id)
      .order('created_at', { ascending: true });
    if (error) toast.error('تعذر جلب الردود');
    else setReplies((data ?? []) as InboxReply[]);
    setLoadingReplies(false);
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // ---------- Realtime ----------
  useEffect(() => {
    const ch = supabase
      .channel('inbox-admin-stream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inbox_messages' }, () => fetchMessages())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'inbox_replies' }, (payload) => {
        const p: any = payload.new;
        if (selectedId && p?.message_id === selectedId) fetchReplies(selectedId);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchMessages, fetchReplies, selectedId]);

  // Detect new arrivals → ping
  useEffect(() => {
    if (messages.length === 0) return;
    const topId = messages[0]?.id;
    if (lastTopIdRef.current && lastTopIdRef.current !== topId) {
      const top = messages[0];
      if (top && top.status === 'new') {
        playPing();
        toast.message('📬 رسالة جديدة', {
          description: `${top.sender_name} — ${getFormMeta(top.form_type).label}`,
        });
      }
    }
    lastTopIdRef.current = topId;
  }, [messages, playPing]);

  // ---------- Selection effects ----------
  useEffect(() => {
    if (selectedId) {
      fetchReplies(selectedId);
      const m = messages.find((x) => x.id === selectedId);
      if (m && (m.status === 'new' || !m.read_at)) {
        supabase.from('inbox_messages')
          .update({ status: m.status === 'new' ? 'open' : m.status, read_at: new Date().toISOString() })
          .eq('id', selectedId).then(() => {});
      }
    } else { setReplies([]); }
  }, [selectedId, fetchReplies]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [replies.length, selectedId]);

  // ---------- Derived ----------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((m) => {
      if (filterView === 'starred' && !m.is_starred) return false;
      if (filterView === 'archived' && !m.is_archived) return false;
      if (filterView === 'inbox' && m.is_archived) return false;
      if (filterStatus !== 'all' && m.status !== filterStatus) return false;
      if (filterForm !== 'all' && m.form_type !== filterForm) return false;
      if (!q) return true;
      return (
        m.sender_name.toLowerCase().includes(q) ||
        m.sender_email.toLowerCase().includes(q) ||
        (m.subject ?? '').toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q) ||
        (m.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [messages, filterStatus, filterForm, filterView, search]);

  const selected = useMemo(() => messages.find((m) => m.id === selectedId) ?? null, [messages, selectedId]);

  const counts = useMemo(() => ({
    total: messages.filter((m) => !m.is_archived).length,
    new: messages.filter((m) => m.status === 'new' && !m.is_archived).length,
    open: messages.filter((m) => m.status === 'open' && !m.is_archived).length,
    replied: messages.filter((m) => m.status === 'replied' && !m.is_archived).length,
    today: messages.filter((m) => new Date(m.created_at).toDateString() === new Date().toDateString()).length,
    starred: messages.filter((m) => m.is_starred).length,
  }), [messages]);

  // ---------- Mutations ----------
  const handleSendReply = async () => {
    if (!selected || !replyBody.trim()) return;
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('inbox-reply', {
        body: { messageId: selected.id, body: replyBody.trim() },
      });
      if (error) throw error;
      const status = (data as any)?.delivery_status;
      if (status === 'sent') toast.success('✅ تم إرسال الرد للعميل');
      else toast.warning('تم حفظ الرد لكن فشل الإرسال البريدي');
      setReplyBody('');
    } catch (err: any) {
      toast.error('تعذر إرسال الرد', { description: err?.message });
    } finally { setSending(false); }
  };

  const setStatus = async (status: string) => {
    if (!selected) return;
    const { error } = await supabase.from('inbox_messages').update({ status }).eq('id', selected.id);
    if (error) toast.error('تعذر تحديث الحالة'); else toast.success('تم تحديث الحالة');
  };

  const togglePin = async (m: InboxMessage) => {
    await supabase.from('inbox_messages').update({ is_pinned: !m.is_pinned }).eq('id', m.id);
  };
  const toggleStar = async (m: InboxMessage) => {
    await supabase.from('inbox_messages').update({ is_starred: !m.is_starred }).eq('id', m.id);
  };
  const toggleArchive = async (m: InboxMessage) => {
    await supabase.from('inbox_messages').update({ is_archived: !m.is_archived }).eq('id', m.id);
    if (!m.is_archived && selectedId === m.id) setSelectedId(null);
    toast.success(m.is_archived ? 'تمت الاستعادة' : 'تمت الأرشفة');
  };
  const deleteMessage = async (m: InboxMessage) => {
    const { error } = await supabase.from('inbox_messages').delete().eq('id', m.id);
    if (error) toast.error('تعذر الحذف');
    else { toast.success('تم الحذف نهائياً'); if (selectedId === m.id) setSelectedId(null); }
  };

  const aiSuggest = async (toneOverride?: string) => {
    if (!selected) return;
    setAiThinking(true);
    try {
      const { data, error } = await supabase.functions.invoke('inbox-ai-suggest', {
        body: { messageId: selected.id, tone: toneOverride ?? 'professional' },
      });
      if (error) throw error;
      const s = (data as any)?.suggestion?.trim();
      if (s) { setReplyBody(s); toast.success('تم اقتراح رد'); }
      else toast.error('لم يصل اقتراح');
    } catch (e: any) {
      toast.error('AI غير متاح', { description: e?.message });
    } finally { setAiThinking(false); }
  };

  const exportCsv = () => {
    const rows = [['التاريخ', 'الاسم', 'البريد', 'الهاتف', 'النوع', 'الموضوع', 'الحالة', 'الردود']];
    filtered.forEach((m) => rows.push([
      new Date(m.created_at).toISOString(),
      m.sender_name, m.sender_email, m.sender_phone ?? '',
      getFormMeta(m.form_type).label, m.subject ?? '', STATUS_META[m.status]?.label ?? m.status,
      String(m.reply_count),
    ]));
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `inbox-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const formTypes = useMemo(() => Array.from(new Set(messages.map((m) => m.form_type))), [messages]);

  // ---------- Keyboard shortcuts ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') {
        // Ctrl+Enter handled in textarea itself
        return;
      }
      if (e.key === '/') { e.preventDefault(); (document.querySelector('input[data-inbox-search]') as HTMLInputElement)?.focus(); }
      else if (e.key === 'j' || e.key === 'k') {
        if (filtered.length === 0) return;
        const idx = filtered.findIndex((m) => m.id === selectedId);
        const next = e.key === 'j' ? Math.min(filtered.length - 1, idx + 1) : Math.max(0, idx - 1);
        setSelectedId(filtered[next === -1 ? 0 : next].id);
      }
      else if (selected) {
        if (e.key === 'r') { e.preventDefault(); replyRef.current?.focus(); }
        else if (e.key === 'e') { toggleArchive(selected); }
        else if (e.key === 's') { toggleStar(selected); }
        else if (e.key === 'p') { togglePin(selected); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filtered, selected, selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const StatCard = ({ icon: Icon, label, value, color, delay, active, onClick }: any) => (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl border bg-card p-3 hover:shadow-md transition-all text-right ${active ? 'ring-2 ring-primary/40' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}><Icon className="w-4 h-4" /></div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-muted-foreground">{label}</div>
          <div className="text-lg font-bold leading-tight">{value}</div>
        </div>
      </div>
    </motion.button>
  );

  return (
    <AdminLayout>
      <SEO title="صندوق الوارد | لوحة الإدارة" description="استقبال جميع رسائل الفورمات والرد عليها مباشرة" />
      <TooltipProvider delayDuration={200}>
        <div className="flex w-full flex-col bg-gradient-to-br from-background via-background to-muted/30" dir="rtl">
          <header className="flex min-h-16 items-center gap-3 border-b px-4 bg-background/80 backdrop-blur-md sticky top-0 z-20">
            <motion.div initial={{ rotate: -10, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <InboxIcon className="w-5 h-5" />
            </motion.div>
            <div>
              <h1 className="font-bold text-lg leading-tight">صندوق الوارد</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                متصل لحظياً (Realtime)
              </p>
            </div>
            <div className="ms-auto flex items-center gap-2 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => {
                    const next = !soundOn; setSoundOn(next);
                    localStorage.setItem(SOUND_PREF_KEY, next ? '1' : '0');
                    toast.success(next ? 'تم تفعيل الإشعار الصوتي' : 'تم إيقاف الصوت');
                  }}>
                    {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{soundOn ? 'إيقاف الصوت' : 'تفعيل الصوت'}</TooltipContent>
              </Tooltip>
              <InboxAnalyticsDialog />
              <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1">
                <Archive className="w-3.5 h-3.5" /> CSV
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={fetchMessages} disabled={loading}>
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>تحديث</TooltipContent>
              </Tooltip>
            </div>
          </header>

          {/* Stats — clickable as quick filters */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 p-4">
            <StatCard icon={InboxIcon}    label="الإجمالي" value={counts.total}   color="bg-primary/10 text-primary"         delay={0.0}  active={filterView==='inbox' && filterStatus==='all'} onClick={() => { setFilterView('inbox'); setFilterStatus('all'); }} />
            <StatCard icon={AlertCircle}  label="جديد"     value={counts.new}     color="bg-blue-500/10 text-blue-600"       delay={0.05} active={filterStatus==='new'} onClick={() => { setFilterView('inbox'); setFilterStatus('new'); }} />
            <StatCard icon={MessageSquare} label="مفتوح"   value={counts.open}    color="bg-amber-500/10 text-amber-600"     delay={0.1}  active={filterStatus==='open'} onClick={() => { setFilterView('inbox'); setFilterStatus('open'); }} />
            <StatCard icon={CheckCircle2} label="تم الرد"  value={counts.replied} color="bg-emerald-500/10 text-emerald-600" delay={0.15} active={filterStatus==='replied'} onClick={() => { setFilterView('inbox'); setFilterStatus('replied'); }} />
            <StatCard icon={Star}         label="مميّز"    value={counts.starred} color="bg-yellow-500/10 text-yellow-600"   delay={0.2}  active={filterView==='starred'} onClick={() => setFilterView('starred')} />
            <StatCard icon={Clock}        label="اليوم"    value={counts.today}   color="bg-violet-500/10 text-violet-600"   delay={0.25} onClick={() => setFilterView('inbox')} />
          </div>

          <div className="flex min-h-[calc(100vh-15rem)] flex-col border-t lg:h-[calc(100vh-15rem)] lg:flex-row-reverse">
            {/* List */}
            <aside className="flex flex-col overflow-hidden bg-card/50 lg:w-[420px] lg:border-l">
              <div className="p-3 border-b space-y-2 bg-background/60 backdrop-blur">
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    data-inbox-search
                    placeholder="ابحث (/ للتركيز السريع)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pe-9 bg-background"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant={filterView === 'inbox' ? 'default' : 'outline'} size="sm" onClick={() => setFilterView('inbox')} className="text-xs">
                    <InboxIcon className="w-3 h-3 ml-1" /> صندوق
                  </Button>
                  <Button variant={filterView === 'starred' ? 'default' : 'outline'} size="sm" onClick={() => setFilterView('starred')} className="text-xs">
                    <Star className="w-3 h-3 ml-1" /> مميّزة
                  </Button>
                  <Button variant={filterView === 'archived' ? 'default' : 'outline'} size="sm" onClick={() => setFilterView('archived')} className="text-xs">
                    <Archive className="w-3 h-3 ml-1" /> الأرشيف
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-background h-8 text-xs"><Filter className="w-3 h-3 ms-1 opacity-60" /><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل الحالات</SelectItem>
                      <SelectItem value="new">جديد</SelectItem>
                      <SelectItem value="open">مفتوح</SelectItem>
                      <SelectItem value="replied">تم الرد</SelectItem>
                      <SelectItem value="closed">مغلق</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterForm} onValueChange={setFilterForm}>
                    <SelectTrigger className="bg-background h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل الفورمات</SelectItem>
                      {formTypes.map((t) => (<SelectItem key={t} value={t}>{getFormMeta(t).label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ScrollArea className="flex-1">
                {loading ? (
                  <div className="p-10 text-center text-muted-foreground text-sm flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" /> جاري التحميل...
                  </div>
                ) : filtered.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center text-muted-foreground">
                    <Archive className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <div className="text-sm">لا توجد رسائل مطابقة</div>
                  </motion.div>
                ) : (
                  <ul className="divide-y">
                    <AnimatePresence initial={false}>
                      {filtered.map((m, idx) => {
                        const status = STATUS_META[m.status] ?? STATUS_META.open;
                        const form = getFormMeta(m.form_type);
                        const FormIcon = form.icon;
                        const isActive = m.id === selectedId;
                        const isNew = m.status === 'new';
                        return (
                          <motion.li key={m.id} layout
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: Math.min(idx * 0.02, 0.2) }}
                          >
                            <div className={`group w-full text-right p-3 hover:bg-accent/60 transition-all relative cursor-pointer ${isActive ? 'bg-primary/5' : ''}`}
                              onClick={() => setSelectedId(m.id)}
                            >
                              {isActive && <motion.div layoutId="active-indicator" className="absolute right-0 top-0 bottom-0 w-1 bg-primary rounded-l" />}
                              <div className="flex items-start gap-3">
                                <div className="relative">
                                  <Avatar className={`w-10 h-10 ring-2 ${status.ring} ring-offset-1 ring-offset-background`}>
                                    <AvatarFallback className={`text-xs font-bold ${form.color}`}>{getInitials(m.sender_name)}</AvatarFallback>
                                  </Avatar>
                                  {isNew && <span className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full ring-2 ring-background animate-pulse" />}
                                  {m.is_pinned && <Pin className="absolute -bottom-1 -left-1 w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className={`text-sm truncate flex-1 ${isNew ? 'font-bold' : 'font-medium'}`}>
                                      {m.sender_name}
                                    </span>
                                    {m.is_starred && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                      {formatDistanceToNow(new Date(m.last_activity_at), { addSuffix: true, locale: ar })}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate mb-1.5">
                                    {m.subject ?? m.message.slice(0, 60)}
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <Badge variant="outline" className={`text-[10px] py-0 px-1.5 gap-1 border-0 ${form.color}`}>
                                      <FormIcon className="w-2.5 h-2.5" /> {form.label}
                                    </Badge>
                                    <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${status.chip}`}>
                                      {status.label}
                                    </Badge>
                                    {(m.tags ?? []).slice(0, 2).map((t) => (
                                      <Badge key={t} variant="secondary" className="text-[10px] py-0 px-1.5">{t}</Badge>
                                    ))}
                                    {m.reply_count > 0 && (
                                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                        <Reply className="w-2.5 h-2.5" /> {m.reply_count}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {/* Quick actions */}
                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={(e) => { e.stopPropagation(); togglePin(m); }} title="تثبيت">
                                    <Pin className={`w-3.5 h-3.5 ${m.is_pinned ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); toggleStar(m); }} title="نجمة">
                                    <Star className={`w-3.5 h-3.5 ${m.is_starred ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); toggleArchive(m); }} title={m.is_archived ? 'استعادة' : 'أرشفة'}>
                                    {m.is_archived ? <ArchiveRestore className="w-3.5 h-3.5 text-emerald-600" /> : <Archive className="w-3.5 h-3.5 text-muted-foreground" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                )}
              </ScrollArea>
              <div className="border-t p-2 bg-muted/20 text-[10px] text-muted-foreground flex items-center justify-center gap-2">
                <Keyboard className="w-3 h-3" />
                <span>اختصارات: J/K تنقل · / بحث · R رد · S نجمة · P تثبيت · E أرشفة</span>
              </div>
            </aside>

            {/* Conversation */}
            <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-muted/10 to-muted/30">
              <AnimatePresence mode="wait">
                {!selected ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex-1 flex items-center justify-center text-muted-foreground p-8"
                  >
                    <div className="text-center max-w-sm">
                      <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <InboxIcon className="w-10 h-10 text-primary/60" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">مرحباً بك في صندوق الوارد</h3>
                      <p className="text-sm">اختر رسالة من القائمة لعرض تفاصيلها والرد على العميل مباشرة عبر البريد الإلكتروني.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full">
                    {/* Conversation header */}
                    <div className="border-b bg-background/80 backdrop-blur p-4">
                      <div className="flex flex-wrap items-start gap-3 justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className={`font-bold ${getFormMeta(selected.form_type).color}`}>
                              {getInitials(selected.sender_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-base font-semibold flex items-center gap-2">
                              <User2 className="w-4 h-4 text-muted-foreground" />
                              {selected.sender_name}
                              {selected.is_pinned && <Pin className="w-4 h-4 text-amber-500 fill-amber-500" />}
                              {selected.is_starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                              <a href={`mailto:${selected.sender_email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="w-3 h-3" /> {selected.sender_email}</a>
                              {selected.sender_phone && (
                                <a href={`tel:${selected.sender_phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="w-3 h-3" /> {selected.sender_phone}</a>
                              )}
                              {selected.source_page && (<span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {selected.source_page}</span>)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tooltip><TooltipTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => togglePin(selected)} className="h-8 w-8 p-0">
                              <Pin className={`w-4 h-4 ${selected.is_pinned ? 'text-amber-500 fill-amber-500' : ''}`} />
                            </Button>
                          </TooltipTrigger><TooltipContent>{selected.is_pinned ? 'إلغاء التثبيت' : 'تثبيت'}</TooltipContent></Tooltip>
                          <Tooltip><TooltipTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => toggleStar(selected)} className="h-8 w-8 p-0">
                              <Star className={`w-4 h-4 ${selected.is_starred ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                            </Button>
                          </TooltipTrigger><TooltipContent>{selected.is_starred ? 'إزالة النجمة' : 'تمييز بنجمة'}</TooltipContent></Tooltip>
                          <Tooltip><TooltipTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => toggleArchive(selected)} className="h-8 w-8 p-0">
                              {selected.is_archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                            </Button>
                          </TooltipTrigger><TooltipContent>{selected.is_archived ? 'استعادة' : 'أرشفة'}</TooltipContent></Tooltip>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>حذف الرسالة نهائياً؟</AlertDialogTitle>
                                <AlertDialogDescription>سيتم حذف الرسالة وجميع الردود والملاحظات المرتبطة بها. هذا الإجراء لا يمكن التراجع عنه.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteMessage(selected)} className="bg-destructive hover:bg-destructive/90">حذف نهائي</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Select value={selected.status} onValueChange={setStatus}>
                            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">🔵 جديد</SelectItem>
                              <SelectItem value="open">🟡 مفتوح</SelectItem>
                              <SelectItem value="replied">🟢 تم الرد</SelectItem>
                              <SelectItem value="closed">⚫ مغلق</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-3 flex items-start gap-4 flex-wrap">
                        <Badge variant="outline" className={`gap-1 ${getFormMeta(selected.form_type).color} border-0`}>
                          {(() => { const I = getFormMeta(selected.form_type).icon; return <I className="w-3 h-3" />; })()}
                          {getFormMeta(selected.form_type).label}
                        </Badge>
                        <InboxTagsEditor messageId={selected.id} tags={selected.tags ?? []} />
                      </div>
                      {selected.subject && (
                        <div className="mt-3 text-base font-medium border-r-2 border-primary/40 pr-3">
                          {selected.subject}
                        </div>
                      )}
                    </div>

                    {/* Body: messages + side notes panel */}
                    <div className="flex-1 flex overflow-hidden">
                      <ScrollArea className="flex-1 p-4">
                        <div className="max-w-3xl mx-auto space-y-3">
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <Card className="border-r-4 border-r-primary/60 shadow-sm hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="w-7 h-7">
                                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{getInitials(selected.sender_name)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-sm">{selected.sender_name}</span>
                                    <Badge variant="secondary" className="text-[10px]">العميل</Badge>
                                  </div>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {new Date(selected.created_at).toLocaleString('ar-SA')}
                                  </span>
                                </div>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{selected.message}</p>
                                {Object.keys(selected.metadata ?? {}).length > 0 && (
                                  <details className="mt-3 text-xs">
                                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">بيانات إضافية من الفورم</summary>
                                    <pre className="mt-2 p-2 bg-muted rounded text-[10px] overflow-x-auto">
                                      {JSON.stringify(selected.metadata, null, 2)}
                                    </pre>
                                  </details>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>

                          {loadingReplies ? (
                            <div className="text-center py-6"><Loader2 className="w-5 h-5 animate-spin inline text-primary" /></div>
                          ) : (
                            <AnimatePresence>
                              {replies.map((r) => (
                                <motion.div key={r.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-start">
                                  <Card className="border-r-4 border-r-emerald-500/60 bg-emerald-500/5 shadow-sm w-full max-w-[95%] ms-auto">
                                    <CardContent className="p-4">
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                          <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                          </div>
                                          <span className="font-medium text-sm">{r.admin_name ?? r.admin_email ?? 'الإدارة'}</span>
                                          <Badge className="text-[10px] bg-emerald-500/15 text-emerald-700 border-0">رد إداري</Badge>
                                        </div>
                                        <span className="text-xs text-muted-foreground flex items-center gap-2">
                                          <Clock className="w-3 h-3" />
                                          {new Date(r.created_at).toLocaleString('ar-SA')}
                                          {r.delivery_status !== 'sent' && (<Badge variant="destructive" className="text-[10px]">{r.delivery_status}</Badge>)}
                                        </span>
                                      </div>
                                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{r.body}</p>
                                      {r.delivery_error && (
                                        <p className="text-xs text-destructive mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {r.delivery_error}</p>
                                      )}
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          )}
                          <div ref={scrollEndRef} />
                        </div>
                      </ScrollArea>

                      {/* Side notes panel (desktop only) */}
                      <aside className="hidden lg:block w-72 border-r bg-background/40 p-3 overflow-y-auto">
                        <InboxNotesPanel messageId={selected.id} />
                      </aside>
                    </div>

                    <Separator />
                    {/* Reply box */}
                    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-4 bg-background/90 backdrop-blur border-t">
                      <div className="max-w-3xl mx-auto space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          <Reply className="w-3.5 h-3.5" />
                          <span>الرد إلى:</span>
                          <Badge variant="secondary" className="font-mono text-[11px]">{selected.sender_email}</Badge>
                          <div className="ms-auto flex items-center gap-2">
                            <InboxTemplatesDialog onPick={(b) => { setReplyBody((prev) => prev ? `${prev}\n\n${b}` : b); replyRef.current?.focus(); }} />
                            <Select onValueChange={(v) => aiSuggest(v)}>
                              <SelectTrigger className="h-8 w-auto gap-1 text-xs">
                                {aiThinking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 text-violet-500" />}
                                <span>اقتراح AI</span>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="professional">احترافي</SelectItem>
                                <SelectItem value="friendly">ودّي</SelectItem>
                                <SelectItem value="formal">رسمي جداً</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Textarea
                          ref={replyRef}
                          rows={4}
                          value={replyBody}
                          onChange={(e) => setReplyBody(e.target.value)}
                          placeholder="اكتب ردك هنا... سيُرسل عبر البريد ويُحفظ في سجل المحادثة"
                          className="resize-none focus-visible:ring-primary/40"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSendReply();
                          }}
                        />
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> اضغط Ctrl+Enter للإرسال السريع · {replyBody.length} حرف
                          </span>
                          <Button onClick={handleSendReply} disabled={sending || !replyBody.trim()}
                            className="gap-2 bg-gradient-to-l from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/20 transition-all">
                            {sending ? (<><Loader2 className="w-4 h-4 animate-spin" /> جاري الإرسال...</>) : (<><Send className="w-4 h-4" /> إرسال الرد</>)}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      </TooltipProvider>
    </AdminLayout>
  );
};

export default AdminInbox;
