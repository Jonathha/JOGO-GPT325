import React from 'react';
import { CompanyState } from '../types/gameTypes';
import { TopBarMetricsStrip } from './TopBarMetrics';
import { SpeedAndAudioControls, TopBarActionButtons } from './TopBarActions';

interface TopBarHUDProps {
  state: CompanyState;
  onSetGameSpeed: (speed: number) => void;
  onToggleSound: () => void;
  onOpenModal: (modal: CompanyState['activeModal']) => void;
}

/**
 * Global Top Navigation Bar complying with the Top Bar contract:
 * Zone 1: Single brand wordmark with phase name
 * Zone 2: Telemetry metrics strip
 * Zone 3: Navigation action buttons and speed controls
 */
export function TopBarHUD(props: TopBarHUDProps): React.JSX.Element {
  const { state, onSetGameSpeed, onToggleSound, onOpenModal } = props;

  const phaseNames: Record<CompanyState['phase'], string> = {
    GARAGEM: 'Garagem Seed',
    LOFT_STARTUP: 'Loft Série A',
    CAMPUS_IA: 'Campus Série B',
    TORRE_SUPERCLUSTER: 'Torre AGI',
  };

  const currentPhaseTitle = phaseNames[state.phase] || 'Garagem Seed';

  return (
    <header className="fixed top-0 left-0 right-0 h-13 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between gap-4">
      {/* Zone 1: Brand wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-bold text-white text-sm tracking-tight whitespace-nowrap">
          {state.companyName || 'Apex AI Labs'}
        </span>
        <span className="text-[11px] font-mono text-sky-400/90 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40 whitespace-nowrap">
          {currentPhaseTitle}
        </span>
      </div>

      {/* Zone 2: Central telemetry metrics strip */}
      <div className="hidden lg:flex items-center justify-center flex-1">
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
