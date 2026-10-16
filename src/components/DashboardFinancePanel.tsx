import React from 'react';
import { CompanyState } from '../types/gameTypes';

export function DashboardFinancePanel({ state }: { state: CompanyState }): React.JSX.Element {
  const revenue = state.models.filter((model) => model.isReleased).reduce((sum, model) => sum + model.dailyApiRevenue, 0);
  const inference = state.models.filter((model) => model.isReleased).reduce((sum, model) => sum + model.dailyInferenceCost, 0);
  const payroll = state.employees.reduce((sum, employee) => sum + employee.salaryPerDay, 0);
  const cloud = state.hardware.cloudGPUs * 18;
  const expenses = payroll + cloud + state.hardware.dailyPowerCost + inference;
  const metric = (value: number) => '$' + Math.round(value).toLocaleString();
  return <section className="grid gap-3 sm:grid-cols-2">
    {[['Caixa disponível', metric(state.funds)], ['Receita diária', metric(revenue)], ['Despesas diárias', metric(expenses)], ['Resultado diário estimado', metric(revenue - expenses)]].map(([label, value]) => <article key={label} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4"><p className="text-xs text-slate-400">{label}</p><strong className="mt-2 block text-xl text-white">{value}</strong></article>)}
    <div className="sm:col-span-2 rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-400"><p>Folha: {metric(payroll)} / dia</p><p className="mt-1">Nuvem e energia: {metric(cloud + state.hardware.dailyPowerCost)} / dia</p><p className="mt-1">Inferência dos modelos: {metric(inference)} / dia</p><p className="mt-2 text-slate-500">Receita depende de usuários, preço e uso, não de bônus fixos por modelo.</p></div>
  </section>;
}
