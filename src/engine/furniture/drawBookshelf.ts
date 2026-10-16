import { drawIsoPrism } from '../iso/drawIsoPrism';
import { beginIsoFaceX, beginIsoFaceY, endIsoFace, ISO_EDGE_PX } from '../iso/isoFace';
import { isoPoint } from '../iso/isoPoint';
import { pseudoRandom } from '../floors/pseudoRandom';

const BOOK_COLORS = ['#b5524a', '#4f7fa6', '#d9b45a', '#5e9a73', '#8670b8', '#c9774a', '#3f4f66', '#d7cfc0', '#9c4f6e', '#4a8c8c'];
const HEIGHT = 56;
const SHELF_BOTTOMS = [3.5, 16, 28.5, 41];
const SHELF_THICKNESS = 2;
const BOX = { gx0: -0.5, gx1: -0.1, gy0: -0.5, gy1: 0.5 };

/* Wall-hugging bookcase painter (see drawBookshelf). The books are drawn on the face itself (not on the screen), so every spine,
 * shelf and board is perfectly parallel to the bookcase. Books are deterministic per position, never flicker.
 */
function paintBookshelf(ctx: CanvasRenderingContext2D, sx: number, sy: number, seedX: number, seedY: number): void {
  const { gx0, gx1, gy0, gy1 } = BOX;
  ctx.save();

  // Soft contact shadow on the floor in front of the unit
  ctx.fillStyle = 'rgba(0,0,0,.22)';
  ctx.beginPath();
  [[gx1, gy0], [gx1 + 0.16, gy0], [gx1 + 0.16, gy1], [gx1, gy1]].forEach(([gx, gy], i) => {
    const [px, py] = isoPoint(sx, sy, gx, gy, 0);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  });
  ctx.closePath(); ctx.fill();

  // Carcass, plinth and crown moulding
  drawIsoPrism(ctx, sx, sy, { ...BOX, z0: 0, z1: HEIGHT - 3 }, { top: '#9a7650', faceX: '#7a5a3c', faceY: '#5a432c' });
  drawIsoPrism(ctx, sx, sy, { gx0, gx1: gx1 + 0.025, gy0, gy1, z0: 0, z1: 3.5 }, { top: '#5a432c', faceX: '#4b3624', faceY: '#3d2c1d' });
  drawIsoPrism(ctx, sx, sy, { gx0, gx1: gx1 + 0.025, gy0, gy1, z0: HEIGHT - 3, z1: HEIGHT }, { top: '#b08a5e', faceX: '#8b6a47', faceY: '#6b5035' });

  // Front face (towards the room): back panel, shelf boards and books
  const length = (gy1 - gy0) * ISO_EDGE_PX;
  beginIsoFaceX(ctx, sx, sy, gx1, gy0);
  ctx.fillStyle = '#1b130c'; ctx.fillRect(1.6, 3.5, length - 3.2, HEIGHT - 6.5);
  ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.fillRect(1.6, 3.5, length - 3.2, 1.2);

  SHELF_BOTTOMS.forEach((shelfZ, bay) => {
    const bayBottom = shelfZ + SHELF_THICKNESS;
    const bayTop = bay + 1 < SHELF_BOTTOMS.length ? SHELF_BOTTOMS[bay + 1] : HEIGHT - 3;
    const bayHeight = bayTop - bayBottom;
    const fill = 0.72 + pseudoRandom(seedX, seedY, 200 + bay) * 0.22;
    const limit = 1.8 + (length - 3.6) * fill;
    let x = 2;
    let n = 0;
    while (x < limit - 1.6) {
      const r = pseudoRandom(seedX + bay * 7, seedY + n * 3, 300 + n);
      const w = 1.5 + r * 1.7;
      const h = bayHeight * (0.62 + pseudoRandom(seedX, seedY + bay, 400 + n) * 0.34);
      const color = BOOK_COLORS[Math.floor(pseudoRandom(seedX + n, seedY + bay * 5, 500) * BOOK_COLORS.length)];
      ctx.fillStyle = color; ctx.fillRect(x, bayBottom, w, h);
      ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fillRect(x, bayBottom + h * 0.72, w, 0.7);
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x + w - 0.5, bayBottom, 0.5, h);
      x += w + 0.25; n++;
    }
    // Free space at the end of the bay: a flat stack of books, plus a small object on top for some bays
    const free = length - 1.8 - x;
    if (free > 7) {
      const stackX = x + 1;
      const stackW = Math.min(free - 2, 8.5);
      let stackZ = bayBottom;
      for (let k = 0; k < 2 + (bay % 2); k++) {
        ctx.fillStyle = BOOK_COLORS[(bay * 3 + k * 2 + 1) % BOOK_COLORS.length];
        ctx.fillRect(stackX + (k % 2) * 0.6, stackZ, stackW - (k % 2) * 0.6, 1.9);
        ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(stackX + (k % 2) * 0.6, stackZ + 1.2, stackW - (k % 2) * 0.6, 0.5);
        stackZ += 1.9;
      }
      if (bay % 2 === 1 && stackW > 5) {
        ctx.fillStyle = bay === 1 ? '#d9b45a' : '#7fb08a';
        ctx.beginPath(); ctx.arc(stackX + stackW / 2, stackZ + 2.2, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.arc(stackX + stackW / 2 - 0.7, stackZ + 2.9, 0.7, 0, Math.PI * 2); ctx.fill();
      }
    }
    // Shelf board
    ctx.fillStyle = '#a07c54'; ctx.fillRect(1.2, shelfZ, length - 2.4, SHELF_THICKNESS);
    ctx.fillStyle = 'rgba(255,235,200,.35)'; ctx.fillRect(1.2, shelfZ + SHELF_THICKNESS - 0.6, length - 2.4, 0.6);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(1.2, shelfZ, length - 2.4, 0.5);
  });

  // Side stiles
  ctx.fillStyle = '#6d4f33'; ctx.fillRect(0, 3.5, 1.6, HEIGHT - 6.5); ctx.fillRect(length - 1.6, 3.5, 1.6, HEIGHT - 6.5);
  endIsoFace(ctx);

  // End face (lower-left): wood grain
  const endLength = (gx1 - gx0) * ISO_EDGE_PX;
  beginIsoFaceY(ctx, sx, sy, gy1, gx0);
  ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 0.6;
  for (let z = 8; z < HEIGHT - 4; z += 6.5) { ctx.beginPath(); ctx.moveTo(1, z); ctx.lineTo(endLength - 1, z + 0.8); ctx.stroke(); }
  endIsoFace(ctx);

  ctx.restore();
}

