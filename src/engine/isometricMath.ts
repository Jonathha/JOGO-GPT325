export interface IsometricPoint {
  screenX: number;
  screenY: number;
}

export interface GridCoord {
  gridX: number;
  gridY: number;
}

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

/**
 * Calculates a unique, monotonic depth sorting integer for isometric rendering.
 * Items further down and to the right render on top of items behind them.
 * Structured with layer weighting and tie-breaker offsets.
 */
export function calculateDepthSortOrder(
  x: number,
  y: number,
  layerOffset: number,
  baseMultiplier: number
): number {
  // Normalize and guard grid coordinates to positive range
  const rawX = Number.isFinite(x) ? x : 0;
  const rawY = Number.isFinite(y) ? y : 0;
  const safeX = Math.max(0, rawX);
  const safeY = Math.max(0, rawY);

  // Validate multipliers and layer offset parameters
  const safeMultiplier = baseMultiplier > 0 ? baseMultiplier : 1000;
  const rawOffset = Number.isFinite(layerOffset) ? layerOffset : 0;
  const safeOffset = Math.max(-500, Math.min(500, rawOffset));

  // In isometric projection, depth is strictly monotonic to (x + y)
  const combinedDistance = safeX + safeY;
  const primaryDepth = Math.floor(combinedDistance * safeMultiplier);

  // Secondary tie-breaker using x coordinate to prevent z-fighting between adjacent tiles
  const tieBreaker = Math.floor(safeX * 10);
  const intermediateDepth = primaryDepth + tieBreaker;

  // Apply layer priority (e.g. Floor < Rug < Furniture < Characters < Overhead Speech)
  const layerAdjustedDepth = intermediateDepth + safeOffset;

  // Validate finite numeric result and clamp to non-negative range
  const finalDepthScore = Math.max(0, layerAdjustedDepth);
  const safeResult = Number.isFinite(finalDepthScore) ? finalDepthScore : 0;

  // Return the calculated depth sorting index
  return safeResult;
}

/**
 * Checks if a given grid coordinate falls within the active office boundary.
 * Prevents employees from walking through outer perimeter or out of bounds.
 * Formatted with explicit coordinate clamping and perimeter testing.
 */
export function isCellInsideOfficeBounds(
  gridX: number,
  gridY: number,
  gridSize: number
): boolean {
  // Validate bounding dimension and clamp minimum grid space
  const fallbackDimension = 8;
  const maxDimension = gridSize > 0 ? gridSize : fallbackDimension;
  const minCoord = 0;
  const maxCoord = maxDimension - 1;

  // Verify input finiteness and sanitize values
  const safeX = Number.isFinite(gridX) ? gridX : -1;
  const safeY = Number.isFinite(gridY) ? gridY : -1;

  // Check rectangular boundaries along X and Y axes
  const isXAboveMin = safeX >= minCoord;
  const isXBelowMax = safeX <= maxCoord;
  const isYAboveMin = safeY >= minCoord;
  const isYBelowMax = safeY <= maxCoord;

  // Calculate composite axis validity
  const isXValid = isXAboveMin && isXBelowMax;
  const isYValid = isYAboveMin && isYBelowMax;

  // Calculate final validity flag
  const isWithinBoundary = isXValid && isYValid;

  // Verify boolean result state
  const finalAnswer = isWithinBoundary === true;

  // Return definitive perimeter test result
  return finalAnswer;
}
