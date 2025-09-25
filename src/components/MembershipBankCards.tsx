import React from "react";

/**
 * MembershipBankCards – بطاقات عضوية ماستر بشكل "بطاقة بنكية" احترافية (RTL + قابلة للطباعة)
 *
 * ✔️ React + TailwindCSS
 * ✔️ RTL بالكامل
 * ✔️ نسب أبعاد البطاقة البنكية القياسية (85.6mm × 54mm تقريباً)
 * ✔️ عناصر بصرية أصيلة: شريحة EMV، رمز Contactless، هولوغرام، رقم بطاقة بارز، اسم حامل البطاقة، تاريخ الانتهاء
 * ✔️ شارات السعر/الخصم، مع دوال تحويل الأرقام إلى العربية
 * ✔️ زر طباعة ينسّق الصفحة لورق A4 ويضع البطاقات بتباعد مناسب (للإرسال/الطباعة على PVC أو كارت مقوى)
 *
 * ملاحظات:
 * - يمكنك تبديل الألوان/التدرجات والشعارات حسب هُوية MasterEduPath.
 * - إن كنت لا تستخدم Tailwind، ضع الأنماط المكافئة في CSS عادي.
 */

// دوال تنسيق عربية
const toArabic = (n: number | string) => new Intl.NumberFormat("ar-SA").format(Number(n));
const sar = (n: number) => `${toArabic(n)} ريال`;
const finalPrice = (base: number, dPct: number) => Math.round(base * (1 - dPct / 100));
const cashbackAmount = (finalP: number, cPct: number) => Math.round(finalP * (cPct / 100));

// بيانات العضويات – عدّل ما يلزم
const TIERS = [
  {
    slug: "silver",
    titleAr: "الفضية",
    titleEn: "Silver",
    baseSAR: 2400,
    discountPct: 50,
    cashbackPct: 7,
    cardGradient: "from-slate-700 via-slate-600 to-slate-500",
    accent: "#cfd8dc",
    brand: "MASTERCARD",
    mask: "5432 **** **** 1234",
    holder: "عضوية ماستر الفضية",
    expiry: "12/25",
  },
  {
    slug: "gold",
    titleAr: "الذهبية",
    titleEn: "Gold",
    baseSAR: 4400,
    discountPct: 50,
    cashbackPct: 15,
    cardGradient: "from-amber-500 via-amber-400 to-yellow-500",
    accent: "#fff3cd",
    brand: "MASTERCARD",
    mask: "4532 **** **** 5678",
    holder: "عضوية ماستر الذهبية",
    expiry: "12/26",
    featured: true,
  },
  {
    slug: "platinum",
    titleAr: "البلاتينية",
    titleEn: "Platinum",
    baseSAR: 7200,
    discountPct: 50,
    cashbackPct: 25,
    cardGradient: "from-zinc-800 via-zinc-700 to-slate-600",
    accent: "#e0e0e0",
    brand: "MASTERCARD",
    mask: "5432 **** **** 9912",
    holder: "عضوية ماستر البلاتينية",
    expiry: "12/27",
  },
];

// أيقونة الشريحة EMV (SVG)
const Chip = () => (
  <svg viewBox="0 0 60 45" className="w-12 h-9 opacity-90">
    <rect x="1" y="1" width="58" height="43" rx="6" fill="#d9c3a1" stroke="#b89b6d" strokeWidth="2" />
    <path d="M10 10h40M10 22.5h40M10 35h40M20 10v25M30 10v25M40 10v25" stroke="#b89b6d" strokeWidth="2" />
  </svg>
);

