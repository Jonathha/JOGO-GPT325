import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArchetypeId } from '../types/gameTypes';
import { playCashRegister } from '../engine/audioSynthesizer';
import { CompanyIdentityFields } from './CompanySetupInputs';
import { CompanyArchetypeGrid } from './CompanyArchetypeGrid';

interface CompanySetupModalProps {
  onStartCompany: (companyName: string, founderName: string, archetype: ArchetypeId) => void;
  soundEnabled: boolean;
}

export function CompanySetupModal({ onStartCompany, soundEnabled }: CompanySetupModalProps): React.JSX.Element {
  const [name, setName] = useState('Apex AI Labs');
  const [founder, setFounder] = useState('Dra. Laura Vance');
  const [archetype, setArchetype] = useState<ArchetypeId>('RESEARCH_LAB');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim().slice(0, 48) || 'Apex AI Labs';
    const cleanFounder = founder.trim().slice(0, 48) || 'Dra. Laura Vance';
    try { confetti({ particleCount: 55, spread: 55, origin: { y: 0.7 } }); } catch { /* Visual effect is optional. */ }
    playCashRegister(soundEnabled);
    onStartCompany(cleanName, cleanFounder, archetype);
  };

  return <main className="fixed inset-0 z-50 overflow-y-auto bg-[#0b1210] text-slate-100">
    <div className="grid min-h-full lg:grid-cols-[0.88fr_1.12fr]">
      <aside className="relative flex min-h-[230px] flex-col justify-between overflow-hidden border-b border-[#2d4137] bg-[#14231d] p-6 sm:p-10 lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full border border-[#526d5b]/30" />
        <div className="pointer-events-none absolute -right-10 -top-6 h-52 w-52 rounded-full border border-[#526d5b]/20" />
        <div className="relative"><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b3c9b7]">Titan Tycoon / Simulação empresarial</p>
          <h1 className="mt-7 max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Construa uma empresa que muda o mercado de IA.</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-[#a8bcb0]">Comece com capital limitado, monte sua equipe, treine modelos e transforme pesquisa em produtos sustentáveis.</p>
        </div>
        <div className="relative mt-8 grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
          <div className="border-t border-[#526d5b] pt-3"><strong className="block text-sm text-white">Pesquisa</strong><span className="mt-1 block text-[11px] leading-4 text-[#9fb3a5]">Treino, versões e avaliação</span></div>
          <div className="border-t border-[#526d5b] pt-3"><strong className="block text-sm text-white">Mercado</strong><span className="mt-1 block text-[11px] leading-4 text-[#9fb3a5]">Preços, usuários e rivais</span></div>
          <div className="border-t border-[#526d5b] pt-3"><strong className="block text-sm text-white">Operação</strong><span className="mt-1 block text-[11px] leading-4 text-[#9fb3a5]">Equipe, hardware e caixa</span></div>
        </div>
      </aside>
      <section className="flex items-start justify-center p-4 sm:p-8 lg:items-center lg:p-10">
        <div className="w-full max-w-2xl py-4">
          <div className="mb-6"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9fbea8]">Nova campanha</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Defina sua fundação</h2><p className="mt-2 text-sm text-slate-400">Escolha a identidade e a vantagem inicial. Você poderá expandir a estratégia durante a partida.</p></div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <CompanyIdentityFields name={name} founder={founder} setName={setName} setFounder={setFounder} />
            <CompanyArchetypeGrid archetype={archetype} setArchetype={setArchetype} />
            <div className="flex flex-col-reverse gap-3 border-t border-[#2d4137] pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-sm text-[11px] leading-5 text-slate-500">A economia, os concorrentes e os resultados são simulados e evoluem com os dias de jogo.</p><button type="submit" className="shrink-0 rounded-lg bg-[#d5e3d5] px-5 py-3 text-sm font-semibold text-[#1b3027] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#9fbea8]">Fundar empresa <span aria-hidden="true">→</span></button></div>
          </form>
        </div>
      </section>
    </div>
  </main>;
}
