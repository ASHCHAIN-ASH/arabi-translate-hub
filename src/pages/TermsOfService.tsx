import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from "@/components/Header";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";

const TermsOfService = () => {
  const downloadTerms = () => {
    const element = document.createElement('a');
    const file = new Blob([document.getElementById('terms-content')?.innerText || ''], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'شروط-الخدمة.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20" dir="rtl">
      
      {/* Working Hours Banner */}
      <WorkingHoursBannerRTL />
      
      {/* Header */}
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              الشروط والأحكام
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اقرأ بعناية شروط وأحكام استخدام خدمات الترجمة المهنية
            </p>
            <Button 
              onClick={downloadTerms}
              variant="outline" 
              className="mt-4"
            >
              <Download className="w-4 h-4 mr-2" />
              تحميل الشروط
            </Button>
          </div>

          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl text-primary">شروط استخدام خدمات الترجمة</CardTitle>
            </CardHeader>
            <CardContent id="terms-content" className="space-y-8 text-right">
              
              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">1. تعريفات أساسية</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong>الشركة:</strong> مركز الترجمة المهنية المتخصص في خدمات الترجمة المعتمدة</p>
                  <p><strong>العميل:</strong> الشخص أو الجهة التي تطلب خدمات الترجمة</p>
                  <p><strong>الخدمة:</strong> جميع أنواع خدمات الترجمة المقدمة من الشركة</p>
                  <p><strong>المترجم:</strong> المختص المعتمد لدى الشركة لتقديم خدمات الترجمة</p>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">2. نطاق الخدمات</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>تشمل خدماتنا الترجمة في المجالات التالية:</p>
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>الترجمة القانونية والمحلفة</li>
                    <li>الترجمة الطبية والصيدلانية</li>
                    <li>الترجمة التقنية والهندسية</li>
                    <li>الترجمة الأكاديمية والبحثية</li>
                    <li>الترجمة التجارية والمالية</li>
                    <li>الترجمة الأدبية والإعلامية</li>
                    <li>الترجمة الفورية والصوتية</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">3. التزامات العميل</h3>
                <div className="space-y-3 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>تقديم النصوص والوثائق بجودة واضحة ومقروءة</li>
                    <li>توضيح الهدف من الترجمة والجمهور المستهدف</li>
                    <li>تحديد المواعيد النهائية بوضوح ودقة</li>
                    <li>دفع الرسوم المتفق عليها في المواعيد المحددة</li>
                    <li>توفير أي مراجع أو مصطلحات خاصة مطلوبة</li>
                    <li>الالتزام بسرية المعلومات المتبادلة</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">4. التزامات الشركة</h3>
                <div className="space-y-3 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>تقديم ترجمة دقيقة ومهنية وفقاً للمعايير المتفق عليها</li>
                    <li>الالتزام بالمواعيد المحددة لتسليم العمل</li>
                    <li>ضمان سرية جميع المعلومات والوثائق</li>
                    <li>توفير مراجعة وتدقيق للترجمة قبل التسليم</li>
                    <li>تقديم الدعم الفني والاستشارات اللغوية</li>
                    <li>ضمان جودة الترجمة وإمكانية المراجعة عند الحاجة</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">5. الرسوم والدفع</h3>
                <div className="space-y-3 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>يتم تحديد الرسوم بناءً على نوع الترجمة وحجم النص وصعوبة المحتوى</li>
                    <li>يُطلب دفع 50% مقدماً للمشاريع الكبيرة</li>
                    <li>تستحق الرسوم كاملة عند تسليم العمل المكتمل</li>
                    <li>تطبق رسوم إضافية للخدمات العاجلة (أقل من 24 ساعة)</li>
                    <li>في حالة التأخير في الدفع، قد تطبق رسوم تأخير</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">6. ضمانات الجودة</h3>
                <div className="space-y-3 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>نضمن دقة الترجمة وفقاً للمعايير المهنية المعتمدة</li>
                    <li>حق العميل في طلب مراجعة مجانية خلال 7 أيام من التسليم</li>
                    <li>في حالة وجود أخطاء مؤثرة، نتعهد بالتصحيح مجاناً</li>
                    <li>نوفر شهادة معتمدة للترجمات الرسمية عند الطلب</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">7. السرية وحماية البيانات</h3>
                <div className="space-y-3 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>نلتزم بالحفاظ على سرية جميع المعلومات والوثائق</li>
                    <li>لا نشارك المحتوى مع أطراف ثالثة دون موافقة خطية</li>
                    <li>نستخدم أنظمة حماية متقدمة لأمان البيانات</li>
                    <li>يحق للعميل طلب حذف جميع بياناته بعد انتهاء الخدمة</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">8. إلغاء الخدمة</h3>
                <div className="space-y-3 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>يحق للعميل إلغاء الطلب قبل بداية العمل مع استرداد كامل</li>
                    <li>في حالة الإلغاء بعد بداية العمل، يُحتسب مقابل العمل المنجز</li>
                    <li>للإلغاءات العاجلة، قد تطبق رسوم إضافية</li>
                    <li>نحتفظ بحق إلغاء الخدمة في حالة مخالفة الشروط</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">9. حل النزاعات</h3>
                <div className="space-y-3 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>نسعى لحل أي نزاع بالتفاوض المباشر أولاً</li>
                    <li>في حالة عدم التوصل لحل، يُرجع للتحكيم التجاري</li>
                    <li>تخضع هذه الشروط لقوانين الدولة المحلية</li>
                    <li>المحاكم المحلية مختصة بنظر أي نزاع قانوني</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 text-primary">10. أحكام عامة</h3>
                <div className="space-y-3 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2 mr-4">
                    <li>تسري هذه الشروط من تاريخ قبول العميل للخدمة</li>
                    <li>نحتفظ بحق تعديل الشروط مع إشعار مسبق</li>
                    <li>في حالة بطلان بند معين، تبقى باقي الشروط سارية</li>
                    <li>تُعتبر هذه الشروط جزءاً لا يتجزأ من عقد الخدمة</li>
                  </ul>
                </div>
              </section>

            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              للاستفسارات حول الشروط والأحكام، يرجى التواصل معنا
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;