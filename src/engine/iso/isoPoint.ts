export const ISO_HALF_W = 32;
export const ISO_HALF_H = 16;

/** Projects a point given in tile-relative grid units (and height in px) around a tile centre to screen space. */
export function isoPoint(cx: number, cy: number, gx: number, gy: number, z = 0): [number, number] {
  return [cx + (gx - gy) * ISO_HALF_W, cy + (gx + gy) * ISO_HALF_H - z];
}
