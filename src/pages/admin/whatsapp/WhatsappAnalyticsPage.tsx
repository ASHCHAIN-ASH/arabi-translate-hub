// صفحة الإحصائيات المنفصلة
import WhatsappLayout from "@/components/admin/whatsapp/WhatsappLayout";
import { CampaignAnalytics } from "@/components/admin/whatsapp/CampaignAnalytics";
import { BarChart3 } from "lucide-react";

export default function WhatsappAnalyticsPage() {
  return (
    <WhatsappLayout>
      <div className="p-5 lg:p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            لوحة الإحصائيات والتحليلات
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">رؤى متقدمة عن أداء الحملات والمحادثات</p>
        </div>
        <CampaignAnalytics />
      </div>
    </WhatsappLayout>
  );
}
