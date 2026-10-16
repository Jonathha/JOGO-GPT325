import React from 'react';
import { InvestorRound, NewsHeadline } from '../types/gameTypes';
import { playUiClick } from '../engine/audioSynthesizer';

interface NewsModalProps {
  headlines: NewsHeadline[];
  soundEnabled: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
}

/**
 * Renders a breaking news card within the news feed modal.
 */
export function NewsHeadlineCard(props: {
  headline: NewsHeadline;
  soundEnabled: boolean;
  onMarkRead: (id: string) => void;
}): React.JSX.Element {
  const { headline, soundEnabled, onMarkRead } = props;

  return (
    <div className={`border rounded-lg p-3 text-xs ${headline.read ? 'border-slate-800 bg-slate-950/40 opacity-70' : 'border-sky-800/60 bg-sky-950/20'}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-sky-400">Dia {headline.day} &bull; {headline.timeString}</span>
          <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">{headline.category}</span>
        </div>
        {!headline.read && (
          <button
            type="button"
            onClick={() => {
              playUiClick(soundEnabled);
              onMarkRead(headline.id);
            }}
            className="text-[10px] text-sky-400 hover:text-sky-300 underline cursor-pointer"
          >
            Marcar lida
          </button>
        )}
      </div>
      <div className="font-semibold text-white text-sm mb-1">{headline.title}</div>
      <p className="text-slate-300 text-xs leading-relaxed mb-2">{headline.summary}</p>
      <div className="flex gap-3 text-[10px] font-mono">
        <span className={headline.impactReputation >= 0 ? 'text-emerald-400' : 'text-red-400'}>
          Reputação: {headline.impactReputation >= 0 ? `+${headline.impactReputation}` : headline.impactReputation}
        </span>
        <span className={headline.impactHype >= 0 ? 'text-sky-400' : 'text-red-400'}>
          Hype: {headline.impactHype >= 0 ? `+${headline.impactHype}` : headline.impactHype}
        </span>
      </div>
    </div>
  );
}

/**
 * Main Breaking News Modal window.
 * Displays real-time headlines and market events affecting the AI industry.
 */
export function NewsModal(props: NewsModalProps): React.JSX.Element {
  const { headlines, soundEnabled, onClose, onMarkRead } = props;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-5 shadow-2xl text-slate-200 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Manchetes & Notícias do Setor de IA</h2>
            <p className="text-xs text-slate-400">Acompanhe os movimentos dos concorrentes e repercussões de mercado.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-mono px-2 py-0.5 rounded hover:bg-slate-800 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {headlines.length === 0 ? (
            <div className="text-xs text-slate-500 py-6 text-center">
              Nenhuma notícia recente. O mercado está calmo.
            </div>
          ) : (
            headlines.map((h) => <NewsHeadlineCard key={h.id} headline={h} soundEnabled={soundEnabled} onMarkRead={onMarkRead} />)
          )}
        </div>
      </div>
    </div>
  );
}
