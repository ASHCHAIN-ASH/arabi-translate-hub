import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/data/legacy/client';
import { useToast } from '@/hooks/use-toast';

const GroupOrderNew: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    service_id: '', title: '', description: '', max_members: 4, deadline: '',
  });

  useEffect(() => {
    (supabase as any).from('services')
      .select('id, name, name_ar, group_seat_price, price, group_max_members, group_min_members')
      .eq('is_group_eligible', true).eq('is_active', true)
      .then(({ data }: any) => setServices(data || []));
  }, []);

  const selectedSvc = services.find(s => s.id === form.service_id);

  const submit = async () => {
    if (!form.service_id || !form.title.trim()) {
      toast({ title: 'املأ الحقول الأساسية', variant: 'destructive' }); return;
    }
    setLoading(true);
    const { data, error } = await (supabase as any).rpc('create_group_order', {
      _service_id: form.service_id,
      _title: form.title,
      _description: form.description || null,
      _max_members: form.max_members,
      _deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    });
    setLoading(false);
    if (error) {
      toast({ title: 'تعذّر الإنشاء', description: error.message, variant: 'destructive' }); return;
    }
    toast({ title: '🎉 تم إنشاء الطلب الجماعي' });
    navigate(`/group-orders/${data}`);
  };

  return (
    <ClientLayout>
      <div className="p-3 sm:p-5 max-w-3xl mx-auto" dir="rtl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-5 sm:p-7 border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black">طلب جماعي جديد</h1>
                <p className="text-xs text-muted-foreground">شارك التكلفة مع زملائك</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>الخدمة *</Label>
                <Select value={form.service_id} onValueChange={(v) => setForm(f => ({ ...f, service_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="اختر خدمة مؤهلة للطلب الجماعي" /></SelectTrigger>
                  <SelectContent>
                    {services.length === 0 && <div className="p-3 text-xs text-muted-foreground">لا توجد خدمات مؤهلة حالياً</div>}
                    {services.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name_ar || s.name} — {Number(s.group_seat_price || s.price).toLocaleString('ar-SA')} ر.س/مقعد
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>عنوان الطلب *</Label>
                <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="مثلاً: مجموعة دفعة 2024 — دورة الإحصاء" />
              </div>

              <div>
                <Label>وصف (اختياري)</Label>
                <Textarea rows={3} value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>عدد المقاعد *</Label>
                  <Input type="number" min={2} max={selectedSvc?.group_max_members || 10}
                    value={form.max_members}
                    onChange={(e) => setForm(f => ({ ...f, max_members: Number(e.target.value) }))} />
                  {selectedSvc && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      من {selectedSvc.group_min_members} إلى {selectedSvc.group_max_members} مقعد
                    </p>
                  )}
                </div>
                <div>
                  <Label>مهلة الانضمام (اختياري)</Label>
                  <Input type="datetime-local" value={form.deadline}
                    onChange={(e) => setForm(f => ({ ...f, deadline: e.target.value }))} />
                </div>
              </div>

              {selectedSvc && (
                <div className="rounded-xl bg-muted/50 p-4 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">سعر المقعد:</span>
                    <span className="font-bold">{Number(selectedSvc.group_seat_price || selectedSvc.price).toLocaleString('ar-SA')} ر.س</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">إجمالي تقريبي عند الاكتمال:</span>
                    <span className="font-bold text-primary">
                      {(Number(selectedSvc.group_seat_price || selectedSvc.price) * form.max_members).toLocaleString('ar-SA')} ر.س
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button onClick={submit} disabled={loading} className="flex-1">
                  {loading ? 'جاري...' : 'إنشاء الطلب'} <ArrowRight className="w-4 h-4 mr-1" />
                </Button>
                <Button variant="outline" onClick={() => navigate('/group-orders')}>إلغاء</Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </ClientLayout>
  );
};

export default GroupOrderNew;
