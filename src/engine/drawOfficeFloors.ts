import { GamePhase } from '../types/gameTypes';

interface PhasePalette {
  floorA: string; floorB: string; line: string;
  wallLeft: string; wallRight: string; baseboard: string;
  skyTop: string; skyBottom: string; light: string;
}

const PALETTES: Record<string, PhasePalette> = {
  GARAGEM: { floorA: '#3a4656', floorB: '#334155', line: '#4b5a6e', wallLeft: '#2d384a', wallRight: '#212b3b', baseboard: '#111827', skyTop: '#33466b', skyBottom: '#1b2a4a', light: '255,226,170' },
  LOFT_STARTUP: { floorA: '#94591a', floorB: '#7f4c14', line: '#b9791f', wallLeft: '#7c3f2a', wallRight: '#5c2e1f', baseboard: '#2a140c', skyTop: '#5b7fa8', skyBottom: '#f2b36b', light: '255,214,150' },
  CAMPUS_IA: { floorA: '#233049', floorB: '#1a2438', line: '#3b4b68', wallLeft: '#2a3a58', wallRight: '#1c2940', baseboard: '#0d1524', skyTop: '#3b82c4', skyBottom: '#8ecbf0', light: '220,240,255' },
  TORRE_SUPERCLUSTER: { floorA: '#070c18', floorB: '#0b1224', line: '#38bdf8', wallLeft: '#0d1730', wallRight: '#080f20', baseboard: '#020617', skyTop: '#050b22', skyBottom: '#12306b', light: '120,200,255' },
};

function palette(phase: GamePhase): PhasePalette {
  return PALETTES[phase] ?? PALETTES.GARAGEM;
}

