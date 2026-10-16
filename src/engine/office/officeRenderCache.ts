import { CompanyState, OfficeTile } from '../../types/gameTypes';
import { StaticLayer } from './bakeStaticLayer';

/** Per-stage cache so the layout and the baked static layer are rebuilt only when the office phase changes. */
export interface OfficeRenderCache {
  layout: { phase: CompanyState['phase']; tiles: OfficeTile[] } | null;
  layer: StaticLayer | null;
}

export function createOfficeRenderCache(): OfficeRenderCache {
  return { layout: null, layer: null };
}
