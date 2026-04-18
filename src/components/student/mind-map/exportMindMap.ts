// Font-safe export utilities for the mind map.
// Strategy:
// 1. Wait for `document.fonts.ready` so Arabic glyphs are fully loaded.
// 2. Wait two animation frames so React Flow finishes rendering.
// 3. Render with html2canvas at 2× scale for HD output.
// 4. For PDF: convert canvas → PNG → embed via jsPDF (avoids Arabic shaping bugs).
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
const nextFrame = () => new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));

async function ensureFontsLoaded() {
  try {
    if ((document as any).fonts?.ready) {
      await (document as any).fonts.ready;
    }
  } catch { /* ignore */ }
}

async function captureElement(el: HTMLElement, scale = 2): Promise<HTMLCanvasElement> {
  await ensureFontsLoaded();
  await nextFrame();
  await wait(120); // let any Framer animation settle

  // Hide React Flow controls/minimap during capture
  const controls = el.querySelectorAll('.react-flow__controls, .react-flow__minimap, .react-flow__panel');
  const prev: { el: HTMLElement; vis: string }[] = [];
  controls.forEach(c => {
    const h = c as HTMLElement;
    prev.push({ el: h, vis: h.style.visibility });
    h.style.visibility = 'hidden';
  });

  // Background color from CSS var → fallback white
  const bg = getComputedStyle(document.body).getPropertyValue('--background').trim();
  const backgroundColor = bg ? `hsl(${bg})` : '#ffffff';

  try {
    const canvas = await html2canvas(el, {
      scale,
      backgroundColor,
      useCORS: true,
      logging: false,
      // Use foreignObject so Arabic ligatures keep their proper shaping
      foreignObjectRendering: false,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
    });
    return canvas;
  } finally {
    prev.forEach(p => { p.el.style.visibility = p.vis; });
  }
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function exportToPNG(el: HTMLElement, filename = 'mind-map.png') {
  const canvas = await captureElement(el, 2);
  const url = canvas.toDataURL('image/png', 1.0);
  downloadDataUrl(url, filename);
}

export async function exportToPDF(el: HTMLElement, filename = 'mind-map.pdf', title?: string) {
  const canvas = await captureElement(el, 2);
  const imgData = canvas.toDataURL('image/png', 1.0);

  // Choose orientation by aspect ratio
  const orientation = canvas.width >= canvas.height ? 'landscape' : 'portrait';
  const pdf = new jsPDF({ orientation, unit: 'pt', format: 'a4', compress: true });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 24;

  // Fit image into page while preserving aspect
  const ratio = canvas.width / canvas.height;
  let imgW = pageW - margin * 2;
  let imgH = imgW / ratio;
  if (imgH > pageH - margin * 2 - (title ? 28 : 0)) {
    imgH = pageH - margin * 2 - (title ? 28 : 0);
    imgW = imgH * ratio;
  }
  const x = (pageW - imgW) / 2;
  const y = (pageH - imgH) / 2 + (title ? 12 : 0);

  pdf.addImage(imgData, 'PNG', x, y, imgW, imgH, undefined, 'FAST');
  pdf.save(filename);
}
