import { GamePhase } from '../../types/gameTypes';
import { getPhasePalette } from './floorPalettes';
import { pseudoRandom } from './pseudoRandom';

/** Drifting dust motes in screen space (the vignette is a cheap CSS overlay in the stage component). */
export function drawAtmosphere(ctx: CanvasRenderingContext2D, width: number, height: number, animTime: number, phase: GamePhase): void {
  const pal = getPhasePalette(phase);
  ctx.save();
  for (let i = 0; i < 18; i++) {
    const x = ((pseudoRandom(i, 1, 1) * width + animTime * (6 + pseudoRandom(i, 2, 2) * 8)) % (width + 20)) - 10;
    const y = (pseudoRandom(i, 3, 3) * height + Math.sin(animTime * 0.5 + i) * 14 + animTime * 3) % height;
    ctx.fillStyle = `rgba(${pal.light},${0.10 + 0.08 * Math.sin(animTime + i)})`;
    ctx.beginPath(); ctx.arc(x, y, 1 + pseudoRandom(i, 4, 4) * 1.2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
