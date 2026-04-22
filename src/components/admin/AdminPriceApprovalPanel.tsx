/**
 * Admin widget to approve / reject the client's auto-calculated translation price.
 * Lives on AdminServiceOrderDetails. When approved, the admin's price flows into
 * total_amount so the quote/payment workflow can continue normally.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, CheckCircle2, XCircle, Clock, Sparkles, FileSearch, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Props {
  orderId: string;
  status: string | null | undefined;
  clientEstimatedPrice?: number | null;
  adminApprovedPrice?: number | null;
  approvalNote?: string | null;
  totalWords?: number | null;
  totalPages?: number | null;
  files?: { name: string; words: number }[];
  onUpdated?: () => void;
}

const AdminPriceApprovalPanel: React.FC<Props> = ({
  orderId, status, clientEstimatedPrice, adminApprovedPrice,
  approvalNote, totalWords, totalPages, files, onUpdated,
}) => {
  const [price, setPrice] = useState<string>(
    String(adminApprovedPrice ?? clientEstimatedPrice ?? '')
  );
  const [note, setNote] = useState<string>(approvalNote ?? '');
  const [loading, setLoading] = useState(false);

  // Don't render if no approval flow on this order
  if (!status || status === 'not_requested') return null;

  const handleApprove = async () => {
    const finalPrice = Number(price);
    if (!finalPrice || finalPrice <= 0) {
      toast.error('يرجى إدخال سعر صالح');
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await (supabase.from('service_orders') as any)
        .update({
          price_approval_status: 'approved',
          admin_approved_price: finalPrice,
          price_approval_note: note || null,
          price_approved_at: new Date().toISOString(),
          price_reviewed_by: user?.id || null,
          total_amount: finalPrice,
        })
        .eq('id', orderId);
      if (error) throw error;
      toast.success('تم اعتماد السعر — يمكن للعميل المتابعة الآن');
      onUpdated?.();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'تعذّر اعتماد السعر');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!note.trim()) {
      toast.error('يرجى كتابة سبب الرفض في حقل الملاحظة');
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await (supabase.from('service_orders') as any)
        .update({
          price_approval_status: 'rejected',
          price_approval_note: note,
          price_reviewed_by: user?.id || null,
          price_approved_at: new Date().toISOString(),
        })
        .eq('id', orderId);
      if (error) throw error;
      toast.success('تم رفض التسعير');
      onUpdated?.();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'تعذّر تنفيذ الإجراء');
    } finally {
      setLoading(false);
    }
  };

  const isPending = status === 'pending';
  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';

  return (
    <Card className="overflow-hidden border-2 border-amber-500/30">
      <div className={`h-1 ${isPending ? 'bg-amber-500' : isApproved ? 'bg-emerald-500' : 'bg-destructive'}`} />
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculator className="w-4 h-4 text-amber-600" />
          اعتماد سعر الترجمة (حساب تلقائي للعميل)
          <Badge variant="outline" className="ml-auto gap-1">
            {isPending && (<><Clock className="w-3 h-3" /> بانتظار الاعتماد</>)}
            {isApproved && (<><CheckCircle2 className="w-3 h-3 text-emerald-600" /> معتمد</>)}
            {isRejected && (<><XCircle className="w-3 h-3 text-destructive" /> مرفوض</>)}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Word count summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-muted/40">
            <div className="text-xl font-bold">{(totalWords ?? 0).toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">كلمة</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/40">
            <div className="text-xl font-bold">{(totalPages ?? 0).toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">صفحة</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/40">
            <div className="text-xl font-bold text-amber-600">
              {(clientEstimatedPrice ?? 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">سعر مبدئي (ر.س)</div>
          </div>
        </div>

        {files && files.length > 0 && (
          <div className="rounded-xl border border-border/40 p-3 space-y-1.5">
            <div className="text-xs font-semibold flex items-center gap-1.5 mb-1">
              <FileSearch className="w-3.5 h-3.5" /> الملفات المُحلَّلة
            </div>
            {files.map((f, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="truncate">{f.name}</span>
                <span className="font-mono text-muted-foreground">{f.words.toLocaleString()} كلمة</span>
              </div>
            ))}
          </div>
        )}

        {isPending && (
          <Alert className="border-amber-500/30 bg-amber-500/5">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-xs">
              العميل يرى السعر التقديري ولكنه ينتظر اعتمادك للسعر النهائي قبل أن يتمكّن من الدفع.
            </AlertDescription>
          </Alert>
        )}

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs mb-1.5 block">السعر النهائي المعتمد (ر.س)</Label>
            <Input
              type="number" min={0} step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading || isApproved || isRejected}
              className="text-lg font-bold"
            />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">ملاحظة للعميل (اختياري للقبول، إلزامية للرفض)</Label>
            <Textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={loading || isApproved || isRejected}
              placeholder="مثال: تم تعديل السعر بناءً على تعقيد المحتوى الطبي..."
              className="text-sm resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        {isPending && (
          <div className="flex gap-2">
            <Button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              اعتماد السعر
            </Button>
            <Button
              onClick={handleReject}
              disabled={loading}
              variant="outline"
              className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <XCircle className="w-4 h-4" />
              رفض
            </Button>
          </div>
        )}

        {(isApproved || isRejected) && (
          <Alert className={isApproved ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-destructive/30 bg-destructive/5'}>
            <AlertDescription className="text-xs">
              {isApproved && (
                <>تم اعتماد السعر بمبلغ <strong>{adminApprovedPrice?.toLocaleString()} ر.س</strong>. يمكنك الآن إرسال عرض السعر الرسمي.</>
              )}
              {isRejected && <>تم رفض التسعير{approvalNote ? ` - ${approvalNote}` : ''}.</>}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPriceApprovalPanel;
