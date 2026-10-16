import React from 'react';
import { NewsHeadline } from '../types/gameTypes';

export type NewsTab = 'OVERVIEW' | 'INDUSTRY' | 'RESEARCH' | 'VENTURE' | 'UNREAD' | 'HISTORY';
export const NEWS_TABS: { id: NewsTab; label: string; heading: string; description: string }[] = [
  { id: 'OVERVIEW', label: 'Panorama', heading: 'Últimos acontecimentos', description: 'Visão consolidada dos eventos recentes.' },
  { id: 'INDUSTRY', label: 'Mercado', heading: 'Indústria e concorrência', description: 'Movimentos do setor e pressão competitiva.' },
  { id: 'RESEARCH', label: 'Pesquisa e ética', heading: 'Pesquisa, segurança e ética', description: 'Descobertas científicas e debates sobre responsabilidade.' },
  { id: 'VENTURE', label: 'Investimentos', heading: 'Capital e investimentos', description: 'Rodadas, fundos e apetite do mercado.' },
  { id: 'UNREAD', label: 'Não lidas', heading: 'Pendentes de leitura', description: 'Eventos que você ainda não abriu ou marcou como lidos.' },
  { id: 'HISTORY', label: 'Histórico', heading: 'Arquivo cronológico', description: 'Registro dos eventos recentes por dia e horário.' },
];
const categoryNames: Record<NewsHeadline['category'], string> = {
  INDUSTRY: 'Indústria', RIVAL: 'Concorrência', DISCOVERY: 'Descoberta', ETHICS: 'Ética', VENTURE: 'Investimentos',
};
export function filterHeadlines(headlines: NewsHeadline[], tab: NewsTab): NewsHeadline[] {
  if (tab === 'UNREAD') return headlines.filter((headline) => !headline.read);
  if (tab === 'INDUSTRY') return headlines.filter((headline) => headline.category === 'INDUSTRY' || headline.category === 'RIVAL');
  if (tab === 'RESEARCH') return headlines.filter((headline) => headline.category === 'DISCOVERY' || headline.category === 'ETHICS');
  if (tab === 'VENTURE') return headlines.filter((headline) => headline.category === 'VENTURE');
  if (tab === 'HISTORY') return [...headlines].sort((a, b) => b.day - a.day || b.timeString.localeCompare(a.timeString));
  return headlines;
}
export function NewsHeadlineCard({ headline, onOpen, onMarkRead }: {
  headline: NewsHeadline; onOpen: () => void; onMarkRead: () => void;
}): React.JSX.Element {
  const impact = headline.impactValuationPct;
  return (
    <article className={`rounded-xl border p-4 transition-colors ${headline.read ? 'border-[#2b3932] bg-[#141e19]' : 'border-[#536c5b] bg-[#1a2820]'}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[#a7c1ad]">{categoryNames[headline.category]} · Dia {headline.day}</span>
        <span className="shrink-0 font-mono text-[10px] text-[#8fa197]">{headline.timeString}</span>
      </div>
      <button type="button" onClick={onOpen} className="mt-2 block w-full text-left text-sm font-semibold leading-snug text-white transition-colors hover:text-[#d5e6d6]">{headline.title}</button>
      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#aab8af]">{headline.summary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#2d3c33] pt-3 text-[10px] font-medium">
        <span className={headline.impactReputation >= 0 ? 'text-[#a8d0ad]' : 'text-[#e2a39a]'}>Reputação {headline.impactReputation > 0 ? '+' : ''}{headline.impactReputation}</span>
        <span className={headline.impactHype >= 0 ? 'text-[#a8d0ad]' : 'text-[#e2a39a]'}>Hype {headline.impactHype > 0 ? '+' : ''}{headline.impactHype}</span>
        <span className={impact >= 0 ? 'text-[#a8d0ad]' : 'text-[#e2a39a]'}>Valuation {impact > 0 ? '+' : ''}{impact}%</span>
        <span className="flex-1" />
        {!headline.read && <button type="button" onClick={onMarkRead} className="text-[#b9c9bd] underline decoration-[#617a67] underline-offset-2 hover:text-white">Marcar como lida</button>}
        <button type="button" onClick={onOpen} className="font-semibold text-white hover:text-[#d5e6d6]">Ler detalhes →</button>
      </div>
    </article>
  );
}
