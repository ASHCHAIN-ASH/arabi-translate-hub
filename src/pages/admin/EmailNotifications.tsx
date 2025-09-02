import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Mail, Send, Eye, Users, Search, FileText, Receipt, 
  Gift, UserCheck, Calendar, Bell, CreditCard, Package,
  Settings, Palette, Filter, Plus, Edit, Trash2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface EmailTemplate {
  id: string;
  template_key: string;
  subject_template: string;
  html_template: string;
  is_active: boolean;
  variables?: any;
  created_at: string;
  category?: string;
}

interface SmartFormData {
  type: string;
  customerName?: string;
  customerEmail?: string;
  amount?: number;
  currency?: string;
  invoiceNumber?: string;
  dueDate?: string;
  companyName?: string;
  serviceDescription?: string;
  discountPercent?: number;
  promotionTitle?: string;
  promotionDescription?: string;
  activationLink?: string;
  username?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
}

const templateCategories = {
  invoices: { label: "الفواتير", icon: Receipt, color: "bg-blue-500/10 border-blue-200 text-blue-700" },
  activation: { label: "تفعيل الحسابات", icon: UserCheck, color: "bg-green-500/10 border-green-200 text-green-700" },
  promotions: { label: "العروض والإعلانات", icon: Gift, color: "bg-purple-500/10 border-purple-200 text-purple-700" },
  notifications: { label: "إشعارات النظام", icon: Bell, color: "bg-orange-500/10 border-orange-200 text-orange-700" },
  payments: { label: "المدفوعات", icon: CreditCard, color: "bg-emerald-500/10 border-emerald-200 text-emerald-700" },
  orders: { label: "الطلبات", icon: Package, color: "bg-indigo-500/10 border-indigo-200 text-indigo-700" },
  events: { label: "الفعاليات", icon: Calendar, color: "bg-pink-500/10 border-pink-200 text-pink-700" }
};

