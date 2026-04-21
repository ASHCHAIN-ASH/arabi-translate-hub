import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Gift, Sparkles, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import Footer from '@/components/Footer';
interface Segment {
  text: string;
  color: string;
}

const SpinTheWheel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [wonPrize, setWonPrize] = useState("");
  const [startAngle, setStartAngle] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();

  // التحقق من المحاولات اليومية عند تحميل الصفحة
  useEffect(() => {
    checkDailyAttempt();
  }, []);

  const getUserIdentifier = () => {
    // استخدام معرف فريد من المتصفح
    let identifier = localStorage.getItem('spin_user_id');
    if (!identifier) {
      identifier = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('spin_user_id', identifier);
    }
    return identifier;
  };

  const checkDailyAttempt = async () => {
    try {
      const userIdentifier = getUserIdentifier();
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await (supabase
        .from('spin_attempts') as any)
        .select('*')
        .eq('email', userIdentifier)
        .gte('created_at', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking attempts:', error);
      }

      setHasSpunToday(!!data);
    } catch (error) {
      console.error('Error checking daily attempt:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const segments: Segment[] = [
    { text: "خصم 10%", color: "#FF5733" },
    { text: "بحث مجاني", color: "#FF8D33" },
    { text: "خصم 15%", color: "#FFC300" },
    { text: "خصم 20%", color: "#33FF57" },
    { text: "جائزة مفاجأة", color: "#33C1FF" },
    { text: "استشارة مجانية", color: "#9D33FF" },
  ];

  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const arc = (2 * Math.PI) / segments.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // رسم الشرائح
    segments.forEach((segment, i) => {
      const segmentAngle = angle + i * arc;
      
      // رسم الشريحة
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, segmentAngle, segmentAngle + arc);
      ctx.closePath();
      
      // تدرج لوني
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, segment.color);
      gradient.addColorStop(1, segment.color + "CC");
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // حد أبيض
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // رسم النص
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(segmentAngle + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 18px Arial";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.fillText(segment.text, radius - 20, 8);
      ctx.restore();
    });

    // رسم الدائرة المركزية
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 4;
    ctx.stroke();

    // رسم المؤشر في الأعلى
    ctx.save();
    ctx.translate(centerX, 10);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-15, -20);
    ctx.lineTo(15, -20);
    ctx.closePath();
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };

  useEffect(() => {
    drawWheel(startAngle);
  }, [startAngle]);

  const spinWheel = () => {
    if (isSpinning || hasSpunToday) {
      if (hasSpunToday) {
        toast({
          title: "تم استخدام المحاولة اليومية",
          description: "يمكنك المحاولة مرة أخرى غداً",
          variant: "destructive",
        });
      }
      return;
    }

    setIsSpinning(true);
    const spinRotations = Math.random() * 5 + 10; // 10-15 دورة
    const totalAngle = spinRotations * 2 * Math.PI;
    const duration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // تباطؤ طبيعي (ease-out cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentAngle = totalAngle * easeProgress;
      
      setStartAngle(currentAngle % (2 * Math.PI));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        finishSpin(currentAngle);
      }
    };

    requestAnimationFrame(animate);
  };

  const finishSpin = (finalAngle: number) => {
    const arc = (2 * Math.PI) / segments.length;
    const normalizedAngle = (2 * Math.PI - (finalAngle % (2 * Math.PI))) % (2 * Math.PI);
    const winningIndex = Math.floor(normalizedAngle / arc) % segments.length;
    const prize = segments[winningIndex].text;

    setWonPrize(prize);
    setShowResult(true);
    setIsSpinning(false);

    // صوت احتفالي
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3");
    audio.play().catch(() => {
      // تجاهل الخطأ إذا لم يتم تشغيل الصوت
    });

    toast({
      title: "🎉 تهانينا!",
      description: `لقد ربحت: ${prize}`,
    });
  };

  const copyCoupon = () => {
    navigator.clipboard.writeText(wonPrize);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ الكوبون إلى الحافظة",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userIdentifier = getUserIdentifier();

      const { error } = await supabase.functions.invoke("send-spin-winner", {
        body: { 
          name, 
          email, 
          prize: wonPrize,
          userIdentifier 
        },
      });

      if (error) throw error;

      // تحديث حالة المحاولة اليومية
      setHasSpunToday(true);

      toast({
        title: "تم الإرسال بنجاح!",
        description: "تحقق من بريدك الإلكتروني للحصول على الكوبون",
      });

      setShowResult(false);
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "حدث خطأ",
        description: "حاول مرة أخرى لاحقاً",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50" dir="rtl">
      <Header />
      <FloatingWhatsAppButton />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              لف العجلة واربح!
            </h1>
            <Gift className="w-12 h-12 text-pink-500" />
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            أدر العجلة الآن واحصل على فرصتك للفوز بخصومات مذهلة وجوائز قيمة
          </p>
        </motion.div>

        {/* Wheel Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full opacity-20 blur-2xl animate-pulse" />
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="relative bg-white rounded-full shadow-2xl"
            />
          </div>

          {isChecking ? (
            <Button size="lg" disabled className="text-xl px-12 py-6">
              جاري التحميل...
            </Button>
          ) : (
            <Button
              onClick={spinWheel}
              disabled={isSpinning || hasSpunToday}
              size="lg"
              className={`text-xl px-12 py-6 ${
                hasSpunToday 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              } shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {isSpinning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                  جاري الدوران...
                </>
              ) : hasSpunToday ? (
                <>
                  <Trophy className="w-6 h-6 mr-2" />
                  تم استخدام المحاولة اليومية
                </>
              ) : (
                <>
                  <Gift className="w-6 h-6 mr-2" />
                  ابدأ الدوران
                </>
              )}
            </Button>
          )}

          {hasSpunToday && (
            <p className="text-center text-gray-600 mt-4">
              يمكنك المحاولة مرة أخرى غداً! 🎁
            </p>
          )}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
        >
          {[
            { icon: Trophy, title: "جوائز قيمة", desc: "خصومات تصل إلى 20%" },
            { icon: Gift, title: "خدمات مجانية", desc: "بحث أو استشارة مجانية" },
            { icon: Sparkles, title: "جوائز مفاجأة", desc: "مفاجآت خاصة للفائزين" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
            >
              <item.icon className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  تهانينا! 🎉
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 text-center">
              <p className="text-gray-700 mb-2">لقد ربحت:</p>
              <p className="text-3xl font-bold text-purple-600">{wonPrize}</p>
            </div>

            <Button
              onClick={copyCoupon}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 ml-2" />
              نسخ الكوبون
            </Button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أدخل اسمك"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري الإرسال..." : "إرسال البيانات"}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
          <Footer />
    </div>
  );
};

export default SpinTheWheel;
