import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarSpec = {
  size: string;
  color: string;
  top: string;
  left: string;
  duration: number;
  delay: number;
};

const STARS: StarSpec[] = [
  { size: "h-2.5 w-2.5", color: "text-warning", top: "0px", left: "1px", duration: 1.7, delay: 0 },
  { size: "h-1.5 w-1.5", color: "text-deep-violet-foreground", top: "7px", left: "9px", duration: 1.3, delay: 0.35 },
  { size: "h-2 w-2", color: "text-deep-violet-foreground/80", top: "2px", left: "15px", duration: 2.1, delay: 0.7 },
];

/**
 * مجموعة نجوم صغيرة متلألئة — تُستخدم بدلًا من رمز الهدية داخل الشريط الإعلاني.
 * تحترم إعداد «تقليل الحركة» في نظام المستخدم.
 */
export function TwinklingStars({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-block h-3.5 w-5 align-[-2px] mr-1.5 sm:mr-2",
        className,
      )}
    >
      {STARS.map((star, index) => (
        <motion.span
          key={index}
          className="absolute"
          style={{ top: star.top, left: star.left }}
          animate={
            reduceMotion
              ? { opacity: 0.9 }
              : {
                  opacity: [0.25, 1, 0.25],
                  scale: [0.7, 1.2, 0.7],
                  rotate: [0, 90, 0],
                }
          }
          transition={
            reduceMotion
              ? { duration: 0.2 }
              : {
                  duration: star.duration,
                  delay: star.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          <Star className={cn(star.size, star.color, "fill-current")} />
        </motion.span>
      ))}
    </span>
  );
}
