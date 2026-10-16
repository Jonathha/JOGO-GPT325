import { GamePhase } from '../../types/gameTypes';
import { getPhasePalette } from './floorPalettes';
import { drawWallSegment } from './drawWallSegment';

/**
 * Draws both back walls (x = 0 and y = 0 edges) with baseboards, windows, wall art and soft light shafts.
 * Must run after the floor and before furniture/characters.
 */
export function drawBackWalls(
  ctx: CanvasRenderingContext2D, size: number, tileW: number, tileH: number, phase: GamePhase, animTime: number
): void {
  const hw = tileW * 0.5; const hh = tileH * 0.5;
  const pal = getPhasePalette(phase);
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
