
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NewsFeed } from './components/NewsFeed';
import { ConversationGenerator } from './components/ConversationGenerator';
import { WaterCoolerQuote } from './components/WaterCoolerQuote';
import { NewsTopic } from './types';
import { generateWaterCoolerQuote, healthCheck } from './services/aiService';
import { cacheService } from './services/cacheService';
import { TeamSelectionModal } from './components/TeamSelectionModal';
import { SettingsModal } from './components/SettingsModal';
import { teams } from './data/teams';
import { apiKeyManager } from './services/apiKeyManager';
import { ErrorDisplay } from './components/ErrorDisplay';
import { getFriendlyErrorMessage, isRateLimitError, isDailyLimitError } from './services/errorService';
import { DailyLimitBanner } from './components/DailyLimitBanner';

const FAVORITE_TEAM_KEY = 'watercooler-fc-favorite-team';

const App: React.FC = () => {
  const [quote, setQuote] = useState('');
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteTone, setQuoteTone] = useState('A Neutral Colleague');
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [favoriteTeam, setFavoriteTeam] = useState<string>(() => {
    return localStorage.getItem(FAVORITE_TEAM_KEY) || 'Celtic';
  });
  const [globalError, setGlobalError] = useState<Error | null>(null);
  const [healthCheckStatus, setHealthCheckStatus] = useState<'idle' | 'checking' | 'success' | 'failed'>('idle');
  const [healthCheckResult, setHealthCheckResult] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [isDailyLimited, setIsDailyLimited] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const provider = apiKeyManager.getActiveProvider();
    if (cooldown > 0) {
        const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        return () => clearTimeout(timer);
    } else {
        if (globalError && isRateLimitError(globalError, provider)) {
          setGlobalError(null);
        }
    }
  }, [cooldown, globalError]);

  const isRateLimited = cooldown > 0;

  const handleApiError = (error: unknown) => {
    const err = error instanceof Error ? error : new Error(String(error) || "An unknown error occurred");
    const provider = apiKeyManager.getActiveProvider();

    if (isDailyLimitError(err, provider)) {
        setIsDailyLimited(true);
        setGlobalError(null); 
        setQuoteError(null); 
    } else {
        setGlobalError(err);
        if (isRateLimitError(err, provider) && cooldown === 0) {
            setCooldown(60);
        }
    }
  };

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

  useEffect(() => {
    if (!apiKeyManager.getActiveApiKey()) {
      setIsSettingsModalOpen(true);
    }
    setAppReady(true);
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
      if (!appReady || isRateLimited || isDailyLimited) {
        return;
      }

      if (!apiKeyManager.getActiveApiKey()) {
        setQuote("Please configure an AI provider in Settings to get started!");
        setIsQuoteLoading(false);
        return;
      }

      setIsQuoteLoading(true);
      setQuoteError(null);
      const provider = apiKeyManager.getActiveProvider();
      const cacheKey = `water-cooler-quote-${provider}-${quoteTone.replace(/\s+/g, '-').toLowerCase()}`;
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
        handleApiError(error);
      } finally {
        setIsQuoteLoading(false);
      }
    };
    fetchQuote();
  }, [quoteTone, isRateLimited, isDailyLimited, appReady]);

  const handleSetFavoriteTeam = (team: string) => {
    setFavoriteTeam(team);
    setIsTeamModalOpen(false);
  };

  const handleHealthCheck = async () => {
    setHealthCheckStatus('checking');
    setGlobalError(null);
    setHealthCheckResult(null);

    const result = await healthCheck();
    setHealthCheckResult(result.message);

    if (result.success) {
        setHealthCheckStatus('success');
        setTimeout(() => {
            setHealthCheckStatus('idle');
            setHealthCheckResult(null);
        }, 5000);
    } else {
        setHealthCheckStatus('failed');
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
        <Header onOpenSettings={() => setIsSettingsModalOpen(true)} />
        <main className="container mx-auto p-4 md:p-6">
          {isDailyLimited && <DailyLimitBanner />}
          <WaterCoolerQuote 
            quote={quote} 
            isLoading={isQuoteLoading}
            error={quoteError}
            tones={quoteTones}
            selectedTone={quoteTone}
            onToneChange={setQuoteTone}
            isRateLimited={isRateLimited}
            isDailyLimited={isDailyLimited}
            cooldown={cooldown}
          />
          <ConversationGenerator 
            favoriteTeam={favoriteTeam} 
            onSetFavoriteTeam={setFavoriteTeam}
            onGlobalError={handleApiError}
            isRateLimited={isRateLimited}
            isDailyLimited={isDailyLimited}
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
                    isDailyLimited={isDailyLimited}
                    cooldown={cooldown}
                  />
                ))}
              </div>
          </div>

          <footer className="text-center mt-10 text-text-secondary text-sm">
            <p>Powered by AI. Your weekly football briefing is ready.</p>
            <div className="mt-2">
                <button onClick={handleHealthCheck} disabled={healthCheckStatus === 'checking'} className="text-xs text-slate-400 hover:text-slate-600 underline disabled:cursor-wait disabled:no-underline">
                    {healthCheckStatus === 'checking' && 'Checking API connection...'}
                    {healthCheckStatus === 'idle' && 'Check API Connection'}
                    {healthCheckStatus === 'failed' && 'Connection Check Failed. Click to retry.'}
                    {healthCheckStatus === 'success' && '✅ Connection Successful!'}
                </button>
                 {healthCheckResult && (
                    <div className={`mt-2 text-xs text-left max-w-xl mx-auto p-3 rounded-md border ${
                        healthCheckStatus === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                        <p className="whitespace-pre-wrap">{healthCheckResult}</p>
                        {healthCheckStatus === 'failed' && apiKeyManager.getActiveProvider() === 'gemini' && (
                             <a 
                                href="https://console.cloud.google.com/billing" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-semibold underline hover:text-red-600 mt-1 inline-block"
                            >
                                Check Google Cloud Billing &rarr;
                            </a>
                        )}
                    </div>
                )}
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
      <SettingsModal 
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onSave={() => {
            setIsSettingsModalOpen(false);
            window.location.reload();
          }}
      />
       {globalError && (
            <ErrorDisplay 
                error={globalError} 
                onClose={() => setGlobalError(null)}
                onOpenSettings={() => {
                  setIsSettingsModalOpen(true);
                  setGlobalError(null);
                }}
            />
        )}
    </>
  );
};

export default App;
