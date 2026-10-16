import { OfficeTile } from '../../types/gameTypes';
import { gridToIsometricScreen } from '../isometricMath';

interface Caster { radius: number; height: number }

const CASTERS: Partial<Record<OfficeTile['type'], Caster>> = {
  DESK: { radius: 0.42, height: 26 },
  SERVER: { radius: 0.3, height: 60 },
  BOOKSHELF: { radius: 0.5, height: 56 },
  SOFA: { radius: 0.42, height: 22 },
  COFFEE: { radius: 0.34, height: 28 },
  WHITEBOARD: { radius: 0.4, height: 30 },
  PLANT: { radius: 0.2, height: 26 },
};
const LAMP_LIGHT_HEIGHT = 46;
const LIGHT_REACH = 3.6;
const MAX_SHADOW_LENGTH = 1.5;

/**
 * Bakes the soft shadows that each floor lamp throws behind nearby furniture. Shadows point away from
 * the lamp, get longer for taller objects and fade with distance. Meant for the static floor layer, so it costs nothing per frame.
 */
export function drawLampShadows(ctx: CanvasRenderingContext2D, tiles: OfficeTile[]): void {
  const lamps = tiles.filter((t) => t.type === 'LAMP');
  if (!lamps.length) return;
  ctx.save();
  tiles.forEach((tile) => {
    const caster = CASTERS[tile.type];
    if (!caster) return;
    const { screenX, screenY } = gridToIsometricScreen(tile.x, tile.y, 64, 32, 0, 0);
    lamps.forEach((lamp) => {
      const dx = tile.x - lamp.x; const dy = tile.y - lamp.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.4 || dist > LIGHT_REACH) return;
      const length = Math.min(MAX_SHADOW_LENGTH, (dist * caster.height) / Math.max(6, LAMP_LIGHT_HEIGHT - caster.height));
      const strength = 0.34 * Math.pow(1 - dist / LIGHT_REACH, 1.1);
      const angle = Math.atan2(dy, dx);
      ctx.save();
      ctx.translate(screenX, screenY); ctx.transform(32, 16, -32, 16, 0, 0); ctx.rotate(angle);
      [1, 0.8, 0.6].forEach((scale) => {
        ctx.fillStyle = `rgba(6,10,14,${strength * 0.42})`;
        ctx.beginPath(); ctx.ellipse(length / 2 + caster.radius * 0.3, 0, (caster.radius + length / 2) * scale, caster.radius * 0.95 * scale, 0, 0, Math.PI * 2); ctx.fill();
      });
      ctx.restore();
    });
  });
  ctx.restore();
}
