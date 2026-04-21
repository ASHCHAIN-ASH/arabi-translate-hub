import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, FileText, Clock, CheckCircle2, XCircle, MessageCircle, Sparkles, Award, Globe, Send, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import ClientLayout from '@/components/client/ClientLayout';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  new: { label: 'جديد', color: 'bg-blue-500/10 text-blue-700 border-blue-300', icon: Sparkles },
  under_review: { label: 'قيد المراجعة', color: 'bg-amber-500/10 text-amber-700 border-amber-300', icon: Clock },
  quoted: { label: 'عرض سعر', color: 'bg-purple-500/10 text-purple-700 border-purple-300', icon: FileText },
  approved: { label: 'معتمد', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300', icon: CheckCircle2 },
  in_progress: { label: 'قيد التنفيذ', color: 'bg-cyan-500/10 text-cyan-700 border-cyan-300', icon: Loader2 },
  published: { label: 'تم النشر', color: 'bg-green-600/10 text-green-700 border-green-400', icon: Award },
  rejected: { label: 'مرفوض', color: 'bg-rose-500/10 text-rose-700 border-rose-300', icon: XCircle },
};

const FIELDS = [
  'الطب والصحة','الهندسة','علوم الحاسب','إدارة الأعمال','الاقتصاد','القانون',
  'التربية والتعليم','علم النفس','علم الاجتماع','اللغات والأدب','الفنون','العلوم الشرعية',
  'الفيزياء','الكيمياء','الأحياء','الرياضيات','الجغرافيا','التاريخ','أخرى'
];

const SERVICE_TYPES = [
  { value: 'publication', label: '📤 نشر في مجلة علمية', desc: 'نشر بحثك في مجلات محكّمة' },
  { value: 'translation_publication', label: '🌐 ترجمة + نشر', desc: 'ترجمة احترافية ثم النشر' },
  { value: 'review_publication', label: '🔍 مراجعة + نشر', desc: 'مراجعة لغوية ومنهجية ثم النشر' },
  { value: 'full_service', label: '⭐ خدمة شاملة', desc: 'إعداد وكتابة ومراجعة ونشر' },
];

const JOURNAL_RANKS = ['Scopus Q1','Scopus Q2','Scopus Q3','Scopus Q4','ISI / Web of Science','Arcif','مجلة محكّمة محلية','أخرى'];

