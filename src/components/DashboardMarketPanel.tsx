import React from 'react';
import { CompanyState } from '../types/gameTypes';
import { getRivalModelsForDay } from '../data/rivalModels';

export function DashboardMarketPanel({ state }: { state: CompanyState }): React.JSX.Element {
  const released = state.models.filter((model) => model.isReleased);
  const free = released.filter((model) => model.pricingMode === 'FREE').length;
  const paid = released.length - free;
  const rivals = getRivalModelsForDay(state.day);
  return <section className="grid gap-3 sm:grid-cols-2">
    <article className="rounded-lg border border-slate-800 bg-slate-950/60 p-4"><p className="text-xs text-slate-400">Produtos publicados</p><strong className="mt-2 block text-2xl text-white">{released.length}</strong><p className="mt-1 text-xs text-slate-500">{free} gratuito(s) · {paid} pago(s)</p></article>
    <article className="rounded-lg border border-slate-800 bg-slate-950/60 p-4"><p className="text-xs text-slate-400">Receita diária estimada</p><strong className="mt-2 block text-2xl text-white">${released.reduce((sum, model) => sum + model.dailyApiRevenue, 0).toFixed(2)}</strong><p className="mt-1 text-xs text-slate-500">Custos de inferência: ${released.reduce((sum, model) => sum + model.dailyInferenceCost, 0).toFixed(2)}/dia</p></article>
    <div className="sm:col-span-2 overflow-x-auto rounded-lg border border-slate-800"><div className="min-w-[620px]"><div className="grid grid-cols-4 gap-2 bg-slate-900 px-3 py-2 text-[10px] uppercase text-slate-500"><span>Produto</span><span>Arquitetura</span><span>Plano</span><span>Preço</span></div>
      {released.length ? released.map((model) => <div key={model.id} className="grid grid-cols-4 gap-2 border-t border-slate-800/70 px-3 py-3 text-xs"><span className="truncate text-slate-200">{model.name} v{model.version}</span><span className="truncate text-slate-400">{model.modality === 'IMAGE' ? 'Geração de imagens' : model.architectureName}</span><span className="text-slate-300">{model.pricingMode === 'FREE' ? 'Gratuito' : 'Pago'}</span><span className="text-slate-300">{model.pricingMode === 'FREE' ? 'Sem cobrança' : model.modality === 'IMAGE' ? '$' + model.pricePerImage.toFixed(2) + '/imagem' : '$' + model.pricePerMillionInput.toFixed(2) + ' entrada · $' + model.pricePerMillionOutput.toFixed(2) + ' saída / 1M'}</span></div>) : <p className="p-5 text-center text-xs text-slate-500">Ainda não há produtos publicados.</p>}
    </div>
    <div className="sm:col-span-2 overflow-hidden rounded-lg border border-slate-800"><div className="bg-slate-900 px-3 py-2 text-[10px] uppercase text-slate-500">Concorrentes no dia {state.day}</div>
      {rivals.map((rival) => <div key={rival.model} className="grid grid-cols-3 gap-2 border-t border-slate-800/70 px-3 py-3 text-xs"><div><strong className="block text-slate-200">{rival.model}</strong><span className="text-slate-500">{rival.company}</span></div><span className="text-slate-400">{rival.focus}</span><span className="text-right text-slate-300">{rival.mmlu}% MMLU · ${rival.outputPrice.toFixed(2)}/1M saída</span></div>)}
      <p className="border-t border-slate-800 px-3 py-2 text-[10px] text-slate-500">Novas versões entram no mercado ao longo dos dias; desempenho e preços evoluem com o tempo.</p>
    </div>
  </section>;
}
