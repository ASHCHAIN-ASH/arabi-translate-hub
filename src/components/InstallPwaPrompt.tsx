import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'pwa_install_dismissed_at';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * شريط تثبيت التطبيق على الجوال — يظهر تلقائياً عبر beforeinstallprompt.
 * مخفي في:
 *  - بيئة المعاينة Lovable (iframe)
 *  - عند رفض المستخدم خلال آخر 7 أيام
 *  - إذا كان مثبّتاً مسبقاً (display-mode: standalone)
 */
export const InstallPwaPrompt = () => {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // لا تظهر داخل iframe (معاينة Lovable)
    const isInIframe = window.self !== window.top;
    if (isInIframe) return;

    // لا تظهر إذا كان مثبتاً
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // احترام رفض المستخدم لمدة 7 أيام
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed && Date.now() - parseInt(dismissed) < DISMISS_DURATION_MS) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!event) return;
    await event.prompt();
    await event.userChoice;
    setShow(false);
    setEvent(null);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md"
        >
          <Card className="p-4 shadow-2xl border-primary/20 bg-card/95 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 rounded-xl p-2.5 shrink-0">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm">ثبّت التطبيق على جوالك</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  وصول أسرع، إشعارات فورية، تجربة أفضل.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={install} className="gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    تثبيت
                  </Button>
                  <Button size="sm" variant="ghost" onClick={dismiss}>
                    لاحقاً
                  </Button>
                </div>
              </div>
              <button
                onClick={dismiss}
                aria-label="إغلاق"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPwaPrompt;
