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
  // Up to 2 stacked promo codes
  const [promoInput, setPromoInput] = useState('');
  const [promoValidating, setPromoValidating] = useState(false);
  const [promos, setPromos] = useState<PromoValidation[]>([]); // applied codes (max 2)
  const [lastError, setLastError] = useState<string | null>(null);

  // Cumulative breakdown derived from applied promos
  const baseCost = item.xp_cost;
  const totalDiscount = promos.reduce((s, p) => s + (p.xp_discount || 0), 0);
  const effectiveCost = Math.max(baseCost - totalDiscount, 0);
  const canAddMore = promos.length < 2;

  const canAfford = userXp >= effectiveCost;
  const meetsLevel = userLevel >= item.min_level;
  const inStock = item.stock === null || item.total_purchased < item.stock;
  const canBuy = canAfford && meetsLevel && inStock;

  // Track view once on mount
  useEffect(() => {
    MarketplaceService.trackEvent('item_view', { itemId: item.id, metadata: { title: item.title_ar, type: item.type, xp_cost: item.xp_cost } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  // Track dialog open + reset promo state when dialog closes
  useEffect(() => {
    if (open) {
      MarketplaceService.trackEvent('dialog_open', { itemId: item.id, metadata: { type: item.type } });
    } else {
      setPromoInput(''); setPromos([]); setLastError(null);
    }
  }, [open, item.id, item.type]);

  const applyPromo = async () => {
    setLastError(null);
    const parsed = promoSchema.safeParse(promoInput);
    if (!parsed.success) {
      setLastError(parsed.error.errors[0].message);
      toast.error(parsed.error.errors[0].message);
      MarketplaceService.trackEvent('promo_invalid', { itemId: item.id, metadata: { reason: 'format' } });
      return;
    }
    const codeUpper = parsed.data.toUpperCase();
    if (promos.some((p) => (p.code || '').toUpperCase() === codeUpper)) {
      setLastError('هذا الكود مُطبَّق بالفعل');
      toast.error('هذا الكود مُطبَّق بالفعل');
      return;
    }
    setPromoValidating(true);
    try {
      // Validate against the running cost (base for the next coupon)
      const runningBase = effectiveCost;
      const r = promos.length === 0
        ? await MarketplaceService.validatePromo(parsed.data, item.id)
        : await MarketplaceService.validatePromoOnBase(parsed.data, item.id, runningBase);
      if (r.valid) {
        // Guard: if the second coupon yields 0 discount (floor reached), reject gracefully
        if ((r.xp_discount ?? 0) <= 0) {
          setLastError('السعر بعد الكوبون الأول وصل للحد الأدنى — لا يمكن تطبيق كوبون ثانٍ');
          toast.error('وصلت للحد الأدنى للسعر');
          MarketplaceService.trackEvent('promo_invalid', { itemId: item.id, metadata: { code: parsed.data, error: 'floor_reached' } });
          return;
        }
        setPromos((prev) => [...prev, r]);
        setPromoInput('');
        toast.success(`✅ خصم إضافي ${r.xp_discount?.toLocaleString('ar-SA')} XP`);
        MarketplaceService.trackEvent('promo_apply', { itemId: item.id, metadata: { code: parsed.data, discount_xp: r.xp_discount, slot: promos.length + 1 } });
      } else {
        setLastError(MarketplaceService.labelError(r.error || 'invalid_promo'));
        toast.error(MarketplaceService.labelError(r.error || 'invalid_promo'));
        MarketplaceService.trackEvent('promo_invalid', { itemId: item.id, metadata: { code: parsed.data, error: r.error } });
      }
    } finally {
      setPromoValidating(false);
    }
  };

  const removePromoAt = (idx: number) => {
    // Removing a coupon invalidates any subsequent ones (their discount was based on the prior running cost),
    // so drop everything from idx onwards. Keeps math correct.
    setPromos((prev) => prev.slice(0, idx));
    setLastError(null);
  };

  const priceSar = MarketplaceService.itemPriceSAR(item);
  const allowed = MarketplaceService.allowedMethods(item);
  const [method, setMethod] = useState<'xp' | 'wallet' | 'gateway'>(
    allowed.includes('xp') ? 'xp' : (allowed[0] as any) || 'xp'
  );

  const handlePurchase = async () => {
    setBusy(true);
    const codes = promos.map((p) => p.code!).filter(Boolean);
    MarketplaceService.trackEvent('purchase_confirm', {
      itemId: item.id,
      metadata: { effective_cost: effectiveCost, promo_codes: codes, discount: totalDiscount, method },
    });
    try {
      if (method === 'xp') {
        const r = await MarketplaceService.purchaseStacked(item.id, codes);
        if (r.success) {
          MarketplaceService.trackEvent('purchase_success', { itemId: item.id, metadata: { purchase_id: r.purchase_id, xp_spent: r.xp_spent, type: item.type, fulfillment: r.fulfillment, codes, method } });
          toast.success(`✨ تم الشراء بنجاح! -${r.xp_spent} XP`, {
            description: r.fulfillment?.coupon_code ? `كوبونك: ${r.fulfillment.coupon_code}`
              : r.fulfillment?.sar_credited ? `تم إضافة ${r.fulfillment.sar_credited} ريال لمحفظتك`
              : 'تحقق من مكافآتك',
          });
          setOpen(false); onPurchased?.();
        } else {
          MarketplaceService.trackEvent('purchase_failed', { itemId: item.id, metadata: { error: r.error, method } });
          toast.error(MarketplaceService.labelError(r.error || 'unknown'));
        }
      } else if (method === 'wallet') {
        const r = await MarketplaceService.purchaseWithWallet(item.id);
        if (r.success) {
          MarketplaceService.trackEvent('purchase_success', { itemId: item.id, metadata: { purchase_id: r.purchase_id, paid_sar: priceSar, method } });
          toast.success(`✨ تم الشراء بنجاح من المحفظة! -${priceSar.toLocaleString('ar-SA')} ر.س`);
          setOpen(false); onPurchased?.();
        } else {
          MarketplaceService.trackEvent('purchase_failed', { itemId: item.id, metadata: { error: r.error, method } });
          toast.error(MarketplaceService.labelError(r.error || 'unknown'));
        }
      } else {
        // gateway
        const r = await MarketplaceService.purchaseWithGateway(item.id, priceSar);
        if (r.success && r.checkout_url) {
          MarketplaceService.trackEvent('purchase_confirm', { itemId: item.id, metadata: { method, redirect: true } });
          toast.success('جارٍ تحويلك لصفحة الدفع…');
          window.location.href = r.checkout_url;
        } else {
          MarketplaceService.trackEvent('purchase_failed', { itemId: item.id, metadata: { error: r.error, method } });
          toast.error(MarketplaceService.labelError(r.error || 'gateway_error'));
        }
      }
    } catch (e: any) {
      MarketplaceService.trackEvent('purchase_failed', { itemId: item.id, metadata: { error: e?.message, method } });
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

            {/* اختيار طريقة الدفع */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">طريقة الدفع</label>
              <div className="grid grid-cols-3 gap-2">
                {allowed.includes('xp') && (
                  <button type="button" onClick={() => setMethod('xp')}
                    className={`p-2 rounded-lg border text-xs font-medium transition ${method==='xp' ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'}`}>
                    ⭐ XP
                    <div className="text-[10px] text-muted-foreground mt-0.5">{effectiveCost.toLocaleString('ar-SA')}</div>
                  </button>
                )}
                {allowed.includes('wallet') && (
                  <button type="button" onClick={() => setMethod('wallet')}
                    className={`p-2 rounded-lg border text-xs font-medium transition ${method==='wallet' ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'}`}>
                    👛 محفظة
                    <div className="text-[10px] text-muted-foreground mt-0.5">{priceSar.toLocaleString('ar-SA')} ر.س</div>
                  </button>
                )}
                {allowed.includes('gateway') && (
                  <button type="button" onClick={() => setMethod('gateway')}
                    className={`p-2 rounded-lg border text-xs font-medium transition ${method==='gateway' ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'}`}>
                    💳 بطاقة
                    <div className="text-[10px] text-muted-foreground mt-0.5">{priceSar.toLocaleString('ar-SA')} ر.س</div>
                  </button>
                )}
              </div>
            </div>

            {/* أكواد الخصم — تُطبَّق فقط مع الدفع بـ XP */}
            {method === 'xp' && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5" /> أكواد الخصم (حتى كوبونين)
              </label>

              {promos.map((p, idx) => (
                <div
                  key={`${p.code}-${idx}`}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-mono text-sm font-bold truncate">
                        #{idx + 1} · {p.code}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {p.discount_type === 'percentage'
                          ? `${p.discount_value}% على ${(p.original_xp ?? 0).toLocaleString('ar-SA')} XP`
                          : `خصم ثابت ${p.discount_value}`}
                        {' '}‒ وفّر {(p.xp_discount ?? 0).toLocaleString('ar-SA')} XP
                      </div>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removePromoAt(idx)}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}

              {canAddMore ? (
                <div className="flex gap-2">
                  <Input
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setLastError(null); }}
                    placeholder={promos.length === 0 ? 'أدخل الكود الأول' : 'أدخل الكود الثاني (اختياري)'}
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
              ) : (
                <p className="text-[11px] text-muted-foreground text-center py-1">
                  تم استخدام الحد الأقصى (كوبونان) ✓
                </p>
              )}

              {lastError && (
                <p className="text-xs text-destructive">{lastError}</p>
              )}
            </div>
            )}

            {/* Cumulative breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">رصيدك الحالي:</span>
                <span className="font-semibold">{userXp.toLocaleString('ar-SA')} XP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">السعر الأصلي:</span>
                <span className={totalDiscount > 0 ? 'line-through text-muted-foreground' : ''}>
                  {item.xp_cost.toLocaleString('ar-SA')} XP
                </span>
              </div>

              {promos.map((p, idx) => (
                <div
                  key={`bd-${p.code}-${idx}`}
                  className="flex justify-between text-emerald-600 dark:text-emerald-400 ps-3"
                >
                  <span className="text-xs">
                    خصم #{idx + 1} ({p.code}){' '}
                    {p.discount_type === 'percentage' ? `${p.discount_value}%` : ''}
                  </span>
                  <span className="font-semibold">− {(p.xp_discount ?? 0).toLocaleString('ar-SA')} XP</span>
                </div>
              ))}

              {totalDiscount > 0 && (
                <div className="flex justify-between border-t pt-2 text-emerald-700 dark:text-emerald-300 font-semibold">
                  <span>إجمالي التوفير:</span>
                  <span>− {totalDiscount.toLocaleString('ar-SA')} XP</span>
                </div>
              )}

              <div className="flex justify-between text-destructive">
                <span>الإجمالي المستحق:</span>
                <span className="font-semibold">− {effectiveCost.toLocaleString('ar-SA')} XP</span>
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
