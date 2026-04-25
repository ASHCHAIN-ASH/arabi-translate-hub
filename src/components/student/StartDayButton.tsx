import { motion } from 'framer-motion';
import { Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StartDayButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="relative"
    >
      <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-l from-amber-400/40 via-rose-400/40 to-violet-500/40 blur-lg" />
      <Button
        onClick={onClick}
        disabled={disabled}
        className="relative h-12 rounded-2xl bg-gradient-to-l from-amber-400 via-rose-500 to-violet-600 px-6 font-bold text-white shadow-xl shadow-rose-500/30"
      >
        <Sun className="me-2 h-5 w-5" />
        ابدأ يومك
      </Button>
    </motion.div>
  );
}
