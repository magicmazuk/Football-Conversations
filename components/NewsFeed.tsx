import React, { useState, useCallback, useEffect } from 'react';
import { NewsTopic, SummaryData } from '../types';
import { generateFootballSummary } from '../services/geminiService';
import { cacheService } from '../services/cacheService';
import { SummaryCard } from './SummaryCard';
import { ConversationStarters } from './ConversationStarters';
import { Controls } from './Controls';
import { SparklesIcon } from './icons/SparklesIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { RefreshIcon } from './icons/RefreshIcon';
import { LatestResults } from './LatestResults';

interface NewsFeedProps {
  topic: NewsTopic;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ topic }) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number>(150);

  useEffect(() => {
    // On initial load, check if there's a cached summary for the default word count.
    const cacheKey = `summary-${topic.id}-150`;
    const cachedData = cacheService.get<SummaryData>(cacheKey);
    if (cachedData) {
      setSummaryData(cachedData);
    }
  }, [topic.id]);

  const handleGenerate = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    const cacheKey = `summary-${topic.id}-${wordCount}`;

    if (!forceRefresh) {
      const cachedData = cacheService.get<SummaryData>(cacheKey);
      if (cachedData) {
        setSummaryData(cachedData);
        setIsLoading(false);
        return;
      }
    } else {
        cacheService.clear(cacheKey);
        setSummaryData(null);
    }
    
    try {
      const data = await generateFootballSummary(topic.query, wordCount);
      setSummaryData(data);
      cacheService.set(cacheKey, data);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic.id, topic.query, wordCount]);

  return (
    <div className="bg-light-card rounded-xl shadow-sm overflow-hidden flex flex-col border border-light-border h-full">
      <div className={`p-6 bg-gradient-to-br ${topic.gradient}`}>
        <h2 className="text-2xl font-bold text-white">{topic.title}</h2>
      </div>

      <div className="p-6 flex-grow flex flex-col relative">
        {summaryData && !isLoading && (
            <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => handleGenerate(true)} 
                  className="text-light-text-secondary hover:text-light-text p-1.5 rounded-full hover:bg-gray-200 transition-colors" 
                  aria-label="Refresh summary"
                  title="Refresh summary"
                >
                    <RefreshIcon />
                </button>
            </div>
        )}

        <Controls wordCount={wordCount} setWordCount={setWordCount} />

        <button
          onClick={() => handleGenerate()}
          disabled={isLoading}
          className="w-full mt-4 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-light-card focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <SparklesIcon />
              <span>Get The Latest Scoop</span>
            </>
          )}
        </button>

        <div className="mt-6 flex-grow flex flex-col">
          <div className="flex-grow">
            {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg border border-red-200">{error}</div>}
            
            {summaryData && (
              <div className="space-y-6 animate-fade-in">
                 {topic.id === 'celtic' && summaryData.results && summaryData.form && (
                    <LatestResults results={summaryData.results} form={summaryData.form} />
                )}
                <SummaryCard data={summaryData} />
                <ConversationStarters starters={summaryData.conversationStarters} />
              </div>
            )}
            
            {!isLoading && !summaryData && !error && (
               <div className="text-center text-light-text-secondary h-full flex items-center justify-center flex-col p-4">
                  <SparklesIcon className="w-10 h-10 mb-2"/>
                  <p>Ready to catch up? <br/> Hit the button to get your summary.</p>
               </div>
            )}
          </div>
           <div className="text-xs text-light-text-secondary text-center mt-auto pt-6">
              <div className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 rounded-full border border-light-border">
                  <SparklesIcon className="w-4 h-4 mr-1.5 text-brand-green" />
                  <span>AI-Generated Briefing</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};