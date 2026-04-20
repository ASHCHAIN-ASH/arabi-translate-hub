/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr } from 'npm:@react-email/components@0.0.22'
import { BRAND, PALETTES, renderHeadCss, styles } from './_styles.ts'

interface Props { siteName?: string; siteUrl?: string; recipient?: string; confirmationUrl: string }
const P = PALETTES.recovery
const s = styles(P)

export const RecoveryEmail = ({ recipient, confirmationUrl }: Props) => (
  <Html lang="ar" dir="rtl">
    <Head><style>{renderHeadCss(P)}</style></Head>
    <Preview>طلب إعادة تعيين كلمة المرور لحسابك في {BRAND.name}</Preview>
    <Body style={s.main}>
      <Container style={s.shell} className="container">
        <Section style={s.hero}>
          <div style={s.brandRow} className="anim-fade">
            <span style={s.brandMark}>M</span>
            <Text style={s.brandName}>{BRAND.name}</Text>
          </div>
          <span style={s.badge} className="anim-fade-1">🔑 {P.label}</span>
          <Heading className="h1 anim-fade-2" style={s.heroTitle}>إعادة تعيين كلمة المرور</Heading>
          <Text style={s.heroSub} className="anim-fade-3">نُساعدك في استعادة الوصول إلى حسابك بأمان</Text>
        </Section>

        <Section style={s.body}>
          <Text style={s.greet}>عزيزنا المستخدم،</Text>
          <Text style={s.paragraph}>
            وصلنا طلب إعادة تعيين كلمة المرور للحساب{recipient ? <> المرتبط بـ <strong style={{ color: '#0F172A' }}>{recipient}</strong></> : null}.
            لإكمال العملية بنجاح، اتبع الخطوات أدناه.
          </Text>
          <div style={s.highlightCard}>
            ⏱️ الرابط فعّال لمدة <strong>60 دقيقة</strong>.<br />
            🛡️ كلمتك القديمة لا تزال صالحة حتى تختار كلمة جديدة.
          </div>
        </Section>

        <Section style={s.ctaWrap}>
          <Button href={confirmationUrl} style={s.cta} className="cta anim-cta">
            إعادة تعيين كلمة المرور ←
          </Button>
        </Section>

        <Text style={s.altLink}>
          الرابط البديل:<br />
          <a href={confirmationUrl} style={s.altLinkUrl}>{confirmationUrl}</a>
        </Text>

        <Hr style={s.divider} />
        <Section style={s.footer}>
          <Text style={s.footerBrand}>{BRAND.name} — {BRAND.tagline}</Text>
          <Text style={s.footerText}>لم تطلب الإعادة؟ تواصل معنا فوراً على {BRAND.supportEmail}</Text>
          <Text style={s.footerText}>© {BRAND.year} {BRAND.name}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)
export default RecoveryEmail
