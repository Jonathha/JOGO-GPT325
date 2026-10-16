import React, { useState } from 'react';
import { ArchitectureType, ModelProject, TrainingStrategy } from '../types/gameTypes';

interface FormProps {
  currentDay: number;
  models: ModelProject[];
  onCreateModel: (model: ModelProject) => void;
}

export function buildNewModelProject(name: string, paramChoice: '7B' | '14B' | '70B' | '405B', archChoice: ArchitectureType, currentDay: number, strategy: TrainingStrategy = 'FROM_SCRATCH', baseModel: ModelProject | null = null): ModelProject {
  const configs = {
    '7B': { params: 7, flops: 2.5e17, mmlu: 68, coding: 64, math: 58 },
    '14B': { params: 14, flops: 7e17, mmlu: 76, coding: 73, math: 69 },
    '70B': { params: 70, flops: 3.5e18, mmlu: 86, coding: 82, math: 81 },
    '405B': { params: 405, flops: 2.2e19, mmlu: 92, coding: 89, math: 90 },
  };
  const inherited = strategy !== 'FROM_SCRATCH' ? baseModel : null;
  const inheritedSize = inherited?.paramSize as keyof typeof configs | undefined;
  const size = (strategy === 'FINE_TUNE' || strategy === 'CONTINUED') && inheritedSize ? inheritedSize : paramChoice;
  const selected = configs[size];
  const multiplier = strategy === 'FROM_SCRATCH' ? 1 : strategy === 'FINE_TUNE' ? 0.12 : strategy === 'CONTINUED' ? 0.3 : 0.25;
  const gain = strategy === 'FINE_TUNE' ? 3 : strategy === 'CONTINUED' ? 1 : strategy === 'DISTILLATION' ? -3 : 0;
  const score = (base: number, key: 'mmlu' | 'coding' | 'math') => Math.max(1, Math.min(98, inherited ? inherited[key === 'mmlu' ? 'mmluScore' : key === 'coding' ? 'codingScore' : 'mathScore'] + gain : base));
  const architecture = inherited && (strategy === 'FINE_TUNE' || strategy === 'CONTINUED') ? inherited.architecture : archChoice;
  const architectureName = architecture === 'REASONING_RL' ? 'Raciocínio RL' : architecture === 'MOE_SPARSE' ? 'Mixture of Experts' : architecture === 'DIFFUSION_VISION' ? 'Difusão visual' : 'Transformer Denso';
  return {
    id: 'model-' + Date.now(), name: name.trim() || 'Titan-' + size, paramSize: size, paramsBillion: selected.params,
    architecture, architectureName, trainingStrategy: strategy, trainingStage: 'DATA_PREPARATION', version: inherited ? inherited.version + 1 : 1, baseModelId: inherited?.id ?? null, baseModelName: inherited?.name ?? null,
    computeNeededFlops: selected.flops * multiplier, computeInvestedFlops: 0, trainingProgress: 0, currentLoss: inherited ? Math.max(0.72, inherited.currentLoss - 0.1) : 4.15,
    isCompleted: false, mmluScore: Math.max(1, score(selected.mmlu, 'mmlu') - 8), codingScore: Math.max(1, score(selected.coding, 'coding') - 8), mathScore: Math.max(1, score(selected.math, 'math') - 8), targetMmluScore: score(selected.mmlu, 'mmlu'), targetCodingScore: score(selected.coding, 'coding'), targetMathScore: score(selected.math, 'math'),
    dailyApiRevenue: 0, activeUsers: 0, isReleased: false, pricingMode: 'UNRELEASED', pricePerMillionInput: 0.5, pricePerMillionOutput: 1.5, dailyInferenceCost: 0,
    hypeBoost: selected.params * 0.1, creationDay: currentDay,
  };
}

export function TrainingNewModelForm({ currentDay, models, onCreateModel }: FormProps): React.JSX.Element {
  const [modelName, setModelName] = useState('Titan-14B-Reasoning');
  const [paramChoice, setParamChoice] = useState<'7B' | '14B' | '70B' | '405B'>('14B');
  const [archChoice, setArchChoice] = useState<ArchitectureType>('REASONING_RL');
  const [strategy, setStrategy] = useState<TrainingStrategy>('FROM_SCRATCH');
  const [baseModelId, setBaseModelId] = useState('');
  const baseModels = models.filter((model) => model.isCompleted);
  const needsBase = strategy !== 'FROM_SCRATCH';
  const baseModel = baseModels.find((model) => model.id === baseModelId) ?? null;
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (needsBase && !baseModel) return;
    onCreateModel(buildNewModelProject(modelName, paramChoice, archChoice, currentDay, strategy, baseModel));
  };
  return <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs">
    <div className="font-semibold text-white">Novo projeto de modelo</div>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <label className="text-[10px] text-slate-400">Nome do modelo<input value={modelName} onChange={(event) => setModelName(event.target.value)} className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs text-white" required /></label>
      <label className="text-[10px] text-slate-400">Estratégia<select value={strategy} onChange={(event) => setStrategy(event.target.value as TrainingStrategy)} className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-white"><option value="FROM_SCRATCH">Treinar do zero</option><option value="FINE_TUNE" disabled={!baseModels.length}>Fine-tuning de versão existente</option><option value="CONTINUED" disabled={!baseModels.length}>Continuar treinamento</option><option value="DISTILLATION" disabled={!baseModels.length}>Destilar modelo anterior</option></select></label>
      {needsBase ? <label className="text-[10px] text-slate-400 sm:col-span-2">Modelo-base<select value={baseModelId} onChange={(event) => setBaseModelId(event.target.value)} className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-white" required><option value="">Selecione uma versão concluída</option>{baseModels.map((model) => <option key={model.id} value={model.id}>{model.name} · {model.paramSize}</option>)}</select></label> : null}
      <label className="text-[10px] text-slate-400">Escala do modelo<select value={paramChoice} onChange={(event) => setParamChoice(event.target.value as typeof paramChoice)} className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-white"><option value="7B">7B parâmetros</option><option value="14B">14B parâmetros</option><option value="70B">70B parâmetros</option><option value="405B">405B parâmetros</option></select></label>
      <label className="text-[10px] text-slate-400">Arquitetura (para novo modelo)<select value={archChoice} onChange={(event) => setArchChoice(event.target.value as ArchitectureType)} className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-2 py-2 text-xs text-white"><option value="REASONING_RL">Raciocínio / RL</option><option value="TRANSFORMER_DENSE">Transformer denso</option><option value="MOE_SPARSE">Mixture of Experts</option><option value="DIFFUSION_VISION">Difusão visual</option></select></label>
    </div>
    <p className="text-[10px] leading-relaxed text-slate-500">Fine-tuning e treinamento contínuo herdam a escala e arquitetura da base. Reutilizar pesos reduz computação; destilação permite escolher uma escala menor.</p>
    <button type="submit" className="w-full rounded bg-slate-100 py-2 text-xs font-semibold text-slate-900 transition-colors hover:bg-white">Iniciar projeto de treinamento →</button>
  </form>;
}
