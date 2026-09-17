import * as React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, AlertTriangle, TrendingUp, TrendingDown, CheckCircle2,
  XCircle, Activity, Gauge, Sparkles, Info,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  CreditScoringResult, CREDIT_SCORE_MIN, CREDIT_SCORE_MAX,
  AUTO_APPROVAL_THRESHOLD,
} from '@/lib/creditScoring';

interface Props {
  result: CreditScoringResult;
  compact?: boolean;
}

export const CreditScoreCard: React.FC<Props> = ({ result, compact }) => {
  const range = CREDIT_SCORE_MAX - CREDIT_SCORE_MIN;
  const pct = ((result.score - CREDIT_SCORE_MIN) / range) * 100;
  const thresholdPct = ((AUTO_APPROVAL_THRESHOLD - CREDIT_SCORE_MIN) / range) * 100;

  const decisionIcon =
    result.decision === 'AUTO_APPROVED' ? CheckCircle2 :
    result.decision === 'AUTO_REJECTED' ? XCircle : AlertTriangle;
  const DecisionIcon = decisionIcon;

  const decisionColor =
    result.decision === 'AUTO_APPROVED' ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30' :
    result.decision === 'AUTO_REJECTED' ? 'text-rose-600 bg-rose-500/10 border-rose-500/30' :
    'text-amber-600 bg-amber-500/10 border-amber-500/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-gradient-to-br from-card via-card to-muted/30 p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
            <Gauge className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-1.5">
              التقييم الائتماني التلقائي
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-right">
                    سكور ائتماني محسوب فوراً وفق نموذج SIMAH السعودي (300–900) بناءً على بيانات طلبك.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-[11px] text-muted-foreground">نموذج Fekrah PayLater Score™</div>
          </div>
        </div>
        <Badge className={`${result.gradeColor} border font-bold`}>
          <Sparkles className="h-3 w-3 me-1" />
          {result.gradeLabel}
        </Badge>
      </div>

      {/* Score circular display */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-44 h-44">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="85" fill="none"
              className="stroke-muted" strokeWidth="14" />
            <motion.circle
              cx="100" cy="100" r="85" fill="none"
              strokeWidth="14" strokeLinecap="round"
              className={
                result.score >= 740 ? 'stroke-emerald-500' :
                result.score >= 670 ? 'stroke-sky-500' :
                result.score >= 580 ? 'stroke-amber-500' :
                result.score >= 500 ? 'stroke-orange-500' : 'stroke-rose-500'
              }
              strokeDasharray={`${2 * Math.PI * 85}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 85 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 85 * (1 - pct / 100) }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              key={result.score}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-4xl font-black tracking-tight"
            >
              {result.score}
            </motion.div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              من {CREDIT_SCORE_MAX}
            </div>
          </div>
        </div>
      </div>

      {/* Range bar with threshold marker */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
          <span>{CREDIT_SCORE_MIN}</span>
          <span>عتبة الموافقة التلقائية: {AUTO_APPROVAL_THRESHOLD}</span>
          <span>{CREDIT_SCORE_MAX}</span>
        </div>
        <div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              result.score >= 740 ? 'bg-gradient-to-l from-emerald-400 to-emerald-600' :
              result.score >= 670 ? 'bg-gradient-to-l from-sky-400 to-sky-600' :
              result.score >= 580 ? 'bg-gradient-to-l from-amber-400 to-amber-600' :
              result.score >= 500 ? 'bg-gradient-to-l from-orange-400 to-orange-600' :
              'bg-gradient-to-l from-rose-400 to-rose-600'
            }`}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-foreground/60"
            style={{ left: `${thresholdPct}%` }}
          />
        </div>
      </div>

      {/* Decision banner */}
      <div className={`rounded-xl border p-3 mb-4 ${decisionColor}`}>
        <div className="flex items-start gap-2">
          <DecisionIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-sm">{result.decisionLabel}</div>
            <div className="text-xs mt-0.5 opacity-90">{result.recommendation}</div>
          </div>
        </div>
      </div>

      {/* Quick metrics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-lg bg-muted/40 p-2.5">
          <div className="text-[10px] text-muted-foreground mb-0.5">نسبة الالتزامات (DTI)</div>
          <div className={`text-sm font-bold ${result.dti <= 0.35 ? 'text-emerald-600' : result.dti <= 0.5 ? 'text-amber-600' : 'text-rose-600'}`}>
            {(result.dti * 100).toFixed(1)}%
          </div>
        </div>
        <div className="rounded-lg bg-muted/40 p-2.5">
          <div className="text-[10px] text-muted-foreground mb-0.5">قدرة السداد بعد التمويل</div>
          <div className={`text-sm font-bold ${result.affordabilityRatio <= 0.45 ? 'text-emerald-600' : result.affordabilityRatio <= 0.6 ? 'text-amber-600' : 'text-rose-600'}`}>
            {(result.affordabilityRatio * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Factors */}
      {!compact && (
        <div>
          <div className="text-xs font-bold mb-2 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-primary" />
            العوامل المؤثرة في السكور
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pe-1">
            {result.factors.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start justify-between gap-2 text-xs rounded-lg bg-background border p-2"
              >
                <div className="flex items-start gap-1.5 flex-1 min-w-0">
                  {f.type === 'positive' ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : f.type === 'negative' ? (
                    <TrendingDown className="h-3.5 w-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{f.label}</div>
                    <div className="text-[10px] text-muted-foreground">{f.description}</div>
                  </div>
                </div>
                <div className={`text-xs font-bold whitespace-nowrap ${
                  f.impact > 0 ? 'text-emerald-600' :
                  f.impact < 0 ? 'text-rose-600' : 'text-muted-foreground'
                }`}>
                  {f.impact > 0 ? '+' : ''}{f.impact}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="text-[10px] text-muted-foreground mt-3 text-center border-t pt-2">
        تقييم استرشادي تلقائي — القرار النهائي يصدر بعد المراجعة الائتمانية الكاملة
      </div>
    </motion.div>
  );
};
