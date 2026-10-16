import { GamePhase } from '../types/gameTypes';

/**
 * Draws an isometric diamond floor tile tailored to the company phase.
 * Garagem = polished concrete; Loft = oak hardwood; Campus = white terrazzo; Supercluster = carbon hex.
 */
export function drawFloorTile(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  tileW: number,
  tileH: number,
  phase: GamePhase
): void {
  const halfW = tileW * 0.5;
  const halfH = tileH * 0.5;

  // Resolve palette based on company scale
  const isGarage = phase === 'GARAGEM';
  const isLoft = phase === 'LOFT_STARTUP';
  const isCampus = phase === 'CAMPUS_IA';
  const topColor = isGarage ? '#334155' : isLoft ? '#854d0e' : isCampus ? '#0f172a' : '#020617';
  const strokeColor = isGarage ? '#475569' : isLoft ? '#a16207' : isCampus ? '#1e293b' : '#38bdf8';

  // Draw 2:1 isometric diamond path
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(sx, sy - halfH);
  ctx.lineTo(sx + halfW, sy);
  ctx.lineTo(sx, sy + halfH);
  ctx.lineTo(sx - halfW, sy);
  ctx.closePath();

  ctx.fillStyle = topColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Subtle interior tile highlight
  ctx.beginPath();
  ctx.moveTo(sx - halfW + 4, sy);
  ctx.lineTo(sx, sy - halfH + 2);
  ctx.lineTo(sx + halfW - 4, sy);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws perimeter architectural walls for the isometric office stage.
 * Provides depth and realistic room boundaries based on company phase.
 */
export function drawPerimeterWalls(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  tileW: number,
  tileH: number,
  phase: GamePhase
): void {
  const halfW = tileW * 0.5;
  const halfH = tileH * 0.5;
  const wallHeight = 44;

  const isGarage = phase === 'GARAGEM';
  const isLoft = phase === 'LOFT_STARTUP';
  const wallFillLeft = isGarage ? '#1e293b' : isLoft ? '#78350f' : '#090d16';
  const wallFillRight = isGarage ? '#0f172a' : isLoft ? '#451a03' : '#030712';

  ctx.save();
  // Left wall facet
  ctx.beginPath();
  ctx.moveTo(sx - halfW, sy);
  ctx.lineTo(sx, sy + halfH);
  ctx.lineTo(sx, sy + halfH - wallHeight);
  ctx.lineTo(sx - halfW, sy - wallHeight);
  ctx.closePath();
  ctx.fillStyle = wallFillLeft;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Right wall facet
  ctx.beginPath();
  ctx.moveTo(sx, sy + halfH);
  ctx.lineTo(sx + halfW, sy);
  ctx.lineTo(sx + halfW, sy - wallHeight);
  ctx.lineTo(sx, sy + halfH - wallHeight);
  ctx.closePath();
  ctx.fillStyle = wallFillRight;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}
