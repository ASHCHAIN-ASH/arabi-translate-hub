import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Eye, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadContractPdf, getContractPdfHtml } from '@/utils/supabaseContractService';

interface Props {
  contractId: string;
  contractNumber?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * يعرض معاينة العقد داخل Modal (iframe srcdoc) مع زر تحميل PDF حقيقي
 * بدون فتح أي نافذة جديدة. التحميل يتم عبر نافذة طباعة المتصفح المخفية
 * → "حفظ كـ PDF" والذي يعمل على جميع المتصفحات الحديثة.
 */
export const ContractPdfDialog: React.FC<Props> = ({ contractId, contractNumber, open, onOpenChange }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState<string>('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!open || !contractId) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, contractId]);

  async function load() {
    setLoading(true);
    try {
      const resolvedHtml = await getContractPdfHtml(contractId);
      setHtml(resolvedHtml);
    } catch (e: any) {
      toast({ title: 'تعذر تحميل العقد', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  /** تنزيل كـ PDF عبر طباعة iframe مخفي → المستخدم يختار "Save as PDF" */
  async function downloadPdf() {
    setDownloading(true);
    try {
      await downloadContractPdf(contractId);
      toast({
        title: '✓ نافذة الحفظ مفتوحة',
        description: 'اختر "حفظ كـ PDF" من قائمة الطباعة',
      });
    } catch (e: any) {
      toast({ title: 'تعذر التحميل', description: e.message, variant: 'destructive' });
    } finally {
      setDownloading(false);
    }
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
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={downloadPdf}
                disabled={downloading || loading || !html}
                size="sm"
                className="bg-gradient-to-l from-amber-400 to-yellow-500 text-slate-900 hover:from-amber-500 hover:to-yellow-600 font-bold border-0"
              >
                {downloading ? (
                  <><Loader2 className="h-4 w-4 ml-2 animate-spin" /> جاري التجهيز…</>
                ) : (
                  <><Download className="h-4 w-4 ml-2" /> تحميل PDF</>
                )}
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
              <p className="text-sm text-muted-foreground">جاري تحضير العقد…</p>
            </div>
          ) : html ? (
            <iframe
              title="contract-preview"
              srcDoc={html}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-same-origin allow-popups"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              لا يوجد محتوى للعقد
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractPdfDialog;
