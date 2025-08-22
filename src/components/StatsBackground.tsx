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
  Building2,
  Star,
  Trophy,
  Shield,
  Briefcase,
  FolderOpen,
  File,
  Edit,
  FileCheck,
  FileX,
  Scroll,
  Archive
} from "lucide-react";

const StatsBackground = () => {
  // عناصر الترجمة المتطايرة (أكثر وضوحاً)
  const floatingElements = [
    { Icon: BookOpen, x: "8%", y: "15%", delay: 0, scale: 1.2, color: "text-blue-600/70" },
    { Icon: FileText, x: "85%", y: "12%", delay: 1, scale: 1, color: "text-green-600/70" },
    { Icon: Languages, x: "12%", y: "70%", delay: 2, scale: 1.4, color: "text-purple-600/70" },
    { Icon: Globe, x: "88%", y: "65%", delay: 3, scale: 1.1, color: "text-blue-500/70" },
    { Icon: MessageSquare, x: "45%", y: "8%", delay: 4, scale: 1.3, color: "text-indigo-600/70" },
    { Icon: PenTool, x: "22%", y: "45%", delay: 5, scale: 0.9, color: "text-orange-600/70" },
    { Icon: Mic, x: "78%", y: "35%", delay: 6, scale: 1.1, color: "text-red-600/70" },
    { Icon: Users, x: "55%", y: "82%", delay: 7, scale: 1.2, color: "text-teal-600/70" },
    { Icon: Award, x: "92%", y: "45%", delay: 8, scale: 1, color: "text-yellow-600/70" },
    { Icon: Zap, x: "35%", y: "25%", delay: 9, scale: 0.8, color: "text-cyan-600/70" },
    { Icon: Building2, x: "65%", y: "18%", delay: 10, scale: 1.1, color: "text-slate-600/70" },
    { Icon: Star, x: "18%", y: "85%", delay: 11, scale: 1, color: "text-amber-600/70" },
    { Icon: Trophy, x: "72%", y: "78%", delay: 12, scale: 1.2, color: "text-emerald-600/70" },
    { Icon: Shield, x: "38%", y: "62%", delay: 13, scale: 1, color: "text-violet-600/70" },
    { Icon: Briefcase, x: "82%", y: "25%", delay: 14, scale: 0.9, color: "text-rose-600/70" },
    { Icon: FolderOpen, x: "28%", y: "32%", delay: 15, scale: 1.1, color: "text-lime-600/70" }
  ];

  // شعارات الشركات العالمية (مبسطة)
  const globalCompanies = [
    { name: "Microsoft", x: "15%", y: "25%", delay: 2, color: "#00BCF2" },
    { name: "Google", x: "75%", y: "40%", delay: 4, color: "#4285F4" },
    { name: "Apple", x: "25%", y: "60%", delay: 6, color: "#007AFF" },
    { name: "Amazon", x: "85%", y: "20%", delay: 8, color: "#FF9900" },
    { name: "Meta", x: "35%", y: "75%", delay: 10, color: "#1877F2" },
    { name: "Netflix", x: "65%", y: "30%", delay: 12, color: "#E50914" },
    { name: "Tesla", x: "45%", y: "15%", delay: 14, color: "#CC0000" },
    { name: "IBM", x: "55%", y: "70%", delay: 16, color: "#054ADA" }
  ];

  // أحرف عربية وإنجليزية متطايرة (أكثر)
  const floatingLetters = [
    { letter: "ترجمة", x: "20%", y: "20%", delay: 1, size: "text-xl", color: "text-blue-700/60" },
    { letter: "Translation", x: "70%", y: "25%", delay: 2, size: "text-lg", color: "text-purple-700/60" },
    { letter: "عالمي", x: "30%", y: "50%", delay: 3, size: "text-xl", color: "text-green-700/60" },
    { letter: "Global", x: "80%", y: "55%", delay: 4, size: "text-lg", color: "text-orange-700/60" },
    { letter: "محترف", x: "15%", y: "75%", delay: 5, size: "text-xl", color: "text-red-700/60" },
    { letter: "Professional", x: "85%", y: "75%", delay: 6, size: "text-base", color: "text-teal-700/60" },
    { letter: "دقيق", x: "40%", y: "35%", delay: 7, size: "text-lg", color: "text-indigo-700/60" },
    { letter: "Accurate", x: "60%", y: "40%", delay: 8, size: "text-base", color: "text-cyan-700/60" },
    { letter: "سريع", x: "25%", y: "80%", delay: 9, size: "text-lg", color: "text-pink-700/60" },
    { letter: "Fast", x: "75%", y: "80%", delay: 10, size: "text-base", color: "text-lime-700/60" }
  ];

  // كتب ووثائق أكثر تفصيلاً
  const documents = [
    { width: 80, height: 100, x: "10%", y: "30%", delay: 1, rotation: 15, type: "book", title: "Legal Docs" },
    { width: 70, height: 90, x: "85%", y: "50%", delay: 3, rotation: -10, type: "document", title: "Contract" },
    { width: 60, height: 80, x: "35%", y: "65%", delay: 5, rotation: 25, type: "book", title: "Dictionary" },
    { width: 50, height: 70, x: "90%", y: "30%", delay: 7, rotation: -20, type: "folder", title: "Reports" },
    { width: 65, height: 85, x: "20%", y: "75%", delay: 9, rotation: 5, type: "book", title: "Manual" },
    { width: 75, height: 95, x: "70%", y: "60%", delay: 11, rotation: -15, type: "document", title: "Agreement" },
    { width: 55, height: 75, x: "45%", y: "20%", delay: 13, rotation: 30, type: "book", title: "Guide" },
    { width: 60, height: 80, x: "25%", y: "40%", delay: 15, rotation: -5, type: "folder", title: "Archive" },
    { width: 70, height: 90, x: "75%", y: "25%", delay: 17, rotation: 20, type: "document", title: "Policy" },
    { width: 65, height: 85, x: "50%", y: "75%", delay: 19, rotation: -25, type: "book", title: "Handbook" }
  ];

  // أوراق متطايرة منفصلة
  const flyingPapers = [
    { x: "30%", y: "40%", delay: 2, rotation: 45 },
    { x: "65%", y: "35%", delay: 4, rotation: -30 },
    { x: "40%", y: "70%", delay: 6, rotation: 60 },
    { x: "80%", y: "65%", delay: 8, rotation: -45 },
    { x: "20%", y: "55%", delay: 10, rotation: 15 },
    { x: "70%", y: "45%", delay: 12, rotation: -60 },
    { x: "50%", y: "30%", delay: 14, rotation: 30 },
    { x: "85%", y: "40%", delay: 16, rotation: -15 }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* تدرج الخلفية الأساسي المحسن */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100" />
      
      {/* طبقة تدرج إضافية */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/70" />
      
      {/* عناصر الترجمة المتحركة المحسنة */}
      {floatingElements.map((element, index) => {
        const IconComponent = element.Icon;
        return (
          <motion.div
            key={`icon-${index}`}
            className={`absolute ${element.color}`}
            style={{ 
              left: element.x, 
              top: element.y,
              transform: `scale(${element.scale})`
            }}
            initial={{ opacity: 0, y: 30, rotate: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0.6, 0.8, 0.4, 0.8, 0],
              y: [30, -20, 10, -30, 20, -15, 30],
              rotate: [0, 15, -10, 20, -5, 10, 0],
              scale: [element.scale, element.scale * 1.3, element.scale * 0.9, element.scale * 1.2, element.scale]
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          >
            <IconComponent className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 drop-shadow-lg" />
          </motion.div>
        );
      })}

      {/* شعارات الشركات العالمية */}
      {globalCompanies.map((company, index) => (
        <motion.div
          key={`company-${index}`}
          className="absolute font-bold text-sm md:text-base lg:text-lg bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg border border-white/60"
          style={{ 
            left: company.x, 
            top: company.y,
            color: company.color
          }}
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ 
            opacity: [0, 0.9, 0.7, 0.9, 0.5, 0.9, 0],
            scale: [0, 1.2, 0.9, 1.1, 0.8, 1, 0],
            rotate: [-45, 0, 10, -5, 15, 0, 45],
            y: [0, -25, 15, -20, 10, -15, 0]
          }}
          transition={{
            duration: 15 + Math.random() * 5,
            repeat: Infinity,
            delay: company.delay,
            ease: "easeInOut"
          }}
        >
          {company.name}
        </motion.div>
      ))}

      {/* الكلمات المتطايرة المحسنة */}
      {floatingLetters.map((item, index) => (
        <motion.div
          key={`letter-${index}`}
          className={`absolute ${item.size} ${item.color} font-bold font-arabic-title bg-white/60 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md`}
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0.3, rotate: -90 }}
          animate={{ 
            opacity: [0, 0.9, 0.6, 0.9, 0.4, 0.9, 0],
            scale: [0.3, 1.3, 0.9, 1.2, 0.8, 1.1, 0.3],
            rotate: [-90, 10, -15, 20, -10, 5, 90],
            y: [0, -30, 20, -25, 15, -20, 0]
          }}
          transition={{
            duration: 18 + Math.random() * 8,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut"
          }}
        >
          {item.letter}
        </motion.div>
      ))}

      {/* الوثائق والكتب المحسنة */}
      {documents.map((doc, index) => (
        <motion.div
          key={`doc-${index}`}
          className="absolute bg-white/90 rounded-lg shadow-xl border-2 border-slate-200/80 backdrop-blur-sm"
          style={{ 
            left: doc.x, 
            top: doc.y,
            width: doc.width,
            height: doc.height,
            transform: `rotate(${doc.rotation}deg)`
          }}
          initial={{ opacity: 0, scale: 0, rotate: doc.rotation - 180 }}
          animate={{ 
            opacity: [0, 0.95, 0.7, 0.95, 0.6, 0.95, 0],
            scale: [0, 1.2, 0.9, 1.1, 0.8, 1, 0],
            rotate: [doc.rotation - 180, doc.rotation + 10, doc.rotation - 15, doc.rotation + 20, doc.rotation - 10, doc.rotation, doc.rotation + 180],
            y: [0, -40, 25, -35, 20, -30, 0]
          }}
          transition={{
            duration: 20 + Math.random() * 8,
            repeat: Infinity,
            delay: doc.delay,
            ease: "easeInOut"
          }}
        >
          {/* عنوان الوثيقة */}
          <div className="p-2">
            <div className="text-xs font-bold text-slate-700 mb-1 text-center">{doc.title}</div>
            
            {/* محتوى مختلف حسب النوع */}
            {doc.type === "book" && (
              <div className="space-y-1">
                <div className="h-1 bg-blue-400/60 rounded w-full"></div>
                <div className="h-1 bg-purple-400/50 rounded w-4/5"></div>
                <div className="h-1 bg-green-400/60 rounded w-full"></div>
                <div className="h-1 bg-orange-400/50 rounded w-3/4"></div>
                <div className="h-1 bg-red-400/60 rounded w-full"></div>
                <div className="h-1 bg-teal-400/50 rounded w-2/3"></div>
                {doc.height > 80 && (
                  <>
                    <div className="h-1 bg-indigo-400/60 rounded w-full"></div>
                    <div className="h-1 bg-pink-400/50 rounded w-4/5"></div>
                  </>
                )}
              </div>
            )}
            
            {doc.type === "document" && (
              <div className="space-y-1">
                <div className="flex space-x-1 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
                <div className="h-1 bg-slate-400/70 rounded w-full"></div>
                <div className="h-1 bg-slate-400/50 rounded w-5/6"></div>
                <div className="h-1 bg-slate-400/70 rounded w-full"></div>
                <div className="h-1 bg-slate-400/50 rounded w-3/4"></div>
              </div>
            )}
            
            {doc.type === "folder" && (
              <div className="space-y-1">
                <div className="h-2 bg-yellow-400/80 rounded w-full mb-1"></div>
                <div className="h-1 bg-blue-400/60 rounded w-4/5"></div>
                <div className="h-1 bg-green-400/60 rounded w-full"></div>
                <div className="h-1 bg-purple-400/60 rounded w-3/4"></div>
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {/* أوراق متطايرة منفصلة */}
      {flyingPapers.map((paper, index) => (
        <motion.div
          key={`paper-${index}`}
          className="absolute bg-white/85 rounded shadow-lg border border-slate-200/60"
          style={{ 
            left: paper.x, 
            top: paper.y,
            width: 35,
            height: 45,
            transform: `rotate(${paper.rotation}deg)`
          }}
          initial={{ opacity: 0, scale: 0, rotate: paper.rotation - 180 }}
          animate={{ 
            opacity: [0, 0.9, 0.6, 0.9, 0.5, 0.9, 0],
            scale: [0, 1.3, 0.8, 1.2, 0.7, 1.1, 0],
            rotate: [paper.rotation - 180, paper.rotation + 30, paper.rotation - 20, paper.rotation + 40, paper.rotation - 15, paper.rotation, paper.rotation + 180],
            x: [0, 50, -30, 40, -20, 30, 0],
            y: [0, -60, 40, -50, 30, -40, 0]
          }}
          transition={{
            duration: 16 + Math.random() * 6,
            repeat: Infinity,
            delay: paper.delay,
            ease: "easeInOut"
          }}
        >
          <div className="p-1 space-y-0.5">
            <div className="h-0.5 bg-slate-400/60 rounded w-full"></div>
            <div className="h-0.5 bg-slate-400/40 rounded w-3/4"></div>
            <div className="h-0.5 bg-slate-400/60 rounded w-full"></div>
            <div className="h-0.5 bg-slate-400/40 rounded w-2/3"></div>
            <div className="h-0.5 bg-slate-400/60 rounded w-full"></div>
          </div>
        </motion.div>
      ))}

      {/* فقاعات ملونة محسنة */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${30 + Math.random() * 50}px`,
            height: `${30 + Math.random() * 50}px`,
            background: `linear-gradient(45deg, 
              hsl(${200 + i * 8}, 80%, 85%), 
              hsl(${240 + i * 6}, 70%, 90%)
            )`,
            filter: 'blur(2px)',
            opacity: 0.4
          }}
          animate={{
            x: [0, 120, -60, 100, 0],
            y: [0, -100, 120, -80, 0],
            scale: [1, 1.6, 0.7, 1.3, 1],
            opacity: [0.4, 0.7, 0.3, 0.6, 0.4]
          }}
          transition={{
            duration: 25 + Math.random() * 15,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* تأثير الضوء المتحرك المحسن */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 25% 35%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 75% 65%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 45% 75%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 65% 25%, rgba(251, 146, 60, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 25% 35%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default StatsBackground;