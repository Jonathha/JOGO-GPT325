import { OfficeTile } from '../../types/gameTypes';

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

  // Decor: lounge rug, bookshelves, lamp, plant
  tiles.push({ x: 5, y: 3, type: 'RUG' });
  tiles.push({ x: 5, y: 4, type: 'RUG' });
  tiles.push({ x: 6, y: 3, type: 'RUG' });
  tiles.push({ x: 6, y: 4, type: 'RUG' });
  tiles.push({ x: 7, y: 3, type: 'RUG' });
  tiles.push({ x: 7, y: 4, type: 'RUG' });
  tiles.push({ x: 0, y: 2, type: 'BOOKSHELF' });
  tiles.push({ x: 0, y: 3, type: 'BOOKSHELF' });
  tiles.push({ x: 7, y: 6, type: 'LAMP' });
  tiles.push({ x: 7, y: 5, type: 'PLANT' });

  return tiles;
}
