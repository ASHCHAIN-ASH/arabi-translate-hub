import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Plus, Edit, Trash2, Send, Eye, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AdminLayout from "@/components/admin/AdminLayout";

interface EmailTemplate {
  id: string;
  template_key: string;
  subject_template: string;
  html_template: string;
  is_active: boolean;
  variables?: any;
  created_at: string;
}

interface EmailLog {
  id: string;
  to_email: string;
  subject: string;
  status: string;
  created_at: string;
  template_key?: string;
  user_id: string;
}

export default function EmailManagement() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // بيانات إنشاء/تعديل القالب
  const [templateForm, setTemplateForm] = useState({
    template_key: "",
    subject_template: "",
    html_template: "",
    is_active: true,
    variables: ""
  });

  // بيانات إرسال البريد
  const [emailForm, setEmailForm] = useState({
    to: "",
    template_key: "",
    variables: "{}"
  });

  useEffect(() => {
    fetchTemplates();
    fetchEmailLogs();
  }, []);

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("خطأ في جلب القوالب: " + error.message);
      return;
    }

    setTemplates((data || []).map((t: any) => ({ ...t, template_key: t.name, subject_template: t.subject, html_template: t.body })) as any);
  };

  const fetchEmailLogs = async () => {
    const { data, error } = await (supabase
      .from('audit_logs') as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      toast.error("خطأ في جلب سجل البريد: " + error.message);
      return;
    }

    setEmailLogs((data || []) as any);
  };

  const handleCreateTemplate = async () => {
    setLoading(true);
    try {
      const variables = templateForm.variables
        .split(',')
        .map(v => v.trim())
        .filter(v => v.length > 0);

      const { error } = await supabase
        .from('email_templates')
        .insert({
          name: templateForm.template_key,
          subject: templateForm.subject_template,
          body: templateForm.html_template,
          is_active: templateForm.is_active,
          variables: variables
        });

      if (error) throw error;

      toast.success("تم إنشاء القالب بنجاح");
      setIsCreateDialogOpen(false);
      setTemplateForm({
        template_key: "",
        subject_template: "",
        html_template: "",
        is_active: true,
        variables: ""
      });
      fetchTemplates();
    } catch (error: any) {
      toast.error("خطأ في إنشاء القالب: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      let variables = {};
      try {
        variables = JSON.parse(emailForm.variables);
      } catch {
        variables = {};
      }

      const response = await supabase.functions.invoke('send-email', {
        body: {
          to: emailForm.to.split(',').map(email => email.trim()),
          template_key: emailForm.template_key,
          variables
        }
      });

      if (response.error) throw response.error;

      toast.success("تم إرسال البريد الإلكتروني بنجاح");
      setIsSendDialogOpen(false);
      setEmailForm({
        to: "",
        template_key: "",
        variables: "{}"
      });
      fetchEmailLogs();
    } catch (error: any) {
      toast.error("خطأ في إرسال البريد: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTemplateStatus = async (templateId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('email_templates')
      .update({ is_active: !isActive })
      .eq('id', templateId);

    if (error) {
      toast.error("خطأ في تحديث حالة القالب: " + error.message);
      return;
    }

    toast.success("تم تحديث حالة القالب");
    fetchTemplates();
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      sent: "bg-green-500",
      failed: "bg-red-500",
      pending: "bg-yellow-500"
    };
    
    const labels = {
      sent: "مرسل",
      failed: "فشل",
      pending: "انتظار"
    };

    return (
      <Badge className={`${colors[status as keyof typeof colors]} text-white`}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Mail className="h-8 w-8" />
            إدارة البريد الإلكتروني
          </h1>
          
          <div className="flex gap-2">
            <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  إرسال بريد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>إرسال بريد إلكتروني</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>البريد الإلكتروني (منفصل بفاصلة)</Label>
                    <Input
                      value={emailForm.to}
                      onChange={(e) => setEmailForm({...emailForm, to: e.target.value})}
                      placeholder="user@example.com, user2@example.com"
                    />
                  </div>
                  
                  <div>
                    <Label>القالب</Label>
                    <Select
                      value={emailForm.template_key}
                      onValueChange={(value) => setEmailForm({...emailForm, template_key: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر قالب" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.filter(t => t.is_active).map((template) => (
                          <SelectItem key={template.id} value={template.template_key}>
                            {template.template_key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>المتغيرات (JSON)</Label>
                    <Textarea
                      value={emailForm.variables}
                      onChange={(e) => setEmailForm({...emailForm, variables: e.target.value})}
                      placeholder='{"name": "أحمد", "amount": "500"}'
                      rows={3}
                    />
                  </div>
                  
                  <Button onClick={handleSendEmail} disabled={loading} className="w-full">
                    {loading ? "جاري الإرسال..." : "إرسال"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  قالب جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>إنشاء قالب جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>مفتاح القالب</Label>
                    <Input
                      value={templateForm.template_key}
                      onChange={(e) => setTemplateForm({...templateForm, template_key: e.target.value})}
                      placeholder="مثال: welcome_email"
                    />
                  </div>
                  
                  <div>
                    <Label>قالب الموضوع</Label>
                    <Input
                      value={templateForm.subject_template}
                      onChange={(e) => setTemplateForm({...templateForm, subject_template: e.target.value})}
                      placeholder="مثال: مرحباً بك {{name}}"
                    />
                  </div>
                  
                  <div>
                    <Label>قالب HTML</Label>
                    <Textarea
                      value={templateForm.html_template}
                      onChange={(e) => setTemplateForm({...templateForm, html_template: e.target.value})}
                      placeholder="محتوى البريد بصيغة HTML..."
                      rows={8}
                    />
                  </div>
                  
                  <div>
                    <Label>المتغيرات (منفصلة بفاصلة)</Label>
                    <Input
                      value={templateForm.variables}
                      onChange={(e) => setTemplateForm({...templateForm, variables: e.target.value})}
                      placeholder="name, email, amount, order_number"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={templateForm.is_active}
                      onCheckedChange={(checked) => setTemplateForm({...templateForm, is_active: checked})}
                    />
                    <Label>قالب نشط</Label>
                  </div>
                  
                  <Button onClick={handleCreateTemplate} disabled={loading} className="w-full">
                    {loading ? "جاري الإنشاء..." : "إنشاء القالب"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="templates">القوالب</TabsTrigger>
            <TabsTrigger value="logs">سجل البريد</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.template_key}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.subject_template}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">قالب</Badge>
                        <Switch
                          checked={template.is_active}
                          onCheckedChange={() => toggleTemplateStatus(template.id, template.is_active)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {template.variables && Array.isArray(template.variables) && template.variables.length > 0 && (
                          <span>المتغيرات: {template.variables.join(', ')}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          معاينة
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          تعديل
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <div className="grid gap-4">
              {emailLogs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{log.to_email}</h3>
                          {getStatusBadge(log.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {log.subject}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleString('ar-SA')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          من: info@masteredupath.com
                        </p>
                        {log.template_key && (
                          <p className="text-xs text-muted-foreground">
                            القالب: {log.template_key}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}