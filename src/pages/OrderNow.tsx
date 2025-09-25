import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Building2, 
  Globe, 
  Star, 
  Shield, 
  CheckCircle, 
  Users, 
  Award,
  Zap,
  Clock,
  Mail,
  Phone,
  MapPin,
  FileText,
  Briefcase,
  Target,
  TrendingUp,
  Calendar,
  MessageSquare,
  Bell,
  Send,
  AlertCircle,
  DollarSign,
  GraduationCap,
  BookOpen,
  UserCheck
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Schema للتحقق من صحة البيانات
const orderSchema = z.object({
  clientType: z.string().min(1, { message: "نوع العميل مطلوب" }),
  organizationName: z.string().min(2, { message: "اسم الجهة يجب أن يكون حرفين على الأقل" }),
  contactPerson: z.string().min(2, { message: "اسم الشخص المسؤول مطلوب" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
  phone: z.string().min(10, { message: "رقم الهاتف يجب أن يكون 10 أرقام على الأقل" }),
  country: z.string().min(1, { message: "الدولة مطلوبة" }),
  serviceType: z.string().min(1, { message: "نوع الخدمة مطلوب" }),
  projectDescription: z.string().min(50, { message: "وصف المشروع يجب أن يكون 50 حرف على الأقل" }),
  budget: z.string().min(1, { message: "الميزانية مطلوبة" }),
  timeline: z.string().min(1, { message: "الجدول الزمني مطلوب" }),
  priority: z.string().min(1, { message: "الأولوية مطلوبة" }),
});

type OrderFormData = z.infer<typeof orderSchema>;

const OrderNow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedClientType, setSelectedClientType] = useState('');

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      clientType: '',
      organizationName: '',
      contactPerson: '',
      email: '',
      phone: '',
      country: '',
      serviceType: '',
      projectDescription: '',
      budget: '',
      timeline: '',
      priority: '',
    },
  });

  // أنواع العملاء
  const clientTypes = [
    { value: 'company', label: 'شركة', icon: Building2, color: 'text-blue-600' },
    { value: 'student', label: 'طالب', icon: GraduationCap, color: 'text-green-600' },
    { value: 'researcher', label: 'باحث', icon: BookOpen, color: 'text-purple-600' },
  ];

  // قائمة الخدمات
  const services = [
    { value: 'academic-translation', label: 'الترجمة الأكاديمية', icon: '🎓' },
    { value: 'research-writing', label: 'كتابة البحوث العلمية', icon: '📚' },
    { value: 'statistical-analysis', label: 'التحليل الإحصائي', icon: '📊' },
    { value: 'journal-publication', label: 'النشر في المجلات', icon: '📄' },
    { value: 'thesis-consultation', label: 'استشارات الرسائل العلمية', icon: '🎯' },
    { value: 'business-translation', label: 'الترجمة التجارية', icon: '💼' },
    { value: 'technical-translation', label: 'الترجمة التقنية', icon: '⚙️' },
    { value: 'website-localization', label: 'توطين المواقع', icon: '🌐' },
  ];

  // قائمة الدول
  const countries = [
    'المملكة العربية السعودية', 'الإمارات العربية المتحدة', 'قطر', 'الكويت', 
    'البحرين', 'عُمان', 'مصر', 'الأردن', 'لبنان', 'المغرب', 'تونس', 'الجزائر',
    'الولايات المتحدة', 'كندا', 'المملكة المتحدة', 'ألمانيا', 'فرنسا', 'أستراليا'
  ];

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    
    try {
      // محاكاة إرسال البيانات
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // إرسال تنبيه للإدارة
      await sendAdminNotification(data);
      
      // إرسال رد تلقائي للعميل
      await sendClientResponse(data);
      
      setSubmitSuccess(true);
      
      toast({
        title: "تم إرسال طلبك بنجاح! 🎉",
        description: "سيتم التواصل معك خلال 24 ساعة",
      });
      
      // إعادة تعيين النموذج
      form.reset();
      
    } catch (error) {
      toast({
        title: "حدث خطأ في الإرسال",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendAdminNotification = async (data: OrderFormData) => {
    // هنا سيتم إرسال تنبيه للإدارة (يمكن دمجه مع Supabase أو API خارجي)
    console.log("تنبيه للإدارة:", {
      type: "طلب جديد",
      clientType: data.clientType,
      organization: data.organizationName,
      service: data.serviceType,
      priority: data.priority,
      timestamp: new Date().toISOString(),
    });
  };

  const sendClientResponse = async (data: OrderFormData) => {
    // هنا سيتم إرسال رد تلقائي للعميل
    console.log("رد تلقائي للعميل:", {
      to: data.email,
      subject: "تأكيد استلام طلبكم - وكالة ماستر إيدو باث",
      message: `عزيزي ${data.contactPerson}، تم استلام طلبكم بنجاح وسيتم التواصل معكم قريباً.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900" dir="rtl">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-16 md:py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-yellow-300 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-300 rounded-full blur-lg animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <Zap className="h-10 w-10 md:h-12 md:w-12 text-yellow-300" />
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-arabic-title">
              اطلب خدمتك الآن
            </h1>
            
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              انضم إلى آلاف الشركات والطلاب والباحثين الذين يثقون في خدماتنا المتخصصة
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {[
                { icon: Shield, text: "آمان 100%", color: "text-green-300" },
                { icon: Award, text: "ISO معتمد", color: "text-yellow-300" },
                { icon: Users, text: "+10K عميل", color: "text-blue-300" },
                { icon: Globe, text: "+50 دولة", color: "text-purple-300" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Star className="h-6 w-6" />
                  لماذا نحن الخيار الأمثل؟
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Clock, title: "سرعة في التنفيذ", desc: "تسليم خلال 24-72 ساعة" },
                  { icon: Shield, title: "ضمان الجودة", desc: "نسبة نجاح 100%" },
                  { icon: Users, title: "فريق متخصص", desc: "خبراء معتمدون دولياً" },
                  { icon: TrendingUp, title: "نمو مستمر", desc: "150% نمو سنوي" }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">{benefit.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

          </motion.div>

          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-2 border-gradient-to-r from-blue-500 to-purple-500 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl md:text-3xl text-center flex items-center justify-center gap-3">
                  <UserCheck className="h-8 w-8" />
                  نموذج طلب الخدمة المتقدم
                </CardTitle>
                <p className="text-center opacity-90 mt-2">
                  للشركات والطلاب والباحثين - املأ البيانات وسيتم التواصل معك خلال 24 ساعة
                </p>
              </CardHeader>

              <CardContent className="p-6 md:p-8">
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6"
                  >
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-300">
                        <strong>تم إرسال طلبك بنجاح!</strong> ستصلك رسالة تأكيد على بريدك الإلكتروني، وسيتم التواصل معك من قبل فريقنا المتخصص خلال 24 ساعة.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Client Type Selection */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
                        <UserCheck className="h-5 w-5" />
                        نوع العميل
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="clientType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                              <span>اختر نوع العميل</span>
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            </FormLabel>
                            <Select 
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedClientType(value);
                              }} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 text-right" dir="rtl">
                                  <SelectValue placeholder="اختر نوع العميل" className="text-right" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-700 z-50" dir="rtl">
                                {clientTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value} className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 text-right" dir="rtl">
                                    <div className="flex items-center gap-2 justify-end">
                                      <span>{type.label}</span>
                                      <type.icon className={`h-4 w-4 ${type.color}`} />
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Organization Information Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                        {selectedClientType === 'company' && <Building2 className="h-5 w-5" />}
                        {selectedClientType === 'student' && <GraduationCap className="h-5 w-5" />}
                        {selectedClientType === 'researcher' && <BookOpen className="h-5 w-5" />}
                        {!selectedClientType && <Building2 className="h-5 w-5" />}
                        {selectedClientType === 'company' ? 'معلومات الشركة' : 
                         selectedClientType === 'student' ? 'معلومات الطالب' :
                         selectedClientType === 'researcher' ? 'معلومات الباحث' : 'معلومات الجهة'}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="organizationName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                <span>
                                  {selectedClientType === 'company' ? 'اسم الشركة' : 
                                   selectedClientType === 'student' ? 'اسم الجامعة/المعهد' :
                                   selectedClientType === 'researcher' ? 'اسم المؤسسة البحثية' : 'اسم الجهة'}
                                </span>
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={
                                    selectedClientType === 'company' ? "مثال: شركة التقنيات المتقدمة" : 
                                    selectedClientType === 'student' ? "مثال: جامعة الملك سعود" :
                                    selectedClientType === 'researcher' ? "مثال: مركز الأبحاث العلمية" : "مثال: اسم الجهة"
                                  }
                                  className="border-2 border-blue-200 dark:border-blue-700 focus:border-blue-500 h-12 text-right"
                                  dir="rtl"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contactPerson"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                <span>
                                  {selectedClientType === 'company' ? 'الشخص المسؤول' : 
                                   selectedClientType === 'student' ? 'اسم الطالب' :
                                   selectedClientType === 'researcher' ? 'اسم الباحث' : 'اسم الشخص المسؤول'}
                                </span>
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="مثال: أحمد محمد"
                                  className="border-2 border-blue-200 dark:border-blue-700 focus:border-blue-500 h-12 text-right"
                                  dir="rtl"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-lg border border-green-200 dark:border-green-800">
                      <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        معلومات التواصل
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                             <FormItem>
                               <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                 <span>البريد الإلكتروني</span>
                                 <AlertCircle className="h-4 w-4 text-red-500" />
                               </FormLabel>
                               <FormControl>
                                 <Input
                                   {...field}
                                   type="email"
                                   placeholder="example@company.com"
                                   className="border-2 border-green-200 dark:border-green-700 focus:border-green-500 h-12 text-right"
                                   dir="rtl"
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
                               <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                 <span>رقم الهاتف</span>
                                 <AlertCircle className="h-4 w-4 text-red-500" />
                               </FormLabel>
                               <FormControl>
                                 <Input
                                   {...field}
                                   placeholder="+966501234567"
                                   className="border-2 border-green-200 dark:border-green-700 focus:border-green-500 h-12 text-right"
                                   dir="rtl"
                                 />
                               </FormControl>
                               <FormMessage />
                             </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Service Details Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-6 flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        تفاصيل الخدمة والمتطلبات
                      </h3>
                      
                      <div className="space-y-6">
                        {/* Service Type & Country Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="serviceType"
                            render={({ field }) => (
                               <FormItem>
                                 <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                   <span>نوع الخدمة المطلوبة</span>
                                   <AlertCircle className="h-4 w-4 text-red-500" />
                                 </FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                   <FormControl>
                                     <SelectTrigger className="border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 h-12 bg-white dark:bg-slate-800 text-right" dir="rtl">
                                       <SelectValue placeholder="اختر الخدمة" className="text-right" />
                                     </SelectTrigger>
                                   </FormControl>
                                  <SelectContent className="z-50 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-700 shadow-xl">
                                    {services.map((service) => (
                                      <SelectItem key={service.value} value={service.value} className="hover:bg-purple-50 dark:hover:bg-slate-700">
                                        <div className="flex items-center gap-2">
                                          <span>{service.icon}</span>
                                          <span>{service.label}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                               <FormItem>
                                 <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                   <span>الدولة</span>
                                   <AlertCircle className="h-4 w-4 text-red-500" />
                                 </FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                   <FormControl>
                                     <SelectTrigger className="border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 h-12 bg-white dark:bg-slate-800 text-right" dir="rtl">
                                       <SelectValue placeholder="اختر الدولة" className="text-right" />
                                     </SelectTrigger>
                                   </FormControl>
                                   <SelectContent className="z-50 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-700 shadow-xl max-h-[200px]" dir="rtl">
                                     {countries.map((country) => (
                                       <SelectItem key={country} value={country} className="hover:bg-purple-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         {country}
                                       </SelectItem>
                                     ))}
                                   </SelectContent>
                                 </Select>
                                 <FormMessage />
                               </FormItem>
                            )}
                          />
                        </div>

                        {/* Budget & Timeline & Priority */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-5 rounded-lg border border-amber-200 dark:border-amber-800">
                          <h4 className="text-md font-semibold text-amber-800 dark:text-amber-300 mb-4 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            متطلبات المشروع
                          </h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="budget"
                              render={({ field }) => (
                                 <FormItem>
                                   <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                     <span>الميزانية المتوقعة</span>
                                     <AlertCircle className="h-4 w-4 text-red-500" />
                                   </FormLabel>
                                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                                     <FormControl>
                                       <SelectTrigger className="border-2 border-amber-200 dark:border-amber-700 focus:border-amber-500 h-12 bg-white dark:bg-slate-800 text-right" dir="rtl">
                                         <SelectValue placeholder="اختر الميزانية" className="text-right" />
                                       </SelectTrigger>
                                     </FormControl>
                                     <SelectContent className="z-50 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700 shadow-xl" dir="rtl">
                                       <SelectItem value="under-5k" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>أقل من 5,000 ريال</span>
                                           <DollarSign className="h-4 w-4 text-green-600" />
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="5k-15k" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>5,000 - 15,000 ريال</span>
                                           <DollarSign className="h-4 w-4 text-blue-600" />
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="15k-30k" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>15,000 - 30,000 ريال</span>
                                           <DollarSign className="h-4 w-4 text-purple-600" />
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="30k-50k" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>30,000 - 50,000 ريال</span>
                                           <DollarSign className="h-4 w-4 text-orange-600" />
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="above-50k" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>أكثر من 50,000 ريال</span>
                                           <DollarSign className="h-4 w-4 text-red-600" />
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="custom" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>ميزانية مخصصة</span>
                                           <DollarSign className="h-4 w-4 text-gray-600" />
                                         </div>
                                       </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="timeline"
                              render={({ field }) => (
                                 <FormItem>
                                   <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                     <span>المدة المطلوبة</span>
                                     <AlertCircle className="h-4 w-4 text-red-500" />
                                   </FormLabel>
                                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                                     <FormControl>
                                       <SelectTrigger className="border-2 border-amber-200 dark:border-amber-700 focus:border-amber-500 h-12 bg-white dark:bg-slate-800 text-right" dir="rtl">
                                         <SelectValue placeholder="اختر المدة" className="text-right" />
                                       </SelectTrigger>
                                     </FormControl>
                                     <SelectContent className="z-50 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700 shadow-xl" dir="rtl">
                                       <SelectItem value="urgent" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>عاجل (1-3 أيام)</span>
                                           <AlertCircle className="h-4 w-4 text-red-600" />
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="week" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>أسبوع واحد</span>
                                           <Clock className="h-4 w-4 text-orange-600" />
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="2weeks" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>أسبوعين</span>
                                           <Clock className="h-4 w-4 text-blue-600" />
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="month" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>شهر واحد</span>
                                           <Calendar className="h-4 w-4 text-green-600" />
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="2months" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>شهرين</span>
                                           <Calendar className="h-4 w-4 text-purple-600" />
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="3months" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>3 أشهر أو أكثر</span>
                                           <Calendar className="h-4 w-4 text-gray-600" />
                                         </div>
                                       </SelectItem>
                                     </SelectContent>
                                   </Select>
                                   <FormMessage />
                                 </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="priority"
                              render={({ field }) => (
                                 <FormItem>
                                   <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                     <span>مستوى الأولوية</span>
                                     <AlertCircle className="h-4 w-4 text-red-500" />
                                   </FormLabel>
                                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                                     <FormControl>
                                       <SelectTrigger className="border-2 border-amber-200 dark:border-amber-700 focus:border-amber-500 h-12 bg-white dark:bg-slate-800 text-right" dir="rtl">
                                         <SelectValue placeholder="اختر الأولوية" className="text-right" />
                                       </SelectTrigger>
                                     </FormControl>
                                     <SelectContent className="z-50 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700 shadow-xl" dir="rtl">
                                       <SelectItem value="low" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>منخفضة</span>
                                           <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="medium" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>متوسطة</span>
                                           <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="high" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>عالية</span>
                                           <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="critical" className="hover:bg-amber-50 dark:hover:bg-slate-700 text-right" dir="rtl">
                                         <div className="flex items-center gap-2 justify-end">
                                           <span>حرجة</span>
                                           <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                         </div>
                                       </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="projectDescription"
                          render={({ field }) => (
                             <FormItem>
                               <FormLabel className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                 <span>وصف تفصيلي للمشروع</span>
                                 <AlertCircle className="h-4 w-4 text-red-500" />
                               </FormLabel>
                               <FormControl>
                                 <Textarea
                                   {...field}
                                   placeholder="يرجى وصف المشروع بالتفصيل، متطلباتكم، والنتائج المتوقعة..."
                                   className="border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 min-h-[120px] resize-y text-right"
                                   dir="rtl"
                                 />
                               </FormControl>
                               <FormMessage />
                             </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-14 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                            جاري الإرسال...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5 ml-2" />
                            إرسال الطلب الآن
                          </>
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/')}
                        className="h-14 px-8 border-2 border-slate-300 hover:border-slate-400 text-slate-700 dark:text-slate-300"
                      >
                        العودة للرئيسية
                      </Button>
                    </motion.div>

                    {/* Contact Info */}
                    <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <h4 className="font-semibold text-amber-800 dark:text-amber-300">هل تحتاج مساعدة؟</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                          <Phone className="h-4 w-4" />
                          <span>0500776343</span>
                        </div>
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                          <Mail className="h-4 w-4" />
                          <span>info@masteredupath.com</span>
                        </div>
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                          <MessageSquare className="h-4 w-4" />
                          <span>دعم فوري 24/7</span>
                        </div>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              لماذا تختار وكالة ماستر إيدو باث؟
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-3xl mx-auto">
              نحن الشريك الموثوق لأكثر من 10,000 عميل حول العالم، مع ضمان الجودة والسرعة في التنفيذ
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: "100%", label: "نسبة النجاح", icon: Target },
                { number: "+10K", label: "عميل راضي", icon: Users },
                { number: "24/7", label: "دعم مستمر", icon: Clock },
                { number: "+50", label: "دولة نخدمها", icon: Globe }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center">
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.number}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderNow;