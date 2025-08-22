import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
}

const AnimatedCounter = ({ 
  end, 
  duration = 2, 
  delay = 0, 
  suffix = "", 
  prefix = "" 
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasStarted(true);
      let start = 0;
      const increment = end / (duration * 60); // 60fps
      
      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);

      return () => clearInterval(counter);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [end, duration, delay]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K";
    }
    return num.toString();
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: hasStarted ? 1 : 0, 
        scale: hasStarted ? 1 : 0.5 
      }}
      transition={{ duration: 0.5 }}
      className="font-bold"
    >
      {prefix}{formatNumber(count)}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter;