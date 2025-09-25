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
  events: { label: "الفعاليات", icon: Calendar, color: "bg-pink-500/10 border-pink-200 text-pink-700" },
  receipts: { label: "سندات الدفع", icon: FileText, color: "bg-teal-500/10 border-teal-200 text-teal-700" }
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

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emails = emailForm.to.split(',').map(email => email.trim());
    
    for (const email of emails) {
      if (!emailRegex.test(email)) {
        toast.error(`البريد الإلكتروني غير صحيح: ${email}\nيجب أن يكون بالصيغة: example@domain.com`);
        return;
      }
    }

    setLoading(true);
    try {
      let variables = {};
      try {
        variables = JSON.parse(emailForm.variables);
      } catch {
        variables = {};
      }

      console.log("إرسال بريد إلى:", emails);
      console.log("الموضوع:", emailForm.subject);

      const response = await supabase.functions.invoke('send-email', {
        body: {
          to: emails,
          subject: emailForm.subject,
          content: emailForm.content,
          template_key: selectedTemplate?.template_key,
          variables
        }
      });

      console.log("استجابة إرسال البريد:", response);

      if (response.error) {
        console.error("خطأ في الإرسال:", response.error);
        throw response.error;
      }

      // التحقق من وجود خطأ في الاستجابة
      if (response.data?.error) {
        console.error("خطأ من الخدمة:", response.data.error);
        toast.error(`خطأ في إرسال البريد: ${response.data.error.message}`);
        return;
      }

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
      console.error("خطأ في إرسال البريد:", error);
      toast.error("خطأ في إرسال البريد: " + (error.message || "حدث خطأ غير متوقع"));
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
        subject = `فاتورة رقم ${smartForm.invoiceNumber} - وكالة ماستر إيدو باث`;
        content = generateInvoiceTemplate(smartForm);
        variables = {
          customerName: smartForm.customerName,
          amount: smartForm.amount,
          invoiceNumber: smartForm.invoiceNumber,
          dueDate: smartForm.dueDate,
          currency: smartForm.currency,
          companyName: smartForm.companyName || "وكالة ماستر إيدو باث",
          serviceDescription: smartForm.serviceDescription
        };
        break;
      
      case "paid_invoice":
        subject = `إشعار سداد الفاتورة رقم ${smartForm.invoiceNumber} - وكالة ماستر إيدو باث`;
        content = generatePaidInvoiceTemplate(smartForm);
        variables = {
          customerName: smartForm.customerName,
          amount: smartForm.amount,
          invoiceNumber: smartForm.invoiceNumber,
          currency: smartForm.currency,
          companyName: smartForm.companyName || "وكالة ماستر إيدو باث"
        };
        break;

      case "payment_receipt":
        subject = `سند دفع رقم ${smartForm.invoiceNumber} - وكالة ماستر إيدو باث`;
        content = generatePaymentReceiptTemplate(smartForm);
        variables = {
          customerName: smartForm.customerName,
          amount: smartForm.amount,
          invoiceNumber: smartForm.invoiceNumber,
          currency: smartForm.currency,
          companyName: smartForm.companyName || "وكالة ماستر إيدو باث"
        };
        break;
      
      case "activation":
        subject = `تفعيل حسابك في وكالة ماستر إيدو باث`;
        content = generateActivationTemplate(smartForm);
        variables = {
          customerName: smartForm.customerName,
          username: smartForm.username,
          activationLink: smartForm.activationLink,
          companyName: smartForm.companyName || "وكالة ماستر إيدو باث"
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
          companyName: smartForm.companyName || "وكالة ماستر إيدو باث"
        };
        break;

      case "payment_reminder":
        subject = `تذكير بدفع الفاتورة رقم ${smartForm.invoiceNumber} - وكالة ماستر إيدو باث`;
        content = generatePaymentReminderTemplate(smartForm);
        variables = {
          customerName: smartForm.customerName,
          amount: smartForm.amount,
          invoiceNumber: smartForm.invoiceNumber,
          dueDate: smartForm.dueDate,
          currency: smartForm.currency,
          companyName: smartForm.companyName || "وكالة ماستر إيدو باث"
        };
        break;

      case "order_confirmation":
        subject = `تأكيد الطلب رقم ${smartForm.invoiceNumber} - وكالة ماستر إيدو باث`;
        content = generateOrderConfirmationTemplate(smartForm);
        variables = {
          customerName: smartForm.customerName,
          invoiceNumber: smartForm.invoiceNumber,
          serviceDescription: smartForm.serviceDescription,
          amount: smartForm.amount,
          currency: smartForm.currency,
          companyName: smartForm.companyName || "وكالة ماستر إيدو باث"
        };
        break;

      case "event_invitation":
        subject = `دعوة لحضور ${smartForm.promotionTitle} - وكالة ماستر إيدو باث`;
        content = generateEventInvitationTemplate(smartForm);
        variables = {
          customerName: smartForm.customerName,
          eventTitle: smartForm.promotionTitle,
          eventDate: smartForm.eventDate,
          eventTime: smartForm.eventTime,
          location: smartForm.location,
          companyName: smartForm.companyName || "وكالة ماستر إيدو باث"
        };
        break;

      case "welcome_message":
        subject = `مرحباً بك في وكالة ماستر إيدو باث - ${smartForm.customerName}`;
        content = generateWelcomeMessageTemplate(smartForm);
        variables = {
          customerName: smartForm.customerName,
          username: smartForm.username,
          companyName: smartForm.companyName || "وكالة ماستر إيدو باث"
        };
        break;

      case "thank_you":
        subject = `شكراً لتعاملكم معنا - وكالة ماستر إيدو باث`;
        content = generateThankYouTemplate(smartForm);
        variables = {
          customerName: smartForm.customerName,
          serviceDescription: smartForm.serviceDescription,
          companyName: smartForm.companyName || "وكالة ماستر إيدو باث"
        };
        break;

      case "order_status":
        subject = `تحديث حالة طلبكم رقم ${smartForm.invoiceNumber} - وكالة ماستر إيدو باث`;
        content = generateOrderStatusTemplate(smartForm);
        variables = {
          customerName: smartForm.customerName,
          invoiceNumber: smartForm.invoiceNumber,
          serviceDescription: smartForm.serviceDescription,
          companyName: smartForm.companyName || "وكالة ماستر إيدو باث"
        };
        break;

      case "new_service":
        subject = `خدمة جديدة: ${smartForm.promotionTitle} - وكالة ماستر إيدو باث`;
        content = generateNewServiceTemplate(smartForm);
        variables = {
          customerName: smartForm.customerName,
          serviceTitle: smartForm.promotionTitle,
          serviceDescription: smartForm.promotionDescription,
          companyName: smartForm.companyName || "وكالة ماستر إيدو باث"
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
    <div dir="rtl" style="max-width: 800px; margin: 0 auto; font-family: 'IBM Plex Sans Arabic', 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px; direction: rtl; text-align: right;">
      <style>
        @media (max-width: 768px) {
          .mobile-container { padding: 12px !important; }
          .mobile-text { font-size: 14px !important; }
          .mobile-header { font-size: 22px !important; }
          .mobile-flex { flex-direction: column !important; }
          .mobile-copy-btn { width: 100% !important; margin-top: 10px !important; }
        }
        * { direction: rtl !important; text-align: right !important; }
        .copy-btn {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
        }
        .copy-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
        }
        .copy-success {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%) !important;
          animation: pulse 0.5s ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .bank-card {
          background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
          border-radius: 20px;
          padding: 30px;
          margin: 30px 0;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(30, 41, 59, 0.4);
        }
        .bank-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), transparent);
          border-radius: 50%;
          transform: translate(30px, -30px);
        }
        .account-field {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 20px;
          margin: 15px 0;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .account-field:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .copy-tooltip {
          position: relative;
          display: inline-block;
        }
        .copy-tooltip::after {
          content: 'انقر للنسخ 📋';
          position: absolute;
          top: -35px;
          right: 50%;
          transform: translateX(50%);
          background: #1f2937;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
          white-space: nowrap;
          z-index: 1000;
        }
        .copy-tooltip:hover::after {
          opacity: 1;
        }
      </style>
      
      <script>
        function copyToClipboard(text, buttonId) {
          navigator.clipboard.writeText(text).then(function() {
            const btn = document.getElementById(buttonId);
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ تم النسخ!';
            btn.classList.add('copy-success');
            setTimeout(function() {
              btn.innerHTML = originalText;
              btn.classList.remove('copy-success');
            }, 2000);
          }).catch(function(err) {
            console.error('فشل في النسخ: ', err);
          });
        }
        
        function copyFullAccountInfo() {
          const accountInfo = 'مصرف الراجحي\\nاسم صاحب الحساب: شركة علي صالح الشهري القابضة\\nرقم الحساب: 161000010006086071040\\nالآيبان: SA1980000161608016071040';
          copyToClipboard(accountInfo, 'copyFullBtn');
        }
      </script>
      
      <div style="background: white; border-radius: 25px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.1); direction: rtl; border: 1px solid #e2e8f0;">
        <!-- Mobile-Optimized Corporate Header -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%); padding: 30px 15px; position: relative; overflow: hidden; direction: rtl; border-bottom: 6px solid #0ea5e9;" class="mobile-container">
          <style>
            @media (max-width: 768px) {
              .mobile-container { padding: 20px 10px !important; }
              .mobile-text { font-size: 12px !important; line-height: 1.4 !important; }
              .mobile-header { font-size: 20px !important; line-height: 1.3 !important; }
              .mobile-subheader { font-size: 14px !important; }
              .mobile-flex { 
                flex-direction: column !important; 
                gap: 10px !important; 
                align-items: center !important;
              }
              .mobile-logo { 
                width: 80px !important; 
                height: 80px !important; 
                margin-bottom: 15px !important;
              }
              .mobile-logo-inner { 
                width: 60px !important; 
                height: 60px !important; 
                font-size: 16px !important;
              }
              .mobile-card {
                max-width: 100% !important;
                padding: 15px !important;
                margin: 10px 0 !important;
              }
              .mobile-badge {
                padding: 8px 12px !important;
                font-size: 11px !important;
                margin: 5px !important;
              }
              .mobile-contact {
                position: static !important;
                display: block !important;
                text-align: center !important;
                margin: 10px auto !important;
                padding: 8px 12px !important;
                font-size: 10px !important;
              }
            }
          </style>
          
          <!-- Premium Decorative Elements -->
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #1e40af, #3b82f6, #0ea5e9, #06b6d4, #0891b2, #0e7490, #155e75, #164e63);"></div>
          
          <!-- Corporate Identity Section -->
          <div style="text-align: center; margin-bottom: 20px; direction: rtl;">
            <!-- Mobile-Optimized Logo -->
            <div class="mobile-logo" style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); width: 100px; height: 100px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; border: 3px solid rgba(255,255,255,0.2); box-shadow: 0 10px 25px rgba(0,0,0,0.3); backdrop-filter: blur(15px);">
              <div class="mobile-logo-inner" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #0ea5e9 100%); color: white; width: 70px; height: 70px; border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 900; box-shadow: 0 6px 15px rgba(30, 64, 175, 0.4);">
                <div style="font-size: 20px; line-height: 1;">MEP</div>
                <div style="font-size: 6px; margin-top: 1px; opacity: 0.9; letter-spacing: 1px;">AGENCY</div>
              </div>
            </div>
            
            <!-- Mobile-Optimized Corporate Name -->
            <div class="mobile-card" style="background: rgba(255,255,255,0.08); backdrop-filter: blur(20px); border: 2px solid rgba(255,255,255,0.1); border-radius: 15px; padding: 20px; margin: 0 auto; max-width: 90%; box-shadow: 0 8px 20px rgba(0,0,0,0.2);">
              <h1 class="mobile-header" style="color: white; font-size: 24px; margin: 0 0 10px 0; font-weight: 900; text-shadow: 2px 2px 6px rgba(0,0,0,0.5); direction: rtl; font-family: 'IBM Plex Sans Arabic', 'Cairo'; letter-spacing: 1px; line-height: 1.2;">وكالة ماستر إيدو باث</h1>
              
              <div style="background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), rgba(14, 165, 233, 0.6), transparent); height: 3px; width: 80px; margin: 12px auto; border-radius: 2px; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);"></div>
              
              <h2 class="mobile-subheader" style="color: rgba(255,255,255,0.95); margin: 8px 0 12px 0; font-size: 16px; font-weight: 700; direction: rtl; font-family: 'IBM Plex Sans Arabic'; text-shadow: 1px 1px 4px rgba(0,0,0,0.3);">للخدمات التعليمية والتدريب المتقدم</h2>
              
              <div style="background: rgba(255,255,255,0.1); border-radius: 10px; padding: 10px; margin: 12px 0; border: 1px solid rgba(255,255,255,0.15);">
                <p class="mobile-text" style="color: rgba(255,255,255,0.9); margin: 0; font-size: 12px; direction: rtl; font-family: 'IBM Plex Sans Arabic'; font-weight: 500;">Master Edu Path Educational Services Agency</p>
              </div>
            </div>
          </div>
          
          <!-- Mobile-Optimized Badges -->
          <div class="mobile-flex" style="display: flex; justify-content: center; align-items: center; margin-top: 15px; direction: rtl; flex-wrap: wrap; gap: 8px;">
            <div class="mobile-badge" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(14, 165, 233, 0.2)); padding: 10px 15px; border-radius: 20px; border: 2px solid rgba(59, 130, 246, 0.4); backdrop-filter: blur(15px); box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);">
              <span style="color: #60a5fa; font-size: 12px; font-weight: 800; direction: rtl;">📄 وثيقة رسمية</span>
            </div>
            
            <div class="mobile-badge" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2)); padding: 10px 15px; border-radius: 20px; border: 2px solid rgba(16, 185, 129, 0.4); backdrop-filter: blur(15px); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);">
              <span style="color: #34d399; font-size: 12px; font-weight: 800; direction: rtl;">🏢 معتمدة رسمياً</span>
            </div>
          </div>
          
          <!-- Mobile-Optimized Contact Info -->
          <div class="mobile-contact" style="background: rgba(255,255,255,0.08); padding: 8px 15px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(10px); margin: 15px auto 5px auto; text-align: center; max-width: 280px;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 15px; flex-wrap: wrap; direction: rtl;">
              <span style="color: rgba(255,255,255,0.9); font-size: 10px; font-weight: 700; direction: rtl;">📧 info@masteredupath.com</span>
              <span style="color: rgba(255,255,255,0.9); font-size: 10px; font-weight: 700;">📱 0500776343</span>
            </div>
          </div>

          <!-- Digital Stamp -->
        </div>
        
        <!-- Company & Invoice Details -->
        <div style="padding: 40px 30px; direction: rtl; background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);" class="mobile-container">
          
          <!-- Company & Invoice Info Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 30px; direction: rtl;" class="mobile-flex">
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 15px; padding: 25px; border: 1px solid #e2e8f0; direction: rtl;">
              <h3 style="color: #1e293b; margin: 0 0 20px 0; font-size: 18px; font-weight: 700; direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">🏢 بيانات الشركة</h3>
              <div style="space-y: 12px; direction: rtl;">
                <p style="margin: 8px 0; color: #334155; line-height: 1.8; text-align: right; direction: rtl; font-size: 15px; font-weight: 600; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">وكالة ماستر إيدو باث</p>
                <p style="margin: 6px 0; color: #64748b; text-align: right; direction: rtl; font-size: 14px; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">🌍 المملكة العربية السعودية</p>
                <p style="margin: 6px 0; color: #64748b; text-align: right; direction: rtl; font-size: 14px; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">📧 info@masteredupath.com</p>
                <p style="margin: 6px 0; color: #64748b; text-align: right; direction: rtl; font-size: 14px; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">📱 0500776343</p>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 15px; padding: 25px; border: 1px solid #bae6fd; direction: rtl;">
              <h3 style="color: #0c4a6e; margin: 0 0 20px 0; font-size: 18px; font-weight: 700; direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">📋 تفاصيل الفاتورة</h3>
              <div style="space-y: 12px; direction: rtl;">
                <p style="margin: 8px 0; color: #075985; text-align: right; direction: rtl; font-size: 15px; font-weight: 600; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">رقم الفاتورة: <span style="color: #0ea5e9; font-weight: 800;">#${data.invoiceNumber || 'غير محدد'}</span></p>
                <p style="margin: 6px 0; color: #0369a1; text-align: right; direction: rtl; font-size: 14px; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">📅 تاريخ الإصدار: ${new Date().toLocaleDateString('ar-SA')}</p>
                <p style="margin: 6px 0; color: #0369a1; text-align: right; direction: rtl; font-size: 14px; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">⏰ تاريخ الاستحقاق: ${data.dueDate || 'غير محدد'}</p>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 15px; padding: 25px; margin: 25px 0; border-right: 5px solid #22c55e; border: 1px solid #bbf7d0; direction: rtl;">
            <h3 style="color: #14532d; margin: 0 0 20px 0; font-size: 18px; font-weight: 700; text-align: center; direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">👤 بيانات العميل</h3>
            <div style="background: rgba(255,255,255,0.7); border-radius: 12px; padding: 20px; direction: rtl;">
              <p style="color: #15803d; margin: 10px 0; font-size: 16px; font-weight: 600; text-align: right; direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">الاسم: ${data.customerName || 'غير محدد'}</p>
              <p style="color: #15803d; margin: 10px 0; text-align: right; direction: rtl; font-size: 15px; word-break: break-all; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">البريد الإلكتروني: ${data.customerEmail || 'غير محدد'}</p>
            </div>
          </div>

          <!-- Service Details -->
          <div style="background: white; border: 2px solid #e5e7eb; border-radius: 15px; padding: 25px; margin: 25px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.05); direction: rtl;">
            <h3 style="color: #1f2937; margin: 0 0 25px 0; font-size: 18px; font-weight: 700; text-align: center; direction: rtl; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">📦 تفاصيل الخدمة</h3>
            
            <div style="display: grid; gap: 20px; direction: rtl;">
              <div style="background: #f9fafb; border-radius: 12px; padding: 20px; border: 1px solid #e5e7eb; direction: rtl;">
                <p style="margin: 0 0 12px 0; color: #374151; font-weight: 700; font-size: 15px; text-align: right; direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">وصف الخدمة:</p>
                <p style="margin: 0; color: #1f2937; font-size: 16px; text-align: right; direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">${data.serviceDescription || 'خدمة عامة'}</p>
              </div>
              
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 20px; border-right: 4px solid #22c55e; direction: rtl;">
                <p style="margin: 0 0 12px 0; color: #15803d; font-weight: 700; font-size: 15px; text-align: right; direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">قيمة الخدمة:</p>
                <p style="margin: 0; color: #14532d; font-size: 24px; font-weight: 800; text-align: right; direction: rtl; font-family: 'IBM Plex Sans Arabic';">${data.amount || '0'} ${data.currency || 'ر.س'}</p>
              </div>
            </div>
          </div>

          <!-- Total Amount with Enhanced Design -->
          <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); border-radius: 20px; padding: 30px; margin: 30px 0; text-align: center; box-shadow: 0 15px 35px rgba(22, 163, 74, 0.3); position: relative; overflow: hidden; direction: rtl;">
            <div style="position: absolute; top: -10px; right: -10px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%; opacity: 0.7;"></div>
            <h2 style="color: white; margin: 0 0 15px 0; font-size: 24px; font-weight: 800; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">💰 المبلغ الإجمالي</h2>
            <div style="background: rgba(255,255,255,0.15); border-radius: 15px; padding: 20px; display: inline-block; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.2); direction: rtl;">
              <span style="color: white; font-size: 32px; font-weight: 900; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); direction: rtl; font-family: 'IBM Plex Sans Arabic';">${data.amount || '0'} ${data.currency || 'ر.س'}</span>
            </div>
          </div>

          <!-- Premium Bank Account Card -->
          <div class="bank-card">
            <div style="text-align: center; margin-bottom: 20px; direction: rtl;">
              <div style="background: rgba(255,255,255,0.15); width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto; border: 2px solid rgba(255,255,255,0.2); backdrop-filter: blur(5px);">
                <span style="font-size: 30px;">🏛️</span>
              </div>
              <h2 style="color: white; margin: 0; font-size: 20px; font-weight: 800; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">معلومات التحويل البنكي</h2>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px; direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">نسخ سريع بنقرة واحدة</p>
            </div>

            <!-- Compact Bank Card Design -->
            <div style="background: rgba(255,255,255,0.95); border-radius: 15px; padding: 20px; margin-bottom: 15px; direction: rtl; text-align: center; box-shadow: 0 8px 25px rgba(0,0,0,0.1); border: 2px solid rgba(255,255,255,0.3);">
              
              <!-- Bank Header with Logo -->
              <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); border-radius: 12px; direction: rtl;">
                <div style="background: rgba(255,255,255,0.2); width: 45px; height: 45px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🏛️</div>
                <div style="text-align: right; direction: rtl;">
                  <h3 style="color: white; margin: 0; font-size: 18px; font-weight: 800; font-family: 'IBM Plex Sans Arabic';">مصرف الراجحي</h3>
                  <p style="color: rgba(255,255,255,0.9); margin: 2px 0 0 0; font-size: 12px; font-family: 'IBM Plex Sans Arabic';">Al Rajhi Bank</p>
                </div>
              </div>

              <!-- Account Holder Name -->
              <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 10px; padding: 15px; margin-bottom: 15px; direction: rtl;">
                <div style="display: flex; align-items: center; justify-content: space-between; direction: rtl;">
                  <div style="display: flex; align-items: center; gap: 10px; direction: rtl;">
                    <div style="background: #1e40af; color: white; width: 35px; height: 35px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold;">👤</div>
                    <span style="color: #374151; font-size: 14px; font-weight: 600; font-family: 'IBM Plex Sans Arabic';">اسم صاحب الحساب</span>
                  </div>
                  <div style="text-align: left; direction: rtl;">
                    <p style="margin: 0; color: #1e293b; font-size: 15px; font-weight: 700; text-align: right; direction: rtl; font-family: 'IBM Plex Sans Arabic';">شركة علي صالح الشهري القابضة</p>
                    <p style="margin: 2px 0 0 0; color: #64748b; font-size: 11px; text-align: right; direction: rtl; font-family: 'IBM Plex Sans Arabic';">Ali Saleh Al-Shehri Holding Company</p>
                  </div>
                </div>
              </div>
              
              <!-- Account Details Grid -->
              <div style="display: grid; gap: 12px; direction: rtl;">
                
                <!-- Account Number -->
                <div class="account-field" style="background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(30, 64, 175, 0.2); border-radius: 10px; padding: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; direction: rtl;" class="mobile-flex">
                    <div style="display: flex; align-items: center; gap: 8px; direction: rtl;">
                      <div style="background: #3b82f6; color: white; width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">رح</div>
                      <div style="direction: rtl; text-align: right;">
                        <p style="margin: 0; color: #374151; font-size: 12px; font-weight: 600; font-family: 'IBM Plex Sans Arabic';">رقم الحساب</p>
                        <p style="margin: 1px 0 0 0; color: #64748b; font-size: 10px; font-family: 'IBM Plex Sans Arabic';">Account Number</p>
                      </div>
                    </div>
                    <div style="text-align: left; direction: ltr;" class="mobile-copy-btn">
                      <p style="margin: 0; color: #1e293b; font-size: 15px; font-weight: bold; font-family: 'Courier New', monospace; direction: ltr; background: #f1f5f9; padding: 6px 10px; border-radius: 6px;">161000010006086071040</p>
                      <button onclick="copyToClipboard('161000010006086071040', 'copyAccBtn')" id="copyAccBtn" class="copy-btn" style="margin-top: 6px; font-size: 11px; padding: 6px 12px; font-family: 'IBM Plex Sans Arabic';">
                        📄 نسخ
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- IBAN -->
                <div class="account-field" style="background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(30, 64, 175, 0.2); border-radius: 10px; padding: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; direction: rtl;" class="mobile-flex">
                    <div style="display: flex; align-items: center; gap: 8px; direction: rtl;">
                      <div style="background: #1e40af; color: white; width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold;">IB</div>
                      <div style="direction: rtl; text-align: right;">
                        <p style="margin: 0; color: #374151; font-size: 12px; font-weight: 600; font-family: 'IBM Plex Sans Arabic';">الآيبان</p>
                        <p style="margin: 1px 0 0 0; color: #64748b; font-size: 10px; font-family: 'IBM Plex Sans Arabic';">IBAN</p>
                      </div>
                    </div>
                    <div style="text-align: left; direction: ltr;" class="mobile-copy-btn">
                      <p style="margin: 0; color: #1e293b; font-size: 15px; font-weight: bold; font-family: 'Courier New', monospace; direction: ltr; background: #f0f9ff; padding: 6px 10px; border-radius: 6px;">SA1980000161608016071040</p>
                      <button onclick="copyToClipboard('SA1980000161608016071040', 'copyIbanBtn')" id="copyIbanBtn" class="copy-btn" style="margin-top: 6px; font-size: 11px; padding: 6px 12px; font-family: 'IBM Plex Sans Arabic';">
                        📄 نسخ
                      </button>
                    </div>
                  </div>
                </div>
                
              </div>

              <!-- Copy All Button -->
              <div style="margin: 15px 0 10px 0; text-align: center;">
                <button id="copyFullBtn" onclick="copyFullAccountInfo()" class="copy-btn copy-tooltip" style="font-size: 13px; padding: 10px 20px; font-family: 'IBM Plex Sans Arabic'; background: linear-gradient(135deg, #059669 0%, #047857 100%);" class="mobile-copy-btn">
                  📋 نسخ جميع البيانات البنكية
                </button>
              </div>

              <!-- Banking Instructions -->
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px; margin-top: 15px; direction: rtl; text-align: center;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px; direction: rtl;">
                  <div style="background: #1e40af; color: white; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">ℹ️</div>
                  <span style="color: #1e40af; font-size: 12px; font-weight: 700; font-family: 'IBM Plex Sans Arabic';">تعليمات التحويل البنكي</span>
                </div>
                <ul style="color: #1e3a8a; font-size: 11px; margin: 0; padding: 0; list-style: none; line-height: 1.6; font-family: 'IBM Plex Sans Arabic';">
                  <li style="margin-bottom: 4px;">• استخدم رقم الحساب للتحويلات المحلية</li>
                  <li style="margin-bottom: 4px;">• استخدم الآيبان للتحويلات الدولية</li>
                  <li style="margin-bottom: 4px;">• احتفظ بإيصال التحويل للمراجعة</li>
                  <li>• أرسل صورة الإيصال عبر الواتساب</li>
                </ul>
              </div>
            </div>

            <!-- WhatsApp Section -->
            <div style="background: linear-gradient(135deg, #25d366 0%, #128c7e 100%); border-radius: 12px; padding: 15px; margin-top: 15px; direction: rtl; text-align: center; box-shadow: 0 6px 15px rgba(37, 211, 102, 0.4);">
              <div style="background: rgba(255,255,255,0.15); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px auto; border: 2px solid rgba(255,255,255,0.2);">
                <span style="font-size: 20px;">📱</span>
              </div>
              <p style="margin: 0 0 8px 0; color: white; font-size: 14px; font-weight: 700; direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">أرسل إيصال التحويل فوراً</p>
              <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 8px; display: inline-block; backdrop-filter: blur(5px);">
                <p style="margin: 0; color: white; font-size: 18px; font-weight: bold; direction: rtl; font-family: 'Courier New', monospace;" class="mobile-text">0500776343</p>
              </div>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 10px; direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">WhatsApp Business • متاح 24/7</p>
            </div>

            <!-- Security & Verification Badge -->
            <div style="background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.3); border-radius: 10px; padding: 12px; margin-top: 15px; direction: rtl; text-align: center;">
              <div style="display: flex; align-items: center; justify-content: center; gap: 8px; direction: rtl;">
                <div style="background: #dc2626; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px;">🔒</div>
                <div style="direction: rtl; text-align: center;">
                  <p style="margin: 0; color: #dc2626; font-size: 12px; font-weight: 700; font-family: 'IBM Plex Sans Arabic';">تحويل مصرفي آمن ومشفر</p>
                  <p style="margin: 2px 0 0 0; color: #991b1b; font-size: 10px; font-family: 'IBM Plex Sans Arabic';">Secure & Encrypted Banking Transfer</p>
                </div>
              </div>
            </div>
          </div>

          </div>

          <!-- Important Notes -->
          <div style="background: linear-gradient(135deg, #fef3f2 0%, #fee2e2 100%); border-right: 4px solid #ef4444; border-radius: 15px; padding: 20px; margin: 25px 0; direction: rtl; text-align: right; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.1);">
            <h4 style="color: #dc2626; margin: 0 0 15px 0; font-size: 16px; font-weight: 700; text-align: right; direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">⚠️ تعليمات مهمة:</h4>
            <ul style="color: #7f1d1d; margin: 0; padding-right: 20px; line-height: 2; text-align: right; direction: rtl; list-style-position: inside; font-size: 14px; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">
              <li style="text-align: right; direction: rtl; margin-bottom: 8px; font-weight: 600;">⏰ يرجى سداد الفاتورة في الموعد المحدد</li>
              <li style="text-align: right; direction: rtl; margin-bottom: 8px; font-weight: bold; color: #dc2626;">⚠️ لا يتم اعتماد أي طلب إلا بإيصال الحساب البنكي</li>
              <li style="text-align: right; direction: rtl; margin-bottom: 8px; font-weight: 600;">📱 يرجى إرسال إيصال التحويل على الواتساب فور السداد</li>
              <li style="text-align: right; direction: rtl; font-weight: 600;">💰 في حالة التأخير، قد تطبق رسوم إضافية</li>
            </ul>
          </div>

          <!-- Professional Footer -->
          <div style="border-top: 3px solid #e5e7eb; padding-top: 25px; text-align: center; margin-top: 30px; direction: rtl;">
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 15px; padding: 20px; margin-bottom: 20px; border: 1px solid #e2e8f0; direction: rtl;">
              <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto;">
                <span style="color: white; font-size: 24px;">🙏</span>
              </div>
              <p style="color: #475569; margin: 0 0 8px 0; font-size: 16px; font-weight: 600; direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">شكراً لثقتك في خدماتنا</p>
              <p style="color: #64748b; margin: 0; font-size: 14px; direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">نحن نقدر اختيارك لوكالة ماستر إيدو باث</p>
            </div>
            <div style="background: #f1f5f9; border-radius: 8px; padding: 12px; direction: rtl;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0; direction: rtl; font-family: 'IBM Plex Sans Arabic';" class="mobile-text">© ${new Date().getFullYear()} وكالة ماستر إيدو باث - جميع الحقوق محفوظة</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  };

  // قالب فاتورة مدفوعة
  const generatePaidInvoiceTemplate = (data: SmartFormData) => {
    return `
    <div dir="rtl" style="max-width: 700px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif, 'Times New Roman'; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 15px; direction: rtl; text-align: right;">
      <style>
        @media (max-width: 768px) {
          .mobile-container { padding: 10px !important; }
          .mobile-text { font-size: 14px !important; }
          .mobile-header { font-size: 24px !important; }
        }
        * { direction: rtl !important; text-align: right !important; }
      </style>
      
      <div style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.1); direction: rtl;">
        <!-- Success Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 20px; text-align: center; position: relative; direction: rtl;" class="mobile-container">
          <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto; font-size: 35px;">✅</div>
          <h1 style="color: white; font-size: 24px; margin: 0 0 10px 0; font-weight: 700; direction: rtl;" class="mobile-header">تم الدفع بنجاح!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px; direction: rtl;" class="mobile-text">شكراً لك ${data.customerName || 'عزيزي العميل'}</p>
          
          <!-- Digital Stamp -->
        </div>
        
        <div style="padding: 30px 20px; text-align: center; direction: rtl;" class="mobile-container">
          <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 20px; margin: 20px 0; direction: rtl; text-align: right;">
            <h2 style="color: #065f46; margin: 0 0 15px 0; font-size: 18px; text-align: center; direction: rtl;" class="mobile-text">💰 تفاصيل الدفعة</h2>
            <div style="text-align: right; direction: rtl;">
              <p style="color: #047857; font-size: 16px; margin: 8px 0; text-align: right; direction: rtl;" class="mobile-text"><strong>رقم الفاتورة:</strong> ${data.invoiceNumber || 'غير محدد'}</p>
              <p style="color: #047857; font-size: 16px; margin: 8px 0; text-align: right; direction: rtl;" class="mobile-text"><strong>المبلغ المدفوع:</strong> ${data.amount || '0'} ${data.currency || 'ر.س'}</p>
              <p style="color: #047857; font-size: 14px; margin: 8px 0; text-align: right; direction: rtl;" class="mobile-text"><strong>تاريخ الدفع:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
          </div>

          <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 10px; padding: 20px; margin: 20px 0; direction: rtl; text-align: center;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0; direction: rtl; font-size: 16px;" class="mobile-text">📧 سيتم إرسال إيصال مفصل إلى بريدك الإلكتروني</h3>
            <p style="color: #1e3a8a; margin: 0; direction: rtl; font-size: 14px; word-break: break-all;" class="mobile-text">${data.customerEmail || 'غير محدد'}</p>
          </div>

          <div style="margin: 25px 0; direction: rtl; text-align: center;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 15px 0; direction: rtl;" class="mobile-text">🎉 نشكرك على سرعة السداد</p>
            <p style="color: #6b7280; font-size: 12px; direction: rtl;" class="mobile-text">وكالة ماستر إيدو باث - دائماً في خدمتكم</p>
          </div>
        </div>
      </div>
    </div>`;
  };

  // قالب سند دفع
  const generatePaymentReceiptTemplate = (data: SmartFormData) => {
    return `
    <div dir="rtl" style="max-width: 700px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif, 'Times New Roman'; background: #f8fafc; padding: 15px; direction: rtl; text-align: right;">
      <style>
        @media (max-width: 768px) {
          .mobile-container { padding: 10px !important; }
          .mobile-text { font-size: 14px !important; }
          .mobile-header { font-size: 24px !important; }
          .mobile-flex { flex-direction: column !important; gap: 15px !important; }
          .mobile-table { width: 100% !important; }
          .mobile-table td { display: block !important; text-align: right !important; padding: 8px 0 !important; border: none !important; }
          .mobile-table tr { border-bottom: 1px solid #e5e7eb !important; margin-bottom: 10px !important; display: block !important; }
        }
        * { direction: rtl !important; text-align: right !important; }
      </style>
      
      <div style="background: white; border: 3px solid #e2e8f0; border-radius: 12px; overflow: hidden; direction: rtl;">
        <!-- Mobile-Optimized Corporate Header for Receipt -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%); padding: 30px 15px; text-align: center; color: white; direction: rtl; position: relative; overflow: hidden; border-bottom: 6px solid #16a34a;" class="mobile-container">
          <style>
            @media (max-width: 768px) {
              .mobile-container { padding: 15px 10px !important; }
              .mobile-text { font-size: 11px !important; line-height: 1.4 !important; }
              .mobile-header { font-size: 18px !important; line-height: 1.3 !important; }
              .mobile-subheader { font-size: 13px !important; }
              .mobile-flex { 
                flex-direction: column !important; 
                gap: 8px !important; 
                align-items: center !important;
              }
              .mobile-logo { 
                width: 70px !important; 
                height: 70px !important; 
                margin-bottom: 12px !important;
              }
              .mobile-logo-inner { 
                width: 50px !important; 
                height: 50px !important; 
                font-size: 14px !important;
              }
              .mobile-card {
                max-width: 100% !important;
                padding: 12px !important;
                margin: 8px 0 !important;
              }
              .mobile-badge {
                padding: 6px 10px !important;
                font-size: 10px !important;
                margin: 3px !important;
              }
              .mobile-contact {
                position: static !important;
                display: block !important;
                text-align: center !important;
                margin: 8px auto !important;
                padding: 6px 10px !important;
                font-size: 9px !important;
              }
            }
          </style>
          
          <!-- Premium Decorative Elements -->
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #16a34a, #15803d, #14532d, #166534, #15803d, #16a34a);"></div>
          
          <!-- Mobile-Optimized Logo -->
          <div class="mobile-logo" style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); width: 90px; height: 90px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; border: 3px solid rgba(255,255,255,0.2); box-shadow: 0 10px 25px rgba(0,0,0,0.3); backdrop-filter: blur(15px);">
            <div class="mobile-logo-inner" style="background: linear-gradient(135deg, #16a34a 0%, #15803d 50%, #14532d 100%); color: white; width: 65px; height: 65px; border-radius: 14px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 900; box-shadow: 0 6px 15px rgba(22, 163, 74, 0.4);">
              <div style="font-size: 18px; line-height: 1;">MEP</div>
              <div style="font-size: 5px; margin-top: 1px; opacity: 0.9; letter-spacing: 1px;">RECEIPT</div>
            </div>
          </div>
          
          <!-- Mobile-Optimized Corporate Name -->
          <div class="mobile-card" style="background: rgba(255,255,255,0.08); backdrop-filter: blur(20px); border: 2px solid rgba(255,255,255,0.1); border-radius: 15px; padding: 18px; margin: 0 auto; max-width: 90%; box-shadow: 0 8px 20px rgba(0,0,0,0.2);">
            <h1 class="mobile-header" style="margin: 0 0 8px 0; font-size: 22px; font-weight: 900; text-shadow: 2px 2px 6px rgba(0,0,0,0.5); direction: rtl; font-family: 'IBM Plex Sans Arabic';">وكالة ماستر إيدو باث</h1>
            
            <div style="background: linear-gradient(90deg, transparent, rgba(22, 163, 74, 0.6), rgba(21, 128, 61, 0.6), transparent); height: 2px; width: 60px; margin: 10px auto; border-radius: 1px; box-shadow: 0 2px 6px rgba(22, 163, 74, 0.3);"></div>
            
            <h2 class="mobile-subheader" style="color: rgba(255,255,255,0.95); margin: 6px 0 10px 0; font-size: 14px; font-weight: 700; direction: rtl; font-family: 'IBM Plex Sans Arabic';">للخدمات التعليمية والتدريب المتقدم</h2>
            
            <div style="background: rgba(22, 163, 74, 0.15); border-radius: 10px; padding: 8px; margin: 10px 0; border: 1px solid rgba(22, 163, 74, 0.25);">
              <span class="mobile-text" style="color: #34d399; font-size: 12px; font-weight: 800; direction: rtl;">📋 سند دفع رسمي</span>
            </div>
          </div>
          
          <!-- Mobile-Optimized Badge -->
          <div class="mobile-badge" style="background: linear-gradient(135deg, rgba(22, 163, 74, 0.2), rgba(21, 128, 61, 0.2)); padding: 8px 15px; border-radius: 20px; border: 2px solid rgba(22, 163, 74, 0.4); backdrop-filter: blur(15px); margin: 15px auto; display: inline-block;">
            <span style="color: #34d399; font-size: 11px; font-weight: 800;">🏢 معتمد رسمياً</span>
          </div>
          
          <!-- Mobile-Optimized Contact Info -->
          <div class="mobile-contact" style="background: rgba(255,255,255,0.08); padding: 6px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15); margin: 12px auto; text-align: center; max-width: 250px;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; direction: rtl;">
              <span style="color: rgba(255,255,255,0.9); font-size: 9px; font-weight: 700; direction: rtl;">📧 info@masteredupath.com</span>
              <span style="color: rgba(255,255,255,0.9); font-size: 9px; font-weight: 700;">📱 0500776343</span>
            </div>
          </div>
        </div>

        <div style="padding: 25px 15px; direction: rtl;" class="mobile-container">
          <!-- Receipt Number & Date -->
          <div style="display: flex; justify-content: space-between; background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; direction: rtl;" class="mobile-flex">
            <div style="text-align: right; direction: rtl;">
              <p style="margin: 0; color: #475569; font-weight: bold; text-align: right; direction: rtl; font-size: 14px;" class="mobile-text">رقم السند:</p>
              <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: bold; text-align: right; direction: rtl;" class="mobile-text">#${data.invoiceNumber || 'غير محدد'}</p>
            </div>
            <div style="text-align: right; direction: rtl;">
              <p style="margin: 0; color: #475569; font-weight: bold; text-align: right; direction: rtl; font-size: 14px;" class="mobile-text">التاريخ:</p>
              <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 14px; text-align: right; direction: rtl;" class="mobile-text">${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
          </div>

          <!-- Customer & Payment Details - Mobile Optimized -->
          <div style="margin: 20px 0; direction: rtl;">
            <div style="background: #fafafa; border-radius: 8px; padding: 15px; margin-bottom: 15px; direction: rtl;">
              <p style="margin: 0 0 8px 0; color: #374151; font-weight: bold; text-align: right; direction: rtl; font-size: 14px;" class="mobile-text">استلمنا من السيد/ة:</p>
              <p style="margin: 0; color: #1f2937; text-align: right; direction: rtl; font-size: 14px;" class="mobile-text">${data.customerName}</p>
            </div>
            
            <div style="background: #f0fdf4; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-right: 4px solid #10b981; direction: rtl;">
              <p style="margin: 0 0 8px 0; color: #374151; font-weight: bold; text-align: right; direction: rtl; font-size: 14px;" class="mobile-text">مبلغ وقدره:</p>
              <p style="margin: 0; color: #059669; font-size: 18px; font-weight: bold; text-align: right; direction: rtl;">${data.amount || '0'} ${data.currency || 'ر.س'}</p>
            </div>
            
            <div style="background: #fafafa; border-radius: 8px; padding: 15px; margin-bottom: 15px; direction: rtl;">
              <p style="margin: 0 0 8px 0; color: #374151; font-weight: bold; text-align: right; direction: rtl; font-size: 14px;" class="mobile-text">وذلك عن:</p>
              <p style="margin: 0; color: #1f2937; text-align: right; direction: rtl; font-size: 14px;" class="mobile-text">سداد الفاتورة رقم ${data.invoiceNumber || 'غير محدد'}</p>
            </div>
            
            <div style="background: #fafafa; border-radius: 8px; padding: 15px; direction: rtl;">
              <p style="margin: 0 0 8px 0; color: #374151; font-weight: bold; text-align: right; direction: rtl; font-size: 14px;" class="mobile-text">البريد الإلكتروني:</p>
              <p style="margin: 0; color: #1f2937; text-align: right; direction: rtl; font-size: 12px; word-break: break-all;" class="mobile-text">${data.customerEmail}</p>
            </div>
          </div>

          <!-- Amount in Words -->
          <div style="background: #f0f9ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center; direction: rtl;">
            <p style="margin: 0; color: #1e40af; font-weight: bold; font-size: 14px; direction: rtl;" class="mobile-text">المبلغ بالأحرف:</p>
            <p style="margin: 5px 0 0 0; color: #1e3a8a; font-size: 16px; border-bottom: 2px dashed #3b82f6; padding-bottom: 8px; display: inline-block; min-width: 200px; direction: rtl;" class="mobile-text">${data.amount || '0'} ${data.currency || 'ر.س'} فقط لا غير</p>
          </div>

          <!-- WhatsApp Contact -->
          <div style="background: #25d366; border-radius: 8px; padding: 15px; margin: 20px 0; direction: rtl; text-align: center; color: white;">
            <p style="margin: 0 0 5px 0; color: white; font-size: 14px; direction: rtl;" class="mobile-text">📱 للاستفسارات والتواصل:</p>
            <p style="margin: 0; color: white; font-size: 16px; font-weight: bold; direction: rtl;" class="mobile-text">0500776343</p>
          </div>

          <!-- Signature Section - Mobile Optimized -->
          <div style="display: flex; justify-content: space-between; margin-top: 30px; direction: rtl; gap: 20px;" class="mobile-flex">
            <div style="text-align: center; flex: 1; direction: rtl;">
              <div style="border-bottom: 2px solid #374151; width: 100%; max-width: 150px; margin: 0 auto 8px auto; height: 30px;"></div>
              <p style="margin: 0; color: #6b7280; font-size: 12px; direction: rtl;" class="mobile-text">توقيع المستلم</p>
            </div>
            <div style="text-align: center; flex: 1; direction: rtl;">
              
              <div style="border-bottom: 2px solid #374151; width: 100%; max-width: 150px; margin: 0 auto 8px auto; height: 30px;"></div>
              <p style="margin: 0; color: #6b7280; font-size: 12px; direction: rtl;" class="mobile-text">ختم الشركة</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; direction: rtl;">
            <p style="margin: 0; color: #64748b; font-size: 14px; direction: rtl;" class="mobile-text">وكالة ماستر إيدو باث</p>
            <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 10px; direction: rtl;" class="mobile-text">المملكة العربية السعودية | info@masteredupath.com</p>
          </div>
        </div>
      </div>
    </div>`;
  };

  const generateActivationTemplate = (data: SmartFormData) => {
    return `
    <div dir="rtl" style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif, 'Times New Roman'; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; direction: rtl; text-align: right;">
      <div style="background: white; border-radius: 15px; padding: 40px; text-align: center; direction: rtl;">
      <!-- Mobile-Optimized Corporate Header for Activation -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%); border-radius: 15px 15px 0 0; padding: 30px 20px; text-align: center; direction: rtl; position: relative; overflow: hidden; border-bottom: 6px solid #10b981;">
        <style>
          @media (max-width: 768px) {
            .mobile-container { padding: 15px 10px !important; }
            .mobile-text { font-size: 11px !important; line-height: 1.4 !important; }
            .mobile-header { font-size: 18px !important; line-height: 1.3 !important; }
            .mobile-subheader { font-size: 13px !important; }
            .mobile-flex { 
              flex-direction: column !important; 
              gap: 8px !important; 
              align-items: center !important;
            }
            .mobile-logo { 
              width: 75px !important; 
              height: 75px !important; 
              margin-bottom: 15px !important;
            }
            .mobile-logo-inner { 
              width: 55px !important; 
              height: 55px !important; 
              font-size: 16px !important;
            }
            .mobile-card {
              max-width: 100% !important;
              padding: 15px !important;
              margin: 10px 0 !important;
            }
            .mobile-badge {
              padding: 6px 12px !important;
              font-size: 10px !important;
              margin: 4px !important;
            }
            .mobile-contact {
              position: static !important;
              display: block !important;
              text-align: center !important;
              margin: 10px auto !important;
              padding: 6px 12px !important;
              font-size: 9px !important;
            }
          }
        </style>
        
        <!-- Premium Decorative Elements -->
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #10b981, #059669, #047857, #065f46, #047857, #10b981);"></div>
        
        <!-- Mobile-Optimized Logo -->
        <div class="mobile-logo" style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); width: 100px; height: 100px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; border: 3px solid rgba(255,255,255,0.2); box-shadow: 0 12px 28px rgba(0,0,0,0.3); backdrop-filter: blur(15px);">
          <div class="mobile-logo-inner" style="background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%); color: white; width: 70px; height: 70px; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 900; box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4);">
            <div style="font-size: 20px; line-height: 1;">MEP</div>
            <div style="font-size: 6px; margin-top: 1px; opacity: 0.9; letter-spacing: 1px;">WELCOME</div>
          </div>
        </div>
        
        <!-- Mobile-Optimized Corporate Name -->
        <div class="mobile-card" style="background: rgba(255,255,255,0.08); backdrop-filter: blur(20px); border: 2px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 20px; margin: 0 auto; max-width: 90%; box-shadow: 0 8px 25px rgba(0,0,0,0.2);">
          <h1 class="mobile-header" style="margin: 0 0 10px 0; font-size: 24px; font-weight: 900; text-shadow: 2px 2px 6px rgba(0,0,0,0.5); direction: rtl; font-family: 'IBM Plex Sans Arabic'; letter-spacing: 0.5px;">وكالة ماستر إيدو باث</h1>
          
          <div style="background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.6), rgba(5, 150, 105, 0.6), transparent); height: 3px; width: 80px; margin: 12px auto; border-radius: 2px; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);"></div>
          
          <h2 class="mobile-subheader" style="color: rgba(255,255,255,0.95); margin: 8px 0 12px 0; font-size: 16px; font-weight: 700; direction: rtl; font-family: 'IBM Plex Sans Arabic'; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">للخدمات التعليمية والتدريب المتقدم</h2>
          
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; margin: 12px 0; border: 1px solid rgba(255,255,255,0.15);">
            <p class="mobile-text" style="color: rgba(255,255,255,0.9); margin: 0; font-size: 13px; direction: rtl; font-family: 'IBM Plex Sans Arabic'; font-weight: 500;">Master Edu Path Educational Services Agency</p>
          </div>
          
          <!-- Welcome Message -->
          <div style="background: rgba(16, 185, 129, 0.15); border: 2px solid rgba(16, 185, 129, 0.3); border-radius: 15px; padding: 15px; margin: 15px 0; backdrop-filter: blur(5px);">
            <h3 class="mobile-header" style="color: #34d399; margin: 0 0 8px 0; font-size: 18px; font-weight: 800; direction: rtl; text-shadow: 1px 1px 3px rgba(0,0,0,0.2);">مرحباً بك ${data.customerName}</h3>
            <p class="mobile-text" style="color: rgba(255,255,255,0.9); margin: 0; font-size: 12px; direction: rtl; font-weight: 600;">حسابك جاهز للاستخدام في منصتنا الرسمية</p>
          </div>
          
        </div>
        
        <!-- Mobile-Optimized Badges -->
        <div class="mobile-flex" style="display: flex; justify-content: center; gap: 10px; margin-top: 18px; flex-wrap: wrap;">
          <div class="mobile-badge" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2)); padding: 8px 15px; border-radius: 20px; border: 2px solid rgba(16, 185, 129, 0.4); backdrop-filter: blur(15px);">
            <span style="color: #34d399; font-size: 11px; font-weight: 800;">🔐 تفعيل حساب</span>
          </div>
          
          <div class="mobile-badge" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2)); padding: 8px 15px; border-radius: 20px; border: 2px solid rgba(59, 130, 246, 0.4); backdrop-filter: blur(15px);">
            <span style="color: #60a5fa; font-size: 11px; font-weight: 800;">🏢 معتمد رسمياً</span>
          </div>
        </div>
        
        <!-- Mobile-Optimized Contact Info -->
        <div class="mobile-contact" style="background: rgba(255,255,255,0.08); padding: 6px 12px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.15); margin: 15px auto; text-align: center; max-width: 260px;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; direction: rtl;">
            <span style="color: rgba(255,255,255,0.9); font-size: 9px; font-weight: 700; direction: rtl;">📧 info@masteredupath.com</span>
            <span style="color: rgba(255,255,255,0.9); font-size: 9px; font-weight: 700;">📱 0500776343</span>
          </div>
        </div>
      </div>

        <div style="background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 10px; padding: 25px; margin: 25px 0; direction: rtl; text-align: right;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; text-align: center; direction: rtl;">تفاصيل حسابك</h3>
          <p style="color: #075985; margin: 5px 0; text-align: right; direction: rtl;"><strong>اسم المستخدم:</strong> ${data.username}</p>
          <p style="color: #075985; margin: 5px 0; text-align: right; direction: rtl;"><strong>البريد الإلكتروني:</strong> ${data.customerEmail}</p>
        </div>

        <div style="margin: 30px 0; text-align: center; direction: rtl;">
          <a href="${data.activationLink}" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); direction: rtl;">تفعيل حسابك الآن</a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 25px; color: #6b7280; font-size: 14px; direction: rtl; text-align: center;">
          <p style="direction: rtl;">إذا لم تقم بإنشاء هذا الحساب، يرجى تجاهل هذه الرسالة</p>
          <p style="margin-top: 15px; direction: rtl;"><strong>${data.companyName}</strong> - نحن سعداء لانضمامك إلينا</p>
        </div>
      </div>
    </div>`;
  };

  const generatePromotionTemplate = (data: SmartFormData) => {
    return `
    <div dir="rtl" style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif, 'Times New Roman'; background: linear-gradient(135deg, #ff6b6b, #ee5a24); padding: 20px; direction: rtl; text-align: right;">
      <div style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.15); direction: rtl;">
        <!-- Mobile-Optimized Corporate Header for Promotions -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%); padding: 30px 20px; text-align: center; color: white; direction: rtl; position: relative; overflow: hidden; border-bottom: 6px solid #ff6b6b;">
          <style>
            @media (max-width: 768px) {
              .mobile-container { padding: 15px 10px !important; }
              .mobile-text { font-size: 11px !important; line-height: 1.4 !important; }
              .mobile-header { font-size: 18px !important; line-height: 1.3 !important; }
              .mobile-subheader { font-size: 13px !important; }
              .mobile-flex { 
                flex-direction: column !important; 
                gap: 8px !important; 
                align-items: center !important;
              }
              .mobile-logo { 
                width: 75px !important; 
                height: 75px !important; 
                margin-bottom: 15px !important;
              }
              .mobile-logo-inner { 
                width: 55px !important; 
                height: 55px !important; 
                font-size: 15px !important;
              }
              .mobile-card {
                max-width: 100% !important;
                padding: 15px !important;
                margin: 10px 0 !important;
              }
              .mobile-badge {
                padding: 6px 12px !important;
                font-size: 10px !important;
                margin: 4px !important;
              }
              .mobile-contact {
                position: static !important;
                display: block !important;
                text-align: center !important;
                margin: 10px auto !important;
                padding: 6px 12px !important;
                font-size: 9px !important;
              }
              .mobile-promo-banner {
                padding: 15px !important;
                margin: 12px 0 !important;
                border-radius: 15px !important;
              }
              .mobile-promo-title {
                font-size: 20px !important;
                margin-bottom: 6px !important;
              }
              .mobile-promo-desc {
                font-size: 12px !important;
              }
            }
          </style>
          
          <!-- Premium Decorative Elements -->
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #ff6b6b, #ee5a24, #ea580c, #dc2626, #ea580c, #ff6b6b);"></div>
          
          <!-- Mobile-Optimized Logo -->
          <div class="mobile-logo" style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); width: 100px; height: 100px; border-radius: 22px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; border: 3px solid rgba(255,255,255,0.2); box-shadow: 0 12px 28px rgba(0,0,0,0.3); backdrop-filter: blur(15px);">
            <div class="mobile-logo-inner" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #dc2626 100%); color: white; width: 70px; height: 70px; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 900; box-shadow: 0 6px 18px rgba(255, 107, 107, 0.4);">
              <div style="font-size: 18px; line-height: 1;">MEP</div>
              <div style="font-size: 6px; margin-top: 1px; opacity: 0.9; letter-spacing: 1px;">OFFERS</div>
            </div>
          </div>
          
          <!-- Mobile-Optimized Corporate Name -->
          <div class="mobile-card" style="background: rgba(255,255,255,0.08); backdrop-filter: blur(20px); border: 2px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 20px; margin: 0 auto; max-width: 90%; box-shadow: 0 8px 25px rgba(0,0,0,0.2);">
            <h1 class="mobile-header" style="margin: 0 0 10px 0; font-size: 22px; font-weight: 900; text-shadow: 2px 2px 6px rgba(0,0,0,0.5); direction: rtl; font-family: 'IBM Plex Sans Arabic';">وكالة ماستر إيدو باث</h1>
            
            <div style="background: linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.6), rgba(238, 90, 36, 0.6), transparent); height: 3px; width: 70px; margin: 12px auto; border-radius: 2px; box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);"></div>
            
            <h2 class="mobile-subheader" style="margin: 8px 0 15px 0; font-size: 15px; font-weight: 700; direction: rtl; font-family: 'IBM Plex Sans Arabic'; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">للخدمات التعليمية والتدريب المتقدم</h2>
            
            <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 10px; margin: 12px 0; border: 1px solid rgba(255,255,255,0.15);">
              <p class="mobile-text" style="margin: 0; font-size: 11px; opacity: 0.9; direction: rtl; font-weight: 500;">Master Edu Path Educational Services Agency</p>
            </div>
            
            <!-- Mobile-Optimized Promotion Banner -->
            <div class="mobile-promo-banner" style="background: linear-gradient(135deg, #ff6b6b, #ee5a24); border: 2px solid rgba(255,255,255,0.3); border-radius: 18px; padding: 20px; margin: 15px 0; backdrop-filter: blur(5px); box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);">
              <h3 class="mobile-promo-title" style="margin: 0 0 6px 0; font-size: 22px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); direction: rtl; font-weight: 800;">${data.promotionTitle}</h3>
              <p class="mobile-promo-desc" style="margin: 0; font-size: 14px; opacity: 0.95; direction: rtl; font-weight: 600;">عرض حصري من الإدارة لعميلنا الكريم ${data.customerName}</p>
            </div>
            
          </div>
          
          <!-- Mobile-Optimized Badges -->
          <div class="mobile-flex" style="display: flex; justify-content: center; gap: 8px; margin-top: 18px; flex-wrap: wrap;">
            <div class="mobile-badge" style="background: linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(238, 90, 36, 0.2)); padding: 8px 12px; border-radius: 18px; border: 2px solid rgba(255, 107, 107, 0.4); backdrop-filter: blur(15px);">
              <span style="color: #fca5a5; font-size: 10px; font-weight: 800;">🎯 عرض تجاري</span>
            </div>
            
            <div class="mobile-badge" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2)); padding: 8px 12px; border-radius: 18px; border: 2px solid rgba(245, 158, 11, 0.4); backdrop-filter: blur(15px);">
              <span style="color: #fbbf24; font-size: 10px; font-weight: 800;">⭐ عرض محدود</span>
            </div>
          </div>
          
          <!-- Mobile-Optimized Contact Info -->
          <div class="mobile-contact" style="background: rgba(255,255,255,0.08); padding: 6px 12px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.15); margin: 15px auto; text-align: center; max-width: 260px;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; direction: rtl;">
              <span style="color: rgba(255,255,255,0.9); font-size: 9px; font-weight: 700; direction: rtl;">📧 info@masteredupath.com</span>
              <span style="color: rgba(255,255,255,0.9); font-size: 9px; font-weight: 700;">📱 0500776343</span>
            </div>
          </div>
        </div>

        <div style="padding: 40px; direction: rtl;">
          <div style="text-align: center; margin-bottom: 30px; direction: rtl;">
            <div style="display: inline-block; background: #ff6b6b; color: white; padding: 20px; border-radius: 50%; font-size: 48px; font-weight: bold; margin-bottom: 20px; box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);">
              ${data.discountPercent}%
            </div>
            <h2 style="color: #1f2937; margin: 0; font-size: 24px; direction: rtl;">خصم هائل!</h2>
          </div>

          <div style="background: #fef3f2; border: 2px solid #fca5a5; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center; direction: rtl;">
            <p style="color: #dc2626; font-size: 18px; margin: 0; line-height: 1.6; direction: rtl;">${data.promotionDescription}</p>
          </div>

          <div style="text-align: center; margin: 35px 0; direction: rtl;">
            <a href="#" style="background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 18px 35px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4); direction: rtl;">احصل على العرض الآن</a>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 25px; text-align: center; color: #6b7280; font-size: 14px; direction: rtl;">
            <p style="direction: rtl;">⏰ العرض لفترة محدودة - لا تفوت الفرصة!</p>
            <p style="margin-top: 15px; direction: rtl;"><strong>${data.companyName}</strong> - دائماً معك بأفضل العروض</p>
          </div>
        </div>
      </div>
    </div>`;
  };

  // دوال إنشاء القوالب الجديدة
  const generatePaymentReminderTemplate = (data: SmartFormData) => {
    return `
    <div dir="rtl" style="max-width: 700px; margin: 0 auto; font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #fbbf24, #f59e0b); padding: 20px; direction: rtl; text-align: right;">
      <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.1); direction: rtl; border: 1px solid #e5e7eb;">
        <!-- ترويسة تذكير الدفع -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%); padding: 30px 20px; text-align: center; color: white; direction: rtl; position: relative; border-bottom: 6px solid #f59e0b;">
          <div style="text-align: center; margin-bottom: 20px; direction: rtl;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 100px; height: 100px; background: linear-gradient(135deg, #f59e0b, #fbbf24); border-radius: 50%; margin-bottom: 20px; position: relative; overflow: hidden; box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);">
              <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #0f172a, #334155); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold;">⏰</div>
            </div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">وكالة ماستر إيدو باث</h1>
            <p style="margin: 10px 0 0; font-size: 18px; color: #e2e8f0; font-weight: 500;">للخدمات التعليمية والتدريب المتقدم</p>
            
          </div>
        </div>

        <div style="padding: 40px 30px; direction: rtl; text-align: right;">
          <h2 style="color: #f59e0b; font-size: 28px; font-weight: 700; margin-bottom: 25px; text-align: center;">تذكير بدفع المستحقات 🔔</h2>
          
          <p style="color: #374151; font-size: 18px; line-height: 1.8; margin-bottom: 25px;">
            عزيزي/عزيزتي <strong style="color: #f59e0b;">${data.customerName || 'عزيزي العميل'}</strong>،<br><br>
            نتواصل معكم بكل احترام للتذكير اللطيف بسداد الفاتورة المستحقة.
          </p>
          
          <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 15px; padding: 25px; margin: 25px 0; border-left: 5px solid #f59e0b; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);">
            <h3 style="color: #92400e; margin-bottom: 15px; font-size: 20px; font-weight: 600;">📋 تفاصيل الفاتورة:</h3>
            <p style="margin: 10px 0; color: #92400e; font-size: 16px;"><strong>رقم الفاتورة:</strong> ${data.invoiceNumber || 'غير محدد'}</p>
            <p style="margin: 10px 0; color: #92400e; font-size: 16px;"><strong>المبلغ المستحق:</strong> ${data.amount || '0'} ${data.currency || 'ر.س'}</p>
            <p style="margin: 10px 0; color: #92400e; font-size: 16px;"><strong>تاريخ الاستحقاق:</strong> ${data.dueDate || 'غير محدد'}</p>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.7; margin-bottom: 30px; text-align: center;">
            نقدر تفهمكم ونتطلع لسداد المستحقات في أقرب وقت ممكن.<br>
            شكراً لكم على تعاونكم المستمر معنا 🙏
          </p>
        </div>
      </div>
    </div>`;
  };

  const generateOrderConfirmationTemplate = (data: SmartFormData) => {
    return `
    <div dir="rtl" style="max-width: 700px; margin: 0 auto; font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #10b981, #059669); padding: 20px; direction: rtl; text-align: right;">
      <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.1); direction: rtl; border: 1px solid #e5e7eb;">
        <!-- ترويسة تأكيد الطلب -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%); padding: 30px 20px; text-align: center; color: white; direction: rtl; position: relative; border-bottom: 6px solid #10b981;">
          <div style="text-align: center; margin-bottom: 20px; direction: rtl;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 100px; height: 100px; background: linear-gradient(135deg, #10b981, #34d399); border-radius: 50%; margin-bottom: 20px; position: relative; overflow: hidden; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);">
              <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #0f172a, #334155); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold;">✅</div>
            </div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #34d399, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">وكالة ماستر إيدو باث</h1>
            <p style="margin: 10px 0 0; font-size: 18px; color: #e2e8f0; font-weight: 500;">للخدمات التعليمية والتدريب المتقدم</p>
            
          </div>
        </div>

        <div style="padding: 40px 30px; direction: rtl; text-align: right;">
          <h2 style="color: #10b981; font-size: 28px; font-weight: 700; margin-bottom: 25px; text-align: center;">تأكيد استلام طلبكم 🎉</h2>
          
          <p style="color: #374151; font-size: 18px; line-height: 1.8; margin-bottom: 25px;">
            عزيزي/عزيزتي <strong style="color: #10b981;">${data.customerName}</strong>،<br><br>
            يسعدنا إخباركم بأنه تم استلام وتأكيد طلبكم بنجاح!
          </p>
          
          <div style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border-radius: 15px; padding: 25px; margin: 25px 0; border-left: 5px solid #10b981; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);">
            <h3 style="color: #047857; margin-bottom: 15px; font-size: 20px; font-weight: 600;">📋 تفاصيل الطلب:</h3>
            <p style="margin: 10px 0; color: #047857; font-size: 16px;"><strong>رقم الطلب:</strong> ${data.invoiceNumber}</p>
            <p style="margin: 10px 0; color: #047857; font-size: 16px;"><strong>الخدمة المطلوبة:</strong> ${data.serviceDescription}</p>
            <p style="margin: 10px 0; color: #047857; font-size: 16px;"><strong>القيمة الإجمالية:</strong> ${data.amount} ${data.currency}</p>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.7; margin-bottom: 30px; text-align: center;">
            سيتم البدء في تنفيذ طلبكم وسنقوم بإبلاغكم بتطورات العمل أولاً بأول.<br>
            شكراً لثقتكم في خدماتنا 🌟
          </p>
        </div>
      </div>
    </div>`;
  };

  const generateEventInvitationTemplate = (data: SmartFormData) => {
    return `
    <div dir="rtl" style="max-width: 700px; margin: 0 auto; font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 20px; direction: rtl; text-align: right;">
      <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.1); direction: rtl; border: 1px solid #e5e7eb;">
        <!-- ترويسة دعوة الفعالية -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%); padding: 30px 20px; text-align: center; color: white; direction: rtl; position: relative; border-bottom: 6px solid #8b5cf6;">
          <div style="text-align: center; margin-bottom: 20px; direction: rtl;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 100px; height: 100px; background: linear-gradient(135deg, #8b5cf6, #a78bfa); border-radius: 50%; margin-bottom: 20px; position: relative; overflow: hidden; box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);">
              <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #0f172a, #334155); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold;">📅</div>
            </div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #a78bfa, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">وكالة ماستر إيدو باث</h1>
            <p style="margin: 10px 0 0; font-size: 18px; color: #e2e8f0; font-weight: 500;">للخدمات التعليمية والتدريب المتقدم</p>
            
          </div>
        </div>

        <div style="padding: 40px 30px; direction: rtl; text-align: right;">
          <h2 style="color: #8b5cf6; font-size: 28px; font-weight: 700; margin-bottom: 25px; text-align: center;">دعوة خاصة لحضور فعاليتنا 🎊</h2>
          
          <p style="color: #374151; font-size: 18px; line-height: 1.8; margin-bottom: 25px;">
            عزيزي/عزيزتي <strong style="color: #8b5cf6;">${data.customerName}</strong>،<br><br>
            يشرفنا دعوتكم لحضور فعاليتنا المميزة!
          </p>
          
          <div style="background: linear-gradient(135deg, #ede9fe, #ddd6fe); border-radius: 15px; padding: 25px; margin: 25px 0; border-left: 5px solid #8b5cf6; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);">
            <h3 style="color: #6d28d9; margin-bottom: 15px; font-size: 20px; font-weight: 600;">📋 تفاصيل الفعالية:</h3>
            <p style="margin: 10px 0; color: #6d28d9; font-size: 16px;"><strong>اسم الفعالية:</strong> ${data.promotionTitle}</p>
            <p style="margin: 10px 0; color: #6d28d9; font-size: 16px;"><strong>التاريخ:</strong> ${data.eventDate}</p>
            <p style="margin: 10px 0; color: #6d28d9; font-size: 16px;"><strong>الوقت:</strong> ${data.eventTime}</p>
            <p style="margin: 10px 0; color: #6d28d9; font-size: 16px;"><strong>المكان:</strong> ${data.location}</p>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.7; margin-bottom: 30px; text-align: center;">
            نتطلع لحضوركم الكريم ومشاركتكم في هذا الحدث المهم.<br>
            يرجى تأكيد الحضور في أقرب وقت ممكن 🎯
          </p>
        </div>
      </div>
    </div>`;
  };

  const generateWelcomeMessageTemplate = (data: SmartFormData) => {
    return `
    <div dir="rtl" style="max-width: 700px; margin: 0 auto; font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #06b6d4, #0891b2); padding: 20px; direction: rtl; text-align: right;">
      <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.1); direction: rtl; border: 1px solid #e5e7eb;">
        <!-- ترويسة الترحيب -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%); padding: 30px 20px; text-align: center; color: white; direction: rtl; position: relative; border-bottom: 6px solid #06b6d4;">
          <div style="text-align: center; margin-bottom: 20px; direction: rtl;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 100px; height: 100px; background: linear-gradient(135deg, #06b6d4, #67e8f9); border-radius: 50%; margin-bottom: 20px; position: relative; overflow: hidden; box-shadow: 0 8px 25px rgba(6, 182, 212, 0.4);">
              <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #0f172a, #334155); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold;">🤝</div>
            </div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #67e8f9, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">وكالة ماستر إيدو باث</h1>
            <p style="margin: 10px 0 0; font-size: 18px; color: #e2e8f0; font-weight: 500;">للخدمات التعليمية والتدريب المتقدم</p>
            
          </div>
        </div>

        <div style="padding: 40px 30px; direction: rtl; text-align: right;">
          <h2 style="color: #06b6d4; font-size: 28px; font-weight: 700; margin-bottom: 25px; text-align: center;">أهلاً وسهلاً بك معنا! 🌟</h2>
          
          <p style="color: #374151; font-size: 18px; line-height: 1.8; margin-bottom: 25px;">
            عزيزي/عزيزتي <strong style="color: #06b6d4;">${data.customerName}</strong>،<br><br>
            مرحباً بك في عائلة وكالة ماستر إيدو باث! نحن سعداء جداً لانضمامك إلينا.
          </p>
          
          <div style="background: linear-gradient(135deg, #cffafe, #a5f3fc); border-radius: 15px; padding: 25px; margin: 25px 0; border-left: 5px solid #06b6d4; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.2);">
            <h3 style="color: #0e7490; margin-bottom: 15px; font-size: 20px; font-weight: 600;">🚀 معلومات حسابك:</h3>
            <p style="margin: 10px 0; color: #0e7490; font-size: 16px;"><strong>اسم المستخدم:</strong> ${data.username}</p>
            <p style="margin: 10px 0; color: #0e7490; font-size: 16px;">يمكنك الآن الاستفادة من جميع خدماتنا المتميزة</p>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.7; margin-bottom: 30px; text-align: center;">
            نحن هنا لخدمتك وتقديم أفضل الحلول التعليمية والتدريبية.<br>
            مرحباً بك مرة أخرى في رحلة التعلم والنجاح! 🎓
          </p>
        </div>
      </div>
    </div>`;
  };

  const generateThankYouTemplate = (data: SmartFormData) => {
    return `
    <div dir="rtl" style="max-width: 700px; margin: 0 auto; font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f43f5e, #e11d48); padding: 20px; direction: rtl; text-align: right;">
      <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.1); direction: rtl; border: 1px solid #e5e7eb;">
        <!-- ترويسة الشكر -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%); padding: 30px 20px; text-align: center; color: white; direction: rtl; position: relative; border-bottom: 6px solid #f43f5e;">
          <div style="text-align: center; margin-bottom: 20px; direction: rtl;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 100px; height: 100px; background: linear-gradient(135deg, #f43f5e, #fb7185); border-radius: 50%; margin-bottom: 20px; position: relative; overflow: hidden; box-shadow: 0 8px 25px rgba(244, 63, 94, 0.4);">
              <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #0f172a, #334155); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold;">❤️</div>
            </div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #fb7185, #f43f5e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">وكالة ماستر إيدو باث</h1>
            <p style="margin: 10px 0 0; font-size: 18px; color: #e2e8f0; font-weight: 500;">للخدمات التعليمية والتدريب المتقدم</p>
            
          </div>
        </div>

        <div style="padding: 40px 30px; direction: rtl; text-align: right;">
          <h2 style="color: #f43f5e; font-size: 28px; font-weight: 700; margin-bottom: 25px; text-align: center;">شكراً جزيلاً لك! 🙏</h2>
          
          <p style="color: #374151; font-size: 18px; line-height: 1.8; margin-bottom: 25px;">
            عزيزي/عزيزتي <strong style="color: #f43f5e;">${data.customerName}</strong>،<br><br>
            نتقدم لك بأسمى آيات الشكر والتقدير على ثقتك في خدماتنا.
          </p>
          
          <div style="background: linear-gradient(135deg, #fce7f3, #fbcfe8); border-radius: 15px; padding: 25px; margin: 25px 0; border-left: 5px solid #f43f5e; box-shadow: 0 4px 15px rgba(244, 63, 94, 0.2);">
            <h3 style="color: #be185d; margin-bottom: 15px; font-size: 20px; font-weight: 600;">💝 تقديرنا لك:</h3>
            <p style="margin: 10px 0; color: #be185d; font-size: 16px;">شكراً لاختيارك خدمة: <strong>${data.serviceDescription}</strong></p>
            <p style="margin: 10px 0; color: #be185d; font-size: 16px;">تعاملك معنا شرف كبير ونقدر ثقتك الغالية</p>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.7; margin-bottom: 30px; text-align: center;">
            نسعى دائماً لتقديم أفضل الخدمات ونتطلع للتعامل معك مستقبلاً.<br>
            شكراً لكونك جزءاً من قصة نجاحنا! 🌟
          </p>
        </div>
      </div>
    </div>`;
  };

  const generateOrderStatusTemplate = (data: SmartFormData) => {
    return `
    <div dir="rtl" style="max-width: 700px; margin: 0 auto; font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 20px; direction: rtl; text-align: right;">
      <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.1); direction: rtl; border: 1px solid #e5e7eb;">
        <!-- ترويسة تحديث الحالة -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%); padding: 30px 20px; text-align: center; color: white; direction: rtl; position: relative; border-bottom: 6px solid #0ea5e9;">
          <div style="text-align: center; margin-bottom: 20px; direction: rtl;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 100px; height: 100px; background: linear-gradient(135deg, #0ea5e9, #38bdf8); border-radius: 50%; margin-bottom: 20px; position: relative; overflow: hidden; box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);">
              <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #0f172a, #334155); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold;">📦</div>
            </div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #38bdf8, #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">وكالة ماستر إيدو باث</h1>
            <p style="margin: 10px 0 0; font-size: 18px; color: #e2e8f0; font-weight: 500;">للخدمات التعليمية والتدريب المتقدم</p>
            
          </div>
        </div>

        <div style="padding: 40px 30px; direction: rtl; text-align: right;">
          <h2 style="color: #0ea5e9; font-size: 28px; font-weight: 700; margin-bottom: 25px; text-align: center;">تحديث حالة طلبكم 📋</h2>
          
          <p style="color: #374151; font-size: 18px; line-height: 1.8; margin-bottom: 25px;">
            عزيزي/عزيزتي <strong style="color: #0ea5e9;">${data.customerName}</strong>،<br><br>
            يسرنا إطلاعكم على آخر التطورات في طلبكم.
          </p>
          
          <div style="background: linear-gradient(135deg, #e0f2fe, #b3e5fc); border-radius: 15px; padding: 25px; margin: 25px 0; border-left: 5px solid #0ea5e9; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.2);">
            <h3 style="color: #0277bd; margin-bottom: 15px; font-size: 20px; font-weight: 600;">📋 معلومات الطلب:</h3>
            <p style="margin: 10px 0; color: #0277bd; font-size: 16px;"><strong>رقم الطلب:</strong> ${data.invoiceNumber}</p>
            <p style="margin: 10px 0; color: #0277bd; font-size: 16px;"><strong>الخدمة:</strong> ${data.serviceDescription}</p>
            <p style="margin: 10px 0; color: #0277bd; font-size: 16px;"><strong>الحالة الحالية:</strong> قيد التنفيذ</p>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.7; margin-bottom: 30px; text-align: center;">
            سنستمر في إبلاغكم بأي تطورات جديدة على طلبكم.<br>
            شكراً لصبركم وثقتكم في خدماتنا! 🚀
          </p>
        </div>
      </div>
    </div>`;
  };

  const generateNewServiceTemplate = (data: SmartFormData) => {
    return `
    <div dir="rtl" style="max-width: 700px; margin: 0 auto; font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 20px; direction: rtl; text-align: right;">
      <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.1); direction: rtl; border: 1px solid #e5e7eb;">
        <!-- ترويسة الخدمة الجديدة -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%); padding: 30px 20px; text-align: center; color: white; direction: rtl; position: relative; border-bottom: 6px solid #7c3aed;">
          <div style="text-align: center; margin-bottom: 20px; direction: rtl;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 100px; height: 100px; background: linear-gradient(135deg, #7c3aed, #a855f7); border-radius: 50%; margin-bottom: 20px; position: relative; overflow: hidden; box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);">
              <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #0f172a, #334155); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 28px; font-weight: bold;">🎉</div>
            </div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 700; background: linear-gradient(135deg, #a855f7, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">وكالة ماستر إيدو باث</h1>
            <p style="margin: 10px 0 0; font-size: 18px; color: #e2e8f0; font-weight: 500;">للخدمات التعليمية والتدريب المتقدم</p>
            
          </div>
        </div>

        <div style="padding: 40px 30px; direction: rtl; text-align: right;">
          <h2 style="color: #7c3aed; font-size: 28px; font-weight: 700; margin-bottom: 25px; text-align: center;">خدمة جديدة ومميزة! ✨</h2>
          
          <p style="color: #374151; font-size: 18px; line-height: 1.8; margin-bottom: 25px;">
            عزيزي/عزيزتي <strong style="color: #7c3aed;">${data.customerName}</strong>،<br><br>
            يسرنا أن نعلن لكم عن إطلاق خدمة جديدة ومبتكرة!
          </p>
          
          <div style="background: linear-gradient(135deg, #f3e8ff, #e9d5ff); border-radius: 15px; padding: 25px; margin: 25px 0; border-left: 5px solid #7c3aed; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);">
            <h3 style="color: #5b21b6; margin-bottom: 15px; font-size: 20px; font-weight: 600;">🚀 الخدمة الجديدة:</h3>
            <p style="margin: 10px 0; color: #5b21b6; font-size: 18px; font-weight: 600;"><strong>${data.promotionTitle}</strong></p>
            <p style="margin: 15px 0; color: #5b21b6; font-size: 16px; line-height: 1.7;">${data.promotionDescription}</p>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.7; margin-bottom: 30px; text-align: center;">
            هذه الخدمة تم تصميمها خصيصاً لتلبي احتياجاتكم وتحقق أهدافكم.<br>
            تواصلوا معنا للحصول على المزيد من التفاصيل! 🌟
          </p>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5" dir="rtl">
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
              <Users className="h-4 w-4 ml-2" />
              {templates.length} قالب
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2 bg-background/50">
              <Palette className="h-4 w-4 ml-2" />
              {Object.keys(templateCategories).length} فئة
            </Badge>
          </div>
        </div>

        {/* النظام الرئيسي */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" dir="rtl">
          <TabsList className="grid w-full grid-cols-3 h-12 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="templates" className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              إدارة القوالب
            </TabsTrigger>
            <TabsTrigger value="manual-send" className="flex items-center gap-2 text-sm">
              <Send className="h-4 w-4" />
              الإرسال اليدوي
            </TabsTrigger>
            <TabsTrigger value="smart-send" className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              النظام الذكي
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
                      smartForm.type === 'paid_invoice' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleSmartFormChange('type', 'paid_invoice')}
                  >
                    <div className="text-center">
                      <CreditCard className="h-12 w-12 mx-auto mb-3 text-green-600" />
                      <h3 className="font-semibold text-lg mb-2">فاتورة مدفوعة</h3>
                      <p className="text-sm text-muted-foreground">إشعار بسداد الفاتورة</p>
                    </div>
                  </div>

                  <div 
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                      smartForm.type === 'payment_receipt' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleSmartFormChange('type', 'payment_receipt')}
                  >
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-teal-600" />
                      <h3 className="font-semibold text-lg mb-2">سند دفع</h3>
                      <p className="text-sm text-muted-foreground">سند إستلام مدفوعات رسمي</p>
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
                      <p className="text-sm text-muted-foreground">عروض وإعلانات تسويقية</p>
                    </div>
                  </div>

                  <div 
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                      smartForm.type === 'payment_reminder' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleSmartFormChange('type', 'payment_reminder')}
                  >
                    <div className="text-center">
                      <Bell className="h-12 w-12 mx-auto mb-3 text-orange-600" />
                      <h3 className="font-semibold text-lg mb-2">تذكير بالدفع</h3>
                      <p className="text-sm text-muted-foreground">تذكير لطيف بدفع المستحقات</p>
                    </div>
                  </div>

                  <div 
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                      smartForm.type === 'order_confirmation' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleSmartFormChange('type', 'order_confirmation')}
                  >
                    <div className="text-center">
                      <Package className="h-12 w-12 mx-auto mb-3 text-indigo-600" />
                      <h3 className="font-semibold text-lg mb-2">تأكيد الطلب</h3>
                      <p className="text-sm text-muted-foreground">تأكيد استلام وقبول الطلب</p>
                    </div>
                  </div>

                  <div 
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                      smartForm.type === 'event_invitation' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleSmartFormChange('type', 'event_invitation')}
                  >
                    <div className="text-center">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-pink-600" />
                      <h3 className="font-semibold text-lg mb-2">دعوة فعالية</h3>
                      <p className="text-sm text-muted-foreground">دعوات للمؤتمرات والدورات</p>
                    </div>
                  </div>

                  <div 
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                      smartForm.type === 'welcome_message' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleSmartFormChange('type', 'welcome_message')}
                  >
                    <div className="text-center">
                      <Users className="h-12 w-12 mx-auto mb-3 text-emerald-600" />
                      <h3 className="font-semibold text-lg mb-2">رسالة ترحيب</h3>
                      <p className="text-sm text-muted-foreground">ترحيب بالعملاء الجدد</p>
                    </div>
                  </div>

                  <div 
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                      smartForm.type === 'thank_you' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleSmartFormChange('type', 'thank_you')}
                  >
                    <div className="text-center">
                      <Gift className="h-12 w-12 mx-auto mb-3 text-rose-600" />
                      <h3 className="font-semibold text-lg mb-2">رسالة شكر</h3>
                      <p className="text-sm text-muted-foreground">شكر للعملاء على تعاملهم</p>
                    </div>
                  </div>

                  <div 
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                      smartForm.type === 'order_status' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleSmartFormChange('type', 'order_status')}
                  >
                    <div className="text-center">
                      <Package className="h-12 w-12 mx-auto mb-3 text-cyan-600" />
                      <h3 className="font-semibold text-lg mb-2">حالة الطلب</h3>
                      <p className="text-sm text-muted-foreground">تحديث حالة الطلبات</p>
                    </div>
                  </div>

                  <div 
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                      smartForm.type === 'new_service' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleSmartFormChange('type', 'new_service')}
                  >
                    <div className="text-center">
                      <Plus className="h-12 w-12 mx-auto mb-3 text-violet-600" />
                      <h3 className="font-semibold text-lg mb-2">خدمة جديدة</h3>
                      <p className="text-sm text-muted-foreground">إعلان خدمات جديدة</p>
                    </div>
                  </div>

                  {/* إضافة خدمة مخصصة */}
                  <div 
                    className="p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10"
                    onClick={() => {
                      toast.info("يمكنك إنشاء قوالب مخصصة باستخدام الإرسال اليدوي");
                      setActiveTab("manual-send");
                    }}
                  >
                    <div className="text-center">
                      <div className="relative">
                        <Plus className="h-12 w-12 mx-auto mb-3 text-primary" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                          <Plus className="h-3 w-3 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-primary">إضافة خدمة مخصصة</h3>
                      <p className="text-sm text-muted-foreground">قم بإنشاء قالب مخصص لخدمة جديدة</p>
                      <div className="mt-2 inline-flex items-center gap-1 text-xs text-primary font-medium">
                        <Settings className="h-3 w-3" />
                        إعدادات متقدمة
                      </div>
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

                        {/* حقول خاصة بتذكير الدفع */}
                        {smartForm.type === 'payment_reminder' && (
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
                              <Label className="text-sm font-medium">المبلغ المستحق</Label>
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

                            <div>
                              <Label className="text-sm font-medium">العملة</Label>
                              <select 
                                value={smartForm.currency || "ر.س"}
                                onChange={(e) => handleSmartFormChange('currency', e.target.value)}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                <option value="ر.س">ريال سعودي (ر.س)</option>
                                <option value="$">دولار أمريكي ($)</option>
                                <option value="€">يورو (€)</option>
                              </select>
                            </div>
                          </>
                        )}

                        {/* حقول خاصة بتأكيد الطلب */}
                        {smartForm.type === 'order_confirmation' && (
                          <>
                            <div>
                              <Label className="text-sm font-medium">رقم الطلب</Label>
                              <Input
                                value={smartForm.invoiceNumber || ""}
                                onChange={(e) => handleSmartFormChange('invoiceNumber', e.target.value)}
                                placeholder="ORD-001"
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium">قيمة الطلب</Label>
                              <Input
                                type="number"
                                value={smartForm.amount || ""}
                                onChange={(e) => handleSmartFormChange('amount', parseFloat(e.target.value))}
                                placeholder="2500"
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <Label className="text-sm font-medium">تفاصيل الطلب</Label>
                              <Textarea
                                value={smartForm.serviceDescription || ""}
                                onChange={(e) => handleSmartFormChange('serviceDescription', e.target.value)}
                                placeholder="ترجمة مستندات قانونية من العربية إلى الإنجليزية"
                                rows={2}
                                className="mt-1"
                              />
                            </div>
                          </>
                        )}

                        {/* حقول خاصة بدعوة الفعالية */}
                        {smartForm.type === 'event_invitation' && (
                          <>
                            <div>
                              <Label className="text-sm font-medium">اسم الفعالية</Label>
                              <Input
                                value={smartForm.promotionTitle || ""}
                                onChange={(e) => handleSmartFormChange('promotionTitle', e.target.value)}
                                placeholder="مؤتمر الترجمة الدولي 2024"
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium">تاريخ الفعالية</Label>
                              <Input
                                type="date"
                                value={smartForm.eventDate || ""}
                                onChange={(e) => handleSmartFormChange('eventDate', e.target.value)}
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium">وقت الفعالية</Label>
                              <Input
                                type="time"
                                value={smartForm.eventTime || ""}
                                onChange={(e) => handleSmartFormChange('eventTime', e.target.value)}
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium">مكان الفعالية</Label>
                              <Input
                                value={smartForm.location || ""}
                                onChange={(e) => handleSmartFormChange('location', e.target.value)}
                                placeholder="فندق الريتز كارلتون - الرياض"
                                className="mt-1"
                              />
                            </div>
                          </>
                        )}

                        {/* حقول خاصة برسالة الترحيب */}
                        {smartForm.type === 'welcome_message' && (
                          <>
                            <div>
                              <Label className="text-sm font-medium">اسم المستخدم</Label>
                              <Input
                                value={smartForm.username || ""}
                                onChange={(e) => handleSmartFormChange('username', e.target.value)}
                                placeholder="ahmed_123"
                                className="mt-1"
                              />
                            </div>

                            <div className="md:col-span-3">
                              <Label className="text-sm font-medium">رسالة ترحيبية إضافية</Label>
                              <Textarea
                                value={smartForm.promotionDescription || ""}
                                onChange={(e) => handleSmartFormChange('promotionDescription', e.target.value)}
                                placeholder="نحن سعداء لانضمامك إلينا وستحصل على دعم كامل من فريقنا المتخصص"
                                rows={3}
                                className="mt-1"
                              />
                            </div>
                          </>
                        )}

                        {/* حقول خاصة برسالة الشكر */}
                        {smartForm.type === 'thank_you' && (
                          <>
                            <div className="md:col-span-2">
                              <Label className="text-sm font-medium">الخدمة التي تم تقديمها</Label>
                              <Input
                                value={smartForm.serviceDescription || ""}
                                onChange={(e) => handleSmartFormChange('serviceDescription', e.target.value)}
                                placeholder="ترجمة معتمدة للوثائق الأكاديمية"
                                className="mt-1"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <Label className="text-sm font-medium">رسالة شكر مخصصة</Label>
                              <Textarea
                                value={smartForm.promotionDescription || ""}
                                onChange={(e) => handleSmartFormChange('promotionDescription', e.target.value)}
                                placeholder="شكراً لثقتكم في خدماتنا، ونتطلع للتعامل معكم مستقبلاً"
                                rows={2}
                                className="mt-1"
                              />
                            </div>
                          </>
                        )}

                        {/* حقول خاصة بتحديث حالة الطلب */}
                        {smartForm.type === 'order_status' && (
                          <>
                            <div>
                              <Label className="text-sm font-medium">رقم الطلب</Label>
                              <Input
                                value={smartForm.invoiceNumber || ""}
                                onChange={(e) => handleSmartFormChange('invoiceNumber', e.target.value)}
                                placeholder="ORD-001"
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium">الحالة الجديدة</Label>
                              <select 
                                value={smartForm.promotionDescription || ""}
                                onChange={(e) => handleSmartFormChange('promotionDescription', e.target.value)}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                <option value="">اختر الحالة</option>
                                <option value="قيد المراجعة">قيد المراجعة</option>
                                <option value="قيد التنفيذ">قيد التنفيذ</option>
                                <option value="مكتمل بنسبة 50%">مكتمل بنسبة 50%</option>
                                <option value="جاهز للتسليم">جاهز للتسليم</option>
                                <option value="مكتمل">مكتمل</option>
                              </select>
                            </div>
                            
                            <div className="md:col-span-2">
                              <Label className="text-sm font-medium">تفاصيل الطلب</Label>
                              <Input
                                value={smartForm.serviceDescription || ""}
                                onChange={(e) => handleSmartFormChange('serviceDescription', e.target.value)}
                                placeholder="ترجمة تقارير طبية متخصصة"
                                className="mt-1"
                              />
                            </div>
                          </>
                        )}

                        {/* حقول خاصة بالخدمة الجديدة */}
                        {smartForm.type === 'new_service' && (
                          <>
                            <div className="md:col-span-2">
                              <Label className="text-sm font-medium">اسم الخدمة الجديدة ⭐</Label>
                              <Input
                                value={smartForm.promotionTitle || ""}
                                onChange={(e) => handleSmartFormChange('promotionTitle', e.target.value)}
                                placeholder="خدمة الترجمة الفورية بالذكاء الاصطناعي"
                                className="mt-1 font-medium"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <Label className="text-sm font-medium">فئة الخدمة</Label>
                              <select 
                                value={smartForm.serviceDescription || ""}
                                onChange={(e) => handleSmartFormChange('serviceDescription', e.target.value)}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                <option value="">اختر فئة الخدمة</option>
                                <option value="خدمات الترجمة">خدمات الترجمة</option>
                                <option value="الخدمات التعليمية">الخدمات التعليمية</option>
                                <option value="التدريب والتطوير">التدريب والتطوير</option>
                                <option value="الاستشارات الأكاديمية">الاستشارات الأكاديمية</option>
                                <option value="الخدمات التقنية">الخدمات التقنية</option>
                              </select>
                            </div>

                            <div className="md:col-span-4">
                              <Label className="text-sm font-medium">وصف شامل للخدمة الجديدة</Label>
                              <Textarea
                                value={smartForm.promotionDescription || ""}
                                onChange={(e) => handleSmartFormChange('promotionDescription', e.target.value)}
                                placeholder="تقدم هذه الخدمة حلولاً مبتكرة باستخدام أحدث التقنيات، مما يضمن جودة عالية وسرعة في الإنجاز. الخدمة متوفرة على مدار الساعة مع دعم فني متخصص."
                                rows={4}
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium">سعر الخدمة (اختياري)</Label>
                              <Input
                                type="number"
                                value={smartForm.amount || ""}
                                onChange={(e) => handleSmartFormChange('amount', parseFloat(e.target.value))}
                                placeholder="500"
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium">العملة</Label>
                              <select 
                                value={smartForm.currency || "ر.س"}
                                onChange={(e) => handleSmartFormChange('currency', e.target.value)}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                <option value="ر.س">ريال سعودي (ر.س)</option>
                                <option value="$">دولار أمريكي ($)</option>
                                <option value="€">يورو (€)</option>
                              </select>
                            </div>

                            <div>
                              <Label className="text-sm font-medium">مدة التسليم المتوقعة</Label>
                              <select 
                                value={smartForm.dueDate || ""}
                                onChange={(e) => handleSmartFormChange('dueDate', e.target.value)}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                <option value="">اختر المدة</option>
                                <option value="24 ساعة">24 ساعة</option>
                                <option value="3 أيام">3 أيام</option>
                                <option value="أسبوع واحد">أسبوع واحد</option>
                                <option value="أسبوعين">أسبوعين</option>
                                <option value="شهر واحد">شهر واحد</option>
                                <option value="حسب حجم المشروع">حسب حجم المشروع</option>
                              </select>
                            </div>

                            <div>
                              <Label className="text-sm font-medium">نوع العرض</Label>
                              <select 
                                value={smartForm.discountPercent || ""}
                                onChange={(e) => handleSmartFormChange('discountPercent', parseFloat(e.target.value))}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                <option value="">بدون عرض خاص</option>
                                <option value="10">خصم 10% للعملاء الجدد</option>
                                <option value="15">خصم 15% لفترة محدودة</option>
                                <option value="20">خصم 20% عرض افتتاحي</option>
                                <option value="25">خصم 25% عرض استثنائي</option>
                              </select>
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
                        <Settings className="h-5 w-5 ml-2" />
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
                      <Send className="h-4 w-4 ml-2" />
                      {loading ? "جاري الإرسال..." : "إرسال البريد"}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handlePreview}
                      disabled={!emailForm.subject || !emailForm.content}
                    >
                      <Eye className="h-4 w-4 ml-2" />
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
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="البحث في القوالب..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
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
                    <Settings className="h-4 w-4 ml-2" />
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
                          <Edit className="h-3 w-3 ml-1" />
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