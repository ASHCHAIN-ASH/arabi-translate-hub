import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useClientData } from '@/hooks/useClientData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Plus, HelpCircle, MessageSquare, Clock, CheckCircle, 
  AlertCircle, RefreshCw, Send, FileText, Package
} from 'lucide-react';
import { motion } from 'framer-motion';

const ClientTickets = () => {
  const { user } = useAuth();
  const { tickets, loading, refresh } = useClientData(user?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', category: 'general', priority: 'medium' });
  const [linkedRef, setLinkedRef] = useState<{ type: 'invoice' | 'order'; id: string; number: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto-open dialog when arriving with ?new=1 and prefill linked invoice/order
  useEffect(() => {
    if (searchParams.get('new') !== '1') return;
    const invoiceId = searchParams.get('invoice_id');
    const invoiceNumber = searchParams.get('invoice_number') || '';
    const orderId = searchParams.get('order_id');
    const orderNumber = searchParams.get('order_number') || '';

    if (invoiceId) {
      setLinkedRef({ type: 'invoice', id: invoiceId, number: invoiceNumber });
      setNewTicket((p) => ({
        ...p,
        category: 'billing',
        title: `استفسار بخصوص الفاتورة ${invoiceNumber || `#${invoiceId.slice(0, 8)}`}`,
        description: `تذكرة دعم متعلقة بالفاتورة رقم: ${invoiceNumber || invoiceId}\n\n`,
      }));
    } else if (orderId) {
      setLinkedRef({ type: 'order', id: orderId, number: orderNumber });
      setNewTicket((p) => ({
        ...p,
        category: 'order',
        title: `استفسار بخصوص الطلب ${orderNumber || `#${orderId.slice(0, 8)}`}`,
        description: `تذكرة دعم متعلقة بالطلب رقم: ${orderNumber || orderId}\n\n`,
      }));
    }
    setIsOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearLinkedRef = () => {
    setLinkedRef(null);
    const next = new URLSearchParams(searchParams);
    ['new', 'invoice_id', 'invoice_number', 'order_id', 'order_number'].forEach((k) => next.delete(k));
    setSearchParams(next, { replace: true });
  };

  const handleCreateTicket = async () => {
    if (!newTicket.title.trim() || !user?.id) return;
    setSubmitting(true);
    try {
      const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;
      const { error } = await supabase.from('tickets').insert({
        user_id: user.id,
        ticket_number: ticketNumber,
        title: newTicket.title,
        description: newTicket.description,
        category: newTicket.category,
        priority: newTicket.priority,
        status: 'open'
      } as any);
      if (error) throw error;
      toast.success('تم إنشاء التذكرة بنجاح');
      setIsOpen(false);
      setNewTicket({ title: '', description: '', category: 'general', priority: 'medium' });
      refresh();
    } catch (err) {
      console.error(err);
      toast.error('فشل في إنشاء التذكرة');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'مفتوح': return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'قيد المعالجة': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'محلول': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مفتوح': return 'bg-blue-100 text-blue-700';
      case 'قيد المعالجة': return 'bg-yellow-100 text-yellow-700';
      case 'محلول': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-4 lg:p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">الدعم الفني</h1>
            <p className="text-muted-foreground">إدارة تذاكر الدعم والتواصل مع فريقنا</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                تذكرة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle>إنشاء تذكرة دعم جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="عنوان التذكرة"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                />
                <Textarea
                  placeholder="وصف المشكلة..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  rows={4}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Select value={newTicket.category} onValueChange={(v) => setNewTicket({ ...newTicket, category: v })}>
                    <SelectTrigger><SelectValue placeholder="التصنيف" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">عام</SelectItem>
                      <SelectItem value="technical">تقني</SelectItem>
                      <SelectItem value="billing">فوترة</SelectItem>
                      <SelectItem value="order">طلبات</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newTicket.priority} onValueChange={(v) => setNewTicket({ ...newTicket, priority: v })}>
                    <SelectTrigger><SelectValue placeholder="الأولوية" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">منخفضة</SelectItem>
                      <SelectItem value="medium">متوسطة</SelectItem>
                      <SelectItem value="high">عالية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateTicket} disabled={submitting || !newTicket.title.trim()} className="w-full">
                  <Send className="w-4 h-4 ml-2" />
                  {submitting ? 'جاري الإرسال...' : 'إرسال التذكرة'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{tickets.filter(t => t.status === 'مفتوح').length}</p>
              <p className="text-sm text-muted-foreground">مفتوحة</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-yellow-600">{tickets.filter(t => t.status === 'قيد المعالجة').length}</p>
              <p className="text-sm text-muted-foreground">قيد المعالجة</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{tickets.filter(t => t.status === 'محلول').length}</p>
              <p className="text-sm text-muted-foreground">محلولة</p>
            </CardContent>
          </Card>
        </div>

        {/* Tickets List */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              تذاكر الدعم
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">لا توجد تذاكر</p>
                <p className="text-muted-foreground mb-4">أنشئ تذكرة جديدة للتواصل مع فريق الدعم</p>
                <Button onClick={() => setIsOpen(true)}>
                  <Plus className="w-4 h-4 ml-2" />
                  تذكرة جديدة
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getStatusIcon(ticket.status)}
                            <div>
                              <h3 className="font-semibold">{ticket.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">{ticket.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-muted-foreground">#{ticket.ticketNumber}</span>
                                <span className="text-xs text-muted-foreground">• {ticket.createdAt}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default ClientTickets;
