import { 
  BookOpen, 
  FileText, 
  Languages, 
  Globe, 
  Users,
  Award,
  Building2,
  Star,
  Trophy,
  Shield,
  Briefcase,
  GraduationCap,
  Target,
  CheckCircle
} from "lucide-react";

const StatsBackground = () => {
  // عناصر ثابتة مرتبة بشكل احترافي بألوان جذابة
  const staticElements = [
    { Icon: GraduationCap, x: "10%", y: "20%", size: "h-10 w-10", color: "text-emerald-500/40", bg: "bg-gradient-to-br from-emerald-100/60 to-emerald-200/40" },
    { Icon: Languages, x: "85%", y: "25%", size: "h-10 w-10", color: "text-violet-500/40", bg: "bg-gradient-to-br from-violet-100/60 to-violet-200/40" },
    { Icon: Award, x: "15%", y: "70%", size: "h-10 w-10", color: "text-amber-500/40", bg: "bg-gradient-to-br from-amber-100/60 to-amber-200/40" },
    { Icon: Trophy, x: "80%", y: "75%", size: "h-10 w-10", color: "text-rose-500/40", bg: "bg-gradient-to-br from-rose-100/60 to-rose-200/40" },
    { Icon: Target, x: "45%", y: "15%", size: "h-10 w-10", color: "text-cyan-500/40", bg: "bg-gradient-to-br from-cyan-100/60 to-cyan-200/40" },
    { Icon: CheckCircle, x: "50%", y: "85%", size: "h-10 w-10", color: "text-teal-500/40", bg: "bg-gradient-to-br from-teal-100/60 to-teal-200/40" },
    { Icon: Shield, x: "20%", y: "45%", size: "h-10 w-10", color: "text-indigo-500/40", bg: "bg-gradient-to-br from-indigo-100/60 to-indigo-200/40" },
    { Icon: Briefcase, x: "75%", y: "50%", size: "h-10 w-10", color: "text-orange-500/40", bg: "bg-gradient-to-br from-orange-100/60 to-orange-200/40" }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* خلفية ملونة جذابة */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" />
      
      {/* شبكة هندسية ملونة */}
      <div className="absolute inset-0 opacity-15">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 2px 2px, rgb(99 102 241) 1px, transparent 0),
              linear-gradient(45deg, transparent 45%, rgba(168, 85, 247, 0.1) 50%, transparent 55%)
            `,
            backgroundSize: '50px 50px, 100px 100px'
          }}
        />
      </div>

      {/* تدرجات لونية جذابة */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-rose-200/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-violet-200/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-20 right-1/3 w-64 h-64 bg-gradient-to-br from-cyan-200/15 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-tl from-amber-200/15 to-transparent rounded-full blur-3xl" />

      {/* العناصر الثابتة المرتبة */}
      {staticElements.map((element, index) => {
        const IconComponent = element.Icon;
        return (
          <div
            key={`element-${index}`}
            className={`absolute ${element.bg} rounded-2xl p-4 backdrop-blur-sm border border-white/10`}
            style={{ 
              left: element.x, 
              top: element.y
            }}
          >
            <IconComponent className={`${element.size} ${element.color}`} />
          </div>
        );
      })}

      {/* خطوط هندسية ملونة */}
      <div className="absolute inset-0">
        {/* خطوط أفقية */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose-400/20 to-transparent" />
        </div>
        
        {/* خطوط عمودية */}
        <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent" />
        <div className="absolute right-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent" />
      </div>

      {/* أشكال هندسية ملونة */}
      <div className="absolute top-20 right-20 w-32 h-32 border-2 border-indigo-300/25 rounded-full shadow-lg shadow-indigo-200/20" />
      <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-amber-300/25 rounded-lg rotate-45 shadow-lg shadow-amber-200/20" />
      <div className="absolute top-1/2 right-32 w-16 h-16 border-2 border-teal-300/25 rounded-md rotate-12 shadow-lg shadow-teal-200/20" />
      <div className="absolute top-1/3 left-1/3 w-20 h-20 border-2 border-rose-300/25 rounded-2xl rotate-45 shadow-lg shadow-rose-200/20" />
      
      {/* تأثير ضوئي ملون */}
      <div className="absolute inset-0 bg-gradient-to-t from-pink-50/30 via-transparent to-indigo-50/30" />
    </div>
  );
};

export default StatsBackground;