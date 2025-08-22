import { motion } from "framer-motion";
import AnimatedTranslationIcons from "./AnimatedTranslationIcons";

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* تدرج الخلفية الأساسي الاحترافي */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-accent opacity-95" />
      
      {/* طبقة إضافية للعمق */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
      
      {/* عناصر هندسية متحركة احترافية */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: `linear-gradient(45deg, 
                hsl(212, 100%, ${15 + i * 5}%), 
                hsl(43, 96%, ${50 + i * 5}%)
              )`,
              width: `${120 + i * 60}px`,
              height: `${120 + i * 60}px`,
              left: `${10 + (i % 3) * 35}%`,
              top: `${20 + Math.floor(i / 3) * 30}%`,
              filter: 'blur(50px)',
              opacity: 0.08 + i * 0.02,
            }}
            animate={{
              x: [0, 80, -50, 0],
              y: [0, -60, 80, 0],
              scale: [1, 1.3, 0.9, 1],
              rotate: [0, 120, 240, 360],
            }}
            transition={{
              duration: 25 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* شبكة من النقاط المتحركة للترجمة */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-1 h-1 bg-secondary/30 rounded-full shadow-lg"
            style={{
              left: `${5 + (i % 5) * 22}%`,
              top: `${15 + Math.floor(i / 5) * 20}%`,
            }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 2, 1],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* موجات متحركة للتكنولوجيا */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="absolute inset-0 border border-secondary/20 rounded-full"
            style={{
              width: `${400 + i * 300}px`,
              height: `${400 + i * 300}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [0.3, 1.5, 0.3],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              delay: i * 3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* أيقونات الترجمة المتحركة */}
      <AnimatedTranslationIcons />
    </div>
  );
};

export default AnimatedBackground;