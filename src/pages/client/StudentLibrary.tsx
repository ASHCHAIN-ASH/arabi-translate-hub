import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentResources, useLibraryCategories, StudentResource, LibraryCategory } from '@/hooks/useStudentHub';
import { useUserMembership } from '@/hooks/useMembership';
import * as LucideIcons from 'lucide-react';
import {
  Library, Search, Download, FileText, Video, Link as LinkIcon,
  LayoutTemplate, Crown, Eye, ArrowLeft, Sparkles, BookOpen, Clock, User as UserIcon, Star,
} from 'lucide-react';

const TYPE_META: Record<string, { label: string; icon: any; color: string }> = {
  pdf:      { label: 'PDF',    icon: FileText,        color: 'from-rose-500/20 to-rose-500/5' },
  video:    { label: 'فيديو',   icon: Video,           color: 'from-blue-500/20 to-blue-500/5' },
  link:     { label: 'رابط',    icon: LinkIcon,        color: 'from-emerald-500/20 to-emerald-500/5' },
  template: { label: 'قالب',    icon: LayoutTemplate,  color: 'from-violet-500/20 to-violet-500/5' },
  article:  { label: 'مقال',    icon: BookOpen,        color: 'from-amber-500/20 to-amber-500/5' },
  document: { label: 'مستند',   icon: FileText,        color: 'from-slate-500/20 to-slate-500/5' },
};

const SECTION_GRADIENTS: Record<string, string> = {
  primary:   'from-primary via-primary/90 to-accent',
  accent:    'from-accent via-accent/90 to-primary',
  secondary: 'from-secondary via-secondary/90 to-warning',
  warning:   'from-warning via-warning/90 to-secondary',
};

const DIFFICULTY_AR: Record<string, string> = {
  beginner: 'مبتدئ',
  intermediate: 'متوسط',
  advanced: 'متقدم',
};

const getIcon = (name?: string | null) => {
  if (!name) return Library;
  return (LucideIcons as any)[name] ?? Library;
};

