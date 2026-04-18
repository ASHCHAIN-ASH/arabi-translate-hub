import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ClientLayout from '@/components/client/ClientLayout';
import { useTracks } from '@/hooks/useTracks';
import { ArrowLeft, Sparkles, Wand2, Zap, Shield, Star } from 'lucide-react';

export default function TracksPage() {
  const navigate = useNavigate();
  const { tracks, loading } = useTracks();

  const getIcon = (name: string) => {
    const Icon = (Icons as any)[name] || Icons.GraduationCap;
    return Icon;
  };

  return (
    <ClientLayout>
      <div dir="rtl" className="relative min-h-screen overflow-hidden">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full bg-primary/15 blur-[120px]" />
          <div className="absolute top-40 -left-40 w-[460px] h-[460px] rounded-full bg-accent/20 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-secondary/30 blur-[120px]" />
          {/* subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-10 max-w-7xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm text-primary mb-6 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide">المسارات التخصصية الذكية</span>
              <span className="hidden sm:inline-flex items-center gap-1 ms-2 ps-2 border-s border-primary/20 text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-primary text-primary" />
                نخبة
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
              <span className="bg-gradient-to-l from-primary via-primary/80 to-accent-foreground bg-clip-text text-transparent">
                اختر مسارك التخصصي
              </span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              منصة احترافية تجمع <span className="text-foreground font-semibold">أدوات ذكاء اصطناعي</span> وخدمات
              مصمَّمة لكل تخصص — استخدم رصيد محفظتك للوصول الفوري بدون انتظار.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
              {[
                { icon: Wand2, label: 'مدعوم بالذكاء الاصطناعي' },
                { icon: Zap, label: 'استجابة فورية' },
                { icon: Shield, label: 'خصوصية مضمونة' },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur border border-border/60 text-xs text-muted-foreground"
                >
                  <b.icon className="w-3.5 h-3.5 text-primary" />
                  {b.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-72 rounded-3xl bg-gradient-to-br from-muted/60 to-muted/20 animate-pulse border border-border/40"
                />
              ))}
            </div>
          )}

          {/* Tracks Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {tracks.map((track, idx) => {
                const Icon = getIcon(track.icon);
                return (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.5 }}
                    whileHover={{ y: -6 }}
                    className="group relative"
                  >
                    {/* Outer glow on hover */}
                    <div
                      className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500`}
                    />

                    <Card
                      className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 cursor-pointer h-full shadow-sm hover:shadow-2xl"
                      onClick={() => navigate(`/student/tracks/${track.slug}`)}
                    >
                      {/* Top accent bar */}
                      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-l ${track.color}`} />

                      {/* Decorative gradient corner */}
                      <div
                        className={`absolute -top-20 -left-20 w-56 h-56 rounded-full bg-gradient-to-br ${track.color} opacity-[0.08] group-hover:opacity-20 group-hover:scale-125 transition-all duration-700`}
                      />
                      {/* Subtle inner pattern */}
                      <div
                        className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"
                        style={{
                          backgroundImage:
                            'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)',
                          backgroundSize: '20px 20px',
                        }}
                      />

                      <CardContent className="p-7 relative">
                        {/* Icon + Premium chip */}
                        <div className="flex items-start justify-between mb-5">
                          <motion.div
                            whileHover={{ rotate: [0, -6, 6, 0], scale: 1.08 }}
                            transition={{ duration: 0.5 }}
                            className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${track.color} flex items-center justify-center shadow-lg`}
                          >
                            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Icon className="w-8 h-8 text-white relative z-10 drop-shadow" />
                          </motion.div>

                          <Badge
                            variant="outline"
                            className="bg-background/80 backdrop-blur border-primary/20 text-[10px] font-semibold tracking-wider uppercase text-primary/80"
                          >
                            <Sparkles className="w-3 h-3 ms-1" />
                            AI
                          </Badge>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                          {track.name_ar}
                        </h3>

                        {/* English name */}
                        <p className="text-xs font-medium text-muted-foreground/80 mb-3 tracking-wide uppercase">
                          {track.name_en}
                        </p>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6 min-h-[60px]">
                          {track.description_ar}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-border/60">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="flex -space-x-1.5 rtl:space-x-reverse">
                              {[...Array(3)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${track.color} border-2 border-card shadow-sm`}
                                />
                              ))}
                            </div>
                            <span className="ms-1 font-medium">+ أدوات</span>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-primary hover:text-primary hover:bg-primary/10 group-hover:gap-2 transition-all font-semibold"
                          >
                            استكشف
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bottom CTA strip */}
          {!loading && tracks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent backdrop-blur p-8 md:p-10"
            >
              <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-right">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    لم تجد المسار المناسب؟
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    تواصل معنا واطلب مسارًا مخصصًا لتخصصك — فريقنا جاهز لخدمتك.
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => navigate('/student/support')}
                  className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  اطلب مسارًا مخصصًا
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
