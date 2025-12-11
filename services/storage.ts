import { PlayerStats, INITIAL_STATS } from '../types';

const STORAGE_KEY = 'KANEDA_V11_DATA';

export const loadStats = (): PlayerStats => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return INITIAL_STATS;
    
    const parsed = JSON.parse(stored);
    // Merge with INITIAL to ensure new fields exist if we update schema
    return { ...INITIAL_STATS, ...parsed };
  } catch (e) {
    return INITIAL_STATS;
  }
};

export const saveStats = (stats: PlayerStats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
};