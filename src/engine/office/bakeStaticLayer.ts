import { CompanyState, OfficeTile } from '../../types/gameTypes';
import { gridToIsometricScreen } from '../isometricMath';
import { drawBackWalls, drawFloorTile } from '../drawOfficeFloors';
import { drawRug } from '../drawOfficeFurniture';
import { drawLampShadows } from '../lighting/drawLampShadows';

export interface StaticLayer { phase: CompanyState['phase']; canvas: HTMLCanvasElement; minX: number; minY: number; w: number; h: number }

/** Renders the never-changing part of the office (floor, rugs, back walls) once, so each frame is a single drawImage. */
export function bakeStaticLayer(tiles: OfficeTile[], phase: CompanyState['phase'], size: number): StaticLayer | null {
  const S = 2;
  const minX = -size * 32 - 6; const minY = -110;
  const w = size * 64 + 12; const h = size * 32 + 134;
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(w * S); canvas.height = Math.ceil(h * S);
  const c = canvas.getContext('2d');
  if (!c) return null;
  c.scale(S, S); c.translate(-minX, -minY);
  tiles.forEach((tile) => {
    if (tile.type === 'WALL_LEFT' || tile.type === 'WALL_RIGHT') return;
    const { screenX, screenY } = gridToIsometricScreen(tile.x, tile.y, 64, 32, 0, 0);
    drawFloorTile(c, screenX, screenY, 64, 32, phase, tile.x, tile.y, 0);
  });
  tiles.forEach((tile) => {
    if (tile.type !== 'RUG') return;
    const { screenX, screenY } = gridToIsometricScreen(tile.x, tile.y, 64, 32, 0, 0);
    drawRug(c, screenX, screenY, 64, 32, phase, tile.x, tile.y);
  });
  drawLampShadows(c, tiles);
  drawBackWalls(c, size, 64, 32, phase, 0);
  return { phase, canvas, minX, minY, w, h };
}
