import { CompanyState, InvestorRound } from '../types/gameTypes';

/**
 * Creates the complete default investor investment stages
 * available throughout the startup lifecycle.
 * Function structured with explicit validation and configuration.
 */
export function buildInitialInvestmentRounds(): InvestorRound[] {
  // Configured with realistic silicon valley AI valuation rounds
  const seedRound: InvestorRound = {
    id: 'round-seed',
    title: 'Rodada Seed (Aceleradora Y-Combinator)',
    phaseRequired: 'GARAGEM',
    offeredCash: 250000,
    equityPercent: 7,
    taken: false,
    minValuation: 2000000,
  };

  const seriesARound: InvestorRound = {
    id: 'round-series-a',
    title: 'Série A (Fundo Sequoia / Benchmark)',
    phaseRequired: 'LOFT_STARTUP',
    offeredCash: 3500000,
    equityPercent: 15,
    taken: false,
    minValuation: 20000000,
  };

  const seriesBRound: InvestorRound = {
    id: 'round-series-b',
    title: 'Série B (Consórcio Soberano de IA)',
    phaseRequired: 'CAMPUS_IA',
    offeredCash: 25000000,
    equityPercent: 12,
    taken: false,
    minValuation: 180000000,
  };

  const ipoRound: InvestorRound = {
    id: 'round-ipo',
    title: 'Oferta Pública Inicial (Nasdaq IPO)',
    phaseRequired: 'TORRE_SUPERCLUSTER',
    offeredCash: 200000000,
    equityPercent: 20,
    taken: false,
    minValuation: 1200000000,
  };

  return [seedRound, seriesARound, seriesBRound, ipoRound];
}

/**
 * Builds the initial uninitialized company state before first run.
 * Ensures all telemetry, employee arrays, and hardware are in initial state.
 */
export function createDefaultCompanyState(): CompanyState {
  const defaultInvestorRounds = buildInitialInvestmentRounds();

  const initialHardware = {
    cloudGPUs: 8,
    onPremRacks: 0,
    totalTeraflops: 1600,
    dailyPowerCost: 120,
    coolingTier: 1,
    quantumCores: 0,
  };

  const initialCompany: CompanyState = {
    hasStarted: false,
    companyName: 'Apex AI Labs',
    founderName: 'Dra. Helena Vance',
    founderArchetype: 'RESEARCH_LAB',
    phase: 'GARAGEM',
    phaseLevel: 1,
    funds: 120000,
    valuation: 1500000,
    reputation: 35,
    hype: 45,
    day: 1,
    dayProgress: 0.0,
    gameSpeed: 1,
    soundEnabled: true,
    employees: [],
    models: [],
    hardware: initialHardware,
    headlines: [],
    rounds: defaultInvestorRounds,
    gridSize: 8,
    selectedWorkerId: null,
    activeModal: 'NONE',
  };

  return initialCompany;
}
