import { HistoryEntry } from '../types';

const HISTORY_KEY = 'waste-classifier-history';

export const getHistory = (): HistoryEntry[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    if (historyJson) {
      return JSON.parse(historyJson);
    }
  } catch (error) {
    console.error('Failed to parse history from localStorage', error);
  }
  return [];
};

export const saveHistory = (history: HistoryEntry[]): void => {
  try {
    // Limit history to 50 items to prevent localStorage from getting too large
    const limitedHistory = history.slice(0, 50);
    const historyJson = JSON.stringify(limitedHistory);
    localStorage.setItem(HISTORY_KEY, historyJson);
  } catch (error) {
    console.error('Failed to save history to localStorage', error);
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history from localStorage', error);
  }
};
