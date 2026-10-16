import { OfficeTile } from '../../types/gameTypes';

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

  // Decor: lounge rug, bookshelves, lamps, plants
  tiles.push({ x: 9, y: 5, type: 'RUG' });
  tiles.push({ x: 9, y: 6, type: 'RUG' });
  tiles.push({ x: 9, y: 7, type: 'RUG' });
  tiles.push({ x: 10, y: 5, type: 'RUG' });
  tiles.push({ x: 10, y: 6, type: 'RUG' });
  tiles.push({ x: 10, y: 7, type: 'RUG' });
  tiles.push({ x: 11, y: 5, type: 'RUG' });
  tiles.push({ x: 11, y: 6, type: 'RUG' });
  tiles.push({ x: 11, y: 7, type: 'RUG' });
  tiles.push({ x: 0, y: 2, type: 'BOOKSHELF' });
  tiles.push({ x: 0, y: 3, type: 'BOOKSHELF' });
  tiles.push({ x: 0, y: 4, type: 'BOOKSHELF' });
  tiles.push({ x: 0, y: 5, type: 'BOOKSHELF' });
  tiles.push({ x: 11, y: 4, type: 'LAMP' });
  tiles.push({ x: 11, y: 8, type: 'LAMP' });
  tiles.push({ x: 11, y: 11, type: 'PLANT' });
  tiles.push({ x: 6, y: 11, type: 'PLANT' });

  return tiles;
}
