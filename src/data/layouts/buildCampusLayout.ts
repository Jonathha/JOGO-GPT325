import { OfficeTile } from '../../types/gameTypes';

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

  // Decor: lounge rug, bookshelves, lamps, plants
  tiles.push({ x: 7, y: 4, type: 'RUG' });
  tiles.push({ x: 7, y: 5, type: 'RUG' });
  tiles.push({ x: 7, y: 6, type: 'RUG' });
  tiles.push({ x: 8, y: 4, type: 'RUG' });
  tiles.push({ x: 8, y: 5, type: 'RUG' });
  tiles.push({ x: 8, y: 6, type: 'RUG' });
  tiles.push({ x: 9, y: 4, type: 'RUG' });
  tiles.push({ x: 9, y: 5, type: 'RUG' });
  tiles.push({ x: 9, y: 6, type: 'RUG' });
  tiles.push({ x: 0, y: 2, type: 'BOOKSHELF' });
  tiles.push({ x: 0, y: 3, type: 'BOOKSHELF' });
  tiles.push({ x: 0, y: 4, type: 'BOOKSHELF' });
  tiles.push({ x: 9, y: 3, type: 'LAMP' });
  tiles.push({ x: 9, y: 8, type: 'LAMP' });
  tiles.push({ x: 9, y: 9, type: 'PLANT' });
  tiles.push({ x: 4, y: 9, type: 'PLANT' });

  return tiles;
}
