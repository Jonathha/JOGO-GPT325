import { GamePhase } from '../../types/gameTypes';

export interface PhasePalette {
  floorA: string; floorB: string; line: string;
  wallLeft: string; wallRight: string; baseboard: string;
  skyTop: string; skyBottom: string; light: string;
}

const PALETTES: Record<string, PhasePalette> = {
  GARAGEM: { floorA: '#3a4656', floorB: '#334155', line: '#4b5a6e', wallLeft: '#2d384a', wallRight: '#212b3b', baseboard: '#111827', skyTop: '#33466b', skyBottom: '#1b2a4a', light: '255,226,170' },
  LOFT_STARTUP: { floorA: '#94591a', floorB: '#7f4c14', line: '#b9791f', wallLeft: '#7c3f2a', wallRight: '#5c2e1f', baseboard: '#2a140c', skyTop: '#5b7fa8', skyBottom: '#f2b36b', light: '255,214,150' },
  CAMPUS_IA: { floorA: '#233049', floorB: '#1a2438', line: '#3b4b68', wallLeft: '#2a3a58', wallRight: '#1c2940', baseboard: '#0d1524', skyTop: '#3b82c4', skyBottom: '#8ecbf0', light: '220,240,255' },
  TORRE_SUPERCLUSTER: { floorA: '#070c18', floorB: '#0b1224', line: '#38bdf8', wallLeft: '#0d1730', wallRight: '#080f20', baseboard: '#020617', skyTop: '#050b22', skyBottom: '#12306b', light: '120,200,255' },
};

export function getPhasePalette(phase: GamePhase): PhasePalette {
  return PALETTES[phase] ?? PALETTES.GARAGEM;
}
