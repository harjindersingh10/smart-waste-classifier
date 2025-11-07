import { Stats } from '../types';

const STATS_KEY = 'waste-classifier-stats';

const isSameDay = (d1: number, d2: number): boolean => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const isYesterday = (d1: number, d2: number): boolean => {
    const yesterday = new Date(d1);
    yesterday.setDate(yesterday.getDate() - 1);
    const date2Obj = new Date(d2);
    return yesterday.getFullYear() === date2Obj.getFullYear() &&
           yesterday.getMonth() === date2Obj.getMonth() &&
           yesterday.getDate() === date2Obj.getDate();
};

const defaultStats: Stats = {
    total: 0,
    streak: 0,
    lastClassification: 0,
};

export const getStats = (): Stats => {
  try {
    const statsJson = localStorage.getItem(STATS_KEY);
    if (statsJson) {
      const parsedStats = JSON.parse(statsJson) as Stats;
      // Check if streak should be reset
      if (parsedStats.lastClassification > 0 && !isSameDay(Date.now(), parsedStats.lastClassification) && !isYesterday(Date.now(), parsedStats.lastClassification)) {
          parsedStats.streak = 0;
          saveStats(parsedStats);
      }
      return parsedStats;
    }
  } catch (error) {
    console.error('Failed to parse stats from localStorage', error);
  }
  return defaultStats;
};

const saveStats = (stats: Stats): void => {
    try {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (error) {
        console.error('Failed to save stats to localStorage', error);
    }
}

export const updateStatsOnClassification = (): Stats => {
    const currentStats = getStats();
    const now = Date.now();
    
    let newStreak = currentStats.streak;

    if (currentStats.lastClassification > 0) {
        if (!isSameDay(now, currentStats.lastClassification)) {
            if (isYesterday(now, currentStats.lastClassification)) {
                newStreak += 1; // It was yesterday, so increment streak
            } else {
                newStreak = 1; // It was before yesterday, reset to 1
            }
        }
        // If it's the same day, streak doesn't change
    } else {
        newStreak = 1; // First classification ever
    }

    const newStats: Stats = {
        total: currentStats.total + 1,
        streak: newStreak,
        lastClassification: now,
    };

    saveStats(newStats);
    return newStats;
};
