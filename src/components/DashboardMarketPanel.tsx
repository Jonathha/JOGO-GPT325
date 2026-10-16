import React from 'react';
import { CompanyState } from '../types/gameTypes';

export function DashboardMarketPanel({ state }: { state: CompanyState }): React.JSX.Element {
  const released = state.models.filter((model) => model.isReleased);
  const free = released.filter((model) => model.pricingMode === 'FREE').length;
  const paid = released.length - free;
  return <section className="grid gap-3 sm:grid-cols-2">
    <article className="rounded-lg border border-slate-800 bg-slate-950/60 p-4"><p className="text-xs text-slate-400">Portfólio publicado</p><strong className="mt-2 block text-2xl text-white">{released.length}</strong><p className="mt-1 text-xs text-slate-500">{free} gratuito(s) · {paid} pago(s)</p></article>
    <article className="rounded-lg border border-slate-800 bg-slate-950/60 p-4"><p className="text-xs text-slate-400">Posicionamento</p><strong className="mt-2 block text-lg text-white">{free > paid ? 'Adoção gratuita' : paid > free ? 'Monetização' : 'Equilibrado'}</strong><p className="mt-1 text-xs text-slate-500">A estratégia influencia aquisição e receita; não garante liderança.</p></article>
    <div className="sm:col-span-2 rounded-lg border border-slate-800"><div className="grid grid-cols-4 gap-2 bg-slate-900 px-3 py-2 text-[10px] uppercase text-slate-500"><span>Modelo</span><span>Arquitetura</span><span>Plano</span><span>Preço saída/1M tokens</span></div>
      {released.length ? released.map((model) => <div key={model.id} className="grid grid-cols-4 gap-2 border-t border-slate-800/70 px-3 py-3 text-xs"><span className="truncate text-slate-200">{model.name}</span><span className="truncate text-slate-400">{model.architectureName}</span><span className="text-slate-300">{model.pricingMode === 'FREE' ? 'Gratuito' : 'Pago'}</span><span className="text-slate-300">{model.pricingMode === 'FREE' ? '—' : '$' + model.pricePerMillionOutput.toFixed(2)}</span></div>) : <p className="p-5 text-center text-xs text-slate-500">Ainda não há modelos no mercado.</p>}
    </div>
  </section>;
}