// A bookcase never changes, so each one is painted once into a sprite (2x resolution) and then just blitted.
const SPRITE_W = 84; const SPRITE_H = 100; const SPRITE_OX = 48; const SPRITE_OY = 82; const SPRITE_SCALE = 2;
const spriteCache = new Map<string, HTMLCanvasElement | null>();

function bakeBookshelfSprite(seedX: number, seedY: number): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = SPRITE_W * SPRITE_SCALE; canvas.height = SPRITE_H * SPRITE_SCALE;
  const c = canvas.getContext('2d');
  if (!c) return null;
  c.scale(SPRITE_SCALE, SPRITE_SCALE); c.translate(SPRITE_OX, SPRITE_OY);
  paintBookshelf(c, 0, 0, seedX, seedY);
  return canvas;
}

/**
 * Wall-hugging bookcase. The books are drawn on the face itself (not on the screen), so every spine,
 * shelf and board is perfectly parallel to the bookcase. Books are deterministic per position, never flicker.
 */
export function drawBookshelf(ctx: CanvasRenderingContext2D, sx: number, sy: number): void {
  const key = `${sx}|${sy}`;
  let sprite = spriteCache.get(key);
  if (sprite === undefined) { sprite = bakeBookshelfSprite(sx, sy); spriteCache.set(key, sprite); }
  if (!sprite) { paintBookshelf(ctx, sx, sy, sx, sy); return; }
  ctx.drawImage(sprite, sx - SPRITE_OX, sy - SPRITE_OY, SPRITE_W, SPRITE_H);
}
