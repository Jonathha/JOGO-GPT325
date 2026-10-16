import { CompanyState } from '../../types/gameTypes';
import { getOfficeLayoutForPhase } from '../../data/officeLayouts';
import { gridToIsometricScreen } from '../isometricMath';
import { drawAtmosphere } from '../drawOfficeFloors';
import { drawOverheadStatusBubble } from '../drawCharacterBubbles';
import { bakeStaticLayer } from './bakeStaticLayer';
import { buildOfficeRenderables } from './buildOfficeRenderables';
import { getGridSizeForPhase } from './getGridSizeForPhase';
import { OfficeRenderCache } from './officeRenderCache';

export interface OfficeCameraState { offsetX: number; offsetY: number; zoom: number }

const TILE_W = 64;
const TILE_H = 32;

/** Draws one complete frame of the isometric office onto the canvas. */
export function renderOfficeFrame(
  ctx: CanvasRenderingContext2D, viewWidth: number, viewHeight: number,
  state: CompanyState, camera: OfficeCameraState, cache: OfficeRenderCache, animTime: number
): void {
  if (!cache.layout || cache.layout.phase !== state.phase) {
    cache.layout = { phase: state.phase, tiles: getOfficeLayoutForPhase(state.phase) };
  }
  const tiles = cache.layout.tiles;
  const gridSize = getGridSizeForPhase(state.phase);

  ctx.clearRect(0, 0, viewWidth, viewHeight);
  ctx.save();
  ctx.translate(camera.offsetX, camera.offsetY);
  ctx.scale(camera.zoom, camera.zoom);

  // 1-2. Floor, rugs and back walls come from a cached layer (rebuilt only when the office phase changes)
  if (!cache.layer || cache.layer.phase !== state.phase) {
    cache.layer = bakeStaticLayer(tiles, state.phase, gridSize);
  }
  const layer = cache.layer;
  if (layer) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(layer.canvas, layer.minX, layer.minY, layer.w, layer.h);
  }

  // 3. Furniture and employees share one depth-sorted pass so nobody is drawn in front of things they stand behind
  buildOfficeRenderables(ctx, tiles, state, animTime, TILE_W, TILE_H).forEach((item) => item.draw());

  // 4. Overhead activity bubbles always on top
  state.employees.forEach((emp) => {
    const { screenX, screenY } = gridToIsometricScreen(emp.x, emp.y, TILE_W, TILE_H, 0, 0);
    drawOverheadStatusBubble(ctx, screenX, screenY, emp, animTime);
  });

  ctx.restore();
  drawAtmosphere(ctx, viewWidth, viewHeight, animTime, state.phase);
}
