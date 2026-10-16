import { describe, expect, it } from 'bun:test';
import { buildNewModelProject } from '../src/components/TrainingNewModelForm';
import { createDefaultCompanyState } from '../src/data/initialCompanyState';
import { getRivalModelsForDay } from '../src/data/rivalModels';
import { processEndOfDayFinances } from '../src/engine/simulationDailyPayout';
import { updateModelTrainingStep } from '../src/engine/simulationTick';
import { removeModelProject, toggleModelTraining } from '../src/engine/modelLifecycle';
import { updateEmployeeBehaviors } from '../src/engine/simulationWorkers';

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
    state.hardware.totalTeraflops = 10000;
    state.models = [model];
    const next = updateModelTrainingStep(state, 1).models[0];
    expect(next.trainingProgress).toBeGreaterThan(0);
    expect(next.trainingProgress).toBeLessThan(100);
    expect(next.mmluScore).toBeGreaterThan(model.mmluScore);
    expect(next.mmluScore).toBeLessThanOrEqual(next.targetMmluScore);
  });

  it('restores seated typing after a worker reaches their assigned desk', () => {
    const employee = {
      id: 'worker-1', name: 'Engineer', role: 'ML_ENGINEER' as const, roleName: 'ML Engineer',
      skill: 80, morale: 75, salaryPerDay: 100, avatarSeed: 1, avatarColor: '#789',
      state: 'WALKING' as const, activityState: 'TYPING' as const,
      x: 1, y: 1, targetX: 1, targetY: 1, deskIndex: 0, assignedProjectId: null, stateTimer: 8,
    };
    const [updated] = updateEmployeeBehaviors([employee], 6, 0.1, [{ x: 1, y: 1 }]);
    expect(updated.state).toBe('TYPING');
  });

  it('finishes small models faster than large foundation models', () => {
    const small = buildNewModelProject('Titan small', '7B', 'TRANSFORMER_DENSE', 1);
    const large = buildNewModelProject('Titan large', '405B', 'TRANSFORMER_DENSE', 1);
    expect(small.computeNeededFlops).toBeLessThan(large.computeNeededFlops);
    expect(small.computeNeededFlops).toBe(2.5e16);
  });

  it('pauses training without losing progress and resumes it', () => {
    const model = buildNewModelProject('Titan pause', '14B', 'REASONING_RL', 1);
    const state = createDefaultCompanyState();
    state.hasStarted = true;
    state.models = [model];
    const paused = toggleModelTraining([model], model.id)[0];
    expect(paused.isTrainingPaused).toBe(true);
    const pausedState = updateModelTrainingStep({ ...state, models: [paused] }, 2);
    expect(pausedState.models[0].computeInvestedFlops).toBe(0);
    const resumed = toggleModelTraining([paused], model.id)[0];
    expect(resumed.isTrainingPaused).toBe(false);
    const resumedState = updateModelTrainingStep({ ...state, models: [resumed] }, 1);
    expect(resumedState.models[0].computeInvestedFlops).toBeGreaterThan(0);
  });

  it('deletes only the selected model and does not alter the others', () => {
    const first = buildNewModelProject('Titan A', '7B', 'TRANSFORMER_DENSE', 1);
    const second = buildNewModelProject('Titan B', '14B', 'TRANSFORMER_DENSE', 1);
    expect(removeModelProject([first, second], first.id)).toEqual([second]);
  });

  it('trains image models with selectable resolution and progressive image quality', () => {
    const model = buildNewModelProject('Titan Vision', '14B', 'DIFFUSION_VISION', 1, 'FROM_SCRATCH', null, '2048px');
    expect(model.modality).toBe('IMAGE');
    expect(model.imageResolution).toBe('2048px');
    expect(model.imageQuality).toBeLessThan(model.targetImageQuality);
    const state = createDefaultCompanyState();
    state.hasStarted = true;
    state.hardware.totalTeraflops = 10000;
    state.models = [model];
    const next = updateModelTrainingStep(state, 1).models[0];
    expect(next.imageQuality).toBeGreaterThan(model.imageQuality);
    expect(next.imageQuality).toBeLessThanOrEqual(next.targetImageQuality);
  });

  it('charges the company for free image generation and earns per-image revenue on paid products', () => {
    const state = createDefaultCompanyState();
    const freeImage = buildNewModelProject('Free Canvas', '7B', 'DIFFUSION_VISION', 1);
    Object.assign(freeImage, { isCompleted: true, isReleased: true, pricingMode: 'FREE', activeUsers: 80 });
    const freeState = processEndOfDayFinances({ ...state, models: [freeImage] });
    const freeResult = freeState.models[0];
    expect(freeState.funds).toBeLessThan(state.funds);
    expect(freeResult.dailyImageGenerations).toBeGreaterThan(0);
    expect(freeResult.dailyApiRevenue).toBe(0);
    expect(freeResult.dailyInferenceCost).toBeGreaterThan(0);

    const paidImage = buildNewModelProject('Studio Canvas', '7B', 'DIFFUSION_VISION', 1);
    Object.assign(paidImage, { isCompleted: true, isReleased: true, pricingMode: 'PAID', activeUsers: 80, pricePerImage: 0.15 });
    const paidResult = processEndOfDayFinances({ ...state, models: [paidImage] }).models[0];
    expect(paidResult.dailyImageGenerations).toBeGreaterThan(0);
    expect(paidResult.dailyApiRevenue).toBeGreaterThan(0);
    expect(paidResult.dailyInferenceCost).toBeGreaterThan(0);
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
