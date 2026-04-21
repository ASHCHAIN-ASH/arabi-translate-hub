import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Loader2, Lock, Sparkles, Check, AlertTriangle, Ticket, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { z } from 'zod';
import { MarketplaceItem, MarketplaceService, PromoValidation } from '@/utils/marketplaceService';

interface Props {
  item: MarketplaceItem;
  userXp: number;
  userLevel: number;
  onPurchased?: () => void;
}

const promoSchema = z.string().trim().min(3, 'الكود قصير').max(40, 'الكود طويل').regex(/^[A-Za-z0-9_-]+$/, 'حروف وأرقام فقط');

export default function MarketplaceItemCard({ item, userXp, userLevel, onPurchased }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoValidating, setPromoValidating] = useState(false);
  const [promo, setPromo] = useState<PromoValidation | null>(null);

  const canAfford = userXp >= (promo?.valid ? (promo.final_xp ?? item.xp_cost) : item.xp_cost);
  const meetsLevel = userLevel >= item.min_level;
  const inStock = item.stock === null || item.total_purchased < item.stock;
  const canBuy = canAfford && meetsLevel && inStock;

  // Reset promo state when dialog closes
  useEffect(() => {
    if (!open) { setPromoInput(''); setPromo(null); }
  }, [open]);

  const effectiveCost = promo?.valid ? (promo.final_xp ?? item.xp_cost) : item.xp_cost;
  const discountAmount = promo?.valid ? (promo.xp_discount ?? 0) : 0;

  const applyPromo = async () => {
    const parsed = promoSchema.safeParse(promoInput);
    if (!parsed.success) {
      setPromo({ valid: false, error: 'invalid_promo' });
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setPromoValidating(true);
    try {
      const r = await MarketplaceService.validatePromo(parsed.data, item.id);
      setPromo(r);
      if (r.valid) {
        toast.success(`✅ خصم ${r.xp_discount?.toLocaleString('ar-SA')} XP`);
      } else {
        toast.error(MarketplaceService.labelError(r.error || 'invalid_promo'));
      }
    } finally {
      setPromoValidating(false);
    }
  };

  const removePromo = () => { setPromo(null); setPromoInput(''); };

  const handlePurchase = async () => {
    setBusy(true);
    try {
      const r = await MarketplaceService.purchase(item.id, promo?.valid ? promo.code : undefined);
      if (r.success) {
        toast.success(`✨ تم الشراء بنجاح! -${r.xp_spent} XP`, {
          description: r.fulfillment?.coupon_code
            ? `كوبونك: ${r.fulfillment.coupon_code}`
            : r.fulfillment?.sar_credited
              ? `تم إضافة ${r.fulfillment.sar_credited} ريال لمحفظتك`
              : 'تحقق من مكافآتك',
        });
        setOpen(false);
        onPurchased?.();
      } else {
        toast.error(MarketplaceService.labelError(r.error || 'unknown'));
      }
    } catch (e: any) {
      toast.error(e?.message || 'تعذّر الشراء');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3 }}
        className="h-full"
      >
        <Card className={`h-full overflow-hidden border-2 transition-all hover:shadow-lg ${item.is_featured ? 'border-primary/40' : ''}`}>
          <div className={`h-1.5 ${item.badge_color || 'bg-primary'}`} />
          <CardContent className="p-5 space-y-3 flex flex-col h-full">
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl ${item.badge_color || 'bg-primary'} flex items-center justify-center text-2xl shadow-md`}>
                {item.icon || '🎁'}
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline" className="text-[10px]">
                  {MarketplaceService.labelType(item.type)}
                </Badge>
                {item.is_featured && (
                  <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-0 text-[10px]">
                    ⭐ مميز
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-1.5">
              <h3 className="font-bold text-base leading-tight">{item.title_ar}</h3>
              {item.description_ar && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {item.description_ar}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">{item.xp_cost.toLocaleString('ar-SA')}</span>
                <span className="text-xs text-muted-foreground">XP</span>
              </div>
              {!meetsLevel && (
                <Badge variant="outline" className="text-[10px] gap-1">
                  <Lock className="w-3 h-3" /> مستوى {item.min_level}
                </Badge>
              )}
            </div>

            <Button
              onClick={() => setOpen(true)}
              disabled={!meetsLevel || !inStock}
              className="w-full"
              variant={meetsLevel && inStock ? 'default' : 'outline'}
              size="sm"
            >
              {!inStock ? 'نفدت الكمية' :
                !meetsLevel ? `يحتاج مستوى ${item.min_level}` :
                  userXp < item.xp_cost ? 'شراء (مع كوبون؟)' :
                    'شراء'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              تأكيد الشراء
            </DialogTitle>
            <DialogDescription>
              راجع التفاصيل وأضف كوبون خصم إن وُجد
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className={`w-12 h-12 rounded-xl ${item.badge_color || 'bg-primary'} flex items-center justify-center text-2xl`}>
                {item.icon || '🎁'}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{item.title_ar}</div>
                <div className="text-xs text-muted-foreground">{item.description_ar}</div>
              </div>
            </div>

            {/* Promo code input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5" /> كوبون خصم (اختياري)
              </label>
              {promo?.valid ? (
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2 min-w-0">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-mono text-sm font-bold truncate">{promo.code}</div>
                      <div className="text-[10px] text-muted-foreground">
                        خصم {promo.discount_value}{promo.discount_type === 'percentage' ? '%' : ' ر.س'}
                      </div>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={removePromo}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="أدخل الكود"
                    maxLength={40}
                    className="font-mono text-sm uppercase"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyPromo(); } }}
                    disabled={promoValidating || busy}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={applyPromo}
                    disabled={!promoInput.trim() || promoValidating || busy}
                  >
                    {promoValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'تطبيق'}
                  </Button>
                </div>
              )}
              {promo && !promo.valid && promo.error && (
                <p className="text-xs text-destructive">{MarketplaceService.labelError(promo.error)}</p>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">رصيدك الحالي:</span>
                <span className="font-semibold">{userXp.toLocaleString('ar-SA')} XP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">السعر الأصلي:</span>
                <span className={discountAmount > 0 ? 'line-through text-muted-foreground' : ''}>
                  {item.xp_cost.toLocaleString('ar-SA')} XP
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>خصم الكوبون:</span>
                  <span className="font-semibold">- {discountAmount.toLocaleString('ar-SA')} XP</span>
                </div>
              )}
              <div className="flex justify-between text-destructive">
                <span>الإجمالي المستحق:</span>
                <span className="font-semibold">- {effectiveCost.toLocaleString('ar-SA')} XP</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-bold">
                <span>الرصيد بعد الشراء:</span>
                <span className={userXp - effectiveCost < 0 ? 'text-destructive' : ''}>
                  {(userXp - effectiveCost).toLocaleString('ar-SA')} XP
                </span>
              </div>
            </div>

            {!canAfford && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-xs">
                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <div>رصيدك غير كافٍ. يلزم <strong>{(effectiveCost - userXp).toLocaleString('ar-SA')}</strong> XP إضافية.</div>
              </div>
            )}

            {item.type === 'wallet_credit' && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>سيتم إضافة <strong>{item.reward_payload?.sar_amount} ريال</strong> فوراً إلى محفظتك. هذه العملية غير قابلة للإلغاء.</div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>إلغاء</Button>
            <Button onClick={handlePurchase} disabled={busy || !canBuy}>
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 ml-2" /> أكّد الشراء</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
