import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Ticket, Sparkles, Wallet, Copy, CheckCircle2, Clock, AlertCircle, Package, RefreshCw, TicketPercent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useToast } from '@/hooks/use-toast';
import { MarketplaceService, type MarketplacePurchase, type DiscountCoupon, type UnlockedFeature } from '@/utils/marketplaceService';

const TYPE_ICON: Record<string, React.ReactNode> = {
  feature_unlock: <Sparkles className="h-4 w-4" />,
  discount: <Ticket className="h-4 w-4" />,
  wallet_credit: <Wallet className="h-4 w-4" />,
  badge: <Gift className="h-4 w-4" />,
  bundle: <Package className="h-4 w-4" />,
};

const isExpired = (d?: string | null) => !!d && new Date(d) < new Date();

const ValidityBadge: React.FC<{ expiresAt?: string | null; usedAt?: string | null }> = ({ expiresAt, usedAt }) => {
  if (usedAt) return <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-3 w-3" />مُستخدم</Badge>;
  if (isExpired(expiresAt)) return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />منتهي</Badge>;
  if (expiresAt) return <Badge className="gap-1"><Clock className="h-3 w-3" />ساري حتى {new Date(expiresAt).toLocaleDateString('ar-EG')}</Badge>;
  return <Badge className="gap-1"><CheckCircle2 className="h-3 w-3" />ساري دائماً</Badge>;
};

const buildMessage = (p: MarketplacePurchase): string => {
  const f = p.fulfillment_data || {};
  if (p.item_type === 'wallet_credit' && f.sar_credited) return `تمت إضافة ${f.sar_credited} ر.س إلى محفظتك بنجاح.`;
  if (p.item_type === 'discount' && f.coupon_code) return `استلمت كوبون خصم بكود: ${f.coupon_code}.`;
  if (p.item_type === 'feature_unlock' && f.feature_unlocked) return `تم فتح ميزة: ${f.feature_unlocked}.`;
  if (p.item_type === 'badge' && f.badge_granted) return `تم منحك شارة: ${f.badge_granted}.`;
  if (p.item_type === 'bundle') return `تم تفعيل باقة كاملة من المكافآت.`;
  return 'تمت معالجة المكافأة بنجاح.';
};

