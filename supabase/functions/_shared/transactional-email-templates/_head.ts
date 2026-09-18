/**
 * CSS موحّد لجميع رسائل FekrahEdu ذات الأغلفة المستقلة:
 * اتجاه عربي RTL كامل، تجاوب قوي على الجوال، ومنع خروج المحتوى خارج الإطار.
 */
export const LOGO_URL = 'https://fekrahedu.com/fekrah-logo.jpg'

export const HEAD_CSS = `
html, body, table, tbody, tr, td, p, h1, h2, h3, a, span { direction: rtl !important; }
body, table, td, p, h1, h2, h3 { font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif !important; }
table { border-spacing: 0; }
td, p, h1, h2, h3 { text-align: right; }
img { max-width: 100%; height: auto; }
a, p, td, h1, h2, h3 { overflow-wrap: anywhere; word-break: break-word; }
.fk-code { direction: ltr !important; text-align: center !important; font-size: 30px !important; letter-spacing: 8px !important; text-indent: 8px; }
@media only screen and (max-width: 620px) {
  .fk-shell, table[class="fk-shell"] { width: 100% !important; max-width: 100% !important; }
  .fk-pad { padding-left: 16px !important; padding-right: 16px !important; }
  h1, h2 { font-size: 20px !important; }
  .fk-hero { font-size: 26px !important; }
  .fk-code { font-size: 24px !important; letter-spacing: 5px !important; text-indent: 5px; }
  .fk-btn { display: block !important; width: 100% !important; box-sizing: border-box; }
  td { font-size: 13px !important; }
}
@media only screen and (max-width: 420px) {
  .fk-code { font-size: 20px !important; letter-spacing: 3px !important; text-indent: 3px; }
  .fk-hero { font-size: 22px !important; }
}
`
