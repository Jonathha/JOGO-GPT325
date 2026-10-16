import { isoPoint } from './isoPoint';

export interface IsoPrismBox { gx0: number; gx1: number; gy0: number; gy1: number; z0: number; z1: number }
export interface IsoPrismColors { top: string; faceX: string; faceY: string; edge?: string }

/**
 * Draws a box in true isometric grid units. faceX is the face looking towards +x (lower-right),
 * faceY is the face looking towards +y (lower-left). Every edge follows the grid, so nothing looks crooked.
 */
export function drawIsoPrism(ctx: CanvasRenderingContext2D, cx: number, cy: number, box: IsoPrismBox, colors: IsoPrismColors): void {
  const { gx0, gx1, gy0, gy1, z0, z1 } = box;
  const poly = (pts: Array<[number, number]>, fill: string) => {
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = colors.edge ?? 'rgba(8,16,13,.8)'; ctx.lineWidth = 0.8; ctx.stroke();
  };
  poly([isoPoint(cx, cy, gx0, gy1, z0), isoPoint(cx, cy, gx1, gy1, z0), isoPoint(cx, cy, gx1, gy1, z1), isoPoint(cx, cy, gx0, gy1, z1)], colors.faceY);
  poly([isoPoint(cx, cy, gx1, gy0, z0), isoPoint(cx, cy, gx1, gy1, z0), isoPoint(cx, cy, gx1, gy1, z1), isoPoint(cx, cy, gx1, gy0, z1)], colors.faceX);
  poly([isoPoint(cx, cy, gx0, gy0, z1), isoPoint(cx, cy, gx1, gy0, z1), isoPoint(cx, cy, gx1, gy1, z1), isoPoint(cx, cy, gx0, gy1, z1)], colors.top);
}
