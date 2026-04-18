import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Upload, BarChart3, FileSpreadsheet, CheckCircle2, AlertTriangle, Download, Sparkles, ArrowLeft, Loader2, Database, Calculator, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { parseFile, ParsedData } from '@/features/statistical-analysis/parser';
import { ANALYSES, AnalysisType, ColumnMeta, DataProfile } from '@/features/statistical-analysis/types';
import { useStatEngine } from '@/features/statistical-analysis/useStatEngine';
import { generateInterpretation } from '@/features/statistical-analysis/interpretation';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function StudentStatisticalAnalysis() {
  const navigate = useNavigate();
  const { call, loading } = useStatEngine();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [parsed, setParsed] = useState<ParsedData | null>(null);
  const [profile, setProfile] = useState<DataProfile | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('descriptives');
  const [params, setParams] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any>(null);
  const [interpretation, setInterpretation] = useState<{academic: string; simple: string; recommendation: string} | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  const numericCols = useMemo(() => profile?.columns_meta.filter(c => c.type === 'numeric') || [], [profile]);
  const categoricalCols = useMemo(() => profile?.columns_meta.filter(c => c.type === 'categorical' || c.type === 'binary') || [], [profile]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 10 * 1024 * 1024) { toast.error('الحد الأقصى 10MB'); return; }
    try {
      const data = await parseFile(f);
      if (data.rows.length < 3) { toast.error('الملف يحتاج 3 صفوف بيانات على الأقل'); return; }
      setParsed(data);
      const prof = await call('profile', { columns: data.columns, rows: data.rows.slice(0, 5000) });
      setProfile(prof);
      setStep(2);
      toast.success(`تم تحميل ${data.rows.length} صف و ${data.columns.length} عمود`);
    } catch (e: any) { toast.error(e.message); }
  };

  const colIndex = (name: string) => parsed!.columns.indexOf(name);
  const colValues = (name: string) => parsed!.rows.map(r => r[colIndex(name)]);

  const runAnalysis = async () => {
    if (!parsed) return;
    try {
      let action = analysisType, payload: any = {};
      const meta = ANALYSES.find(a => a.key === analysisType)!;

      if (analysisType === 'descriptives') {
        payload = { values: colValues(params.variable) };
      } else if (analysisType === 'ttest_independent') {
        const groupCol = colValues(params.group);
        const dvCol = colValues(params.dv);
        const groups = new Map<string, number[]>();
        groupCol.forEach((g, i) => {
          const key = String(g);
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key)!.push(parseFloat(String(dvCol[i])));
        });
        const keys = [...groups.keys()];
        if (keys.length !== 2) { toast.error('متغير المجموعة يجب أن يحتوي على مجموعتين بالضبط'); return; }
        payload = { group1: groups.get(keys[0])!.filter(n => !isNaN(n)), group2: groups.get(keys[1])!.filter(n => !isNaN(n)) };
      } else if (analysisType === 'ttest_paired') {
        payload = { before: colValues(params.before), after: colValues(params.after) };
      } else if (analysisType === 'correlation_pearson' || analysisType === 'correlation_spearman') {
        action = 'correlation';
        payload = { x: colValues(params.x), y: colValues(params.y), method: analysisType === 'correlation_pearson' ? 'pearson' : 'spearman' };
      } else if (analysisType === 'chi_square') {
        const xVals = colValues(params.x).map(String);
        const yVals = colValues(params.y).map(String);
        const xCats = [...new Set(xVals)], yCats = [...new Set(yVals)];
        const table = xCats.map(xc => yCats.map(yc => xVals.filter((v, i) => v === xc && yVals[i] === yc).length));
        payload = { table };
      } else if (analysisType === 'anova') {
        const groupCol = colValues(params.group);
        const dvCol = colValues(params.dv);
        const grouped = new Map<string, number[]>();
        groupCol.forEach((g, i) => {
          const key = String(g);
          if (!grouped.has(key)) grouped.set(key, []);
          grouped.get(key)!.push(parseFloat(String(dvCol[i])));
        });
        if (grouped.size < 2) { toast.error('يجب وجود مجموعتين على الأقل'); return; }
        payload = { groups: [...grouped.values()] };
      } else if (analysisType === 'regression') {
        payload = { x: colValues(params.x), y: colValues(params.y) };
      }

      const data = await call(action, payload);
      setResults(data);
      setInterpretation(generateInterpretation(analysisType, data, params));

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: saved } = await supabase.from('statistical_analyses').insert({
          user_id: user.id,
          title: `${meta.name_ar} - ${parsed.fileName}`,
          file_name: parsed.fileName,
          file_size: parsed.fileSize,
          row_count: parsed.rows.length,
          column_count: parsed.columns.length,
          columns_meta: profile!.columns_meta as any,
          analysis_type: analysisType,
          analysis_params: params,
          results: data.results,
          assumptions: data.assumptions || {},
          interpretation_ar: generateInterpretation(analysisType, data, params).academic,
          status: 'completed',
        }).select('id').single();
        if (saved) setAnalysisId(saved.id);
      }
      setStep(4);
      toast.success('تم التحليل بنجاح');
    } catch (e: any) { toast.error(e.message); }
  };

  const purchaseAndExport = async () => {
    if (!analysisId) { toast.error('احفظ التحليل أولاً'); return; }
    setPurchasing(true);
    try {
      const { data: pay1, error: e1 } = await supabase.rpc('purchase_stat_analysis', { _analysis_id: analysisId });
      if (e1) throw e1;
      const { data: pay2, error: e2 } = await supabase.rpc('purchase_stat_pdf', { _analysis_id: analysisId });
      if (e2) throw e2;
      const charged = ((pay1 as any)?.charged || 0) + ((pay2 as any)?.charged || 0);
      if (charged > 0) toast.success(`تم خصم ${charged} ر.س من المحفظة`);
      else toast.success('متاح ضمن العضوية');
      await exportPdf();
    } catch (e: any) { toast.error(e.message); }
    finally { setPurchasing(false); }
  };

  const exportPdf = async () => {
    const node = document.getElementById('stat-report');
    if (!node) return;
    const canvas = await html2canvas(node, { scale: 2, backgroundColor: '#ffffff' });
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = 210, pageHeight = 297;
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let position = 10, heightLeft = imgHeight;
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 10, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - 20);
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 20);
    }
    pdf.save(`statistical-report-${Date.now()}.pdf`);
  };

  const meta = ANALYSES.find(a => a.key === analysisType)!;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" onClick={() => navigate('/student/hub')} className="mb-4">
          <ArrowLeft className="h-4 w-4 ms-2" /> العودة
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm mb-3">
            <Sparkles className="h-4 w-4" /> نظام تحليل إحصائي جامعي
          </div>
          <h1 className="text-4xl font-bold mb-2">التحليل الإحصائي الذكي</h1>
          <p className="text-muted-foreground">رفع ← فحص ← تحليل ← تفسير ← تقرير PDF</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          {[
            { n: 1, label: 'رفع الملف', icon: Upload },
            { n: 2, label: 'فحص البيانات', icon: Database },
            { n: 3, label: 'اختيار التحليل', icon: Calculator },
            { n: 4, label: 'النتائج', icon: FileText },
          ].map(({ n, label, icon: Icon }, i) => (
            <div key={n} className="flex items-center flex-1">
              <div className={`flex flex-col items-center gap-1 ${step >= n ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= n ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs">{label}</span>
              </div>
              {i < 3 && <div className={`flex-1 h-0.5 mx-2 ${step > n ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1: Upload */}
        {step === 1 && (
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-12 text-center hover:border-primary transition-colors">
                <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">ارفع ملف بياناتك</h3>
                <p className="text-muted-foreground mb-4">CSV، XLSX، XLS — حتى 10MB</p>
                <Input type="file" accept=".csv,.xlsx,.xls,.txt" onChange={handleFile} className="max-w-md mx-auto" disabled={loading} />
                {loading && <Loader2 className="h-6 w-6 animate-spin mx-auto mt-4 text-primary" />}
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm">رفع وفحص مجاني</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Calculator className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm">10 ر.س لكل تحليل</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm">5 ر.س لتقرير PDF</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: Profile */}
        {step === 2 && profile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5" /> فحص البيانات</CardTitle>
              <p className="text-sm text-muted-foreground">{parsed?.fileName} — {profile.n_rows} صف × {profile.n_cols} عمود</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-right p-2">العمود</th>
                      <th className="text-right p-2">النوع</th>
                      <th className="text-right p-2">قيم مفقودة</th>
                      <th className="text-right p-2">قيم فريدة</th>
                      <th className="text-right p-2">إحصاء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.columns_meta.map(c => (
                      <tr key={c.name} className="border-b">
                        <td className="p-2 font-medium">{c.name}</td>
                        <td className="p-2">
                          <Badge variant={c.type === 'numeric' ? 'default' : 'secondary'}>
                            {c.type === 'numeric' ? 'عددي' : c.type === 'binary' ? 'ثنائي' : 'فئوي'}
                          </Badge>
                        </td>
                        <td className="p-2">{c.missing} ({c.missing_pct.toFixed(1)}%)</td>
                        <td className="p-2">{c.unique}</td>
                        <td className="p-2 text-xs text-muted-foreground">
                          {c.type === 'numeric' ? `M=${c.mean?.toFixed(2)}, SD=${c.std?.toFixed(2)}` : (c.top_values?.slice(0, 3).join(', ') || '')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button onClick={() => setStep(3)} className="w-full mt-6">متابعة لاختيار التحليل</Button>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: Analysis selection */}
        {step === 3 && profile && (
          <Card>
            <CardHeader><CardTitle>اختر نوع التحليل</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                {ANALYSES.map(a => (
                  <button key={a.key} onClick={() => { setAnalysisType(a.key); setParams({}); }}
                    className={`text-right p-4 rounded-lg border-2 transition ${analysisType === a.key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    <div className="font-semibold mb-1">{a.name_ar}</div>
                    <div className="text-xs text-muted-foreground">{a.description_ar}</div>
                  </button>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <h4 className="font-semibold">إعدادات: {meta.name_ar}</h4>
                {analysisType === 'descriptives' && (
                  <VarPicker label="المتغير" options={numericCols} value={params.variable} onChange={v => setParams({variable: v})} />
                )}
                {analysisType === 'ttest_independent' && (<>
                  <VarPicker label="المتغير العددي" options={numericCols} value={params.dv} onChange={v => setParams({...params, dv: v})} />
                  <VarPicker label="متغير المجموعة (مجموعتان)" options={categoricalCols} value={params.group} onChange={v => setParams({...params, group: v})} />
                </>)}
                {analysisType === 'ttest_paired' && (<>
                  <VarPicker label="القياس قبل" options={numericCols} value={params.before} onChange={v => setParams({...params, before: v})} />
                  <VarPicker label="القياس بعد" options={numericCols} value={params.after} onChange={v => setParams({...params, after: v})} />
                </>)}
                {analysisType === 'anova' && (<>
                  <VarPicker label="المتغير العددي" options={numericCols} value={params.dv} onChange={v => setParams({...params, dv: v})} />
                  <VarPicker label="متغير المجموعة (3+)" options={categoricalCols} value={params.group} onChange={v => setParams({...params, group: v})} />
                </>)}
                {(analysisType === 'correlation_pearson' || analysisType === 'correlation_spearman' || analysisType === 'regression') && (<>
                  <VarPicker label={analysisType === 'regression' ? 'المستقل (X)' : 'المتغير X'} options={numericCols} value={params.x} onChange={v => setParams({...params, x: v})} />
                  <VarPicker label={analysisType === 'regression' ? 'التابع (Y)' : 'المتغير Y'} options={numericCols} value={params.y} onChange={v => setParams({...params, y: v})} />
                </>)}
                {analysisType === 'chi_square' && (<>
                  <VarPicker label="المتغير الفئوي 1" options={categoricalCols} value={params.x} onChange={v => setParams({...params, x: v})} />
                  <VarPicker label="المتغير الفئوي 2" options={categoricalCols} value={params.y} onChange={v => setParams({...params, y: v})} />
                </>)}
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>سيتم فحص الافتراضات الإحصائية تلقائيًا (التوزيع الطبيعي، تجانس التباين) واقتراح بدائل عند الحاجة.</AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>رجوع</Button>
                <Button onClick={runAnalysis} disabled={loading || Object.keys(params).length === 0} className="flex-1">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin ms-2" /> جارٍ التحليل...</> : 'تنفيذ التحليل'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: Results */}
        {step === 4 && results && interpretation && (
          <div className="space-y-4">
            <div id="stat-report" className="bg-white text-black p-6 rounded-lg" dir="rtl" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
              <div className="border-b-2 border-gray-800 pb-3 mb-4">
                <h2 className="text-2xl font-bold">{meta.name_ar}</h2>
                <p className="text-sm text-gray-600">{meta.name_en} | {parsed?.fileName} | N = {parsed?.rows.length}</p>
              </div>

              <h3 className="font-bold text-lg mt-4 mb-2 border-b">النتائج الإحصائية</h3>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono overflow-x-auto">
                <pre className="whitespace-pre-wrap">{JSON.stringify(results.results, null, 2)}</pre>
              </div>

              {results.assumptions && Object.keys(results.assumptions).length > 0 && (<>
                <h3 className="font-bold text-lg mt-4 mb-2 border-b">فحص الافتراضات</h3>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm">
                  {results.assumptions.recommendation && <p className="font-medium mb-2">⚠️ {results.assumptions.recommendation}</p>}
                  <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(results.assumptions, null, 2)}</pre>
                </div>
              </>)}

              <h3 className="font-bold text-lg mt-4 mb-2 border-b">التفسير الأكاديمي</h3>
              <p className="text-sm leading-relaxed text-justify">{interpretation.academic}</p>

              <h3 className="font-bold text-lg mt-4 mb-2 border-b">التفسير المبسط</h3>
              <p className="text-sm leading-relaxed">{interpretation.simple}</p>

              {interpretation.recommendation && (<>
                <h3 className="font-bold text-lg mt-4 mb-2 border-b">التوصية</h3>
                <p className="text-sm leading-relaxed">{interpretation.recommendation}</p>
              </>)}
            </div>

            <Card>
              <CardContent className="pt-6 flex flex-wrap gap-2">
                <Button onClick={purchaseAndExport} disabled={purchasing} className="flex-1">
                  {purchasing ? <Loader2 className="h-4 w-4 animate-spin ms-2" /> : <Download className="h-4 w-4 ms-2" />}
                  تحميل PDF (15 ر.س — مجاني للأعضاء)
                </Button>
                <Button variant="outline" onClick={() => { setStep(1); setParsed(null); setProfile(null); setResults(null); setInterpretation(null); setParams({}); setAnalysisId(null); }}>
                  تحليل جديد
                </Button>
                <Button variant="secondary" onClick={() => navigate('/services/statistical-analysis')}>
                  اطلب تحليل احترافي من مختص
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function VarPicker({ label, options, value, onChange }: { label: string; options: ColumnMeta[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue placeholder="اختر العمود..." /></SelectTrigger>
        <SelectContent>
          {options.map(c => <SelectItem key={c.name} value={c.name}>{c.name} ({c.type === 'numeric' ? 'عددي' : 'فئوي'})</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
