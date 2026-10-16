import React from 'react';
import { GamePhase, OfficeTile } from '../types/gameTypes';
import { playUiClick } from '../engine/audioSynthesizer';

interface OfficeModalProps {
  phase: GamePhase;
  funds: number;
  valuation: number;
  soundEnabled: boolean;
  onClose: () => void;
  onUpgradePhase: (nextPhase: GamePhase, cost: number) => void;
}

/**
 * Renders an office phase upgrade tier card with requirement checks and upgrade action.
 */
export function PhaseUpgradeCard(props: {
  title: string;
  subtitle: string;
  cost: number;
  requiredValuation: number;
  currentValuation: number;
  currentFunds: number;
  isUnlocked: boolean;
  isCurrent: boolean;
  onUpgrade: () => void;
}): React.JSX.Element {
  const { title, subtitle, cost, requiredValuation, currentValuation, currentFunds, isUnlocked, isCurrent, onUpgrade } = props;
  const canAfford = currentFunds >= cost && currentValuation >= requiredValuation;

  return (
    <div className={`border rounded-lg p-3 text-xs flex items-center justify-between ${isCurrent ? 'border-sky-500 bg-sky-950/30' : 'border-slate-800 bg-slate-950/50'}`}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-white">{title}</span>
          {isCurrent && <span className="text-[10px] font-mono bg-sky-950 text-sky-400 px-1.5 py-0.5 rounded">Atual</span>}
          {isUnlocked && !isCurrent && <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded">Disponível</span>}
        </div>
        <div className="text-[11px] text-slate-400">{subtitle}</div>
        <div className="text-[10px] font-mono text-slate-500 mt-1">Valuation mín: ${(requiredValuation / 1000000).toFixed(1)}M</div>
      </div>
      <div>
        {isCurrent ? (
          <span className="text-xs font-mono text-sky-400 font-semibold">Sede Ativa</span>
        ) : (
          <button
            type="button"
            onClick={onUpgrade}
            disabled={!canAfford}
            className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:pointer-events-none text-slate-950 rounded font-semibold text-xs cursor-pointer shadow"
          >
            Mudar para {title} (${(cost / 1000).toFixed(0)}k)
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Main Office & Expansion Modal window.
 * Enables upgrading the company headquarters from Garage to Loft, Campus, and AGI Tower.
 */
export function OfficeModal(props: OfficeModalProps): React.JSX.Element {
  const { phase, funds, valuation, soundEnabled, onClose, onUpgradePhase } = props;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-5 shadow-2xl text-slate-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Expansão de Escritório & Sedes</h2>
            <p className="text-xs text-slate-400">Evolua sua infraestrutura física para acomodar mais pesquisadores e clusters.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-mono px-2 py-0.5 rounded hover:bg-slate-800 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="space-y-3">
          <PhaseUpgradeCard
            title="Garagem Seed (6x6)"
            subtitle="Ponto de partida humilde com 3 estações de trabalho e mini-servidor."
            cost={0}
            requiredValuation={0}
            currentValuation={valuation}
            currentFunds={funds}
            isUnlocked={true}
            isCurrent={phase === 'GARAGEM'}
            onUpgrade={() => {}}
          />

          <PhaseUpgradeCard
            title="Loft Industrial Série A (8x8)"
            subtitle="Espaço moderno com 6 estações, piso de carvalho e racks duplos."
            cost={120000}
            requiredValuation={5000000}
            currentValuation={valuation}
            currentFunds={funds}
            isUnlocked={valuation >= 5000000}
            isCurrent={phase === 'LOFT_STARTUP'}
            onUpgrade={() => {
              playUiClick(soundEnabled);
              onUpgradePhase('LOFT_STARTUP', 120000);
            }}
          />

          <PhaseUpgradeCard
            title="Campus de Pesquisa Série B (10x10)"
            subtitle="Centro de P&D avançado com 8 estações, ala de servidores e lounge."
            cost={850000}
            requiredValuation={25000000}
            currentValuation={valuation}
            currentFunds={funds}
            isUnlocked={valuation >= 25000000}
            isCurrent={phase === 'CAMPUS_IA'}
            onUpgrade={() => {
              playUiClick(soundEnabled);
              onUpgradePhase('CAMPUS_IA', 850000);
            }}
          />

          <PhaseUpgradeCard
            title="Torre AGI Supercluster (12x12)"
            subtitle="Penthouse futurista com supercomputadores e cúpula holográfica."
            cost={5000000}
            requiredValuation={150000000}
            currentValuation={valuation}
            currentFunds={funds}
            isUnlocked={valuation >= 150000000}
            isCurrent={phase === 'TORRE_SUPERCLUSTER'}
            onUpgrade={() => {
              playUiClick(soundEnabled);
              onUpgradePhase('TORRE_SUPERCLUSTER', 5000000);
            }}
          />
        </div>
      </div>
    </div>
  );
}
