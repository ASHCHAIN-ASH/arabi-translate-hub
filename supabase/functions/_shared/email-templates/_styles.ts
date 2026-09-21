// 🎨 نظام تصميم موحّد لإيميلات FekrahEdu
// رسمي • أكاديمي • عصري • RTL

export const BRAND = {
  name: 'FekrahEdu',
  nameAr: 'FekrahEdu',
  tagline: 'منصّتك الأكاديمية الموثوقة',
  url: 'https://fekrahedu.com',
  logoUrl: 'https://fekrahedu.com/fekrah-logo.jpg',
  supportEmail: 'support@fekrahedu.com',
  year: new Date().getFullYear(),
};

// لوحات ألوان فريدة لكل نوع إيميل (لا تكرار)
export const PALETTES = {
  signup:        { primary: '#0F4C81', accent: '#1E88E5', glow: 'rgba(30,136,229,0.15)', tint: '#E8F1FB', label: 'مرحباً بك' },
  magicLink:     { primary: '#5B2C91', accent: '#8E44AD', glow: 'rgba(142,68,173,0.18)', tint: '#F3EAFB', label: 'دخول سريع' },
  recovery:      { primary: '#B8541C', accent: '#E67E22', glow: 'rgba(230,126,34,0.18)', tint: '#FDF1E6', label: 'استرجاع' },
  invite:        { primary: '#0E7C66', accent: '#16A085', glow: 'rgba(22,160,133,0.18)', tint: '#E6F7F2', label: 'دعوة رسمية' },
  emailChange:   { primary: '#1F5673', accent: '#2980B9', glow: 'rgba(41,128,185,0.18)', tint: '#E8F2F9', label: 'تحديث بريد' },
  reauth:        { primary: '#922B21', accent: '#C0392B', glow: 'rgba(192,57,43,0.18)', tint: '#FBEAE7', label: 'إعادة توثيق' },
};

// CSS animations + RTL global injected via <Head>
export const renderHeadCss = (palette: { primary: string; accent: string; glow: string; tint: string }) => `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulseGlow { 0%, 100% { box-shadow: 0 8px 24px ${palette.glow}; } 50% { box-shadow: 0 12px 36px ${palette.glow}; } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes drawLine { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
  html, body, table, tbody, thead, tfoot, tr, td, th, div, section, p, a, h1, h2, h3, h4, span { direction: rtl !important; }
  body, table, td, p, a, h1, h2, h3, h4 { font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif !important; }
  td, th, p, h1, h2, h3, h4 { text-align: right; }
  table { border-spacing: 0; }
  a, p, td, h1, h2, h3, h4 { overflow-wrap: anywhere; word-break: break-word; }
  img { max-width: 100%; height: auto; }
  .fk-code { direction: ltr !important; text-align: center !important; font-size: 28px !important; letter-spacing: 2px !important; text-indent: 0 !important; white-space: normal !important; word-break: break-all !important; overflow-wrap: anywhere !important; max-width: 100% !important; }
  .anim-fade { animation: fadeInUp .7s cubic-bezier(.22,.61,.36,1) both; }
  .anim-fade-1 { animation: fadeInUp .7s .1s cubic-bezier(.22,.61,.36,1) both; }
  .anim-fade-2 { animation: fadeInUp .7s .2s cubic-bezier(.22,.61,.36,1) both; }
  .anim-fade-3 { animation: fadeInUp .7s .35s cubic-bezier(.22,.61,.36,1) both; }
  .anim-cta { animation: fadeInUp .7s .25s cubic-bezier(.22,.61,.36,1) both, pulseGlow 2.6s 1.5s ease-in-out infinite; }
  .shimmer-text { background: linear-gradient(90deg, ${palette.primary} 0%, ${palette.accent} 40%, ${palette.primary} 80%); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 4s linear infinite; }
  @media (max-width: 600px) {
    .container { width: 100% !important; max-width: 100% !important; }
    .h1 { font-size: 21px !important; }
    .cta { display: block !important; width: 100% !important; box-sizing: border-box; padding: 14px 18px !important; font-size: 15px !important; }
    .fk-code { font-size: 23px !important; letter-spacing: 1px !important; text-indent: 0 !important; }
  }
  @media (max-width: 420px) {
    .fk-code { font-size: 19px !important; letter-spacing: 0 !important; text-indent: 0 !important; }
  }
`;

