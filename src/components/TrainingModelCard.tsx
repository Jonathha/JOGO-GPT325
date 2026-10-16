import React from 'react';
import { ModelProject } from '../types/gameTypes';

type LaunchMode = 'FREE' | 'PAID';

export function ModelBenchmarkGrid({ model }: { model: ModelProject }): React.JSX.Element {
  return <div className="my-2 grid grid-cols-4 gap-2 rounded border border-slate-800/60 bg-slate-900/60 px-2.5 py-2 font-mono text-[11px]">
    <div><span className="block text-[9px] text-slate-500">MMLU</span><span className="font-semibold text-sky-300">{model.mmluScore}%</span></div>
    <div><span className="block text-[9px] text-slate-500">CODING</span><span className="font-semibold text-emerald-300">{model.codingScore}%</span></div>
    <div><span className="block text-[9px] text-slate-500">MATEMÁTICA</span><span className="font-semibold text-amber-300">{model.mathScore}%</span></div>
    <div><span className="block text-[9px] text-slate-500">USUÁRIOS</span><span className="font-semibold text-slate-200">{model.activeUsers.toLocaleString()}</span></div>
  </div>;
}

export function TrainingModelCard({ model, onLaunchModel }: { model: ModelProject; onLaunchModel: (id: string, mode: LaunchMode) => void }): React.JSX.Element {
  const finished = model.isCompleted;
  const status = !finished ? 'Treinando: ' + model.trainingProgress + '%' : !model.isReleased ? 'Pronto para lançamento' : model.pricingMode === 'FREE' ? 'Publicado · Gratuito' : 'Publicado · Pago';
  return <article className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs">
    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-white">{model.name}</strong><span className="rounded border border-sky-800/40 bg-sky-950 px-1.5 py-0.5 font-mono text-[10px] text-sky-400">{model.paramSize}</span><span className="text-[10px] text-slate-500">{model.architectureName}</span></div><span className={finished ? 'text-emerald-400' : 'text-amber-400'}>{status}</span></div>
    {!finished ? <div className="my-2 space-y-1"><div className="h-2 overflow-hidden rounded-full border border-slate-800 bg-slate-900"><div className="h-full bg-sky-500 transition-all duration-300" style={{ width: model.trainingProgress + '%' }} /></div><div className="flex justify-between font-mono text-[10px] text-slate-400"><span>Loss: {model.currentLoss}</span><span>{(model.computeInvestedFlops / 1e15).toFixed(1)} PFLOPs investidos</span></div></div> : <ModelBenchmarkGrid model={model} />}
    {finished && !model.isReleased ? <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => onLaunchModel(model.id, 'FREE')} className="rounded-md border border-slate-600 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800">Lançar gratuitamente</button><button onClick={() => onLaunchModel(model.id, 'PAID')} className="rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-white">Lançar com cobrança por uso</button></div> : null}
    {model.isReleased ? <p className="mt-2 text-[11px] text-slate-400">{'Receita diária: $' + model.dailyApiRevenue.toFixed(2) + ' · Custo de inferência: $' + model.dailyInferenceCost.toFixed(2)}</p> : null}
  </article>;
}
