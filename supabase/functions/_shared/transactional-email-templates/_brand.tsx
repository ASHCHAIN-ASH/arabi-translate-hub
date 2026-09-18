/**
 * قالب الهوية الموحّد لرسائل FekrahEdu — عربي RTL، متجاوب، مع هيدر وشعار وفوتر.
 * تُبنى عليه جميع القوالب (التحقق، الطلبات، التذاكر، الشكاوى، الدعم، المالية).
 */
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Html, Preview, Text, Section, Row, Column, Hr, Img, Link, Button,
} from 'npm:@react-email/components@0.0.22'

export const SITE_NAME = 'FekrahEdu'
export const SITE_URL = 'https://fekrahedu.com'
export const LOGO_URL = 'https://fekrahedu.com/fekrah-logo.jpg'
export const SUPPORT_EMAIL = 'info@fekrahedu.com'

export type Accent = 'blue' | 'violet' | 'green' | 'amber' | 'red' | 'teal'

const ACCENTS: Record<Accent, { from: string; to: string; soft: string; solid: string; ink: string }> = {
  blue: { from: '#1e3a8a', to: '#1d4ed8', soft: '#eff6ff', solid: '#1d4ed8', ink: '#1e3a8a' },
  violet: { from: '#3b1d71', to: '#6d28d9', soft: '#f5f3ff', solid: '#6d28d9', ink: '#4c1d95' },
  green: { from: '#065f46', to: '#059669', soft: '#ecfdf5', solid: '#059669', ink: '#065f46' },
  amber: { from: '#92400e', to: '#d97706', soft: '#fffbeb', solid: '#d97706', ink: '#92400e' },
  red: { from: '#7f1d1d', to: '#dc2626', soft: '#fef2f2', solid: '#dc2626', ink: '#7f1d1d' },
  teal: { from: '#115e59', to: '#0d9488', soft: '#f0fdfa', solid: '#0d9488', ink: '#115e59' },
}

export const accentOf = (a: Accent = 'blue') => ACCENTS[a] ?? ACCENTS.blue

