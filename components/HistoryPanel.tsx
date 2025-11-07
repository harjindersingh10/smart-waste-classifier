import React from 'react';
import { HistoryEntry } from '../types';
import { TrashIcon } from './Icons';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelect: (item: HistoryEntry) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-dark-text-secondary">
        <p>Your past classifications will appear here.</p>
        <p className="text-sm">Upload an image to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-brand-dark dark:text-dark-text">Classification History</h3>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors"
        >
          <TrashIcon />
          Clear History
        </button>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto pr-2">
        {history.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onSelect(item)}
              className="w-full flex items-center gap-4 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <img src={item.imagePreview} alt="Waste item" className="w-16 h-16 object-cover rounded-md flex-shrink-0 bg-gray-200" />
              <div className="flex-1">
                <p className="font-semibold text-brand-dark dark:text-dark-text">{item.category}</p>
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Confidence: {item.confidence}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryPanel;
