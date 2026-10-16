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

/**
 * Initial company creation dialog presented to the player on first launch.
 * Enables setting company name, founder identity, and AI strategic specialization.
 */
export function CompanySetupModal(props: CompanySetupModalProps): React.JSX.Element {
  const { onStartCompany, soundEnabled } = props;
  const [name, setName] = useState('Apex AI Labs');
  const [founder, setFounder] = useState('Dra. Laura Vance');
  const [archetype, setArchetype] = useState<ArchetypeId>('RESEARCH_LAB');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim() || 'Apex AI Labs';
    const cleanFounder = founder.trim() || 'Dra. Laura Vance';
    try {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    } catch (confettiErr) {
      console.warn('Confetti deferred:', confettiErr);
    }
    playCashRegister(soundEnabled);
    onStartCompany(cleanName, cleanFounder, archetype);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl text-slate-200">
        <div className="mb-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-sky-400 mb-0.5">Fundação da Startup</div>
          <h1 className="text-xl font-bold text-white tracking-tight">Criar Empresa de Inteligência Artificial</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CompanyIdentityFields name={name} founder={founder} setName={setName} setFounder={setFounder} />
          <CompanyArchetypeGrid archetype={archetype} setArchetype={setArchetype} />
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-md"
            >
              Abrir Escritório e Começar &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
