import { CompanyState } from '../../types/gameTypes';

/** Number of tiles per side of the office floor for each company phase. */
export function getGridSizeForPhase(phase: CompanyState['phase']): number {
  return phase === 'GARAGEM' ? 6 : phase === 'LOFT_STARTUP' ? 8 : phase === 'CAMPUS_IA' ? 10 : 12;
}
