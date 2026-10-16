import { OfficeTile } from '../../types/gameTypes';
import { gridToIsometricScreen } from '../isometricMath';
import { isoPoint } from '../iso/isoPoint';
import { getLampLightSprite } from './lampLightSprite';

/** Adds every lamp's light on top of the scene (additive), with a gentle, smooth flicker. Light never spills outside the office floor. */
export function drawLampLights(ctx: CanvasRenderingContext2D, tiles: OfficeTile[], animTime: number, gridSize: number): void {
  const sprite = getLampLightSprite();
  if (!sprite) return;
  ctx.save();
  const half = gridSize - 0.5;
  const left = isoPoint(0, 0, -0.5, half); const bottom = isoPoint(0, 0, half, half); const right = isoPoint(0, 0, half, -0.5);
  ctx.beginPath();
  ctx.moveTo(left[0], left[1]); ctx.lineTo(bottom[0], bottom[1]); ctx.lineTo(right[0], right[1]);
  ctx.lineTo(right[0], right[1] - 110); ctx.lineTo(left[0], left[1] - 110); ctx.closePath(); ctx.clip();
  ctx.globalCompositeOperation = 'lighter';
  ctx.imageSmoothingEnabled = true;
  tiles.forEach((tile) => {
    if (tile.type !== 'LAMP') return;
    const { screenX, screenY } = gridToIsometricScreen(tile.x, tile.y, 64, 32, 0, 0);
    const phase = tile.x * 1.7 + tile.y * 2.3;
    ctx.globalAlpha = 0.92 + 0.045 * Math.sin(animTime * 2.1 + phase) + 0.025 * Math.sin(animTime * 5.3 + phase * 1.7);
    ctx.drawImage(sprite.canvas, screenX - sprite.ox, screenY - sprite.oy);
  });
  ctx.restore();
}
