export interface LightSprite { canvas: HTMLCanvasElement; ox: number; oy: number }

let cached: LightSprite | null | undefined;

/**
 * Pre-renders one floor-lamp light (floor pool, cone from the shade, halo) into a sprite, once.
 * Drawing it each frame is a single drawImage, so the lamp light stays perfectly fluid.
 * The pool is drawn in grid space, so it is a true isometric ellipse.
 */
export function getLampLightSprite(): LightSprite | null {
  if (cached !== undefined) return cached;
  if (typeof document === 'undefined') { cached = null; return null; }
  const W = 240; const H = 240; const ox = 120; const oy = 176;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const c = canvas.getContext('2d');
  if (!c) { cached = null; return null; }

  // Floor pool (grid space => correct 2:1 ellipse)
  c.save(); c.translate(ox, oy); c.transform(32, 16, -32, 16, 0, 0);
  const pool = c.createRadialGradient(0, 0, 0, 0, 0, 1.75);
  pool.addColorStop(0, 'rgba(255,214,140,.34)'); pool.addColorStop(0.35, 'rgba(255,200,120,.17)'); pool.addColorStop(1, 'rgba(255,190,100,0)');
  c.fillStyle = pool; c.beginPath(); c.arc(0, 0, 1.75, 0, Math.PI * 2); c.fill();
  c.restore();

  // Cone of light from the shade down to the floor
  const cone = c.createLinearGradient(0, oy - 38, 0, oy);
  cone.addColorStop(0, 'rgba(255,228,170,.16)'); cone.addColorStop(1, 'rgba(255,214,140,.03)');
  c.fillStyle = cone;
  c.beginPath(); c.moveTo(ox - 10, oy - 36); c.lineTo(ox + 10, oy - 36); c.lineTo(ox + 52, oy + 2); c.lineTo(ox - 52, oy + 2); c.closePath(); c.fill();

  // Halo around the shade
  const halo = c.createRadialGradient(ox, oy - 42, 0, ox, oy - 42, 52);
  halo.addColorStop(0, 'rgba(255,230,170,.42)'); halo.addColorStop(0.45, 'rgba(255,214,140,.14)'); halo.addColorStop(1, 'rgba(255,214,140,0)');
  c.fillStyle = halo; c.beginPath(); c.arc(ox, oy - 42, 52, 0, Math.PI * 2); c.fill();

  cached = { canvas, ox, oy };
  return cached;
}
