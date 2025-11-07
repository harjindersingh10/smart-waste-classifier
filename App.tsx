import React, { useState, useCallback, useEffect } from 'react';
import { classifyWasteImage } from './services/geminiService';
import { ClassificationResult, HistoryEntry, Stats } from './types';
import { fileToBase64 } from './utils/file';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { HeaderIcon, ImageIcon, InfoIconSolid, HistoryIcon, SunIcon, MoonIcon } from './components/Icons';
import InfoSection from './components/InfoSection';
import { getHistory, saveHistory, clearHistory } from './utils/history';
import HistoryPanel from './components/HistoryPanel';
import { getStats, updateStatsOnClassification } from './utils/stats';
import StatsDisplay from './components/Stats';
import FunFact from './components/FunFact';

const RightPanelInitialState: React.FC = () => (
  <div className="text-center flex flex-col items-center justify-center h-full p-4">
    <ImageIcon />
    <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-dark-text">Your results will appear here</h3>
    <p className="mt-2 text-gray-500 dark:text-dark-text-secondary max-w-sm mx-auto">
      Upload an image of a waste item, and the AI will analyze its category and provide a smart disposal tip.
    </p>
  </div>
);

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
  const [stats, setStats] = useState<Stats>(getStats());
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  
  useEffect(() => {
    setHistory(getHistory());
    setStats(getStats());
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleImageChange = (file: File) => {
    setImageFile(file);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const parseResponse = (text: string): ClassificationResult | null => {
    if (text.toLowerCase().includes('unable to classify')) {
        throw new Error('Unable to classify. Please upload a clearer waste image.');
    }
    const lines = text.trim().split('\n');
    const resultData: Partial<ClassificationResult> = {};
    const regex = /^(.*?):\s*(.*)$/;

    lines.forEach(line => {
        const match = line.match(regex);
        if (match) {
            const [, key, value] = match;
            const trimmedKey = key.trim().toLowerCase();
            if (trimmedKey === 'category') {
                resultData.category = value.trim();
            } else if (trimmedKey === 'confidence') {
                resultData.confidence = value.trim();
            } else if (trimmedKey === 'disposal tip') {
                resultData.disposalTip = value.trim();
            }
        }
    });

    if (resultData.category && resultData.confidence && resultData.disposalTip) {
        return resultData as ClassificationResult;
    }
    return null;
  };

  const handleClassify = useCallback(async () => {
    if (!imageFile) {
      setError('Please select an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const responseText = await classifyWasteImage(base64, mimeType);
      
      const parsedResult = parseResponse(responseText);
      if (parsedResult) {
        setResult(parsedResult);
        // Update History
        const newHistoryEntry: HistoryEntry = {
          id: `entry-${Date.now()}`,
          timestamp: Date.now(),
          imagePreview: imagePreview!,
          ...parsedResult,
        };
        const updatedHistory = [newHistoryEntry, ...history];
        setHistory(updatedHistory);
        saveHistory(updatedHistory);

        // Update Stats
        const newStats = updateStatsOnClassification();
        setStats(newStats);

      } else {
        throw new Error('Failed to parse the classification result. The model may have returned an unexpected format.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, imagePreview, history]);

  const handleSelectHistoryItem = (item: HistoryEntry) => {
    setResult({
      category: item.category,
      confidence: item.confidence,
      disposalTip: item.disposalTip,
    });
    setImagePreview(item.imagePreview);
    setImageFile(null);
    setError(null);
    setIsLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire classification history? This action cannot be undone.')) {
      clearHistory();
      setHistory([]);
    }
  };
  
  const renderRightPanel = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return (
        <div className="text-center text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-lg w-full">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      );
    }
    if (result) {
      return <ResultDisplay result={result} />;
    }
    return <RightPanelInitialState />;
  };

  return (
    <div className="min-h-screen font-sans text-brand-dark dark:text-dark-text">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <header className="text-center mb-10 lg:mb-12 relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <HeaderIcon />
            <h1 className="text-4xl font-extrabold text-brand-dark dark:text-white tracking-tight">Smart Waste Classifier</h1>
          </div>
          <p className="text-lg text-brand-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Every year, millions of tons of recyclable waste end up in landfills due to poor segregation. This AI-powered tool helps you identify waste and learn the right disposal method.
          </p>
          <button onClick={toggleTheme} className="absolute top-0 right-0 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-green">
            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
          </button>
        </header>
        
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Panel: Uploader */}
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 sticky top-8">
            <StatsDisplay total={stats.total} streak={stats.streak} />
            <ImageUploader onImageSelect={handleImageChange} isUploading={isLoading} />

            {imagePreview && (
              <div className="text-center bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                <img src={imagePreview} alt="Waste preview" className="max-h-64 w-auto inline-block rounded-md shadow-sm" />
              </div>
            )}

            <div className="flex justify-center">
                <button
                    onClick={handleClassify}
                    disabled={!imageFile || isLoading}
                    className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-white bg-brand-green rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                >
                    {isLoading ? 'Classifying...' : 'Classify Waste'}
                </button>
            </div>
          </div>
          
          {/* Right Panel: Results */}
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-6 sm:p-8 min-h-[550px] flex flex-col justify-center items-center transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02]">
            {renderRightPanel()}
          </div>
        </main>

        <div className="mt-12 lg:mt-16 max-w-4xl mx-auto">
          <FunFact />
        </div>

        <div className="mt-12 lg:mt-16">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === 'info'
                        ? 'border-brand-green text-brand-green'
                        : 'border-transparent text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                >
                    <InfoIconSolid />
                    Information
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === 'history'
                        ? 'border-brand-green text-brand-green'
                        : 'border-transparent text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                >
                    <HistoryIcon />
                    History
                </button>
                </nav>
            </div>

            <div>
                {activeTab === 'info' && <InfoSection />}
                {activeTab === 'history' && (
                <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 sm:p-8">
                    <HistoryPanel
                    history={history}
                    onSelect={handleSelectHistoryItem}
                    onClear={handleClearHistory}
                    />
                </div>
                )}
            </div>
        </div>

        <footer className="text-center mt-12 lg:mt-16 text-gray-500 dark:text-dark-text-secondary text-sm">
          <p className="text-base text-gray-600 dark:text-dark-text-secondary mb-2">
              Small actions make a big difference 🌍<br/>
              Classify your waste correctly, recycle wisely, and inspire others to do the same.<br/>
              Together, we can make our planet cleaner — one photo at a time. ♻️
          </p>
          <p>&copy; {new Date().getFullYear()} Smart Waste Classifier. Powered by AI.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
