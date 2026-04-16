import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeadphonesIcon, ChevronLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  tickets: any[];
}

const ticketPriorityStyles: Record<string, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-blue-100 text-blue-800',
};

export default function DashboardActiveTickets({ tickets }: Props) {
  const navigate = useNavigate();

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <HeadphonesIcon className="w-5 h-5 text-amber-600" />
          التذاكر المفتوحة
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate('/support/tickets')} className="text-primary">
          <Plus className="w-4 h-4 mr-1" />
          تذكرة جديدة
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <HeadphonesIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">لا توجد تذاكر مفتوحة</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {tickets.slice(0, 3).map((ticket: any) => (
              <div key={ticket.id} className="px-4 sm:px-6 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">{ticket.title}</span>
                  <Badge variant="outline" className={`text-[10px] px-2 py-0 ${ticketPriorityStyles[ticket.priority] || ''}`}>
                    {ticket.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>#{ticket.ticketNumber}</span>
                  <span>•</span>
                  <span>{ticket.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
