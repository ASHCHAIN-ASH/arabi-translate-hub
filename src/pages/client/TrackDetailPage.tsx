import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowRight, Wallet, Loader2, Sparkles, Lock, Gift, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import ClientLayout from '@/components/client/ClientLayout';
import { useTrack, useToolUsageToday, useTrackTool, type TrackTool } from '@/hooks/useTracks';
import { useSimpleAuth } from '@/components/SimpleAuthProvider';
import { WalletService } from '@/utils/walletService';
import { supabase } from '@/integrations/supabase/client';

export default function TrackDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useSimpleAuth();
  const { track, tools, loading } = useTrack(slug);
  const { usageMap, refresh: refreshUsage } = useToolUsageToday(user?.id);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [selectedTool, setSelectedTool] = useState<TrackTool | null>(null);
  const [running, setRunning] = useState(false);

  // Realtime wallet
  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      const w = await WalletService.getMyWallet(user.id);
      setWalletBalance(w?.balance || 0);
    };
    load();
    const ch = (supabase as any)
      .channel(`wallet-${user.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'wallets',
        filter: `user_id=eq.${user.id}`,
      }, (payload: any) => {
        if (payload.new?.balance !== undefined) setWalletBalance(payload.new.balance);
      })
      .subscribe();
    return () => { (supabase as any).removeChannel(ch); };
  }, [user?.id]);

  const getIcon = (name: string) => (Icons as any)[name] || Icons.Sparkles;

  const handleUseTool = async () => {
    if (!selectedTool) return;
    setRunning(true);
    const result = await useTrackTool(selectedTool.id);
    setRunning(false);
    if (!result.ok) {
      toast.error(result.error || 'تعذّر تشغيل الأداة');
      return;
    }
    toast.success(
      result.was_free
        ? '✨ تم التشغيل المجاني!'
        : `✅ تم خصم ${result.charged} ر.س من محفظتك`,
    );
    await refreshUsage();
    setSelectedTool(null);
    if (result.action_link) {
      setTimeout(() => navigate(result.action_link!), 600);
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ClientLayout>
    );
  }

  if (!track) {
    return (
      <ClientLayout>
        <div dir="rtl" className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">المسار غير موجود</h2>
          <Button onClick={() => navigate('/student/tracks')}>عودة للمسارات</Button>
        </div>
      </ClientLayout>
    );
  }

  const TrackIcon = getIcon(track.icon);

  return (
    <ClientLayout>
      <div dir="rtl" className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back */}
        <Button variant="ghost" size="sm" className="mb-6 gap-2" onClick={() => navigate('/student/tracks')}>
          <ArrowRight className="w-4 h-4" />
          كل المسارات
        </Button>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-l ${track.color} p-8 md:p-12 mb-8 text-white shadow-2xl`}
        >
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                <TrackIcon className="w-8 h-8" />
              </div>
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-2">{track.name_en}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{track.name_ar}</h1>
                <p className="text-white/90 max-w-2xl">{track.description_ar}</p>
              </div>
            </div>
            {/* Wallet */}
            <Card
              className="bg-white/15 backdrop-blur border-white/30 cursor-pointer hover:bg-white/25 transition-all shrink-0"
              onClick={() => navigate('/wallet')}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <Wallet className="w-5 h-5" />
                <div>
                  <div className="text-xs text-white/80">رصيدك الحالي</div>
                  <div className="text-xl font-bold">{walletBalance.toFixed(2)} ر.س</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Tools */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            الأدوات المتاحة
          </h2>
          <Badge variant="outline" className="text-sm">{tools.length} أداة</Badge>
        </div>

        {tools.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              لا توجد أدوات متاحة بعد في هذا المسار. سيتم إضافتها قريباً.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool, idx) => {
              const Icon = getIcon(tool.icon);
              const usedFree = usageMap[tool.id] || 0;
              const freeRemaining = Math.max(0, tool.free_daily_quota - usedFree);
              const hasFree = freeRemaining > 0;
              const canAfford = walletBalance >= Number(tool.price);

              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  <Card className="group relative overflow-hidden border-2 hover:border-primary/40 hover:shadow-xl transition-all h-full flex flex-col">
                    {tool.is_premium && (
                      <Badge className="absolute top-3 left-3 bg-amber-500 text-white gap-1">
                        <Crown className="w-3 h-3" /> بريميوم
                      </Badge>
                    )}
                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center mb-3 shadow-md`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-1">{tool.name_ar}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                        {tool.description_ar}
                      </p>

                      {/* Price + free quota */}
                      <div className="flex items-center justify-between mb-3 pt-3 border-t">
                        <div>
                          {Number(tool.price) === 0 ? (
                            <Badge variant="secondary" className="gap-1">
                              <Gift className="w-3 h-3" /> مجاني
                            </Badge>
                          ) : (
                            <div className="font-bold text-primary">{Number(tool.price).toFixed(2)} ر.س</div>
                          )}
                        </div>
                        {tool.free_daily_quota > 0 && (
                          <Badge variant={hasFree ? 'default' : 'outline'} className="text-xs">
                            {hasFree ? `${freeRemaining} مجاناً اليوم` : 'انتهت الكمية المجانية'}
                          </Badge>
                        )}
                      </div>

                      <Button
                        className="w-full gap-2"
                        onClick={() => setSelectedTool(tool)}
                        disabled={!hasFree && !canAfford && Number(tool.price) > 0}
                        variant={!hasFree && !canAfford && Number(tool.price) > 0 ? 'outline' : 'default'}
                      >
                        {!hasFree && !canAfford && Number(tool.price) > 0 ? (
                          <><Lock className="w-4 h-4" /> رصيد غير كافٍ</>
                        ) : (
                          <><Sparkles className="w-4 h-4" /> ابدأ الآن</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Confirmation Dialog */}
        <AlertDialog open={!!selectedTool} onOpenChange={(o) => !o && setSelectedTool(null)}>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                تأكيد تشغيل: {selectedTool?.name_ar}
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2 pt-2">
                <div>{selectedTool?.description_ar}</div>
                {selectedTool && (() => {
                  const used = usageMap[selectedTool.id] || 0;
                  const hasFree = used < selectedTool.free_daily_quota;
                  return (
                    <div className="bg-muted/50 rounded-lg p-3 mt-3 text-sm">
                      {hasFree ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                          <Gift className="w-4 h-4" /> ستُحسب من حصتك المجانية اليوم
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>التكلفة:</span>
                            <span className="font-bold text-primary">{Number(selectedTool.price).toFixed(2)} ر.س</span>
                          </div>
                          <div className="flex justify-between">
                            <span>رصيدك بعد الخصم:</span>
                            <span className="font-bold">{(walletBalance - Number(selectedTool.price)).toFixed(2)} ر.س</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={running}>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={handleUseTool} disabled={running} className="gap-2">
                {running ? <><Loader2 className="w-4 h-4 animate-spin" /> جارٍ التشغيل...</> : 'تأكيد وابدأ'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ClientLayout>
  );
}

// helper: import named export from hook
async function useTrackTool(toolId: string) {
  const mod = await import('@/hooks/useTracks');
  return mod.useTrackTool(toolId);
}
