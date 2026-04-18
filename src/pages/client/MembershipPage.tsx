import { useState } from 'react';
import ClientLayout from '@/components/client/ClientLayout';
import { useMembershipPlans, useUserMembership, MembershipPlan } from '@/hooks/useMembership';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MembershipBadge } from '@/components/membership/MembershipBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Crown, Check, Wallet, Receipt, Sparkles, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function MembershipPage() {
  const { user } = useAuth();
  const { plans, loading } = useMembershipPlans();
  const { membership, reload } = useUserMembership();
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'invoice'>('wallet');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async () => {
    if (!selectedPlan || !user) return;
    setSubmitting(true);
    try {
      // Check wallet balance if wallet payment
      if (paymentMethod === 'wallet') {
        const { data: wallet } = await supabase.from('wallets').select('balance').eq('user_id', user.id).maybeSingle();
        if (!wallet || Number(wallet.balance) < selectedPlan.price) {
          toast.error('رصيد المحفظة غير كافٍ. يرجى شحن المحفظة أو اختيار الدفع بالفاتورة');
          setSubmitting(false);
          return;
        }
      }

      const { error } = await supabase.from('user_memberships' as any).insert({
        user_id: user.id,
        plan_id: selectedPlan.id,
        status: 'pending',
        payment_method: paymentMethod,
        amount_paid: 0,
      });
      if (error) throw error;

      toast.success('تم إرسال طلب الاشتراك بنجاح. ستصلك إشعارات عند المراجعة.');
      setSelectedPlan(null);
      reload();
    } catch (e: any) {
      toast.error(e.message || 'حدث خطأ');
    } finally {
      setSubmitting(false);
    }
  };

  const planStyles: Record<string, { bg: string; ring: string; icon: any }> = {
    silver: { bg: 'from-slate-100 to-slate-200', ring: 'ring-slate-300', icon: Sparkles },
    gold: { bg: 'from-amber-50 to-amber-100', ring: 'ring-amber-300', icon: Crown },
    platinum: { bg: 'from-slate-800 to-slate-900', ring: 'ring-slate-600', icon: Crown },
  };

  return (
    <ClientLayout>
      <div className="max-w-6xl mx-auto p-2 md:p-4 space-y-6" dir="rtl">
        {/* Header */}
        <div className="text-center space-y-2 py-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold">
            <Crown className="w-4 h-4" /> عضويات ماستر
          </div>
          <h1 className="text-3xl md:text-4xl font-black">اختر باقتك المثالية</h1>
          <p className="text-muted-foreground">اشتراك سنوي يمنحك خصومات حصرية وكاش باك مباشر على محفظتك</p>
        </div>

        {/* Current Membership */}
        {membership && (
          <Card className="border-primary/30 bg-gradient-to-l from-primary/5 to-transparent">
            <CardContent className="p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <MembershipBadge code={membership.plan?.code} nameAr={membership.plan?.name_ar} size="lg" />
                  <div>
                    <p className="text-sm font-bold">عضويتك الحالية نشطة</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      تنتهي في: {membership.expires_at ? new Date(membership.expires_at).toLocaleDateString('ar-SA') : '-'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-black text-primary">{membership.plan?.discount_percentage}%</p>
                    <p className="text-[10px] text-muted-foreground">خصم على الطلبات</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-emerald-600">{membership.plan?.cashback_amount}</p>
                    <p className="text-[10px] text-muted-foreground">كاش باك (ر.س)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan, idx) => {
            const style = planStyles[plan.code] || planStyles.silver;
            const Icon = style.icon;
            const isPlatinum = plan.code === 'platinum';
            const isCurrent = membership?.plan_id === plan.id;
            return (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <Card className={`relative overflow-hidden h-full ${plan.code === 'gold' ? 'ring-2 ring-amber-400 shadow-xl' : ''}`}>
                  {plan.code === 'gold' && (
                    <Badge className="absolute top-3 left-3 bg-amber-500 text-white">الأكثر شعبية</Badge>
                  )}
                  <div className={`bg-gradient-to-br ${style.bg} p-6 ${isPlatinum ? 'text-white' : ''}`}>
                    <Icon className="w-10 h-10 mb-3" />
                    <h3 className="text-xl font-black mb-1">{plan.name_ar}</h3>
                    <p className={`text-xs ${isPlatinum ? 'text-white/70' : 'text-muted-foreground'}`}>{plan.name_en}</p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-black">{plan.price.toLocaleString()}</span>
                      <span className="text-sm">ر.س / سنة</span>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-xl font-black text-primary">{plan.discount_percentage}%</p>
                        <p className="text-[10px] text-muted-foreground">خصم</p>
                      </div>
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                        <p className="text-xl font-black text-emerald-600">{plan.cashback_amount}</p>
                        <p className="text-[10px] text-muted-foreground">كاش باك</p>
                      </div>
                    </div>
                    <ul className="space-y-2 pt-2">
                      {plan.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      disabled={isCurrent}
                      variant={plan.code === 'gold' ? 'default' : 'outline'}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      {isCurrent ? 'عضويتك الحالية' : 'اشترك الآن'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Subscribe Dialog */}
        <Dialog open={!!selectedPlan} onOpenChange={(o) => !o && setSelectedPlan(null)}>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle>اشتراك في {selectedPlan?.name_ar}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">المبلغ المستحق</span>
                  <span className="text-2xl font-black">{selectedPlan?.price.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-muted-foreground">المدة</span>
                  <span className="font-bold">12 شهراً</span>
                </div>
                <div className="flex justify-between items-center mt-1 text-sm">
                  <span className="text-muted-foreground">كاش باك فوري</span>
                  <span className="font-bold text-emerald-600">{selectedPlan?.cashback_amount} ر.س</span>
                </div>
              </div>
              <div>
                <Label className="mb-3 block font-bold">طريقة الدفع</Label>
                <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                  <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/30" onClick={() => setPaymentMethod('wallet')}>
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Wallet className="w-5 h-5 text-primary" />
                    <Label htmlFor="wallet" className="cursor-pointer flex-1">
                      <p className="font-bold">المحفظة الرقمية</p>
                      <p className="text-xs text-muted-foreground">خصم فوري من رصيدك</p>
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/30" onClick={() => setPaymentMethod('invoice')}>
                    <RadioGroupItem value="invoice" id="invoice" />
                    <Receipt className="w-5 h-5 text-primary" />
                    <Label htmlFor="invoice" className="cursor-pointer flex-1">
                      <p className="font-bold">فاتورة (تحويل بنكي)</p>
                      <p className="text-xs text-muted-foreground">سترسل لك الإدارة فاتورة للدفع</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setSelectedPlan(null)}>إلغاء</Button>
              <Button onClick={handleSubscribe} disabled={submitting}>
                {submitting ? 'جارٍ الإرسال...' : 'تأكيد الاشتراك'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ClientLayout>
  );
}
