import React from 'react';
import { CompanyState } from '../types/gameTypes';

export function DashboardUsersPanel({ state }: { state: CompanyState }): React.JSX.Element {
  const models = state.models.filter((model) => model.isReleased);
  const totalUsers = models.reduce((sum, model) => sum + model.activeUsers, 0);
  const freeUsers = models.filter((model) => model.pricingMode === 'FREE').reduce((sum, model) => sum + model.activeUsers, 0);
  const newUsers = models.reduce((sum, model) => sum + model.dailyNewUsers, 0);
  const freeCost = models.filter((model) => model.pricingMode === 'FREE').reduce((sum, model) => sum + model.dailyInferenceCost, 0);
  const imageGenerations = models.reduce((sum, model) => sum + model.dailyImageGenerations, 0);
  const metrics = [['Usuários nos produtos', totalUsers], ['Usuários gratuitos', freeUsers], ['Novos usuários/dia', newUsers], ['Imagens geradas/dia', imageGenerations]];
  return <section className="space-y-4">
    <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">{metrics.map(([label, value]) => <div key={label} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"><p className="text-[11px] text-slate-400">{label}</p><strong className="mt-1 block text-xl tabular-nums text-white">{Number(value).toLocaleString()}</strong></div>)}</div>
    <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm text-amber-100">Custo do acesso gratuito</strong><strong className="text-lg tabular-nums text-amber-100">${freeCost.toFixed(2)}/dia</strong></div><p className="mt-1 text-xs leading-5 text-amber-100/70">Usuários gratuitos não geram receita direta. Cada conversa ou imagem usa computação paga pela empresa; esse custo entra nas despesas diárias e afeta o caixa.</p></div>
    <div className="overflow-x-auto rounded-lg border border-slate-800"><div className="min-w-[680px]"><div className="grid grid-cols-6 gap-2 bg-slate-900 px-3 py-2 text-[10px] uppercase text-slate-500"><span>Produto</span><span>Tipo</span><span>Plano</span><span>Usuários</span><span>Receita/dia</span><span>Custo/dia</span></div>
      {models.length ? models.map((model) => <div key={model.id} className="grid grid-cols-6 gap-2 border-t border-slate-800/70 px-3 py-3 text-xs"><span className="truncate text-slate-200">{model.name} v{model.version}</span><span className="text-slate-400">{model.modality === 'IMAGE' ? 'Imagens' : 'Texto'}</span><span className="text-slate-400">{model.pricingMode === 'FREE' ? 'Gratuito' : 'Pago'}</span><span className="tabular-nums text-slate-200">{model.activeUsers.toLocaleString()}</span><span className="tabular-nums text-emerald-300">${model.dailyApiRevenue.toFixed(2)}</span><span className="tabular-nums text-amber-200">${model.dailyInferenceCost.toFixed(2)}</span></div>) : <p className="p-5 text-center text-xs text-slate-500">Publique um modelo para acompanhar adoção, receita e custo de inferência.</p>}
    </div></div><p className="text-[10px] leading-5 text-slate-500">Usuários e gerações são estimativas simuladas por produto; uma mesma pessoa pode usar mais de um modelo. Os custos de usuários gratuitos são cobrados do caixa mesmo quando a receita é zero.</p>
  </section>;
}
