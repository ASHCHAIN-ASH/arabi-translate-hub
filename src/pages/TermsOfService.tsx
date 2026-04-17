import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from "@/components/Header";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";
import { motion } from "framer-motion";

const TermsOfService = () => {
  const downloadTerms = () => {
    const element = document.createElement('a');
    const file = new Blob([document.getElementById('terms-content')?.innerText || ''], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'شروط-الاستخدام-وكالة-ماستر-ايدو-باث.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5" dir="rtl">
      
      {/* Working Hours Banner */}
      <WorkingHoursBannerRTL />
      
      {/* Header */}
      <Header />
      
      <motion.div 
        className="container mx-auto px-4 py-8 lg:py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-8 lg:mb-12" variants={itemVariants}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full mb-6 shadow-lg">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              الشروط والأحكام
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              شروط وأحكام استخدام خدمات وكالة ماستر إيدو باث للخدمات التعليمية والأكاديمية والترجمة المتخصصة
            </p>
            <Button 
              onClick={downloadTerms}
              variant="outline" 
              className="mt-6 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              تحميل الشروط والأحكام
            </Button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="shadow-2xl border-0 bg-card/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardTitle className="text-2xl lg:text-3xl text-primary font-bold">
                  وكالة ماستر إيدو باث - الشروط والأحكام
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  تاريخ السريان: {new Date().toLocaleDateString('ar-SA')}
                </p>
              </CardHeader>
              <CardContent id="terms-content" className="space-y-6 lg:space-y-8 text-right p-6 lg:p-8">
                
                {/* مقدمة */}
                <motion.section variants={itemVariants} className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-lg border-r-4 border-primary">
                  <h3 className="text-xl lg:text-2xl font-bold mb-4 text-primary flex items-center gap-3">
                    <Shield className="w-6 h-6" />
                    مقدمة وتعريفات أساسية
                  </h3>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p className="font-semibold text-foreground">
                      مرحباً بكم في وكالة ماستر إيدو باث، الوجهة الرائدة للتميز الأكاديمي والتعليمي.
                    </p>
                    <div className="grid lg:grid-cols-2 gap-4">
                      <div>
                        <p><strong className="text-primary">الوكالة:</strong> وكالة ماستر إيدو باث للخدمات التعليمية والأكاديمية والترجمة المتخصصة</p>
                        <p><strong className="text-primary">العميل:</strong> أي شخص طبيعي أو اعتباري يستفيد من خدماتنا</p>
                      </div>
                      <div>
                        <p><strong className="text-primary">الخدمات:</strong> جميع الخدمات التعليمية، الأكاديمية، والترجمة المقدمة</p>
                        <p><strong className="text-primary">المنصة:</strong> الموقع الإلكتروني والتطبيقات الرقمية للوكالة</p>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* نطاق الخدمات */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    نطاق خدماتنا المتخصصة
                  </h3>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-primary">الخدمات التعليمية والأكاديمية:</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>البحث العلمي والأطروحات الأكاديمية</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>التحليل الإحصائي والمنهجية العلمية</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>كتابة وتحرير البحوث والأوراق العلمية</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>النشر الأكاديمي والمجلات العلمية</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>الاستشارات الأكاديمية والتعليمية</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-primary">خدمات الترجمة المتخصصة:</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>الترجمة الأكاديمية والعلمية المعتمدة</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>الترجمة القانونية والمحلفة</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>الترجمة الطبية والتقنية</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>ترجمة الوثائق والمستندات الرسمية</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>الترجمة الفورية والمؤتمرات</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* التزامات العميل */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary">التزامات وواجبات العميل</h3>
                  <div className="bg-muted/20 p-6 rounded-lg space-y-4">
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-primary">المتطلبات الأساسية:</h4>
                        <ul className="space-y-2 text-muted-foreground text-sm lg:text-base">
                          <li>• تقديم المعلومات والوثائق بصورة واضحة ومكتملة</li>
                          <li>• تحديد المتطلبات والتوقعات بدقة ووضوح</li>
                          <li>• الالتزام بالمواعيد المتفق عليها للمراجعة والتغذية الراجعة</li>
                          <li>• تقديم المراجع والمصادر العلمية المطلوبة</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-primary">الالتزامات المالية:</h4>
                        <ul className="space-y-2 text-muted-foreground text-sm lg:text-base">
                          <li>• دفع الرسوم المتفق عليها وفقاً لجدولة الدفع</li>
                          <li>• تحمل أي رسوم إضافية للتعديلات الجوهرية</li>
                          <li>• الالتزام بسياسة الإلغاء والاسترداد</li>
                          <li>• دفع رسوم الخدمات العاجلة عند الاقتضاء</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* التزامات الوكالة */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary">التزامات وكالة ماستر إيدو باث</h3>
                  <div className="space-y-6">
                    <div className="grid lg:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-3">ضمان الجودة</h4>
                        <ul className="space-y-2 text-blue-700 text-sm">
                          <li>• معايير عالمية للجودة الأكاديمية</li>
                          <li>• مراجعة شاملة قبل التسليم</li>
                          <li>• ضمان الأصالة والمصداقية</li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-3">الالتزام بالمواعيد</h4>
                        <ul className="space-y-2 text-green-700 text-sm">
                          <li>• تسليم في المواعيد المحددة</li>
                          <li>• إشعارات مستمرة بالتقدم</li>
                          <li>• تنسيق للظروف الطارئة</li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-3">الدعم المستمر</h4>
                        <ul className="space-y-2 text-purple-700 text-sm">
                          <li>• استشارات مجانية ما بعد التسليم</li>
                          <li>• دعم فني على مدار الساعة</li>
                          <li>• خدمة عملاء متخصصة</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* سياسة التسعير والدفع */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary">سياسة التسعير والدفع</h3>
                  <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg space-y-4">
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-amber-800">تحديد الأسعار:</h4>
                        <ul className="space-y-2 text-amber-700 text-sm lg:text-base">
                          <li>• تسعير شفاف ومفصل حسب نوع الخدمة</li>
                          <li>• عروض أسعار مجانية وغير ملزمة</li>
                          <li>• خصومات للعملاء المؤسسيين والمتكررين</li>
                          <li>• أسعار تنافسية مع ضمان الجودة العالية</li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-amber-800">شروط الدفع:</h4>
                        <ul className="space-y-2 text-amber-700 text-sm lg:text-base">
                          <li>• دفعة مقدمة 50% للمشاريع الكبيرة</li>
                          <li>• إمكانية التقسيط للمشاريع طويلة المدى</li>
                          <li>• طرق دفع متعددة وآمنة</li>
                          <li>• فواتير مفصلة وشفافة</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* حقوق الملكية الفكرية */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                    حقوق الملكية الفكرية والاستخدام
                  </h3>
                  <div className="bg-red-50 border border-red-200 p-6 rounded-lg space-y-4">
                    <div className="space-y-4 text-red-800">
                      <p className="font-semibold text-red-900">
                        تنبيه هام: جميع الأعمال المنجزة تخضع لحقوق الملكية الفكرية الصارمة
                      </p>
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">حقوق العميل:</h4>
                          <ul className="space-y-2 text-sm lg:text-base">
                            <li>• ملكية كاملة للعمل النهائي المسلم</li>
                            <li>• حق الاستخدام والنشر والتوزيع</li>
                            <li>• حق التعديل والتطوير اللاحق</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">حقوق الوكالة:</h4>
                          <ul className="space-y-2 text-sm lg:text-base">
                            <li>• حماية المنهجيات والأساليب المطورة</li>
                            <li>• الحق في عرض العمل كنموذج (بعد إذن العميل)</li>
                            <li>• حماية الهوية التجارية والعلامة</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* سياسة الإلغاء والاسترداد */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary">سياسة الإلغاء والاسترداد</h3>
                  <div className="space-y-4">
                    <div className="bg-muted/20 p-6 rounded-lg">
                      <div className="grid lg:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-6 h-6" />
                          </div>
                          <h4 className="font-semibold text-green-700 mb-2">قبل البدء</h4>
                          <p className="text-sm text-green-600">استرداد كامل 100%</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <AlertTriangle className="w-6 h-6" />
                          </div>
                          <h4 className="font-semibold text-amber-700 mb-2">أثناء العمل</h4>
                          <p className="text-sm text-amber-600">استرداد جزئي حسب التقدم</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <AlertTriangle className="w-6 h-6" />
                          </div>
                          <h4 className="font-semibold text-red-700 mb-2">بعد التسليم</h4>
                          <p className="text-sm text-red-600">لا يوجد استرداد إلا لأسباب فنية</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* المسؤولية والضمانات */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary">المسؤولية والضمانات</h3>
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-4">ضماناتنا الشاملة:</h4>
                      <div className="grid lg:grid-cols-2 gap-4">
                        <ul className="space-y-2 text-blue-700 text-sm lg:text-base">
                          <li>• ضمان جودة الأعمال الأكاديمية لمدة سنة كاملة</li>
                          <li>• ضمان دقة الترجمة والمراجعة المجانية</li>
                          <li>• ضمان السرية التامة والحماية الكاملة</li>
                        </ul>
                        <ul className="space-y-2 text-blue-700 text-sm lg:text-base">
                          <li>• ضمان الالتزام بالمعايير الأكاديمية الدولية</li>
                          <li>• ضمان الأصالة ومكافحة الانتحال</li>
                          <li>• ضمان الدعم الفني المستمر</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
                      <h4 className="font-semibold text-amber-800 mb-4">حدود المسؤولية:</h4>
                      <p className="text-amber-700 text-sm lg:text-base leading-relaxed">
                        مسؤوليتنا محدودة بقيمة الخدمة المقدمة. لا نتحمل مسؤولية الأضرار غير المباشرة أو العواقب الناتجة عن استخدام العمل المسلم في سياقات لم نُبلغ بها مسبقاً.
                      </p>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* حل النزاعات */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary">آلية حل النزاعات</h3>
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-6 rounded-lg">
                    <div className="space-y-4">
                      <p className="font-semibold text-purple-800">منهجية الحل المرحلية:</p>
                      <div className="grid lg:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-purple-600 font-bold text-lg">المرحلة 1</div>
                          <p className="text-sm text-purple-700 mt-2">التفاوض المباشر والودي</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-purple-600 font-bold text-lg">المرحلة 2</div>
                          <p className="text-sm text-purple-700 mt-2">الوساطة المهنية المتخصصة</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-purple-600 font-bold text-lg">المرحلة 3</div>
                          <p className="text-sm text-purple-700 mt-2">التحكيم التجاري المعتمد</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* أحكام ختامية */}
                <motion.section variants={itemVariants} className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg border border-primary/20">
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary">الأحكام الختامية والتعديلات</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-primary">سريان الشروط:</h4>
                        <ul className="space-y-2 text-sm lg:text-base">
                          <li>• تسري من لحظة قبول العميل لعرض الخدمة</li>
                          <li>• تستمر طوال فترة تقديم الخدمة وما بعدها</li>
                          <li>• تنطبق على جميع الخدمات المقدمة</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-primary">التعديلات والتحديثات:</h4>
                        <ul className="space-y-2 text-sm lg:text-base">
                          <li>• نحتفظ بحق تعديل الشروط مع إشعار مسبق 30 يوماً</li>
                          <li>• التحديثات الجوهرية تتطلب موافقة صريحة</li>
                          <li>• النسخة الحديثة متاحة دائماً على موقعنا</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-primary/10 rounded-lg text-center">
                      <p className="font-semibold text-primary text-lg">
                        بقبولك لهذه الشروط، فإنك تؤكد فهمك الكامل والتزامك بجميع البنود المذكورة
                      </p>
                      <p className="text-sm mt-2 text-muted-foreground">
                        <strong>تاريخ آخر تحديث:</strong> {new Date().toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                </motion.section>

              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="text-center mt-8 space-y-4" variants={itemVariants}>
            <p className="text-sm lg:text-base text-muted-foreground">
              للاستفسارات التفصيلية حول الشروط والأحكام أو لطلب توضيحات إضافية
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-primary">
              <span>📧 info@masteredupath.com</span>
              <span>📞 0559600824</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfService;