import confetti from 'canvas-confetti';

export function celebrate(intensity: 'small' | 'medium' | 'big' = 'medium') {
  const counts = { small: 60, medium: 140, big: 240 }[intensity];
  const colors = ['#22d3ee', '#a855f7', '#f59e0b', '#10b981', '#f43f5e'];
  confetti({
    particleCount: counts,
    spread: 90,
    origin: { y: 0.6 },
    colors,
    scalar: 1.05,
    ticks: 220,
  });
  if (intensity !== 'small') {
    setTimeout(() => {
      confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0 }, colors });
      confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1 }, colors });
    }, 180);
  }
}