/** Deterministic pseudo-random in [0,1) so textures never flicker between frames. */
function hash(a: number, b: number, n: number): number {
  const v = Math.sin(a * 127.1 + b * 311.7 + n * 74.7) * 43758.5453;
  return v - Math.floor(v);
}

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
  const pal = palette(phase);
  const pt = (u: number, v: number): [number, number] => [sx + (u - v) * hw, sy + (u + v) * hh];

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(sx, sy - hh); ctx.lineTo(sx + hw, sy); ctx.lineTo(sx, sy + hh); ctx.lineTo(sx - hw, sy);
  ctx.closePath();
  ctx.fillStyle = (gx + gy) % 2 ? pal.floorA : pal.floorB;
  ctx.fill();
  ctx.clip();

  const shade = hash(gx, gy, 1);
  ctx.fillStyle = `rgba(255,255,255,${0.02 + shade * 0.04})`;
  ctx.fillRect(sx - hw, sy - hh, tileW, tileH);

  if (phase === 'LOFT_STARTUP') {
    ctx.strokeStyle = 'rgba(40,18,6,.45)'; ctx.lineWidth = 1;
    [-0.25, 0, 0.25].forEach((v) => { const [ax, ay] = pt(-0.5, v); const [bx, by] = pt(0.5, v); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); });
    ctx.strokeStyle = 'rgba(255,200,120,.12)';
    for (let i = 0; i < 3; i++) { const v = -0.38 + i * 0.25; const u0 = -0.4 + hash(gx, gy, 2 + i) * 0.3; const [ax, ay] = pt(u0, v); const [bx, by] = pt(u0 + 0.35, v); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); }
  } else if (phase === 'CAMPUS_IA') {
    for (let i = 0; i < 9; i++) {
      const [fx, fy] = pt(hash(gx, gy, 10 + i) - 0.5, hash(gx, gy, 30 + i) - 0.5);
      ctx.fillStyle = i % 3 === 0 ? 'rgba(160,190,230,.28)' : i % 3 === 1 ? 'rgba(255,255,255,.16)' : 'rgba(90,110,150,.3)';
      ctx.beginPath(); ctx.arc(fx, fy, 0.9 + hash(gx, gy, 50 + i) * 0.9, 0, Math.PI * 2); ctx.fill();
    }
  } else if (phase === 'TORRE_SUPERCLUSTER') {
    const pulse = 0.22 + 0.2 * Math.sin(animTime * 2 + (gx + gy) * 0.6);
    ctx.strokeStyle = `rgba(56,189,248,${pulse})`; ctx.lineWidth = 1;
    const [c0x, c0y] = pt(0, 0);
    [[-0.5, 0], [0, -0.5], [0.5, 0], [0, 0.5]].forEach(([u, v], i) => {
      if (hash(gx, gy, 70 + i) < 0.5) return;
      const [ex, ey] = pt(u * 0.6, v * 0.6);
      ctx.beginPath(); ctx.moveTo(c0x, c0y); ctx.lineTo(ex, ey); ctx.stroke();
    });
    ctx.fillStyle = `rgba(125,211,252,${pulse + 0.15})`; ctx.beginPath(); ctx.arc(c0x, c0y, 1.3, 0, Math.PI * 2); ctx.fill();
  } else {
    for (let i = 0; i < 6; i++) {
      const [fx, fy] = pt(hash(gx, gy, 90 + i) - 0.5, hash(gx, gy, 110 + i) - 0.5);
      ctx.fillStyle = 'rgba(255,255,255,.10)'; ctx.fillRect(fx, fy, 1.4, 1);
    }
    if (hash(gx, gy, 5) > 0.82) {
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

const WALL_H = 66;

function wallQuad(ctx: CanvasRenderingContext2D, ax: number, ay: number, bx: number, by: number, z0: number, z1: number, fill: string | CanvasGradient): void {
  ctx.beginPath();
  ctx.moveTo(ax, ay - z0); ctx.lineTo(bx, by - z0); ctx.lineTo(bx, by - z1); ctx.lineTo(ax, ay - z1);
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
}

function drawWallSegment(
  ctx: CanvasRenderingContext2D, ax: number, ay: number, bx: number, by: number, index: number,
  fill: string, pal: PhasePalette, phase: GamePhase, animTime: number, floorDir: [number, number]
): void {
  const at = (t: number): [number, number] => [ax + (bx - ax) * t, ay + (by - ay) * t];
  wallQuad(ctx, ax, ay, bx, by, 0, WALL_H, fill);
  ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(ax, ay - WALL_H); ctx.lineTo(bx, by - WALL_H); ctx.stroke();
  wallQuad(ctx, ax, ay, bx, by, 0, 7, pal.baseboard);

  if (phase === 'LOFT_STARTUP') {
    ctx.strokeStyle = 'rgba(20,8,4,.35)';
    for (let z = 14; z < WALL_H; z += 12) { ctx.beginPath(); ctx.moveTo(ax, ay - z); ctx.lineTo(bx, by - z); ctx.stroke(); }
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
      for (let i = 0; i < 6; i++) { const t = 0.15 + hash(index, i, 3) * 0.7; const [px, py] = at(t); ctx.fillRect(px, py - zb - 4 - hash(index, i, 4) * 26, 1.2, 1.2); }
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

/**
 * Draws both back walls (x = 0 and y = 0 edges) with baseboards, windows, wall art and soft light shafts.
 * Must run after the floor and before furniture/characters.
 */
export function drawBackWalls(
  ctx: CanvasRenderingContext2D, size: number, tileW: number, tileH: number, phase: GamePhase, animTime: number
): void {
  const hw = tileW * 0.5; const hh = tileH * 0.5;
  const pal = palette(phase);
  ctx.save();
  for (let y = 0; y < size; y++) {
    const sx = (0 - y) * hw; const sy = (0 + y) * hh;
    drawWallSegment(ctx, sx - hw, sy, sx, sy - hh, y, pal.wallLeft, pal, phase, animTime, [hw, hh]);
  }
  for (let x = 0; x < size; x++) {
    const sx = x * hw; const sy = x * hh;
    drawWallSegment(ctx, sx, sy - hh, sx + hw, sy, x, pal.wallRight, pal, phase, animTime, [-hw, hh]);
  }
  ctx.restore();
}

/** Drifting dust motes in screen space (the vignette is a cheap CSS overlay in the stage component). */
export function drawAtmosphere(ctx: CanvasRenderingContext2D, width: number, height: number, animTime: number, phase: GamePhase): void {
  const pal = palette(phase);
  ctx.save();
  for (let i = 0; i < 18; i++) {
    const x = ((hash(i, 1, 1) * width + animTime * (6 + hash(i, 2, 2) * 8)) % (width + 20)) - 10;
    const y = (hash(i, 3, 3) * height + Math.sin(animTime * 0.5 + i) * 14 + animTime * 3) % height;
    ctx.fillStyle = `rgba(${pal.light},${0.10 + 0.08 * Math.sin(animTime + i)})`;
    ctx.beginPath(); ctx.arc(x, y, 1 + hash(i, 4, 4) * 1.2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