export const fmt = (v: unknown) => {
  const n = Number(v ?? 0)
  if (!isFinite(n)) return String(v ?? '0')
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const FONT = "'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif"

const CSS = `
html, body, table, tbody, tr, td, p, h1, h2, h3, a, span { direction: rtl !important; }
body, table, td, p, h1, h2, h3 { font-family: ${FONT} !important; }
table { border-spacing: 0; }
td, p, h1, h2, h3 { text-align: right; }
img { max-width: 100%; }
a { overflow-wrap: anywhere; word-break: break-word; }
p, td, h1, h2, h3 { overflow-wrap: anywhere; word-break: break-word; }
@keyframes fekrahFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes fekrahPulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.06); opacity: .88; } }
@keyframes fekrahSweep { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
.fk-card { animation: fekrahFade .6s ease-out both; }
.fk-badge { animation: fekrahPulse 2.4s ease-in-out infinite; }
.fk-bar { background-size: 200% 100%; animation: fekrahSweep 3s linear infinite alternate; }
.fk-btn { transition: transform .2s ease, box-shadow .2s ease; }
.fk-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(0,0,0,.18); }
.fk-code { direction: ltr !important; text-align: center !important; font-size: 30px !important; letter-spacing: 8px !important; text-indent: 8px; white-space: nowrap; }
@media only screen and (max-width: 620px) {
  .fk-shell { width: 100% !important; max-width: 100% !important; border-radius: 10px !important; }
  .fk-pad { padding-left: 16px !important; padding-right: 16px !important; }
  .fk-title { font-size: 19px !important; margin-right: 18px !important; margin-left: 18px !important; }
  .fk-hero { font-size: 26px !important; }
  .fk-code { font-size: 24px !important; letter-spacing: 5px !important; text-indent: 5px; }
  .fk-btn { display: block !important; width: 100% !important; box-sizing: border-box; padding-left: 12px !important; padding-right: 12px !important; }
}
@media only screen and (max-width: 420px) {
  .fk-code { font-size: 20px !important; letter-spacing: 3px !important; text-indent: 3px; }
  .fk-hero { font-size: 22px !important; }
}
@media (prefers-reduced-motion: reduce) {
  .fk-card, .fk-badge, .fk-bar { animation: none !important; }
}
`

export const S = {
  main: { width: '100%', direction: 'rtl' as const, textAlign: 'right' as const, backgroundColor: '#eef2f7', fontFamily: FONT, margin: 0, padding: '24px 12px' },
  container: { direction: 'rtl' as const, textAlign: 'right' as const,
    width: '100%', maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1', borderRadius: '14px', overflow: 'hidden' as const,
    boxShadow: '0 6px 28px rgba(15,23,42,.10)', boxSizing: 'border-box' as const,
  },
  logo: { borderRadius: '12px', backgroundColor: '#ffffff' },
  brand: { fontSize: '19px', fontWeight: '800' as const, color: '#ffffff', margin: 0 },
  tagline: { fontSize: '12px', color: 'rgba(255,255,255,.82)', margin: '4px 0 0' },
  badge: {
    display: 'inline-block' as const, backgroundColor: 'rgba(255,255,255,.22)', color: '#fff',
    fontSize: '11px', fontWeight: '700' as const, padding: '6px 12px', borderRadius: '999px', margin: 0,
  },
  title: { fontSize: '22px', fontWeight: '800' as const, color: '#0f172a', margin: '26px 28px 6px', textAlign: 'right' as const },
  greeting: { fontSize: '15px', fontWeight: '700' as const, color: '#1e293b', margin: '0 28px 8px', textAlign: 'right' as const },
  text: { fontSize: '14px', color: '#475569', lineHeight: '1.95', margin: '0 28px 18px', textAlign: 'right' as const },
  small: { fontSize: '12px', color: '#94a3b8', lineHeight: '1.8', margin: '0 28px 16px', textAlign: 'right' as const },
  btnSection: { textAlign: 'center' as const, margin: '22px 28px' },
  divider: { borderColor: '#e2e8f0', margin: '10px 28px' },
  footerBox: { padding: '16px 28px 30px', textAlign: 'center' as const, backgroundColor: '#f8fafc' },
  footerText: { fontSize: '12px', color: '#94a3b8', margin: '4px 0 0', lineHeight: '1.8' },
  footerLink: { color: '#1d4ed8', textDecoration: 'none', fontSize: '12px', fontWeight: 700 as const },
  tbl: { width: '100%', borderCollapse: 'collapse' as const },
  tdLabel: { padding: '10px 12px', fontSize: '13px', color: '#64748b', textAlign: 'right' as const, borderBottom: '1px solid #e2e8f0', fontWeight: '600' as const },
  tdValue: { padding: '10px 12px', fontSize: '13px', color: '#0f172a', textAlign: 'right' as const, borderBottom: '1px solid #e2e8f0', fontWeight: '700' as const, overflowWrap: 'anywhere' as const },
}

export const heroBox = (a: Accent = 'blue') => ({
  margin: '22px 28px', padding: '22px 16px', backgroundColor: accentOf(a).soft,
  border: `1px solid ${accentOf(a).solid}`, borderRadius: '10px', textAlign: 'center' as const,
  boxSizing: 'border-box' as const, maxWidth: '100%', overflow: 'hidden' as const,
})
export const heroLabel = (a: Accent = 'blue') => ({
  fontSize: '12px', color: accentOf(a).ink, fontWeight: '700' as const, margin: '0 0 8px', letterSpacing: '1px',
  textAlign: 'center' as const,
})
export const heroValue = (a: Accent = 'blue') => ({
  fontSize: '32px', fontWeight: '900' as const, color: accentOf(a).solid, margin: 0, lineHeight: 1.3,
  textAlign: 'center' as const, overflowWrap: 'anywhere' as const,
})

/** صندوق رمز التحقق — يبقى داخل إطار الرسالة على كل الأحجام */
export const otpBox = (a: Accent = 'violet') => ({
  margin: '22px 28px', padding: '20px 12px', backgroundColor: '#ffffff',
  border: `2px dashed ${accentOf(a).solid}`, borderRadius: '12px', textAlign: 'center' as const,
  boxSizing: 'border-box' as const, maxWidth: '100%', overflow: 'hidden' as const,
})
export const otpCode = (a: Accent = 'violet') => ({
  direction: 'ltr' as const, textAlign: 'center' as const, fontSize: '30px', fontWeight: 800,
  letterSpacing: '8px', textIndent: '8px', color: accentOf(a).ink, margin: 0, lineHeight: 1.4,
  fontFamily: "'IBM Plex Sans Arabic', 'Courier New', monospace", maxWidth: '100%',
})
export const card = { direction: 'rtl' as const, textAlign: 'right' as const, margin: '16px 28px', padding: '18px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden' as const }
export const cardTitle = { fontSize: '14px', fontWeight: '800' as const, color: '#1e293b', margin: '0 0 12px', textAlign: 'right' as const }
export const noteBox = (a: Accent = 'blue') => ({
  margin: '0 28px 18px', padding: '14px 16px', backgroundColor: accentOf(a).soft,
  borderRight: `4px solid ${accentOf(a).solid}`, borderRadius: '10px', whiteSpace: 'pre-wrap' as const,
  fontSize: '14px', color: accentOf(a).ink, lineHeight: '1.9', textAlign: 'right' as const,
})
export const btnStyle = (a: Accent = 'blue') => ({
  backgroundColor: accentOf(a).solid, color: '#ffffff', fontSize: '15px', fontWeight: '700' as const,
  padding: '14px 34px', borderRadius: '12px', textDecoration: 'none', display: 'inline-block' as const,
})

export function DataTable({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  return (
    <table dir="rtl" width="100%" align="right" style={S.tbl} cellPadding={0} cellSpacing={0} role="presentation">
      <tbody>
        {rows.filter(([, v]) => v !== undefined && v !== null && v !== '').map(([k, v], i) => (
          <tr key={i} style={i % 2 === 0 ? { backgroundColor: '#ffffff' } : undefined}>
            <td dir="rtl" align="right" style={S.tdLabel}>{k}</td>
            <td dir="rtl" align="right" style={S.tdValue}>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface LayoutProps {
  preview: string
  accent?: Accent
  tagline?: string
  badge?: string
  cta?: { label: string; url: string }
  children: React.ReactNode
  footerNote?: string
}

export function BrandEmail({ preview, accent = 'blue', tagline, badge, cta, children, footerNote }: LayoutProps) {
  const a = accentOf(accent)
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{CSS}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body dir="rtl" style={S.main}>
        <Container dir="rtl" style={S.container} className="fk-card fk-shell">
          <Section
            className="fk-bar"
            style={{ background: `linear-gradient(90deg, ${a.from} 0%, ${a.to} 50%, ${a.from} 100%)`, height: '6px', lineHeight: '6px', fontSize: '1px' }}
          >
            <Text style={{ margin: 0, fontSize: '1px', lineHeight: '6px', color: 'transparent' }}>.</Text>
          </Section>

          <Section className="fk-pad" style={{ background: `linear-gradient(135deg, ${a.from} 0%, ${a.to} 100%)`, padding: '22px 28px' }}>
            <Row dir="rtl">
              <Column style={{ width: '54px' }}>
                <Img src={LOGO_URL} width="46" height="46" alt={SITE_NAME} style={S.logo} />
              </Column>
              <Column>
                <Text style={S.brand}>{SITE_NAME}</Text>
                <Text style={S.tagline}>{tagline || 'منصّة الخدمات الأكاديمية والبحثية'}</Text>
              </Column>
              {badge ? (
                <Column align="right">
                  <Text style={S.badge} className="fk-badge">{badge}</Text>
                </Column>
              ) : null}
            </Row>
          </Section>

          <Section dir="rtl" style={{ direction: 'rtl', textAlign: 'right', width: '100%' }}>
            {children}
          </Section>

          {cta ? (
            <Section style={S.btnSection}>
              <Button href={cta.url} style={btnStyle(accent)} className="fk-btn">{cta.label}</Button>
            </Section>
          ) : null}

          <Hr style={S.divider} />
          <Section style={S.footerBox}>
            <Img src={LOGO_URL} width="34" height="34" alt={SITE_NAME} style={{ ...S.logo, margin: '0 auto 8px' }} />
            {footerNote ? <Text style={S.footerText}>{footerNote}</Text> : null}
            <Text style={S.footerText}>
              <Link href={SITE_URL} style={S.footerLink}>fekrahedu.com</Link>
              {'  ·  '}
              <Link href={`mailto:${SUPPORT_EMAIL}`} style={S.footerLink}>{SUPPORT_EMAIL}</Link>
            </Text>
            <Text style={S.footerText}>
              هذه رسالة آلية من {SITE_NAME}. جميع الحقوق محفوظة © {new Date().getFullYear()}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
