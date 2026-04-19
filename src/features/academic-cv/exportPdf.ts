/**
 * PDF export for the Academic CV.
 *
 * The previous implementation copied the live preview DOM via outerHTML.
 * That carried over framer-motion transforms, the preview scale(0.62),
 * opacity, and other runtime mutations — producing print output that
 * looked unstyled or shrunk. We now render the CV freshly to a string
 * via ReactDOMServer, then inject all stylesheets into a clean print
 * window. This guarantees the PDF matches the on-screen template.
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CVRenderer } from './templates';
import type { CVData, CVLanguage, CVTemplate } from './types';

interface PrintOptions {
  data: CVData;
  lang: CVLanguage;
  template: CVTemplate;
  fileName?: string;
  autoPrint?: boolean;
}

function collectStyles(): string {
  // Inline every <style> tag (Tailwind injected, design tokens, etc.)
  const styleTags = Array.from(document.querySelectorAll('style'))
    .map(s => `<style>${s.innerHTML}</style>`)
    .join('\n');
  // Forward all stylesheet links so external CSS still applies
  const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map(l => l.outerHTML)
    .join('\n');
  return linkTags + '\n' + styleTags;
}

function buildPrintHtml(opts: PrintOptions): string {
  const { data, lang, template, fileName = 'CV', autoPrint = true } = opts;

  // Render the template to static HTML — no React runtime, no transforms.
  // mode="print" tells the renderer to drop on-screen-only sizing
  // (min-height: 297mm, flex:1) so content flows naturally across PDF pages.
  const cvMarkup = renderToStaticMarkup(
    React.createElement(CVRenderer, { data, lang, template, mode: 'print' })
  );

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const fontFamily = lang === 'ar'
    ? "'IBM Plex Sans Arabic', 'Tajawal', system-ui, -apple-system, sans-serif"
    : "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

  return `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8" />
  <title>${fileName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
  ${collectStyles()}
  <style>
    /* ─── Reset ─── */
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      margin: 0; padding: 0; background: #ffffff;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body {
      font-family: ${fontFamily};
      color: #0a0a0a;
      direction: ${dir};
      text-align: ${lang === 'ar' ? 'right' : 'left'};
    }

    /* ─── The CV page wrapper — exactly A4 ─── */
    .cv-print-page {
      width: 210mm;
      margin: 0 auto;
      background: #ffffff;
    }

    /* ─── Neutralize on-screen-only sizing inside the rendered template ───
       Templates set min-height: 297mm + flex:1 to fill the live preview.
       In print that forces phantom blank space on page 2. */
    [data-cv-root][data-cv-mode="print"],
    [data-cv-root][data-cv-mode="print"] > * {
      min-height: 0 !important;
      height: auto !important;
      flex: none !important;
    }

    /* ─── Strip any runtime transforms / opacity / animations ─── */
    .cv-print-page * {
      transform: none !important;
      opacity: 1 !important;
      animation: none !important;
      transition: none !important;
      filter: none !important;
    }

    /* ─── Page-break behavior ─── */
    h1, h2, h3 { page-break-after: avoid; break-after: avoid; }
    p, li, tr { page-break-inside: avoid; break-inside: avoid; }
    section, article, header { break-inside: avoid; page-break-inside: avoid; }
    /* Each "card" / item block in templates */
    [data-cv-root] > div > div > section { break-inside: avoid; }
    img, svg { max-width: 100%; }

    /* ─── RTL fixes that some browsers miss in print ─── */
    [dir="rtl"] { direction: rtl; }
    [dir="ltr"] { direction: ltr; }

    @page {
      size: A4;
      margin: 0;
    }

    @media print {
      html, body {
        width: 210mm;
        background: #ffffff !important;
      }
      .cv-print-page {
        box-shadow: none !important;
        margin: 0 !important;
      }
      /* Force colors / gradients / backgrounds to render */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }

    /* On-screen preview inside the print window */
    @media screen {
      body { background: #e5e7eb; padding: 24px 0; }
      .cv-print-page { box-shadow: 0 4px 24px rgba(0,0,0,0.15); }
    }
  </style>
</head>
<body>
  <div class="cv-print-page" id="cv-print">${cvMarkup}</div>
  ${autoPrint ? `<script>
    (function () {
      function ready() {
        var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
        fontsReady.then(function () {
          // Extra delay so external Google Fonts can paint before print
          setTimeout(function () {
            window.focus();
            try { window.print(); } catch (e) {}
          }, 500);
        });
      }
      if (document.readyState === 'complete') ready();
      else window.addEventListener('load', ready);
    })();
  <\/script>` : ''}
</body>
</html>`;
}

/**
 * Open the system print dialog where the user picks "Save as PDF".
 * Produces output identical to the on-screen template.
 */
export async function exportCvToPdf(opts: PrintOptions): Promise<void> {
  if ((document as any).fonts?.ready) {
    try { await (document as any).fonts.ready; } catch { /* noop */ }
  }
  const w = window.open('', '_blank', 'width=900,height=1200');
  if (!w) {
    alert(opts.lang === 'ar'
      ? 'الرجاء السماح بالنوافذ المنبثقة لتحميل الـ PDF.'
      : 'Please allow pop-ups to download the PDF.');
    return;
  }
  w.document.open();
  w.document.write(buildPrintHtml({ ...opts, autoPrint: true }));
  w.document.close();
}

/** Open a clean print window with only the CV markup. */
export function printCv(opts: PrintOptions): void {
  const w = window.open('', '_blank', 'width=900,height=1200');
  if (!w) return;
  w.document.open();
  w.document.write(buildPrintHtml({ ...opts, autoPrint: true }));
  w.document.close();
}

/* ─── Backward-compatible wrappers (legacy DOM-node signature) ─── */

/** @deprecated Use exportCvToPdf({ data, lang, template }) instead. */
export async function exportNodeToPdf(_node: HTMLElement, _fileName: string): Promise<void> {
  // eslint-disable-next-line no-console
  console.warn('[exportPdf] exportNodeToPdf is deprecated — use exportCvToPdf({ data, lang, template }).');
}

/** @deprecated Use printCv({ data, lang, template }) instead. */
export function printNode(_node: HTMLElement, _lang: 'ar' | 'en'): void {
  // eslint-disable-next-line no-console
  console.warn('[exportPdf] printNode is deprecated — use printCv({ data, lang, template }).');
}
