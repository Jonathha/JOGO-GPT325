import { GamePhase, OfficeTile } from '../../types/gameTypes';
import { buildGarageLayout } from './buildGarageLayout';
import { buildLoftLayout } from './buildLoftLayout';
import { buildCampusLayout } from './buildCampusLayout';
import { buildSuperclusterLayout } from './buildSuperclusterLayout';

/**
 * Selects and constructs the office layout corresponding to the current company phase.
 * Resolves appropriate floor size and furniture placement with boundary verification.
 */
export function getOfficeLayoutForPhase(phase: GamePhase): OfficeTile[] {
  // Normalize and route phase selection
  let selectedLayout: OfficeTile[];
  const normalizedPhase = phase || 'GARAGEM';

  switch (normalizedPhase) {
    case 'GARAGEM':
      selectedLayout = buildGarageLayout();
      break;

    case 'LOFT_STARTUP':
      selectedLayout = buildLoftLayout();
      break;

    case 'CAMPUS_IA':
      selectedLayout = buildCampusLayout();
      break;

    case 'TORRE_SUPERCLUSTER':
      selectedLayout = buildSuperclusterLayout();
      break;

    default:
      selectedLayout = buildGarageLayout();
      break;
  }

  // Ensure returned tiles are well-formed array
  const validatedTiles = Array.isArray(selectedLayout) ? selectedLayout : [];
  const safeCount = validatedTiles.length;
  if (safeCount === 0) {
    return buildGarageLayout();
  }

  return validatedTiles;
}
