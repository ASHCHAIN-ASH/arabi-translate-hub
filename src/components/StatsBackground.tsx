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
  // عناصر ثابتة مرتبة بشكل احترافي
  const staticElements = [
    { Icon: GraduationCap, x: "10%", y: "20%", size: "h-8 w-8", color: "text-blue-600/20", bg: "bg-blue-50/30" },
    { Icon: Languages, x: "85%", y: "25%", size: "h-8 w-8", color: "text-purple-600/20", bg: "bg-purple-50/30" },
    { Icon: Award, x: "15%", y: "70%", size: "h-8 w-8", color: "text-amber-600/20", bg: "bg-amber-50/30" },
    { Icon: Trophy, x: "80%", y: "75%", size: "h-8 w-8", color: "text-emerald-600/20", bg: "bg-emerald-50/30" },
    { Icon: Target, x: "45%", y: "15%", size: "h-8 w-8", color: "text-red-600/20", bg: "bg-red-50/30" },
    { Icon: CheckCircle, x: "50%", y: "85%", size: "h-8 w-8", color: "text-green-600/20", bg: "bg-green-50/30" },
    { Icon: Shield, x: "20%", y: "45%", size: "h-8 w-8", color: "text-indigo-600/20", bg: "bg-indigo-50/30" },
    { Icon: Briefcase, x: "75%", y: "50%", size: "h-8 w-8", color: "text-slate-600/20", bg: "bg-slate-50/30" }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* خلفية احترافية بتدرج هادئ */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/10" />
      
      {/* شبكة هندسية احترافية */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0),
              linear-gradient(45deg, transparent 45%, hsl(var(--primary) / 0.03) 50%, transparent 55%)
            `,
            backgroundSize: '50px 50px, 100px 100px'
          }}
        />
      </div>

      {/* تدرجات لونية احترافية */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-secondary/5 to-transparent rounded-full blur-3xl" />

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

      {/* خطوط هندسية احترافية */}
      <div className="absolute inset-0">
        {/* خط قطري */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
        </div>
        
        {/* خطوط عمودية */}
        <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
        <div className="absolute right-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-accent/10 to-transparent" />
      </div>

      {/* أشكال هندسية ثابتة */}
      <div className="absolute top-20 right-20 w-32 h-32 border border-primary/10 rounded-full" />
      <div className="absolute bottom-20 left-20 w-24 h-24 border border-accent/10 rounded-lg rotate-45" />
      <div className="absolute top-1/2 right-32 w-16 h-16 border border-secondary/10 rounded-md rotate-12" />
      
      {/* تأثير ضوئي ثابت */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-background/5 to-transparent" />
    </div>
  );
};

export default StatsBackground;