export default function ResearchPublication() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({
    title: '', field: '', language: 'ar', service_type: 'publication',
    target_journal: '', journal_rank: '', abstract: '', keywords: '',
    authors: '', page_count: '', notes: '',
    client_name: user?.user_metadata?.full_name || '',
    client_phone: user?.user_metadata?.phone || '',
    client_email: user?.email || '',
  });

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from('research_publications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  const loadMessages = async (pubId: string) => {
    const { data } = await supabase
      .from('research_publication_messages')
      .select('*')
      .eq('publication_id', pubId)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const submit = async () => {
    if (!form.title || !form.field || !form.abstract || !form.client_name || !form.client_phone) {
      toast({ title: 'بيانات ناقصة', description: 'يرجى تعبئة الحقول الإلزامية', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('research_publications').insert({
      user_id: user!.id,
      title: form.title,
      field: form.field,
      language: form.language,
      service_type: form.service_type,
      target_journal: form.target_journal || null,
      journal_rank: form.journal_rank || null,
      abstract: form.abstract,
      keywords: form.keywords || null,
      authors: form.authors || null,
      page_count: form.page_count ? parseInt(form.page_count) : null,
      notes: form.notes || null,
      client_name: form.client_name,
      client_phone: form.client_phone,
      client_email: form.client_email || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '✅ تم الإرسال', description: 'سيتم التواصل معك عبر واتساب قريباً' });
      setOpen(false);
      setForm({ ...form, title: '', abstract: '', target_journal: '', notes: '', keywords: '', authors: '', page_count: '' });
      load();
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !selected) return;
    setSending(true);
    const { error } = await supabase.from('research_publication_messages').insert({
      publication_id: selected.id,
      sender_id: user!.id,
      sender_type: 'client',
      message: newMsg.trim(),
    });
    setSending(false);
    if (!error) {
      setNewMsg('');
      loadMessages(selected.id);
    }
  };

  return (
    <ClientLayout>
      <div className="p-3 sm:p-5 lg:p-6 space-y-6" dir="rtl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-10 text-white"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
            transition={{ duration: 18, repeat: Infinity }}
            className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl"
          />
          <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 180 }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center ring-2 ring-white/40 shadow-2xl"
              >
                <BookOpen className="w-9 h-9" />
              </motion.div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold mb-2 ring-1 ring-white/30">
                  <Sparkles className="w-3 h-3" />
                  خدمة احترافية
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight">نشر الأبحاث العلمية</h1>
                <p className="text-white/85 text-sm sm:text-base mt-1 font-medium max-w-xl">
                  انشر بحثك في مجلات Scopus و ISI المحكّمة — فريق خبراء، متابعة كاملة، وردود فورية عبر واتساب 📲
                </p>
              </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-white/90 font-bold rounded-xl shadow-2xl">
                  <Plus className="w-5 h-5 ml-2" />
                  طلب نشر جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                    طلب نشر بحث جديد
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>عنوان البحث *</Label>
                    <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثال: أثر الذكاء الاصطناعي على..." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>التخصص *</Label>
                      <Select value={form.field} onValueChange={v => setForm({ ...form, field: v })}>
                        <SelectTrigger><SelectValue placeholder="اختر التخصص" /></SelectTrigger>
                        <SelectContent>{FIELDS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>اللغة</Label>
                      <Select value={form.language} onValueChange={v => setForm({ ...form, language: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ar">العربية</SelectItem>
                          <SelectItem value="en">الإنجليزية</SelectItem>
                          <SelectItem value="both">ثنائي اللغة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>نوع الخدمة *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {SERVICE_TYPES.map(s => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => setForm({ ...form, service_type: s.value })}
                          className={`text-right p-3 rounded-xl border-2 transition-all ${form.service_type === s.value ? 'border-indigo-500 bg-indigo-50' : 'border-border hover:border-indigo-300'}`}
                        >
                          <div className="font-bold text-sm">{s.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>المجلة المستهدفة</Label>
                      <Input value={form.target_journal} onChange={e => setForm({ ...form, target_journal: e.target.value })} placeholder="اسم المجلة (اختياري)" />
                    </div>
                    <div>
                      <Label>تصنيف المجلة</Label>
                      <Select value={form.journal_rank} onValueChange={v => setForm({ ...form, journal_rank: v })}>
                        <SelectTrigger><SelectValue placeholder="اختر التصنيف" /></SelectTrigger>
                        <SelectContent>{JOURNAL_RANKS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>ملخص البحث (Abstract) *</Label>
                    <Textarea rows={4} value={form.abstract} onChange={e => setForm({ ...form, abstract: e.target.value })} placeholder="اكتب ملخصاً واضحاً لبحثك..." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>الكلمات المفتاحية</Label>
                      <Input value={form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value })} placeholder="مفصولة بفواصل" />
                    </div>
                    <div>
                      <Label>عدد الصفحات</Label>
                      <Input type="number" value={form.page_count} onChange={e => setForm({ ...form, page_count: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>أسماء الباحثين</Label>
                    <Input value={form.authors} onChange={e => setForm({ ...form, authors: e.target.value })} placeholder="مثال: د. أحمد، د. فاطمة" />
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-bold mb-3">📞 بيانات التواصل</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>الاسم *</Label>
                        <Input value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} />
                      </div>
                      <div>
                        <Label>رقم الواتساب *</Label>
                        <Input value={form.client_phone} onChange={e => setForm({ ...form, client_phone: e.target.value })} placeholder="9665XXXXXXXX" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label>البريد الإلكتروني</Label>
                      <Input type="email" value={form.client_email} onChange={e => setForm({ ...form, client_email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>ملاحظات إضافية</Label>
                    <Textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                  </div>
                  <Button onClick={submit} disabled={submitting} className="w-full h-12 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold rounded-xl">
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5 ml-2" />إرسال الطلب</>}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Award, label: 'مجلات Scopus', color: 'from-amber-500 to-orange-500' },
            { icon: Globe, label: 'دعم 4 لغات', color: 'from-cyan-500 to-blue-500' },
            { icon: Clock, label: 'نشر سريع', color: 'from-emerald-500 to-green-500' },
            { icon: MessageCircle, label: 'متابعة واتساب', color: 'from-violet-500 to-purple-500' },
          ].map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${f.color} text-white rounded-2xl p-4 flex flex-col items-center text-center shadow-lg`}
            >
              <f.icon className="w-7 h-7 mb-2" />
              <span className="text-sm font-bold">{f.label}</span>
            </motion.div>
          ))}
        </div>

        {/* My requests */}
        <div>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            طلباتي ({items.length})
          </h2>

          {loading ? (
            <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" /></div>
          ) : items.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground mb-4">لا توجد طلبات بعد. ابدأ أول طلب نشر الآن!</p>
              <Button onClick={() => setOpen(true)} className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white">
                <Plus className="w-4 h-4 ml-2" /> طلب نشر جديد
              </Button>
            </Card>
          ) : (
            <div className="grid gap-3">
              {items.map((item, i) => {
                const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card
                      className="p-4 hover:shadow-lg transition-all cursor-pointer hover:border-indigo-300 group"
                      onClick={() => { setSelected(item); loadMessages(item.id); }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs font-mono">{item.request_number}</Badge>
                            <Badge className={`${cfg.color} border`}>
                              <Icon className="w-3 h-3 ml-1" />{cfg.label}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-base line-clamp-1">{item.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.field} • {SERVICE_TYPES.find(s => s.value === item.service_type)?.label || item.service_type}
                          </p>
                          {item.estimated_amount && (
                            <p className="text-sm font-bold text-emerald-600 mt-2">
                              💰 {Number(item.estimated_amount).toLocaleString('ar-SA')} ر.س
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-indigo-600 group-hover:-translate-x-1 transition-all" />
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Details + chat */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-black">{selected.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="font-mono">{selected.request_number}</Badge>
                    <Badge className={STATUS_CONFIG[selected.status]?.color}>
                      {STATUS_CONFIG[selected.status]?.label}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">التخصص:</span> <b>{selected.field}</b></div>
                    <div><span className="text-muted-foreground">اللغة:</span> <b>{selected.language === 'ar' ? 'العربية' : selected.language === 'en' ? 'الإنجليزية' : 'ثنائية'}</b></div>
                    {selected.target_journal && <div><span className="text-muted-foreground">المجلة:</span> <b>{selected.target_journal}</b></div>}
                    {selected.journal_rank && <div><span className="text-muted-foreground">التصنيف:</span> <b>{selected.journal_rank}</b></div>}
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3">
                    <div className="text-xs text-muted-foreground mb-1">الملخص:</div>
                    <p className="text-sm">{selected.abstract}</p>
                  </div>

                  {/* محادثة */}
                  <div className="border-t pt-4">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-indigo-600" />
                      المحادثة مع الإدارة
                    </h3>
                    <div className="bg-muted/30 rounded-xl p-3 max-h-64 overflow-y-auto space-y-2 mb-3">
                      <AnimatePresence>
                        {messages.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">لا توجد رسائل بعد</p>
                        ) : messages.map(m => (
                          <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${m.sender_type === 'client' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                              m.sender_type === 'client'
                                ? 'bg-indigo-600 text-white rounded-br-sm'
                                : 'bg-white border rounded-bl-sm'
                            }`}>
                              {m.message}
                              <div className={`text-[10px] mt-1 ${m.sender_type === 'client' ? 'text-white/70' : 'text-muted-foreground'}`}>
                                {new Date(m.created_at).toLocaleString('ar-SA')}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newMsg}
                        onChange={e => setNewMsg(e.target.value)}
                        placeholder="اكتب رسالتك..."
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                      />
                      <Button onClick={sendMessage} disabled={sending || !newMsg.trim()} className="bg-indigo-600 hover:bg-indigo-700">
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ClientLayout>
  );
}
