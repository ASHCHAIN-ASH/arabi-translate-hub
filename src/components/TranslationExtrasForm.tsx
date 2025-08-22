import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Mail, 
  MessageCircle, 
  FileCheck, 
  Award, 
  Clock, 
  Layout,
  Save
} from "lucide-react";

interface TranslationExtras {
  proofreading: boolean;
  certification: boolean;
  urgentDelivery: boolean;
  formatting: boolean;
  clientContact: {
    email: string;
    whatsapp: string;
  };
}

interface TranslationExtrasFormProps {
  onExtrasChange: (extras: TranslationExtras) => void;
}

const TranslationExtrasForm = ({ onExtrasChange }: TranslationExtrasFormProps) => {
  const [extras, setExtras] = useState<TranslationExtras>({
    proofreading: false,
    certification: false,
    urgentDelivery: false,
    formatting: false,
    clientContact: {
      email: "",
      whatsapp: ""
    }
  });

  const [showContactForm, setShowContactForm] = useState(false);

  const handleExtraChange = (key: keyof Omit<TranslationExtras, 'clientContact'>, checked: boolean) => {
    const newExtras = { ...extras, [key]: checked };
    setExtras(newExtras);
    onExtrasChange(newExtras);
  };

  const handleContactChange = (field: 'email' | 'whatsapp', value: string) => {
    const newExtras = {
      ...extras,
      clientContact: {
        ...extras.clientContact,
        [field]: value
      }
    };
    setExtras(newExtras);
    onExtrasChange(newExtras);
  };

  const extraOptions = [
    {
      key: 'proofreading' as const,
      label: 'مراجعة وتدقيق',
      description: 'مراجعة نهائية من مختص',
      icon: FileCheck,
      multiplier: 1.3,
      color: 'text-blue-600'
    },
    {
      key: 'certification' as const,
      label: 'ترجمة معتمدة',
      description: 'ترجمة رسمية معتمدة',
      icon: Award,
      multiplier: 1.5,
      color: 'text-amber-600'
    },
    {
      key: 'urgentDelivery' as const,
      label: 'تسليم عاجل',
      description: 'تسليم خلال 24 ساعة',
      icon: Clock,
      multiplier: 2.0,
      color: 'text-red-600'
    },
    {
      key: 'formatting' as const,
      label: 'تنسيق متقدم',
      description: 'الحفاظ على التنسيق الأصلي',
      icon: Layout,
      multiplier: 1.2,
      color: 'text-green-600'
    }
  ];

  const calculateTotalMultiplier = () => {
    let multiplier = 1;
    extraOptions.forEach(option => {
      if (extras[option.key]) {
        multiplier *= option.multiplier;
      }
    });
    return multiplier;
  };

  const hasAnyExtras = extraOptions.some(option => extras[option.key]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-right">
          <Plus className="h-5 w-5 text-primary" />
          إضافات الترجمة الاختيارية
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* الإضافات الاختيارية */}
        <div className="grid gap-3">
          {extraOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div key={option.key} className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg border hover:bg-secondary/50 transition-colors">
                <Checkbox
                  id={option.key}
                  checked={extras[option.key]}
                  onCheckedChange={(checked) => handleExtraChange(option.key, checked as boolean)}
                  className="ml-2"
                />
                <div className="flex-1 flex items-center gap-3">
                  <IconComponent className={`h-5 w-5 ${option.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={option.key} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        +{Math.round((option.multiplier - 1) * 100)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* إجمالي التأثير على السعر */}
        {hasAnyExtras && (
          <div className="p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">مضاعف السعر الإجمالي:</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                ×{calculateTotalMultiplier().toFixed(2)}
              </Badge>
            </div>
          </div>
        )}

        <Separator />

        {/* معلومات الاتصال */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">معلومات الاتصال</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowContactForm(!showContactForm)}
              className="text-xs"
            >
              {showContactForm ? "إخفاء" : "إضافة"}
            </Button>
          </div>

          {showContactForm && (
            <div className="space-y-3 p-3 bg-secondary/30 rounded-lg border">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={extras.clientContact.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-sm flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  رقم الواتساب
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+966 50 123 4567"
                  value={extras.clientContact.whatsapp}
                  onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                  className="text-right"
                  dir="ltr"
                />
              </div>

              {(extras.clientContact.email || extras.clientContact.whatsapp) && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Save className="h-3 w-3" />
                  سيتم حفظ معلومات الاتصال مع طلب الترجمة
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationExtrasForm;