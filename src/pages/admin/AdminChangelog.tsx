import React, { useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  History, Database, Server, FileCode, Search, Calendar,
  Trash2, AlertCircle, CheckCircle2, Layers,
} from 'lucide-react';

type ItemKind = 'table' | 'function' | 'edge_function' | 'page' | 'component' | 'hook' | 'service';

interface ChangelogItem {
  kind: ItemKind;
  name: string;
  detail?: string;
}

interface ChangelogEntry {
  id: string;
  date: string; // ISO
  title: string;
  summary: string;
  feature: string;
  featureColor: string;
  items: ChangelogItem[];
}

const ENTRIES: ChangelogEntry[] = [
  {
    id: 'cleanup-final-db-2026-04-25',
    date: '2026-04-25T19:00:00Z',
    title: 'تدقيق نهائي لقاعدة البيانات — لا بقايا',
    summary:
      'تدقيق شامل لقاعدة البيانات للتأكد من إزالة جميع البقايا (جداول، دوال، أنواع، triggers، indexes، RLS policies، realtime، cron). النتيجة: 0 بقايا.',
    feature: 'تدقيق',
    featureColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    items: [
      { kind: 'table', name: 'فحص شامل', detail: '0 جدول/دالة/نوع/trigger متبقٍ مرتبط بالميزات المحذوفة' },
    ],
  },
  {
    id: 'cleanup-db-functions-2026-04-25',
    date: '2026-04-25T18:45:00Z',
    title: 'حذف 21 دالة قاعدة بيانات يتيمة',
    summary:
      'حذف الدوال البرمجية المتبقية في قاعدة البيانات والمرتبطة بالميزات الأربع المحذوفة، باستخدام DO block ديناميكي للتعامل مع function overloads.',
    feature: 'قاعدة البيانات',
    featureColor: 'bg-blue-500/10 text-blue-700 border-blue-200',
    items: [
      { kind: 'function', name: 'confirm_marketplace_gateway_purchase' },
      { kind: 'function', name: 'get_marketplace_funnel_report' },
      { kind: 'function', name: 'get_marketplace_item_pricing' },
      { kind: 'function', name: 'get_marketplace_metrics' },
      { kind: 'function', name: 'purchase_marketplace_item', detail: '3 overloads' },
      { kind: 'function', name: 'purchase_marketplace_with_wallet' },
      { kind: 'function', name: 'track_marketplace_event' },
      { kind: 'function', name: 'track_marketplace_view' },
      { kind: 'function', name: 'complete_battle_quiz_attempt' },
      { kind: 'function', name: 'flag_battle_quiz_event' },
      { kind: 'function', name: 'get_battle_quiz_leaderboard' },
      { kind: 'function', name: 'start_battle_quiz_attempt' },
      { kind: 'function', name: 'start_battle_quiz_1v1_attempt' },
      { kind: 'function', name: 'submit_battle_quiz_answer' },
      { kind: 'function', name: 'test_start_battle_quiz_1v1_attempt' },
      { kind: 'function', name: 'get_active_question_bank_subscription' },
      { kind: 'function', name: 'get_question_bank_stats' },
      { kind: 'function', name: 'start_daily_challenge_attempt' },
      { kind: 'function', name: 'submit_daily_challenge_attempt' },
      { kind: 'function', name: 'tg_notify_new_daily_challenge', detail: 'trigger function' },
    ],
  },
  {
    id: 'cleanup-orphan-files-2026-04-25',
    date: '2026-04-25T18:20:00Z',
    title: 'فحص آلي وحذف ملفات يتيمة',
    summary:
      'فحص شامل للمشروع للبحث عن مراجع مكسورة للميزات المحذوفة. اكتُشفت 4 ملفات تستدعي جداول/RPCs محذوفة + أيقونات قديمة في NotificationCenter.',
    feature: 'تنظيف الكود',
    featureColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
    items: [
      { kind: 'hook', name: 'useDailyChallenge.ts' },
      { kind: 'service', name: 'dailyChallengeService.ts' },
      { kind: 'hook', name: 'useXpEconomy.ts' },
      { kind: 'service', name: 'xpEconomyService.ts' },
      { kind: 'component', name: 'NotificationCenter.tsx', detail: 'إزالة marketplace_success/failed' },
    ],
  },
  {
    id: 'remove-features-2026-04-25',
    date: '2026-04-25T18:10:00Z',
    title: 'حذف شامل لمتجر XP وأكاديمية التحدي وأكاديمية المبارزة وبنك الأسئلة',
    summary:
      'إزالة كاملة من قاعدة البيانات + Edge Functions + الواجهة الأمامية. إسقاط ~40 جدول و10+ enums باستخدام CASCADE، وحذف الصفحات والمكونات والـ routing.',
    feature: 'إزالة ميزات',
    featureColor: 'bg-red-500/10 text-red-700 border-red-200',
    items: [
      // Tables
      { kind: 'table', name: 'marketplace_items + marketplace_purchases + user_discount_coupons', detail: 'متجر XP' },
      { kind: 'table', name: 'challenge_levels + challenge_submissions + daily_challenges', detail: 'أكاديمية التحدي' },
      { kind: 'table', name: 'battle_quiz_rooms + battle_quiz_1v1_matches + battle_quiz_questions', detail: 'أكاديمية المبارزة' },
      { kind: 'table', name: 'question_bank_sessions + question_bank_attempts', detail: 'بنك الأسئلة' },
      // Edge Functions
      { kind: 'edge_function', name: 'marketplace-gateway-checkout' },
      { kind: 'edge_function', name: 'generate-questions' },
      { kind: 'edge_function', name: 'medical-quiz-generator' },
      // Pages
      { kind: 'page', name: 'client/Marketplace.tsx' },
      { kind: 'page', name: 'client/MarketplaceRewards.tsx' },
      { kind: 'page', name: 'client/ChallengeAcademy.tsx' },
      { kind: 'page', name: 'admin/AdminMarketplaceFunnel.tsx' },
      { kind: 'page', name: 'admin/AdminBattleQuiz.tsx' },
      { kind: 'page', name: 'admin/AdminQuestionBank.tsx' },
      { kind: 'page', name: 'QuizBank.tsx + QuizBankAccount + QuizBankBrowse + QuizBankResults + QuizBankSubject' },
      { kind: 'page', name: 'battle-quiz/BattleQuizHome + Play + Result + Leaderboard' },
      { kind: 'page', name: 'battle-quiz/BattleQuiz1v1Invite + Lobby + Play + Result + Leaderboard' },
      // Components
      { kind: 'component', name: 'challenge-academy/* (12 ملف)' },
      { kind: 'component', name: 'battle-quiz/* (2 ملف)' },
      { kind: 'component', name: 'marketplace/MarketplaceItemCard' },
      { kind: 'component', name: 'client/XpWalletWidget + DashboardChallengeNotice' },
      // Hooks/Services
      { kind: 'hook', name: 'useChallengeAcademy + useChallengeReferral + useMarketplace' },
      { kind: 'hook', name: 'useBattleQuizAntiCheat + useBattleQuizSuspicion + useBattleQuizTimer' },
      { kind: 'service', name: 'questionBankService + challengeAcademyService + marketplaceService' },
      { kind: 'service', name: 'battleQuizService + battleQuiz1v1Service + battleQuizScoring' },
    ],
  },
];

const KIND_META: Record<ItemKind, { label: string; icon: React.ElementType; color: string }> = {
  table: { label: 'جدول', icon: Database, color: 'text-blue-600 bg-blue-50' },
  function: { label: 'دالة DB', icon: Layers, color: 'text-purple-600 bg-purple-50' },
  edge_function: { label: 'Edge Function', icon: Server, color: 'text-orange-600 bg-orange-50' },
  page: { label: 'صفحة', icon: FileCode, color: 'text-emerald-600 bg-emerald-50' },
  component: { label: 'مكوّن', icon: FileCode, color: 'text-cyan-600 bg-cyan-50' },
  hook: { label: 'Hook', icon: FileCode, color: 'text-pink-600 bg-pink-50' },
  service: { label: 'خدمة', icon: FileCode, color: 'text-indigo-600 bg-indigo-50' },
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('ar-SA', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const AdminChangelog: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | ItemKind>('all');

  const stats = useMemo(() => {
    const counts = { table: 0, function: 0, edge_function: 0, page: 0, component: 0, hook: 0, service: 0 };
    ENTRIES.forEach((e) => e.items.forEach((i) => { counts[i.kind]++; }));
    return counts;
  }, []);

  const totalItems = useMemo(
    () => ENTRIES.reduce((s, e) => s + e.items.length, 0),
    [],
  );

  const filteredEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ENTRIES
      .map((entry) => {
        const items = entry.items.filter((it) => {
          if (tab !== 'all' && it.kind !== tab) return false;
          if (!q) return true;
          return (
            it.name.toLowerCase().includes(q) ||
            (it.detail || '').toLowerCase().includes(q) ||
            entry.title.toLowerCase().includes(q) ||
            entry.feature.toLowerCase().includes(q)
          );
        });
        return { ...entry, items };
      })
      .filter((e) => e.items.length > 0);
  }, [search, tab]);

  const lastCleanup = ENTRIES[0]?.date;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto" dir="rtl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground flex items-center justify-center">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">سجل التغييرات</h1>
              <p className="text-sm text-muted-foreground">
                ما تم حذفه وتنظيفه في النظام مع التواريخ والتفاصيل
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Calendar className="w-3.5 h-3.5" />
                آخر عملية تنظيف
              </div>
              <p className="text-sm font-bold">{lastCleanup ? formatDate(lastCleanup) : '—'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Trash2 className="w-3.5 h-3.5" />
                إجمالي العناصر المحذوفة
              </div>
              <p className="text-2xl font-black">{totalItems}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Database className="w-3.5 h-3.5" />
                جداول + دوال DB
              </div>
              <p className="text-2xl font-black">{stats.table + stats.function}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                حالة النظام
              </div>
              <p className="text-sm font-bold text-emerald-700">نظيف 100%</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-4">
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في السجل..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList className="flex-wrap h-auto justify-start gap-1">
                <TabsTrigger value="all">الكل ({totalItems})</TabsTrigger>
                <TabsTrigger value="table">جداول ({stats.table})</TabsTrigger>
                <TabsTrigger value="function">دوال DB ({stats.function})</TabsTrigger>
                <TabsTrigger value="edge_function">Edge ({stats.edge_function})</TabsTrigger>
                <TabsTrigger value="page">صفحات ({stats.page})</TabsTrigger>
                <TabsTrigger value="component">مكوّنات ({stats.component})</TabsTrigger>
                <TabsTrigger value="hook">Hooks ({stats.hook})</TabsTrigger>
                <TabsTrigger value="service">خدمات ({stats.service})</TabsTrigger>
              </TabsList>
              <TabsContent value={tab} />
            </Tabs>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-muted-foreground">
                <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                لا نتائج مطابقة
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map((entry) => (
              <Card key={entry.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <Badge variant="outline" className={entry.featureColor}>
                          {entry.feature}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(entry.date)}
                        </span>
                      </div>
                      <CardTitle className="text-base font-bold leading-tight">
                        {entry.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {entry.summary}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {entry.items.length} عنصر
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="max-h-80">
                    <ul className="divide-y divide-border">
                      {entry.items.map((it, idx) => {
                        const meta = KIND_META[it.kind];
                        const Icon = meta.icon;
                        return (
                          <li key={idx} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40">
                            <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${meta.color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-mono font-medium truncate">{it.name}</p>
                              {it.detail && (
                                <p className="text-[11px] text-muted-foreground truncate">{it.detail}</p>
                              )}
                            </div>
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              {meta.label}
                            </Badge>
                          </li>
                        );
                      })}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChangelog;
