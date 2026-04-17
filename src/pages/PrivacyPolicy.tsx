import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, Shield, Lock, Eye, AlertTriangle, CheckCircle, Database, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from "@/components/Header";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  const downloadPrivacyPolicy = () => {
    const element = document.createElement('a');
    const file = new Blob([document.getElementById('privacy-content')?.innerText || ''], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'سياسة-الخصوصية-وكالة-ماستر-ايدو-باث.txt';
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
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              سياسة الخصوصية والحماية
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              التزام وكالة ماستر إيدو باث الصارم بحماية خصوصيتكم وضمان أمان معلوماتكم الشخصية والأكاديمية
            </p>
            <Button 
              onClick={downloadPrivacyPolicy}
              variant="outline" 
              className="mt-6 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              تحميل سياسة الخصوصية
            </Button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="shadow-2xl border-0 bg-card/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardTitle className="text-2xl lg:text-3xl text-primary font-bold">
                  وكالة ماستر إيدو باث - سياسة الخصوصية الشاملة
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  نسخة محدثة اعتباراً من: {new Date().toLocaleDateString('ar-SA')}
                </p>
              </CardHeader>
              <CardContent id="privacy-content" className="space-y-6 lg:space-y-8 text-right p-6 lg:p-8">
                
                {/* التعهد الأساسي */}
                <motion.section variants={itemVariants} className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-lg border-r-4 border-primary">
                  <h3 className="text-xl lg:text-2xl font-bold mb-4 text-primary flex items-center gap-3">
                    <Lock className="w-6 h-6" />
                    تعهدنا الأساسي بالحماية الكاملة
                  </h3>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p className="font-semibold text-foreground text-lg">
                      في وكالة ماستر إيدو باث، نؤمن بأن حماية خصوصيتكم ليست مجرد التزام قانوني، بل قيمة أساسية في علاقتنا المهنية.
                    </p>
                    <div className="grid lg:grid-cols-3 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg text-center">
                        <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">حماية مطلقة</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">للبيانات الشخصية</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg text-center">
                        <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-green-800 dark:text-green-300">سرية تامة</p>
                        <p className="text-xs text-green-600 dark:text-green-400">للمحتوى الأكاديمي</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg text-center">
                        <UserCheck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-purple-800 dark:text-purple-300">شفافية كاملة</p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">في جميع العمليات</p>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* أنواع البيانات */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary flex items-center gap-3">
                    <Database className="w-6 h-6" />
                    أنواع البيانات والمعلومات التي نجمعها
                  </h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* البيانات الشخصية */}
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                      <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        المعلومات الشخصية والتعريفية
                      </h4>
                      <ul className="space-y-2 text-blue-700 text-sm lg:text-base">
                        <li>• الاسم الكامل والكنية واللقب العلمي</li>
                        <li>• عنوان البريد الإلكتروني الرسمي والبديل</li>
                        <li>• أرقام الهواتف (المحمول والثابت)</li>
                        <li>• العنوان البريدي الكامل</li>
                        <li>• معلومات الهوية للخدمات المعتمدة</li>
                        <li>• تفاصيل الانتساب الأكاديمي أو المؤسسي</li>
                        <li>• المؤهلات العلمية والدرجات الأكاديمية</li>
                      </ul>
                    </div>

                    {/* المحتوى الأكاديمي */}
                    <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                      <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        المحتوى الأكاديمي والبحثي
                      </h4>
                      <ul className="space-y-2 text-green-700 text-sm lg:text-base">
                        <li>• النصوص والوثائق المراد ترجمتها أو تحريرها</li>
                        <li>• البيانات البحثية والإحصائية</li>
                        <li>• المراجع والمصادر العلمية</li>
                        <li>• الملاحظات والتعليقات الشخصية</li>
                        <li>• الملفات الصوتية والمرئية التعليمية</li>
                        <li>• المخطوطات والأطروحات الأكاديمية</li>
                        <li>• البيانات التجريبية والنتائج العلمية</li>
                      </ul>
                    </div>

                    {/* البيانات التقنية */}
                    <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                      <h4 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        البيانات التقنية وبيانات الاستخدام
                      </h4>
                      <ul className="space-y-2 text-purple-700 text-sm lg:text-base">
                        <li>• عنوان IP والموقع الجغرافي التقريبي</li>
                        <li>• نوع الجهاز ونظام التشغيل المستخدم</li>
                        <li>• معلومات المتصفح والإضافات</li>
                        <li>• تاريخ ووقت الزيارات والتفاعلات</li>
                        <li>• صفحات الموقع المزارة ومدة البقاء</li>
                        <li>• تفضيلات اللغة والخدمات</li>
                        <li>• سجل التنزيلات والرفوعات</li>
                      </ul>
                    </div>

                    {/* البيانات المالية */}
                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
                      <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        المعلومات المالية والمحاسبية
                      </h4>
                      <ul className="space-y-2 text-amber-700 text-sm lg:text-base">
                        <li>• تفاصيل الفوترة والدفع (مشفرة)</li>
                        <li>• معلومات البطاقات الائتمانية (محمية)</li>
                        <li>• سجل المعاملات والدفعات</li>
                        <li>• بيانات الحسابات البنكية للتحويلات</li>
                        <li>• معلومات الضرائب والخصومات</li>
                        <li>• تاريخ الاشتراكات والعضويات</li>
                        <li>• الفواتير والإيصالات المالية</li>
                      </ul>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* أغراض الاستخدام */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary">الأغراض المحددة لاستخدام البيانات</h3>
                  <div className="space-y-6">
                    <div className="grid lg:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-blue-800 mb-4">الخدمات الأساسية</h4>
                        <ul className="space-y-2 text-blue-700 text-sm">
                          <li>• تقديم الخدمات التعليمية والأكاديمية</li>
                          <li>• إنجاز مشاريع الترجمة والتحرير</li>
                          <li>• التواصل حول تفاصيل المشاريع</li>
                          <li>• تسليم الأعمال في المواعيد المحددة</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                        <h4 className="font-bold text-green-800 mb-4">التطوير والتحسين</h4>
                        <ul className="space-y-2 text-green-700 text-sm">
                          <li>• تطوير جودة الخدمات المقدمة</li>
                          <li>• تخصيص الخدمات حسب احتياجات العملاء</li>
                          <li>• إجراء البحوث لتحسين العمليات</li>
                          <li>• تطوير أدوات وتقنيات جديدة</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                        <h4 className="font-bold text-purple-800 mb-4">الامتثال والحماية</h4>
                        <ul className="space-y-2 text-purple-700 text-sm">
                          <li>• الامتثال للمتطلبات القانونية</li>
                          <li>• حماية حقوق الملكية الفكرية</li>
                          <li>• منع الاستخدام غير المشروع</li>
                          <li>• ضمان أمان المعلومات</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* تدابير الحماية */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary">تدابير الحماية والأمان المتقدمة</h3>
                  
                  <div className="space-y-6">
                    {/* الحماية التقنية */}
                    <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                      <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        الحماية التقنية المتطورة
                      </h4>
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-red-700 mb-3">التشفير والحماية:</h5>
                          <ul className="space-y-2 text-red-600 text-sm lg:text-base">
                            <li>• تشفير AES-256 للبيانات الحساسة</li>
                            <li>• بروتوكولات SSL/TLS للنقل الآمن</li>
                            <li>• خوادم محمية بجدران نارية متطورة</li>
                            <li>• نسخ احتياطية مشفرة ومتعددة المواقع</li>
                            <li>• أنظمة كشف التسلل والحماية</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-red-700 mb-3">المراقبة والصيانة:</h5>
                          <ul className="space-y-2 text-red-600 text-sm lg:text-base">
                            <li>• مراقبة مستمرة 24/7 للأنشطة المشبوهة</li>
                            <li>• تحديثات أمنية دورية ومنتظمة</li>
                            <li>• اختبارات اختراق دورية</li>
                            <li>• سجلات مراجعة شاملة ومفصلة</li>
                            <li>• إجراءات استجابة سريعة للطوارئ</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* الحماية الإدارية */}
                    <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
                      <h4 className="font-bold text-indigo-800 mb-4 flex items-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        الحماية الإدارية والسياسات
                      </h4>
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-indigo-700 mb-3">سياسات الموظفين:</h5>
                          <ul className="space-y-2 text-indigo-600 text-sm lg:text-base">
                            <li>• تدريب شامل على أمان المعلومات</li>
                            <li>• اتفاقيات سرية ملزمة لجميع العاملين</li>
                            <li>• منح الوصول حسب الحاجة فقط</li>
                            <li>• مراجعة دورية لصلاحيات الوصول</li>
                            <li>• تتبع وتسجيل جميع عمليات الوصول</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-indigo-700 mb-3">الإجراءات الوقائية:</h5>
                          <ul className="space-y-2 text-indigo-600 text-sm lg:text-base">
                            <li>• فحص دوري للثغرات الأمنية</li>
                            <li>• خطط طوارئ للحوادث الأمنية</li>
                            <li>• مراجعة منتظمة لسياسات الخصوصية</li>
                            <li>• تقييم مخاطر شامل ودوري</li>
                            <li>• شراكات مع خبراء أمان معتمدين</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* مشاركة المعلومات */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                    سياسة مشاركة المعلومات مع الأطراف الثالثة
                  </h3>
                  
                  <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg space-y-6">
                    <div className="bg-red-100 border border-red-300 p-4 rounded-lg">
                      <p className="font-bold text-red-800 text-center text-lg mb-2">
                        🚫 مبدأ عدم المشاركة الأساسي
                      </p>
                      <p className="text-red-700 text-center">
                        نحن لا نبيع أو نؤجر أو نشارك معلوماتكم الشخصية مع أي طرف ثالث لأغراض تجارية أو تسويقية
                      </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-amber-800 mb-4">الحالات الاستثنائية للمشاركة:</h4>
                        <ul className="space-y-3 text-amber-700 text-sm lg:text-base">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                            <span><strong>بموافقة صريحة:</strong> فقط بعد الحصول على موافقة خطية منكم</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                            <span><strong>متطلبات قانونية:</strong> للامتثال لأوامر المحاكم أو القوانين الملزمة</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                            <span><strong>حماية الحقوق:</strong> لحماية حقوقنا القانونية أو سلامة المستخدمين</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-amber-800 mb-4">المتعاونون المعتمدون:</h4>
                        <ul className="space-y-3 text-amber-700 text-sm lg:text-base">
                          <li className="flex items-start gap-2">
                            <UserCheck className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                            <span><strong>المترجمون المعتمدون:</strong> ملزمون باتفاقيات سرية صارمة</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Lock className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" />
                            <span><strong>شركاء التقنية:</strong> لضمان أمان وسلامة النظام فقط</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Database className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                            <span><strong>مقدمو الخدمات:</strong> للدعم التقني والصيانة المحدودة</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-green-100 border border-green-300 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">📋 تعهد خاص بالمحتوى الأكاديمي:</h4>
                      <p className="text-green-700 text-sm lg:text-base">
                        نتعهد تعهداً قاطعاً بعدم استخدام أي محتوى أكاديمي أو بحثي لأغراض تجارية أو دراسات أو أبحاث داخلية دون موافقة صريحة ومكتوبة من العميل. 
                        جميع الأعمال الأكاديمية تبقى ملكاً خالصاً لأصحابها.
                      </p>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* حقوق البيانات */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary">حقوقكم الكاملة في بياناتكم</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                          <Eye className="w-5 h-5" />
                          حق الوصول والاطلاع
                        </h4>
                        <ul className="space-y-2 text-blue-700 text-sm lg:text-base">
                          <li>• الحصول على نسخة كاملة من بياناتكم</li>
                          <li>• معرفة كيفية استخدام معلوماتكم</li>
                          <li>• تتبع تاريخ المعالجة والتحديثات</li>
                          <li>• الاطلاع على سجل الوصول لبياناتكم</li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          حق التصحيح والتحديث
                        </h4>
                        <ul className="space-y-2 text-green-700 text-sm lg:text-base">
                          <li>• تصحيح أي معلومات خاطئة أو قديمة</li>
                          <li>• تحديث بياناتكم الشخصية والمهنية</li>
                          <li>• إضافة معلومات مفقودة أو ناقصة</li>
                          <li>• تعديل تفضيلات الخصوصية</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          حق الحذف والإزالة
                        </h4>
                        <ul className="space-y-2 text-red-700 text-sm lg:text-base">
                          <li>• طلب حذف جميع بياناتكم نهائياً</li>
                          <li>• إزالة بيانات محددة غير مرغوبة</li>
                          <li>• حذف سجل الأنشطة والتفاعلات</li>
                          <li>• ضمان عدم الاحتفاظ بنسخ احتياطية</li>
                        </ul>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                          <Database className="w-5 h-5" />
                          حق النقل والتحكم
                        </h4>
                        <ul className="space-y-2 text-purple-700 text-sm lg:text-base">
                          <li>• الحصول على بياناتكم بصيغة قابلة للقراءة</li>
                          <li>• نقل بياناتكم لمقدم خدمة آخر</li>
                          <li>• تقييد استخدام بيانات معينة</li>
                          <li>• الاعتراض على معالجة غير مرغوبة</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20">
                    <h4 className="font-bold text-primary text-center text-lg mb-3">
                      💡 كيفية ممارسة حقوقكم
                    </h4>
                    <div className="grid lg:grid-cols-3 gap-4 text-sm lg:text-base">
                      <div className="text-center">
                        <p className="font-semibold text-primary">الطريقة الأولى</p>
                        <p className="text-muted-foreground">إرسال طلب عبر البريد الإلكتروني</p>
                        <p className="text-xs text-primary">info@masteredupath.com</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-primary">الطريقة الثانية</p>
                        <p className="text-muted-foreground">التواصل الهاتفي المباشر</p>
                        <p className="text-xs text-primary">0559600824 / 0559600824</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-primary">الطريقة الثالثة</p>
                        <p className="text-muted-foreground">نموذج طلب عبر الموقع</p>
                        <p className="text-xs text-primary">متاح على مدار الساعة</p>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* مدة الاحتفاظ */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary">مدة الاحتفاظ بالبيانات وسياسة الحذف</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-3">📅 جدولة الاحتفاظ بالبيانات</h4>
                        <div className="space-y-3 text-blue-700 text-sm lg:text-base">
                          <div className="flex justify-between items-center">
                            <span>البيانات الشخصية:</span>
                            <span className="font-semibold">7 سنوات</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>المحتوى الأكاديمي:</span>
                            <span className="font-semibold">30 يوماً</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>السجلات المالية:</span>
                            <span className="font-semibold">10 سنوات</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>سجلات التواصل:</span>
                            <span className="font-semibold">3 سنوات</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>البيانات التقنية:</span>
                            <span className="font-semibold">سنة واحدة</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-3">🗑️ سياسة الحذف التلقائي</h4>
                        <ul className="space-y-2 text-green-700 text-sm lg:text-base">
                          <li>• حذف تلقائي للمحتوى بعد انتهاء المدة</li>
                          <li>• إشعارات مسبقة قبل الحذف بـ 30 يوماً</li>
                          <li>• إمكانية طلب تمديد فترة الاحتفاظ</li>
                          <li>• حذف آمن يضمن عدم الاستعادة</li>
                          <li>• تأكيدات خطية عند اكتمال الحذف</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-amber-50 border border-amber-200 p-6 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      استثناءات الاحتفاظ القانونية
                    </h4>
                    <p className="text-amber-700 text-sm lg:text-base leading-relaxed">
                      قد نضطر للاحتفاظ ببعض البيانات لفترات أطول للامتثال للمتطلبات القانونية أو التنظيمية، 
                      مثل قوانين الضرائب والمحاسبة، أو لحماية حقوقنا القانونية المشروعة. 
                      في جميع الحالات، سيتم إشعاركم بالأسباب والمدة الزمنية المطلوبة.
                    </p>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* الكوكيز وتقنيات التتبع */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary">استخدام الكوكيز وتقنيات التتبع</h3>
                  
                  <div className="grid lg:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-3">🔧 كوكيز أساسية</h4>
                      <p className="text-blue-700 text-sm mb-3">ضرورية لتشغيل الموقع الأساسي</p>
                      <ul className="space-y-1 text-blue-600 text-xs lg:text-sm">
                        <li>• تسجيل الدخول والجلسات</li>
                        <li>• حفظ إعدادات اللغة</li>
                        <li>• سلة التسوق والطلبات</li>
                        <li>• أمان المعاملات</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 p-5 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-3">📊 كوكيز الأداء</h4>
                      <p className="text-green-700 text-sm mb-3">لتحسين تجربة المستخدم</p>
                      <ul className="space-y-1 text-green-600 text-xs lg:text-sm">
                        <li>• قياس سرعة الموقع</li>
                        <li>• تحليل الصفحات الأكثر زيارة</li>
                        <li>• فهم سلوك المستخدمين</li>
                        <li>• اكتشاف الأخطاء التقنية</li>
                      </ul>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 p-5 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-3">⚙️ كوكيز التفضيلات</h4>
                      <p className="text-purple-700 text-sm mb-3">لحفظ إعداداتكم الشخصية</p>
                      <ul className="space-y-1 text-purple-600 text-xs lg:text-sm">
                        <li>• تخطيط الصفحة المفضل</li>
                        <li>• حجم النصوص والخطوط</li>
                        <li>• تفضيلات الإشعارات</li>
                        <li>• الخدمات المحفوظة</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 bg-muted/20 p-6 rounded-lg">
                    <h4 className="font-semibold text-primary mb-4">🎛️ التحكم في الكوكيز</h4>
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-muted-foreground mb-3">خيارات المتصفح:</h5>
                        <ul className="space-y-2 text-muted-foreground text-sm lg:text-base">
                          <li>• قبول أو رفض الكوكيز</li>
                          <li>• حذف الكوكيز الموجودة</li>
                          <li>• تنبيهات عند تعيين كوكيز جديدة</li>
                          <li>• إدارة كوكيز مواقع محددة</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-muted-foreground mb-3">لوحة التحكم بالموقع:</h5>
                        <ul className="space-y-2 text-muted-foreground text-sm lg:text-base">
                          <li>• إعدادات شخصية مفصلة</li>
                          <li>• اختيار أنواع الكوكيز المقبولة</li>
                          <li>• عرض البيانات المحفوظة</li>
                          <li>• تصدير أو حذف البيانات</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* التحديثات والتعديلات */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary">التحديثات والتعديلات على السياسة</h3>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 p-6 rounded-lg space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-indigo-800 mb-4">📋 سياسة المراجعة المنتظمة:</h4>
                        <ul className="space-y-2 text-indigo-700 text-sm lg:text-base">
                          <li>• مراجعة شاملة كل 6 أشهر</li>
                          <li>• تحديثات فورية عند تغيير القوانين</li>
                          <li>• مراجعة بناءً على تطوير الخدمات</li>
                          <li>• تقييم فعالية الإجراءات الحالية</li>
                          <li>• تحسين مستمر للحماية والأمان</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-indigo-800 mb-4">📢 إجراءات الإشعار:</h4>
                        <ul className="space-y-2 text-indigo-700 text-sm lg:text-base">
                          <li>• إشعار مسبق 30 يوماً للتغييرات الجوهرية</li>
                          <li>• إرسال رسائل إلكترونية تفصيلية</li>
                          <li>• نشر التحديثات على الموقع الرسمي</li>
                          <li>• إشعارات داخل حساباتكم الشخصية</li>
                          <li>• فترة تعليق مجانية للاعتراض</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-indigo-200">
                      <h4 className="font-semibold text-indigo-800 mb-3 text-center">🔄 أنواع التحديثات</h4>
                      <div className="grid lg:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-green-600 font-semibold">تحديثات طفيفة</div>
                          <p className="text-xs text-green-700 mt-1">تصحيحات لغوية، تحسينات في التنسيق</p>
                          <p className="text-xs text-green-600 mt-1">إشعار عبر الموقع</p>
                        </div>
                        <div>
                          <div className="text-amber-600 font-semibold">تحديثات متوسطة</div>
                          <p className="text-xs text-amber-700 mt-1">توضيحات إضافية، تحسين الإجراءات</p>
                          <p className="text-xs text-amber-600 mt-1">إشعار بالبريد الإلكتروني</p>
                        </div>
                        <div>
                          <div className="text-red-600 font-semibold">تحديثات جوهرية</div>
                          <p className="text-xs text-red-700 mt-1">تغيير في السياسات الأساسية</p>
                          <p className="text-xs text-red-600 mt-1">موافقة صريحة مطلوبة</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* التواصل والدعم */}
                <motion.section variants={itemVariants}>
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary">التواصل والدعم في شؤون الخصوصية</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        فريق حماية البيانات المتخصص
                      </h4>
                      <div className="space-y-3 text-blue-700 text-sm lg:text-base">
                        <div>
                          <p className="font-semibold">📧 البريد الإلكتروني المتخصص:</p>
                          <p className="text-blue-600">privacy@masteredupath.com</p>
                        </div>
                        <div>
                          <p className="font-semibold">📞 خط الطوارئ الأمني:</p>
                          <p className="text-blue-600">متاح 24/7 للحالات الحساسة</p>
                        </div>
                        <div>
                          <p className="font-semibold">⏱️ زمن الاستجابة المضمون:</p>
                          <p className="text-blue-600">خلال 24 ساعة كحد أقصى</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        الإبلاغ عن المخاوف الأمنية
                      </h4>
                      <div className="space-y-3 text-green-700 text-sm lg:text-base">
                        <div>
                          <p className="font-semibold">🚨 الحوادث الأمنية:</p>
                          <p className="text-green-600">تقرير فوري وشفاف خلال ساعتين</p>
                        </div>
                        <div>
                          <p className="font-semibold">🔍 الشكاوى والاستفسارات:</p>
                          <p className="text-green-600">نموذج مفصل على الموقع الرسمي</p>
                        </div>
                        <div>
                          <p className="font-semibold">📋 طلبات الحقوق:</p>
                          <p className="text-green-600">معالجة خلال 15 يوم عمل</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-6 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-4 text-center">📞 قنوات التواصل المباشر</h4>
                    <div className="grid lg:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-purple-600 font-semibold">الهاتف الأساسي</div>
                        <p className="text-sm text-purple-700">0559600824</p>
                        <p className="text-xs text-purple-600">9 ص - 9 م</p>
                      </div>
                      <div>
                        <div className="text-purple-600 font-semibold">الهاتف الثانوي</div>
                        <p className="text-sm text-purple-700">0559600824</p>
                        <p className="text-xs text-purple-600">متاح دائماً</p>
                      </div>
                      <div>
                        <div className="text-purple-600 font-semibold">الواتساب</div>
                        <p className="text-sm text-purple-700">نفس الأرقام</p>
                        <p className="text-xs text-purple-600">رد سريع</p>
                      </div>
                      <div>
                        <div className="text-purple-600 font-semibold">العنوان</div>
                        <p className="text-sm text-purple-700">المملكة العربية السعودية</p>
                        <p className="text-xs text-purple-600">موقع آمن</p>
                      </div>
                    </div>
                  </div>
                </motion.section>

                <Separator className="my-6" />

                {/* التعهد النهائي */}
                <motion.section variants={itemVariants} className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg border border-primary/20">
                  <h3 className="text-xl lg:text-2xl font-bold mb-6 text-primary text-center">تعهدنا النهائي والقاطع</h3>
                  <div className="space-y-6 text-center">
                    <div className="bg-white/50 p-6 rounded-lg">
                      <p className="font-bold text-primary text-lg lg:text-xl leading-relaxed">
                        نتعهد أمام عملائنا الكرام بأن حماية خصوصيتكم وضمان سرية معلوماتكم وأعمالكم الأكاديمية 
                        هي القيمة العليا والأولوية المطلقة في جميع عملياتنا.
                      </p>
                    </div>
                    
                    <div className="grid lg:grid-cols-3 gap-4">
                      <div className="bg-blue-100 p-4 rounded-lg">
                        <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="font-semibold text-blue-800">ضمان الحماية</p>
                        <p className="text-xs text-blue-600">حماية مطلقة لجميع البيانات</p>
                      </div>
                      <div className="bg-green-100 p-4 rounded-lg">
                        <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="font-semibold text-green-800">سرية كاملة</p>
                        <p className="text-xs text-green-600">عدم الكشف أو المشاركة</p>
                      </div>
                      <div className="bg-purple-100 p-4 rounded-lg">
                        <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <p className="font-semibold text-purple-800">شفافية مطلقة</p>
                        <p className="text-xs text-purple-600">وضوح في جميع العمليات</p>
                      </div>
                    </div>

                    <div className="bg-primary/10 p-4 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed">
                        هذا التعهد ليس مجرد التزام قانوني، بل منهج عمل وفلسفة مؤسسية. 
                        نؤمن بأن الثقة هي أساس العلاقة المهنية الناجحة، ونعمل باستمرار على تعزيز هذه الثقة 
                        من خلال أعلى معايير الحماية والشفافية.
                      </p>
                      <p className="text-sm mt-4 font-semibold text-primary">
                        <strong>تاريخ آخر تحديث:</strong> {new Date().toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                </motion.section>

              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="text-center mt-8 space-y-4" variants={itemVariants}>
            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
              للاستفسارات التفصيلية حول سياسة الخصوصية أو لطلب توضيحات إضافية حول حقوقكم في البيانات، 
              نحن متاحون للتوضيح والمساعدة في أي وقت
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-primary">
                <span>📧</span>
                <span>info@masteredupath.com</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <span>📞</span>
                <span>0559600824</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <span>📞</span>
                <span>0559600824</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;