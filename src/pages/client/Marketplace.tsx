import { useEffect, useMemo, useState } from 'react';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Store, Sparkles, Ticket, Wallet, Award, Gift, Search, Copy, Check, Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useXpEconomy } from '@/hooks/useXpEconomy';
import { MarketplaceService, MarketplaceItem, MarketplaceItemType } from '@/utils/marketplaceService';
import MarketplaceItemCard from '@/components/marketplace/MarketplaceItemCard';

const TYPE_TABS: Array<{ key: 'all' | MarketplaceItemType; label: string; icon: any }> = [
  { key: 'all', label: 'الكل', icon: Store },
  { key: 'feature_unlock', label: 'فتح ميزات', icon: Sparkles },
  { key: 'discount', label: 'خصومات', icon: Ticket },
  { key: 'wallet_credit', label: 'تحويل لرصيد', icon: Wallet },
  { key: 'badge', label: 'شارات', icon: Award },
  { key: 'bundle', label: 'باقات', icon: Gift },
];

export default function Marketplace() {
  const { user } = useAuth();
  const { items, purchases, coupons, features, loading, refresh } = useMarketplace(user?.id);
  const { summary } = useXpEconomy(user?.id);
  const [tab, setTab] = useState<'all' | MarketplaceItemType>('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'shop' | 'mine'>('shop');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Track views (best-effort, once per item per page mount)
  useEffect(() => {
    if (!items.length) return;
    items.forEach((i) => MarketplaceService.trackView(i.id));
  }, [items]);

  const userXp = summary?.total_xp ?? 0;
  const userLevel = summary?.current_level ?? 1;

  const filtered = useMemo(() => {
    let list = items;
    if (tab !== 'all') list = list.filter(i => i.type === tab);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(i =>
        i.title_ar.toLowerCase().includes(q) ||
        (i.description_ar || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, tab, search]);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success('تم نسخ الكوبون');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch { /* noop */ }
  };

  return (
    <ClientLayout>
      <div className="min-h-screen bg-background py-8 px-4" dir="rtl">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden border-2">
              <div className="h-1.5 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500" />
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg">
                    🛍️
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">متجر XP</h1>
                    <p className="text-sm text-muted-foreground">استبدل نقاطك بمزايا حقيقية</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center px-4 py-2 rounded-xl bg-primary/10">
                    <div className="text-[10px] text-muted-foreground">رصيدك</div>
                    <div className="flex items-center gap-1 font-bold text-primary">
                      <Zap className="w-4 h-4" />
                      {userXp.toLocaleString('ar-SA')} XP
                    </div>
                  </div>
                  <div className="text-center px-4 py-2 rounded-xl bg-amber-500/10">
                    <div className="text-[10px] text-muted-foreground">المستوى</div>
                    <div className="font-bold text-amber-600 dark:text-amber-400">{userLevel}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Toggle: Shop vs My Items */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Tabs value={view} onValueChange={(v) => setView(v as any)}>
              <TabsList>
                <TabsTrigger value="shop">المتجر</TabsTrigger>
                <TabsTrigger value="mine">
                  مكافآتي
                  {(coupons.length + features.length) > 0 && (
                    <Badge variant="secondary" className="mr-2 text-[10px]">
                      {coupons.length + features.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {view === 'shop' && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث في المتجر..."
                  className="pr-9"
                />
              </div>
            )}
          </div>

          {/* SHOP VIEW */}
          {view === 'shop' && (
            <>
              <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                <ScrollArea className="w-full">
                  <TabsList className="w-full justify-start">
                    {TYPE_TABS.map(t => {
                      const Icon = t.icon;
                      const count = t.key === 'all' ? items.length : items.filter(i => i.type === t.key).length;
                      return (
                        <TabsTrigger key={t.key} value={t.key} className="gap-1.5">
                          <Icon className="w-3.5 h-3.5" />
                          {t.label}
                          <Badge variant="secondary" className="text-[10px] h-4 px-1">{count}</Badge>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </ScrollArea>

                <TabsContent value={tab} className="mt-6">
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-64" />)}
                    </div>
                  ) : filtered.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        <Store className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        لا توجد منتجات في هذا التصنيف حالياً
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filtered.map((item) => (
                        <MarketplaceItemCard
                          key={item.id}
                          item={item}
                          userXp={userXp}
                          userLevel={userLevel}
                          onPurchased={refresh}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}

          {/* MY REWARDS VIEW */}
          {view === 'mine' && (
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Coupons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Ticket className="w-4 h-4 text-pink-500" /> كوبوناتي ({coupons.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {coupons.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">لا كوبونات بعد</p>
                  ) : coupons.map(c => (
                    <div key={c.id} className="flex items-center justify-between gap-2 p-3 rounded-lg border bg-muted/30">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm font-bold">{c.code}</div>
                        <div className="text-xs text-muted-foreground">
                          خصم {c.discount_value}{c.discount_type === 'percentage' ? '%' : ' ر.س'}
                          {c.expires_at && ` • ينتهي ${new Date(c.expires_at).toLocaleDateString('ar-SA')}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={c.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">
                          {c.status === 'active' ? 'نشط' : c.status}
                        </Badge>
                        <Button size="icon" variant="ghost" onClick={() => copyCode(c.code)}>
                          {copiedCode === c.code ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Unlocked Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="w-4 h-4 text-amber-500" /> ميزات وشارات ({features.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {features.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">لا ميزات مفتوحة بعد</p>
                  ) : features.map(f => (
                    <div key={f.id} className="flex items-center justify-between gap-2 p-3 rounded-lg border bg-muted/30">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{f.feature_key}</div>
                        <div className="text-xs text-muted-foreground">
                          {f.expires_at
                            ? `ينتهي ${new Date(f.expires_at).toLocaleDateString('ar-SA')}`
                            : 'دائم'}
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px]">
                        مفعّل
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* History */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Store className="w-4 h-4" /> سجل المشتريات ({purchases.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {purchases.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">لا مشتريات بعد</p>
                  ) : (
                    <div className="space-y-2">
                      {purchases.slice(0, 15).map(p => (
                        <div key={p.id} className="flex items-center justify-between gap-2 py-2 border-b last:border-0 text-sm">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{p.item_slug}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {new Date(p.created_at).toLocaleString('ar-SA')} • {MarketplaceService.labelType(p.item_type)}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[10px] text-destructive">
                            -{p.xp_spent} XP
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
