import { describe, expect, it } from 'bun:test';
import { buildNewModelProject } from '../src/components/TrainingNewModelForm';
import { createDefaultCompanyState } from '../src/data/initialCompanyState';
import { getRivalModelsForDay } from '../src/data/rivalModels';
import { processEndOfDayFinances } from '../src/engine/simulationDailyPayout';
import { updateModelTrainingStep } from '../src/engine/simulationTick';

describe('AI model lifecycle and market simulation', () => {
  it('introduces competitor releases over time and evolves their prices', () => {
    expect(getRivalModelsForDay(1)).toHaveLength(3);
    expect(getRivalModelsForDay(12)).toHaveLength(4);
    expect(getRivalModelsForDay(24)).toHaveLength(5);
    expect(getRivalModelsForDay(31)[0].outputPrice).toBeLessThan(getRivalModelsForDay(1)[0].outputPrice);
  });

  it('creates fine-tuned versions from the selected base model', () => {
    const base = buildNewModelProject('Titan base', '70B', 'MOE_SPARSE', 1);
    base.isCompleted = true;
    const next = buildNewModelProject('Titan tuned', '7B', 'TRANSFORMER_DENSE', 4, 'FINE_TUNE', base);
    expect(next.version).toBe(base.version + 1);
    expect(next.baseModelId).toBe(base.id);
    expect(next.baseModelName).toBe(base.name);
    expect(next.paramsBillion).toBe(base.paramsBillion);
    expect(next.architecture).toBe(base.architecture);
    expect(next.computeNeededFlops).toBeLessThan(base.computeNeededFlops);
  });

  it('lets a distilled model use a smaller parameter scale', () => {
    const base = buildNewModelProject('Titan large', '405B', 'TRANSFORMER_DENSE', 1);
    base.isCompleted = true;
    const distilled = buildNewModelProject('Titan compact', '7B', 'TRANSFORMER_DENSE', 5, 'DISTILLATION', base);
    expect(distilled.paramsBillion).toBe(7);
    expect(distilled.baseModelId).toBe(base.id);
    expect(distilled.targetMmluScore).toBeLessThan(base.targetMmluScore);
  });

  it('improves benchmark estimates during training without showing 100% early', () => {
    const model = buildNewModelProject('Titan test', '14B', 'REASONING_RL', 1);
    const state = createDefaultCompanyState();
    state.hasStarted = true;
    state.hardware.totalTeraflops = 100000;
    state.models = [model];
    const next = updateModelTrainingStep(state, 1).models[0];
    expect(next.trainingProgress).toBeGreaterThan(0);
    expect(next.trainingProgress).toBeLessThan(100);
    expect(next.mmluScore).toBeGreaterThan(model.mmluScore);
    expect(next.mmluScore).toBeLessThanOrEqual(next.targetMmluScore);
  });

  it('accounts for paid revenue and inference cost from token volume', () => {
    const state = createDefaultCompanyState();
    state.funds = 1_000_000;
    const model = buildNewModelProject('Titan paid', '14B', 'REASONING_RL', 1);
    Object.assign(model, { isCompleted: true, isReleased: true, pricingMode: 'PAID', activeUsers: 100, pricePerMillionInput: 0.5, pricePerMillionOutput: 1.5 });
    const result = processEndOfDayFinances({ ...state, models: [model] }).models[0];
    expect(result.dailyApiRevenue).toBeGreaterThan(0);
    expect(result.dailyInferenceCost).toBeGreaterThan(0);
    expect(result.dailyNewUsers).toBeGreaterThan(0);
  });

  it('keeps free access revenue-free while counting inference expenses', () => {
    const state = createDefaultCompanyState();
    const model = buildNewModelProject('Titan free', '7B', 'TRANSFORMER_DENSE', 1);
    Object.assign(model, { isCompleted: true, isReleased: true, pricingMode: 'FREE', activeUsers: 50 });
    const result = processEndOfDayFinances({ ...state, models: [model] }).models[0];
    expect(result.dailyApiRevenue).toBe(0);
    expect(result.dailyInferenceCost).toBeGreaterThan(0);
  });
});
