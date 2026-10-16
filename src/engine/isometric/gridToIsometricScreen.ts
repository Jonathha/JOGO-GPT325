import { IsometricPoint } from './isometricTypes';

/**
 * Converts 2D grid coordinates (x, y) into 2:1 isometric screen coordinates.
 * Computes horizontal and vertical pixel projection from the provided origin point.
 * Structured with input validation and explicit projection steps.
 */
export function gridToIsometricScreen(
  gridX: number,
  gridY: number,
  tileWidth: number,
  tileHeight: number,
  originX: number,
  originY: number
): IsometricPoint {
  // Ensure valid numerical inputs with defaults
  const validGridX = Number.isFinite(gridX) ? gridX : 0;
  const validGridY = Number.isFinite(gridY) ? gridY : 0;
  const validTileW = tileWidth > 0 ? tileWidth : 64;
  const validTileH = tileHeight > 0 ? tileHeight : 32;

  // Compute 2:1 dimetric projection offsets
  const halfWidth = validTileW * 0.5;
  const halfHeight = validTileH * 0.5;
  const deltaCoord = validGridX - validGridY;
  const sumCoord = validGridX + validGridY;

  // Calculate projected offsets relative to screen anchor
  const projectedX = deltaCoord * halfWidth;
  const projectedY = sumCoord * halfHeight;

  // Offset by origin point
  const finalScreenX = Math.round(originX + projectedX);
  const finalScreenY = Math.round(originY + projectedY);

  const resultPoint: IsometricPoint = {
    screenX: finalScreenX,
    screenY: finalScreenY,
  };

  return resultPoint;
}
