import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Gift, ArrowLeft, Trophy, Coins, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * بانر ترويجي بارز لعجلة الحظ — تصميم قوي بأنيميشن متعدد الطبقات
 * يوجّه الزائر إلى /spin-the-wheel
 */
export const SpinWheelBanner = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-14 sm:py-20" dir="rtl" aria-label="عرض عجلة الحظ">
      {/* خلفية متدرجة داكنة فاخرة */}
      <div className="absolute inset-0 bg-gradient-to-l from-violet-950 via-indigo-950 to-slate-950" />

      {/* توهجات متحركة */}
      <motion.div
        aria-hidden="true"
        className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl"
        animate={reduceMotion ? undefined : { scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-fuchsia-500/20 blur-3xl"
        animate={reduceMotion ? undefined : { scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* نجوم متلألئة */}
      {[
        { top: "15%", right: "10%", d: 0 },
        { top: "25%", right: "45%", d: 0.8 },
        { top: "70%", right: "15%", d: 1.6 },
        { top: "60%", right: "85%", d: 2.4 },
        { top: "20%", right: "80%", d: 3.2 },
      ].map((s, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="absolute text-amber-300"
          style={{ top: s.top, right: s.right }}
          animate={reduceMotion ? undefined : { opacity: [0.2, 1, 0.2], scale: [0.7, 1.2, 0.7], rotate: [0, 180, 360] }}
          transition={{ duration: 4, repeat: Infinity, delay: s.d, ease: "easeInOut" }}
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      ))}

      {/* عملات ذهبية عائمة */}
      {[
        { top: "10%", right: "75%", d: 0.4 },
        { top: "75%", right: "55%", d: 1.2 },
        { top: "35%", right: "5%", d: 2 },
      ].map((c, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="absolute text-yellow-400/70"
          style={{ top: c.top, right: c.right }}
          animate={reduceMotion ? undefined : { y: [0, -16, 0], rotate: [0, 20, -20, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, delay: c.d, ease: "easeInOut" }}
        >
          <Coins className="w-7 h-7" />
        </motion.div>
      ))}

      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* الجانب النصي */}
          <div className="text-center lg:text-right">
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 border border-amber-300/30 px-4 py-1.5 text-sm font-bold text-amber-300 mb-5"
            >
              <Trophy className="w-4 h-4" />
              جوائز وخصومات حقيقية
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4"
            >
              جرّب حظّك الآن في{" "}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-l from-amber-300 via-yellow-400 to-orange-400">
                عجلة الحظ
                {/* لمعة تمر على النص */}
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-white/40 to-transparent"
                  animate={reduceMotion ? undefined : { x: ["-150%", "150%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                  style={{ mixBlendMode: "overlay" }}
                />
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              أدر العجلة واربح خصومات فورية وهدايا على خدماتنا الأكاديمية —
              دورة واحدة قد تكون بداية توفيرك القادم.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
            >
              <motion.div
                animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-8 py-6 rounded-2xl gap-2 bg-gradient-to-l from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-extrabold shadow-2xl shadow-amber-500/30 border-0"
                >
                  <Link to="/spin-the-wheel">
                    <Gift className="w-5 h-5" />
                    أدر العجلة واربح
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              <span className="text-sm text-slate-400">مجانًا · بدون تسجيل</span>
            </motion.div>
          </div>

          {/* عجلة متحركة */}
          <div className="flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -40 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="relative w-64 h-64 sm:w-80 sm:h-80"
            >
              {/* هالة نابضة */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-amber-400/20 blur-2xl"
                animate={reduceMotion ? undefined : { scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* العجلة الدوارة */}
              <motion.div
                className="absolute inset-4 rounded-full border-8 border-amber-300/80 shadow-2xl shadow-amber-500/40 overflow-hidden"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                style={{
                  background:
                    "conic-gradient(from 0deg, #f59e0b 0deg 45deg, #7c3aed 45deg 90deg, #f59e0b 90deg 135deg, #db2777 135deg 180deg, #f59e0b 180deg 225deg, #2563eb 225deg 270deg, #f59e0b 270deg 315deg, #059669 315deg 360deg)",
                }}
              >
                {/* مقابض على المحيط */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <span
                    key={deg}
                    className="absolute w-3 h-3 rounded-full bg-white shadow"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${deg}deg) translateY(-9.2rem) translate(-50%, -50%)`,
                      transformOrigin: "center",
                    }}
                  />
                ))}
              </motion.div>

              {/* مركز العجلة */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 flex items-center justify-center shadow-xl border-4 border-white/60"
                  animate={reduceMotion ? undefined : { scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow" />
                </motion.div>
              </div>

              {/* مؤشر العجلة */}
              <div
                aria-hidden="true"
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-r-[14px] border-t-[22px] border-l-transparent border-r-transparent border-t-amber-300 drop-shadow-lg"
              />

              {/* نجمة جانبية */}
              <motion.div
                aria-hidden="true"
                className="absolute -bottom-2 -right-2 text-amber-300"
                animate={reduceMotion ? undefined : { rotate: [0, 25, -25, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Star className="w-9 h-9 fill-amber-300" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpinWheelBanner;
