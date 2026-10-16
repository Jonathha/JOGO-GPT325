import React from 'react';
import { ArchetypeId } from '../types/gameTypes';

interface ArchetypeOptionProps {
  id: ArchetypeId;
  title: string;
  desc: string;
  perk: string;
  selected: boolean;
  onSelect: (id: ArchetypeId) => void;
}

/**
 * Renders an archetype selection option card.
 * Formatted with explicit styling, states, and selection feedback.
 */
export function ArchetypeSelectOption(props: ArchetypeOptionProps): React.JSX.Element {
  const { id, title, desc, perk, selected, onSelect } = props;
  const isSelected = selected === true;
  const activeClass = 'border-[#a7c0a7] bg-[#263b30] shadow-sm ring-1 ring-[#a7c0a7]/25';
  const inactiveClass = 'border-[#314239] bg-[#121d18] hover:border-[#647b68]';
  const borderClass = isSelected ? activeClass : inactiveClass;

  // Render badge label for current focus state
  const statusLabel = isSelected ? 'Ativo' : 'Foco';
  const statusColor = isSelected ? 'text-[#c6d8c3] font-medium' : 'text-slate-500';
  const ariaState = isSelected ? 'true' : 'false';
  const buttonTitle = `Selecionar foco estratégico: ${title}`;

  return (
    <button
      type="button"
      role="radio"
      title={buttonTitle}
      aria-checked={ariaState}
      onClick={() => onSelect(id)}
      className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${borderClass}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-slate-100 text-xs">{title}</span>
        <span className={`text-[10px] font-mono ${statusColor}`}>{statusLabel}</span>
      </div>
      <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{desc}</p>
      <div className="text-[10px] font-mono text-[#c1d4bf] bg-[#273a2e] px-1.5 py-0.5 rounded inline-block">
        {perk}
      </div>
    </button>
  );
}

interface IdentityFieldsProps {
  name: string;
  founder: string;
  setName: (v: string) => void;
  setFounder: (v: string) => void;
}

/**
 * Renders the basic identity inputs (company name and founder researcher).
 * Extracted into clean modular component complying with line limits.
 */
export function CompanyIdentityFields(props: IdentityFieldsProps): React.JSX.Element {
  const { name, founder, setName, setFounder } = props;

  // Render responsive 2-column input fields
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-[11px] font-medium text-slate-300 mb-1">
          Nome da Empresa de IA
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Apex AI, Nova..."
          className="w-full bg-[#0d1511] border border-[#3a4d40] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#a7c0a7]"
          required
        />
      </div>
      <div>
        <label className="block text-[11px] font-medium text-slate-300 mb-1">
          Nome do(a) Pesquisador(a) Fundador(a)
        </label>
        <input
          type="text"
          value={founder}
          onChange={(e) => setFounder(e.target.value)}
          placeholder="Ex: Dra. Helena Vance"
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
          required
        />
      </div>
    </div>
  );
}
