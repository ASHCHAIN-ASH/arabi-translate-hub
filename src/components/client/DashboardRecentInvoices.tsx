import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ClientInvoice } from '@/utils/clientDashboardService';

interface Props {
  invoices: ClientInvoice[];
}

const invoiceStatusStyles: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-800',
  draft: 'bg-muted text-muted-foreground',
  pending: 'bg-amber-100 text-amber-800',
  sent: 'bg-blue-100 text-blue-800',
  partially_paid: 'bg-indigo-100 text-indigo-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-purple-100 text-purple-800',
};

const invoiceStatusLabels: Record<string, string> = {
  paid: 'مدفوعة',
  draft: 'مسودة',
  pending: 'بانتظار الدفع',
  sent: 'مُرسلة',
  partially_paid: 'مدفوعة جزئياً',
  overdue: 'متأخرة',
  cancelled: 'ملغاة',
  refunded: 'مستردة',
};

export default function DashboardRecentInvoices({ invoices }: Props) {
  const navigate = useNavigate();

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          آخر الفواتير
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate('/invoices')} className="text-primary">
          عرض الكل
          <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {invoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">لا توجد فواتير</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {invoices.slice(0, 4).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-4 sm:px-6 py-3">
                <div>
                  <span className="text-sm font-medium">#{inv.invoiceNumber}</span>
                  <p className="text-xs text-muted-foreground">{inv.issueDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{inv.amount} ر.س</span>
                  <Badge variant="outline" className={`text-[10px] px-2 py-0 ${invoiceStatusStyles[inv.status] || ''}`}>
                    {invoiceStatusLabels[inv.status] || inv.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
