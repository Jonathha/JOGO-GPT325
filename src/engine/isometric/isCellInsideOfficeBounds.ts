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
