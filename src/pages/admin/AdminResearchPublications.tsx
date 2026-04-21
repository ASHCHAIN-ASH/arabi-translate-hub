import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Filter, MessageCircle, Send, Loader2, Award, FileText, Phone, Mail, User, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';

const STATUSES = [
  { value: 'new', label: 'جديد', color: 'bg-blue-500' },
  { value: 'under_review', label: 'قيد المراجعة', color: 'bg-amber-500' },
  { value: 'quoted', label: 'عرض سعر', color: 'bg-purple-500' },
  { value: 'approved', label: 'معتمد', color: 'bg-emerald-500' },
  { value: 'in_progress', label: 'قيد التنفيذ', color: 'bg-cyan-500' },
  { value: 'published', label: 'تم النشر', color: 'bg-green-600' },
  { value: 'rejected', label: 'مرفوض', color: 'bg-rose-500' },
];

export default function AdminResearchPublications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [editing, setEditing] = useState<any>({});

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

  const loadMessages = async (id: string) => {
    const { data } = await supabase
      .from('research_publication_messages')
      .select('*').eq('publication_id', id).order('created_at');
    setMessages(data || []);
  };

  const filtered = items.filter(i => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (search && !`${i.title} ${i.client_name} ${i.request_number} ${i.field}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = STATUSES.map(s => ({
    ...s, count: items.filter(i => i.status === s.value).length
  }));

  const updatePublication = async () => {
    if (!selected) return;
    const updates: any = {};
    if (editing.status && editing.status !== selected.status) updates.status = editing.status;
    if (editing.estimated_amount !== undefined) updates.estimated_amount = editing.estimated_amount || null;
    if (editing.final_amount !== undefined) updates.final_amount = editing.final_amount || null;
    if (editing.expected_delivery_date !== undefined) updates.expected_delivery_date = editing.expected_delivery_date || null;
    if (editing.admin_notes !== undefined) updates.admin_notes = editing.admin_notes;

    if (Object.keys(updates).length === 0) {
      toast({ title: 'لا تغييرات' });
      return;
    }
    const { error } = await supabase.from('research_publications').update(updates).eq('id', selected.id);
    if (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '✅ تم التحديث', description: 'سيتم إشعار العميل عبر واتساب' });
      load();
      setSelected({ ...selected, ...updates });
      setEditing({});
    }
  };

  const sendReply = async () => {
    if (!newMsg.trim() || !selected) return;
    const { error } = await supabase.from('research_publication_messages').insert({
      publication_id: selected.id,
      sender_id: user!.id,
      sender_type: 'admin',
      message: newMsg.trim(),
    });
    if (!error) {
      toast({ title: '✅ تم الإرسال', description: 'الرد سيصل العميل عبر واتساب' });
      setNewMsg('');
      loadMessages(selected.id);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-5" dir="rtl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600 text-white rounded-3xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black">إدارة نشر الأبحاث</h1>
                <p className="text-white/85 text-sm">إدارة طلبات النشر، عروض الأسعار، والردود التلقائية على العملاء</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black">{items.length}</div>
              <div className="text-xs">إجمالي الطلبات</div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {stats.map(s => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value === statusFilter ? 'all' : s.value)}
              className={`p-3 rounded-xl text-white text-center transition-all ${s.color} ${statusFilter === s.value ? 'ring-4 ring-offset-2 ring-indigo-400 scale-105' : 'opacity-90 hover:opacity-100'}`}
            >
              <div className="text-2xl font-black">{s.count}</div>
              <div className="text-[11px] font-bold">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-3 flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالعنوان، العميل، رقم الطلب..." className="pr-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </Card>

        {/* List */}
        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" /></div>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">لا توجد طلبات</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filtered.map(item => {
              const status = STATUSES.find(s => s.value === item.status);
              return (
                <Card
                  key={item.id}
                  className="p-4 hover:shadow-lg cursor-pointer hover:border-indigo-300 transition-all"
                  onClick={() => { setSelected(item); setEditing({}); loadMessages(item.id); }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="outline" className="font-mono text-xs">{item.request_number}</Badge>
                        <Badge className={`${status?.color} text-white border-0`}>{status?.label}</Badge>
                        <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString('ar-SA')}</span>
                      </div>
                      <h3 className="font-bold text-base line-clamp-1">{item.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{item.client_name}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{item.client_phone}</span>
                        <span>{item.field}</span>
                        {item.target_journal && <span>📚 {item.target_journal}</span>}
                      </div>
                    </div>
                    {item.estimated_amount && (
                      <div className="text-left">
                        <div className="text-lg font-black text-emerald-600">
                          {Number(item.estimated_amount).toLocaleString('ar-SA')} ر.س
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Detail */}
        <Dialog open={!!selected} onOpenChange={() => { setSelected(null); setEditing({}); }}>
          <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto" dir="rtl">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-black">{selected.title}</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {/* Right: details + edit */}
                  <div className="space-y-3">
                    <Card className="p-3 bg-muted/30">
                      <h4 className="font-bold mb-2 text-sm">معلومات العميل</h4>
                      <div className="space-y-1 text-sm">
                        <div><User className="w-3 h-3 inline ml-1" />{selected.client_name}</div>
                        <div><Phone className="w-3 h-3 inline ml-1" />{selected.client_phone}</div>
                        {selected.client_email && <div><Mail className="w-3 h-3 inline ml-1" />{selected.client_email}</div>}
                      </div>
                    </Card>
                    <Card className="p-3">
                      <h4 className="font-bold mb-2 text-sm">تفاصيل البحث</h4>
                      <div className="space-y-1 text-sm">
                        <div><b>التخصص:</b> {selected.field}</div>
                        <div><b>اللغة:</b> {selected.language}</div>
                        <div><b>نوع الخدمة:</b> {selected.service_type}</div>
                        {selected.target_journal && <div><b>المجلة:</b> {selected.target_journal}</div>}
                        {selected.journal_rank && <div><b>التصنيف:</b> {selected.journal_rank}</div>}
                        {selected.page_count && <div><b>الصفحات:</b> {selected.page_count}</div>}
                      </div>
                    </Card>
                    <Card className="p-3">
                      <div className="text-xs text-muted-foreground mb-1">الملخص:</div>
                      <p className="text-sm">{selected.abstract}</p>
                    </Card>
                    {selected.notes && (
                      <Card className="p-3 bg-amber-50">
                        <div className="text-xs text-amber-700 mb-1">ملاحظات العميل:</div>
                        <p className="text-sm">{selected.notes}</p>
                      </Card>
                    )}

                    <Card className="p-3 bg-indigo-50/50 border-indigo-200">
                      <h4 className="font-bold mb-3 text-sm flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-600" />
                        إدارة الطلب
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs">الحالة</Label>
                          <Select
                            value={editing.status ?? selected.status}
                            onValueChange={v => setEditing({ ...editing, status: v })}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">السعر المقترح</Label>
                            <Input
                              type="number"
                              defaultValue={selected.estimated_amount || ''}
                              onChange={e => setEditing({ ...editing, estimated_amount: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">السعر النهائي</Label>
                            <Input
                              type="number"
                              defaultValue={selected.final_amount || ''}
                              onChange={e => setEditing({ ...editing, final_amount: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">تاريخ التسليم المتوقع</Label>
                          <Input
                            type="date"
                            defaultValue={selected.expected_delivery_date || ''}
                            onChange={e => setEditing({ ...editing, expected_delivery_date: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">ملاحظات إدارية</Label>
                          <Textarea
                            rows={2}
                            defaultValue={selected.admin_notes || ''}
                            onChange={e => setEditing({ ...editing, admin_notes: e.target.value })}
                          />
                        </div>
                        <Button onClick={updatePublication} className="w-full bg-indigo-600 hover:bg-indigo-700">
                          💾 حفظ التحديثات (سيتم إشعار العميل)
                        </Button>
                      </div>
                    </Card>
                  </div>

                  {/* Left: chat */}
                  <div className="flex flex-col">
                    <h4 className="font-bold mb-2 text-sm flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-indigo-600" />
                      المحادثة (الرد سيُرسل عبر الواتساب فوراً)
                    </h4>
                    <div className="flex-1 bg-muted/20 rounded-xl p-3 max-h-[500px] overflow-y-auto space-y-2 mb-3 min-h-[300px]">
                      {messages.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">لا توجد رسائل بعد. ابدأ المحادثة 👇</p>
                      ) : messages.map(m => (
                        <div
                          key={m.id}
                          className={`flex ${m.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            m.sender_type === 'admin'
                              ? 'bg-indigo-600 text-white rounded-br-sm'
                              : 'bg-white border rounded-bl-sm'
                          }`}>
                            <div className="text-[10px] font-bold mb-1 opacity-70">
                              {m.sender_type === 'admin' ? '👨‍💼 الإدارة' : '👤 العميل'}
                            </div>
                            {m.message}
                            <div className={`text-[10px] mt-1 ${m.sender_type === 'admin' ? 'text-white/70' : 'text-muted-foreground'}`}>
                              {new Date(m.created_at).toLocaleString('ar-SA')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        value={newMsg}
                        onChange={e => setNewMsg(e.target.value)}
                        placeholder="اكتب ردك للعميل... سيصل عبر الواتساب فوراً 📲"
                        rows={2}
                      />
                      <Button onClick={sendReply} disabled={!newMsg.trim()} className="bg-indigo-600 hover:bg-indigo-700 self-end">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
