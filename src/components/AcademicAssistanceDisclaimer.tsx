import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AcademicAssistanceDisclaimerProps {
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * تنبيه قانوني موحّد يُذكّر العميل بأن جميع الخدمات تُقدَّم لأغراض
 * المساعدة الأكاديمية والإرشاد العلمي فقط، وأن المحتوى يُستخدم كمرجع
 * أو دليل إرشادي وفق سياسات الجامعة والنزاهة الأكاديمية.
 */
export const AcademicAssistanceDisclaimer: React.FC<AcademicAssistanceDisclaimerProps> = ({
  className,
  variant = 'default',
}) => {
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-foreground/80',
          className
        )}
        dir="rtl"
      >
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
        <p className="leading-relaxed">
          جميع خدماتنا تُقدَّم لأغراض <strong>المساعدة الأكاديمية والإرشاد العلمي</strong> فقط، ويلتزم العميل
          باستخدام المحتوى كمرجع أو دليل إرشادي بما يتوافق مع سياسات جامعته ومعايير النزاهة الأكاديمية.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-5 shadow-sm',
        className
      )}
      dir="rtl"
      role="note"
      aria-label="تنبيه أكاديمي"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
          <ShieldCheck className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-1 space-y-1.5">
          <h4 className="text-sm font-bold text-foreground">📌 تنبيه أكاديمي مهم</h4>
          <p className="text-sm leading-relaxed text-foreground/80">
            جميع خدماتنا تُقدَّم لأغراض <strong>المساعدة الأكاديمية والإرشاد العلمي والدعم البحثي</strong> فقط.
            يلتزم العميل باستخدام المحتوى المُسلَّم كـ <strong>مرجع علمي أو دليل إرشادي</strong> لتطوير عمله الخاص،
            بما يتوافق مع سياسات جامعته ومعايير النزاهة الأكاديمية.
          </p>
          <p className="text-xs text-muted-foreground">
            نؤمن بأن دورنا هو دعم رحلتك التعليمية وتعزيز مهاراتك البحثية، لا الاستعاضة عنك.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcademicAssistanceDisclaimer;
