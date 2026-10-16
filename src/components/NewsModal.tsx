import React, { useMemo, useState } from 'react';
import { NewsHeadline } from '../types/gameTypes';
import { playUiClick } from '../engine/audioSynthesizer';
import { NewsHeadlineCard, NewsTab, NEWS_TABS, filterHeadlines } from './NewsModalContent';
import { NewsDetailModal } from './NewsDetailModal';

interface NewsModalProps {
  headlines: NewsHeadline[];
  soundEnabled: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
}

export function NewsModal({ headlines, soundEnabled, onClose, onMarkRead }: NewsModalProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<NewsTab>('OVERVIEW');
  const [selected, setSelected] = useState<NewsHeadline | null>(null);
  const unread = headlines.filter((headline) => !headline.read).length;
  const visible = useMemo(() => filterHeadlines(headlines, activeTab), [headlines, activeTab]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050908]/85 p-3 sm:p-6">
      <section role="dialog" aria-modal="true" aria-labelledby="news-title" className="flex max-h-[90dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#34443d] bg-[#111a17] text-[#e4ebe6] shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-[#2a3932] px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#9ab4a4]">Apex Intelligence · Central editorial</p>
            <h2 id="news-title" className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">Panorama do setor de IA</h2>
            <p className="mt-1 text-xs text-[#9eaea4]">Eventos que movimentam reputação, interesse público e valuation da empresa.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar notícias" className="rounded-lg px-3 py-1 text-2xl leading-none text-[#a9b7af] transition hover:bg-[#24332c] hover:text-white">&times;</button>
        </header>
        <div className="flex flex-wrap items-center gap-1 border-b border-[#2a3932] px-4 pt-3 sm:px-6" role="tablist" aria-label="Seções de notícias">
          {NEWS_TABS.map((tab) => (
            <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className={`relative rounded-t-lg px-3 py-2.5 text-xs transition-colors sm:px-4 ${activeTab === tab.id ? 'bg-[#24332c] font-semibold text-white after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-[#c5d9c9]' : 'text-[#9eaea4] hover:bg-[#1b2822] hover:text-white'}`}>
              {tab.label}{tab.id === 'UNREAD' && unread > 0 ? ` · ${unread}` : ''}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'OVERVIEW' && headlines.length > 0 && (
            <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
              <div className="rounded-xl border border-[#34443d] bg-[#17221d] p-3"><p className="text-[10px] uppercase tracking-wider text-[#94a79a]">Notícias registradas</p><p className="mt-1 text-2xl font-semibold text-white">{headlines.length}</p></div>
              <div className="rounded-xl border border-[#34443d] bg-[#17221d] p-3"><p className="text-[10px] uppercase tracking-wider text-[#94a79a]">Não lidas</p><p className="mt-1 text-2xl font-semibold text-white">{unread}</p></div>
              <div className="col-span-2 rounded-xl border border-[#34443d] bg-[#17221d] p-3 lg:col-span-1"><p className="text-[10px] uppercase tracking-wider text-[#94a79a]">Cobertura</p><p className="mt-1 text-sm font-medium text-white">Pesquisa, indústria, ética e capital</p></div>
            </div>
          )}
          <div className="mb-3 flex items-end justify-between gap-3">
            <div><h3 className="text-sm font-semibold text-white">{NEWS_TABS.find((tab) => tab.id === activeTab)?.heading}</h3><p className="mt-1 text-xs text-[#92a399]">{NEWS_TABS.find((tab) => tab.id === activeTab)?.description}</p></div>
            <span className="shrink-0 text-[10px] font-mono text-[#91a399]">{visible.length} {visible.length === 1 ? 'registro' : 'registros'}</span>
          </div>
          {visible.length === 0 ? <div className="rounded-xl border border-dashed border-[#34443d] px-5 py-12 text-center"><p className="text-sm font-medium text-[#d9e2dc]">Nenhuma notícia nesta seção</p><p className="mt-1 text-xs text-[#91a399]">Novos acontecimentos aparecerão aqui durante a simulação.</p></div> : (
            <div className="grid gap-3 lg:grid-cols-2">{visible.map((headline) => <NewsHeadlineCard key={headline.id} headline={headline} onOpen={() => { setSelected({ ...headline, read: true }); if (!headline.read) onMarkRead(headline.id); }} onMarkRead={() => { playUiClick(soundEnabled); onMarkRead(headline.id); }} />)}</div>
          )}
        </div>
        <footer className="flex items-center justify-between border-t border-[#2a3932] px-5 py-3 text-[10px] text-[#819288] sm:px-7"><span>Arquivo limitado aos 20 eventos mais recentes.</span><span>Dia atual · notícias simuladas</span></footer>
      </section>
      {selected && <NewsDetailModal headline={selected} onClose={() => setSelected(null)} onMarkRead={() => { onMarkRead(selected.id); setSelected({ ...selected, read: true }); }} />}
    </div>
  );
}
