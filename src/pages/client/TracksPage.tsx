import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ClientLayout from '@/components/client/ClientLayout';
import { useTracks } from '@/hooks/useTracks';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function TracksPage() {
  const navigate = useNavigate();
  const { tracks, loading } = useTracks();

  const getIcon = (name: string) => {
    const Icon = (Icons as any)[name] || Icons.GraduationCap;
    return Icon;
  };

  return (
    <ClientLayout>
      <div dir="rtl" className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">المسارات التخصصية</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-primary to-primary/60 bg-clip-text text-transparent">
            اختر مسارك التخصصي
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            أدوات ذكاء اصطناعي وخدمات احترافية مصمَّمة لكل تخصص — استخدم رصيد محفظتك للوصول الفوري
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {/* Tracks Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track, idx) => {
              const Icon = getIcon(track.icon);
              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card
                    className="group relative overflow-hidden border-2 hover:border-primary/40 hover:shadow-2xl transition-all duration-300 cursor-pointer h-full"
                    onClick={() => navigate(`/student/tracks/${track.slug}`)}
                  >
                    {/* Gradient bar */}
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-l ${track.color}`} />
                    {/* Decorative gradient blob */}
                    <div className={`absolute -top-12 -left-12 w-32 h-32 rounded-full bg-gradient-to-br ${track.color} opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500`} />

                    <CardContent className="p-6 relative">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${track.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{track.name_ar}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 min-h-[60px]">
                        {track.description_ar}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {track.name_en}
                        </Badge>
                        <Button variant="ghost" size="sm" className="gap-1 group-hover:gap-2 transition-all">
                          استكشف
                          <ArrowLeft className="w-4 h-4" />
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
    </ClientLayout>
  );
}
