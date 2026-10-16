import React from 'react';
import { ArchetypeId } from '../types/gameTypes';
import { ArchetypeSelectOption } from './CompanySetupInputs';

interface ArchetypeGridProps {
  archetype: ArchetypeId;
  setArchetype: (v: ArchetypeId) => void;
}

/**
 * Renders the 2x2 grid of strategic AI specialization options for the new company.
 * Encapsulates option selection to maintain component line limits.
 */
export function CompanyArchetypeGrid(props: ArchetypeGridProps): React.JSX.Element {
  const { archetype, setArchetype } = props;

  return (
    <div>
      <label className="block text-[11px] font-medium text-slate-300 mb-1.5">Foco Estratégico do Laboratório</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <ArchetypeSelectOption
          id="RESEARCH_LAB"
          title="Modelos Fundacionais"
          desc="Pré-treino e escalonamento de LLMs."
          perk="+15% velocidade de treino"
          selected={archetype === 'RESEARCH_LAB'}
          onSelect={setArchetype}
        />
        <ArchetypeSelectOption
          id="AUTONOMOUS_AGENTS"
          title="Agentes Autônomos"
          desc="Raciocínio complexo e execução de código."
          perk="+20% score em coding"
          selected={archetype === 'AUTONOMOUS_AGENTS'}
          onSelect={setArchetype}
        />
        <ArchetypeSelectOption
          id="MULTIMODAL_FRONTIER"
          title="Multimodal & Imagem"
          desc="Fusão de visão computacional e texto."
          perk="+25% receita por token"
          selected={archetype === 'MULTIMODAL_FRONTIER'}
          onSelect={setArchetype}
        />
        <ArchetypeSelectOption
          id="SILICON_CHIPS"
          title="Eficiência & Hardware"
          desc="Compilação de baixo nível e economia."
          perk="-30% contas de energia"
          selected={archetype === 'SILICON_CHIPS'}
          onSelect={setArchetype}
        />
      </div>
    </div>
  );
}
