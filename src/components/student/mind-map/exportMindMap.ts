// Font-safe export utilities for the mind map.
// Captures the FULL graph (not just the visible viewport) by:
// 1. Reading the React Flow viewport element + its real content bounds.
// 2. Temporarily resizing the wrapper and resetting the transform to (0,0,1)
//    so html2canvas can capture every node + edge with proper padding.
// 3. Restoring the original transform/size after capture.
// 4. Waiting for fonts + animation frames so Arabic glyphs render correctly.
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
const nextFrame = () =>
  new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));

async function ensureFontsLoaded() {
  try {
    if ((document as any).fonts?.ready) {
      await (document as any).fonts.ready;
    }
  } catch { /* ignore */ }
}

const PADDING = 80; // px around the graph in the exported image

/**
 * Captures the full mind-map graph regardless of current zoom/pan.
 * `wrapper` is the element that contains the <ReactFlow /> instance.
 */
async function captureFullGraph(wrapper: HTMLElement, scale = 2): Promise<HTMLCanvasElement> {
  await ensureFontsLoaded();
  await nextFrame();
  await wait(120);

  const viewport = wrapper.querySelector('.react-flow__viewport') as HTMLElement | null;
  const rfRenderer = wrapper.querySelector('.react-flow__renderer') as HTMLElement | null;
  if (!viewport || !rfRenderer) {
    throw new Error('React Flow viewport not found');
  }

  // Compute the real bounds of all nodes (in flow coordinates, before viewport transform)
  const nodeEls = Array.from(viewport.querySelectorAll('.react-flow__node')) as HTMLElement[];
  if (nodeEls.length === 0) {
    throw new Error('No nodes to export');
  }

  // Parse current viewport transform: matrix(a,b,c,d,tx,ty) or translate/scale combo
  const cs = getComputedStyle(viewport);
  const t = cs.transform; // e.g. "matrix(0.8,0,0,0.8,120,40)"
  let curScale = 1, curTx = 0, curTy = 0;
  if (t && t !== 'none') {
    const m = t.match(/matrix\(([^)]+)\)/);
    if (m) {
      const p = m[1].split(',').map(parseFloat);
      curScale = p[0] || 1;
      curTx = p[4] || 0;
      curTy = p[5] || 0;
    }
  }

  // Each node has style.transform = "translate(x,y)" in flow coords
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodeEls) {
    const style = n.style.transform || '';
    const m = style.match(/translate\(\s*(-?[\d.]+)px,\s*(-?[\d.]+)px\s*\)/);
    if (!m) continue;
    const x = parseFloat(m[1]);
    const y = parseFloat(m[2]);
    const w = n.offsetWidth;
    const h = n.offsetHeight;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x + w > maxX) maxX = x + w;
    if (y + h > maxY) maxY = y + h;
  }

  if (!isFinite(minX)) {
    throw new Error('Could not compute graph bounds');
  }

  const graphW = Math.ceil(maxX - minX) + PADDING * 2;
  const graphH = Math.ceil(maxY - minY) + PADDING * 2;

  // Hide overlay UI during capture
  const overlays = wrapper.querySelectorAll(
    '.react-flow__controls, .react-flow__minimap, .react-flow__panel, .react-flow__attribution'
  );
  const prevVis: { el: HTMLElement; v: string }[] = [];
  overlays.forEach(o => {
    const h = o as HTMLElement;
    prevVis.push({ el: h, v: h.style.visibility });
    h.style.visibility = 'hidden';
  });

  // Save original inline styles so we can restore precisely
  const orig = {
    wrapperW: wrapper.style.width,
    wrapperH: wrapper.style.height,
    wrapperOverflow: wrapper.style.overflow,
    viewportTransform: viewport.style.transform,
    rendererW: rfRenderer.style.width,
    rendererH: rfRenderer.style.height,
  };

  // Resize wrapper to the full graph + reset transform so the whole graph is visible
  wrapper.style.width = `${graphW}px`;
  wrapper.style.height = `${graphH}px`;
  wrapper.style.overflow = 'hidden';
  // Translate viewport so (minX,minY) lands at (PADDING,PADDING) at scale 1
  viewport.style.transform = `translate(${PADDING - minX}px, ${PADDING - minY}px) scale(1)`;

  await nextFrame();
  await wait(80);

  const bg = getComputedStyle(document.body).getPropertyValue('--background').trim();
  const backgroundColor = bg ? `hsl(${bg})` : '#ffffff';

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(wrapper, {
      scale,
      backgroundColor,
      useCORS: true,
      logging: false,
      foreignObjectRendering: false,
      width: graphW,
      height: graphH,
      windowWidth: graphW,
      windowHeight: graphH,
    });
  } finally {
    // Restore everything
    wrapper.style.width = orig.wrapperW;
    wrapper.style.height = orig.wrapperH;
    wrapper.style.overflow = orig.wrapperOverflow;
    viewport.style.transform = orig.viewportTransform || `translate(${curTx}px, ${curTy}px) scale(${curScale})`;
    if (orig.rendererW) rfRenderer.style.width = orig.rendererW;
    if (orig.rendererH) rfRenderer.style.height = orig.rendererH;
    prevVis.forEach(p => { p.el.style.visibility = p.v; });
  }

  return canvas;
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
  const canvas = await captureFullGraph(el, 2);
  const url = canvas.toDataURL('image/png', 1.0);
  downloadDataUrl(url, filename);
}

export async function exportToPDF(el: HTMLElement, filename = 'mind-map.pdf', title?: string) {
  const canvas = await captureFullGraph(el, 2);
  const imgData = canvas.toDataURL('image/png', 1.0);

  const orientation = canvas.width >= canvas.height ? 'landscape' : 'portrait';
  const pdf = new jsPDF({ orientation, unit: 'pt', format: 'a4', compress: true });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 24;

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
