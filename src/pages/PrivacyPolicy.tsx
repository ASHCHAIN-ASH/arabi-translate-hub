import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, Shield, Lock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  const downloadPrivacyPolicy = () => {
    const element = document.createElement('a');
    const file = new Blob([document.getElementById('privacy-content')?.innerText || ''], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'اتفاقية-السرية.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              اتفاقية السرية وحماية البيانات
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              التزامنا الكامل بحماية خصوصيتك وضمان سرية معلوماتك
            </p>
            <Button 
              onClick={downloadPrivacyPolicy}
              variant="outline" 
              className="mt-4"
            >
              <Download className="w-4 h-4 mr-2" />
              تحميل اتفاقية السرية
            </Button>
          </div>

          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl text-primary">سياسة الخصوصية واتفاقية السرية</CardTitle>
            </CardHeader>
            <CardContent id="privacy-content" className="space-y-8 text-right">
              
              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  1. التزامنا بالسرية
                </h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    نتعهد بالحفاظ على السرية التامة لجميع المعلومات والوثائق والبيانات 
                    التي نحصل عليها من عملائنا في إطار تقديم خدمات الترجمة.
                  </p>
                  <p>
                    هذا التعهد يشمل جميع أشكال المعلومات: المكتوبة، الصوتية، المرئية، 
                    الرقمية، وأي بيانات أخرى قد نطلع عليها.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  2. أنواع البيانات التي نجمعها
                </h3>
                <div className="space-y-3 text-muted-foreground">
                  <h4 className="font-semibold text-foreground">معلومات شخصية:</h4>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>الاسم الكامل ومعلومات الاتصال</li>
                    <li>عنوان البريد الإلكتروني ورقم الهاتف</li>
                    <li>العنوان وبيانات الفوترة</li>
                    <li>معلومات الشركة أو المؤسسة عند الاقتضاء</li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-4">محتوى الترجمة:</h4>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>النصوص والوثائق المراد ترجمتها</li>
                    <li>الملفات الصوتية والمرئية</li>
                    <li>المراجع والمصطلحات الخاصة</li>
                    <li>أي معلومات تقنية أو متخصصة</li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-4">بيانات تقنية:</h4>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>عنوان IP ومعلومات الجهاز</li>
                    <li>بيانات استخدام الموقع الإلكتروني</li>
                    <li>تفضيلات اللغة والخدمات</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">3. كيفية استخدام البيانات</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>نستخدم المعلومات المجمعة حصرياً للأغراض التالية:</p>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>تقديم خدمات الترجمة بأعلى جودة ممكنة</li>
                    <li>التواصل مع العملاء حول تفاصيل المشاريع</li>
                    <li>إنجاز الأعمال وتسليمها في المواعيد المحددة</li>
                    <li>تحسين جودة الخدمات المقدمة</li>
                    <li>الامتثال للمتطلبات القانونية والتنظيمية</li>
                    <li>حفظ السجلات للمرجعية المستقبلية</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">4. حماية البيانات والأمان</h3>
                <div className="space-y-3 text-muted-foreground">
                  <h4 className="font-semibold text-foreground">تدابير الحماية التقنية:</h4>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>تشفير جميع البيانات أثناء النقل والتخزين</li>
                    <li>استخدام خوادم آمنة مع حماية متعددة الطبقات</li>
                    <li>نسخ احتياطية منتظمة ومؤمنة</li>
                    <li>مراقبة مستمرة للأنشطة المشبوهة</li>
                    <li>تحديثات أمنية دورية للأنظمة</li>
                  </ul>

                  <h4 className="font-semibold text-foreground mt-4">تدابير الحماية الإدارية:</h4>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>تدريب الموظفين على أهمية السرية</li>
                    <li>توقيع اتفاقيات سرية مع جميع العاملين</li>
                    <li>منح الوصول للبيانات حسب الحاجة فقط</li>
                    <li>مراجعة دورية لسياسات الأمان</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">5. مشاركة المعلومات مع الغير</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p className="font-semibold text-foreground">قاعدة عامة: لا نشارك معلوماتك مع أي طرف ثالث إلا في الحالات التالية:</p>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>بموافقة خطية صريحة منك</li>
                    <li>للامتثال للمتطلبات القانونية الملزمة</li>
                    <li>لحماية حقوقنا القانونية المشروعة</li>
                    <li>مع مترجمين معتمدين ملزمين باتفاقية سرية</li>
                  </ul>
                  
                  <div className="bg-muted/30 p-4 rounded-lg mt-4">
                    <p className="font-semibold text-foreground">تعهد خاص:</p>
                    <p>
                      نتعهد بعدم استخدام أي محتوى مترجم لأغراض تجارية أو تسويقية أو بحثية 
                      دون موافقة صريحة من العميل.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">6. حقوقك في البيانات</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>لك الحق الكامل في:</p>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li><strong>الوصول:</strong> طلب نسخة من جميع بياناتك لدينا</li>
                    <li><strong>التصحيح:</strong> تحديث أو تصحيح معلوماتك الشخصية</li>
                    <li><strong>الحذف:</strong> طلب حذف بياناتك نهائياً من أنظمتنا</li>
                    <li><strong>التقييد:</strong> تقييد معالجة بياناتك لأغراض محددة</li>
                    <li><strong>النقل:</strong> الحصول على بياناتك بصيغة قابلة للقراءة</li>
                    <li><strong>الاعتراض:</strong> الاعتراض على معالجة بياناتك</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">7. مدة الاحتفاظ بالبيانات</h3>
                <div className="space-y-3 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li><strong>البيانات الشخصية:</strong> نحتفظ بها طوال فترة العلاقة التجارية + 7 سنوات للأغراض القانونية</li>
                    <li><strong>محتوى الترجمة:</strong> يُحذف تلقائياً بعد 30 يوماً من التسليم (ما لم يطلب العميل خلاف ذلك)</li>
                    <li><strong>السجلات المالية:</strong> 10 سنوات وفقاً للمتطلبات الضريبية</li>
                    <li><strong>سجلات التواصل:</strong> 3 سنوات لأغراض خدمة العملاء</li>
                  </ul>
                  
                  <div className="bg-muted/30 p-4 rounded-lg mt-4">
                    <p className="font-semibold text-foreground">إمكانية الحذف المبكر:</p>
                    <p>
                      يمكنك طلب حذف جميع بياناتك في أي وقت، وسنقوم بذلك خلال 30 يوماً 
                      (مع الاحتفاظ فقط بما هو مطلوب قانونياً).
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">8. استخدام الكوكيز وتقنيات التتبع</h3>
                <div className="space-y-3 text-muted-foreground">
                  <h4 className="font-semibold text-foreground">أنواع الكوكيز المستخدمة:</h4>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li><strong>كوكيز أساسية:</strong> ضرورية لتشغيل الموقع</li>
                    <li><strong>كوكيز الأداء:</strong> لتحسين تجربة المستخدم</li>
                    <li><strong>كوكيز التفضيلات:</strong> لحفظ إعداداتك</li>
                  </ul>
                  <p>يمكنك التحكم في الكوكيز من إعدادات متصفحك.</p>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">9. التحديثات على سياسة الخصوصية</h3>
                <div className="space-y-3 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>نراجع هذه السياسة بانتظام لضمان فعاليتها</li>
                    <li>سنشعرك بأي تغييرات جوهرية قبل 30 يوماً من تطبيقها</li>
                    <li>التحديثات الطفيفة ستُنشر على الموقع مباشرة</li>
                    <li>استمرار استخدام خدماتنا يعني موافقتك على التحديثات</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">10. التواصل والشكاوى</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>لأي استفسارات حول الخصوصية أو للإبلاغ عن مخاوف أمنية:</p>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li><strong>مسؤول حماية البيانات:</strong> privacy@translation-center.com</li>
                    <li><strong>هاتف الطوارئ:</strong> متاح 24/7 للحالات العاجلة</li>
                    <li><strong>العنوان البريدي:</strong> قسم الخصوصية - مركز الترجمة</li>
                    <li><strong>وقت الاستجابة:</strong> خلال 48 ساعة كحد أقصى</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section className="bg-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-primary">تعهد نهائي</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p className="font-semibold text-foreground">
                    نتعهد أمام عملائنا الكرام بأن حماية خصوصيتكم وضمان سرية معلوماتكم 
                    هي أولويتنا القصوى.
                  </p>
                  <p>
                    هذا التعهد ليس مجرد التزام قانوني، بل قيمة أساسية في عملنا. 
                    نؤمن بأن الثقة هي أساس العلاقة المهنية الناجحة.
                  </p>
                  <p className="text-sm">
                    <strong>تاريخ آخر تحديث:</strong> {new Date().toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </section>

            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              للاستفسارات التفصيلية حول سياسة الخصوصية، نحن متاحون للتوضيح في أي وقت
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;