export default function EmailNotifications() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("smart-send");

  // النظام الذكي للنماذج
  const [smartForm, setSmartForm] = useState<SmartFormData>({
    type: "",
    currency: "ر.س",
  });

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
    try {
      console.log("جاري جلب القوالب...");
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('is_active', true)
        .order('template_key');

      console.log("نتيجة الاستعلام:", { data, error });

      if (error) {
        console.error("خطأ في جلب القوالب:", error);
        toast.error("خطأ في جلب القوالب: " + error.message);
        return;
      }

      console.log("تم جلب", data?.length || 0, "قالب");
      setTemplates(data || []);
      
      if (data && data.length > 0) {
        toast.success(`تم جلب ${data.length} قالب بنجاح! 🎉`);
      } else {
        toast.error("لم يتم العثور على أي قوالب نشطة");
      }
    } catch (err) {
      console.error("خطأ عام:", err);
      toast.error("خطأ في الاتصال بقاعدة البيانات");
    }
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


  // التعامل مع النظام الذكي
  const handleSmartFormChange = (field: keyof SmartFormData, value: any) => {
    setSmartForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSmartEmail = () => {
    if (!smartForm.type || !smartForm.customerEmail) {
      toast.error("يرجى اختيار نوع البريد وإدخال إيميل العميل");
      return;
    }

    let subject = "";
    let content = "";
    let variables: any = {};

    switch (smartForm.type) {
      case "invoice":
        subject = `فاتورة رقم ${smartForm.invoiceNumber} - ${smartForm.companyName}`;
        content = generateInvoiceTemplate(smartForm);
        variables = {
          customerName: smartForm.customerName,
          amount: smartForm.amount,
          invoiceNumber: smartForm.invoiceNumber,
          dueDate: smartForm.dueDate,
          currency: smartForm.currency,
          companyName: smartForm.companyName,
          serviceDescription: smartForm.serviceDescription
        };
        break;
      
      case "activation":
        subject = `تفعيل حسابك في ${smartForm.companyName}`;
        content = generateActivationTemplate(smartForm);
        variables = {
          customerName: smartForm.customerName,
          username: smartForm.username,
          activationLink: smartForm.activationLink,
          companyName: smartForm.companyName
        };
        break;

      case "promotion":
        subject = `${smartForm.promotionTitle} - عرض خاص لك!`;
        content = generatePromotionTemplate(smartForm);
        variables = {
          customerName: smartForm.customerName,
          promotionTitle: smartForm.promotionTitle,
          promotionDescription: smartForm.promotionDescription,
          discountPercent: smartForm.discountPercent,
          companyName: smartForm.companyName
        };
        break;

      default:
        toast.error("نوع البريد غير مدعوم");
        return;
    }

    setEmailForm({
      to: smartForm.customerEmail!,
      subject,
      content,
      variables: JSON.stringify(variables, null, 2)
    });

    setActiveTab("manual-send");
    toast.success("تم إنشاء البريد تلقائياً! يمكنك مراجعته في تبويب الإرسال اليدوي");
  };

  const generateInvoiceTemplate = (data: SmartFormData) => {
    return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
      <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="text-align: center; border-bottom: 3px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">${data.companyName}</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">فاتورة إلكترونية</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; margin-bottom: 15px;">مرحباً ${data.customerName}</h2>
          <p style="color: #4b5563; line-height: 1.6;">نشكرك على ثقتك بنا. يرجى مراجعة تفاصيل فاتورتك أدناه:</p>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">رقم الفاتورة:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${data.invoiceNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">الخدمة:</td>
              <td style="padding: 8px 0; color: #1f2937;">${data.serviceDescription}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">تاريخ الاستحقاق:</td>
              <td style="padding: 8px 0; color: #1f2937;">${data.dueDate}</td>
            </tr>
            <tr style="border-top: 2px solid #e5e7eb;">
              <td style="padding: 15px 0 8px 0; color: #1f2937; font-weight: bold; font-size: 18px;">المبلغ الإجمالي:</td>
              <td style="padding: 15px 0 8px 0; font-weight: bold; font-size: 20px; color: #059669;">${data.amount} ${data.currency}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">دفع الفاتورة</a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>شكراً لك على اختيار خدماتنا</p>
          <p>${data.companyName} - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>`;
  };

  const generateActivationTemplate = (data: SmartFormData) => {
    return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px;">
      <div style="background: white; border-radius: 15px; padding: 40px; text-align: center;">
        <div style="margin-bottom: 30px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; width: 80px; height: 80px; border-radius: 50%; line-height: 80px; font-size: 35px; margin-bottom: 20px;">✓</div>
          <h1 style="color: #1f2937; margin: 0; font-size: 28px;">مرحباً بك ${data.customerName}!</h1>
          <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">حسابك جاهز للاستخدام</p>
        </div>

        <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 10px; padding: 25px; margin: 25px 0;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0;">تفاصيل حسابك</h3>
          <p style="color: #075985; margin: 5px 0;"><strong>اسم المستخدم:</strong> ${data.username}</p>
          <p style="color: #075985; margin: 5px 0;"><strong>البريد الإلكتروني:</strong> ${data.customerEmail}</p>
        </div>

        <div style="margin: 30px 0;">
          <a href="${data.activationLink}" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">تفعيل حسابك الآن</a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 25px; color: #6b7280; font-size: 14px;">
          <p>إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذه الرسالة</p>
          <p style="margin-top: 15px;"><strong>${data.companyName}</strong> - نحن سعداء لانضمامك إلينا</p>
        </div>
      </div>
    </div>`;
  };

  const generatePromotionTemplate = (data: SmartFormData) => {
    return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #ff6b6b, #ee5a24); padding: 20px;">
      <div style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
        <div style="background: linear-gradient(135deg, #ff6b6b, #ee5a24); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🎉 ${data.promotionTitle}</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">عرض حصري لك ${data.customerName}</p>
        </div>

        <div style="padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background: #ff6b6b; color: white; padding: 20px; border-radius: 50%; font-size: 48px; font-weight: bold; margin-bottom: 20px; box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);">
              ${data.discountPercent}%
            </div>
            <h2 style="color: #1f2937; margin: 0; font-size: 24px;">خصم هائل!</h2>
          </div>

          <div style="background: #fef3f2; border: 2px solid #fca5a5; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center;">
            <p style="color: #dc2626; font-size: 18px; margin: 0; line-height: 1.6;">${data.promotionDescription}</p>
          </div>

          <div style="text-align: center; margin: 35px 0;">
            <a href="#" style="background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 18px 35px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4); text-transform: uppercase; letter-spacing: 1px;">احصل على العرض الآن</a>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 25px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>⏰ العرض لفترة محدودة - لا تفوت الفرصة!</p>
            <p style="margin-top: 15px;"><strong>${data.companyName}</strong> - دائماً معك بأفضل العروض</p>
          </div>
        </div>
      </div>
    </div>`;
  };

  const getTemplateDescription = (templateKey: string) => {
    const descriptions: Record<string, string> = {
      // القوالب الجديدة المتطورة
      'welcome_modern': '🎨 قالب ترحيب عصري بحركات متطورة وتدرجات لونية',
      'invoice_premium': '💎 قالب فاتورة احترافي بتأثيرات بصرية راقية',
      'reminder_interactive': '⏰ قالب تذكير تفاعلي مع عداد تنازلي وشرائط تقدم',
      'congratulations_animated': '🎉 قالب تهنئة متحرك بالقصاصات والشرر المتلألئ',
      'order_status_premium': '📦 قالب حالة الطلب المتقدم مع خط زمني تفاعلي',
      // القوالب العادية
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

  const getTemplateCategory = (templateKey: string) => {
    if (templateKey.includes('invoice') || templateKey.includes('payment')) return 'invoices';
    if (templateKey.includes('welcome') || templateKey.includes('activation')) return 'activation';
    if (templateKey.includes('promotion') || templateKey.includes('offer')) return 'promotions';
    if (templateKey.includes('reminder') || templateKey.includes('notification')) return 'notifications';
    if (templateKey.includes('payment') || templateKey.includes('receipt')) return 'payments';
    if (templateKey.includes('order') || templateKey.includes('delivery')) return 'orders';
    if (templateKey.includes('meeting') || templateKey.includes('event')) return 'events';
    return 'notifications';
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.template_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject_template.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || getTemplateCategory(template.template_key) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto p-6 space-y-6">
        {/* الهيدر */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-card/50 backdrop-blur-sm border rounded-xl p-6">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              نظام إدارة البريد الإلكتروني
            </h1>
            <p className="text-muted-foreground">منصة متكاملة لإدارة وإرسال رسائل البريد الإلكتروني بذكاء</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="text-lg px-4 py-2 bg-background/50">
              <Users className="h-4 w-4 mr-2" />
              {templates.length} قالب
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 bg-background/50">
              <Palette className="h-4 w-4 mr-2" />
              {Object.keys(templateCategories).length} فئة
            </Badge>
          </div>
        </div>

        {/* النظام الرئيسي */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="smart-send" className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              النظام الذكي
            </TabsTrigger>
            <TabsTrigger value="manual-send" className="flex items-center gap-2 text-sm">
              <Send className="h-4 w-4" />
              الإرسال اليدوي
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              إدارة القوالب
            </TabsTrigger>
          </TabsList>

          {/* النظام الذكي */}
          <TabsContent value="smart-send" className="space-y-6">
            <Card className="bg-gradient-to-r from-primary/5 via-background to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  النظام الذكي للبريد الإلكتروني
                </CardTitle>
                <p className="text-muted-foreground">املأ النموذج وسيقوم النظام بإنشاء البريد تلقائياً مع التصميم المناسب</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* اختيار نوع البريد */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                      smartForm.type === 'invoice' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleSmartFormChange('type', 'invoice')}
                  >
                    <div className="text-center">
                      <Receipt className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                      <h3 className="font-semibold text-lg mb-2">فاتورة</h3>
                      <p className="text-sm text-muted-foreground">فواتير احترافية مع تفاصيل كاملة</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                      smartForm.type === 'activation' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleSmartFormChange('type', 'activation')}
                  >
                    <div className="text-center">
                      <UserCheck className="h-12 w-12 mx-auto mb-3 text-green-600" />
                      <h3 className="font-semibold text-lg mb-2">تفعيل حساب</h3>
                      <p className="text-sm text-muted-foreground">رسائل ترحيب وتفعيل الحسابات</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                      smartForm.type === 'promotion' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleSmartFormChange('type', 'promotion')}
                  >
                    <div className="text-center">
                      <Gift className="h-12 w-12 mx-auto mb-3 text-purple-600" />
                      <h3 className="font-semibold text-lg mb-2">عرض ترويجي</h3>
                      <p className="text-sm text-muted-foreground">عروض وخصومات جذابة</p>
                    </div>
                  </div>
                </div>

                {smartForm.type && (
                  <Card className="bg-card/50 border-dashed">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* الحقول العامة */}
                        <div>
                          <Label className="text-sm font-medium">اسم العميل *</Label>
                          <Input
                            value={smartForm.customerName || ""}
                            onChange={(e) => handleSmartFormChange('customerName', e.target.value)}
                            placeholder="محمد أحمد"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">بريد العميل *</Label>
                          <Input
                            type="email"
                            value={smartForm.customerEmail || ""}
                            onChange={(e) => handleSmartFormChange('customerEmail', e.target.value)}
                            placeholder="customer@example.com"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">اسم الشركة</Label>
                          <Input
                            value={smartForm.companyName || ""}
                            onChange={(e) => handleSmartFormChange('companyName', e.target.value)}
                            placeholder="شركة المسار التعليمي"
                            className="mt-1"
                          />
                        </div>

                        {/* حقول خاصة بالفواتير */}
                        {smartForm.type === 'invoice' && (
                          <>
                            <div>
                              <Label className="text-sm font-medium">رقم الفاتورة</Label>
                              <Input
                                value={smartForm.invoiceNumber || ""}
                                onChange={(e) => handleSmartFormChange('invoiceNumber', e.target.value)}
                                placeholder="INV-001"
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium">المبلغ</Label>
                              <Input
                                type="number"
                                value={smartForm.amount || ""}
                                onChange={(e) => handleSmartFormChange('amount', parseFloat(e.target.value))}
                                placeholder="1500"
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium">تاريخ الاستحقاق</Label>
                              <Input
                                type="date"
                                value={smartForm.dueDate || ""}
                                onChange={(e) => handleSmartFormChange('dueDate', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <Label className="text-sm font-medium">وصف الخدمة</Label>
                              <Textarea
                                value={smartForm.serviceDescription || ""}
                                onChange={(e) => handleSmartFormChange('serviceDescription', e.target.value)}
                                placeholder="خدمات الترجمة المتخصصة"
                                rows={2}
                                className="mt-1"
                              />
                            </div>
                          </>
                        )}

                        {/* حقول خاصة بتفعيل الحسابات */}
                        {smartForm.type === 'activation' && (
                          <>
                            <div>
                              <Label className="text-sm font-medium">اسم المستخدم</Label>
                              <Input
                                value={smartForm.username || ""}
                                onChange={(e) => handleSmartFormChange('username', e.target.value)}
                                placeholder="mohammed_ahmed"
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium">رابط التفعيل</Label>
                              <Input
                                type="url"
                                value={smartForm.activationLink || ""}
                                onChange={(e) => handleSmartFormChange('activationLink', e.target.value)}
                                placeholder="https://example.com/activate?token=..."
                                className="mt-1"
                              />
                            </div>
                          </>
                        )}

                        {/* حقول خاصة بالعروض الترويجية */}
                        {smartForm.type === 'promotion' && (
                          <>
                            <div>
                              <Label className="text-sm font-medium">عنوان العرض</Label>
                              <Input
                                value={smartForm.promotionTitle || ""}
                                onChange={(e) => handleSmartFormChange('promotionTitle', e.target.value)}
                                placeholder="خصم الجمعة البيضاء"
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium">نسبة الخصم (%)</Label>
                              <Input
                                type="number"
                                value={smartForm.discountPercent || ""}
                                onChange={(e) => handleSmartFormChange('discountPercent', parseFloat(e.target.value))}
                                placeholder="30"
                                className="mt-1"
                                max="100"
                                min="0"
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <Label className="text-sm font-medium">وصف العرض</Label>
                              <Textarea
                                value={smartForm.promotionDescription || ""}
                                onChange={(e) => handleSmartFormChange('promotionDescription', e.target.value)}
                                placeholder="احصل على خصم هائل على جميع خدمات الترجمة"
                                rows={2}
                                className="mt-1"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex justify-center mt-6">
                        <Button 
                          onClick={generateSmartEmail}
                          size="lg"
                          className="px-8 py-3"
                          disabled={!smartForm.type || !smartForm.customerEmail || !smartForm.customerName}
                        >
                          <Settings className="h-5 w-5 mr-2" />
                          إنشاء البريد تلقائياً
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* الإرسال اليدوي */}
          <TabsContent value="manual-send" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      rows={10}
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

              {/* معاينة البريد */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    معاينة مباشرة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg min-h-[400px] bg-muted/20 p-4">
                    {emailForm.content ? (
                      <div>
                        <div className="border-b pb-3 mb-4 bg-card p-3 rounded">
                          <p className="text-sm"><strong>إلى:</strong> {emailForm.to || "لم يتم تحديد المستقبل"}</p>
                          <p className="text-sm"><strong>الموضوع:</strong> {emailForm.subject || "لم يتم تحديد الموضوع"}</p>
                        </div>
                        <div 
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{ __html: emailForm.content }}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>املأ محتوى البريد لرؤية المعاينة</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* إدارة القوالب */}
          <TabsContent value="templates" className="space-y-6">
            {/* فلاتر القوالب */}
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="البحث في القوالب..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>
                  <div className="md:w-64">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="جميع الفئات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الفئات</SelectItem>
                        {Object.entries(templateCategories).map(([key, category]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <category.icon className="h-4 w-4" />
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" onClick={fetchTemplates}>
                    <Settings className="h-4 w-4 mr-2" />
                    تحديث
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* فئات القوالب */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {Object.entries(templateCategories).map(([key, category]) => {
                const categoryTemplates = templates.filter(t => getTemplateCategory(t.template_key) === key);
                return (
                  <Card 
                    key={key} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedCategory === key ? 'ring-2 ring-primary' : ''
                    } ${category.color}`}
                    onClick={() => setSelectedCategory(key)}
                  >
                    <CardContent className="p-4 text-center">
                      <category.icon className="h-8 w-8 mx-auto mb-3" />
                      <h3 className="font-semibold mb-1">{category.label}</h3>
                      <p className="text-sm opacity-75">{categoryTemplates.length} قالب</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* قائمة القوالب */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const category = templateCategories[getTemplateCategory(template.template_key) as keyof typeof templateCategories];
                return (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                      selectedTemplate?.id === template.id 
                        ? 'ring-2 ring-primary shadow-lg' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {category && <category.icon className="h-5 w-5 text-primary" />}
                          <h3 className="font-semibold text-sm truncate">{template.template_key}</h3>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {template.variables && Array.isArray(template.variables) ? template.variables.length : 0} متغير
                          </Badge>
                          {category && (
                            <Badge variant="outline" className="text-xs">
                              {category.label}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {getTemplateDescription(template.template_key)}
                      </p>
                      
                      <p className="text-sm font-medium truncate mb-3">
                        {template.subject_template}
                      </p>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTemplateSelect(template);
                            setActiveTab("manual-send");
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          استخدام
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEmailForm({
                              ...emailForm,
                              subject: template.subject_template,
                              content: template.html_template
                            });
                            handlePreview();
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredTemplates.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="font-semibold mb-2">لا توجد قوالب</h3>
                  <p className="text-muted-foreground">لم يتم العثور على قوالب تطابق البحث أو الفئة المحددة</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* نافذة المعاينة */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-5xl max-h-[85vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                معاينة البريد الإلكتروني
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg border">
                <p className="text-sm font-medium mb-1">تفاصيل البريد:</p>
                <p className="text-xs text-muted-foreground">إلى: {emailForm.to}</p>
                <p className="text-xs text-muted-foreground">الموضوع: {emailForm.subject}</p>
              </div>
              <div 
                className="border rounded-lg p-6 bg-white shadow-inner min-h-[400px]"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}