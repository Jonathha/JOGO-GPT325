export type GamePhase = 'GARAGEM' | 'LOFT_STARTUP' | 'CAMPUS_IA' | 'TORRE_SUPERCLUSTER';

export type ArchetypeId = 'RESEARCH_LAB' | 'AUTONOMOUS_AGENTS' | 'MULTIMODAL_FRONTIER' | 'SILICON_CHIPS';

export type EmployeeRole =
  | 'CHIEF_SCIENTIST'
  | 'ML_ENGINEER'
  | 'ALIGNMENT_RESEARCHER'
  | 'CUDA_ARCHITECT'
  | 'PRODUCT_LEAD';

export type EmployeeState = 'TYPING' | 'WALKING' | 'COFFEE' | 'WHITEBOARD' | 'SERVER_CHECK';

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  roleName: string;
  skill: number; // 1 to 100
  morale: number; // 0 to 100
  salaryPerDay: number;
  avatarSeed: number;
  avatarColor: string;
  state: EmployeeState;
  x: number; // isometric cell coordinate
  y: number;
  targetX: number;
  targetY: number;
  deskIndex: number;
  assignedProjectId: string | null;
  stateTimer: number;
}

export type ArchitectureType = 'TRANSFORMER_DENSE' | 'MOE_SPARSE' | 'REASONING_RL' | 'DIFFUSION_VISION';

export type TrainingStrategy = 'FROM_SCRATCH' | 'FINE_TUNE' | 'CONTINUED' | 'DISTILLATION';
export type TrainingStage = 'DATA_PREPARATION' | 'PRETRAINING' | 'POST_TRAINING' | 'EVALUATION' | 'READY';

export interface ModelProject {
  id: string;
  name: string;
  paramSize: string; // "7B", "14B", "70B", "405B", "1.2T MoE"
  paramsBillion: number;
  architecture: ArchitectureType;
  architectureName: string;
  trainingStrategy: TrainingStrategy;
  trainingStage: TrainingStage;
  version: number;
  baseModelId: string | null;
  baseModelName: string | null;
  computeNeededFlops: number;
  computeInvestedFlops: number;
  trainingProgress: number; // 0 to 100%
  currentLoss: number;
  initialLoss: number;
  isCompleted: boolean;
  mmluScore: number; // current evaluated estimate
  codingScore: number;
  mathScore: number;
  targetMmluScore: number;
  targetCodingScore: number;
  targetMathScore: number;
  dailyApiRevenue: number;
  activeUsers: number;
  dailyNewUsers: number;
  isReleased: boolean;
  pricingMode: 'UNRELEASED' | 'FREE' | 'PAID';
  pricePerMillionInput: number;
  pricePerMillionOutput: number;
  dailyInferenceCost: number;
  hypeBoost: number;
  creationDay: number;
}

export interface HardwareSetup {
  cloudGPUs: number; // Cloud H100 rented
  onPremRacks: number; // Physical B200 racks
  totalTeraflops: number;
  dailyPowerCost: number;
  coolingTier: number;
  quantumCores: number;
}

export interface NewsHeadline {
  id: string;
  day: number;
  timeString: string;
  title: string;
  summary: string;
  category: 'INDUSTRY' | 'RIVAL' | 'DISCOVERY' | 'ETHICS' | 'VENTURE';
  impactReputation: number;
  impactHype: number;
  impactValuationPct: number;
  read: boolean;
}

export interface InvestorRound {
  id: string;
  title: string;
  phaseRequired: GamePhase;
  offeredCash: number;
  equityPercent: number;
  taken: boolean;
  minValuation: number;
}

export interface OfficeTile {
  x: number;
  y: number;
  type: 'FLOOR' | 'WALL_LEFT' | 'WALL_RIGHT' | 'DESK' | 'SERVER' | 'COFFEE' | 'WHITEBOARD' | 'PLANT' | 'SOFA';
  occupantId?: string;
  facing?: 'SE' | 'SW' | 'NE' | 'NW';
}

export interface CompanyState {
  hasStarted: boolean;
  companyName: string;
  founderName: string;
  founderArchetype: ArchetypeId;
  phase: GamePhase;
  phaseLevel: number;
  funds: number;
  valuation: number;
  reputation: number; // 0 to 100
  hype: number; // 0 to 100
  day: number;
  dayProgress: number; // 0.0 to 1.0 (1 day = 180 seconds)
  gameSpeed: number; // 0 = pause, 1 = 1x, 2 = 2x, 5 = 5x
  soundEnabled: boolean;
  employees: Employee[];
  models: ModelProject[];
  hardware: HardwareSetup;
  headlines: NewsHeadline[];
  rounds: InvestorRound[];
  gridSize: number;
  selectedWorkerId: string | null;
  activeModal: 'NONE' | 'TRAINING' | 'HIRING' | 'HARDWARE' | 'OFFICE' | 'NEWS' | 'WORKER_DETAIL' | 'DASHBOARD';
}
