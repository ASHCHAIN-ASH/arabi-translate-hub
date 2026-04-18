import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowRight, Loader2, Sparkles, Construction, Gift, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ClientLayout from '@/components/client/ClientLayout';
import { supabase } from '@/integrations/supabase/client';
import type { TrackTool, Track } from '@/hooks/useTracks';

export default function TrackToolPage() {
  const { trackSlug, toolSlug } = useParams<{ trackSlug: string; toolSlug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tool, setTool] = useState<TrackTool | null>(null);
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    (async () => {
      if (!trackSlug || !toolSlug) return;
      setLoading(true);
      const { data: t } = await (supabase as any)
        .from('tracks').select('*').eq('slug', trackSlug).maybeSingle();
      if (t) {
        setTrack(t as Track);
        const { data: tl } = await (supabase as any)
          .from('track_tools').select('*')
          .eq('track_id', (t as any).id).eq('slug', toolSlug).eq('is_active', true)
          .maybeSingle();
        setTool(tl as TrackTool);
      }
      setLoading(false);
    })();
  }, [trackSlug, toolSlug]);

  const getIcon = (name?: string) => (Icons as any)[name || ''] || Icons.Sparkles;

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ClientLayout>
    );
  }

  if (!tool || !track) {
    return (
      <ClientLayout>
        <div dir="rtl" className="container mx-auto px-4 py-12 text-center max-w-2xl">
          <Card>
            <CardContent className="p-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                <Construction className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold">الأداة غير متاحة</h2>
              <p className="text-muted-foreground">
                لم نتمكن من العثور على هذه الأداة، أو ربما تم تعطيلها مؤقتًا.
              </p>
              <Button onClick={() => navigate(`/student/tracks/${trackSlug || ''}`)} className="gap-2">
                <ArrowRight className="w-4 h-4" /> العودة للمسار
              </Button>
            </CardContent>
          </Card>
        </div>
      </ClientLayout>
    );
  }

  const Icon = getIcon(tool.icon);

  return (
    <ClientLayout>
      <div dir="rtl" className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" size="sm" className="mb-6 gap-2" onClick={() => navigate(`/student/tracks/${trackSlug}`)}>
          <ArrowRight className="w-4 h-4" />
          العودة لـ {track.name_ar}
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-l ${track.color} p-8 mb-6 text-white shadow-xl`}
        >
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
              <Icon className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className="bg-white/20 text-white border-white/30">{track.name_ar}</Badge>
                {tool.is_premium && (
                  <Badge className="bg-amber-500/90 text-white gap-1">
                    <Crown className="w-3 h-3" /> بريميوم
                  </Badge>
                )}
                {Number(tool.price) === 0 && (
                  <Badge className="bg-emerald-500/90 text-white gap-1">
                    <Gift className="w-3 h-3" /> مجاني
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{tool.name_ar}</h1>
              <p className="text-white/90">{tool.description_ar}</p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold">واجهة الأداة قيد التطوير</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              تم تأكيد طلبك وتسجيل الاستخدام بنجاح. واجهة هذه الأداة الذكية ستكون متاحة قريبًا — سنعلمك فور جاهزيتها.
              في هذه الأثناء، يمكنك تجربة باقي الأدوات المتاحة في المسار.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button variant="outline" onClick={() => navigate(`/student/tracks/${trackSlug}`)} className="gap-2">
                <ArrowRight className="w-4 h-4" /> أدوات المسار
              </Button>
              <Button onClick={() => navigate('/student/tracks')} className="gap-2">
                كل المسارات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
