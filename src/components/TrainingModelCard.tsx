import React from 'react';
import { ModelProject } from '../types/gameTypes';

/**
 * Renders the benchmark matrix for completed AI models
 * (MMLU score, Coding ability, active API clients, and net cash flow).
 */
export function ModelBenchmarkGrid(props: { model: ModelProject }): React.JSX.Element {
  const { model } = props;
  const formattedUsers = model.activeUsers.toLocaleString();
  const formattedIncome = model.dailyApiRevenue.toLocaleString();
  const mathScoreDisplay = `${model.mathScore || 70}%`;
  const parameterLabel = `${model.paramsBillion}B parâmetros ativos`;

  return (
    <div className="grid grid-cols-4 gap-2 my-2 py-2 bg-slate-900/60 rounded px-2.5 font-mono text-[11px] border border-slate-800/60">
      <div>
        <span className="text-slate-500 block text-[9px]">MMLU BENCH</span>
        <span className="text-sky-300 font-semibold">{model.mmluScore}%</span>
      </div>
      <div>
        <span className="text-slate-500 block text-[9px]">HUMAN_EVAL</span>
        <span className="text-emerald-300 font-semibold">{model.codingScore}%</span>
      </div>
      <div>
        <span className="text-slate-500 block text-[9px]">MATH REASON</span>
        <span className="text-amber-300 font-semibold">{mathScoreDisplay}</span>
      </div>
      <div>
        <span className="text-slate-500 block text-[9px]">RECEITA/DIA</span>
        <span className="text-emerald-400 font-semibold">+${formattedIncome}</span>
      </div>
      <div className="col-span-4 pt-1 border-t border-slate-800/40 text-[10px] text-slate-400 flex justify-between">
        <span>Clientes Ativos na API:</span>
        <span className="text-slate-200 font-medium">{formattedUsers} empresas</span>
      </div>
      <div className="col-span-4 text-[9px] text-slate-500 text-right">
        <span>Status da rede: {parameterLabel}</span>
      </div>
    </div>
  );
}

/**
 * Renders an active or completed AI foundation model project card.
 * Displays real-time training progress, loss score, benchmark metrics, and API revenue.
 */
export function TrainingModelCard(props: { model: ModelProject }): React.JSX.Element {
  const { model } = props;
  const isFinished = model.isCompleted;

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-sm">{model.name}</span>
          <span className="text-[10px] font-mono bg-sky-950 text-sky-400 px-1.5 py-0.5 rounded border border-sky-800/40">
            {model.paramSize}
          </span>
          <span className="text-[10px] text-slate-500">{model.architectureName}</span>
        </div>
        <div className="font-mono text-[11px]">
          {isFinished ? (
            <span className="text-emerald-400">Ativo na API</span>
          ) : (
            <span className="text-amber-400">Treinando: {model.trainingProgress}%</span>
          )}
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-1 my-2">
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div className="bg-sky-500 h-full transition-all duration-300" style={{ width: `${model.trainingProgress}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Loss atual: {model.currentLoss}</span>
            <span>Investido: {(model.computeInvestedFlops / 1e15).toFixed(1)} PFLOPs</span>
          </div>
        </div>
      ) : (
        <ModelBenchmarkGrid model={model} />
      )}
    </div>
  );
}
