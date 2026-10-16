import { GamePhase } from '../../types/gameTypes';
import { PhasePalette } from './floorPalettes';
import { pseudoRandom } from './pseudoRandom';
import { WALL_HEIGHT } from './wallConstants';
import { wallQuad } from './wallQuad';

export function drawWallSegment(
  ctx: CanvasRenderingContext2D, ax: number, ay: number, bx: number, by: number, index: number,
  fill: string, pal: PhasePalette, phase: GamePhase, animTime: number, floorDir: [number, number]
): void {
  const at = (t: number): [number, number] => [ax + (bx - ax) * t, ay + (by - ay) * t];
  wallQuad(ctx, ax, ay, bx, by, 0, WALL_HEIGHT, fill);
  ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(ax, ay - WALL_HEIGHT); ctx.lineTo(bx, by - WALL_HEIGHT); ctx.stroke();
  wallQuad(ctx, ax, ay, bx, by, 0, 7, pal.baseboard);

  if (phase === 'LOFT_STARTUP') {
    ctx.strokeStyle = 'rgba(20,8,4,.35)';
    for (let z = 14; z < WALL_HEIGHT; z += 12) { ctx.beginPath(); ctx.moveTo(ax, ay - z); ctx.lineTo(bx, by - z); ctx.stroke(); }
  }

  if (index % 2 === 0) {
    const [x0, y0] = at(0.14); const [x1, y1] = at(0.86);
    const zb = 22; const zt = 56;
    const [f0x, f0y] = at(0.12); const [f1x, f1y] = at(0.88);
    wallQuad(ctx, f0x, f0y, f1x, f1y, zb - 2, zt + 2, 'rgba(8,12,20,.9)');
    const sky = ctx.createLinearGradient(0, Math.min(y0, y1) - zt, 0, Math.max(y0, y1) - zb);
    sky.addColorStop(0, pal.skyTop); sky.addColorStop(1, pal.skyBottom);
    wallQuad(ctx, x0, y0, x1, y1, zb, zt, sky);
    if (phase === 'TORRE_SUPERCLUSTER') {
      ctx.fillStyle = 'rgba(255,255,255,.8)';
      for (let i = 0; i < 6; i++) { const t = 0.15 + pseudoRandom(index, i, 3) * 0.7; const [px, py] = at(t); ctx.fillRect(px, py - zb - 4 - pseudoRandom(index, i, 4) * 26, 1.2, 1.2); }
    }
    const [mx, my] = at(0.5);
    ctx.strokeStyle = 'rgba(8,12,20,.85)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(mx, my - zb); ctx.lineTo(mx, my - zt); ctx.stroke();
    ctx.fillStyle = `rgba(255,255,255,${0.07 + 0.03 * Math.sin(animTime * 0.8 + index)})`;
    ctx.beginPath(); ctx.moveTo(x0, y0 - zt); ctx.lineTo(mx, my - zt); ctx.lineTo(x0, y0 - zb - 10); ctx.closePath(); ctx.fill();
    // light shaft spilling onto the floor
    const [dx, dy] = floorDir;
    ctx.fillStyle = `rgba(${pal.light},${0.05 + 0.02 * Math.sin(animTime * 0.6 + index)})`;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1 + dx * 2.2, y1 + dy * 2.2); ctx.lineTo(x0 + dx * 2.2, y0 + dy * 2.2); ctx.closePath(); ctx.fill();
  } else {
    const [x0, y0] = at(0.3); const [x1, y1] = at(0.7);
    wallQuad(ctx, x0 - 1.5, y0, x1 + 1.5, y1, 25.5, 52.5, 'rgba(8,12,20,.85)');
    wallQuad(ctx, x0, y0, x1, y1, 27, 51, phase === 'TORRE_SUPERCLUSTER' ? '#0b2a4f' : phase === 'LOFT_STARTUP' ? '#e9d8b4' : '#cfd8dc');
    ctx.strokeStyle = phase === 'TORRE_SUPERCLUSTER' ? 'rgba(56,189,248,.9)' : 'rgba(60,80,70,.7)'; ctx.lineWidth = 1;
    const [a1x, a1y] = at(0.36); const [a2x, a2y] = at(0.5); const [a3x, a3y] = at(0.62);
    ctx.beginPath(); ctx.moveTo(a1x, a1y - 33); ctx.lineTo(a2x, a2y - 46); ctx.lineTo(a3x, a3y - 38); ctx.stroke();
  }
}
