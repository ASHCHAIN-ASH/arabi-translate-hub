/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr } from 'npm:@react-email/components@0.0.22'
import { BRAND, PALETTES, renderHeadCss, styles } from './_styles.ts'

interface Props { siteName?: string; siteUrl?: string; recipient?: string; confirmationUrl: string }
const P = PALETTES.invite
const s = styles(P)

export const InviteEmail = ({ recipient, confirmationUrl }: Props) => (
  <Html lang="ar" dir="rtl">
    <Head><style>{renderHeadCss(P)}</style></Head>
    <Preview>دعوة للانضمام إلى {BRAND.name}</Preview>
    <Body style={s.main}>
      <Container style={s.shell} className="container">
        <Section style={s.hero}>
          <div style={s.brandRow} className="anim-fade">
            <span style={s.brandMark}>M</span>
            <Text style={s.brandName}>{BRAND.name}</Text>
          </div>
          <span style={s.badge} className="anim-fade-1">🎓 {P.label}</span>
          <Heading className="h1 anim-fade-2" style={s.heroTitle}>تمّت دعوتك للانضمام</Heading>
          <Text style={s.heroSub} className="anim-fade-3">انضم إلى مجتمعنا الأكاديمي المتميّز</Text>
        </Section>

        <Section style={s.body}>
          <Text style={s.greet}>مرحباً بك،</Text>
          <Text style={s.paragraph}>
            تلقّيت هذه الدعوة الرسمية للانضمام إلى منصّة <strong style={{ color: P.primary }}>{BRAND.name}</strong>{recipient ? <> على البريد <strong>{recipient}</strong></> : null}.
            بقبولك، تحصل على وصول كامل إلى أدوات وخدمات المنصّة الأكاديمية.
          </Text>
          <div style={s.highlightCard}>
            <strong>ما الذي ينتظرك؟</strong><br />
            ◆ لوحة تحكّم متخصّصة &nbsp;◆ مكتبة بحثية واسعة &nbsp;◆ تواصل مباشر مع فريق الخبراء
          </div>
        </Section>

        <Section style={s.ctaWrap}>
          <Button href={confirmationUrl} style={s.cta} className="cta anim-cta">
            قبول الدعوة وإنشاء الحساب ←
          </Button>
        </Section>

        <Text style={s.altLink}>
          رابط الدعوة:<br />
          <a href={confirmationUrl} style={s.altLinkUrl}>{confirmationUrl}</a>
        </Text>

        <Hr style={s.divider} />
        <Section style={s.footer}>
          <Text style={s.footerBrand}>{BRAND.name} — {BRAND.tagline}</Text>
          <Text style={s.footerText}>هذه الدعوة شخصية، يُرجى عدم مشاركتها مع الآخرين.</Text>
          <Text style={s.footerText}>© {BRAND.year} {BRAND.name}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)
export default InviteEmail
