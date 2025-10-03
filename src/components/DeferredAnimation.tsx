import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DeferredAnimationProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const DeferredAnimation = ({ 
  children, 
  delay = 100, 
  className = "" 
}: DeferredAnimationProps) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!shouldRender) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
