import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/data/legacy/client";
import { Send, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface EmailTemplate {
  id: string;
  template_key: string;
  subject_template: string;
  html_template: string;
  is_active: boolean;
  variables?: any;
  name?: string;
  subject?: string;
  body?: string;
}

interface EmailComposerProps {
  defaultTo?: string;
  defaultTemplateKey?: string;
  onSent?: () => void;
}

export default function EmailComposer({ defaultTo = "", defaultTemplateKey = "", onSent }: EmailComposerProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');

  // بيانات إرسال البريد
  const [emailForm, setEmailForm] = useState({
    to: defaultTo,
    template_key: defaultTemplateKey,
    subject: "",
    content: "",
    variables: "{}"
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (defaultTo) setEmailForm(prev => ({ ...prev, to: defaultTo }));
  }, [defaultTo]);

  useEffect(() => {
    if (defaultTemplateKey) {
      setEmailForm(prev => ({ ...prev, template_key: defaultTemplateKey }));
      const template = templates.find(t => t.template_key === defaultTemplateKey);
      if (template) {
        setSelectedTemplate(template);
        setEmailForm(prev => ({
          ...prev,
          subject: template.subject_template,
          content: template.html_template
        }));
      }
    }
  }, [defaultTemplateKey, templates]);

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      toast.error("خطأ في جلب القوالب: " + error.message);
      return;
    }

    setTemplates((data || []).map((t: any) => ({
      ...t,
      template_key: t.name,
      subject_template: t.subject,
      html_template: t.body,
    })) as EmailTemplate[]);
  };

  const handleTemplateChange = (templateKey: string) => {
    if (templateKey === "__none__") {
      setSelectedTemplate(null);
      setEmailForm(prev => ({ ...prev, template_key: "" }));
      return;
    }
    const template = templates.find(t => t.template_key === templateKey);
    if (template) {
      setSelectedTemplate(template);
      setEmailForm(prev => ({
        ...prev,
        template_key: templateKey,
        subject: template.subject_template,
        content: template.html_template
      }));
    }
  };

  const buildResponsiveEmail = (subject: string, bodyHtml: string) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${subject}</title>
  <style>
    body { margin:0; padding:0; background:#f3f4f6; font-family: 'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Arial, sans-serif; }
    table { border-collapse: collapse; }
    img { border:0; outline:none; text-decoration:none; max-width:100%; height:auto; display:block; }
    a { color:#1e40af; text-decoration:none; }
    .wrapper { width:100%; background:#f3f4f6; padding:24px 12px; }
    .container { max-width:600px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding:28px 24px; text-align:center; color:#ffffff; }
    .brand { font-size:20px; font-weight:700; margin:0; }
    .tagline { font-size:13px; opacity:0.85; margin-top:6px; }
    .subject-bar { background:#f8fafc; border-bottom:1px solid #e5e7eb; padding:14px 24px; font-size:14px; color:#334155; }
    .content { padding:28px 24px; color:#1f2937; font-size:15px; line-height:1.85; word-wrap:break-word; }
    .content p { margin:0 0 14px; }
    .content h1, .content h2, .content h3 { color:#0f172a; }
    .content a { color:#1e40af; text-decoration:underline; }
    .footer { background:#0f172a; color:#cbd5e1; padding:20px 24px; text-align:center; font-size:12px; line-height:1.7; }
    .footer a { color:#93c5fd; }
    .footer .links { margin-top:8px; }
    .footer .links a { margin:0 6px; }
    @media only screen and (max-width:600px) {
      .wrapper { padding:12px 6px; }
      .container { border-radius:10px; }
      .header { padding:22px 16px; }
      .brand { font-size:18px; }
      .subject-bar { padding:12px 16px; font-size:13px; }
      .content { padding:20px 16px; font-size:14px; }
      .footer { padding:16px; font-size:11px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
          <tr><td class="header">
            <p class="brand">FekrahEdu</p>
            <p class="tagline">للخدمات الأكاديمية والترجمة المتخصصة</p>
          </td></tr>
          <tr><td class="subject-bar"><strong>الموضوع:</strong> ${subject}</td></tr>
          <tr><td class="content">${bodyHtml}</td></tr>
          <tr><td class="footer">
            © ${new Date().getFullYear()} FekrahEdu - جميع الحقوق محفوظة<br/>
            للتواصل: <a href="mailto:info@fekrahedu.com">info@fekrahedu.com</a> · واتساب: 0593799355
            <div class="links">
              <a href="https://fekrahedu.com">الموقع</a> ·
              <a href="https://fekrahedu.com/contact-us">تواصل معنا</a>
            </div>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>
</body>
</html>`;

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
    } catch {
      toast.error("خطأ في تحليل المتغيرات");
      return;
    }

    setPreviewContent(buildResponsiveEmail(subject || "(بدون موضوع)", content || "<p>(لا يوجد محتوى)</p>"));
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

      const wrappedContent = buildResponsiveEmail(emailForm.subject, emailForm.content);

      const response = await supabase.functions.invoke('send-email', {
        body: {
          to: emailForm.to.split(',').map(email => email.trim()),
          subject: emailForm.subject,
          content: wrappedContent,
          template_key: emailForm.template_key || undefined,
          variables
        }
      });

      if (response.error) throw response.error;

      toast.success("تم إرسال البريد الإلكتروني بنجاح");
      
      // إعادة تعيين النموذج
      setEmailForm({
        to: "",
        template_key: "",
        subject: "",
        content: "",
        variables: "{}"
      });
      setSelectedTemplate(null);
      
      if (onSent) onSent();
    } catch (error: any) {
      toast.error("خطأ في إرسال البريد: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          إنشاء بريد إلكتروني
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>المستقبل (منفصل بفاصلة)</Label>
            <Input
              value={emailForm.to}
              onChange={(e) => setEmailForm({...emailForm, to: e.target.value})}
              placeholder="user@example.com, user2@example.com"
            />
          </div>
          
          <div>
            <Label>استخدام قالب (اختياري)</Label>
            <Select
              value={emailForm.template_key || "__none__"}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر قالب أو اتركه فارغاً" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">بدون قالب</SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.template_key}>
                    {template.template_key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>موضوع البريد</Label>
          <Input
            value={emailForm.subject}
            onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
            placeholder="موضوع البريد الإلكتروني"
          />
        </div>

        <div>
          <Label>محتوى البريد (HTML)</Label>
          <Textarea
            value={emailForm.content}
            onChange={(e) => setEmailForm({...emailForm, content: e.target.value})}
            placeholder="محتوى البريد بصيغة HTML..."
            rows={10}
          />
        </div>

        {selectedTemplate && selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
          <div>
            <Label>المتغيرات (JSON)</Label>
            <Textarea
              value={emailForm.variables}
              onChange={(e) => setEmailForm({...emailForm, variables: e.target.value})}
              placeholder={`{"${selectedTemplate.variables.join('": "قيمة", "')}: "قيمة"}`}
              rows={3}
            />
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                المتغيرات المتاحة: {selectedTemplate.variables.map(v => `{{${v}}}`).join(', ')}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSendEmail} disabled={loading} className="flex-1">
            {loading ? "جاري الإرسال..." : "إرسال البريد"}
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

        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between flex-wrap gap-2">
                <span>معاينة البريد الإلكتروني</span>
                <div className="flex gap-2">
                  <Button size="sm" variant={previewDevice === 'mobile' ? 'default' : 'outline'} onClick={() => setPreviewDevice('mobile')}>📱 جوال</Button>
                  <Button size="sm" variant={previewDevice === 'desktop' ? 'default' : 'outline'} onClick={() => setPreviewDevice('desktop')}>💻 كمبيوتر</Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto bg-muted/30 rounded-lg p-4 flex justify-center">
              <iframe
                title="معاينة البريد"
                srcDoc={previewContent}
                className="bg-white border rounded-lg shadow-sm transition-all"
                style={{
                  width: previewDevice === 'mobile' ? '375px' : '100%',
                  maxWidth: previewDevice === 'mobile' ? '375px' : '720px',
                  height: '70vh',
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}