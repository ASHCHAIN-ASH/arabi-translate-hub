import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export a DOM node as a multi-page A4 PDF.
 * No branding, no watermark — pure content.
 */
export async function exportNodeToPdf(node: HTMLElement, fileName: string): Promise<void> {
  // Wait for fonts (avoid Arabic glyph shifts during rasterization)
  if ((document as any).fonts?.ready) {
    try { await (document as any).fonts.ready; } catch { /* noop */ }
  }

  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: node.scrollWidth,
    windowHeight: node.scrollHeight,
  });

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const imgW = pageW;
  const imgH = (canvas.height * imgW) / canvas.width;

  let heightLeft = imgH;
  let position = 0;
  const imgData = canvas.toDataURL('image/png');

  pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH, undefined, 'FAST');
  heightLeft -= pageH;

  while (heightLeft > 0) {
    position = heightLeft - imgH;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH, undefined, 'FAST');
    heightLeft -= pageH;
  }

  pdf.save(fileName);
}

/** Open a clean print window with only the CV markup — no app chrome, no branding. */
export function printNode(node: HTMLElement, lang: 'ar' | 'en'): void {
  const w = window.open('', '_blank', 'width=900,height=1200');
  if (!w) return;
  const html = `<!doctype html>
  <html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="utf-8" />
    <title>CV</title>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      @page { size: A4; margin: 0; }
      html, body { margin: 0; padding: 0; background: white; }
      body { font-family: ${lang === 'ar' ? "'IBM Plex Sans Arabic'" : "'Inter'"}, system-ui, sans-serif; }
      .cv-wrap { width: 210mm; min-height: 297mm; margin: 0 auto; }
      @media print { .cv-wrap { box-shadow: none; } }
    </style>
  </head>
  <body>
    <div class="cv-wrap">${node.outerHTML}</div>
    <script>window.addEventListener('load', () => setTimeout(() => { window.print(); }, 350));</script>
  </body></html>`;
  w.document.write(html);
  w.document.close();
}
