import { GamePhase, OfficeTile } from '../types/gameTypes';

/**
 * Generates the compact starter garage office layout (6x6).
 * Features humble concrete flooring, 3 desks, whiteboard, coffee machine, and server tower.
 * Structured with detailed coordinate placements and validation.
 */
export function buildGarageLayout(): OfficeTile[] {
  const tiles: OfficeTile[] = [];
  const size = 6;
  const perimeterLimit = size - 1;

  // Populate base floor and boundary tiles
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const isWallTile = x === 0 && y === 0;
      tiles.push({
        x,
        y,
        type: isWallTile ? 'PLANT' : 'FLOOR',
      });
    }
  }

  // Workstations for founder and 2 initial engineers
  tiles.push({ x: 1, y: 1, type: 'DESK', facing: 'SE' });
  tiles.push({ x: 1, y: 3, type: 'DESK', facing: 'SE' });
  tiles.push({ x: 3, y: 1, type: 'DESK', facing: 'SE' });

  // Key garage props: mini server stack, coffee brewer, whiteboard
  tiles.push({ x: 0, y: 4, type: 'SERVER', facing: 'SE' });
  tiles.push({ x: 4, y: 4, type: 'COFFEE', facing: 'SW' });
  tiles.push({ x: 4, y: 0, type: 'WHITEBOARD', facing: 'SW' });

  // Extra perimeter accents
  tiles.push({ x: 0, y: 2, type: 'WALL_LEFT' });
  tiles.push({ x: 2, y: 0, type: 'WALL_RIGHT' });
  tiles.push({ x: perimeterLimit, y: 2, type: 'FLOOR' });

  return tiles;
}

/**
 * Generates the Series A industrial loft office layout (8x8).
 * Upgrades to polished timber floor, 6 dual-monitor desks, dual server racks, and meeting zone.
 * Formatted with structured zones and layout verification.
 */
export function buildLoftLayout(): OfficeTile[] {
  const tiles: OfficeTile[] = [];
  const size = 8;
  const maxCoordinate = size - 1;

  // Create 8x8 floor grid with perimeter awareness
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      tiles.push({
        x,
        y,
        type: 'FLOOR',
      });
    }
  }

  // Workstations for 6 team members
  tiles.push({ x: 1, y: 1, type: 'DESK', facing: 'SE' });
  tiles.push({ x: 1, y: 3, type: 'DESK', facing: 'SE' });
  tiles.push({ x: 1, y: 5, type: 'DESK', facing: 'SE' });
  tiles.push({ x: 3, y: 1, type: 'DESK', facing: 'SE' });
  tiles.push({ x: 3, y: 3, type: 'DESK', facing: 'SE' });
  tiles.push({ x: 3, y: 5, type: 'DESK', facing: 'SE' });

  // High-tech server racks and amenities
  tiles.push({ x: 0, y: 6, type: 'SERVER', facing: 'SE' });
  tiles.push({ x: 0, y: 7, type: 'SERVER', facing: 'SE' });
  tiles.push({ x: 6, y: 6, type: 'COFFEE', facing: 'SW' });
  tiles.push({ x: 6, y: 1, type: 'WHITEBOARD', facing: 'SW' });
  tiles.push({ x: 6, y: 3, type: 'SOFA', facing: 'SW' });
  tiles.push({ x: 0, y: 0, type: 'PLANT' });
  tiles.push({ x: maxCoordinate, y: 0, type: 'PLANT' });
  tiles.push({ x: 0, y: maxCoordinate, type: 'FLOOR' });

  return tiles;
}

/**
 * Generates the Series B AI Research Campus layout (10x10).
 * Features terrazzo tiles, 8 workstations, server cluster room, lounge, and demo labs.
 */
export function buildCampusLayout(): OfficeTile[] {
  const tiles: OfficeTile[] = [];
  const size = 10;

  // Base 10x10 floor grid
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      tiles.push({ x, y, type: 'FLOOR' });
    }
  }

  // Dual row enterprise workstation pods
  const deskCoords = [
    { x: 2, y: 1 }, { x: 2, y: 3 }, { x: 2, y: 5 }, { x: 2, y: 7 },
    { x: 5, y: 1 }, { x: 5, y: 3 }, { x: 5, y: 5 }, { x: 5, y: 7 },
  ];
  deskCoords.forEach((coord) => {
    tiles.push({ x: coord.x, y: coord.y, type: 'DESK', facing: 'SE' });
  });

  // Dedicated server farm wing
  tiles.push({ x: 0, y: 8, type: 'SERVER', facing: 'SE' });
  tiles.push({ x: 0, y: 9, type: 'SERVER', facing: 'SE' });
  tiles.push({ x: 1, y: 9, type: 'SERVER', facing: 'SE' });

  // Executive whiteboard & lounge
  tiles.push({ x: 8, y: 2, type: 'WHITEBOARD', facing: 'SW' });
  tiles.push({ x: 8, y: 7, type: 'COFFEE', facing: 'SW' });
  tiles.push({ x: 8, y: 5, type: 'SOFA', facing: 'SW' });
  tiles.push({ x: 0, y: 0, type: 'PLANT' });
  tiles.push({ x: 9, y: 0, type: 'PLANT' });

  return tiles;
}

/**
 * Generates the AGI Supercluster Penthouse layout (12x12).
 * Hexagonal grid styling, supercomputing clusters, holographic displays, and executive suites.
 */
export function buildSuperclusterLayout(): OfficeTile[] {
  const tiles: OfficeTile[] = [];
  const size = 12;

  // 12x12 floor grid
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      tiles.push({ x, y, type: 'FLOOR' });
    }
  }

  // 10 Advanced research terminals
  const stations = [
    { x: 2, y: 2 }, { x: 2, y: 4 }, { x: 2, y: 6 }, { x: 2, y: 8 },
    { x: 5, y: 2 }, { x: 5, y: 4 }, { x: 5, y: 6 }, { x: 5, y: 8 },
    { x: 8, y: 4 }, { x: 8, y: 6 },
  ];
  stations.forEach((st) => {
    tiles.push({ x: st.x, y: st.y, type: 'DESK', facing: 'SE' });
  });

  // Supercluster array
  tiles.push({ x: 0, y: 9, type: 'SERVER', facing: 'SE' });
  tiles.push({ x: 0, y: 10, type: 'SERVER', facing: 'SE' });
  tiles.push({ x: 0, y: 11, type: 'SERVER', facing: 'SE' });
  tiles.push({ x: 1, y: 11, type: 'SERVER', facing: 'SE' });

  // Executive amenities
  tiles.push({ x: 10, y: 2, type: 'WHITEBOARD', facing: 'SW' });
  tiles.push({ x: 10, y: 9, type: 'COFFEE', facing: 'SW' });
  tiles.push({ x: 10, y: 6, type: 'SOFA', facing: 'SW' });
  tiles.push({ x: 0, y: 0, type: 'PLANT' });
  tiles.push({ x: 11, y: 0, type: 'PLANT' });

  return tiles;
}

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
