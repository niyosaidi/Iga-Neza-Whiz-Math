export type GameMode = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface Problem {
  text: string;
  answer: number;
}

export interface DailyProblem {
  story: string;
  question: string;
  answer: number;
}