/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Preview, Section, Text, Hr } from 'npm:@react-email/components@0.0.22'
import { BRAND, PALETTES, renderHeadCss, styles } from './_styles.ts'

interface Props { siteName?: string; siteUrl?: string; recipient?: string; token: string }
const P = PALETTES.reauth
const s = styles(P)

export const ReauthenticationEmail = ({ recipient, token }: Props) => (
  <Html lang="ar" dir="rtl">
    <Head><style>{renderHeadCss(P)}</style></Head>
    <Preview>رمز التحقق لإعادة التوثيق في {BRAND.name}</Preview>
    <Body dir="rtl" style={s.main}>
      <Container dir="rtl" style={s.shell} className="container">
        <Section style={s.hero}>
          <div style={s.brandRow} className="anim-fade">
            <img src={BRAND.logoUrl} width="44" height="44" alt={BRAND.name} style={s.brandMark} />
            <Text style={s.brandName}>{BRAND.name}</Text>
          </div>
          <span style={s.badge} className="anim-fade-1">🛡️ {P.label}</span>
          <Heading className="h1 anim-fade-2" style={s.heroTitle}>رمز التحقق الأمني</Heading>
          <Text style={s.heroSub} className="anim-fade-3">للتأكّد من هويّتك قبل إجراء عملية حسّاسة</Text>
        </Section>

        <Section style={s.body}>
          <Text style={s.greet}>مرحباً،</Text>
          <Text style={s.paragraph}>
            يُرجى استخدام الرمز أدناه لإكمال إعادة التوثيق على حسابك{recipient ? <> (<strong>{recipient}</strong>)</> : null}:
          </Text>

          <div
            className="anim-fade-2"
            style={{
              background: `linear-gradient(135deg, ${P.tint} 0%, #FFFFFF 100%)`,
              border: `2px dashed ${P.accent}`,
              borderRadius: '14px',
               padding: '24px 8px',
              margin: '24px 0',
              textAlign: 'center',
               maxWidth: '100%',
               overflow: 'hidden',
               boxSizing: 'border-box',
            }}
          >
            <div style={{ fontSize: '12px', color: '#64748B', letterSpacing: '2px', marginBottom: '10px', fontWeight: 600 }}>
              رمز التحقق
            </div>
            <div
              className="fk-code"
              style={{
                 fontSize: '28px',
                fontWeight: 800,
                 letterSpacing: '2px',
                 textIndent: 0,
                color: P.primary,
                 fontFamily: "'Courier New', monospace",
                direction: 'ltr',
                 textAlign: 'center',
                 width: '100%',
                 maxWidth: '100%',
                 boxSizing: 'border-box',
                 whiteSpace: 'normal',
                 wordBreak: 'break-all',
                 overflowWrap: 'anywhere',
              }}
            >
              {token}
            </div>
          </div>

          <div style={s.highlightCard}>
            ⏰ صالح لمدة <strong>10 دقائق</strong>.<br />
            🔐 لا تُشارك هذا الرمز مع أي شخص — فريقنا لن يطلبه أبداً.
          </div>
        </Section>

        <Hr style={s.divider} />
        <Section style={s.footer}>
          <Text style={s.footerBrand}>{BRAND.name} — {BRAND.tagline}</Text>
          <Text style={s.footerText}>لم تطلب الرمز؟ راسلنا مباشرة على {BRAND.supportEmail}</Text>
          <Text style={s.footerText}>© {BRAND.year} {BRAND.name}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)
export default ReauthenticationEmail
