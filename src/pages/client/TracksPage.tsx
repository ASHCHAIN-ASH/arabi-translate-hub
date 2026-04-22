import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
  ArrowLeft,
  Search,
  Sparkles,
  Wrench,
  Crown,
  Star,
  TrendingUp,
  Filter,
  GraduationCap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientLayout from '@/components/client/ClientLayout';
import { useTracks } from '@/hooks/useTracks';
import { useTrackStats, useUserTrackUsage } from '@/hooks/useTrackStats';
import { useAuth } from '@/components/SimpleAuthProvider';

type FilterMode = 'all' | 'free' | 'premium';

export default function TracksPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tracks, loading } = useTracks();
  const { stats } = useTrackStats();
  const { usage } = useUserTrackUsage(user?.id);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');

  const getIcon = (name: string) => (Icons as any)[name] || Icons.GraduationCap;

  // Recommended track = most used by this user, fallback to first track
  const recommendedTrackId = useMemo(() => {
    const entries = Object.entries(usage);
    if (entries.length === 0) return null;
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, [usage]);

  const recommendedTrack = tracks.find((t) => t.id === recommendedTrackId);

  // Aggregate platform totals
  const totals = useMemo(() => {
    let tools = 0;
    let free = 0;
    let premium = 0;
    Object.values(stats).forEach((s) => {
      tools += s.tools_count;
      free += s.free_count;
      premium += s.premium_count;
    });
    return { tools, free, premium };
  }, [stats]);

  // Filter tracks
  const filteredTracks = useMemo(() => {
    return tracks.filter((t) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        t.name_ar.toLowerCase().includes(q) ||
        (t.name_en || '').toLowerCase().includes(q) ||
        (t.description_ar || '').toLowerCase().includes(q);
      if (!matchSearch) return false;
      const s = stats[t.id];
      if (filter === 'free') return !s || s.free_count > 0;
      if (filter === 'premium') return s && s.premium_count > 0;
      return true;
    });
  }, [tracks, search, filter, stats]);

  return (
    <ClientLayout>
      <div dir="rtl" className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 md:py-10 max-w-7xl space-y-8">
          {/* ===== Header ===== */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>منصة الطالب</span>
              <span>›</span>
              <span className="text-foreground font-medium">المسارات التخصصية</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  المسارات التخصصية
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1.5 max-w-2xl">
                  اختر مسارك الأكاديمي لاكتشاف أدوات الذكاء الاصطناعي والموارد المصممة لتخصصك.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student')}
                className="gap-2 self-start md:self-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                لوحة الطالب
              </Button>
            </div>
          </div>

          {/* ===== Stats row (banking-style) ===== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatTile
              icon={GraduationCap}
              label="مسارات نشطة"
              value={tracks.length}
              tone="primary"
            />
            <StatTile icon={Wrench} label="إجمالي الأدوات" value={totals.tools} tone="default" />
            <StatTile icon={Sparkles} label="أدوات مجانية" value={totals.free} tone="success" />
            <StatTile icon={Crown} label="أدوات بريميوم" value={totals.premium} tone="warning" />
          </div>

          {/* ===== Recommended Track ===== */}
          {recommendedTrack && (
            <RecommendedCard
              track={recommendedTrack}
              stats={stats[recommendedTrack.id]}
              usageCount={usage[recommendedTrack.id] || 0}
              onOpen={() => navigate(`/student/tracks/${recommendedTrack.slug}`)}
              getIcon={getIcon}
            />
          )}

          {/* ===== Search + Filter ===== */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن مسار..."
                className="ps-3 pe-10 h-11 bg-card"
              />
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterMode)}>
              <TabsList className="h-11 bg-card border border-border">
                <TabsTrigger value="all" className="gap-1.5 text-xs md:text-sm">
                  <Filter className="w-3.5 h-3.5" />
                  الكل
                </TabsTrigger>
                <TabsTrigger value="free" className="gap-1.5 text-xs md:text-sm">
                  مجاني
                </TabsTrigger>
                <TabsTrigger value="premium" className="gap-1.5 text-xs md:text-sm">
                  <Crown className="w-3.5 h-3.5" />
                  بريميوم
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* ===== Loading ===== */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-44 rounded-xl bg-muted/40 animate-pulse border border-border"
                />
              ))}
            </div>
          )}

          {/* ===== Tracks Grid ===== */}
          {!loading && filteredTracks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTracks.map((track, idx) => {
                const Icon = getIcon(track.icon);
                const s = stats[track.id];
                const userUses = usage[track.id] || 0;
                return (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.35 }}
                  >
                    <Card
                      onClick={() => navigate(`/student/tracks/${track.slug}`)}
                      className="group relative cursor-pointer h-full border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300"
                    >
                      <CardContent className="p-5">
                        {/* Header row */}
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center shadow-sm`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          {userUses > 0 && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] gap-1 bg-primary/10 text-primary border-primary/20"
                            >
                              <TrendingUp className="w-3 h-3" />
                              {userUses} استخدام
                            </Badge>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base md:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {track.name_ar}
                        </h3>
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground/70 mb-3 font-medium">
                          {track.name_en}
                        </p>

                        {/* Description */}
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 min-h-[40px]">
                          {track.description_ar}
                        </p>

                        {/* Stats footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Wrench className="w-3.5 h-3.5" />
                              <span className="font-semibold text-foreground">
                                {s?.tools_count ?? 0}
                              </span>
                              <span>أداة</span>
                            </span>
                            {s && s.premium_count > 0 && (
                              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-500">
                                <Crown className="w-3.5 h-3.5" />
                                {s.premium_count}
                              </span>
                            )}
                          </div>
                          <div className="text-primary text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                            استكشف
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ===== Empty state ===== */}
          {!loading && filteredTracks.length === 0 && (
            <Card className="border-dashed border-border">
              <CardContent className="py-12 text-center">
                <Search className="w-10 h-10 mx-auto mb-3 text-muted-foreground/60" />
                <h3 className="font-semibold text-foreground mb-1">لا توجد نتائج</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  جرّب بحثًا آخر أو غيّر الفلتر.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setFilter('all');
                  }}
                >
                  إعادة ضبط
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ===== Bottom CTA ===== */}
          {!loading && tracks.length > 0 && (
            <Card className="border-border bg-gradient-to-l from-primary/5 to-transparent">
              <CardContent className="p-6 md:p-7 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-right">
                  <h3 className="text-base md:text-lg font-bold text-foreground mb-1">
                    لم تجد المسار المناسب؟
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    تواصل معنا واطلب مسارًا مخصصًا لتخصصك.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/support/tickets')}
                  className="gap-2"
                  size="default"
                >
                  <Sparkles className="w-4 h-4" />
                  اطلب مسارًا مخصصًا
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}

/* ============================================================
   Subcomponents
   ============================================================ */

interface StatTileProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  tone?: 'default' | 'primary' | 'success' | 'warning';
}

function StatTile({ icon: Icon, label, value, tone = 'default' }: StatTileProps) {
  const tones = {
    default: 'text-foreground bg-muted/60',
    primary: 'text-primary bg-primary/10',
    success: 'text-emerald-600 dark:text-emerald-500 bg-emerald-500/10',
    warning: 'text-amber-600 dark:text-amber-500 bg-amber-500/10',
  };
  return (
    <Card className="border-border">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tones[tone]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xl md:text-2xl font-bold text-foreground leading-none">
            {value}
          </div>
          <div className="text-[11px] md:text-xs text-muted-foreground mt-1 truncate">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RecommendedCardProps {
  track: any;
  stats?: { tools_count: number; free_count: number; premium_count: number };
  usageCount: number;
  onOpen: () => void;
  getIcon: (name: string) => React.ElementType;
}

function RecommendedCard({ track, stats, usageCount, onOpen, getIcon }: RecommendedCardProps) {
  const Icon = getIcon(track.icon);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-primary/30 bg-gradient-to-l from-primary/5 via-card to-card overflow-hidden">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4 text-xs text-primary font-semibold">
            <Star className="w-4 h-4 fill-primary" />
            موصى به لك بناءً على نشاطك
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${track.color} flex items-center justify-center shadow-md shrink-0`}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-1">
                {track.name_ar}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {track.description_ar}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5" />
                  {stats?.tools_count ?? 0} أداة
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  استخدمتها {usageCount} مرة
                </span>
              </div>
            </div>
            <Button onClick={onOpen} className="gap-2 shrink-0 self-start md:self-center">
              متابعة
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
