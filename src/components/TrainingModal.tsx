import React from 'react';
import { ModelProject } from '../types/gameTypes';
import { TrainingModelCard } from './TrainingModelCard';
import { TrainingNewModelForm } from './TrainingNewModelForm';

interface TrainingModalProps {
  models: ModelProject[];
  currentDay: number;
  onClose: () => void;
  onCreateModel: (model: ModelProject) => void;
  onLaunchModel: (id: string, mode: 'FREE' | 'PAID', inputPrice?: number, outputPrice?: number, imagePrice?: number) => void;
  onToggleTraining: (id: string) => void;
  onDeleteModel: (id: string) => void;
}

/**
 * Main Training Lab modal window.
 * Shows active foundation model training runs, benchmark evaluations, and configuration form.
 */
export function TrainingModal(props: TrainingModalProps): React.JSX.Element {
  const { models, currentDay, onClose, onCreateModel, onLaunchModel, onToggleTraining, onDeleteModel } = props;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-stretch bg-[#0c1311]">
      <div className="bg-[#111b18] border border-[#2c4037] sm:rounded-xl w-full p-4 sm:p-6 shadow-2xl flex flex-col h-full sm:max-h-[calc(100vh-24px)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">Laboratório de modelos</h2>
            <p className="mt-1 text-xs text-slate-400">Treine, avalie, publique e monetize modelos de texto e geração de imagens.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-mono px-2 py-0.5 rounded hover:bg-slate-800 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 pr-1 flex-1">
          {/* New Model Form */}
          <TrainingNewModelForm currentDay={currentDay} models={models} onCreateModel={onCreateModel} />

          {/* Model Roster */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3"><div className="text-sm font-semibold text-slate-200">Projetos e modelos publicados</div><span className="text-xs text-slate-500">{models.filter((model) => !model.isCompleted && !model.isTrainingPaused).length} treinando · {models.filter((model) => model.isTrainingPaused).length} pausado(s)</span></div>
            {models.length === 0 ? (
              <div className="text-xs text-slate-500 py-4 text-center bg-slate-950/40 rounded border border-dashed border-slate-800">
                Nenhum modelo em treinamento. Configure seu primeiro modelo acima!
              </div>
            ) : (
              models.map((model) => <TrainingModelCard key={model.id} model={model} onLaunchModel={onLaunchModel} onToggleTraining={onToggleTraining} onDeleteModel={onDeleteModel} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
