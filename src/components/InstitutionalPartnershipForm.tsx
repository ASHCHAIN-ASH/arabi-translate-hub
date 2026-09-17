import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building2, Phone, Mail, Users, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/data/legacy/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  institutionName: z.string().min(3, "اسم المؤسسة يجب أن يكون 3 أحرف على الأقل"),
  institutionType: z.string().min(1, "يرجى اختيار نوع المؤسسة"),
  contactPerson: z.string().min(3, "اسم المسؤول يجب أن يكون 3 أحرف على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(10, "رقم الجوال يجب أن يكون 10 أرقام على الأقل"),
  position: z.string().min(2, "المسمى الوظيفي مطلوب"),
  selectedPackage: z.string().min(1, "يرجى اختيار الباقة"),
  employeesCount: z.string().min(1, "يرجى تحديد عدد الموظفين"),
  expectedServices: z.string().min(10, "يرجى وصف الخدمات المتوقعة (10 أحرف على الأقل)"),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InstitutionalPartnershipFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPackage?: string;
}

const InstitutionalPartnershipForm = ({ 
  open, 
  onOpenChange,
  selectedPackage 
}: InstitutionalPartnershipFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institutionName: "",
      institutionType: "",
      contactPerson: "",
      email: "",
      phone: "",
      position: "",
      selectedPackage: selectedPackage || "",
      employeesCount: "",
      expectedServices: "",
      additionalNotes: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-partnership-request', {
        body: {
          ...data,
          submittedAt: new Date().toISOString(),
        }
      });

      if (error) throw error;

      setShowSuccess(true);
      form.reset();
      
      setTimeout(() => {
        setShowSuccess(false);
        onOpenChange(false);
      }, 3000);

      toast({
        title: "تم إرسال الطلب بنجاح",
        description: "سنتواصل معكم في أقرب وقت ممكن",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6"
              >
                <CheckCircle className="w-12 h-12 text-primary" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">تم إرسال الطلب بنجاح!</h3>
              <p className="text-muted-foreground">
                شكراً لاهتمامكم، سيتواصل معكم فريقنا قريباً
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader className="text-right">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold">
                      طلب شراكة مؤسسية
                    </DialogTitle>
                    <DialogDescription className="text-right mt-1">
                      املأ البيانات التالية وسنتواصل معكم خلال 24 ساعة
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                  {/* Institution Info Section */}
                  <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-lg">معلومات المؤسسة</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="institutionName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم المؤسسة *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="مثال: جامعة الملك سعود" 
                              {...field}
                              className="text-right"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="institutionType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>نوع المؤسسة *</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              dir="rtl"
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر نوع المؤسسة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                <SelectItem value="university">جامعة</SelectItem>
                                <SelectItem value="college">كلية</SelectItem>
                                <SelectItem value="educational-office">مكتب تعليمي</SelectItem>
                                <SelectItem value="research-center">مركز أبحاث</SelectItem>
                                <SelectItem value="company">شركة</SelectItem>
                                <SelectItem value="institute">معهد</SelectItem>
                                <SelectItem value="other">أخرى</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="employeesCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>عدد الموظفين/الطلاب *</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              dir="rtl"
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر العدد التقريبي" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent dir="rtl">
                                <SelectItem value="1-50">1 - 50</SelectItem>
                                <SelectItem value="51-200">51 - 200</SelectItem>
                                <SelectItem value="201-500">201 - 500</SelectItem>
                                <SelectItem value="501-1000">501 - 1000</SelectItem>
                                <SelectItem value="1000+">أكثر من 1000</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Contact Person Section */}
                  <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-lg">معلومات المسؤول</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المسؤول *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="الاسم الكامل" 
                                {...field}
                                className="text-right"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المسمى الوظيفي *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="مثال: مدير العلاقات الأكاديمية" 
                                {...field}
                                className="text-right"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              البريد الإلكتروني *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="example@university.edu" 
                                {...field}
                                dir="ltr"
                                className="text-left"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              رقم الجوال *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="tel"
                                placeholder="05XXXXXXXX" 
                                {...field}
                                dir="ltr"
                                className="text-left"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Package Selection */}
                  <div className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-lg">تفاصيل الخدمة</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="selectedPackage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الباقة المطلوبة *</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            dir="rtl"
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر الباقة المناسبة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent dir="rtl">
                              <SelectItem value="starter">الباقة الأساسية - 5,000 ريال سنوياً</SelectItem>
                              <SelectItem value="professional">الباقة الاحترافية - 12,000 ريال سنوياً</SelectItem>
                              <SelectItem value="enterprise">باقة المؤسسات - حسب الطلب</SelectItem>
                              <SelectItem value="custom">باقة مخصصة - للمناقشة</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expectedServices"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الخدمات المتوقعة *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="يرجى وصف الخدمات التي تحتاجها مؤسستكم (ترجمة، أبحاث، تدقيق، إلخ)"
                              className="min-h-24 text-right resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ملاحظات إضافية (اختياري)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="أي معلومات إضافية تود مشاركتها"
                              className="min-h-20 text-right resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="ml-2 h-5 w-5" />
                          إرسال الطلب
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      disabled={isSubmitting}
                      size="lg"
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default InstitutionalPartnershipForm;