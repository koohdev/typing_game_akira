export enum GameMode {
  BOOT = 'BOOT',
  DASH = 'DASH',
  GAME = 'GAME',
  ZEN = 'ZEN',
  SHOP = 'SHOP',
  PROFILE = 'PROFILE',
  RESULTS = 'RESULTS',
  SETTINGS = 'SETTINGS',
  BOUNTY_BOARD = 'BOUNTY_BOARD',
  MISSIONS = 'MISSIONS'
}

export interface Inventory {
  time_freeze: number;
  auto_word: number;
  proxy_shield: number;
}

export interface Settings {
  vol: number;
  lowFx: boolean;
  theme: string;
  fontSize: 'small' | 'medium' | 'large';
  caretStyle: 'block' | 'underscore' | 'beam';
  virtualKeyboard: boolean;
}

export interface PlayerStats {
  yen: number;
  highScore: number;
  gamesPlayed: number;
  totalWordsTyped: number;
  history: { date: string; wpm: number; accuracy: number; yen: number; result: 'WIN' | 'FAIL' | 'ZEN' }[];
  inventory: Inventory;
  ownedThemes: string[];
  hardware: string[]; // IDs of owned hardware
  settings: Settings;
  prestigeLevel: number;
  decryptionKeys: number;
  unlockedAchievements: string[]; // IDs of unlocked achievements
}

export interface GameResult {
  wpm: number;
  accuracy: number;
  yen: number;
  passed: boolean;
  decryptionKeyFound?: boolean;
  bossDefeated?: boolean;
  isZen?: boolean;
}

export interface Boss {
  id: string;
  name: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'NIGHTMARE';
  hp: number;
  attackSpeed: number; // Chars per second
  attackDamage: number; // Seconds drained per attack
  reward: number;
  art?: string;
}

export interface Achievement {
    id: string;
    name: string;
    desc: string;
    icon: string; // Emoji or generic symbol
    condition: (stats: PlayerStats) => boolean;
}

export const INITIAL_STATS: PlayerStats = {
  yen: 0,
  highScore: 0,
  gamesPlayed: 0,
  totalWordsTyped: 0,
  history: [],
  inventory: { time_freeze: 0, auto_word: 0, proxy_shield: 0 },
  ownedThemes: ['default'],
  hardware: [],
  settings: { vol: 50, lowFx: false, theme: 'default', fontSize: 'medium', caretStyle: 'block', virtualKeyboard: false },
  prestigeLevel: 0,
  decryptionKeys: 0,
  unlockedAchievements: []
};