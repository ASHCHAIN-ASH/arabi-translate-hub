/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr } from 'npm:@react-email/components@0.0.22'
import { BRAND, PALETTES, renderHeadCss, styles } from './_styles.ts'

interface Props {
  siteName?: string
  siteUrl?: string
  recipient?: string
  email?: string
  newEmail?: string
  confirmationUrl: string
}
const P = PALETTES.emailChange
const s = styles(P)

export const EmailChangeEmail = ({ recipient, email, newEmail, confirmationUrl }: Props) => {
  const oldEmail = email ?? recipient
  return (
    <Html lang="ar" dir="rtl">
      <Head><style>{renderHeadCss(P)}</style></Head>
      <Preview>تأكيد تغيير البريد الإلكتروني في {BRAND.name}</Preview>
      <Body dir="rtl" style={s.main}>
        <Container dir="rtl" style={s.shell} className="container">
          <Section style={s.hero}>
            <div style={s.brandRow} className="anim-fade">
              <img src={BRAND.logoUrl} width="44" height="44" alt={BRAND.name} style={s.brandMark} />
              <Text style={s.brandName}>{BRAND.name}</Text>
            </div>
            <span style={s.badge} className="anim-fade-1">✉️ {P.label}</span>
            <Heading className="h1 anim-fade-2" style={s.heroTitle}>تأكيد تغيير البريد</Heading>
            <Text style={s.heroSub} className="anim-fade-3">خطوة أمنيّة للحفاظ على حسابك</Text>
          </Section>

          <Section style={s.body}>
            <Text style={s.greet}>مرحباً،</Text>
            <Text style={s.paragraph}>وردنا طلب تحديث البريد الإلكتروني لحسابك. يُرجى مراجعة التفاصيل أدناه:</Text>
            <div style={s.highlightCard}>
              {oldEmail ? <div style={{ marginBottom: '8px' }}>📤 <strong>البريد الحالي:</strong> {oldEmail}</div> : null}
              {newEmail ? <div>📥 <strong>البريد الجديد:</strong> <span style={{ color: P.primary, fontWeight: 700 }}>{newEmail}</span></div> : null}
            </div>
            <Text style={s.paragraph}>للتأكيد، اضغط الزر أدناه. لن يكتمل التغيير دون هذه الخطوة.</Text>
          </Section>

          <Section style={s.ctaWrap}>
            <Button href={confirmationUrl} style={s.cta} className="cta anim-cta">تأكيد البريد الجديد ←</Button>
          </Section>

          <Text style={s.altLink}>
            أو افتح الرابط:<br />
            <a href={confirmationUrl} style={s.altLinkUrl}>{confirmationUrl}</a>
          </Text>

          <Hr style={s.divider} />
          <Section style={s.footer}>
            <Text style={s.footerBrand}>{BRAND.name} — {BRAND.tagline}</Text>
            <Text style={s.footerText}>إذا لم تطلب التغيير، تواصل معنا فوراً: {BRAND.supportEmail}</Text>
            <Text style={s.footerText}>© {BRAND.year} {BRAND.name}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
export default EmailChangeEmail
