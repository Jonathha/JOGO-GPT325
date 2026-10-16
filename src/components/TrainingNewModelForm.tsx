import React, { useState } from 'react';
import { ArchitectureType, ModelProject } from '../types/gameTypes';

interface FormProps {
  currentDay: number;
  onCreateModel: (model: ModelProject) => void;
}

/**
 * Builds a validated ModelProject object with appropriate FLOP requirements,
 * baseline loss, and projected benchmark scores.
 */
export function buildNewModelProject(
  name: string,
  paramChoice: '7B' | '14B' | '70B' | '405B',
  archChoice: ArchitectureType,
  currentDay: number
): ModelProject {
  const configs = {
    '7B': { params: 7, flops: 2.5e15, mmlu: 68, coding: 64, math: 58, revenue: 320 },
    '14B': { params: 14, flops: 7.0e15, mmlu: 76, coding: 73, math: 69, revenue: 850 },
    '70B': { params: 70, flops: 3.5e16, mmlu: 86, coding: 82, math: 81, revenue: 3400 },
    '405B': { params: 405, flops: 2.2e17, mmlu: 92, coding: 89, math: 90, revenue: 14500 },
  };

  const selected = configs[paramChoice];
  const archLabel = archChoice === 'REASONING_RL' ? 'Raciocínio RL' : 'Transformer Denso';

  const project: ModelProject = {
    id: `model-${Date.now()}`,
    name: name.trim().length > 0 ? name.trim() : `Apex-${paramChoice}`,
    paramSize: paramChoice,
    paramsBillion: selected.params,
    architecture: archChoice,
    architectureName: archLabel,
    computeNeededFlops: selected.flops,
    computeInvestedFlops: 0,
    trainingProgress: 0,
    currentLoss: 4.15,
    isCompleted: false,
    mmluScore: selected.mmlu,
    codingScore: selected.coding,
    mathScore: selected.math,
    dailyApiRevenue: selected.revenue,
    activeUsers: 0,
    hypeBoost: selected.params * 0.1,
    creationDay: currentDay,
  };

  return project;
}

/**
 * Interactive model configuration form allowing researchers to initiate
 * pre-training runs with selected parameter sizes and architecture variants.
 */
export function TrainingNewModelForm(props: FormProps): React.JSX.Element {
  const { currentDay, onCreateModel } = props;
  const [modelName, setModelName] = useState('Apex-14B-Reasoning');
  const [paramChoice, setParamChoice] = useState<'7B' | '14B' | '70B' | '405B'>('14B');
  const [archChoice, setArchChoice] = useState<ArchitectureType>('REASONING_RL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const model = buildNewModelProject(modelName, paramChoice, archChoice, currentDay);
    onCreateModel(model);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs space-y-3">
      <div className="font-semibold text-white">Configurar Novo Treinamento</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-slate-400 mb-1">Nome do Modelo</label>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-400 mb-1">Escala de Parâmetros</label>
          <select
            value={paramChoice}
            onChange={(e) => setParamChoice(e.target.value as '7B' | '14B' | '70B' | '405B')}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
          >
            <option value="7B">7B Parâmetros (Ágil · 2.5 PFLOPs)</option>
            <option value="14B">14B Parâmetros (Equilibrado · 7.0 PFLOPs)</option>
            <option value="70B">70B Parâmetros (Fronteira · 35 PFLOPs)</option>
            <option value="405B">405B Parâmetros (Supermodelo · 220 PFLOPs)</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold py-1.5 rounded text-xs transition-colors cursor-pointer"
      >
        Iniciar Epoch de Pré-Treinamento &rarr;
      </button>
    </form>
  );
}
