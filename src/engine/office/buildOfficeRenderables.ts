import { CompanyState, OfficeTile } from '../../types/gameTypes';
import { gridToIsometricScreen } from '../isometricMath';
import { drawBookshelf, drawCoffeeStation, drawDeskStation, drawFloorLamp, drawLoungeAndDecor, drawServerRack, drawWhiteboard } from '../drawOfficeFurniture';
import { drawCharacterModel } from '../drawCharacters';

export interface Renderable { depth: number; draw: () => void }

/** Collects furniture and employees into one list sorted by isometric depth (back to front). */
export function buildOfficeRenderables(
  ctx: CanvasRenderingContext2D, tiles: OfficeTile[], state: CompanyState, animTime: number, tileW: number, tileH: number
): Renderable[] {
  const renderables: Renderable[] = [];
  tiles.forEach((tile) => {
    const { screenX, screenY } = gridToIsometricScreen(tile.x, tile.y, tileW, tileH, 0, 0);
    const depth = tile.x + tile.y;
    if (tile.type === 'DESK') {
      const hasWorker = state.employees.some((e) => Math.round(e.x) === tile.x && Math.round(e.y) === tile.y);
      renderables.push({ depth, draw: () => drawDeskStation(ctx, screenX, screenY, animTime, hasWorker) });
    } else if (tile.type === 'SERVER') {
      const loadRatio = Math.min(1.0, state.hardware.totalTeraflops / 10000);
      renderables.push({ depth, draw: () => drawServerRack(ctx, screenX, screenY, animTime, loadRatio) });
    } else if (tile.type === 'COFFEE') {
      renderables.push({ depth, draw: () => drawCoffeeStation(ctx, screenX, screenY, animTime) });
    } else if (tile.type === 'WHITEBOARD') {
      renderables.push({ depth, draw: () => drawWhiteboard(ctx, screenX, screenY, animTime) });
    } else if (tile.type === 'SOFA') {
      renderables.push({ depth, draw: () => drawLoungeAndDecor(ctx, screenX, screenY, 'SOFA', animTime) });
    } else if (tile.type === 'PLANT') {
      renderables.push({ depth, draw: () => drawLoungeAndDecor(ctx, screenX, screenY, 'PLANT', animTime) });
    } else if (tile.type === 'LAMP') {
      renderables.push({ depth, draw: () => drawFloorLamp(ctx, screenX, screenY, animTime) });
    } else if (tile.type === 'BOOKSHELF') {
      renderables.push({ depth, draw: () => drawBookshelf(ctx, screenX, screenY) });
    }
  });
  state.employees.forEach((emp) => {
    const { screenX, screenY } = gridToIsometricScreen(emp.x, emp.y, tileW, tileH, 0, 0);
    const isSelected = state.selectedWorkerId === emp.id;
    renderables.push({ depth: emp.x + emp.y + 0.01, draw: () => drawCharacterModel(ctx, screenX, screenY + (emp.state === 'TYPING' ? -2 : 0), emp, animTime, isSelected) });
  });
  return renderables.sort((a, b) => a.depth - b.depth);
}
