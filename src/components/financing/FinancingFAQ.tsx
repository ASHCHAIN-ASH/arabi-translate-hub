import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    q: 'هل التمويل به فوائد ربوية؟',
    a: 'لا. تمويل Master PayLater خالٍ تمامًا من الفوائد (APR 0%). تسدد المبلغ الأصلي فقط بدون أي رسوم إضافية أو خفية. النظام متوافق مع أحكام الشريعة الإسلامية.',
  },
  {
    q: 'هل أستلم المبلغ نقدًا في حسابي البنكي؟',
    a: 'لا. التمويل ليس تمويلًا نقديًا — هو رصيد داخلي يُضاف إلى محفظتك داخل المنصة بعد الموافقة، ويُستخدم فقط في سداد خدمات منصة ماستر (الترجمة، النشر، تحليل البيانات، إلخ).',
  },
  {
    q: 'ما هي شروط الأهلية للحصول على التمويل؟',
    a: 'يجب أن تكون سعودي الجنسية أو مقيمًا نظاميًا، وعمرك 18 سنة فأكثر، ولديك مصدر دخل ثابت موثّق، وحساب بنكي نشط باسمك. للطلبات التي تتجاوز 25,000 ر.س يُطلب كفيل غارم.',
  },
  {
    q: 'كم تستغرق الموافقة على الطلب؟',
    a: 'محرك التقييم الائتماني يُصدر قراره الأولي خلال دقائق من اكتمال المستندات. الموافقة النهائية تتم خلال 24 ساعة عمل كحد أقصى.',
  },
  {
    q: 'ماذا يحدث إذا تأخرت في سداد قسط؟',
    a: 'لديك مهلة سماح 24 ساعة بعد تاريخ الاستحقاق. بعدها يُرسل إنذار رسمي ويتم تجميد خدماتك على المنصة. التأخر المتكرر يؤدي لإحالة الملف لمحكمة التنفيذ بقوة السند التنفيذي، مع تحمّل أتعاب محاماة 5,000 ر.س.',
  },
  {
    q: 'هل يمكنني السداد المبكر؟',
    a: 'نعم، يمكنك سداد كامل المبلغ المتبقي في أي وقت بدون أي رسوم إضافية أو غرامات سداد مبكر. تواصل مع فريق المتابعة لتسوية الحساب.',
  },
  {
    q: 'هل بياناتي ومستنداتي محمية؟',
    a: 'نعم بالتأكيد. جميع البيانات مشفّرة بـ TLS 1.3 ومحفوظة وفق أعلى معايير حماية البيانات. لا نشارك بياناتك مع أي طرف ثالث، ولديك حق الوصول والحذف وفق النظام.',
  },
  {
    q: 'هل يؤثر التمويل على سجلّي الائتماني (سمة)؟',
    a: 'في الحالات الطبيعية لا يتم الإبلاغ. لكن في حالات التعثر الجسيم وإحالة الملف لمحكمة التنفيذ، يتم تسجيل ذلك في سجلّك الائتماني لدى سمة وفق الأنظمة المعمول بها.',
  },
  {
    q: 'هل التوقيع الرقمي على العقد ملزم قانونًا؟',
    a: 'نعم. التوقيع الإلكتروني له نفس حجّية التوقيع اليدوي بموجب نظام المعاملات الإلكترونية السعودي. يتم حفظ العقد بـ Hash SHA-256 وسجلّ كامل بالعنوان الرقمي ووقت التوقيع.',
  },
  {
    q: 'كيف أدفع الدفعة الأولى؟',
    a: 'تدفع 25% من إجمالي مبلغ التمويل عبر تحويل بنكي مباشر إلى حساب المنصة، أو ببطاقة الائتمان/مدى من خلال البوابة الآمنة. الرصيد يُفعّل فور تأكيد الدفع.',
  },
];

const FinancingFAQ: React.FC = () => {
  return (
    <section dir="rtl" className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2 px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 ring-1 ring-violet-500/30 text-[11px] sm:text-xs font-bold text-violet-700 dark:text-violet-300 uppercase tracking-widest">
          <HelpCircle className="h-3 w-3" />
          الأسئلة الشائعة
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">
          كل ما تحتاج معرفته
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          أجوبة واضحة ومباشرة لأكثر الأسئلة شيوعًا حول نظام التمويل الداخلي.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-3 sm:p-5 rounded-2xl border-border/60 shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/50 last:border-0">
                <AccordionTrigger className="text-right hover:no-underline py-4 group">
                  <div className="flex items-start gap-3 text-right flex-1">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/20 text-primary text-xs font-black flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <span className="font-bold text-sm sm:text-base leading-snug">{f.q}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed pr-10">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </motion.div>

      {/* Closing CTA strip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-0 rounded-2xl">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, hsl(220 70% 22%) 0%, hsl(280 60% 32%) 50%, hsl(190 70% 38%) 100%)',
            }}
          />
          <div className="relative p-5 sm:p-7 text-white text-center">
            <Sparkles className="h-6 w-6 mx-auto mb-2 text-amber-300" />
            <p className="text-sm sm:text-base font-semibold mb-1">عندك سؤال آخر؟</p>
            <p className="text-[12px] sm:text-sm text-white/80">
              تواصل مع فريق التمويل والائتمان والمتابعة عبر الواتساب —{' '}
              <a
                href="https://wa.me/966559600824"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold tabular-nums underline-offset-2 hover:underline"
              >
                +966 55 960 0824
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};

export default FinancingFAQ;