const StudentLibrary: React.FC = () => {
  const { resources, loading: loadingRes } = useStudentResources();
  const { roots, childrenOf, loading: loadingCats } = useLibraryCategories();
  const { membership } = useUserMembership();
  const isPremium = !!membership;
  const [search, setSearch] = useState('');
  const [activeSubcat, setActiveSubcat] = useState<Record<string, string>>({});

  const loading = loadingRes || loadingCats;

  const filteredBySearch = useMemo(() => {
    if (!search.trim()) return resources;
    const q = search.toLowerCase();
    return resources.filter(r =>
      `${r.title} ${r.description ?? ''} ${r.long_description ?? ''} ${(r.tags ?? []).join(' ')}`
        .toLowerCase().includes(q)
    );
  }, [resources, search]);

  const featured = filteredBySearch.filter(r => r.is_featured).slice(0, 3);

  const handleOpen = async (r: StudentResource) => {
    if (r.is_premium && !isPremium) return;
    try {
      const res = await fetch(r.url, { mode: 'cors' });
      if (!res.ok) throw new Error('fetch failed');
      const blob = await res.blob();
      const ext = (r.url.split('.').pop() || 'pdf').split('?')[0].slice(0, 5);
      const fileName = `${r.title.replace(/[\\/:*?"<>|]/g, '_')}.${ext}`;
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      // fallback: trigger native download attribute
      const a = document.createElement('a');
      a.href = r.url;
      a.download = r.title;
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <div className="container max-w-7xl mx-auto px-4 py-8 space-y-10">

          {/* Hero رئيسي */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground shadow-2xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--background)/0.15),transparent_60%)]" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-8 left-8 opacity-20"
            >
              <Library className="w-32 h-32" />
            </motion.div>
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
                  مجموعة مختارة من القوالب، الأدلة، الفيديوهات، والأدوات الذكية لدعم رحلتك الأكاديمية.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center bg-background/15 backdrop-blur rounded-2xl px-5 py-3">
                  <div className="text-2xl font-bold">{resources.length}</div>
                  <div className="text-xs opacity-80">مورد</div>
                </div>
                <div className="text-center bg-background/15 backdrop-blur rounded-2xl px-5 py-3">
                  <div className="text-2xl font-bold">{roots.length}</div>
                  <div className="text-xs opacity-80">قسم</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* بحث عام */}
          <Card className="p-4 sticky top-2 z-20 backdrop-blur bg-card/80 border-border/50">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث في جميع الموارد..."
                className="pr-10"
              />
            </div>
          </Card>

          {/* مميزة */}
          {!search && featured.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-warning fill-warning" />
                <h2 className="text-xl md:text-2xl font-bold">موارد مختارة</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featured.map((r, i) => (
                  <ResourceCard key={r.id} resource={r} index={i} isPremium={isPremium} onOpen={handleOpen} variant="featured" />
                ))}
              </div>
            </motion.section>
          )}

          {/* loading */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
            </div>
          )}

          {/* أقسام رئيسية */}
          {!loading && roots.map((root, idx) => {
            const subs = childrenOf(root.id);
            const sectionResources = filteredBySearch.filter(r => r.category_id === root.id);
            const activeSub = activeSubcat[root.id] ?? 'all';
            const visible = activeSub === 'all'
              ? sectionResources
              : sectionResources.filter(r => r.subcategory_id === activeSub);

            if (search && sectionResources.length === 0) return null;

            const Icon = getIcon(root.icon);
            const gradient = SECTION_GRADIENTS[root.color || 'primary'] ?? SECTION_GRADIENTS.primary;

            return (
              <motion.section
                key={root.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="space-y-4"
              >
                {/* Hero القسم */}
                <div className={`relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br ${gradient} text-primary-foreground shadow-lg`}>
                  <motion.div
                    animate={{ rotate: [0, 8, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-4 -left-4 opacity-15"
                  >
                    <Icon className="w-40 h-40" />
                  </motion.div>
                  <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-background/20 backdrop-blur flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl md:text-3xl font-bold">{root.name_ar}</h2>
                          {root.name_en && <div className="text-xs opacity-70 mt-0.5">{root.name_en}</div>}
                        </div>
                      </div>
                      {root.description_ar && (
                        <p className="text-sm md:text-base opacity-90 max-w-2xl mt-2">{root.description_ar}</p>
                      )}
                    </div>
                    <Badge className="bg-background/20 backdrop-blur border-0 text-primary-foreground">
                      {sectionResources.length} مورد
                    </Badge>
                  </div>
                </div>

                {/* فلاتر فرعية */}
                {subs.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <Chip active={activeSub === 'all'} onClick={() => setActiveSubcat({ ...activeSubcat, [root.id]: 'all' })}>
                      الكل ({sectionResources.length})
                    </Chip>
                    {subs.map(sub => {
                      const count = sectionResources.filter(r => r.subcategory_id === sub.id).length;
                      const SubIcon = getIcon(sub.icon);
                      return (
                        <Chip
                          key={sub.id}
                          active={activeSub === sub.id}
                          onClick={() => setActiveSubcat({ ...activeSubcat, [root.id]: sub.id })}
                        >
                          <SubIcon className="w-3.5 h-3.5" />
                          {sub.name_ar} {count > 0 && <span className="opacity-60">({count})</span>}
                        </Chip>
                      );
                    })}
                  </div>
                )}

                {/* بطاقات */}
                {visible.length === 0 ? (
                  <Card className="p-8 text-center border-dashed">
                    <Library className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">لا توجد موارد في هذا التصنيف بعد.</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visible.map((r, i) => (
                      <ResourceCard key={r.id} resource={r} index={i} isPremium={isPremium} onOpen={handleOpen} />
                    ))}
                  </div>
                )}
              </motion.section>
            );
          })}

          {!loading && search && filteredBySearch.length === 0 && (
            <Card className="p-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-semibold mb-1">لا توجد نتائج</h3>
              <p className="text-sm text-muted-foreground">جرّب كلمات بحث مختلفة.</p>
            </Card>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

const ResourceCard: React.FC<{
  resource: StudentResource;
  index: number;
  isPremium: boolean;
  onOpen: (r: StudentResource) => void;
  variant?: 'default' | 'featured';
}> = ({ resource: r, index: i, isPremium, onOpen, variant = 'default' }) => {
  const meta = TYPE_META[r.resource_type] ?? { label: r.resource_type, icon: FileText, color: 'from-muted to-muted/50' };
  const Icon = meta.icon;
  const locked = r.is_premium && !isPremium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.04, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Card
        onClick={() => onOpen(r)}
        className={`group relative overflow-hidden h-full cursor-pointer transition-all duration-300 hover:shadow-xl border-border/50 ${
          variant === 'featured' ? 'ring-2 ring-warning/30' : ''
        }`}
      >
        <div className={`relative h-32 bg-gradient-to-br ${meta.color} flex items-center justify-center overflow-hidden`}>
          {r.cover_image_url ? (
            <img src={r.cover_image_url} alt={r.title} loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <Icon className="w-14 h-14 text-foreground/40 group-hover:scale-110 transition-transform duration-500" />
          )}
          <div className="absolute top-2 right-2 flex gap-1.5 flex-wrap justify-end">
            <Badge variant="secondary" className="backdrop-blur bg-background/80 text-xs">{meta.label}</Badge>
            {r.is_featured && variant !== 'featured' && (
              <Badge className="backdrop-blur bg-warning/90 text-warning-foreground border-0 text-xs">
                <Star className="w-3 h-3 mr-0.5 fill-current" /> مميز
              </Badge>
            )}
            {r.is_premium && (
              <Badge className="backdrop-blur bg-gradient-to-r from-warning to-secondary text-secondary-foreground border-0 text-xs">
                <Crown className="w-3 h-3 mr-0.5" /> اشتراك
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-base line-clamp-2 mb-1 group-hover:text-primary transition-colors">{r.title}</h3>
            {r.description && <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>}
          </div>

          {r.long_description && (
            <p className="text-xs text-muted-foreground/80 line-clamp-2 italic border-r-2 border-primary/30 pr-2">
              {r.long_description}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            {r.author && (
              <span className="inline-flex items-center gap-1"><UserIcon className="w-3 h-3" />{r.author}</span>
            )}
            {r.duration_minutes && (
              <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{r.duration_minutes} د</span>
            )}
            {r.difficulty && DIFFICULTY_AR[r.difficulty] && (
              <Badge variant="outline" className="text-[10px] py-0 h-4">{DIFFICULTY_AR[r.difficulty]}</Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Eye className="w-3.5 h-3.5" /><span>{r.views_count}</span>
            </div>
            <Button size="sm" variant={locked ? 'secondary' : 'default'} className="h-8 text-xs">
              {locked ? <><Crown className="w-3 h-3 mr-1" /> للأعضاء</> : <>تحميل <Download className="w-3 h-3 ml-1" /></>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Chip: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
      active
        ? 'bg-primary text-primary-foreground shadow-sm scale-105'
        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
    }`}
  >
    {children}
  </button>
);

export default StudentLibrary;
