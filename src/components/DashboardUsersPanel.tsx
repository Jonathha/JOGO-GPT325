import React from 'react';
import { CompanyState } from '../types/gameTypes';

export function DashboardUsersPanel({ state }: { state: CompanyState }): React.JSX.Element {
  const models = state.models.filter((model) => model.isReleased);
  const totalUsers = models.reduce((sum, model) => sum + model.activeUsers, 0);
  const freeUsers = models.filter((model) => model.pricingMode === 'FREE').reduce((sum, model) => sum + model.activeUsers, 0);
  const newUsers = models.reduce((sum, model) => sum + model.dailyNewUsers, 0);
  const metricCards = [
    ['Usuários nos modelos', totalUsers],
    ['Acesso gratuito', freeUsers],
    ['Novos hoje', newUsers],
    ['Modelos publicados', models.length],
  ];
  return <section className="space-y-3">
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{metricCards.map(([label, value]) => <div key={label} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"><p className="text-[11px] text-slate-400">{label}</p><strong className="mt-1 block text-lg text-white">{Number(value).toLocaleString()}</strong></div>)}</div>
    <div className="overflow-x-auto rounded-lg border border-slate-800"><div className="min-w-[520px]"><div className="grid grid-cols-5 gap-2 bg-slate-900 px-3 py-2 text-[10px] uppercase text-slate-500"><span>Modelo</span><span>Plano</span><span>Usuários</span><span>Novos/dia</span><span>Receita/dia</span></div>
      {models.length ? models.map((model) => <div key={model.id} className="grid grid-cols-5 gap-2 border-t border-slate-800/70 px-3 py-3 text-xs"><span className="truncate text-slate-200">{model.name} v{model.version}</span><span className="text-slate-400">{model.pricingMode === 'FREE' ? 'Gratuito' : 'Pago'}</span><span className="tabular-nums text-slate-200">{model.activeUsers.toLocaleString()}</span><span className="tabular-nums text-slate-200">{model.dailyNewUsers.toLocaleString()}</span><span className="tabular-nums text-emerald-300">{'$' + model.dailyApiRevenue.toFixed(2)}</span></div>) : <p className="p-5 text-center text-xs text-slate-500">Publique um modelo para começar a acompanhar usuários.</p>}
    </div></div><p className="text-[10px] text-slate-500">Usuários são simulados por modelo; a soma pode contar a mesma pessoa em produtos diferentes. A aquisição e a evasão mudam diariamente.</p>
  </section>;
}
