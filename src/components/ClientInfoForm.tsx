import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Calendar,
  MessageSquare,
  Send,
  Shield,
  CheckCircle
} from "lucide-react";

interface ClientInfo {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  country: string;
  city: string;
  projectType: string;
  deadline?: string;
  additionalNotes?: string;
  agreeToTerms: boolean;
  subscribeToUpdates: boolean;
}

interface ClientInfoFormProps {
  pricingDetails: any;
  onSubmit: (clientInfo: ClientInfo) => void;
  onBack: () => void;
}

const ClientInfoForm = ({ pricingDetails, onSubmit, onBack }: ClientInfoFormProps) => {
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    city: "",
    projectType: "translation",
    deadline: "",
    additionalNotes: "",
    agreeToTerms: false,
    subscribeToUpdates: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ClientInfo>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientInfo> = {};

    if (!clientInfo.fullName.trim()) {
      newErrors.fullName = "الاسم الكامل مطلوب";
    }

    if (!clientInfo.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientInfo.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!clientInfo.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    }

    if (!clientInfo.country.trim()) {
      newErrors.country = "الدولة مطلوبة";
    }

    if (!clientInfo.agreeToTerms) {
      newErrors.agreeToTerms = "يجب الموافقة على الشروط والأحكام" as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("يرجى تصحيح الأخطاء في النموذج");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // محاكاة إرسال البيانات
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("تم إرسال طلبك بنجاح! سنتواصل معك قريباً");
      onSubmit(clientInfo);
    } catch (error) {
      toast.error("حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ClientInfo, value: string | boolean) => {
    setClientInfo(prev => ({ ...prev, [field]: value }));
    
    // إزالة الخطأ عند التصحيح
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* ملخص الطلب */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <CheckCircle className="h-6 w-6 text-green-600" />
            ملخص طلبك
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">${pricingDetails?.totalPrice?.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">التكلفة الإجمالية</div>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <div className="text-lg font-bold text-foreground">{pricingDetails?.totalWords?.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">كلمة</div>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <div className="text-lg font-bold text-foreground">{pricingDetails?.deliveryTime}</div>
              <div className="text-sm text-muted-foreground">وقت التسليم</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* نموذج معلومات العميل */}
      <Card className="bg-background border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="h-6 w-6 text-primary" />
            معلومات العميل
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            يرجى ملء المعلومات التالية لإرسال طلب عرض السعر
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* المعلومات الشخصية */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                المعلومات الشخصية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الكامل *</Label>
                  <Input
                    id="fullName"
                    value={clientInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="example@email.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    value={clientInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+966 50 123 4567"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">الشركة (اختياري)</Label>
                  <Input
                    id="company"
                    value={clientInfo.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="اسم الشركة"
                  />
                </div>
              </div>
            </div>

            {/* معلومات الموقع */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                معلومات الموقع
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">الدولة *</Label>
                  <Select value={clientInfo.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                      <SelectValue placeholder="اختر الدولة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sa">السعودية</SelectItem>
                      <SelectItem value="ae">الإمارات</SelectItem>
                      <SelectItem value="kw">الكويت</SelectItem>
                      <SelectItem value="qa">قطر</SelectItem>
                      <SelectItem value="bh">البحرين</SelectItem>
                      <SelectItem value="om">عمان</SelectItem>
                      <SelectItem value="jo">الأردن</SelectItem>
                      <SelectItem value="lb">لبنان</SelectItem>
                      <SelectItem value="eg">مصر</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-red-600">{errors.country}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">المدينة</Label>
                  <Input
                    id="city"
                    value={clientInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="اسم المدينة"
                  />
                </div>
              </div>
            </div>

            {/* تفاصيل المشروع */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                تفاصيل المشروع
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectType">نوع المشروع</Label>
                  <Select value={clientInfo.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع المشروع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="translation">ترجمة وثائق</SelectItem>
                      <SelectItem value="interpretation">ترجمة فورية</SelectItem>
                      <SelectItem value="localization">توطين المحتوى</SelectItem>
                      <SelectItem value="proofreading">مراجعة وتدقيق</SelectItem>
                      <SelectItem value="certification">ترجمة معتمدة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">التاريخ المطلوب (اختياري)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={clientInfo.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">ملاحظات إضافية (اختياري)</Label>
                <Textarea
                  id="additionalNotes"
                  value={clientInfo.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  placeholder="أي معلومات إضافية أو متطلبات خاصة..."
                  rows={4}
                />
              </div>
            </div>

            {/* الموافقات */}
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start space-x-2 space-x-reverse">
                <Checkbox
                  id="agreeToTerms"
                  checked={clientInfo.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor="agreeToTerms" 
                    className={`text-sm font-medium cursor-pointer ${errors.agreeToTerms ? 'text-red-600' : ''}`}
                  >
                    أوافق على الشروط والأحكام وسياسة الخصوصية *
                  </Label>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2 space-x-reverse">
                <Checkbox
                  id="subscribeToUpdates"
                  checked={clientInfo.subscribeToUpdates}
                  onCheckedChange={(checked) => handleInputChange('subscribeToUpdates', checked as boolean)}
                />
                <Label htmlFor="subscribeToUpdates" className="text-sm font-medium cursor-pointer">
                  أرغب في تلقي التحديثات والعروض الخاصة
                </Label>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                العودة للتسعير
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-primary text-primary-foreground shadow-primary"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground ml-2"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 ml-2" />
                    إرسال طلب عرض السعر
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* معلومات الأمان */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800">معلوماتك في أمان</h4>
              <p className="text-sm text-green-700">
                نحن نحترم خصوصيتك ونحمي معلوماتك الشخصية بأعلى معايير الأمان
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientInfoForm;