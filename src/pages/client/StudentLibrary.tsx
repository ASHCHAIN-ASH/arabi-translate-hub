import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentResources, StudentResource } from '@/hooks/useStudentHub';
import { useUserMembership } from '@/hooks/useMembership';
import {
  Library, Search, ExternalLink, FileText, Video, Link as LinkIcon,
  LayoutTemplate, Crown, Eye, ArrowLeft, Sparkles, BookOpen,
} from 'lucide-react';

const TYPE_META: Record<string, { label: string; icon: any; color: string }> = {
  pdf:      { label: 'PDF',    icon: FileText,        color: 'from-rose-500/20 to-rose-500/5' },
  video:    { label: 'فيديو',   icon: Video,           color: 'from-blue-500/20 to-blue-500/5' },
  link:     { label: 'رابط',    icon: LinkIcon,        color: 'from-emerald-500/20 to-emerald-500/5' },
  template: { label: 'قالب',    icon: LayoutTemplate,  color: 'from-violet-500/20 to-violet-500/5' },
  article:  { label: 'مقال',    icon: BookOpen,        color: 'from-amber-500/20 to-amber-500/5' },
};

const StudentLibrary: React.FC = () => {
  const { resources, loading } = useStudentResources();
  const { membership } = useUserMembership();
  const isPremium = !!membership;
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    resources.forEach(r => { if (r.category) set.add(r.category); });
    return Array.from(set);
  }, [resources]);

  const types = useMemo(() => {
    const set = new Set<string>();
    resources.forEach(r => set.add(r.resource_type));
    return Array.from(set);
  }, [resources]);

  const filtered = useMemo(() => {
    return resources.filter(r => {
      if (activeType !== 'all' && r.resource_type !== activeType) return false;
      if (activeCategory !== 'all' && r.category !== activeCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${r.title} ${r.description ?? ''} ${(r.tags ?? []).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [resources, search, activeType, activeCategory]);

  const handleOpen = (r: StudentResource) => {
    if (r.is_premium && !isPremium) return;
    window.open(r.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground shadow-2xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--background)/0.15),transparent_60%)]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <Link to="/student" className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100 mb-3">
                  <ArrowLeft className="w-4 h-4" /> العودة إلى لوحة الطالب
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/15 backdrop-blur text-xs font-medium mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> مكتبة الموارد الأكاديمية
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-2">موارد المكتبة</h1>
                <p className="text-base md:text-lg opacity-90 max-w-2xl">
                  مجموعة مختارة من القوالب، الكتب، الفيديوهات، والمقالات لدعم رحلتك الأكاديمية.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center bg-background/15 backdrop-blur rounded-2xl px-6 py-4">
                  <div className="text-3xl font-bold">{resources.length}</div>
                  <div className="text-xs opacity-80">إجمالي الموارد</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <Card className="p-4 md:p-5">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="ابحث في المكتبة..."
                  className="pr-10"
                />
              </div>
            </div>

            {(types.length > 0 || categories.length > 0) && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <FilterChip active={activeType === 'all'} onClick={() => setActiveType('all')}>الكل</FilterChip>
                  {types.map(t => (
                    <FilterChip key={t} active={activeType === t} onClick={() => setActiveType(t)}>
                      {TYPE_META[t]?.label ?? t}
                    </FilterChip>
                  ))}
                </div>
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <FilterChip active={activeCategory === 'all'} onClick={() => setActiveCategory('all')} variant="muted">
                      جميع التصنيفات
                    </FilterChip>
                    {categories.map(c => (
                      <FilterChip key={c} active={activeCategory === c} onClick={() => setActiveCategory(c)} variant="muted">
                        {c}
                      </FilterChip>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <Library className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-1">لا توجد موارد مطابقة</h3>
              <p className="text-sm text-muted-foreground">
                {resources.length === 0 ? 'لم تُضَف موارد بعد. عُد لاحقاً.' : 'جرّب تعديل الفلاتر أو البحث.'}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {filtered.map((r, i) => {
                const meta = TYPE_META[r.resource_type] ?? { label: r.resource_type, icon: FileText, color: 'from-muted to-muted/50' };
                const Icon = meta.icon;
                const locked = r.is_premium && !isPremium;
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                  >
                    <Card
                      onClick={() => handleOpen(r)}
                      className={`group relative overflow-hidden h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-border/50 ${locked ? 'opacity-90' : ''}`}
                    >
                      {/* Cover */}
                      <div className={`relative h-32 bg-gradient-to-br ${meta.color} flex items-center justify-center overflow-hidden`}>
                        {r.cover_image_url ? (
                          <img src={r.cover_image_url} alt={r.title} loading="lazy" className="w-full h-full object-cover" />
                        ) : (
                          <Icon className="w-14 h-14 text-foreground/40 group-hover:scale-110 transition-transform duration-500" />
                        )}
                        <div className="absolute top-2 right-2 flex gap-1.5">
                          <Badge variant="secondary" className="backdrop-blur bg-background/80 text-xs">
                            {meta.label}
                          </Badge>
                          {r.is_premium && (
                            <Badge className="backdrop-blur bg-gradient-to-r from-warning to-secondary text-secondary-foreground border-0 text-xs">
                              <Crown className="w-3 h-3 mr-1" /> مميز
                            </Badge>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-base line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                            {r.title}
                          </h3>
                          {r.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                          )}
                        </div>

                        {r.tags && r.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {r.tags.slice(0, 3).map(t => (
                              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{r.views_count}</span>
                          </div>
                          <Button size="sm" variant={locked ? 'secondary' : 'default'} className="h-8 text-xs">
                            {locked ? (
                              <><Crown className="w-3 h-3 mr-1" /> مطلوب اشتراك</>
                            ) : (
                              <>افتح <ExternalLink className="w-3 h-3 ml-1" /></>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

const FilterChip: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; variant?: 'default' | 'muted' }> = ({ active, onClick, children, variant = 'default' }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
      active
        ? variant === 'muted'
          ? 'bg-secondary text-secondary-foreground'
          : 'bg-primary text-primary-foreground shadow-sm'
        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
    }`}
  >
    {children}
  </button>
);

export default StudentLibrary;
