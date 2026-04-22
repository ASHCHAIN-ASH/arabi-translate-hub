import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'show_login_welcome';

export const triggerLoginWelcome = (name?: string) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, name || '1');
  } catch {}
};

const LoginWelcomeOverlay = () => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    try {
      const flag = sessionStorage.getItem(STORAGE_KEY);
      if (flag) {
        setName(flag === '1' ? '' : flag);
        setVisible(true);
        sessionStorage.removeItem(STORAGE_KEY);
        const t = setTimeout(() => setVisible(false), 5000);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/60 backdrop-blur-sm pointer-events-none"
          dir="rtl"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 18, stiffness: 220 }}
            className="relative mx-4 max-w-md w-full rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 shadow-2xl text-primary-foreground overflow-hidden"
          >
            {/* Sparkles background */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 300 - 150,
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  delay: 0.3 + i * 0.15,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                style={{ left: '50%', top: '50%' }}
              >
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </motion.div>
            ))}

            <div className="relative flex flex-col items-center text-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur"
              >
                <CheckCircle2 className="h-12 w-12 text-white" strokeWidth={2.5} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-2"
              >
                <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
                  مرحباً بعودتك
                  <motion.span
                    animate={{ rotate: [0, 20, -10, 20, 0] }}
                    transition={{ duration: 1.2, delay: 0.8, repeat: 1 }}
                    style={{ display: 'inline-block', transformOrigin: '70% 70%' }}
                  >
                    👋
                  </motion.span>
                </h2>
                {name && (
                  <p className="text-xl font-semibold text-white/95">{name}</p>
                )}
                <p className="text-sm text-white/85">
                  تم تسجيل الدخول بنجاح
                </p>
              </motion.div>

              {/* Progress bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-1 bg-white/60 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginWelcomeOverlay;
