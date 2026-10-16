import { Employee, ArchetypeId } from '../types/gameTypes';

/**
 * Creates secondary starting team members with assigned positions and stats.
 * Encapsulates ML engineers and alignment researchers initialization.
 */
export function createStarterWorker(roleType: 'ML' | 'ALIGN', seed: number): Employee {
  const isMl = roleType === 'ML';
  const roleName = isMl ? 'Engenheiro de ML' : 'Especialista em RLHF';
  const workerName = isMl ? 'Lucas Silva' : 'Camila Duarte';
  const assignedRole = isMl ? 'ML_ENGINEER' : 'ALIGNMENT_RESEARCHER';
  const color = isMl ? '#10b981' : '#f59e0b';
  const initialDesk = isMl ? 1 : 2;
  const initialX = isMl ? 2 : 5;
  const initialY = isMl ? 4 : 2;

  const employee: Employee = {
    id: `emp-starter-${roleType.toLowerCase()}`,
    name: workerName,
    role: assignedRole,
    roleName: roleName,
    skill: isMl ? 64 : 60,
    morale: isMl ? 88 : 90,
    salaryPerDay: isMl ? 65 : 60,
    avatarSeed: seed,
    avatarColor: color,
    state: isMl ? 'TYPING' : 'COFFEE',
    x: initialX,
    y: initialY,
    targetX: initialX,
    targetY: initialY,
    deskIndex: initialDesk,
    assignedProjectId: null,
    stateTimer: isMl ? 6.0 : 3.5,
  };

  return employee;
}

/**
 * Generates the founder and initial team for the garage phase.
 * Combines founder generation with helper worker creation.
 */
export function buildStarterTeam(founderName: string, founderArchetype: ArchetypeId): Employee[] {
  // Validate and sanitize founder credentials
  const cleanFounderName = founderName && founderName.trim().length > 0 ? founderName.trim() : 'Alex Turing';
  const roleTitle = founderArchetype === 'SILICON_CHIPS' ? 'Arquiteto de Hardware' : 'Pesquisador Chefe';
  const starterMorale = 95;
  const starterSkill = 78;

  // Configure founder record with high morale and starting coordinates
  const founder: Employee = {
    id: 'emp-founder',
    name: cleanFounderName,
    role: 'CHIEF_SCIENTIST',
    roleName: roleTitle,
    skill: starterSkill,
    morale: starterMorale,
    salaryPerDay: 80,
    avatarSeed: 1,
    avatarColor: '#38bdf8',
    state: 'TYPING',
    x: 2,
    y: 2,
    targetX: 2,
    targetY: 2,
    deskIndex: 0,
    assignedProjectId: null,
    stateTimer: 4.0,
  };

  // Instantiate ML and Alignment colleagues for the seed office
  const mlWorker = createStarterWorker('ML', 2);
  const alignWorker = createStarterWorker('ALIGN', 3);
  const fullTeam: Employee[] = [founder, mlWorker, alignWorker];

  // Return the complete starter team roster
  return fullTeam;
}

/**
 * Creates candidate employees for the talent marketplace.
 * Dynamically scales skills, salaries, and specialties based on company phase.
 */
export function generateRecruitCandidate(phaseLevel: number, seed: number): Employee {
  const firstNames = ['Sophia', 'Mateus', 'Gabriel', 'Larissa', 'Bruno', 'Beatriz', 'Rafael', 'Juliana'];
  const lastNames = ['Costa', 'Menezes', 'Oliveira', 'Nakamura', 'Albuquerque', 'Ribeiro', 'Santos'];
  const namePick = `${firstNames[seed % firstNames.length]} ${lastNames[(seed + 3) % lastNames.length]}`;

  const roles = [
    { role: 'CHIEF_SCIENTIST' as const, title: 'Pesquisador Sênior', baseSal: 140, color: '#38bdf8' },
    { role: 'ML_ENGINEER' as const, title: 'Engenheiro de CUDA/Triton', baseSal: 120, color: '#10b981' },
    { role: 'ALIGNMENT_RESEARCHER' as const, title: 'Pesquisador de Alinhamento', baseSal: 110, color: '#f59e0b' },
    { role: 'PRODUCT_LEAD' as const, title: 'Líder de Produto IA', baseSal: 100, color: '#ec4899' },
  ];
  const chosenRole = roles[seed % roles.length];
  const calculatedSkill = Math.min(98, 55 + phaseLevel * 9 + (seed % 15));
  const calculatedSalary = Math.round(chosenRole.baseSal * (0.8 + phaseLevel * 0.35));

  const candidate: Employee = {
    id: `emp-cand-${Date.now()}-${seed}`,
    name: namePick,
    role: chosenRole.role,
    roleName: chosenRole.title,
    skill: calculatedSkill,
    morale: 85 + (seed % 12),
    salaryPerDay: calculatedSalary,
    avatarSeed: seed + 10,
    avatarColor: chosenRole.color,
    state: 'TYPING',
    x: 1,
    y: 1,
    targetX: 1,
    targetY: 1,
    deskIndex: -1,
    assignedProjectId: null,
    stateTimer: 5.0,
  };

  return candidate;
}