const ClientMarketplaceRewards: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<MarketplacePurchase[]>([]);
  const [coupons, setCoupons] = useState<DiscountCoupon[]>([]);
  const [features, setFeatures] = useState<UnlockedFeature[]>([]);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [p, c, f] = await Promise.all([
      MarketplaceService.listMyPurchases(user.id),
      MarketplaceService.listMyCoupons(user.id),
      MarketplaceService.listMyUnlockedFeatures(user.id),
    ]);
    setPurchases(p);
    setCoupons(c);
    setFeatures(f);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); toast({ title: 'تم النسخ', description: text }); }
    catch { toast({ title: 'تعذّر النسخ', variant: 'destructive' }); }
  };

  const stats = {
    total: purchases.length,
    coupons: coupons.length,
    activeCoupons: coupons.filter(c => c.status === 'active' && !isExpired(c.expires_at)).length,
    features: features.length,
    activeFeatures: features.filter(f => !isExpired(f.expires_at)).length,
  };

  return (
    <ClientLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-5" dir="rtl">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Gift className="h-7 w-7 text-primary" /> مكافآتي من المتجر
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              سجل كامل لجميع الميزات والكوبونات والمكافآت التي حصلت عليها عبر متجر XP.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> تحديث
            </Button>
            <Button size="sm" onClick={() => navigate('/marketplace')} className="gap-2">
              <Sparkles className="h-4 w-4" /> زيارة المتجر
            </Button>
          </div>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground mb-1">إجمالي المشتريات</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground mb-1">كوبونات نشطة</p>
            <p className="text-2xl font-bold">{stats.activeCoupons} <span className="text-sm text-muted-foreground">/ {stats.coupons}</span></p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground mb-1">ميزات مفتوحة</p>
            <p className="text-2xl font-bold">{stats.activeFeatures} <span className="text-sm text-muted-foreground">/ {stats.features}</span></p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground mb-1">إجمالي XP المصروف</p>
            <p className="text-2xl font-bold">{purchases.reduce((s, p) => s + p.xp_spent, 0).toLocaleString('ar-EG')}</p>
          </Card>
        </div>

        {(() => null)()}
        {/* Promo usages derived from purchases */}
        <Tabs defaultValue="all">
          <TabsList className="w-full md:w-auto flex-wrap h-auto">
            <TabsTrigger value="all">الكل ({purchases.length})</TabsTrigger>
            <TabsTrigger value="coupons">الكوبونات ({coupons.length})</TabsTrigger>
            <TabsTrigger value="features">الميزات ({features.length})</TabsTrigger>
            <TabsTrigger value="promos">أكواد الخصم ({purchases.filter(p => !!p.promo_code).length})</TabsTrigger>
          </TabsList>

          {/* All purchases */}
          <TabsContent value="all" className="mt-4 space-y-3">
            {loading ? (
              <p className="text-center text-sm text-muted-foreground py-8">جاري التحميل...</p>
            ) : purchases.length === 0 ? (
              <Card className="p-8 text-center">
                <Gift className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium mb-1">لا توجد مشتريات بعد</p>
                <p className="text-sm text-muted-foreground mb-4">ابدأ بصرف XP على مكافآت حقيقية من المتجر</p>
                <Button onClick={() => navigate('/marketplace')}>افتح المتجر</Button>
              </Card>
            ) : (
              purchases.map((p) => {
                const f = p.fulfillment_data || {};
                const code = f.coupon_code as string | undefined;
                return (
                  <Card key={p.id} className="p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          {TYPE_ICON[p.item_type] || <Gift className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{MarketplaceService.labelType(p.item_type)}</h3>
                            <Badge variant="outline" className="text-xs">{p.item_slug}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{buildMessage(p)}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(p.created_at).toLocaleString('ar-EG')} · صُرف <strong>{p.xp_spent}</strong> XP
                          </p>
                          {code && (
                            <div className="mt-2 flex items-center gap-2">
                              <code className="px-2 py-1 rounded bg-muted text-sm font-mono">{code}</code>
                              <Button size="sm" variant="ghost" className="h-7 gap-1" onClick={() => copy(code)}>
                                <Copy className="h-3 w-3" /> نسخ
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant={p.status === 'completed' ? 'default' : 'secondary'}>
                        {p.status === 'completed' ? 'مكتمل' : p.status}
                      </Badge>
                    </div>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Coupons */}
          <TabsContent value="coupons" className="mt-4 space-y-3">
            {coupons.length === 0 ? (
              <Card className="p-8 text-center text-sm text-muted-foreground">لا توجد كوبونات</Card>
            ) : coupons.map((c) => (
              <Card key={c.id} className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <code className="px-2 py-1 rounded bg-muted text-base font-mono font-bold">{c.code}</code>
                      <Button size="sm" variant="ghost" className="h-7 gap-1" onClick={() => copy(c.code)}>
                        <Copy className="h-3 w-3" /> نسخ
                      </Button>
                    </div>
                    <p className="text-sm">
                      خصم <strong>{c.discount_value}{c.discount_type === 'percentage' ? '%' : ' ر.س'}</strong>
                      {c.applies_to !== 'all' && <> على <span className="text-muted-foreground">{c.applies_to}</span></>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      أُصدر في {new Date(c.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <ValidityBadge expiresAt={c.expires_at} usedAt={c.status === 'used' ? c.created_at : null} />
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Features */}
          <TabsContent value="features" className="mt-4 space-y-3">
            {features.length === 0 ? (
              <Card className="p-8 text-center text-sm text-muted-foreground">لا توجد ميزات مفتوحة</Card>
            ) : features.map((f) => (
              <Card key={f.id} className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{f.feature_key}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        المصدر: {f.source} · فُتحت في {new Date(f.created_at).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  </div>
                  <ValidityBadge expiresAt={f.expires_at} />
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Promo codes applied */}
          <TabsContent value="promos" className="mt-4">
            {(() => {
              const promoUsages = purchases.filter(p => !!p.promo_code);
              if (promoUsages.length === 0) {
                return (
                  <Card className="p-8 text-center">
                    <TicketPercent className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="font-medium mb-1">لم تستخدم أي كود خصم بعد</p>
                    <p className="text-sm text-muted-foreground">
                      عند تطبيق Promo Code أثناء الشراء من المتجر، ستجد سجلًا تفصيليًا هنا.
                    </p>
                  </Card>
                );
              }
              const totalDiscount = promoUsages.reduce((s, p) => s + (p.xp_discount || 0), 0);
              return (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Card className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">عدد مرات الاستخدام</p>
                      <p className="text-2xl font-bold">{promoUsages.length}</p>
                    </Card>
                    <Card className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">إجمالي XP الموفّر</p>
                      <p className="text-2xl font-bold text-primary">{totalDiscount.toLocaleString('ar-EG')}</p>
                    </Card>
                    <Card className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">آخر استخدام</p>
                      <p className="text-sm font-semibold">
                        {new Date(promoUsages[0].created_at).toLocaleDateString('ar-EG')}
                      </p>
                    </Card>
                  </div>

                  <Card className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">الكود</TableHead>
                          <TableHead className="text-right">المنتج</TableHead>
                          <TableHead className="text-right">السعر الأصلي</TableHead>
                          <TableHead className="text-right">الخصم</TableHead>
                          <TableHead className="text-right">المدفوع</TableHead>
                          <TableHead className="text-right">تاريخ الاستخدام</TableHead>
                          <TableHead className="text-right">الحالة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {promoUsages.map((p) => {
                          const matchedCoupon = coupons.find(
                            (c) => c.code.toUpperCase() === (p.promo_code || '').toUpperCase()
                          );
                          const expired = isExpired(matchedCoupon?.expires_at);
                          return (
                            <TableRow key={p.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <code className="px-2 py-1 rounded bg-muted text-xs font-mono font-bold">
                                    {p.promo_code}
                                  </code>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={() => copy(p.promo_code!)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">{p.item_slug}</Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground line-through">
                                {(p.original_xp_cost ?? p.xp_spent + (p.xp_discount || 0)).toLocaleString('ar-EG')} XP
                              </TableCell>
                              <TableCell className="text-primary font-semibold">
                                −{(p.xp_discount || 0).toLocaleString('ar-EG')} XP
                              </TableCell>
                              <TableCell className="font-semibold">
                                {p.xp_spent.toLocaleString('ar-EG')} XP
                              </TableCell>
                              <TableCell className="text-xs">
                                {new Date(p.created_at).toLocaleString('ar-EG')}
                              </TableCell>
                              <TableCell>
                                {p.status !== 'completed' ? (
                                  <Badge variant="destructive" className="gap-1">
                                    <AlertCircle className="h-3 w-3" />فشل
                                  </Badge>
                                ) : matchedCoupon ? (
                                  <Badge variant="secondary" className="gap-1">
                                    <CheckCircle2 className="h-3 w-3" />مُستخدم
                                  </Badge>
                                ) : expired ? (
                                  <Badge variant="destructive" className="gap-1">
                                    <AlertCircle className="h-3 w-3" />منتهي
                                  </Badge>
                                ) : (
                                  <Badge className="gap-1">
                                    <CheckCircle2 className="h-3 w-3" />مُطبّق
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              );
            })()}
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default ClientMarketplaceRewards;
