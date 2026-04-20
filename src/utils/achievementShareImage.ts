/**
 * Generates a shareable 1080×1080 PNG using Canvas API.
 * Returns a Blob ready for download/share.
 */

export interface ShareImageData {
  userName: string;
  totalXp: number;
  levelName: string;
  levelIcon?: string;
  streakDays: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
  rank?: number;
  /** Optional: a single highlighted achievement to show */
  highlightAchievement?: { name: string; emoji?: string };
}

/** Load a font with FontFace API (best-effort). */
async function ensureFont(): Promise<void> {
  if (!('fonts' in document)) return;
  try {
    // IBM Plex Sans Arabic from Google
    const f = new FontFace(
      'IBM Plex Sans Arabic',
      'url(https://fonts.gstatic.com/s/ibmplexsansarabic/v12/Qw3CZRtWPQCuHme67tEYUIx3Kh0PHR9N6YNe3PC5eMlxLg.woff2) format("woff2")',
      { weight: '900' }
    );
    await f.load();
    (document.fonts as any).add(f);
  } catch {/* fallback to system font */}
}

export async function generateAchievementImage(d: ShareImageData): Promise<Blob> {
  await ensureFont();

  const SIZE = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  // ── Background: animated-feel gradient ─────────────────────
  const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  bg.addColorStop(0, '#4c1d95');   // violet-900
  bg.addColorStop(0.5, '#7c3aed'); // violet-600
  bg.addColorStop(1, '#db2777');   // pink-600
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Soft glow circles
  drawGlow(ctx, SIZE * 0.85, SIZE * 0.15, 280, 'rgba(251, 191, 36, 0.35)');
  drawGlow(ctx, SIZE * 0.15, SIZE * 0.85, 320, 'rgba(236, 72, 153, 0.4)');
  drawGlow(ctx, SIZE * 0.5, SIZE * 0.5, 200, 'rgba(255, 255, 255, 0.08)');

  // Sparkle dots
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.4 + 0.1})`;
    ctx.beginPath();
    ctx.arc(Math.random() * SIZE, Math.random() * SIZE, Math.random() * 2 + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Top brand strip ────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  roundRect(ctx, 60, 60, SIZE - 120, 90, 24);
  ctx.fill();

  ctx.fillStyle = '#4c1d95';
  ctx.font = 'bold 44px "IBM Plex Sans Arabic", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.direction = 'rtl';
  ctx.fillText('🎓 ماستر إيدو باث — أكاديمية التحدي', SIZE / 2, 105);

  // ── Big trophy emoji ───────────────────────────────────────
  ctx.font = '180px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏆', SIZE / 2, 290);

  // ── Headline ──────────────────────────────────────────────
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 56px "IBM Plex Sans Arabic", system-ui, sans-serif';
  ctx.fillText('إنجاز جديد!', SIZE / 2, 410);

  // User name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px "IBM Plex Sans Arabic", system-ui, sans-serif';
  ctx.fillText(truncate(d.userName, 24), SIZE / 2, 490);

  // ── Glass card with stats ─────────────────────────────────
  const cardX = 100;
  const cardY = 540;
  const cardW = SIZE - 200;
  const cardH = 360;

  // Glass background
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  roundRect(ctx, cardX, cardY, cardW, cardH, 32);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardW, cardH, 32);
  ctx.stroke();

  // Stats grid (3 columns)
  const statY = cardY + 100;
  const colW = cardW / 3;

  drawStat(ctx, cardX + colW * 0.5, statY, '⚡', `${d.totalXp.toLocaleString('ar-SA')}`, 'نقطة XP');
  drawStat(ctx, cardX + colW * 1.5, statY, '🔥', `${d.streakDays}`, 'يوم متتالي');
  drawStat(ctx, cardX + colW * 2.5, statY, '🏅', `${d.achievementsUnlocked}/${d.achievementsTotal}`, 'إنجاز');

  // Level badge
  ctx.fillStyle = 'rgba(251, 191, 36, 0.95)';
  const lblText = `${d.levelIcon || '⭐'} المستوى: ${d.levelName}`;
  ctx.font = 'bold 38px "IBM Plex Sans Arabic", system-ui, sans-serif';
  const lblW = ctx.measureText(lblText).width + 80;
  const lblX = (SIZE - lblW) / 2;
  const lblY = cardY + cardH - 80;
  roundRect(ctx, lblX, lblY, lblW, 64, 32);
  ctx.fill();
  ctx.fillStyle = '#4c1d95';
  ctx.textBaseline = 'middle';
  ctx.fillText(lblText, SIZE / 2, lblY + 32);

  // Rank pill if available
  if (d.rank) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px "IBM Plex Sans Arabic", system-ui, sans-serif';
    ctx.fillText(`الترتيب: #${d.rank} 🎯`, SIZE / 2, cardY + cardH + 30);
  }

  // ── Footer CTA ─────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.font = 'bold 32px "IBM Plex Sans Arabic", system-ui, sans-serif';
  ctx.fillText('انضم وتحدّى نفسك يومياً', SIZE / 2, SIZE - 110);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 28px "IBM Plex Sans Arabic", system-ui, sans-serif';
  ctx.fillText('masteredupath.com/challenge-academy', SIZE / 2, SIZE - 60);

  return await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/png', 0.95)
  );
}

// ── Helpers ──────────────────────────────────────────────────

function drawGlow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawStat(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  emoji: string, value: string, label: string,
) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '64px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(emoji, x, y);

  ctx.font = 'bold 48px "IBM Plex Sans Arabic", system-ui, sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(value, x, y + 70);

  ctx.font = '500 26px "IBM Plex Sans Arabic", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(label, x, y + 115);
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

/**
 * Share or download the generated image.
 */
export async function shareOrDownload(blob: Blob, filename = 'achievement.png'): Promise<'shared' | 'downloaded'> {
  const file = new File([blob], filename, { type: 'image/png' });
  const nav: any = navigator;
  if (nav.canShare?.({ files: [file] })) {
    await nav.share({
      files: [file],
      title: 'إنجازي في أكاديمية التحدي',
      text: '🎓 شاهد إنجازي في ماستر إيدو باث!',
    });
    return 'shared';
  }
  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'downloaded';
}
