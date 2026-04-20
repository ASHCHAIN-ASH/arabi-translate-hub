import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Eye, X, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getContract, resolveContractDisplayContent } from '@/utils/supabaseContractService';

interface Props {
  contractId: string;
  contractNumber?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContractPdfDialog: React.FC<Props> = ({ contractId, contractNumber, open, onOpenChange }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [rawPdfUrl, setRawPdfUrl] = useState<string>('');
  const [meta, setMeta] = useState<{ version_no?: number; output_type?: string }>({});

  const shouldOpenExternally = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    return /iPad|iPhone|iPod|Macintosh/.test(ua) && /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/i.test(ua);
  }, []);

  useEffect(() => {
    if (!open || !contractId) return;
    void load();
  }, [open, contractId]);

  useEffect(() => {
    return () => {
      if (pdfUrl.startsWith('blob:')) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdfUrl || !shouldOpenExternally) return;
    window.open(pdfUrl, '_blank', 'noopener');
  }, [pdfUrl, shouldOpenExternally]);

  async function createSafePreviewUrl(url: string) {
    try {
      const res = await fetch(url);
      if (!res.ok) return url;
      const buffer = await res.arrayBuffer();
      const blob = new Blob([buffer], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch {
      return url;
    }
  }

  async function load() {
    setLoading(true);
    if (pdfUrl.startsWith('blob:')) URL.revokeObjectURL(pdfUrl);
    setPdfUrl('');
    setRawPdfUrl('');

    try {
      const contract = await getContract(contractId);
      const isSigned = contract?.status === 'signed' || contract?.status === 'active' || contract?.status === 'completed';
      const resolvedContent = contract ? resolveContractDisplayContent(contract as any) : '';

      const { data, error } = await supabase.functions.invoke('generate-contract-pdf', {
        body: {
          contract_id: contractId,
          mode: isSigned ? 'signed_final' : 'preview',
          override_content: isSigned ? resolvedContent : undefined,
          public_origin: window.location.origin,
        },
      });

      if (error) throw error;

      const url = (data as any)?.signed_url;
      if (!url) throw new Error('تعذر تجهيز ملف PDF');

      const safeUrl = await createSafePreviewUrl(url);
      setRawPdfUrl(url);
      setPdfUrl(safeUrl);

      const version = (data as any)?.version;
      setMeta({
        version_no: version?.version_no ?? (data as any)?.version_no,
        output_type: version?.output_type ?? (data as any)?.output_type,
      });
    } catch (e: any) {
      toast({ title: 'تعذر تحميل العقد', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  function downloadPdf() {
    const finalUrl = pdfUrl || rawPdfUrl;
    if (!finalUrl) return;

    if (finalUrl.startsWith('blob:')) {
      const link = document.createElement('a');
      link.href = finalUrl;
      link.download = `${contractNumber || contractId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

    window.open(finalUrl, '_blank', 'noopener');
  }

  function openOriginalPdf() {
    const finalUrl = pdfUrl || rawPdfUrl;
    if (!finalUrl) return;
    window.open(finalUrl, '_blank', 'noopener');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl w-[95vw] h-[92vh] p-0 flex flex-col gap-0 overflow-hidden"
        dir="rtl"
      >
        <DialogHeader className="px-5 py-3 border-b bg-gradient-to-l from-slate-900 to-indigo-950 text-white shrink-0">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-white flex items-center gap-2 text-base">
              <Eye className="h-5 w-5 text-amber-300" />
              معاينة العقد {contractNumber && <span className="text-amber-300 font-mono">#{contractNumber}</span>}
              {meta.output_type === 'signed_final' && meta.version_no && (
                <span className="text-xs bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  النسخة النهائية v{meta.version_no}
                </span>
              )}
              {meta.output_type === 'preview' && (
                <span className="text-xs bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/30">
                  معاينة
                </span>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={downloadPdf}
                disabled={loading || !pdfUrl}
                size="sm"
                className="bg-gradient-to-l from-amber-400 to-yellow-500 text-slate-900 hover:from-amber-500 hover:to-yellow-600 font-bold border-0"
              >
                <Download className="h-4 w-4 ml-2" /> تحميل PDF
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={openOriginalPdf}
                disabled={!pdfUrl}
                className="text-white hover:bg-white/10 h-8 w-8"
                title="فتح في تبويب جديد"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-white/10 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden bg-muted/30 relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">جاري تحضير ملف PDF…</p>
            </div>
          ) : pdfUrl ? shouldOpenExternally ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <p className="text-sm text-muted-foreground">تم فتح العقد الأصلي من داخل المنصة في تبويب جديد لعرضه كاملاً بشكل صحيح على هذا الجهاز.</p>
              <div className="flex items-center gap-2">
                <Button onClick={openOriginalPdf} size="sm">
                  <ExternalLink className="h-4 w-4 ml-2" /> فتح العقد الأصلي
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)} size="sm">
                  إغلاق
                </Button>
              </div>
            </div>
          ) : (
            <iframe
              title="contract-pdf-preview"
              src={pdfUrl}
              className="w-full h-full border-0 bg-white"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              لا يوجد ملف PDF متاح
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractPdfDialog;
