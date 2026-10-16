import React from 'react';
import { CompanyState } from '../types/gameTypes';
import { TopBarMetricsStrip } from './TopBarMetrics';
import { SpeedAndAudioControls, TopBarActionButtons } from './TopBarActions';

interface TopBarHUDProps {
  state: CompanyState;
  onSetGameSpeed: (speed: number) => void;
  onToggleSound: () => void;
  onOpenModal: (modal: CompanyState['activeModal']) => void;
  activeView: 'office' | 'city';
  onChangeView: (view: 'office' | 'city') => void;
}

/**
 * Global Top Navigation Bar complying with the Top Bar contract:
 * Zone 1: Single brand wordmark with phase name
 * Zone 2: Telemetry metrics strip
 * Zone 3: Navigation action buttons and speed controls
 */
export function TopBarHUD(props: TopBarHUDProps): React.JSX.Element {
  const { state, onSetGameSpeed, onToggleSound, onOpenModal, activeView, onChangeView } = props;

  const phaseNames: Record<CompanyState['phase'], string> = {
    GARAGEM: 'Garagem Seed',
    LOFT_STARTUP: 'Loft Série A',
    CAMPUS_IA: 'Campus Série B',
    TORRE_SUPERCLUSTER: 'Torre AGI',
  };

  const currentPhaseTitle = phaseNames[state.phase] || 'Garagem Seed';

  return (
    <header className="fixed top-0 left-0 right-0 h-[52px] z-40 bg-[#111b19]/95 backdrop-blur-md border-b border-[#2a3a35] px-4 flex items-center justify-between gap-4">
      {/* Zone 1: Brand wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-bold text-white text-sm tracking-tight whitespace-nowrap">
          {state.companyName || 'Apex AI Labs'}
        </span>
        <span className="text-[11px] font-mono text-[#b9d2c2] bg-[#263a33] px-2 py-0.5 rounded border border-[#40584c] whitespace-nowrap">
          {currentPhaseTitle}
        </span>
      </div>

      {/* Separate top-down city showcase from the playable office. */}
      <nav className="flex shrink-0 items-center rounded-lg border border-[#354740] bg-[#192722] p-1" aria-label="Área do jogo">
        {([
          { id: 'office', label: 'Escritório' },
          { id: 'city', label: 'Cidade' },
        ] as const).map((view) => (
          <button
            key={view.id}
            type="button"
            aria-pressed={activeView === view.id}
            onClick={() => onChangeView(view.id)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${activeView === view.id ? 'bg-[#d9e7d9] text-[#203a34] shadow-sm' : 'text-[#a9b9b0] hover:text-white'}`}
          >
            {view.label}
          </button>
        ))}
      </nav>

      {/* Zone 2: Central telemetry metrics strip */}
      <div className="hidden xl:flex min-w-0 flex-1 items-center justify-center">
        <TopBarMetricsStrip state={state} />
      </div>

      {/* Zone 3: Speed, audio, and primary action drawers */}
      <div className="flex items-center gap-3 shrink-0">
        <SpeedAndAudioControls
          speed={state.gameSpeed}
          soundEnabled={state.soundEnabled}
          onSetSpeed={onSetGameSpeed}
          onToggleSound={onToggleSound}
        />
        <TopBarActionButtons
          state={state}
          onSetGameSpeed={onSetGameSpeed}
          onToggleSound={onToggleSound}
          onOpenModal={onOpenModal}
        />
      </div>
    </header>
  );
}
