import React from 'react';
import { ModelProject } from '../types/gameTypes';
import { TrainingModelCard } from './TrainingModelCard';
import { TrainingNewModelForm } from './TrainingNewModelForm';

interface TrainingModalProps {
  models: ModelProject[];
  currentDay: number;
  onClose: () => void;
  onCreateModel: (model: ModelProject) => void;
}

/**
 * Main Training Lab modal window.
 * Shows active foundation model training runs, benchmark evaluations, and configuration form.
 */
export function TrainingModal(props: TrainingModalProps): React.JSX.Element {
  const { models, currentDay, onClose, onCreateModel } = props;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-5 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Laboratório de Modelos de IA</h2>
            <p className="text-xs text-slate-400">Pré-treinamento de LLMs, avaliação de benchmarks e inferência.</p>
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
          <TrainingNewModelForm currentDay={currentDay} onCreateModel={onCreateModel} />

          {/* Model Roster */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">Modelos Fundacionais ({models.length})</div>
            {models.length === 0 ? (
              <div className="text-xs text-slate-500 py-4 text-center bg-slate-950/40 rounded border border-dashed border-slate-800">
                Nenhum modelo em treinamento. Configure seu primeiro modelo acima!
              </div>
            ) : (
              models.map((model) => <TrainingModelCard key={model.id} model={model} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
