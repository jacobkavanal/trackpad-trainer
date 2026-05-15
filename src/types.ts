export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  radius: number;
  timeLimit: number; // ms
  label: string;
}

export interface SessionResult {
  difficulty: Difficulty;
  totalScore: number;
  hits: number;
  misses: number;
  reactionTimes: number[]; // ms, only successful hits
}
