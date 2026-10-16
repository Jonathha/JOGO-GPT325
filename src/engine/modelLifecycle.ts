import { ModelProject } from '../types/gameTypes';

export function toggleModelTraining(models: ModelProject[], id: string): ModelProject[] {
  return models.map((model) => model.id === id && !model.isCompleted
    ? { ...model, isTrainingPaused: !model.isTrainingPaused }
    : model);
}

export function removeModelProject(models: ModelProject[], id: string): ModelProject[] {
  return models.filter((model) => model.id !== id);
}
