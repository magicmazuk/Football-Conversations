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
import { PencilIcon } from './icons/PencilIcon';
import { LeagueTable } from './LeagueTable';

interface NewsFeedProps {
  topic: NewsTopic;
  onOpenTeamModal?: () => void;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ topic, onOpenTeamModal }) => {
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
    } else {
      // If no cache, clear any potential stale data from a previous topic (e.g., favorite team changed)
      setSummaryData(null);
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
      const data = await generateFootballSummary(topic.query, wordCount, topic.isFavorite);
      setSummaryData(data);
      cacheService.set(cacheKey, data);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic.id, topic.query, wordCount, topic.isFavorite]);
  
  const favoriteTeamName = topic.isFavorite ? topic.title.replace(' Focus', '') : '';

  const handleWordCountChange = (count: number) => {
    if (count !== wordCount) {
        setSummaryData(null); // Clear existing summary to show the generate button again
        setError(null);
    }
    setWordCount(count);
  };

  return (
    <div className="bg-card-bg rounded-xl shadow-sm overflow-hidden flex flex-col border border-border-color h-full">
      <div className={`p-5 bg-gradient-to-br ${topic.gradient} flex justify-between items-center`}>
        <h2 className="text-2xl font-bold text-white">{topic.title}</h2>
        {topic.isFavorite && onOpenTeamModal && (
            <button 
                onClick={onOpenTeamModal}
                className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Change favorite team"
                title="Change favorite team"
            >
                <PencilIcon className="w-5 h-5"/>
            </button>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col relative">
        {summaryData && !isLoading && (
            <div className="absolute top-3 right-3 z-10">
                <button 
                  onClick={() => handleGenerate(true)} 
                  className="text-text-secondary hover:text-text-primary p-1.5 rounded-full hover:bg-gray-200 transition-colors" 
                  aria-label="Refresh summary"
                  title="Refresh summary"
                >
                    <RefreshIcon />
                </button>
            </div>
        )}

        <Controls wordCount={wordCount} setWordCount={handleWordCountChange} />
        
        {!summaryData && (
          <button
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="w-full mt-4 flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-brand-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="-ml-1 mr-3 h-5 w-5 text-white" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <SparklesIcon />
                <span>Get The Latest Scoop</span>
              </>
            )}
          </button>
        )}

        <div className="mt-4 flex-grow flex flex-col">
          <div className="flex-grow">
            {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg border border-red-200">{error}</div>}
            
            {summaryData && (
              <div className="space-y-6 animate-fade-in">
                 {topic.isFavorite && summaryData.results && summaryData.form && (
                    <LatestResults results={summaryData.results} form={summaryData.form} />
                )}
                {topic.isFavorite && summaryData.leagueTable && (
                    <LeagueTable tableData={summaryData.leagueTable} favoriteTeam={favoriteTeamName} />
                )}
                <SummaryCard data={summaryData} />
                <ConversationStarters starters={summaryData.conversationStarters} />
              </div>
            )}
            
            {!isLoading && !summaryData && !error && (
               <div className="text-center text-text-secondary h-full flex items-center justify-center flex-col p-4">
                  <SparklesIcon className="w-10 h-10 mb-2"/>
                  <p>Ready to catch up? <br/> Hit the button to get your summary.</p>
               </div>
            )}
          </div>
           <div className="text-xs text-text-secondary text-center mt-auto pt-4">
              <div className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 rounded-full border border-border-color">
                  <SparklesIcon className="w-4 h-4 mr-1.5 text-brand-primary" />
                  <span>AI-Generated Briefing</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};