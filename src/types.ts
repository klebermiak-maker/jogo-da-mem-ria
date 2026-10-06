/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BnccPair {
  id: string;
  subject: 'matematica' | 'portugues';
  prompt: string;
  promptLabel: string;
  match: string;
  matchLabel: string;
  bncc: string;
  description: string;
}

export type GameMode = 'matematica' | 'portugues' | 'misto';

export interface DifficultyLevel {
  level: number;
  name: string;
  pairs: number;
  timeLimit: number;
  badge: string;
  description: string;
}

export interface CardItem {
  uid: string;
  pairId: string;
  type: 'prompt' | 'match';
  text: string;
  roleLabel: string;
  subject: 'matematica' | 'portugues';
  bncc: string;
  description: string;
}

export interface GrammarQuestion {
  id: string;
  sentence: string;
  options: string[];
  correctOption: string;
  bncc: string;
  explanation: string;
  category: 'Pontuação' | 'Coesão';
}

export interface MathChallenge {
  id: string;
  prompt: string;
  options: string[];
  correctOption: string;
  bncc: string;
  explanation: string;
  category: 'Frações' | 'Decimais' | 'Operações';
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  gameTarget: 'memory' | 'grammar' | 'math' | 'all';
  targetCount: number;
  currentCount: number;
  completed: boolean;
  xpReward: number;
  badgeIcon: string;
  bnccCode: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface LeaderboardEntry {
  id: string;
  studentName: string;
  avatar: string;
  totalXp: number;
  studentLevel: number;
  bestMemoryTimeLevel1?: number; // em segundos
  bestMemoryTimeLevel2?: number; // em segundos
  bestMemoryTimeLevel3?: number; // em segundos
  grammarHighScore?: number;
  mathHighScore?: number;
  updatedAt: string;
  isCurrentUser?: boolean;
}
