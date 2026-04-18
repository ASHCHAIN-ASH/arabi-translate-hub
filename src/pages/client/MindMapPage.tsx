import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReactFlow, Background, Controls, MiniMap, ReactFlowProvider,
  useNodesState, useEdgesState, useReactFlow,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useAuth } from '@/components/SimpleAuthProvider';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Sparkles, Network, Languages, Download, FileImage, FileText as FileIcon,
  Crown, Lock, RefreshCw, Save, Trash2, ArrowRight, Loader2, Info, Wand2,
} from 'lucide-react';
import { toast } from 'sonner';

import { useMindMapGenerator, useSavedMindMaps, type MindMapLang, type MindMapData } from '@/hooks/useMindMap';
import { useUserMembership } from '@/hooks/useMembership';
import { buildFlow } from '@/components/student/mind-map/mindMapLayout';
import MindNode from '@/components/student/mind-map/MindNode';
import { exportToPNG, exportToPDF } from '@/components/student/mind-map/exportMindMap';

const nodeTypes: NodeTypes = { mindNode: MindNode };

const PLACEHOLDER_AR = `ألصق نصاً أكاديمياً، فصلاً من كتاب، ملخص محاضرة، أو أي محتوى تريد تنظيمه بصرياً...

مثال: "إدارة الوقت من المهارات الأساسية للطالب الجامعي. تتضمن تنظيم الجدول اليومي، تحديد الأولويات، تقسيم المهام الكبيرة إلى أجزاء صغيرة، والابتعاد عن المشتتات. الطرق الفعّالة تشمل تقنية بومودورو، مصفوفة آيزنهاور، والتخطيط الأسبوعي."`;

const PLACEHOLDER_EN = `Paste any academic text, book chapter, lecture notes, or content you want to organize visually...

Example: "Time management is a core skill for students. It includes daily scheduling, prioritization, breaking large tasks into smaller ones, and minimizing distractions. Effective methods include the Pomodoro technique, the Eisenhower matrix, and weekly planning."`;

function MindMapCanvas({
  map,
  canvasRef,
}: {
  map: MindMapData;
  canvasRef: React.RefObject<HTMLDivElement>;
}) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => buildFlow(map), [map]);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();

  useEffect(() => {
    const t = setTimeout(() => fitView({ padding: 0.2, duration: 600 }), 80);
    return () => clearTimeout(t);
  }, [fitView, map]);

  return (
    <div ref={canvasRef} className="w-full h-[600px] rounded-2xl border-2 border-border bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        edgesFocusable={false}
      >
        <Background gap={24} size={1.2} color="hsl(var(--muted-foreground) / 0.15)" />
        <Controls position="bottom-left" showInteractive={false} />
        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          nodeColor={(n: any) => (n.data?.color as string) || 'hsl(var(--primary))'}
          style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
        />
      </ReactFlow>
    </div>
  );
}

const MindMapPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { membership } = useUserMembership(user?.id);
  const isPremium = !!membership && membership.status === 'active';

  const [text, setText] = useState('');
  const [language, setLanguage] = useState<MindMapLang>('ar');
  const [title, setTitle] = useState('');
  const [exporting, setExporting] = useState<null | 'png' | 'pdf'>(null);

  const { generate, loading, error, data, remaining, limit, setData } = useMindMapGenerator();
  const { maps, save, remove, refresh } = useSavedMindMaps(user?.id);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(async () => {
    if (text.trim().length < 30) {
      toast.error(language === 'ar' ? 'الرجاء إدخال 30 حرفاً على الأقل' : 'Please enter at least 30 characters');
      return;
    }
    const result = await generate(text, language);
    if (result) {
      setTitle(result.title || result.central_topic);
      toast.success(language === 'ar' ? '✨ تم توليد خريطتك!' : '✨ Mind map generated!');
    }
  }, [text, language, generate]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleExportPNG = useCallback(async () => {
    if (!canvasRef.current || !data) return;
    setExporting('png');
    try {
      const safeTitle = (title || 'mind-map').replace(/[^\p{L}\p{N}\s-]/gu, '').slice(0, 60).trim() || 'mind-map';
      await exportToPNG(canvasRef.current, `${safeTitle}.png`);
      toast.success(language === 'ar' ? '✅ تم تحميل الصورة' : '✅ PNG downloaded');
    } catch (e: any) {
      toast.error(e?.message || (language === 'ar' ? 'فشل التحميل' : 'Export failed'));
    } finally {
      setExporting(null);
    }
  }, [data, title, language]);

  const handleExportPDF = useCallback(async () => {
    if (!isPremium) {
      toast.error(language === 'ar' ? '🔒 تحميل PDF متاح للأعضاء فقط' : '🔒 PDF export is Premium only');
      return;
    }
    if (!canvasRef.current || !data) return;
    setExporting('pdf');
    try {
      const safeTitle = (title || 'mind-map').replace(/[^\p{L}\p{N}\s-]/gu, '').slice(0, 60).trim() || 'mind-map';
      await exportToPDF(canvasRef.current, `${safeTitle}.pdf`, title);
      toast.success(language === 'ar' ? '✅ تم تحميل PDF' : '✅ PDF downloaded');
    } catch (e: any) {
      toast.error(e?.message || (language === 'ar' ? 'فشل التحميل' : 'Export failed'));
    } finally {
      setExporting(null);
    }
  }, [data, title, language, isPremium]);

  const handleSave = useCallback(async () => {
    if (!isPremium) {
      toast.error(language === 'ar' ? '🔒 الحفظ متاح للأعضاء فقط' : '🔒 Saving is Premium only');
      return;
    }
    if (!data) return;
    const { error } = await save({
      title: title || data.central_topic,
      language,
      source_text: text,
      map_data: data,
    });
    if (error) toast.error(language === 'ar' ? 'فشل الحفظ' : 'Save failed');
    else toast.success(language === 'ar' ? '💾 تم حفظ الخريطة' : '💾 Map saved');
  }, [isPremium, data, title, language, text, save]);

  const loadSaved = useCallback((m: any) => {
    setData(m.map_data);
    setTitle(m.title);
    setLanguage(m.language);
    setText(m.source_text || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setData]);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <ClientLayout>
      <div dir={dir} className="space-y-6 pb-12" style={{ fontFamily: '"IBM Plex Sans Arabic", system-ui, sans-serif' }}>
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 p-8 text-white shadow-2xl"
        >
          <div className="absolute inset-0 opacity-30">
            <motion.div
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/20 blur-3xl"
            />
            <motion.div
              animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-0 right-20 w-56 h-56 rounded-full bg-yellow-300/20 blur-3xl"
            />
          </div>

          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                <Network className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {language === 'ar' ? 'الخريطة الذهنية الذكية' : 'AI Mind Map'}
                  </h1>
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur">
                    <Sparkles className="w-3 h-3 me-1" /> {language === 'ar' ? 'ذكاء اصطناعي' : 'AI Powered'}
                  </Badge>
                </div>
                <p className="text-white/90 text-sm md:text-base max-w-xl">
                  {language === 'ar'
                    ? 'حوّل أي نص إلى خريطة ذهنية تفاعلية احترافية في ثوانٍ — بالعربية أو الإنجليزية'
                    : 'Turn any text into a professional interactive mind map in seconds — Arabic or English'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild variant="secondary" size="sm" className="bg-white/15 hover:bg-white/25 border-0 text-white backdrop-blur">
                <Link to="/student">
                  <ArrowRight className="w-4 h-4 me-1" />
                  {language === 'ar' ? 'قسم الطالب' : 'Student Hub'}
                </Link>
              </Button>
            </div>
          </div>

          {limit !== null && (
            <div className="relative mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-2 text-sm">
              <Info className="w-4 h-4" />
              {language === 'ar'
                ? `استخدامك اليوم: ${(limit ?? 0) - (remaining ?? 0)}/${limit} — ${isPremium ? 'بريميوم' : 'مجاني'}`
                : `Today: ${(limit ?? 0) - (remaining ?? 0)}/${limit} — ${isPremium ? 'Premium' : 'Free'}`}
            </div>
          )}
        </motion.div>

        {/* Input panel */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-primary" />
                  {language === 'ar' ? 'أدخل نصك' : 'Enter your text'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'بين 30 و 8000 حرف' : 'Between 30 and 8000 characters'}
                </CardDescription>
              </div>

              {/* Language switch */}
              <div className="flex items-center gap-1 bg-muted rounded-full p-1">
                <button
                  onClick={() => setLanguage('ar')}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    language === 'ar' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {language === 'ar' && (
                    <motion.div
                      layoutId="lang-pill"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5" /> العربية
                  </span>
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    language === 'en' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {language === 'en' && (
                    <motion.div
                      layoutId="lang-pill"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5" /> English
                  </span>
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Textarea
              dir={dir}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={language === 'ar' ? PLACEHOLDER_AR : PLACEHOLDER_EN}
              rows={8}
              className="text-base resize-y min-h-[180px]"
              maxLength={8000}
            />
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="text-xs text-muted-foreground">
                {text.length} / 8000
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => { setText(''); setData(null); }} disabled={loading}>
                  {language === 'ar' ? 'مسح' : 'Clear'}
                </Button>
                <Button onClick={handleGenerate} disabled={loading || text.trim().length < 30} className="gap-2 min-w-[160px]">
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {language === 'ar' ? 'جاري التوليد...' : 'Generating...'}</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> {language === 'ar' ? 'توليد الخريطة' : 'Generate Map'}</>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading skeleton */}
        <AnimatePresence>
          {loading && !data && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-[400px] w-full rounded-xl" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence mode="wait">
          {data && (
            <motion.div
              key={data.central_topic}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex-1 min-w-[200px]">
                      <Input
                        dir={dir}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg font-semibold border-0 focus-visible:ring-1 px-2"
                        placeholder={language === 'ar' ? 'عنوان الخريطة' : 'Map title'}
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button size="sm" variant="outline" onClick={handleGenerate} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span className="ms-1 hidden sm:inline">{language === 'ar' ? 'إعادة' : 'Regenerate'}</span>
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleExportPNG} disabled={!!exporting}>
                        {exporting === 'png' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileImage className="w-4 h-4" />}
                        <span className="ms-1 hidden sm:inline">PNG</span>
                      </Button>
                      <Button size="sm" variant={isPremium ? 'outline' : 'secondary'} onClick={handleExportPDF} disabled={!!exporting}>
                        {exporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : (isPremium ? <FileIcon className="w-4 h-4" /> : <Lock className="w-4 h-4" />)}
                        <span className="ms-1 hidden sm:inline">PDF</span>
                        {!isPremium && <Crown className="w-3.5 h-3.5 ms-1 text-amber-500" />}
                      </Button>
                      <Button size="sm" onClick={handleSave} className="gap-1">
                        {isPremium ? <Save className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        <span className="hidden sm:inline">{language === 'ar' ? 'حفظ' : 'Save'}</span>
                        {!isPremium && <Crown className="w-3.5 h-3.5 ms-1 text-amber-300" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ReactFlowProvider>
                    <MindMapCanvas map={data} canvasRef={canvasRef} />
                  </ReactFlowProvider>
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    {language === 'ar'
                      ? 'يمكنك سحب العقد، التكبير، والتحريك. للتحميل بدقة عالية استخدم زر PNG أو PDF.'
                      : 'Drag nodes, zoom, and pan. Use PNG or PDF buttons for HD export.'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved maps (premium) */}
        {isPremium && maps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Save className="w-5 h-5 text-primary" />
                {language === 'ar' ? 'خرائطي المحفوظة' : 'My Saved Maps'}
                <Badge variant="secondary">{maps.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {maps.map((m) => (
                  <motion.div
                    key={m.id}
                    whileHover={{ y: -2 }}
                    className="group p-4 rounded-xl border-2 border-border hover:border-primary/40 bg-card transition-colors cursor-pointer"
                    onClick={() => loadSaved(m)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{m.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(m.created_at).toLocaleDateString(m.language === 'ar' ? 'ar-SA' : 'en-US', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {m.language === 'ar' ? 'AR' : 'EN'}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {(m.map_data?.branches?.length || 0)} {language === 'ar' ? 'فرع' : 'branches'}
                      </span>
                      <Button
                        variant="ghost" size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-7 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(m.id).then(() => toast.success(language === 'ar' ? 'تم الحذف' : 'Deleted'));
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Premium CTA for free users */}
        {!isPremium && (
          <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
            <CardContent className="p-6 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {language === 'ar' ? 'افتح المزيد مع بريميوم' : 'Unlock more with Premium'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar'
                      ? '50 خريطة يومياً • تحميل PDF • حفظ مكتبتك الخاصة'
                      : '50 maps/day • PDF export • Save your library'}
                  </p>
                </div>
              </div>
              <Button onClick={() => navigate('/membership')} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white gap-2">
                <Crown className="w-4 h-4" />
                {language === 'ar' ? 'فعّل العضوية' : 'Get Premium'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
};

export default MindMapPage;
