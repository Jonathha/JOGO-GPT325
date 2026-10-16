import { CompanyState } from '../types/gameTypes';

/**
 * Calculates current market valuation based on AI models, revenue multiple, and team reputation.
 * Reflects Silicon Valley venture multiples for AI foundation labs.
 * Formatted with structured step valuations and bounds checks.
 */
export function recalculateCompanyValuation(state: CompanyState): number {
  const baseSeedValuation = 1500000;
  const teamSkillTotal = state.employees.reduce((acc, emp) => acc + emp.skill, 0);
  const teamValuationBonus = teamSkillTotal * 45000;

  // Valuation from trained AI models and benchmark prestige
  const completedModels = state.models.filter((m) => m.isCompleted);
  const modelsValuation = completedModels.reduce((acc, m) => {
    const paramMultiplier = m.paramsBillion * 250000;
    const benchmarkBonus = (m.mmluScore + m.codingScore) * 8000;
    const projectSubtotal = paramMultiplier + benchmarkBonus;
    return acc + projectSubtotal;
  }, 0);

  // Compute hardware infrastructure asset value
  const rackValue = state.hardware.onPremRacks * 350000;
  const cloudGpuValue = state.hardware.cloudGPUs * 15000;
  const hardwareAssetValue = rackValue + cloudGpuValue;

  // Annualized ARR revenue multiple (typical 25x ARR in AI frontier markets)
  const totalDailyRevenue = completedModels.reduce((acc, m) => acc + m.dailyApiRevenue, 0);
  const annualizedRevenue = totalDailyRevenue * 365;
  const revenueMultipleValue = annualizedRevenue * 20;

  // Reputation & hype premium factor
  const reputationFactor = state.reputation * 0.005;
  const hypeFactor = state.hype * 0.005;
  const sentimentMultiplier = 0.8 + reputationFactor + hypeFactor;

  // Composite asset base sum
  const assetBaseSum = baseSeedValuation + teamValuationBonus + modelsValuation + hardwareAssetValue + revenueMultipleValue;
  const aggregateValue = assetBaseSum * sentimentMultiplier;

  // Guard minimum valuation floor
  const minimumFloor = 500000;
  const roundedValuation = Math.max(minimumFloor, Math.round(aggregateValue));

  return roundedValuation;
}

/**
 * Executes the daily financial ledger settlement:
 * - Collects daily API subscription revenues from completed AI models
 * - Pays employee daily salaries
 * - Pays cloud GPU rental and electricity/cooling bills
 * - Recomputes company market valuation and checks phase milestones
 */
export function processEndOfDayFinances(state: CompanyState): CompanyState {
  // Aggregate revenue from all active AI model APIs
  const completedModels = state.models.filter((m) => m.isCompleted);
  const dailyApiIncome = completedModels.reduce((acc, m) => acc + m.dailyApiRevenue, 0);

  // Calculate daily payroll
  const dailyPayroll = state.employees.reduce((acc, emp) => acc + emp.salaryPerDay, 0);

  // Cloud GPU rental fee ($18 per cloud GPU/day) + power costs
  const cloudGpuCost = state.hardware.cloudGPUs * 18;
  const totalDailyExpenses = dailyPayroll + cloudGpuCost + state.hardware.dailyPowerCost;

  // Net operating cash flow
  const netDailyCashFlow = dailyApiIncome - totalDailyExpenses;
  const updatedFunds = state.funds + netDailyCashFlow;

  // Compute updated company valuation
  const partialState = {
    ...state,
    funds: updatedFunds,
  };
  const updatedValuation = recalculateCompanyValuation(partialState);

  // Auto-grow user base for completed models (viral API adoption)
  const upgradedModels = state.models.map((model) => {
    if (!model.isCompleted) return model;
    const userGrowth = Math.round(15 + model.mmluScore * 0.8);
    const revenueGrowth = Math.round(userGrowth * 0.04);
    return {
      ...model,
      activeUsers: model.activeUsers + userGrowth,
      dailyApiRevenue: model.dailyApiRevenue + revenueGrowth,
    };
  });

  return {
    ...state,
    funds: updatedFunds,
    valuation: updatedValuation,
    models: upgradedModels,
  };
}
