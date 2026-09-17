import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Star, Trophy, Award, Shield, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/data/legacy/client";

interface MembershipPlan {
  id: string;
  name: string;
  nameEn: string;
  price: string;
  originalPrice: string;
  discount: string;
  cashback: string;
  popular: boolean;
  gradient: string;
  cardGradient: string;
  chipColor: string;
}

interface MembershipSubscriptionFormProps {
  plan: MembershipPlan;
  isOpen: boolean;
  onClose: () => void;
}

const MembershipSubscriptionForm = ({ plan, isOpen, onClose }: MembershipSubscriptionFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال الاسم الكامل",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive",
      });
      return false;
    }

    const phoneRegex = /^[0-9+\-\s\(\)]{8,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال رقم هاتف صحيح",
        variant: "destructive",
      });
      return false;
    }

    if (!agreed) {
      toast({
        title: "يجب الموافقة على الشروط",
        description: "يرجى قراءة والموافقة على شروط الاشتراك",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-membership-confirmation', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          membershipType: plan.id,
          membershipNameAr: plan.name,
          membershipNameEn: plan.nameEn,
          price: plan.price,
          discount: plan.discount,
          cashback: plan.cashback,
        },
      });

      if (error) throw error;

      toast({
        title: "تم إرسال الطلب بنجاح! ✅",
        description: "سيتم التواصل معك خلال 24 ساعة لإرسال الفاتورة",
      });

      // Reset form
      setFormData({ name: "", email: "", phone: "" });
      setAgreed(false);
      onClose();

    } catch (error: any) {
      toast({
        title: "حدث خطأ",
        description: error.message || "فشل في إرسال الطلب. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = () => {
    switch (plan.id) {
      case 'silver': return <Award className="w-8 h-8" />;
      case 'gold': return <Crown className="w-8 h-8" />;
      case 'platinum': return <Trophy className="w-8 h-8" />;
      default: return <Star className="w-8 h-8" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Form Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="overflow-hidden shadow-2xl border-0">
              {/* Header with membership card design */}
              <CardHeader className={`relative p-0 bg-gradient-to-br ${plan.cardGradient}`}>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
                
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-4 left-4 z-10 text-white hover:bg-white/20 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>

                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      الأكثر طلباً
                    </div>
                  </div>
                )}

                <div className="relative p-8 text-white text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-4"
                  >
                    {getIcon()}
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-white/80 text-lg mb-4">{plan.nameEn}</p>
                  
                  <div className="flex justify-center items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{plan.price} ريال</div>
                      <div className="text-sm line-through opacity-70">{plan.originalPrice} ريال</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <div className="text-sm">كاش باك</div>
                      <div className="font-bold">{plan.cashback} ريال</div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">إكمال الاشتراك</h3>
                    <p className="text-gray-600">أكمل البيانات أدناه وسيتم التواصل معك لإرسال الفاتورة</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-right block mb-2 font-semibold">
                        الاسم الكامل *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="ادخل اسمك الكامل"
                        className="w-full text-right h-12 text-lg"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-right block mb-2 font-semibold">
                        البريد الإلكتروني *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                        className="w-full text-right h-12 text-lg"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-right block mb-2 font-semibold">
                        رقم الهاتف *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+966 5xx xxx xxx"
                        className="w-full text-right h-12 text-lg"
                        required
                      />
                    </div>
                  </div>

                  {/* Warning Section */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-red-800 mb-2">تنبيه مهم:</h4>
                        <ul className="text-red-700 text-sm space-y-1 list-disc list-inside">
                          <li>الاشتراك غير قابل للاسترجاع نهائياً بعد تأكيد الدفع</li>
                          <li>سيتم التواصل معك خلال 24 ساعة لإرسال الفاتورة</li>
                          <li>العضوية صالحة لمدة 12 شهر من تاريخ التفعيل</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agreed"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-5 h-5 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="agreed" className="text-sm text-gray-700 cursor-pointer">
                      أوافق على شروط الاشتراك وأتفهم أن الاشتراك غير قابل للاسترجاع نهائياً، وأؤكد صحة البيانات المدخلة
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !agreed}
                    className={`
                      w-full h-14 text-lg font-bold rounded-xl
                      bg-gradient-to-r ${plan.gradient}
                      hover:opacity-90 disabled:opacity-50
                      shadow-lg hover:shadow-xl transition-all duration-300
                      disabled:cursor-not-allowed
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        تأكيد الاشتراك وإرسال الطلب
                      </>
                    )}
                  </Button>

                  {/* Footer Info */}
                  <div className="text-center pt-4 border-t">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>بيانات آمنة ومحمية</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      FekrahEdu - شريكك الموثوق في التعلم والتطوير
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MembershipSubscriptionForm;