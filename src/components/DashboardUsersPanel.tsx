import React from 'react';
import { CompanyState } from '../types/gameTypes';

export function DashboardUsersPanel({ state }: { state: CompanyState }): React.JSX.Element {
  const models = state.models.filter((model) => model.isReleased);
  const totalUsers = models.reduce((sum, model) => sum + model.activeUsers, 0);
  const freeUsers = models.filter((model) => model.pricingMode === 'FREE').reduce((sum, model) => sum + model.activeUsers, 0);
  return <section className="space-y-3">
    <div className="grid grid-cols-3 gap-2">{[['Usuários nos modelos', totalUsers], ['Acesso gratuito', freeUsers], ['Modelos publicados', models.length]].map(([label, value]) => <div key={label} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"><p className="text-[11px] text-slate-400">{label}</p><strong className="mt-1 block text-lg text-white">{Number(value).toLocaleString()}</strong></div>)}</div>
    <div className="overflow-hidden rounded-lg border border-slate-800"><div className="grid grid-cols-4 gap-2 bg-slate-900 px-3 py-2 text-[10px] uppercase text-slate-500"><span>Modelo</span><span>Plano</span><span>Usuários</span><span>Receita/dia</span></div>
      {models.length ? models.map((model) => <div key={model.id} className="grid grid-cols-4 gap-2 border-t border-slate-800/70 px-3 py-3 text-xs"><span className="truncate text-slate-200">{model.name}</span><span className="text-slate-400">{model.pricingMode === 'FREE' ? 'Gratuito' : 'Pago'}</span><span className="tabular-nums text-slate-200">{model.activeUsers.toLocaleString()}</span><span className="tabular-nums text-emerald-300">{'$' + model.dailyApiRevenue.toLocaleString()}</span></div>) : <p className="p-5 text-center text-xs text-slate-500">Publique um modelo para começar a acompanhar usuários.</p>}
    </div><p className="text-[10px] text-slate-500">Contagem somada por modelo; uma mesma pessoa pode usar mais de um produto.</p>
  </section>;
}
