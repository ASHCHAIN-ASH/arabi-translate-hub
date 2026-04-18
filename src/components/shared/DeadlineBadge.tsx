import { Badge } from "@/components/ui/badge";
import { Clock, Flame, AlertTriangle, CheckCircle2 } from "lucide-react";

interface Props {
  deadline?: string | null;
  status?: string | null;
}

export const DeadlineBadge = ({ deadline, status }: Props) => {
  if (!deadline) return null;
  if (status && ["completed", "delivered", "cancelled"].includes(status)) return null;

  const dl = new Date(deadline).getTime();
  const now = Date.now();
  const diffH = (dl - now) / 3600000;

  if (diffH < 0) {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="h-3 w-3" /> متأخر
      </Badge>
    );
  }
  if (diffH <= 3) {
    return (
      <Badge className="gap-1 bg-orange-500 hover:bg-orange-600 text-white">
        <Flame className="h-3 w-3" /> باقي {Math.ceil(diffH)} ساعة
      </Badge>
    );
  }
  if (diffH <= 24) {
    return (
      <Badge className="gap-1 bg-amber-500 hover:bg-amber-600 text-white">
        <Clock className="h-3 w-3" /> باقي {Math.ceil(diffH)} ساعة
      </Badge>
    );
  }
  if (diffH <= 72) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" /> باقي {Math.ceil(diffH / 24)} أيام
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1">
      <CheckCircle2 className="h-3 w-3" /> {Math.ceil(diffH / 24)} يوم
    </Badge>
  );
};
