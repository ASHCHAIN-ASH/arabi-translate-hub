import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Mail, Phone, Building2, Calendar, Copy, MessageSquare,
  MessageCircle, Send, Bell, ShoppingCart, FileText, Edit, Key, Ban,
  CheckCircle, Trash2, Loader2, User, Activity, DollarSign, Clock,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { Customer } from '@/hooks/useCustomers';

interface OrderRow {
  id: string;
  tracking_id: string;
  service_name: string | null;
  current_status: string | null;
  total_amount: number | null;
  created_at: string;
}

interface InvoiceRow {
  id: string;
  invoice_number: string;
  total_amount: number | null;
  paid_amount: number | null;
  status: string | null;
  created_at: string;
}

interface ConversationRow {
  id: string;
  subject: string;
  status: string;
  last_message: string | null;
  last_message_at: string | null;
}

const AdminCustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [conversations, setConversations] = useState<ConversationRow[]>([]);

  // Dialogs
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState('');
  const [notifyTitle, setNotifyTitle] = useState('رسالة من الإدارة');
  const [sending, setSending] = useState(false);

  const loadCustomer = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const { data, error } = await supabase.from('customers').select('*').eq('id', id).maybeSingle();
    if (error || !data) {
      toast.error('تعذر تحميل بيانات العميل');
      setLoading(false);
      return;
    }
    setCustomer(data as Customer);
    setLoading(false);
  }, [id]);

  const loadRelated = useCallback(async (userId: string | undefined, customerId: string) => {
    // Orders & invoices: link to customer via user_id (preferred) or customer_id
    const ordersQ = supabase
      .from('service_orders')
      .select('id, tracking_id, service_name, current_status, total_amount, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    const invoicesQ = supabase
      .from('invoices')
      .select('id, invoice_number, total_amount, paid_amount, status, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    if (userId) {
      ordersQ.or(`user_id.eq.${userId},customer_id.eq.${customerId}`);
      invoicesQ.or(`user_id.eq.${userId},customer_id.eq.${customerId}`);
    } else {
      ordersQ.eq('customer_id', customerId);
      invoicesQ.eq('customer_id', customerId);
    }

    const [{ data: o }, { data: i }] = await Promise.all([ordersQ, invoicesQ]);
    setOrders((o || []) as OrderRow[]);
    setInvoices((i || []) as InvoiceRow[]);

    if (userId) {
      const { data: c } = await supabase
        .from('chat_conversations')
        .select('id, subject, status, last_message, last_message_at')
        .eq('user_id', userId)
        .order('last_message_at', { ascending: false })
        .limit(20);
      setConversations((c || []) as ConversationRow[]);
    }
  }, []);

  useEffect(() => { loadCustomer(); }, [loadCustomer]);
  useEffect(() => {
    if (customer) loadRelated(customer.user_id, customer.id);
  }, [customer, loadRelated]);

  // ===== Actions =====
  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`تم نسخ ${label}`);
    } catch { toast.error('تعذر النسخ'); }
  };

  const openWhatsApp = () => {
    if (!customer?.phone) return toast.error('لا يوجد رقم هاتف');
    const cleaned = customer.phone.replace(/[^\d+]/g, '').replace(/^\+/, '');
    window.open(`https://wa.me/${cleaned}`, '_blank');
  };

  const openEmail = () => {
    if (!customer?.email) return toast.error('لا يوجد بريد إلكتروني');
    window.open(`mailto:${customer.email}`, '_blank');
  };

  const startChat = async () => {
    if (!customer?.user_id) return toast.error('هذا العميل بدون حساب مستخدم');
    try {
      const { data: { user: adminUser } } = await supabase.auth.getUser();
      if (!adminUser) return toast.error('يجب تسجيل الدخول');

      const { data: existing } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('user_id', customer.user_id)
        .eq('status', 'open')
        .order('last_message_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        toast.success('فتح المحادثة الحالية');
        navigate('/adminmaster/chat');
        return;
      }

      const { data: conv, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: customer.user_id,
          admin_id: adminUser.id,
          subject: `محادثة مع ${customer.name}`,
          last_message: 'بدأت الإدارة هذه المحادثة',
          last_message_at: new Date().toISOString(),
          status: 'open',
        })
        .select().single();
      if (error || !conv) throw error || new Error('فشل');

      await supabase.from('chat_messages').insert({
        conversation_id: conv.id,
        sender_id: adminUser.id,
        sender_type: 'admin',
        content: `مرحباً ${customer.name}، كيف يمكننا مساعدتك؟`,
      });
      toast.success('تم بدء المحادثة');
      navigate('/adminmaster/chat');
    } catch (e: any) {
      toast.error(e?.message || 'تعذر بدء المحادثة');
    }
  };

  const sendNotification = async () => {
    if (!customer?.user_id) return toast.error('هذا العميل بدون حساب');
    if (!notifyMessage.trim()) return toast.error('اكتب الرسالة');
    setSending(true);
    const { error } = await supabase.from('user_notifications').insert({
      user_id: customer.user_id,
      title: notifyTitle.trim() || 'رسالة من الإدارة',
      message: notifyMessage.trim(),
      type: 'admin',
      link: '/client/dashboard',
    });
    setSending(false);
    if (error) { toast.error(error.message); return; }
    toast.success('تم إرسال الإشعار');
    setNotifyOpen(false);
    setNotifyMessage('');
  };

  const toggleStatus = async () => {
    if (!customer) return;
    const next = customer.status === 'active' ? 'blocked' : 'active';
    if (!confirm(`هل تريد ${next === 'blocked' ? 'حظر' : 'تفعيل'} ${customer.name}؟`)) return;
    const { error } = await supabase.from('customers').update({ status: next }).eq('id', customer.id);
    if (error) return toast.error(error.message);
    setCustomer({ ...customer, status: next });
    toast.success('تم التحديث');
  };

  const deleteCustomer = async () => {
    if (!customer) return;
    if (!confirm(`حذف ${customer.name} نهائياً؟`)) return;
    const { error } = await supabase.from('customers').delete().eq('id', customer.id);
    if (error) return toast.error(error.message);
    toast.success('تم الحذف');
    navigate('/adminmaster/customers');
  };

  // ===== Stats =====
  const totalRevenue = invoices.reduce((s, i) => s + Number(i.paid_amount || 0), 0);
  const openOrders = orders.filter(o => !['paid', 'completed', 'cancelled'].includes(o.current_status || '')).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!customer) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">العميل غير موجود</p>
          <Button onClick={() => navigate('/adminmaster/customers')}>العودة</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/adminmaster/customers')}>
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <p className="text-sm text-muted-foreground">تفاصيل العميل وكافة الإجراءات</p>
          </div>
          <Badge className={customer.status === 'active'
            ? 'bg-success/10 text-success border-success/20'
            : 'bg-destructive/10 text-destructive border-destructive/20'}>
            {customer.status === 'active' ? 'نشط' : customer.status === 'blocked' ? 'محظور' : customer.status}
          </Badge>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg"><ShoppingCart className="w-5 h-5 text-primary" /></div>
              <div>
                <div className="text-2xl font-bold">{orders.length}</div>
                <div className="text-xs text-muted-foreground">إجمالي الطلبات</div>
              </div>
            </div>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg"><Activity className="w-5 h-5 text-amber-600" /></div>
              <div>
                <div className="text-2xl font-bold">{openOrders}</div>
                <div className="text-xs text-muted-foreground">طلبات مفتوحة</div>
              </div>
            </div>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg"><DollarSign className="w-5 h-5 text-emerald-600" /></div>
              <div>
                <div className="text-2xl font-bold">{totalRevenue.toLocaleString('ar')}</div>
                <div className="text-xs text-muted-foreground">إجمالي المدفوع (ر.س)</div>
              </div>
            </div>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg"><MessageSquare className="w-5 h-5 text-blue-600" /></div>
              <div>
                <div className="text-2xl font-bold">{conversations.length}</div>
                <div className="text-xs text-muted-foreground">المحادثات</div>
              </div>
            </div>
          </CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle className="text-base">معلومات العميل</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow icon={<User className="w-4 h-4" />} label="الاسم" value={customer.name} />
              <InfoRow icon={<Mail className="w-4 h-4" />} label="البريد" value={customer.email || '—'}
                onCopy={customer.email ? () => copyText(customer.email!, 'البريد') : undefined} />
              <InfoRow icon={<Phone className="w-4 h-4" />} label="الهاتف" value={customer.phone || '—'}
                onCopy={customer.phone ? () => copyText(customer.phone!, 'الهاتف') : undefined} />
              {customer.company && <InfoRow icon={<Building2 className="w-4 h-4" />} label="الشركة" value={customer.company} />}
              <InfoRow icon={<Calendar className="w-4 h-4" />} label="تاريخ التسجيل"
                value={new Date(customer.created_at).toLocaleDateString('ar-SA')} />
              {customer.notes && (
                <div className="pt-3 border-t">
                  <div className="text-xs text-muted-foreground mb-1">ملاحظات</div>
                  <div className="text-xs bg-muted/40 p-2 rounded">{customer.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">الإجراءات السريعة</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActionGroup title="تواصل سريع">
                  <ActionBtn icon={MessageSquare} label="بدء محادثة داخلية" onClick={startChat} color="text-primary" />
                  <ActionBtn icon={Bell} label="إرسال إشعار" onClick={() => setNotifyOpen(true)} color="text-amber-600" />
                  <ActionBtn icon={MessageCircle} label="واتساب" onClick={openWhatsApp} color="text-emerald-600" />
                  <ActionBtn icon={Send} label="بريد إلكتروني" onClick={() => navigate(`/adminmaster/customers/${customer.id}/email`)} color="text-blue-600" />
                </ActionGroup>

                <ActionGroup title="إدارة الحساب">
                  <ActionBtn icon={Edit} label="تعديل البيانات" onClick={() => toast.info('قريباً من قائمة العملاء')} color="text-foreground" />
                  <ActionBtn icon={Key} label="تغيير كلمة المرور" onClick={() => toast.info('قريباً من قائمة العملاء')} color="text-foreground" />
                  <ActionBtn
                    icon={customer.status === 'active' ? Ban : CheckCircle}
                    label={customer.status === 'active' ? 'حظر العميل' : 'تفعيل العميل'}
                    onClick={toggleStatus}
                    color={customer.status === 'active' ? 'text-destructive' : 'text-success'}
                  />
                  <ActionBtn icon={Trash2} label="حذف العميل" onClick={deleteCustomer} color="text-destructive" />
                </ActionGroup>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList>
            <TabsTrigger value="orders" className="gap-2"><ShoppingCart className="w-4 h-4" />الطلبات ({orders.length})</TabsTrigger>
            <TabsTrigger value="invoices" className="gap-2"><FileText className="w-4 h-4" />الفواتير ({invoices.length})</TabsTrigger>
            <TabsTrigger value="chats" className="gap-2"><MessageSquare className="w-4 h-4" />المحادثات ({conversations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card><CardContent className="p-0">
              {orders.length === 0 ? <Empty msg="لا توجد طلبات" /> : (
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>رقم التتبع</TableHead><TableHead>الخدمة</TableHead>
                    <TableHead>الحالة</TableHead><TableHead>المبلغ</TableHead>
                    <TableHead>التاريخ</TableHead><TableHead></TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {orders.map(o => (
                      <TableRow key={o.id} className="cursor-pointer hover:bg-muted/30"
                        onClick={() => navigate(`/adminmaster/service-orders/${o.id}`)}>
                        <TableCell className="font-mono text-xs">{o.tracking_id}</TableCell>
                        <TableCell>{o.service_name || '—'}</TableCell>
                        <TableCell><Badge variant="outline">{o.current_status || '—'}</Badge></TableCell>
                        <TableCell>{o.total_amount?.toLocaleString('ar') || '—'}</TableCell>
                        <TableCell className="text-xs">{new Date(o.created_at).toLocaleDateString('ar-SA')}</TableCell>
                        <TableCell><Button variant="ghost" size="sm">عرض</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card><CardContent className="p-0">
              {invoices.length === 0 ? <Empty msg="لا توجد فواتير" /> : (
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>رقم الفاتورة</TableHead><TableHead>الإجمالي</TableHead>
                    <TableHead>المدفوع</TableHead><TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead><TableHead></TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {invoices.map(i => (
                      <TableRow key={i.id} className="cursor-pointer hover:bg-muted/30"
                        onClick={() => navigate(`/adminmaster/invoices/${i.id}`)}>
                        <TableCell className="font-mono text-xs">{i.invoice_number}</TableCell>
                        <TableCell>{i.total_amount?.toLocaleString('ar') || '—'}</TableCell>
                        <TableCell>{i.paid_amount?.toLocaleString('ar') || '0'}</TableCell>
                        <TableCell><Badge variant="outline">{i.status || '—'}</Badge></TableCell>
                        <TableCell className="text-xs">{new Date(i.created_at).toLocaleDateString('ar-SA')}</TableCell>
                        <TableCell><Button variant="ghost" size="sm">عرض</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="chats">
            <Card><CardContent className="p-0">
              {conversations.length === 0 ? <Empty msg="لا توجد محادثات" /> : (
                <div className="divide-y">
                  {conversations.map(c => (
                    <button key={c.id} onClick={() => navigate('/adminmaster/chat')}
                      className="w-full text-right p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{c.subject}</span>
                        <Badge variant={c.status === 'open' ? 'default' : 'secondary'} className="text-[10px]">
                          {c.status === 'open' ? 'مفتوحة' : 'مغلقة'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{c.last_message || 'لا توجد رسائل'}</p>
                      {c.last_message_at && (
                        <p className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{new Date(c.last_message_at).toLocaleString('ar-SA')}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Notification Dialog */}
      <Dialog open={notifyOpen} onOpenChange={setNotifyOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>إرسال إشعار للعميل</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>عنوان الإشعار</Label>
              <Input value={notifyTitle} onChange={e => setNotifyTitle(e.target.value)} />
            </div>
            <div>
              <Label>الرسالة</Label>
              <Textarea rows={4} value={notifyMessage} onChange={e => setNotifyMessage(e.target.value)}
                placeholder="اكتب الرسالة هنا..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotifyOpen(false)}>إلغاء</Button>
            <Button onClick={sendNotification} disabled={sending}>
              {sending && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
              إرسال
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string; onCopy?: () => void }> =
  ({ icon, label, value, onCopy }) => (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="text-xs">{label}</span></div>
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">{value}</span>
        {onCopy && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onCopy}><Copy className="w-3 h-3" /></Button>}
      </div>
    </div>
  );

const ActionGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <div className="text-xs font-semibold text-muted-foreground mb-2">{title}</div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">{children}</div>
  </div>
);

const ActionBtn: React.FC<{ icon: any; label: string; onClick: () => void; color: string }> =
  ({ icon: Icon, label, onClick, color }) => (
    <Button variant="outline" onClick={onClick}
      className="h-auto py-3 flex-col gap-1.5 hover:bg-muted/50 hover:scale-[1.02] transition-all">
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );

const Empty: React.FC<{ msg: string }> = ({ msg }) => (
  <div className="text-center py-12 text-sm text-muted-foreground">{msg}</div>
);

export default AdminCustomerDetails;
