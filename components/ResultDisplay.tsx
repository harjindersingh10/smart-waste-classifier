import React, { useState } from 'react';
import { ClassificationResult } from '../types';
import { PlasticIcon, PaperIcon, MetalIcon, OrganicIcon, TipIcon, ShareIcon } from './Icons';

interface ResultDisplayProps {
  result: ClassificationResult;
}

const getCategoryIcon = (category: string) => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('plastic')) return <PlasticIcon />;
  if (lowerCategory.includes('paper')) return <PaperIcon />;
  if (lowerCategory.includes('metal')) return <MetalIcon />;
  if (lowerCategory.includes('organic')) return <OrganicIcon />;
  return <div className="w-12 h-12 bg-gray-300 rounded-full"></div>;
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        const textToCopy = `I just classified an item as ${result.category}! Disposal Tip: ${result.disposalTip} #SmartWasteClassifier`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
  return (
    <div className="w-full p-4 animate-fade-in dark:text-dark-text">
        <div className="flex items-start sm:items-center flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0 animate-pop-in">
                {getCategoryIcon(result.category)}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Classification Result</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark dark:text-white">{result.category}</h2>
                <p className="text-base text-gray-500 dark:text-dark-text-secondary">Confidence: <span className="font-semibold text-gray-700 dark:text-dark-text">{result.confidence}</span></p>
            </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <TipIcon />
            </div>
            <div>
              <h3 className="text-md font-semibold text-green-800 dark:text-green-300">Disposal Tip</h3>
              <p className="text-brand-secondary dark:text-dark-text-secondary">{result.disposalTip}</p>
            </div>
        </div>
        <div className="mt-6 text-center">
            <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-secondary dark:text-dark-text-secondary bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                <ShareIcon />
                {copied ? 'Copied!' : 'Share Result'}
            </button>
        </div>
    </div>
  );
};

export default ResultDisplay;
