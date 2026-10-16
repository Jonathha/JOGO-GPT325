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
