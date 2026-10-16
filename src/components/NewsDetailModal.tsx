import React from 'react';
import { NewsHeadline } from '../types/gameTypes';

const categoryLabels: Record<NewsHeadline['category'], string> = {
  INDUSTRY: 'Indústria', RIVAL: 'Concorrência', DISCOVERY: 'Descobertas', ETHICS: 'Ética', VENTURE: 'Investimentos',
};
function impactTone(value: number): string {
  return value > 0 ? 'text-[#b5d9b7]' : value < 0 ? 'text-[#e4aaa1]' : 'text-[#b5c1b8]';
}
export function NewsDetailModal({ headline, onClose, onMarkRead }: {
  headline: NewsHeadline; onClose: () => void; onMarkRead: () => void;
}): React.JSX.Element {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#050908]/75 p-3 sm:p-6">
      <section role="dialog" aria-modal="true" aria-labelledby="headline-title" className="flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#425448] bg-[#111a17] text-[#e4ebe6] shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-[#2a3932] px-5 py-4 sm:px-7">
          <div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#a4c0aa]">{categoryLabels[headline.category]} · Dia {headline.day}, {headline.timeString}</p><h2 id="headline-title" className="mt-2 text-lg font-semibold leading-snug text-white sm:text-xl">{headline.title}</h2></div>
          <button type="button" onClick={onClose} aria-label="Voltar às notícias" className="rounded-lg px-3 py-1 text-2xl leading-none text-[#a9b7af] hover:bg-[#24332c] hover:text-white">&times;</button>
        </header>
        <div className="overflow-y-auto px-5 py-5 sm:px-7">
          <p className="text-sm leading-7 text-[#d0dbd3]">{headline.summary}</p>
          <section className="mt-6 rounded-xl border border-[#34443d] bg-[#17221d] p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#b7c9bb]">Impacto aplicado à empresa</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#96a79c]">Estes são os efeitos numéricos definidos pelo evento e aplicados quando a notícia surgiu. Eles não são previsões nem uma estimativa externa.</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-[#101814] p-3"><p className="text-[10px] text-[#94a69a]">Reputação</p><p className={`mt-1 text-xl font-semibold ${impactTone(headline.impactReputation)}`}>{headline.impactReputation > 0 ? '+' : ''}{headline.impactReputation}</p><p className="mt-1 text-[10px] text-[#819187]">Pontos na escala de reputação</p></div>
              <div className="rounded-lg bg-[#101814] p-3"><p className="text-[10px] text-[#94a69a]">Hype</p><p className={`mt-1 text-xl font-semibold ${impactTone(headline.impactHype)}`}>{headline.impactHype > 0 ? '+' : ''}{headline.impactHype}</p><p className="mt-1 text-[10px] text-[#819187]">Pontos de interesse público</p></div>
              <div className="rounded-lg bg-[#101814] p-3"><p className="text-[10px] text-[#94a69a]">Valuation</p><p className={`mt-1 text-xl font-semibold ${impactTone(headline.impactValuationPct)}`}>{headline.impactValuationPct > 0 ? '+' : ''}{headline.impactValuationPct}%</p><p className="mt-1 text-[10px] text-[#819187]">Variação aplicada ao valor da empresa</p></div>
            </div>
          </section>
          <p className="mt-4 text-[11px] leading-relaxed text-[#819187]">Fonte: evento simulado pelo sistema de notícias do jogo. A notícia não representa uma publicação jornalística externa.</p>
        </div>
        <footer className="flex flex-wrap justify-end gap-2 border-t border-[#2a3932] px-5 py-3 sm:px-7">
          {!headline.read && <button type="button" onClick={onMarkRead} className="rounded-lg border border-[#46594a] px-4 py-2 text-xs font-medium text-[#d1e0d4] transition hover:bg-[#223128]">Marcar como lida</button>}
          <button type="button" onClick={onClose} className="rounded-lg bg-[#d7e4d8] px-4 py-2 text-xs font-semibold text-[#1c2d23] transition hover:bg-white">Voltar à central</button>
        </footer>
      </section>
    </div>
  );
}
