import { ISO_HALF_H, ISO_HALF_W, isoPoint } from './isoPoint';

/** Length in px of one tile edge on screen. Face-space coordinates use 1 unit = 1 px along the face. */
export const ISO_EDGE_PX = Math.hypot(ISO_HALF_W, ISO_HALF_H);

/**
 * Starts drawing on the face looking towards +x (lower-right). Afterwards (0,0) is the face's bottom-left corner,
 * x grows along the face and y grows UP, so plain fillRect calls land perfectly aligned on the face.
 * Always pair with endIsoFace().
 */
export function beginIsoFaceX(ctx: CanvasRenderingContext2D, cx: number, cy: number, gx: number, gyStart: number, z = 0): void {
  const [ox, oy] = isoPoint(cx, cy, gx, gyStart, z);
  ctx.save(); ctx.translate(ox, oy);
  ctx.transform(-ISO_HALF_W / ISO_EDGE_PX, ISO_HALF_H / ISO_EDGE_PX, 0, -1, 0, 0);
}

/** Same as beginIsoFaceX, for the face looking towards +y (lower-left). */
export function beginIsoFaceY(ctx: CanvasRenderingContext2D, cx: number, cy: number, gy: number, gxStart: number, z = 0): void {
  const [ox, oy] = isoPoint(cx, cy, gxStart, gy, z);
  ctx.save(); ctx.translate(ox, oy);
  ctx.transform(ISO_HALF_W / ISO_EDGE_PX, ISO_HALF_H / ISO_EDGE_PX, 0, -1, 0, 0);
}

export function endIsoFace(ctx: CanvasRenderingContext2D): void {
  ctx.restore();
}
