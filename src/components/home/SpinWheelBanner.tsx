import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Gift, ArrowLeft, Trophy, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * بانر ترويجي واقعي لعجلة الحظ — عجلة SVG بأقسام جوائز حقيقية،
 * إطار معدني بمصابيح، مؤشر مرن، ودوران بتسارع ثم تباطؤ طبيعي.
 * يوجّه الزائر إلى /spin-the-wheel
 */

const SEGMENTS = [
  { label: "خصم 50%", fill: "#f59e0b", text: "#3b2200" },
  { label: "هدية مجانية", fill: "#6d28d9", text: "#ffffff" },
  { label: "خصم 25%", fill: "#fbbf24", text: "#3b2200" },
  { label: "استشارة مجانية", fill: "#be185d", text: "#ffffff" },
  { label: "خصم 15%", fill: "#f59e0b", text: "#3b2200" },
  { label: "ترجمة صفحة", fill: "#1d4ed8", text: "#ffffff" },
  { label: "خصم 10%", fill: "#fbbf24", text: "#3b2200" },
  { label: "دورة إضافية", fill: "#047857", text: "#ffffff" },
];

const SEG = 360 / SEGMENTS.length;
const R = 92;
const CX = 100;
const CY = 100;

const polar = (angleDeg: number, radius: number) => {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [CX + radius * Math.cos(a), CY + radius * Math.sin(a)] as const;
};

const segmentPath = (index: number) => {
  const start = index * SEG;
  const end = start + SEG;
  const [x1, y1] = polar(start, R);
  const [x2, y2] = polar(end, R);
  return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`;
};

export const SpinWheelBanner = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-24"
      dir="rtl"
      aria-label="عرض عجلة الحظ"
    >
      {/* خلفية داكنة فاخرة */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_80%_0%,#3b1d6e_0%,#1b1245_45%,#070a1c_100%)]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* توهجات */}
      <motion.div
        aria-hidden="true"
        className="absolute -top-28 right-1/4 w-[28rem] h-[28rem] rounded-full bg-amber-500/20 blur-3xl"
        animate={reduceMotion ? undefined : { scale: [1, 1.25, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-28 left-1/4 w-[28rem] h-[28rem] rounded-full bg-fuchsia-600/20 blur-3xl"
        animate={reduceMotion ? undefined : { scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* الجانب النصي */}
          <div className="text-center lg:text-right">
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 border border-amber-300/30 px-4 py-1.5 text-sm font-bold text-amber-300 mb-5 backdrop-blur"
            >
              <Trophy className="w-4 h-4" />
              عرض محدود · كل دورة تربح
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.25] mb-5"
            >
              دورة واحدة تفصلك عن
              <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-l from-amber-200 via-yellow-400 to-orange-500">
                خصم حقيقي على خدمتك
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-white/50 to-transparent"
                  animate={reduceMotion ? undefined : { x: ["-160%", "160%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
                  style={{ mixBlendMode: "overlay" }}
                />
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300/90 leading-relaxed mb-7 max-w-xl mx-auto lg:mx-0"
            >
              جوائز مُفعّلة فورًا على الترجمة والبحث والتدقيق والنشر. أدر العجلة،
              احصل على قسيمتك في ثوانٍ، واستخدمها مباشرة عند طلب الخدمة.
            </motion.p>

            {/* شارات ثقة */}
            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-8"
            >
              {[
                { icon: ShieldCheck, text: "جوائز مضمونة ومفعّلة" },
                { icon: Zap, text: "القسيمة فورية" },
                { icon: Sparkles, text: "مجانًا وبدون تسجيل" },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs sm:text-sm text-slate-200 backdrop-blur"
                >
                  <Icon className="w-4 h-4 text-amber-300" />
                  {text}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <motion.div
                className="relative"
                animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-2xl bg-amber-400/40 blur-xl"
                  animate={reduceMotion ? undefined : { opacity: [0.3, 0.8, 0.3], scale: [0.95, 1.08, 0.95] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <Button
                  asChild
                  size="lg"
                  className="relative text-lg px-8 py-6 rounded-2xl gap-2 bg-gradient-to-l from-amber-300 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-600 text-slate-950 font-extrabold shadow-2xl shadow-amber-500/30 border-0"
                >
                  <Link to="/spin-the-wheel">
                    <Gift className="w-5 h-5" />
                    أدر العجلة واربح الآن
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              <span className="text-sm text-slate-400">تستغرق أقل من 10 ثوانٍ</span>
            </motion.div>
          </div>

          {/* العجلة الواقعية */}
          <div className="flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 110, damping: 15 }}
              className="relative w-[19rem] h-[19rem] sm:w-[24rem] sm:h-[24rem]"
            >
              {/* هالة */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-amber-400/20 blur-3xl"
                animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.45, 0.85, 0.45] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* ظل أرضي */}
              <div
                aria-hidden="true"
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2/3 h-6 rounded-[100%] bg-black/60 blur-xl"
              />

              {/* الإطار المعدني الخارجي */}
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_210deg,#7c5b18,#f5d97a,#b8862c,#fff2c4,#8a651f,#f5d97a,#7c5b18)] p-[6%] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]">
                <div className="relative w-full h-full rounded-full bg-[#120a2a] p-[3%] shadow-[inset_0_0_24px_rgba(0,0,0,0.8)]">
                  {/* مصابيح الإطار */}
                  {Array.from({ length: 16 }).map((_, i) => (
                    <motion.span
                      key={i}
                      aria-hidden="true"
                      className="absolute top-1/2 left-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-100"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${i * 22.5}deg) translateY(-48.5%) translateY(-0px)`,
                        transformOrigin: "center",
                        // تموضع دائري عبر الإزاحة النسبية
                        marginTop: 0,
                      }}
                      initial={false}
                      animate={
                        reduceMotion
                          ? undefined
                          : { opacity: [0.25, 1, 0.25], boxShadow: ["0 0 0px #fde68a", "0 0 10px #fbbf24", "0 0 0px #fde68a"] }
                      }
                      transition={{ duration: 1.2, repeat: Infinity, delay: (i % 4) * 0.3, ease: "easeInOut" }}
                    />
                  ))}

                  {/* قرص العجلة الدوّار */}
                  <motion.div
                    className="w-full h-full rounded-full overflow-hidden"
                    animate={reduceMotion ? undefined : { rotate: [0, 1080] }}
                    transition={{
                      duration: 5.5,
                      repeat: Infinity,
                      repeatDelay: 2.5,
                      ease: [0.15, 0.85, 0.2, 1],
                    }}
                  >
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <defs>
                        <radialGradient id="wheelShade" cx="50%" cy="38%" r="72%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.05" />
                          <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
                        </radialGradient>
                      </defs>

                      {SEGMENTS.map((s, i) => (
                        <path
                          key={s.label}
                          d={segmentPath(i)}
                          fill={s.fill}
                          stroke="rgba(255,255,255,0.35)"
                          strokeWidth="0.8"
                        />
                      ))}

                      {SEGMENTS.map((s, i) => {
                        const mid = i * SEG + SEG / 2;
                        return (
                          <g key={`t-${s.label}`} transform={`rotate(${mid} ${CX} ${CY})`}>
                            <text
                              x={CX}
                              y={CY - R + 22}
                              textAnchor="middle"
                              fontSize="9.5"
                              fontWeight="700"
                              fill={s.text}
                              style={{ direction: "rtl" }}
                            >
                              {s.label}
                            </text>
                          </g>
                        );
                      })}

                      <circle cx={CX} cy={CY} r={R} fill="url(#wheelShade)" />
                    </svg>
                  </motion.div>

                  {/* محور المركز */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[26%] h-[26%] rounded-full bg-gradient-to-br from-[#fff3c9] via-[#f3c14e] to-[#b3801f] shadow-[0_8px_20px_rgba(0,0,0,0.6),inset_0_2px_6px_rgba(255,255,255,0.8)] border-[3px] border-white/70 flex items-center justify-center">
                      <motion.div
                        animate={reduceMotion ? undefined : { scale: [1, 1.12, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-[#5a3c05] drop-shadow" />
                      </motion.div>
                    </div>
                  </div>

                  {/* انعكاس زجاجي */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full pointer-events-none bg-[linear-gradient(145deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.05)_35%,transparent_60%)]"
                  />
                </div>
              </div>

              {/* المؤشر المرن */}
              <motion.div
                aria-hidden="true"
                className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 origin-top"
                animate={reduceMotion ? undefined : { rotate: [0, -12, 6, -8, 0] }}
                transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="38" height="52" viewBox="0 0 38 52">
                  <defs>
                    <linearGradient id="pinGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fff3c9" />
                      <stop offset="50%" stopColor="#f3c14e" />
                      <stop offset="100%" stopColor="#a9761a" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M19 51 L4 16 A16 16 0 1 1 34 16 Z"
                    fill="url(#pinGrad)"
                    stroke="rgba(255,255,255,0.75)"
                    strokeWidth="2"
                  />
                  <circle cx="19" cy="15" r="5" fill="#5a3c05" opacity="0.65" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpinWheelBanner;
