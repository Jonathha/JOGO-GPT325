import React, { useState } from 'react';
import { CompanyState } from '../types/gameTypes';
import { DashboardUsersPanel } from './DashboardUsersPanel';
import { DashboardMarketPanel } from './DashboardMarketPanel';
import { DashboardFinancePanel } from './DashboardFinancePanel';

export function ManagementDashboardModal({ state, onClose }: { state: CompanyState; onClose: () => void }): React.JSX.Element {
  const [tab, setTab] = useState<'users' | 'market' | 'finance'>('users');
  const tabs = [{ id: 'users' as const, label: 'Usuários' }, { id: 'market' as const, label: 'Mercado' }, { id: 'finance' as const, label: 'Finanças' }];
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-5" role="dialog" aria-modal="true" aria-label="Painéis de gestão"><div className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
    <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><div><h2 className="text-sm font-semibold text-white">Painéis da empresa</h2><p className="mt-1 text-xs text-slate-400">Acompanhamento operacional e comercial</p></div><button onClick={onClose} className="rounded px-2 py-1 text-lg text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Fechar">×</button></header>
    <nav className="flex gap-1 border-b border-slate-800 px-3 py-2">{tabs.map((item) => <button key={item.id} onClick={() => setTab(item.id)} aria-pressed={tab === item.id} className={tab === item.id ? 'rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900' : 'rounded-md px-3 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-white'}>{item.label}</button>)}</nav>
    <div className="overflow-y-auto p-4">{tab === 'users' ? <DashboardUsersPanel state={state} /> : tab === 'market' ? <DashboardMarketPanel state={state} /> : <DashboardFinancePanel state={state} />}</div>
  </div></div>;
}
