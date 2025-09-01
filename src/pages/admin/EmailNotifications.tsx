import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Send, Eye, Users, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmailTemplate {
  id: string;
  template_key: string;
  subject_template: string;
  html_template: string;
  is_active: boolean;
  variables?: any;
  created_at: string;
}

export default function EmailNotifications() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // بيانات إرسال البريد
  const [emailForm, setEmailForm] = useState({
    to: "",
    subject: "",
    content: "",
    variables: "{}"
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .order('template_key');

    if (error) {
      toast.error("خطأ في جلب القوالب: " + error.message);
      return;
    }

    setTemplates(data || []);
  };

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEmailForm({
      to: emailForm.to,
      subject: template.subject_template,
      content: template.html_template,
      variables: template.variables && Array.isArray(template.variables) 
        ? JSON.stringify(template.variables.reduce((acc: any, key: string) => ({ ...acc, [key]: "" }), {}), null, 2)
        : "{}"
    });
  };

  const handlePreview = () => {
    let content = emailForm.content;
    let subject = emailForm.subject;
    
    try {
      const variables = JSON.parse(emailForm.variables);
      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(placeholder, String(value));
        subject = subject.replace(placeholder, String(value));
      });
    } catch (error) {
      toast.error("خطأ في تحليل المتغيرات");
      return;
    }

    setPreviewContent(`
      <div style="border-bottom: 2px solid #eee; padding: 10px; margin-bottom: 20px; background: #f8f9fa;">
        <strong>إلى:</strong> ${emailForm.to}<br>
        <strong>الموضوع:</strong> ${subject}
      </div>
      ${content}
    `);
    setPreviewOpen(true);
  };

  const handleSendEmail = async () => {
    if (!emailForm.to || !emailForm.subject || !emailForm.content) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

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
          subject: emailForm.subject,
          content: emailForm.content,
          template_key: selectedTemplate?.template_key,
          variables
        }
      });

      if (response.error) throw response.error;

      toast.success("تم إرسال البريد الإلكتروني بنجاح ✅");
      
      // إعادة تعيين النموذج
      setEmailForm({
        to: "",
        subject: "",
        content: "",
        variables: "{}"
      });
      setSelectedTemplate(null);
    } catch (error: any) {
      toast.error("خطأ في إرسال البريد: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.template_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject_template.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTemplateDescription = (templateKey: string) => {
    const descriptions: Record<string, string> = {
      'welcome_email': 'رسالة ترحيب للعملاء الجدد',
      'order_confirmation': 'تأكيد استلام الطلب',
      'order_completed': 'إشعار اكتمال الطلب',
      'payment_received': 'تأكيد استلام الدفعة',
      'invoice_reminder': 'تذكير بالفاتورة المستحقة',
      'project_update': 'تحديث حالة المشروع',
      'meeting_reminder': 'تذكير بالاجتماع',
      'document_ready': 'إشعار جاهزية الوثيقة',
      'support_ticket': 'رد على تذكرة الدعم الفني',
      'newsletter': 'النشرة الإخبارية',
      'promotion': 'عروض ترويجية',
      'birthday_wishes': 'تهنئة عيد ميلاد',
      'contract_expiry': 'تذكير انتهاء العقد',
      'feedback_request': 'طلب تقييم الخدمة'
    };
    return descriptions[templateKey] || 'قالب بريد إلكتروني';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Mail className="h-8 w-8 text-primary" />
          نظام الإشعارات البريدية
        </h1>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Users className="h-4 w-4 mr-2" />
          {templates.length} قالب متاح
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* قائمة القوالب */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              قوالب البريد الإلكتروني
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <Input
                  placeholder="البحث في القوالب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                  selectedTemplate?.id === template.id 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-border'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-sm">{template.template_key}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {template.variables && Array.isArray(template.variables) ? template.variables.length : 0} متغير
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {getTemplateDescription(template.template_key)}
                </p>
                <p className="text-sm text-foreground/80 truncate">
                  {template.subject_template}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* نموذج الإرسال */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              إرسال البريد الإلكتروني
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>البريد الإلكتروني للمستقبل *</Label>
              <Input
                value={emailForm.to}
                onChange={(e) => setEmailForm({...emailForm, to: e.target.value})}
                placeholder="user@example.com أو عدة ايميلات منفصلة بفاصلة"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                يمكنك إدخال عدة عناوين بريد إلكتروني منفصلة بفاصلة
              </p>
            </div>

            <div>
              <Label>موضوع البريد *</Label>
              <Input
                value={emailForm.subject}
                onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                placeholder="موضوع البريد الإلكتروني"
                className="mt-1"
              />
            </div>

            <div>
              <Label>محتوى البريد (HTML) *</Label>
              <Textarea
                value={emailForm.content}
                onChange={(e) => setEmailForm({...emailForm, content: e.target.value})}
                placeholder="محتوى البريد بصيغة HTML..."
                rows={8}
                className="mt-1 font-mono text-sm"
              />
            </div>

            {selectedTemplate && selectedTemplate.variables && Array.isArray(selectedTemplate.variables) && selectedTemplate.variables.length > 0 && (
              <div>
                <Label>المتغيرات (JSON) *</Label>
                <Textarea
                  value={emailForm.variables}
                  onChange={(e) => setEmailForm({...emailForm, variables: e.target.value})}
                  rows={4}
                  className="mt-1 font-mono text-sm"
                />
                <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                  <strong>المتغيرات المتاحة:</strong> {selectedTemplate.variables.map(v => `{{${v}}}`).join(', ')}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSendEmail} 
                disabled={loading || !emailForm.to || !emailForm.subject || !emailForm.content}
                className="flex-1"
              >
                {loading ? "جاري الإرسال..." : "إرسال البريد"}
                <Send className="h-4 w-4 mr-2" />
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handlePreview}
                disabled={!emailForm.subject || !emailForm.content}
              >
                <Eye className="h-4 w-4 mr-2" />
                معاينة
              </Button>
            </div>

            {selectedTemplate && (
              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded">
                <p className="text-sm font-medium text-primary">
                  القالب المحدد: {selectedTemplate.template_key}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {getTemplateDescription(selectedTemplate.template_key)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* نافذة المعاينة */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>معاينة البريد الإلكتروني</DialogTitle>
          </DialogHeader>
          <div 
            className="border rounded-lg p-4 bg-white"
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}