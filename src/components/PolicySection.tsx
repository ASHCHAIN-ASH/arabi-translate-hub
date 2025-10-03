import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface PolicySectionProps {
  id: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
  variant?: 'default' | 'warning' | 'info';
}

export const PolicySection = ({ 
  id, 
  icon, 
  title, 
  children, 
  variant = 'default' 
}: PolicySectionProps) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'warning':
        return 'border-r-amber-500';
      case 'info':
        return 'border-r-blue-500';
      default:
        return 'border-r-primary';
    }
  };

  const getBgGradient = () => {
    switch (variant) {
      case 'warning':
        return 'from-amber-50/50 dark:from-amber-950/20';
      case 'info':
        return 'from-blue-50/50 dark:from-blue-950/20';
      default:
        return 'from-primary/5';
    }
  };

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-24"
    >
      <Card className={`border-r-4 ${getBorderColor()} bg-gradient-to-l ${getBgGradient()} to-transparent`}>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl lg:text-2xl font-bold text-foreground flex items-center gap-3">
            {icon}
            {title}
          </h3>
          <div className="text-muted-foreground leading-relaxed">
            {children}
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
};
