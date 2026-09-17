import { useEffect, useState } from "react";
import { supabase } from "@/data/legacy/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { DeadlineBadge } from "./DeadlineBadge";

interface Row {
  id: string;
  service_order_id: string;
  deadline_at: string;
  reminder_type: string;
  service_orders?: { tracking_id: string; service_name: string | null; lifecycle_status: string };
}

export const UpcomingReminders = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await (supabase as any)
      .from("deadline_reminders")
      .select("id, service_order_id, deadline_at, reminder_type, service_orders(tracking_id, service_name, lifecycle_status)")
      .gte("deadline_at", new Date().toISOString())
      .order("deadline_at", { ascending: true })
      .limit(5);
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("deadline-reminders-widget")
      .on("postgres_changes", { event: "*", schema: "public", table: "deadline_reminders" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  if (loading || rows.length === 0) return null;

  // Deduplicate by order id (show nearest reminder per order)
  const seen = new Set<string>();
  const unique = rows.filter((r) => {
    if (seen.has(r.service_order_id)) return false;
    seen.add(r.service_order_id);
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4" /> التذكيرات القادمة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {unique.map((r) => (
          <Link
            key={r.id}
            to={`/dashboard/orders/${r.service_order_id}`}
            className="flex items-center justify-between gap-3 p-3 rounded-lg border hover:bg-accent transition"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">
                {r.service_orders?.service_name || r.service_orders?.tracking_id || "طلب"}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                {new Date(r.deadline_at).toLocaleDateString("ar-SA", { dateStyle: "medium" })}
              </div>
            </div>
            <DeadlineBadge deadline={r.deadline_at} status={r.service_orders?.lifecycle_status} />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
