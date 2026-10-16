import { CompanyState } from '../types/gameTypes';
import { getRivalModelsForDay } from '../data/rivalModels';

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
 * - Calculates daily API usage revenue from released models
 * - Pays employee daily salaries
 * - Pays cloud GPU rental and electricity/cooling bills
 * - Recomputes company market valuation and checks phase milestones
 */
export function processEndOfDayFinances(state: CompanyState): CompanyState {
  const rivals = getRivalModelsForDay(state.day);
  const bestRivalQuality = Math.max(...rivals.map((rival) => (rival.mmlu + rival.coding + rival.math) / 300));
  const averageRivalOutputPrice = rivals.reduce((sum, rival) => sum + rival.outputPrice, 0) / rivals.length;
  const models = state.models.map((model) => {
    if (!model.isCompleted || !model.isReleased) return model;
    const quality = (model.mmluScore + model.codingScore + model.mathScore) / 300;
    const reputationFactor = 0.7 + Math.max(0, Math.min(100, state.reputation)) / 100;
    const competitiveFactor = quality >= bestRivalQuality ? 1.25 : quality >= bestRivalQuality - 0.05 ? 1 : 0.78;
    const priceFactor = model.pricingMode === 'PAID'
      ? Math.max(0.35, Math.min(1.25, 1.15 - (model.pricePerMillionOutput / averageRivalOutputPrice) * 0.3))
      : 1;
    const acquisition = model.pricingMode === 'FREE'
      ? Math.round((10 + quality * 24) * reputationFactor * competitiveFactor)
      : Math.max(0, Math.round((3 + quality * 9) * reputationFactor * competitiveFactor * priceFactor));
    const churnRate = model.pricingMode === 'FREE' ? 0.012 : 0.025;
    const activeUsers = Math.max(0, Math.round(model.activeUsers * (1 - churnRate)) + acquisition);
    const requestsPerUser = 6;
    const inputTokensPerRequest = 700;
    const outputTokensPerRequest = 350;
    const inputPrice = model.pricingMode === 'PAID' ? model.pricePerMillionInput : 0;
    const outputPrice = model.pricingMode === 'PAID' ? model.pricePerMillionOutput : 0;
    const inputCostPerMillion = 0.04 + model.paramsBillion * 0.002;
    const outputCostPerMillion = 0.08 + model.paramsBillion * 0.006;
    const averageDailyUsers = (model.activeUsers + activeUsers) / 2;
    const dailyApiRevenue = averageDailyUsers * requestsPerUser *
      (inputTokensPerRequest * inputPrice + outputTokensPerRequest * outputPrice) / 1_000_000;
    const dailyInferenceCost = averageDailyUsers * requestsPerUser *
      (inputTokensPerRequest * inputCostPerMillion + outputTokensPerRequest * outputCostPerMillion) / 1_000_000;
    return { ...model, activeUsers, dailyNewUsers: acquisition, dailyApiRevenue, dailyInferenceCost };
  });
  const dailyApiIncome = models.reduce((sum, model) => sum + model.dailyApiRevenue, 0);
  const dailyInferenceCost = models.reduce((sum, model) => sum + model.dailyInferenceCost, 0);
  const dailyPayroll = state.employees.reduce((sum, employee) => sum + employee.salaryPerDay, 0);
  const cloudGpuCost = state.hardware.cloudGPUs * 18;
  const totalDailyExpenses = dailyPayroll + cloudGpuCost + state.hardware.dailyPowerCost + dailyInferenceCost;
  const updatedFunds = state.funds + dailyApiIncome - totalDailyExpenses;
  const partialState = { ...state, funds: updatedFunds, models };
  return { ...partialState, valuation: recalculateCompanyValuation(partialState) };
}