// أنماط مكوّنات React Email المشتركة
export const styles = (p: { primary: string; accent: string; glow: string; tint: string }) => ({
  main: {
    width: '100%',
    direction: 'rtl',
    textAlign: 'right',
    backgroundColor: '#F4F6FB',
    margin: 0,
    padding: '32px 12px',
    boxSizing: 'border-box',
    backgroundImage: `radial-gradient(circle at top right, ${p.tint} 0%, #F4F6FB 55%)`,
  } as React.CSSProperties,

  shell: {
    direction: 'rtl',
    textAlign: 'right',
    width: '100%',
    maxWidth: '620px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid #CBD5E1',
    boxShadow: '0 24px 60px -20px rgba(15, 23, 42, 0.18)',
  } as React.CSSProperties,

  hero: {
    direction: 'rtl',
    background: `linear-gradient(135deg, ${p.primary} 0%, ${p.accent} 100%)`,
    padding: '40px 36px 56px',
    textAlign: 'center' as const,
    position: 'relative' as const,
  } as React.CSSProperties,

  brandRow: {
    direction: 'rtl',
    textAlign: 'center',
    marginBottom: '18px',
  } as React.CSSProperties,

  brandMark: {
    display: 'inline-block',
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: '#FFFFFF',
    border: '1px solid rgba(255,255,255,0.28)',
    verticalAlign: 'middle',
  } as React.CSSProperties,

  brandName: {
    display: 'inline-block',
    color: '#FFFFFF',
    fontSize: '17px',
    fontWeight: 600,
    letterSpacing: '0.3px',
    margin: '0 10px 0 0',
  } as React.CSSProperties,

  badge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.18)',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: 600,
    padding: '6px 14px',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.3)',
    marginBottom: '18px',
    letterSpacing: '0.4px',
  } as React.CSSProperties,

  heroTitle: {
    color: '#FFFFFF',
    fontSize: '28px',
    fontWeight: 700,
    margin: '0 0 8px',
    lineHeight: 1.4,
  } as React.CSSProperties,

  heroSub: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: '15px',
    margin: 0,
    lineHeight: 1.7,
  } as React.CSSProperties,

  body: {
    padding: '36px 36px 8px',
    direction: 'rtl' as const,
    textAlign: 'right' as const,
  } as React.CSSProperties,

  greet: {
    fontSize: '17px',
    color: '#0F172A',
    fontWeight: 600,
    margin: '0 0 14px',
  } as React.CSSProperties,

  paragraph: {
    fontSize: '15px',
    color: '#475569',
    lineHeight: 1.9,
    margin: '0 0 16px',
  } as React.CSSProperties,

  highlightCard: {
    background: p.tint,
    border: `1px solid ${p.accent}33`,
    borderRight: `4px solid ${p.primary}`,
    borderRadius: '12px',
    padding: '16px 18px',
    margin: '20px 0',
    fontSize: '14px',
    color: '#1E293B',
    lineHeight: 1.8,
  } as React.CSSProperties,

  ctaWrap: {
    textAlign: 'center' as const,
    padding: '24px 36px 28px',
  } as React.CSSProperties,

  cta: {
    display: 'inline-block',
    background: `linear-gradient(135deg, ${p.primary} 0%, ${p.accent} 100%)`,
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: 700,
    textDecoration: 'none',
    padding: '16px 38px',
    borderRadius: '12px',
    letterSpacing: '0.3px',
  } as React.CSSProperties,

  altLink: {
    fontSize: '12px',
    color: '#64748B',
    textAlign: 'center' as const,
    margin: '0 36px 24px',
    lineHeight: 1.7,
    wordBreak: 'break-all' as const,
  } as React.CSSProperties,

  altLinkUrl: {
    color: p.primary,
    textDecoration: 'underline',
  } as React.CSSProperties,

  divider: {
    borderTop: '1px dashed #E2E8F0',
    margin: '0 36px',
  } as React.CSSProperties,

  footer: {
    direction: 'rtl',
    padding: '24px 36px 28px',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  footerText: {
    fontSize: '12px',
    color: '#94A3B8',
    lineHeight: 1.7,
    margin: '6px 0',
  } as React.CSSProperties,

  footerBrand: {
    fontSize: '13px',
    color: '#475569',
    fontWeight: 600,
    margin: '0 0 4px',
  } as React.CSSProperties,
});

// زخرفة SVG مشتركة (شبكة + خط أكاديمي)
export const decorSvg = (color: string) => `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="620" height="80" viewBox="0 0 620 80"><path d="M0 60 Q155 10 310 50 T620 30" stroke="${color}" stroke-width="2" fill="none" opacity="0.5" stroke-dasharray="4 6"/></svg>`)}`;
