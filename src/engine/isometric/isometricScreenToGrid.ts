import { GridCoord } from './isometricTypes';

/**
 * Converts screen pixel coordinates back into 2D grid coordinates.
 * Inverts the 2:1 isometric projection matrix.
 * Structured with normalized offsets and cell bounds rounding.
 */
export function isometricScreenToGrid(
  screenX: number,
  screenY: number,
  tileWidth: number,
  tileHeight: number,
  originX: number,
  originY: number
): GridCoord {
  // Guard against invalid or NaN inputs
  const relX = (Number.isFinite(screenX) ? screenX : 0) - originX;
  const relY = (Number.isFinite(screenY) ? screenY : 0) - originY;
  const validTileW = tileWidth > 0 ? tileWidth : 64;
  const validTileH = tileHeight > 0 ? tileHeight : 32;

  // Invert the projection equations
  // relX = (x - y) * (W / 2) -> (2 * relX) / W = x - y
  // relY = (x + y) * (H / 2) -> (2 * relY) / H = x + y
  const termA = (2 * relX) / validTileW;
  const termB = (2 * relY) / validTileH;

  const calculatedX = (termA + termB) / 2;
  const calculatedY = (termB - termA) / 2;

  // Compute rounded cell index
  const resultGridX = Math.floor(calculatedX);
  const resultGridY = Math.floor(calculatedY);

  const resultCoord: GridCoord = {
    gridX: resultGridX,
    gridY: resultGridY,
  };

  return resultCoord;
}
