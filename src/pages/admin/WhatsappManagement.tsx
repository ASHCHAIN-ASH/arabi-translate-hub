import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, MessageCircle, Send, Settings, FileText, History } from "lucide-react";

interface Settings {
  is_enabled: boolean;
  events_enabled: Record<string, boolean>;
  default_country_code: string;
  test_phone: string | null;
}

interface Template {
  id: string;
  event_key: string;
  title: string;
  body_text: string;
  variables: string[];
  is_active: boolean;
}

interface LogRow {
  id: string;
  to_phone: string;
  event_key: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
}

const EVENT_LABELS: Record<string, string> = {
  order_created: "إنشاء طلب",
  order_status_changed: "تغيّر حالة الطلب",
  order_delivered: "تسليم الطلب",
  invoice_new: "فاتورة جديدة",
  invoice_reminder: "تذكير فاتورة",
  invoice_paid: "تأكيد دفع",
  contract_invite: "دعوة توقيع عقد",
  contract_signed: "توقيع عقد",
  otp_login: "OTP تسجيل الدخول",
};

export default function WhatsappManagement() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  const load = async () => {
    setLoading(true);
    const [s, t, l] = await Promise.all([
      supabase.from("whatsapp_settings").select("*").eq("id", 1).single(),
      supabase.from("whatsapp_templates").select("*").order("event_key"),
      supabase
        .from("whatsapp_send_log")
        .select("id,to_phone,event_key,status,error_message,created_at")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);
    if (s.data) setSettings(s.data as any);
    if (t.data) setTemplates(t.data as any);
    if (l.data) setLogs(l.data as any);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const saveSettings = async () => {
    if (!settings) return;
    const { error } = await supabase
      .from("whatsapp_settings")
      .update({
        is_enabled: settings.is_enabled,
        events_enabled: settings.events_enabled,
        default_country_code: settings.default_country_code,
        test_phone: settings.test_phone,
      })
      .eq("id", 1);
    if (error) return toast.error("فشل الحفظ: " + error.message);
    toast.success("تم حفظ الإعدادات");
  };

  const saveTemplate = async (tpl: Template) => {
    const { error } = await supabase
      .from("whatsapp_templates")
      .update({
        title: tpl.title,
        body_text: tpl.body_text,
        is_active: tpl.is_active,
      })
      .eq("id", tpl.id);
    if (error) return toast.error("فشل الحفظ: " + error.message);
    toast.success("تم حفظ القالب");
  };

  const testConnection = async () => {
    setTesting(true);
    const { data, error } = await supabase.functions.invoke("whatsapp-send", {
      body: { test: true, to: settings?.test_phone || undefined, message: "اختبار اتصال SmartWats ✅" },
    });
    setTesting(false);
    if (error || !data?.success) {
      return toast.error("فشل الاختبار: " + (data?.error || error?.message || "غير معروف"));
    }
    toast.success("نجح الاختبار");
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl" dir="rtl">
      <div className="flex items-center gap-3">
        <MessageCircle className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold">إدارة واتساب (SmartWats)</h1>
          <p className="text-muted-foreground">قوالب الرسائل، الإشعارات التلقائية، وسجل الإرسال</p>
        </div>
      </div>

      <Tabs defaultValue="settings" dir="rtl" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl" dir="rtl">
          <TabsTrigger value="settings"><Settings className="w-4 h-4 ml-1" /> الإعدادات</TabsTrigger>
          <TabsTrigger value="templates"><FileText className="w-4 h-4 ml-1" /> القوالب</TabsTrigger>
          <TabsTrigger value="logs"><History className="w-4 h-4 ml-1" /> السجل</TabsTrigger>
          <TabsTrigger value="test"><Send className="w-4 h-4 ml-1" /> اختبار</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>تفعيل/تعطيل الخدمة والأحداث المرسلة تلقائياً</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="text-base">تفعيل خدمة واتساب</Label>
                  <p className="text-sm text-muted-foreground">إيقاف هذا المفتاح يعطّل جميع الإشعارات</p>
                </div>
                <Switch
                  checked={settings?.is_enabled ?? false}
                  onCheckedChange={(v) => setSettings((s) => s && { ...s, is_enabled: v })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>كود الدولة الافتراضي</Label>
                  <Input
                    value={settings?.default_country_code || ""}
                    onChange={(e) => setSettings((s) => s && { ...s, default_country_code: e.target.value })}
                    placeholder="966"
                  />
                </div>
                <div className="space-y-2">
                  <Label>رقم اختبار</Label>
                  <Input
                    value={settings?.test_phone || ""}
                    onChange={(e) => setSettings((s) => s && { ...s, test_phone: e.target.value })}
                    placeholder="0559600824"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">الأحداث المفعّلة</h3>
                {Object.entries(EVENT_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded">
                    <Label>{label}</Label>
                    <Switch
                      checked={settings?.events_enabled?.[key] ?? false}
                      onCheckedChange={(v) =>
                        setSettings((s) =>
                          s && { ...s, events_enabled: { ...s.events_enabled, [key]: v } },
                        )
                      }
                    />
                  </div>
                ))}
              </div>

              <Button onClick={saveSettings} className="w-full">حفظ الإعدادات</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {templates.map((tpl) => (
            <Card key={tpl.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{EVENT_LABELS[tpl.event_key] || tpl.title}</CardTitle>
                  <Switch
                    checked={tpl.is_active}
                    onCheckedChange={(v) =>
                      setTemplates((arr) => arr.map((x) => (x.id === tpl.id ? { ...x, is_active: v } : x)))
                    }
                  />
                </div>
                <CardDescription>
                  المتغيرات: {(tpl.variables as any[])?.map((v) => `{{${v}}}`).join("، ") || "—"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  rows={4}
                  value={tpl.body_text}
                  onChange={(e) =>
                    setTemplates((arr) =>
                      arr.map((x) => (x.id === tpl.id ? { ...x, body_text: e.target.value } : x)),
                    )
                  }
                />
                <Button size="sm" onClick={() => saveTemplate(tpl)}>حفظ القالب</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader><CardTitle>آخر 100 رسالة</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {logs.length === 0 && <p className="text-muted-foreground text-center py-8">لا توجد سجلات</p>}
                {logs.map((l) => (
                  <div key={l.id} className="flex items-center justify-between p-3 border rounded text-sm">
                    <div className="flex flex-col">
                      <span className="font-mono">{l.to_phone}</span>
                      <span className="text-xs text-muted-foreground">
                        {EVENT_LABELS[l.event_key || ""] || l.event_key || "مباشر"} ·{" "}
                        {new Date(l.created_at).toLocaleString("ar")}
                      </span>
                      {l.error_message && (
                        <span className="text-xs text-destructive mt-1">{l.error_message}</span>
                      )}
                    </div>
                    <Badge variant={l.status === "sent" ? "default" : "destructive"}>
                      {l.status === "sent" ? "مُرسلة" : "فشلت"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>اختبار الاتصال</CardTitle>
              <CardDescription>إرسال رسالة اختبار إلى رقم الاختبار المحدد</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded">
                <p className="text-sm">رقم الاختبار: <span className="font-mono">{settings?.test_phone || "—"}</span></p>
              </div>
              <Button onClick={testConnection} disabled={testing} className="w-full">
                {testing && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                إرسال رسالة اختبار
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
