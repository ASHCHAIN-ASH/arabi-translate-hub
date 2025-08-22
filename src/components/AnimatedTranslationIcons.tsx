import { motion } from "framer-motion";
import { 
  Languages, 
  Globe, 
  FileText, 
  MessageSquare, 
  Headphones,
  BookOpen,
  Mic,
  Monitor,
  Smartphone,
  Zap
} from "lucide-react";

const AnimatedTranslationIcons = () => {
  const icons = [
    { Icon: Languages, delay: 0, x: "10%", y: "15%" },
    { Icon: Globe, delay: 0.2, x: "80%", y: "20%" },
    { Icon: FileText, delay: 0.4, x: "15%", y: "70%" },
    { Icon: MessageSquare, delay: 0.6, x: "75%", y: "75%" },
    { Icon: Headphones, delay: 0.8, x: "50%", y: "25%" },
    { Icon: BookOpen, delay: 1, x: "25%", y: "50%" },
    { Icon: Mic, delay: 1.2, x: "70%", y: "45%" },
    { Icon: Monitor, delay: 1.4, x: "40%", y: "80%" },
    { Icon: Smartphone, delay: 1.6, x: "60%", y: "60%" },
    { Icon: Zap, delay: 1.8, x: "85%", y: "50%" }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {icons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute text-white/10"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8,
            delay: delay,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut"
          }}
        >
          <Icon className="h-8 w-8 md:h-12 md:w-12" />
        </motion.div>
      ))}

      {/* خطوط اتصال متحركة */}
      <svg 
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: -1 }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </linearGradient>
        </defs>
        
        {/* خطوط متحركة تربط بين الأيقونات */}
        <motion.line
          x1="10%" y1="15%" x2="80%" y2="20%"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        
        <motion.line
          x1="50%" y1="25%" x2="25%" y2="50%"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
        
        <motion.line
          x1="70%" y1="45%" x2="60%" y2="60%"
          stroke="url(#lineGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 3 }}
        />
      </svg>
    </div>
  );
};

export default AnimatedTranslationIcons;