import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ScrollText, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ClientContract } from '@/utils/clientDashboardService';
import { STATUS_COLORS, STATUS_LABELS, type ContractStatus } from '@/utils/supabaseContractService';

interface Props {
  contracts: ClientContract[];
}

export default function DashboardRecentContracts({ contracts }: Props) {
  const navigate = useNavigate();

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-primary" />
          آخر العقود
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate('/client/contracts')} className="text-primary">
          عرض الكل
          <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {contracts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ScrollText className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">لا توجد عقود حالياً</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {contracts.slice(0, 4).map((contract) => (
              <div
                key={contract.id}
                className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => navigate(`/client/contracts/${contract.id}`)}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold truncate">{contract.title}</span>
                    <Badge className={STATUS_COLORS[contract.status as ContractStatus] || STATUS_COLORS.draft}>
                      {STATUS_LABELS[contract.status as ContractStatus] || contract.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span>#{contract.contractNumber}</span>
                    <span>{contract.createdAt}</span>
                    {contract.signedAt && (
                      <span className="inline-flex items-center gap-1 text-primary">
                        <ShieldCheck className="w-3 h-3" />
                        موقّع
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-sm font-bold whitespace-nowrap">
                  {contract.amount.toLocaleString('ar-SA')} {contract.currency}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}