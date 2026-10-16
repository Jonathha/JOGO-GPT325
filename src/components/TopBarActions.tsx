import React from 'react';
import { CompanyState } from '../types/gameTypes';
import { playUiClick } from '../engine/audioSynthesizer';

interface TopBarActionsProps {
  state: CompanyState;
  onSetGameSpeed: (speed: number) => void;
  onToggleSound: () => void;
  onOpenModal: (modal: CompanyState['activeModal']) => void;
}

/**
 * Renders simulation speed buttons (pause, 1x, 2x, 5x) and audio toggle.
 * Clean segmented control with single line labels.
 */
export function SpeedAndAudioControls(props: {
  speed: number;
  soundEnabled: boolean;
  onSetSpeed: (s: number) => void;
  onToggleSound: () => void;
}): React.JSX.Element {
  const { speed, soundEnabled, onSetSpeed, onToggleSound } = props;
  const speeds = [0, 1, 2, 5];

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5">
        {speeds.map((s) => {
          const isActive = speed === s;
          const label = s === 0 ? '⏸' : `${s}x`;
          const activeStyle = 'bg-[#d6e5d8] text-[#203a34] font-bold';
          const inactiveStyle = 'text-slate-400 hover:text-white';
          return (
            <button
              key={s}
              type="button"
              onClick={() => {
                playUiClick(soundEnabled);
                onSetSpeed(s);
              }}
              className={`px-2 py-0.5 text-xs rounded transition-colors cursor-pointer ${isActive ? activeStyle : inactiveStyle}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          playUiClick(!soundEnabled);
          onToggleSound();
        }}
        className={`px-2 py-1 text-xs rounded border transition-colors cursor-pointer ${
          soundEnabled ? 'border-[#354740] text-[#c4d2c9] bg-[#192722]' : 'border-[#654544] text-[#e5b8b3] bg-[#321f20]'
        }`}
        title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Áudio'}
      >
        {soundEnabled ? 'Som' : 'Mudo'}
      </button>
    </div>
  );
}

/**
 * Primary navigation actions strip enabling modals for training, hiring, hardware, and news.
 * Follows strict single-line whitespace-nowrap button guidelines.
 */
export function TopBarActionButtons(props: TopBarActionsProps): React.JSX.Element {
  const { state, onOpenModal } = props;
  const unreadCount = state.headlines.filter((h) => !h.read).length;

  const navItems: { label: string; modal: CompanyState['activeModal']; isPrimary?: boolean }[] = [
    { label: '+ Treinar IA', modal: 'TRAINING', isPrimary: true },
    { label: 'GPUs', modal: 'HARDWARE' },
    { label: 'Equipe', modal: 'HIRING' },
    { label: 'Escritório', modal: 'OFFICE' },
    { label: 'Painéis', modal: 'DASHBOARD' },
    { label: `Notícias${unreadCount > 0 ? ` (${unreadCount})` : ''}`, modal: 'NEWS' },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {navItems.map((item) => {
        const primaryClass = 'text-[#203a34] bg-[#d6e5d8] hover:bg-[#e5eee4] font-semibold shadow-sm';
        const secondaryClass = 'text-[#c2cec6] hover:text-white bg-[#192722] hover:bg-[#24352e] border border-[#354740] font-medium';
        const itemClass = item.isPrimary ? primaryClass : secondaryClass;

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              playUiClick(state.soundEnabled);
              onOpenModal(item.modal);
            }}
            className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap cursor-pointer ${itemClass}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
