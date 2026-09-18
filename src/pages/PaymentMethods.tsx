import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Building2, 
  Smartphone, 
  DollarSign, 
  Euro, 
  Banknote, 
  Coins, 
  Wallet,
  Shield,
  CheckCircle,
  Clock,
  Globe,
  Lock,
  Star,
  TrendingUp,
  Zap,
  HeartHandshake,
  BadgeCheck,
  AlertCircle,
  Info
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const PaymentMethods = () => {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<{category: string, method: string} | null>(null);
  const [showInstallmentForm, setShowInstallmentForm] = useState(false);
  const [selectedInstallmentMethod, setSelectedInstallmentMethod] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    absherPhone: '',
    isEmployee: '',
    jobTitle: '',
    monthlyIncome: '',
    serviceType: '',
    serviceAmount: '',
    requestedAmount: '',
    installmentPeriod: '',
    notes: ''
  });

  const handlePaymentSelection = (categoryName: string, methodName: string) => {
    setSelectedMethod({ category: categoryName, method: methodName });
    
    // إذا كان الدفع بالتقسيط، فتح نموذج التقديم
    if (categoryName === 'الدفع بالتقسيط') {
      setShowInstallmentForm(true);
      setSelectedInstallmentMethod(methodName);
    }
    
    toast({
      title: "تم اختيار طريقة الدفع",
      description: `تم اختيار ${methodName} من ${categoryName}`,
      duration: 3000,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/send-installment-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          installmentMethod: selectedInstallmentMethod,
        }),
      });

      if (response.ok) {
        toast({
          title: "تم إرسال الطلب بنجاح",
          description: "سيتم التواصل معك خلال 24 ساعة لتأكيد الطلب",
          duration: 5000,
        });
        setShowInstallmentForm(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          whatsappNumber: '',
          absherPhone: '',
          isEmployee: '',
          jobTitle: '',
          monthlyIncome: '',
          serviceType: '',
          serviceAmount: '',
          requestedAmount: '',
          installmentPeriod: '',
          notes: ''
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast({
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const paymentMethods = [
    {
      category: 'البطاقات الائتمانية',
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      methods: [
        {
          name: 'فيزا (Visa)',
          description: 'دفع فوري وآمن باستخدام بطاقة فيزا',
          features: ['دفع فوري', 'حماية المشتري', 'قبول عالمي'],
          fees: 'بدون رسوم إضافية',
          processing: '1-3 دقائق',
          security: 'عالي',
          icon: '💳'
        },
        {
          name: 'ماستركارد (MasterCard)',
          description: 'حماية عالية مع ماستركارد',
          features: ['تشفير متقدم', 'حماية من الاحتيال', 'استرداد فوري'],
          fees: 'بدون رسوم إضافية',
          processing: '1-3 دقائق',
          security: 'عالي',
          icon: '💳'
        },
        {
          name: 'أمريكان إكسبرس',
          description: 'للعملاء المميزين مع حماية شاملة',
          features: ['خدمة VIP', 'حماية شاملة', 'نقاط مكافآت'],
          fees: 'رسوم معالجة 2.5%',
          processing: '1-5 دقائق',
          security: 'عالي جداً',
          icon: '💎'
        }
      ]
    },
    {
      category: 'التحويل البنكي',
      icon: Building2,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      methods: [
        {
          name: 'التحويل البنكي المحلي',
          description: 'تحويل مباشر من البنوك السعودية',
          features: ['أمان عالي', 'رسوم منخفضة', 'إثبات رسمي'],
          fees: 'مجاني',
          processing: 'فوري',
          security: 'عالي جداً',
          icon: '🏦'
        },
        {
          name: 'التحويل الدولي (SWIFT)',
          description: 'تحويلات دولية آمنة عبر نظام SWIFT',
          features: ['قبول عالمي', 'تتبع التحويل', 'أمان مصرفي'],
          fees: '25-50 دولار',
          processing: '3-5 أيام عمل',
          security: 'عالي جداً',
          icon: '🌍'
        }
      ]
    },
    {
      category: 'المحافظ الإلكترونية',
      icon: Smartphone,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      methods: [
        {
          name: 'PayPal',
          description: 'الأكثر أماناً عالمياً للدفع الإلكتروني',
          features: ['حماية المشتري', 'دفع فوري', 'قبول عالمي'],
          fees: '3.4% + 2 ريال',
          processing: 'فوري',
          security: 'عالي جداً',
          icon: '🔵'
        },
        {
          name: 'Skrill',
          description: 'محفظة إلكترونية سريعة ومضمونة',
          features: ['سرعة في التحويل', 'رسوم منخفضة', 'دعم العملات'],
          fees: '2.9% + 1.5 ريال',
          processing: 'فوري',
          security: 'عالي',
          icon: '🔮'
        },
        {
          name: 'Apple Pay',
          description: 'دفع آمن وسريع لمستخدمي آبل',
          features: ['بصمة الوجه/الإصبع', 'لا توجد أرقام بطاقات', 'خصوصية عالية'],
          fees: 'بدون رسوم إضافية',
          processing: 'فوري',
          security: 'عالي جداً',
          icon: '🍎'
        }
      ]
    },
    {
      category: 'التحويلات الدولية',
      icon: Globe,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      methods: [
        {
          name: 'Western Union',
          description: 'تحويلات دولية موثوقة منذ عقود',
          features: ['شبكة عالمية', 'استلام نقدي', 'تتبع مباشر'],
          fees: '15-25 دولار',
          processing: '15 دقيقة - 2 ساعة',
          security: 'عالي',
          icon: '💰'
        },
        {
          name: 'MoneyGram',
          description: 'تحويلات سريعة لجميع دول العالم',
          features: ['سرعة في التحويل', 'متوفر عالمياً', 'خيارات متنوعة'],
          fees: '10-20 دولار',
          processing: '10 دقيقة - 1 ساعة',
          security: 'عالي',
          icon: '📮'
        },
        {
          name: 'Wise (TransferWise)',
          description: 'أسعار صرف حقيقية وشفافية كاملة',
          features: ['أسعار صرف حقيقية', 'شفافية الرسوم', 'سرعة عالية'],
          fees: '0.5-2% من المبلغ',
          processing: '1-2 أيام عمل',
          security: 'عالي',
          icon: '🎯'
        }
      ]
    },
    {
      category: 'الطرق المحلية',
      icon: Banknote,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      methods: [
        {
          name: 'الدفع النقدي',
          description: 'للعملاء في منطقة جدة والرياض',
          features: ['بدون رسوم', 'مقابلة شخصية', 'استلام فوري'],
          fees: 'مجاني',
          processing: 'فوري عند الاستلام',
          security: 'متوسط',
          icon: '💵'
        },
        {
          name: 'STCPay',
          description: 'محفظة STC الرقمية',
          features: ['دفع بالجوال', 'سهولة الاستخدام', 'أمان عالي'],
          fees: 'حسب نوع المعاملة',
          processing: 'فوري',
          security: 'عالي',
          icon: '📱'
        },
        {
          name: 'التحويل عبر الصرافات',
          description: 'شبكة الصرافات المحلية المعتمدة',
          features: ['منتشر محلياً', 'رسوم منخفضة', 'موثوق'],
          fees: '10-25 ريال',
          processing: '1-4 ساعات',
          security: 'عالي',
          icon: '🏪'
        }
      ]
    },
    {
      category: 'العملات الرقمية',
      icon: Coins,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      methods: [
        {
          name: 'Bitcoin (BTC)',
          description: 'العملة الرقمية الأولى والأكثر انتشاراً',
          features: ['لا مركزي', 'خصوصية عالية', 'رسوم منخفضة'],
          fees: 'رسوم الشبكة (متغيرة)',
          processing: '10-60 دقيقة',
          security: 'عالي جداً',
          icon: '₿'
        },
        {
          name: 'USDT (Tether)',
          description: 'عملة مستقرة مربوطة بالدولار الأمريكي',
          features: ['استقرار السعر', 'سرعة عالية', 'شبكات متعددة'],
          fees: 'رسوم الشبكة (1-5 دولار)',
          processing: '5-30 دقيقة',
          security: 'عالي',
          icon: '₮'
        }
      ]
    },
    {
      category: 'الدفع بالتقسيط',
      icon: Wallet,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      methods: [
        {
          name: 'أمكان (Emkan)',
          description: 'قسّط مشترياتك على 4 دفعات بدون فوائد',
          features: ['4 دفعات شهرية', 'بدون فوائد', 'موافقة فورية'],
          fees: 'بدون رسوم إضافية',
          processing: 'موافقة فورية',
          security: 'عالي جداً',
          icon: '💳'
        },
        {
          name: 'تمارا (Tamara)',
          description: 'اشتري الآن وادفع لاحقاً مع تمارا',
          features: ['3 دفعات شهرية', 'بدون فوائد', 'مرونة في السداد'],
          fees: 'بدون رسوم إضافية',
          processing: 'موافقة فورية',
          security: 'عالي جداً',
          icon: '🟢'
        },
        {
          name: 'تابي (Tabby)',
          description: 'قسّط مشترياتك على 4 دفعات متساوية',
          features: ['4 دفعات كل أسبوعين', 'بدون فوائد', 'سهولة الاستخدام'],
          fees: 'بدون رسوم إضافية',
          processing: 'موافقة فورية',
          security: 'عالي جداً',
          icon: '🔵'
        },
        {
          name: 'مدفوع (Madfoua)',
          description: 'حلول دفع بالتقسيط مرنة ومبتكرة',
          features: ['دفعات مرنة', 'بدون فوائد', 'خدمة عملاء ممتازة'],
          fees: 'بدون رسوم إضافية',
          processing: 'موافقة فورية',
          security: 'عالي جداً',
          icon: '💰'
        },
        {
          name: 'سبل (SPayLater)',
          description: 'اشتري الآن وادفع على 6 أشهر',
          features: ['6 دفعات شهرية', 'بدون فوائد', 'تطبيق سهل'],
          fees: 'بدون رسوم إضافية',
          processing: 'موافقة فورية',
          security: 'عالي جداً',
          icon: '📱'
        },
        {
          name: 'بوستباي (PostPay)',
          description: 'ادفع لاحقاً خلال 30 يوم',
          features: ['دفع خلال 30 يوم', 'بدون فوائد', 'مرونة كاملة'],
          fees: 'بدون رسوم إضافية',
          processing: 'موافقة فورية',
          security: 'عالي',
          icon: '📮'
        }
      ]
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: 'تشفير متقدم SSL',
      description: 'جميع المعاملات محمية بتشفير 256-بت'
    },
    {
      icon: Lock,
      title: 'الامتثال لمعايير PCI DSS',
      description: 'نلتزم بأعلى معايير الأمان المصرفي'
    },
    {
      icon: BadgeCheck,
      title: 'مراقبة مستمرة',
      description: 'مراقبة 24/7 للكشف عن أي نشاط مشبوه'
    },
    {
      icon: HeartHandshake,
      title: 'ضمان الاسترداد',
      description: 'ضمان استرداد كامل في حالة عدم الرضا'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const getSecurityColor = (level: string) => {
    switch (level) {
      case 'عالي جداً':
        return 'text-green-600 bg-green-100';
      case 'عالي':
        return 'text-blue-600 bg-blue-100';
      case 'متوسط':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-blue-50 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full mb-6">
              <DollarSign className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              طرق الدفع المتاحة
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              اختر من بين مجموعة متنوعة من طرق الدفع الآمنة والموثوقة التي تناسب احتياجاتك. 
              نحن نضمن أمان وسرية جميع معاملاتك المالية.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="px-4 py-2">
                <Shield className="h-4 w-4 ml-2" />
                آمان 100%
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Zap className="h-4 w-4 ml-2" />
                دفع فوري
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Globe className="h-4 w-4 ml-2" />
                قبول عالمي
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <CheckCircle className="h-4 w-4 ml-2" />
                ضمان الاسترداد
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-16"
          >
            {paymentMethods.map((category, categoryIndex) => (
              <motion.div key={categoryIndex} variants={itemVariants} className="space-y-8">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${category.color} mb-4`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{category.category}</h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.methods.map((method, methodIndex) => (
                    <motion.div
                      key={methodIndex}
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 group">
                        <CardHeader className={`${category.bgColor} group-hover:bg-opacity-80 transition-all duration-300`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-3xl">{method.icon}</div>
                            <Badge className={`${getSecurityColor(method.security)} border-0`}>
                              {method.security}
                            </Badge>
                          </div>
                          <CardTitle className={`${category.textColor} text-xl mb-2`}>
                            {method.name}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed">
                            {method.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="p-6 space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">الرسوم:</span>
                              <span className="font-semibold text-green-600">{method.fees}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">وقت المعالجة:</span>
                              <span className="font-semibold">{method.processing}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">المميزات:</h4>
                            <ul className="space-y-1">
                              {method.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                                  <CheckCircle className="h-3 w-3 text-green-500 ml-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <Button 
                            className={`w-full transition-all duration-300 ${
                              selectedMethod?.category === category.category && selectedMethod?.method === method.name 
                                ? 'bg-primary text-white shadow-lg' 
                                : 'group-hover:bg-primary group-hover:text-white'
                            }`}
                            variant={selectedMethod?.category === category.category && selectedMethod?.method === method.name ? 'default' : 'outline'}
                            onClick={() => handlePaymentSelection(category.category, method.name)}
                          >
                            {selectedMethod?.category === category.category && selectedMethod?.method === method.name 
                              ? '✓ تم الاختيار' 
                              : 'اختيار هذه الطريقة'
                            }
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">أمان معاملاتك أولويتنا</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نطبق أعلى معايير الأمان العالمية لحماية بياناتك المالية ومعاملاتك
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {securityFeatures.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center p-6 h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-green-200">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                    <feature.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Payment Policy */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-6">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-red-800">سياسة الدفع الرسمية</h2>
              <p className="text-lg text-red-700 font-semibold">يرجى قراءة هذه السياسة بعناية قبل إجراء أي معاملة مالية</p>
            </div>

            <div className="space-y-6">
              {/* Main Policy Card */}
              <Card className="p-8 border-4 border-red-200 bg-white shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Building2 className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-red-900 mb-4">الحساب البنكي الرسمي الموحد</h3>
                    <p className="text-lg text-red-800 leading-relaxed mb-4">
                      <strong>جميع التحويلات المالية يجب أن تتم حصرياً عن طريق حساب الشركة البنكي الرسمي الموحد فقط.</strong>
                    </p>
                    <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 mb-4">
                      <p className="text-red-800 font-semibold">
                        هذا هو الحساب الوحيد المعتمد لجميع التعاملات المالية مع شركتنا.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Warning Card */}
              <Card className="p-8 border-4 border-orange-200 bg-orange-50 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-orange-900 mb-4">تحذير صارم</h3>
                    <div className="space-y-3">
                      <p className="text-lg text-orange-800 leading-relaxed">
                        <strong>نحن غير ملتزمين بأي طلب تحويل يتم عن طريق:</strong>
                      </p>
                      <ul className="space-y-2 text-orange-800">
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                          حسابات شخصية لأي من الموظفين
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                          حسابات بنكية غير تابعة للشركة رسمياً
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                          أي طريقة دفع خارج النظام الرسمي
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Protection Notice */}
              <Card className="p-8 border-4 border-blue-200 bg-blue-50 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-blue-900 mb-4">حماية العملاء</h3>
                    <p className="text-lg text-blue-800 leading-relaxed">
                      هذه السياسة وضعت لحمايتكم من الاحتيال والتأكد من وصول أموالكم للحساب الصحيح. 
                      أي تحويل خارج هذا النظام قد يعرضكم لفقدان الأموال دون إمكانية استردادها.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Contact Info */}
              <Card className="p-8 border-4 border-green-200 bg-green-50 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Smartphone className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-green-900 mb-4">للتأكد والاستفسار</h3>
                    <p className="text-lg text-green-800 leading-relaxed mb-4">
                      قبل إجراء أي تحويل، يرجى التواصل معنا للحصول على تفاصيل الحساب البنكي الرسمي الصحيح.
                    </p>
                    <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4">
                      <p className="text-green-800 font-semibold text-center">
                        📱 واتساب: +966593799355
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full mb-6">
                <Info className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">معلومات مهمة</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 border-2 border-blue-200 bg-blue-50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">سياسة الاسترداد</h3>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      يمكن طلب استرداد كامل خلال 7 أيام من تاريخ الدفع في حالة عدم الرضا عن الخدمة. 
                      الاستردادات تتم خلال 3-5 أيام عمل حسب طريقة الدفع المستخدمة.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 border-green-200 bg-green-50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-900 mb-2">ضمان الأمان</h3>
                    <p className="text-sm text-green-800 leading-relaxed">
                      جميع المعاملات مشفرة وآمنة 100%. لا نحتفظ ببيانات بطاقاتك الائتمانية. 
                      نستخدم أحدث تقنيات الحماية المعتمدة عالمياً.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 border-purple-200 bg-purple-50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-900 mb-2">أوقات المعالجة</h3>
                    <p className="text-sm text-purple-800 leading-relaxed">
                      أوقات المعالجة المذكورة تقريبية وقد تختلف حسب البنك أو مقدم الخدمة. 
                      ستصلك رسالة تأكيد فور اكتمال عملية الدفع.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 border-amber-200 bg-amber-50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Star className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 mb-2">دعم العملاء</h3>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      فريق دعم العملاء متاح 24/7 لمساعدتك في أي استفسار متعلق بالدفع. 
                      تواصل معنا عبر الواتساب أو البريد الإلكتروني.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-blue-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              جاهز لبدء مشروعك؟
            </h2>
            
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              اختر طريقة الدفع التي تناسبك وابدأ رحلتك معنا نحو النجاح الأكاديمي والمهني
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3"
              >
                <DollarSign className="h-5 w-5 ml-2" />
                اطلب خدمة الآن
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-3"
              >
                <Smartphone className="h-5 w-5 ml-2" />
                تواصل معنا
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Installment Payment Form Modal */}
      <Dialog open={showInstallmentForm} onOpenChange={setShowInstallmentForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-2">
              طلب الدفع بالتقسيط - {selectedInstallmentMethod}
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              يرجى ملء النموذج أدناه وسيتم التواصل معك خلال 24 ساعة
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الكامل *</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="example@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الجوال *</Label>
                <Input
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="05xxxxxxxx"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">رقم الواتساب *</Label>
                <Input
                  id="whatsappNumber"
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                  placeholder="05xxxxxxxx"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="absherPhone">رقم الجوال المسجل في أبشر *</Label>
                <Input
                  id="absherPhone"
                  required
                  value={formData.absherPhone}
                  onChange={(e) => setFormData({...formData, absherPhone: e.target.value})}
                  placeholder="05xxxxxxxx"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="isEmployee">هل أنت موظف؟ *</Label>
                <Select onValueChange={(value) => setFormData({...formData, isEmployee: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر حالتك الوظيفية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">نعم، موظف</SelectItem>
                    <SelectItem value="self-employed">عمل حر</SelectItem>
                    <SelectItem value="unemployed">غير موظف</SelectItem>
                    <SelectItem value="student">طالب</SelectItem>
                    <SelectItem value="retired">متقاعد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobTitle">المسمى الوظيفي أو المهنة *</Label>
                <Input
                  id="jobTitle"
                  required
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                  placeholder="مثال: مهندس، طبيب، محاسب، إلخ"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">الراتب الشهري *</Label>
                <Select onValueChange={(value) => setFormData({...formData, monthlyIncome: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الراتب الشهري" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3000-5000">3,000 - 5,000 ريال</SelectItem>
                    <SelectItem value="5000-8000">5,000 - 8,000 ريال</SelectItem>
                    <SelectItem value="8000-12000">8,000 - 12,000 ريال</SelectItem>
                    <SelectItem value="12000-20000">12,000 - 20,000 ريال</SelectItem>
                    <SelectItem value="20000+">أكثر من 20,000 ريال</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serviceType">نوع الخدمة المطلوبة *</Label>
                <Select onValueChange={(value) => setFormData({...formData, serviceType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الخدمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic-translation">ترجمة أكاديمية</SelectItem>
                    <SelectItem value="business-translation">ترجمة تجارية</SelectItem>
                    <SelectItem value="legal-translation">ترجمة قانونية</SelectItem>
                    <SelectItem value="medical-translation">ترجمة طبية</SelectItem>
                    <SelectItem value="technical-translation">ترجمة تقنية</SelectItem>
                    <SelectItem value="research-services">خدمات البحث</SelectItem>
                    <SelectItem value="consultation">استشارات أكاديمية</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serviceAmount">قيمة الخدمة (ريال) *</Label>
                <Input
                  id="serviceAmount"
                  type="number"
                  required
                  value={formData.serviceAmount}
                  onChange={(e) => setFormData({...formData, serviceAmount: e.target.value})}
                  placeholder="1000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="installmentPeriod">فترة التقسيط المطلوبة *</Label>
                <Select onValueChange={(value) => setFormData({...formData, installmentPeriod: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر فترة التقسيط" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-months">3 أشهر</SelectItem>
                    <SelectItem value="6-months">6 أشهر</SelectItem>
                    <SelectItem value="12-months">12 شهر</SelectItem>
                    <SelectItem value="flexible">مرنة حسب الظروف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات إضافية</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="أي معلومات إضافية تود إضافتها..."
                rows={3}
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">معلومات مهمة:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• سيتم مراجعة طلبك والتواصل معك خلال 24 ساعة</li>
                <li>• قد نطلب مستندات إضافية لتأكيد الهوية والراتب</li>
                <li>• الموافقة على التقسيط تعتمد على تقييم الأهلية</li>
                <li>• لا توجد رسوم على تقديم الطلب</li>
                <li>• يجب أن تكون جميع أرقام الجوال صالحة ومفعلة</li>
              </ul>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جارٍ الإرسال...
                  </>
                ) : (
                  'إرسال الطلب'
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowInstallmentForm(false)}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default PaymentMethods;