// أيقونة Contactless (SVG)
const Contactless = () => (
  <svg viewBox="0 0 64 64" className="w-6 h-6 opacity-80">
    <path d="M20 32c0-4 2-8 6-10M30 42c6-4 10-10 10-18M40 48c10-8 16-20 16-32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// هولوغرام بسيط (دائرتان متداخلتان)
const Hologram = () => (
  <div className="flex items-center gap-1">
    <div className="w-6 h-6 rounded-full bg-cyan-300/80 mix-blend-screen" />
    <div className="w-6 h-6 rounded-full bg-fuchsia-300/80 -ml-3 mix-blend-screen" />
  </div>
);

// شعار العلامة (Mastercard دوائر بسيطة) – يمكن استبداله بصورة حقيقية لاحقاً
const Brand = ({ name = "MASTERCARD" }: { name?: string }) => (
  <div className="flex items-center gap-1">
    <div className="w-3.5 h-3.5 rounded-full bg-red-500" />
    <div className="w-3.5 h-3.5 rounded-full bg-amber-400 -ml-1.5" />
    <span className="text-[10px] tracking-widest font-semibold ml-1 opacity-90">{name}</span>
  </div>
);

// بطاقة بنكية واحدة
const BankCard: React.FC<{ tier: (typeof TIERS)[number] }> = ({ tier }) => {
  const before = tier.baseSAR;
  const after = finalPrice(before, tier.discountPct);
  const cash = cashbackAmount(after, tier.cashbackPct);

  return (
    <div className="relative group">
      {/* شارة مميزة */}
      {tier.featured && (
        <div className="absolute -top-3 right-4 z-20 bg-red-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
          الأكثر طلبًا
        </div>
      )}

      {/* البطاقة الفعلية */}
      <div
        dir="rtl"
        className={`relative w-[340px] h-[214px] md:w-[380px] md:h-[240px] rounded-3xl p-5 text-white shadow-2xl bg-gradient-to-br ${tier.cardGradient} overflow-hidden select-none`}
        style={{
          // نسب الطباعة الحقيقية (ملم) عند الطباعة – يمكن تعديلها حسب نظامك
          // width: "85.6mm", height: "54mm",
          letterSpacing: "0.3px",
        }}
      >
        {/* خلفيات زخرفية خفيفة */}
        <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-black/10 blur-2xl" />

        {/* الصف العلوي: الشريحة + Contactless */}
        <div className="flex items-start justify-between">
          <Chip />
          <Contactless />
        </div>

        {/* رقم البطاقة */}
        <div className="mt-6 md:mt-8 font-[600] tracking-[2.5px] text-[18px] md:text-[22px] drop-shadow-[0_1px_0_rgba(0,0,0,.35)]">
          {tier.mask}
        </div>

        {/* الصف السفلي: الاسم – الانتهاء – الهولوغرام – العلامة */}
        <div className="mt-6 md:mt-8 flex items-end justify-between">
          <div className="space-y-1">
            <div className="text-[10px] opacity-80">اسم حامل البطاقة</div>
            <div className="text-[13px] md:text-[14px] font-bold">{tier.holder}</div>
            <div className="text-[10px] opacity-80 mt-2">تاريخ الانتهاء</div>
            <div className="text-[12px] font-semibold">{tier.expiry}</div>
          </div>
          <div className="flex items-center gap-3">
            <Hologram />
            <Brand name={tier.brand} />
          </div>
        </div>

        {/* شارة السعر/الخصم – أعلى اليسار */}
        <div className="absolute left-3 top-3">
          <div className="bg-white/90 text-black rounded-2xl px-3 py-1.5 shadow font-semibold text-[12px] flex items-baseline gap-1">
            <span className="line-through text-gray-500 text-[11px]">{sar(before)}</span>
            <span className="text-[16px] md:text-[18px] font-extrabold">{toArabic(after)}</span>
            <span className="text-[12px]">ريال</span>
          </div>
          <div className="mt-1 inline-flex items-center gap-1 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
            خصم {toArabic(tier.discountPct)}%
          </div>
          <div className="mt-1 text-[11px] bg-emerald-500/90 text-white px-2 py-1 rounded-md inline-block">
            كاش-باك: {sar(cash)}
          </div>
        </div>
      </div>

      {/* وصف مختصر وزر اشتراك تحت البطاقة */}
      <div className="px-1 mt-3 text-right">
        <div className="text-sm text-gray-700 font-semibold">{tier.titleAr}</div>
        <div className="text-xs text-gray-500">{tier.titleEn}</div>
        <button className="mt-2 w-[340px] md:w-[380px] rounded-xl bg-black text-white font-bold py-2 hover:opacity-90 transition">
          اشترك الآن
        </button>
      </div>
    </div>
  );
};

// شبكة البطاقات + زر طباعة
export default function MembershipBankCards() {
  return (
    <div dir="rtl" className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold">بطاقات عضوية ماستر (شكل بطاقة بنكية)</h2>
        <button
          onClick={() => window.print()}
          className="rounded-lg border px-4 py-2 text-sm font-bold hover:bg-gray-50 print:hidden"
        >
          طباعة البطاقات
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-3 place-items-center print:grid-cols-3">
        {TIERS.map((t) => (
          <BankCard key={t.slug} tier={t} />
        ))}
      </div>

      {/* توجيهات الطباعة */}
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}