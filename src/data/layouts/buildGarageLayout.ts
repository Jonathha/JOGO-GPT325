import { OfficeTile } from '../../types/gameTypes';

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

  // Decor: rug, bookshelf, floor lamp
  tiles.push({ x: 2, y: 2, type: 'RUG' });
  tiles.push({ x: 2, y: 3, type: 'RUG' });
  tiles.push({ x: 3, y: 2, type: 'RUG' });
  tiles.push({ x: 3, y: 3, type: 'RUG' });
  tiles.push({ x: 0, y: 1, type: 'BOOKSHELF' });
  tiles.push({ x: 5, y: 3, type: 'LAMP' });

  return tiles;
}
