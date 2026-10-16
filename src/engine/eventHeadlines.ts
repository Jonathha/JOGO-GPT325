import { CompanyState, GamePhase, NewsHeadline } from '../types/gameTypes';

interface HeadlineTemplate {
  title: string;
  summary: string;
  category: 'INDUSTRY' | 'RIVAL' | 'DISCOVERY' | 'ETHICS' | 'VENTURE';
  impactReputation: number;
  impactHype: number;
  impactValuationPct: number;
}

/**
 * Retrieves a curated breaking news template based on pseudo-random seed.
 * Models realistic events in the frontier AI ecosystem.
 */
export function getHeadlineTemplate(seed: number): HeadlineTemplate {
  const templates: HeadlineTemplate[] = [
    {
      title: 'Vazamento de Pesquisa Open-Source sacode os Mercados de IA',
      summary: 'Pesquisadores independentes publicaram pesos abertos de alta eficiência, desafiando monopólios de grandes big techs.',
      category: 'INDUSTRY',
      impactReputation: 4,
      impactHype: 8,
      impactValuationPct: 5,
    },
    {
      title: 'Conferência NeurIPS premia arquitetura pioneira de transformers',
      summary: 'Novo artigo científico demonstra redução de 40% na computação necessária para raciocínio complexo.',
      category: 'DISCOVERY',
      impactReputation: 7,
      impactHype: 6,
      impactValuationPct: 8,
    },
    {
      title: 'Escassez de GPUs H100 eleva os custos de nuvem no Vale do Silício',
      summary: 'Data centers globais operam com capacidade máxima e filas de espera para novos aceleradores ultrapassam 6 meses.',
      category: 'RIVAL',
      impactReputation: -2,
      impactHype: 4,
      impactValuationPct: -3,
    },
    {
      title: 'Comissão de Segurança em IA debate padrões para modelos de fronteira',
      summary: 'Líderes globais defendem auditorias rigorosas de alinhamento e transparência em grandes modelos fundacionais.',
      category: 'ETHICS',
      impactReputation: 5,
      impactHype: -3,
      impactValuationPct: 2,
    },
    {
      title: 'Megafundo Soberano anuncia rodada multibilionária para startups de IA',
      summary: 'Apetite de investidores por empresas com modelos proprietários atinge pico histórico no trimestre.',
      category: 'VENTURE',
      impactReputation: 3,
      impactHype: 10,
      impactValuationPct: 12,
    },
  ];

  const safeIndex = Math.abs(seed) % templates.length;
  return templates[safeIndex];
}

/**
 * Generates an authentic Silicon Valley breaking AI headline
 * covering venture capital, open-source leaks, benchmark breakthroughs, or safety hearings.
 */
export function generateDynamicHeadline(
  day: number,
  phase: GamePhase,
  seed: number
): NewsHeadline {
  // Fetch thematic news content from templates
  const template = getHeadlineTemplate(seed);
  const timeMinutes = 9 + (seed % 9);
  const timeSeconds = (seed * 17) % 60;
  const minuteString = timeMinutes.toString().padStart(2, '0');
  const secondString = timeSeconds.toString().padStart(2, '0');
  const formattedTime = `${minuteString}:${secondString}`;

  // Unique timestamped headline identifier
  const safeSeed = Math.abs(seed);
  const safeDay = Math.max(1, day);
  const headlineId = `news-d${safeDay}-s${safeSeed}-${Date.now()}`;

  // Build the complete news headline model
  const headline: NewsHeadline = {
    id: headlineId,
    day: safeDay,
    timeString: formattedTime,
    title: template.title,
    summary: template.summary,
    category: template.category,
    impactReputation: template.impactReputation,
    impactHype: template.impactHype,
    impactValuationPct: template.impactValuationPct,
    read: false,
  };

  // Return generated breaking news event
  return headline;
}

/**
 * Applies the economic, sentiment, and reputation effects of a breaking news headline
 * to the company's valuation, hype, and reputation meters.
 */
export function applyHeadlineImpact(
  state: CompanyState,
  headline: NewsHeadline
): CompanyState {
  // Validate and clamp updated reputation within bounds [0, 100]
  const rawReputation = state.reputation + headline.impactReputation;
  const newReputation = Math.max(0, Math.min(100, rawReputation));

  // Validate and clamp updated hype within bounds [0, 100]
  const rawHype = state.hype + headline.impactHype;
  const newHype = Math.max(0, Math.min(100, rawHype));

  // Valuation delta percentage computation
  const rawValuation = state.valuation;
  const percentageFactor = headline.impactValuationPct / 100;
  const valuationDelta = Math.round(rawValuation * percentageFactor);
  const minimumValuationFloor = 500000;
  const newValuation = Math.max(minimumValuationFloor, rawValuation + valuationDelta);

  // Prepend headline to feed and retain most recent 20 events
  const existingList = Array.isArray(state.headlines) ? state.headlines : [];
  const updatedHeadlines = [headline, ...existingList].slice(0, 20);

  const resultingState: CompanyState = {
    ...state,
    reputation: newReputation,
    hype: newHype,
    valuation: newValuation,
    headlines: updatedHeadlines,
  };

  return resultingState;
}
