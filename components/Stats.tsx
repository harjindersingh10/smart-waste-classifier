import React from 'react';
import { TotalIcon, StreakIcon } from './Icons';

interface StatsProps {
  total: number;
  streak: number;
}

const StatsDisplay: React.FC<StatsProps> = ({ total, streak }) => {
  return (
    <div className="bg-gray-100 dark:bg-dark-card rounded-lg p-4 mb-6">
      <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-600">
        <div className="flex items-center justify-center gap-3 px-2">
          <TotalIcon />
          <div>
            <p className="text-2xl font-bold text-brand-dark dark:text-dark-text">{total}</p>
            <p className="text-xs text-brand-secondary dark:text-dark-text-secondary">Items Classified</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 px-2">
          <StreakIcon />
          <div>
            <p className="text-2xl font-bold text-brand-dark dark:text-dark-text">{streak}</p>
            <p className="text-xs text-brand-secondary dark:text-dark-text-secondary">Day Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;
