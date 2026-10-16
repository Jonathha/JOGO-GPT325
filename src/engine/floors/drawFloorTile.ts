import { GamePhase } from '../../types/gameTypes';
import { getPhasePalette } from './floorPalettes';
import { pseudoRandom } from './pseudoRandom';

/**
 * Draws an isometric floor tile with a per-phase material:
 * Garagem = speckled concrete; Loft = oak planks; Campus = terrazzo; Supercluster = glowing circuit floor.
 */
export function drawFloorTile(
  ctx: CanvasRenderingContext2D, sx: number, sy: number, tileW: number, tileH: number,
  phase: GamePhase, gx = 0, gy = 0, animTime = 0
): void {
  const hw = tileW * 0.5;
  const hh = tileH * 0.5;
  const pal = getPhasePalette(phase);
  const pt = (u: number, v: number): [number, number] => [sx + (u - v) * hw, sy + (u + v) * hh];

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(sx, sy - hh); ctx.lineTo(sx + hw, sy); ctx.lineTo(sx, sy + hh); ctx.lineTo(sx - hw, sy);
  ctx.closePath();
  ctx.fillStyle = (gx + gy) % 2 ? pal.floorA : pal.floorB;
  ctx.fill();
  ctx.clip();

  const shade = pseudoRandom(gx, gy, 1);
  ctx.fillStyle = `rgba(255,255,255,${0.02 + shade * 0.04})`;
  ctx.fillRect(sx - hw, sy - hh, tileW, tileH);

  if (phase === 'LOFT_STARTUP') {
    ctx.strokeStyle = 'rgba(40,18,6,.45)'; ctx.lineWidth = 1;
    [-0.25, 0, 0.25].forEach((v) => { const [ax, ay] = pt(-0.5, v); const [bx, by] = pt(0.5, v); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); });
    ctx.strokeStyle = 'rgba(255,200,120,.12)';
    for (let i = 0; i < 3; i++) { const v = -0.38 + i * 0.25; const u0 = -0.4 + pseudoRandom(gx, gy, 2 + i) * 0.3; const [ax, ay] = pt(u0, v); const [bx, by] = pt(u0 + 0.35, v); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); }
  } else if (phase === 'CAMPUS_IA') {
    for (let i = 0; i < 9; i++) {
      const [fx, fy] = pt(pseudoRandom(gx, gy, 10 + i) - 0.5, pseudoRandom(gx, gy, 30 + i) - 0.5);
      ctx.fillStyle = i % 3 === 0 ? 'rgba(160,190,230,.28)' : i % 3 === 1 ? 'rgba(255,255,255,.16)' : 'rgba(90,110,150,.3)';
      ctx.beginPath(); ctx.arc(fx, fy, 0.9 + pseudoRandom(gx, gy, 50 + i) * 0.9, 0, Math.PI * 2); ctx.fill();
    }
  } else if (phase === 'TORRE_SUPERCLUSTER') {
    const pulse = 0.22 + 0.2 * Math.sin(animTime * 2 + (gx + gy) * 0.6);
    ctx.strokeStyle = `rgba(56,189,248,${pulse})`; ctx.lineWidth = 1;
    const [c0x, c0y] = pt(0, 0);
    [[-0.5, 0], [0, -0.5], [0.5, 0], [0, 0.5]].forEach(([u, v], i) => {
      if (pseudoRandom(gx, gy, 70 + i) < 0.5) return;
      const [ex, ey] = pt(u * 0.6, v * 0.6);
      ctx.beginPath(); ctx.moveTo(c0x, c0y); ctx.lineTo(ex, ey); ctx.stroke();
    });
    ctx.fillStyle = `rgba(125,211,252,${pulse + 0.15})`; ctx.beginPath(); ctx.arc(c0x, c0y, 1.3, 0, Math.PI * 2); ctx.fill();
  } else {
    for (let i = 0; i < 6; i++) {
      const [fx, fy] = pt(pseudoRandom(gx, gy, 90 + i) - 0.5, pseudoRandom(gx, gy, 110 + i) - 0.5);
      ctx.fillStyle = 'rgba(255,255,255,.10)'; ctx.fillRect(fx, fy, 1.4, 1);
    }
    if (pseudoRandom(gx, gy, 5) > 0.82) {
      const [ax, ay] = pt(-0.2, -0.3); const [bx, by] = pt(0.1, 0.05); const [cx, cy] = pt(0.3, 0.2);
      ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(cx, cy); ctx.stroke();
    }
  }
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(sx, sy - hh); ctx.lineTo(sx + hw, sy); ctx.lineTo(sx, sy + hh); ctx.lineTo(sx - hw, sy); ctx.closePath();
  ctx.strokeStyle = phase === 'TORRE_SUPERCLUSTER' ? 'rgba(56,189,248,.35)' : pal.line;
  ctx.globalAlpha = phase === 'TORRE_SUPERCLUSTER' ? 1 : 0.55;
  ctx.lineWidth = 1; ctx.stroke();
  ctx.restore();
}
