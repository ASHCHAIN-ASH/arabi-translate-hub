/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr } from 'npm:@react-email/components@0.0.22'
import { BRAND, PALETTES, renderHeadCss, styles } from './_styles.ts'

interface Props { siteName: string; siteUrl: string; recipient: string; confirmationUrl: string }

const P = PALETTES.signup
const s = styles(P)

export const SignupEmail = ({ recipient, confirmationUrl }: Props) => (
  <Html lang="ar" dir="rtl">
    <Head>
      <style>{renderHeadCss(P)}</style>
    </Head>
    <Preview>تأكيد تسجيلك في {BRAND.name} — خطوة واحدة تفصلك عن منصّتك الأكاديمية</Preview>
    <Body dir="rtl" style={s.main}>
      <Container dir="rtl" style={s.shell} className="container">
        <Section style={s.hero}>
          <div style={s.brandRow} className="anim-fade">
            <img src={BRAND.logoUrl} width="44" height="44" alt={BRAND.name} style={s.brandMark} />
            <Text style={s.brandName}>{BRAND.name}</Text>
          </div>
          <span style={s.badge} className="anim-fade-1">✦ {P.label}</span>
          <Heading className="h1 anim-fade-2" style={s.heroTitle}>أهلاً بك في رحلتك الأكاديمية</Heading>
          <Text style={s.heroSub} className="anim-fade-3">يسعدنا انضمامك إلى نخبة من الباحثين والطلّاب المتميّزين</Text>
        </Section>

        <Section style={s.body}>
          <Text style={s.greet}>السلام عليكم،</Text>
          <Text style={s.paragraph}>
            تم إنشاء حسابك بنجاح على منصّة <strong style={{ color: P.primary }}>{BRAND.name}</strong> بالبريد:{' '}
            <strong style={{ color: '#0F172A' }}>{recipient}</strong>.
          </Text>
          <Text style={s.paragraph}>
            لتفعيل حسابك والاستفادة من جميع الخدمات الأكاديمية، يُرجى تأكيد بريدك الإلكتروني خلال <strong>24 ساعة</strong> عبر الزر أدناه.
          </Text>
          <div style={s.highlightCard}>
            ✓ مكتبة بحثية متخصصة &nbsp;•&nbsp; ✓ خدمات ترجمة وتدقيق &nbsp;•&nbsp; ✓ استشارات أكاديمية معتمدة
          </div>
        </Section>

        <Section style={s.ctaWrap}>
          <Button href={confirmationUrl} style={s.cta} className="cta anim-cta">
            تأكيد البريد الإلكتروني ←
          </Button>
        </Section>

        <Text style={s.altLink}>
          لا يعمل الزر؟ انسخ الرابط التالي:<br />
          <a href={confirmationUrl} style={s.altLinkUrl}>{confirmationUrl}</a>
        </Text>

        <Hr style={s.divider} />
        <Section style={s.footer}>
          <Text style={s.footerBrand}>{BRAND.name} — {BRAND.tagline}</Text>
          <Text style={s.footerText}>إذا لم تُنشئ هذا الحساب، يمكنك تجاهل هذه الرسالة بأمان.</Text>
          <Text style={s.footerText}>© {BRAND.year} {BRAND.name} — جميع الحقوق محفوظة</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)
export default SignupEmail
