import { motion } from "framer-motion";
import { 
  BookOpen, 
  FileText, 
  Languages, 
  Globe, 
  MessageSquare,
  PenTool,
  Mic,
  Users,
  Award,
  Zap,
  Heart,
  Star
} from "lucide-react";

const StatsBackground = () => {
  // عناصر الترجمة المتطايرة
  const floatingElements = [
    { Icon: BookOpen, x: "10%", y: "20%", delay: 0, scale: 1 },
    { Icon: FileText, x: "85%", y: "15%", delay: 1, scale: 0.8 },
    { Icon: Languages, x: "15%", y: "70%", delay: 2, scale: 1.2 },
    { Icon: Globe, x: "80%", y: "65%", delay: 3, scale: 0.9 },
    { Icon: MessageSquare, x: "45%", y: "10%", delay: 4, scale: 1.1 },
    { Icon: PenTool, x: "25%", y: "45%", delay: 5, scale: 0.7 },
    { Icon: Mic, x: "75%", y: "35%", delay: 6, scale: 0.9 },
    { Icon: Users, x: "55%", y: "80%", delay: 7, scale: 1 },
    { Icon: Award, x: "90%", y: "45%", delay: 8, scale: 0.8 },
    { Icon: Zap, x: "35%", y: "25%", delay: 9, scale: 0.6 },
    { Icon: Heart, x: "65%", y: "20%", delay: 10, scale: 0.7 },
    { Icon: Star, x: "20%", y: "85%", delay: 11, scale: 0.9 }
  ];

  // أحرف عربية وإنجليزية متطايرة
  const floatingLetters = [
    { letter: "أ", x: "30%", y: "30%", delay: 0.5 },
    { letter: "A", x: "70%", y: "25%", delay: 1.5 },
    { letter: "ت", x: "40%", y: "60%", delay: 2.5 },
    { letter: "T", x: "60%", y: "55%", delay: 3.5 },
    { letter: "ن", x: "25%", y: "15%", delay: 4.5 },
    { letter: "N", x: "75%", y: "75%", delay: 5.5 },
    { letter: "ل", x: "50%", y: "40%", delay: 6.5 },
    { letter: "L", x: "85%", y: "30%", delay: 7.5 },
    { letter: "م", x: "15%", y: "55%", delay: 8.5 },
    { letter: "M", x: "95%", y: "20%", delay: 9.5 }
  ];

  // ملفات ووثائق متطايرة
  const documents = [
    { width: 60, height: 80, x: "20%", y: "35%", delay: 1, rotation: 15 },
    { width: 50, height: 70, x: "75%", y: "50%", delay: 3, rotation: -10 },
    { width: 40, height: 60, x: "45%", y: "70%", delay: 5, rotation: 25 },
    { width: 35, height: 50, x: "90%", y: "60%", delay: 7, rotation: -20 },
    { width: 45, height: 65, x: "30%", y: "80%", delay: 9, rotation: 5 }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* تدرج الخلفية الأساسي */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50" />
      
      {/* طبقة تدرج إضافية */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/60" />
      
      {/* عناصر الترجمة المتحركة */}
      {floatingElements.map((element, index) => {
        const IconComponent = element.Icon;
        return (
          <motion.div
            key={`icon-${index}`}
            className="absolute text-primary/20"
            style={{ 
              left: element.x, 
              top: element.y,
              transform: `scale(${element.scale})`
            }}
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0.3, 0.6, 0],
              y: [20, -10, 5, -15, 20],
              rotate: [0, 10, -5, 15, 0],
              scale: [element.scale, element.scale * 1.2, element.scale, element.scale * 1.1, element.scale]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          >
            <IconComponent className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12" />
          </motion.div>
        );
      })}

      {/* الأحرف المتطايرة */}
      {floatingLetters.map((item, index) => (
        <motion.div
          key={`letter-${index}`}
          className="absolute text-2xl md:text-3xl lg:text-4xl font-bold text-secondary/25 font-arabic-title"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ 
            opacity: [0, 0.7, 0.4, 0.7, 0],
            scale: [0.5, 1.2, 0.8, 1.1, 0.5],
            rotate: [-180, 0, 90, -90, 180],
            y: [0, -20, 10, -15, 0]
          }}
          transition={{
            duration: 12 + Math.random() * 6,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut"
          }}
        >
          {item.letter}
        </motion.div>
      ))}

      {/* الوثائق والملفات */}
      {documents.map((doc, index) => (
        <motion.div
          key={`doc-${index}`}
          className="absolute bg-white/40 rounded-lg shadow-lg border border-white/60 backdrop-blur-sm"
          style={{ 
            left: doc.x, 
            top: doc.y,
            width: doc.width,
            height: doc.height,
            transform: `rotate(${doc.rotation}deg)`
          }}
          initial={{ opacity: 0, scale: 0, rotate: doc.rotation - 90 }}
          animate={{ 
            opacity: [0, 0.8, 0.5, 0.8, 0],
            scale: [0, 1.1, 0.9, 1, 0],
            rotate: [doc.rotation - 90, doc.rotation, doc.rotation + 15, doc.rotation - 10, doc.rotation + 90],
            y: [0, -30, 15, -20, 0]
          }}
          transition={{
            duration: 15 + Math.random() * 5,
            repeat: Infinity,
            delay: doc.delay,
            ease: "easeInOut"
          }}
        >
          {/* خطوط النص داخل الوثيقة */}
          <div className="p-2 space-y-1">
            <div className="h-1 bg-primary/30 rounded w-3/4"></div>
            <div className="h-1 bg-secondary/25 rounded w-full"></div>
            <div className="h-1 bg-accent/20 rounded w-2/3"></div>
            <div className="h-1 bg-primary/25 rounded w-4/5"></div>
            {doc.height > 60 && (
              <>
                <div className="h-1 bg-secondary/20 rounded w-full"></div>
                <div className="h-1 bg-primary/20 rounded w-1/2"></div>
              </>
            )}
          </div>
        </motion.div>
      ))}

      {/* فقاعات ملونة متحركة */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            background: `linear-gradient(45deg, 
              hsl(${210 + i * 15}, 70%, 85%), 
              hsl(${43 + i * 10}, 80%, 90%)
            )`,
            filter: 'blur(1px)',
            opacity: 0.3
          }}
          animate={{
            x: [0, 100, -50, 80, 0],
            y: [0, -80, 100, -60, 0],
            scale: [1, 1.5, 0.8, 1.2, 1],
            opacity: [0.3, 0.6, 0.2, 0.5, 0.3]
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* شبكة من النقاط الهندسية */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle, hsl(212, 100%, 50%) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }}
        />
      </div>

      {/* تأثير الضوء المتحرك */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 70% 20%, rgba(251, 146, 60, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* خطوط اتصال متحركة بين العناصر */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
            <stop offset="50%" stopColor="rgba(168, 85, 247, 0.3)" />
            <stop offset="100%" stopColor="rgba(34, 197, 94, 0.2)" />
          </linearGradient>
        </defs>
        
        {/* خطوط متحركة */}
        {[...Array(5)].map((_, i) => (
          <motion.path
            key={`path-${i}`}
            d={`M ${10 + i * 20}% ${20 + i * 15}% Q ${50 + i * 10}% ${30 + i * 10}% ${80 + i * 5}% ${60 + i * 15}%`}
            stroke="url(#connectionGradient)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0], 
              opacity: [0, 0.6, 0] 
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default StatsBackground;