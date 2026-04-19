/**
 * PDF export for the Academic CV.
 *
 * Arabic text + html2canvas is unreliable (glyph shaping breaks, words
 * appear "cut" or reversed). The most robust cross-platform approach is
 * to open a clean print window with only the CV markup and trigger the
 * browser's native "Save as PDF" dialog. Native printing preserves
 * Arabic shaping, RTL, ligatures, and selectable text.
 */

function buildPrintHtml(node: HTMLElement, lang: 'ar' | 'en', title: string): string {
  // Inline all stylesheets from the current document so Tailwind classes
  // and custom CSS variables render identically inside the print window.
  const styleTags = Array.from(document.querySelectorAll('style'))
    .map(s => `<style>${s.innerHTML}</style>`)
    .join('\n');
  const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map(l => l.outerHTML)
    .join('\n');

  return `<!doctype html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  ${linkTags}
  ${styleTags}
  <style>
    @page { size: A4; margin: 0; }
    html, body { margin: 0; padding: 0; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { font-family: ${lang === 'ar' ? "'IBM Plex Sans Arabic'" : "'Inter'"}, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    .cv-print-wrap { width: 210mm; margin: 0 auto; background: #fff; }
    /* Neutralize any preview scaling that might be applied to the source node */
    .cv-print-wrap > * { transform: none !important; transform-origin: top left !important; }
    @media print { .cv-print-wrap { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="cv-print-wrap">${node.outerHTML}</div>
  <script>
    window.addEventListener('load', function () {
      // Give web fonts a moment to load before opening the print dialog
      setTimeout(function () { window.focus(); window.print(); }, 600);
    });
  <\/script>
</body>
</html>`;
}

/**
 * "Download" the CV by opening the system print dialog where the user
 * can choose "Save as PDF". Produces perfect Arabic and selectable text.
 */
export async function exportNodeToPdf(node: HTMLElement, fileName: string): Promise<void> {
  if ((document as any).fonts?.ready) {
    try { await (document as any).fonts.ready; } catch { /* noop */ }
  }
  const lang: 'ar' | 'en' = (document.documentElement.dir === 'rtl' ? 'ar' : 'en');
  const title = fileName.replace(/\.pdf$/i, '');
  const w = window.open('', '_blank', 'width=900,height=1200');
  if (!w) {
    alert(lang === 'ar'
      ? 'الرجاء السماح بالنوافذ المنبثقة لتحميل الـ PDF.'
      : 'Please allow pop-ups to download the PDF.');
    return;
  }
  w.document.write(buildPrintHtml(node, lang, title));
  w.document.close();
}

/** Open a clean print window with only the CV markup — no app chrome, no branding. */
export function printNode(node: HTMLElement, lang: 'ar' | 'en'): void {
  const w = window.open('', '_blank', 'width=900,height=1200');
  if (!w) return;
  w.document.write(buildPrintHtml(node, lang, 'CV'));
  w.document.close();
}
