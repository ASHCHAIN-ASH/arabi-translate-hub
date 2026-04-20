/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr } from 'npm:@react-email/components@0.0.22'
import { BRAND, PALETTES, renderHeadCss, styles } from './_styles.ts'

interface Props { siteName?: string; siteUrl?: string; recipient?: string; confirmationUrl: string }
const P = PALETTES.magicLink
const s = styles(P)

export const MagicLinkEmail = ({ recipient, confirmationUrl }: Props) => (
  <Html lang="ar" dir="rtl">
    <Head><style>{renderHeadCss(P)}</style></Head>
    <Preview>رابط الدخول السريع إلى {BRAND.name} — صالح لـ 60 دقيقة</Preview>
    <Body style={s.main}>
      <Container style={s.shell} className="container">
        <Section style={s.hero}>
          <div style={s.brandRow} className="anim-fade">
            <span style={s.brandMark}>M</span>
            <Text style={s.brandName}>{BRAND.name}</Text>
          </div>
          <span style={s.badge} className="anim-fade-1">⚡ {P.label}</span>
          <Heading className="h1 anim-fade-2" style={s.heroTitle}>دخول بنقرة واحدة</Heading>
          <Text style={s.heroSub} className="anim-fade-3">رابط آمن ومُشفّر يأخذك مباشرة إلى لوحتك</Text>
        </Section>

        <Section style={s.body}>
          <Text style={s.greet}>مرحباً،</Text>
          <Text style={s.paragraph}>
            استلمنا طلب دخول إلى حسابك{recipient ? <> (<strong style={{ color: '#0F172A' }}>{recipient}</strong>)</> : null} باستخدام الرابط السحري.
            اضغط الزر أدناه لتسجيل الدخول مباشرة دون الحاجة لإدخال كلمة المرور.
          </Text>
          <div style={s.highlightCard}>
            🔒 هذا الرابط <strong>صالح لاستخدام واحد فقط</strong> وينتهي خلال <strong>60 دقيقة</strong> من إرساله.
          </div>
        </Section>

        <Section style={s.ctaWrap}>
          <Button href={confirmationUrl} style={s.cta} className="cta anim-cta">
            تسجيل الدخول الآن ←
          </Button>
        </Section>

        <Text style={s.altLink}>
          أو انسخ هذا الرابط في متصفّحك:<br />
          <a href={confirmationUrl} style={s.altLinkUrl}>{confirmationUrl}</a>
        </Text>

        <Hr style={s.divider} />
        <Section style={s.footer}>
          <Text style={s.footerBrand}>{BRAND.name} — {BRAND.tagline}</Text>
          <Text style={s.footerText}>لم تطلب هذا الرابط؟ تجاهل الرسالة وحسابك بأمان تام.</Text>
          <Text style={s.footerText}>© {BRAND.year} {BRAND.name}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)
export default MagicLinkEmail
