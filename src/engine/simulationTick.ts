import { CompanyState } from '../types/gameTypes';
import { processEndOfDayFinances } from './simulationDailyPayout';

/**
 * Advances the game day progress according to the 3-minute per day rule (180 seconds).
 * When dayProgress wraps past 1.0, triggers end-of-day financial settlement.
 */
export function updateDayProgression(
  state: CompanyState,
  deltaSeconds: number
): CompanyState {
  if (state.gameSpeed <= 0 || !state.hasStarted) {
    return state;
  }

  // 1 Game Day = 180 seconds (3 minutes) at 1x speed
  const secondsPerDay = 180;
  const effectiveDelta = deltaSeconds * state.gameSpeed;
  const progressIncrement = effectiveDelta / secondsPerDay;

  let newDay = state.day;
  let newProgress = state.dayProgress + progressIncrement;
  let updatedState = { ...state };

  // Detect day transition rollover
  if (newProgress >= 1.0) {
    newProgress = newProgress - 1.0;
    newDay += 1;

    // Apply end-of-day payroll, server expenses, and API subscriptions
    updatedState = processEndOfDayFinances({
      ...updatedState,
      day: newDay,
      dayProgress: newProgress,
    });
  } else {
    updatedState = {
      ...updatedState,
      dayProgress: newProgress,
    };
  }

  return updatedState;
}

/**
 * Distributes compute Teraflops across all active AI training projects.
 * Advances training progress and logarithmic loss reduction.
 */
export function updateModelTrainingStep(
  state: CompanyState,
  deltaSeconds: number
): CompanyState {
  if (state.gameSpeed <= 0 || !state.hasStarted || state.models.length === 0) {
    return state;
  }

  const effectiveDelta = deltaSeconds * state.gameSpeed;
  const totalComputeFlops = state.hardware.totalTeraflops;
  const activeModels = state.models.filter((m) => !m.isCompleted);

  if (activeModels.length === 0) {
    return state;
  }

  // Allocate compute proportionally among training models
  const computeSharePerModel = (totalComputeFlops * effectiveDelta * 1e12) / activeModels.length;

  const updatedModels = state.models.map((model) => {
    if (model.isCompleted) {
      return model;
    }

    const newInvestedFlops = model.computeInvestedFlops + computeSharePerModel;
    const progressRatio = Math.min(1.0, newInvestedFlops / model.computeNeededFlops);
    const progressPercent = Number.isFinite(progressRatio) ? (progressRatio >= 1 ? 100 : Math.floor(progressRatio * 100)) : 0;
    const isNowFinished = progressRatio >= 1.0;
    const trainingStage = progressRatio < 0.05 ? 'DATA_PREPARATION'
      : progressRatio < 0.85 ? 'PRETRAINING'
      : progressRatio < 0.93 ? 'POST_TRAINING'
      : progressRatio < 1 ? 'EVALUATION' : 'READY';

    // Power-law loss curve decay
    const newLoss = Math.max(0.72, model.initialLoss * Math.exp(-progressRatio * 2.8));

    return {
      ...model,
      computeInvestedFlops: newInvestedFlops,
      trainingProgress: progressPercent,
      trainingStage,
      mmluScore: Math.round(Math.max(1, model.targetMmluScore - 8) + (model.targetMmluScore - Math.max(1, model.targetMmluScore - 8)) * progressRatio),
      codingScore: Math.round(Math.max(1, model.targetCodingScore - 8) + (model.targetCodingScore - Math.max(1, model.targetCodingScore - 8)) * progressRatio),
      mathScore: Math.round(Math.max(1, model.targetMathScore - 8) + (model.targetMathScore - Math.max(1, model.targetMathScore - 8)) * progressRatio),
      currentLoss: parseFloat(newLoss.toFixed(3)),
      isCompleted: isNowFinished,
    };
  });

  return {
    ...state,
    models: updatedModels,
  };
}
