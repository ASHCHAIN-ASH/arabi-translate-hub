import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Send, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface EmailTemplate {
  id: string;
  template_key: string;
  subject_template: string;
  html_template: string;
  is_active: boolean;
  variables?: any;
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
      .order('template_key');

    if (error) {
      toast.error("خطأ في جلب القوالب: " + error.message);
      return;
    }

    setTemplates(data || []);
  };

  const handleTemplateChange = (templateKey: string) => {
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
      <div style="border-bottom: 2px solid #eee; padding: 10px; margin-bottom: 20px;">
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
              value={emailForm.template_key}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر قالب أو اتركه فارغاً" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">بدون قالب</SelectItem>
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
      </CardContent>
    </Card>
  );
}