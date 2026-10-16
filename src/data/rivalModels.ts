export interface RivalModel {
  company: string;
  model: string;
  focus: string;
  mmlu: number;
  coding: number;
  math: number;
  inputPrice: number;
  outputPrice: number;
  releaseDay: number;
}

const RIVAL_ROADMAP: RivalModel[] = [
  { company: 'Nexora AI', model: 'Nexora One 3', focus: 'Velocidade e custo', mmlu: 82, coding: 79, math: 76, inputPrice: 0.25, outputPrice: 0.8, releaseDay: 1 },
  { company: 'Axiom Labs', model: 'Axiom Atlas 2', focus: 'Análise e raciocínio', mmlu: 91, coding: 86, math: 90, inputPrice: 1.5, outputPrice: 4.5, releaseDay: 1 },
  { company: 'Vela Systems', model: 'Vela Omni 1', focus: 'Multimodal e produtividade', mmlu: 85, coding: 83, math: 81, inputPrice: 0.6, outputPrice: 2.0, releaseDay: 1 },
  { company: 'Nexora AI', model: 'Nexora Swift 4', focus: 'Nova geração econômica', mmlu: 86, coding: 84, math: 82, inputPrice: 0.2, outputPrice: 0.6, releaseDay: 12 },
  { company: 'Axiom Labs', model: 'Axiom Atlas 3', focus: 'Raciocínio avançado', mmlu: 94, coding: 91, math: 94, inputPrice: 1.2, outputPrice: 3.8, releaseDay: 24 },
];

export function getRivalModelsForDay(day: number): RivalModel[] {
  return RIVAL_ROADMAP.filter((rival) => rival.releaseDay <= day).map((rival) => {
    const generations = Math.floor((day - rival.releaseDay) / 30);
    return {
      ...rival,
      mmlu: Math.min(98, rival.mmlu + generations),
      coding: Math.min(98, rival.coding + generations),
      math: Math.min(98, rival.math + generations),
      inputPrice: Math.max(0.1, rival.inputPrice * Math.pow(0.97, generations)),
      outputPrice: Math.max(0.2, rival.outputPrice * Math.pow(0.97, generations)),
    };
  });
}
