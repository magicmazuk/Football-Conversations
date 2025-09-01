import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NewsFeed } from './components/NewsFeed';
import { ConversationGenerator } from './components/ConversationGenerator';
import { WaterCoolerQuote } from './components/WaterCoolerQuote';
import { NewsTopic } from './types';
import { generateWaterCoolerQuote, healthCheck } from './services/geminiService';
import { cacheService } from './services/cacheService';
import { TeamSelectionModal } from './components/TeamSelectionModal';
import { teams } from './data/teams';
import { ApiKeyBanner } from './components/ApiKeyBanner';
import { apiKeyManager } from './services/apiKeyManager';
import { ErrorDisplay } from './components/ErrorDisplay';
import { getFriendlyErrorMessage, isRateLimitError } from './services/errorService';

const FAVORITE_TEAM_KEY = 'watercooler-fc-favorite-team';

const App: React.FC = () => {
  const [quote, setQuote] = useState('');
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteTone, setQuoteTone] = useState('A Neutral Colleague');
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [favoriteTeam, setFavoriteTeam] = useState<string>(() => {
    return localStorage.getItem(FAVORITE_TEAM_KEY) || 'Celtic';
  });
  const [showApiKeyBanner, setShowApiKeyBanner] = useState(false);
  const [globalError, setGlobalError] = useState<Error | null>(null);
  const [healthCheckStatus, setHealthCheckStatus] = useState<'idle' | 'checking' | 'success' | 'failed'>('idle');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
        const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const isRateLimited = cooldown > 0;

  const handleApiError = (error: unknown) => {
    const err = error instanceof Error ? error : new Error(String(error) || "An unknown error occurred");
    setGlobalError(err);
    if (isRateLimitError(err) && cooldown === 0) {
        setCooldown(60); // Start 60-second cooldown
    }
  };

  // Global unhandled rejection handler as a fallback
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
        console.error('Unhandled Promise Rejection:', event.reason);
        handleApiError(event.reason);
    };

    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
        window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);


  // Proactive API Key check on initial load
  useEffect(() => {
    if (!apiKeyManager.getApiKey()) {
      setShowApiKeyBanner(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITE_TEAM_KEY, favoriteTeam);
    
    if (quoteTone.startsWith('A Die-hard')) {
        setQuoteTone(`A Die-hard ${favoriteTeam} Fan`);
    }
  }, [favoriteTeam, quoteTone]);

  const quoteTones = [
    { value: 'A Neutral Colleague', label: 'Neutral Colleague' },
    { value: 'My Boss', label: 'My Boss' },
    { value: 'A Funny Colleague', label: 'Funny Colleague' },
    { value: `A Die-hard ${favoriteTeam} Fan`, label: `${favoriteTeam} Fan` },
    { value: 'A Rival Fan', label: 'Rival Fan' },
    { value: 'Someone New to Football', label: 'Football Newbie' },
  ];

  useEffect(() => {
    const fetchQuote = async () => {
      if (isRateLimited) {
        setQuote(`API rate limit active. Please try again in ${cooldown} seconds.`);
        setIsQuoteLoading(false);
        setQuoteError(null);
        return;
      }

      if (!apiKeyManager.getApiKey()) {
        setQuote("Set your Gemini API key to get started!");
        setIsQuoteLoading(false);
        return;
      }

      setIsQuoteLoading(true);
      setQuoteError(null);
      const cacheKey = `water-cooler-quote-${quoteTone.replace(/\s+/g, '-').toLowerCase()}`;
      const cachedQuote = cacheService.get<string>(cacheKey);

      if (cachedQuote) {
        setQuote(cachedQuote);
        setIsQuoteLoading(false);
        return;
      }

      try {
        const newQuote = await generateWaterCoolerQuote(quoteTone);
        setQuote(newQuote);
        cacheService.set(cacheKey, newQuote);
      } catch (error: any) {
        console.error(error);
        setQuoteError(getFriendlyErrorMessage(error));
        setQuote('');
        handleApiError(error);
      } finally {
        setIsQuoteLoading(false);
      }
    };
    fetchQuote();
  }, [quoteTone, isRateLimited, cooldown]);

  const handleSetFavoriteTeam = (team: string) => {
    setFavoriteTeam(team);
    setIsTeamModalOpen(false);
  };

  const handleHealthCheck = async () => {
    setHealthCheckStatus('checking');
    setGlobalError(null);
    try {
        await healthCheck();
        setHealthCheckStatus('success');
        setTimeout(() => setHealthCheckStatus('idle'), 3000);
    } catch (error: any) {
        setHealthCheckStatus('failed');
        handleApiError(error);
    }
  };

  const newsTopics: NewsTopic[] = [
    {
      id: `favorite-${favoriteTeam.toLowerCase().replace(/\s+/g, '-')}`,
      title: `${favoriteTeam} Focus`,
      query: `latest news and developments about ${favoriteTeam} from the past week`,
      gradient: "from-gray-700 to-gray-900",
      isFavorite: true,
    },
    {
      id: 'scottish',
      title: "Scottish Football Roundup",
      query: "latest major news and results in Scottish football from the past week",
      gradient: "from-slate-500 to-slate-700"
    },
    {
      id: 'world',
      title: "World Football Highlights",
      query: "most significant world football news, transfers, and results from the past week",
      gradient: "from-indigo-500 to-indigo-700"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-page-bg font-sans">
        <Header />
        <main className="container mx-auto p-4 md:p-6">
          {showApiKeyBanner && <ApiKeyBanner onKeySaved={() => window.location.reload()} />}
          <WaterCoolerQuote 
            quote={quote} 
            isLoading={isQuoteLoading}
            error={quoteError}
            tones={quoteTones}
            selectedTone={quoteTone}
            onToneChange={setQuoteTone}
            isRateLimited={isRateLimited}
          />
          <ConversationGenerator 
            favoriteTeam={favoriteTeam} 
            onSetFavoriteTeam={setFavoriteTeam}
            onGlobalError={handleApiError}
            isRateLimited={isRateLimited}
            cooldown={cooldown}
          />
          
          <div className="mt-10">
              <h2 className="text-3xl font-bold text-text-primary mb-4">Your Weekly Briefing</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {newsTopics.map((topic) => (
                  <NewsFeed 
                    key={topic.id} 
                    topic={topic} 
                    onOpenTeamModal={() => setIsTeamModalOpen(true)}
                    onGlobalError={handleApiError}
                    isRateLimited={isRateLimited}
                    cooldown={cooldown}
                  />
                ))}
              </div>
          </div>

          <footer className="text-center mt-10 text-text-secondary text-sm">
            <p>Powered by Gemini AI. Your weekly football briefing is ready.</p>
            <div className="mt-2">
                <button onClick={handleHealthCheck} disabled={healthCheckStatus === 'checking'} className="text-xs text-slate-400 hover:text-slate-600 underline disabled:cursor-wait disabled:no-underline">
                    {healthCheckStatus === 'checking' && 'Checking API connection...'}
                    {healthCheckStatus === 'idle' && 'Check API Connection'}
                    {healthCheckStatus === 'failed' && 'Connection Check Failed. Click to retry.'}
                    {healthCheckStatus === 'success' && '✅ Connection Successful!'}
                </button>
            </div>
          </footer>
        </main>
      </div>
      <TeamSelectionModal
          isOpen={isTeamModalOpen}
          onClose={() => setIsTeamModalOpen(false)}
          allTeams={teams}
          currentFavorite={favoriteTeam}
          onSetFavorite={handleSetFavoriteTeam}
      />
       {globalError && (
            <ErrorDisplay 
                error={globalError} 
                onClose={() => setGlobalError(null)}
                onShowApiKeyForm={() => {
                  setShowApiKeyBanner(true);
                  setGlobalError(null);
                }}
            />
        )}
    </>
  );
};

export default App;