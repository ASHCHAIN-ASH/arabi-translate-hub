import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  /** يفعّل ميل ثلاثي الأبعاد عند تحريك الفأرة */
  tilt?: boolean;
  /** يفعّل تأثير بريق مرور عند الـ hover */
  shine?: boolean;
  /** عرض شبكة منقطة في الخلفية */
  pattern?: boolean;
  /** لون التوهج الخلفي (hsl variable name، مثلاً "primary") */
  glow?: string;
  delay?: number;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className,
  tilt = true,
  shine = true,
  pattern = false,
  glow,
  delay = 0,
  ...props
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={tilt ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      className={cn('bento-card-3d group', shine && 'bento-shine', className)}
      {...(props as any)}
    >
      {pattern && <div className="absolute inset-0 bento-grid-pattern opacity-50 pointer-events-none" />}
      {glow && (
        <div
          aria-hidden
          className="bento-glow"
          style={{
            background: `hsl(var(--${glow}) / 0.35)`,
            width: '60%', height: '60%',
            top: '-20%', insetInlineEnd: '-20%',
          }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};
