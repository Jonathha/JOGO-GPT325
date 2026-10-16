export interface RivalModel {
  company: string;
  model: string;
  focus: string;
  mmlu: number;
  coding: number;
  math: number;
  inputPrice: number;
  outputPrice: number;
}

export const RIVAL_MODELS: RivalModel[] = [
  { company: 'Nexora AI', model: 'Nexora One 3', focus: 'Velocidade e custo', mmlu: 82, coding: 79, math: 76, inputPrice: 0.25, outputPrice: 0.8 },
  { company: 'Axiom Labs', model: 'Axiom Atlas 2', focus: 'Análise e raciocínio', mmlu: 91, coding: 86, math: 90, inputPrice: 1.5, outputPrice: 4.5 },
  { company: 'Vela Systems', model: 'Vela Omni 1', focus: 'Multimodal e produtividade', mmlu: 85, coding: 83, math: 81, inputPrice: 0.6, outputPrice: 2.0 },
];
