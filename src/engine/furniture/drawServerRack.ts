import { drawIsoPrism } from '../iso/drawIsoPrism';
import { beginIsoFaceX, beginIsoFaceY, endIsoFace, ISO_EDGE_PX } from '../iso/isoFace';
import { isoPoint } from '../iso/isoPoint';

const BOX = { gx0: -0.3, gx1: 0.26, gy0: -0.27, gy1: 0.27 };
const HEIGHT = 60;
const UNIT_BOTTOM = 4;
const UNIT_PITCH = 9;
const UNIT_HEIGHT = 8.2;
const GREEN = '#6dffae';
const AMBER = '#ffc857';
const BLUE = '#5ec8ff';

/** LED that blinks with a per-LED rhythm; busier racks stay lit more often. A soft halo is added when lit. */
function drawLed(ctx: CanvasRenderingContext2D, x: number, z: number, color: string, animTime: number, seed: number, load: number): void {
  const lit = Math.sin(animTime * (2.2 + (seed % 7) * 0.45) + seed * 1.9) > 0.5 - load * 0.95;
  ctx.fillStyle = lit ? color : '#16241d';
  ctx.fillRect(x - 0.6, z - 0.6, 1.2, 1.2);
  if (lit) { ctx.globalAlpha = 0.22; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, z, 2, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
}

function drawFan(ctx: CanvasRenderingContext2D, x: number, z: number, radius: number, angle: number): void {
  ctx.fillStyle = '#050907'; ctx.beginPath(); ctx.arc(x, z, radius, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#4c5d55'; ctx.lineWidth = 0.6; ctx.stroke();
  ctx.strokeStyle = '#8fa398'; ctx.lineWidth = 0.7;
  for (let b = 0; b < 4; b++) {
    const a = angle + (b * Math.PI) / 2;
    ctx.beginPath(); ctx.moveTo(x, z); ctx.lineTo(x + Math.cos(a) * (radius - 0.5), z + Math.sin(a) * (radius - 0.5)); ctx.stroke();
  }
  ctx.fillStyle = '#26332c'; ctx.beginPath(); ctx.arc(x, z, 0.8, 0, Math.PI * 2); ctx.fill();
}

/**
 * Detailed GPU server rack: network switch with patch cables, three GPU nodes with spinning fans,
 * a storage array, a live load display, vented sides, a cable tray and a floor glow that goes from
 * cool green to amber as the load rises. Everything is drawn on the rack's own faces, so nothing is crooked.
 */
export function drawServerRack(ctx: CanvasRenderingContext2D, sx: number, sy: number, animTime: number, loadRatio: number): void {
  const load = Math.max(0, Math.min(1, loadRatio));
  const { gx0, gx1, gy0, gy1 } = BOX;
  const length = (gy1 - gy0) * ISO_EDGE_PX;
  const endLength = (gx1 - gx0) * ISO_EDGE_PX;
  ctx.save();

  // Floor shadow
  ctx.fillStyle = 'rgba(0,0,0,.30)';
  ctx.beginPath();
  [[gx0 - 0.04, gy0 - 0.04], [gx1 + 0.14, gy0 - 0.04], [gx1 + 0.14, gy1 + 0.14], [gx0 - 0.04, gy1 + 0.14]].forEach(([gx, gy], i) => {
    const [px, py] = isoPoint(sx, sy, gx, gy, 0);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  });
  ctx.closePath(); ctx.fill();

  // Carcass: plinth + body
  drawIsoPrism(ctx, sx, sy, { gx0: gx0 - 0.02, gx1: gx1 + 0.02, gy0: gy0 - 0.02, gy1: gy1 + 0.02, z0: 0, z1: 3 }, { top: '#2a3430', faceX: '#18201c', faceY: '#111814' });
  drawIsoPrism(ctx, sx, sy, { ...BOX, z0: 3, z1: HEIGHT }, { top: '#3d4c46', faceX: '#202a26', faceY: '#18201c' });

  // Roof: vent grille and cable tray with orange/blue cables
  ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 0.8;
  for (let k = 0; k < 5; k++) {
    const gx = gx0 + 0.05 + k * 0.1;
    const [ax, ay] = isoPoint(sx, sy, gx, gy0 + 0.04, HEIGHT); const [bx, by] = isoPoint(sx, sy, gx, gy1 - 0.04, HEIGHT);
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  }
  drawIsoPrism(ctx, sx, sy, { gx0: -0.18, gx1: 0.08, gy0: -0.14, gy1: 0.14, z0: HEIGHT, z1: HEIGHT + 3 }, { top: '#232d29', faceX: '#161d1a', faceY: '#101612' });
  ctx.lineWidth = 1.3;
  [['#ff9a3c', -0.08], ['#5ec8ff', 0], ['#ff9a3c', 0.08]].forEach(([color, gy]) => {
    const [ax, ay] = isoPoint(sx, sy, -0.12, gy as number, HEIGHT + 3.2); const [bx, by] = isoPoint(sx, sy, 0.03, gy as number, HEIGHT + 3.2);
    ctx.strokeStyle = color as string; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  });

  // Front face (towards +x): rails, header display and the five rack units
  beginIsoFaceX(ctx, sx, sy, gx1, gy0);
  ctx.fillStyle = '#42544c'; ctx.fillRect(0, 3, 1.4, HEIGHT - 3); ctx.fillRect(length - 1.4, 3, 1.4, HEIGHT - 3);

  // Header: live load display with animated bars
  ctx.fillStyle = '#0b110e'; ctx.fillRect(1.4, HEIGHT - 9, length - 2.8, 7.5);
  ctx.fillStyle = '#04100a'; ctx.fillRect(2.4, HEIGHT - 8, length - 4.8, 5.5);
  const bars = 6; const barW = (length - 7.2) / bars;
  for (let i = 0; i < bars; i++) {
    const wave = 0.5 + 0.5 * Math.sin(animTime * (1.6 + i * 0.35) + i * 1.3);
    const level = Math.min(1, 0.18 + load * 0.55 + wave * 0.27);
    ctx.fillStyle = level > 0.82 ? AMBER : GREEN;
    ctx.fillRect(3.6 + i * (barW + 0.2), HEIGHT - 7.4, barW, 4.2 * level);
  }

  for (let u = 0; u < 5; u++) {
    const z = UNIT_BOTTOM + u * UNIT_PITCH;
    const zc = z + UNIT_HEIGHT / 2;
    ctx.fillStyle = '#0a100d'; ctx.fillRect(1.4, z - 0.5, length - 2.8, UNIT_HEIGHT + 0.5);
    ctx.fillStyle = u === 4 ? '#25342d' : '#2b3a33'; ctx.fillRect(1.6, z, length - 3.2, UNIT_HEIGHT);
    ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(1.6, z + UNIT_HEIGHT - 0.7, length - 3.2, 0.7);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(1.6, z, length - 3.2, 0.6);

    if (u === 4) {
      // Network switch (top unit): 8 ports with link LEDs
      for (let p = 0; p < 8; p++) {
        const px = 2.6 + p * 1.9;
        ctx.fillStyle = '#050907'; ctx.fillRect(px, z + 1.2, 1.4, 1.5);
        ctx.fillStyle = '#7a8a82'; ctx.fillRect(px, z + 2.5, 1.4, 0.3);
        drawLed(ctx, px + 0.7, z + 5.6, p % 3 === 0 ? AMBER : GREEN, animTime, p + 1, load);
      }
    } else if (u >= 1) {
      // GPU node: two fans, drive bays, power LED
      const spin = animTime * (4 + load * 14) * (u % 2 ? 1 : -1);
      drawFan(ctx, 5.2, zc, 3, spin);
      drawFan(ctx, 11.4, zc, 3, spin * 1.07);
      for (let b = 0; b < 2; b++) {
        ctx.fillStyle = '#0b120f'; ctx.fillRect(15.6 + b * 1.6, z + 1.3, 1.2, 5.6);
        drawLed(ctx, 16.2 + b * 1.6, z + 6, b ? AMBER : GREEN, animTime, u * 5 + b, load);
      }
      drawLed(ctx, 16.6, z + 1.2, BLUE, animTime, u * 11, 1);
    } else {
      // Storage array (bottom unit): six drive sleds with activity LEDs
      for (let d = 0; d < 6; d++) {
        const dx = 2.4 + d * 2.65;
        ctx.fillStyle = '#2b3933'; ctx.fillRect(dx, z + 1, 2.2, 6.2);
        ctx.fillStyle = '#0a100d'; ctx.fillRect(dx + 0.4, z + 1.4, 1.4, 0.5);
        drawLed(ctx, dx + 1.1, z + 6.3, d % 2 ? GREEN : BLUE, animTime, 40 + d, load);
      }
    }
  }

  // Patch cables hanging from the switch (top unit) down to the GPU node below it
  const switchZ = UNIT_BOTTOM + 4 * UNIT_PITCH;
  ctx.lineWidth = 0.9; ctx.lineCap = 'round';
  [['#5ec8ff', 3.3], ['#ffc857', 6.9], ['#6dffae', 10.5]].forEach(([color, x], i) => {
    const xs = x as number;
    ctx.strokeStyle = color as string;
    ctx.beginPath(); ctx.moveTo(xs, switchZ + 1.2);
    ctx.bezierCurveTo(xs - 1.6, switchZ - 1.2 - i * 0.4, xs + 1.8, switchZ - UNIT_PITCH + 3, xs, switchZ - UNIT_PITCH + UNIT_HEIGHT - 0.4);
    ctx.stroke();
  });
  endIsoFace(ctx);

  // Side face (towards +y): ventilation slats and a model plate
  beginIsoFaceY(ctx, sx, sy, gy1, gx0);
  for (let z = 7; z < HEIGHT - 6; z += 3) {
    ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(2.5, z, endLength - 5, 1.1);
    ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(2.5, z - 0.5, endLength - 5, 0.5);
  }
  ctx.fillStyle = '#9fb3a8'; ctx.fillRect(endLength / 2 - 2.5, HEIGHT - 5, 5, 1.6);
  endIsoFace(ctx);

  // Floor glow in front of the rack: cool when idle, amber under heavy load
  const glow = 0.045 + 0.012 * Math.sin(animTime * 1.7);
  const rgb = load > 0.72 ? '255,170,70' : '90,230,170';
  ctx.translate(sx, sy); ctx.transform(32, 16, -32, 16, 0, 0);
  for (let layer = 0; layer < 3; layer++) {
    ctx.fillStyle = `rgba(${rgb},${glow * (1 + load)})`;
    ctx.beginPath(); ctx.ellipse(gx1 + 0.3, 0, 0.78 - layer * 0.2, 0.62 - layer * 0.16, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
