import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NewsFeed } from './components/NewsFeed';
import { ConversationGenerator } from './components/ConversationGenerator';
import { WaterCoolerQuote } from './components/WaterCoolerQuote';
import { NewsTopic } from './types';
import { generateWaterCoolerQuote } from './services/geminiService';
import { cacheService } from './services/cacheService';
import { TeamSelectionModal } from './components/TeamSelectionModal';
import { teams } from './data/teams';

const FAVORITE_TEAM_KEY = 'watercooler-fc-favorite-team';

const App: React.FC = () => {
  const [quote, setQuote] = useState('');
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);
  const [quoteTone, setQuoteTone] = useState('A Neutral Colleague');
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [favoriteTeam, setFavoriteTeam] = useState<string>(() => {
    return localStorage.getItem(FAVORITE_TEAM_KEY) || 'Celtic';
  });

  useEffect(() => {
    localStorage.setItem(FAVORITE_TEAM_KEY, favoriteTeam);
    
    // If the current quote tone is the fan-specific one, update it to reflect the new team.
    if (quoteTone.startsWith('A Die-hard')) {
        setQuoteTone(`A Die-hard ${favoriteTeam} Fan`);
    }
    // The key change on NewsFeed component will handle news refetching.
  }, [favoriteTeam]);

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
      setIsQuoteLoading(true);
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
      } catch (error) {
        console.error(error);
        setQuote("Couldn't fetch a witty quote, looks like the AI is on a tea break!");
      } finally {
        setIsQuoteLoading(false);
      }
    };
    fetchQuote();
  }, [quoteTone]);

  const handleSetFavoriteTeam = (team: string) => {
    setFavoriteTeam(team);
    setIsTeamModalOpen(false); // Close modal on selection
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
          <WaterCoolerQuote 
            quote={quote} 
            isLoading={isQuoteLoading}
            tones={quoteTones}
            selectedTone={quoteTone}
            onToneChange={setQuoteTone} 
          />
          <ConversationGenerator favoriteTeam={favoriteTeam} onSetFavoriteTeam={setFavoriteTeam} />
          
          <div className="mt-10">
              <h2 className="text-3xl font-bold text-text-primary mb-4">Your Weekly Briefing</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {newsTopics.map((topic) => (
                  <NewsFeed 
                    key={topic.id} 
                    topic={topic} 
                    onOpenTeamModal={() => setIsTeamModalOpen(true)}
                  />
                ))}
              </div>
          </div>

          <footer className="text-center mt-10 text-text-secondary text-sm">
            <p>Powered by Gemini AI. Your weekly football briefing is ready.</p>
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
    </>
  );
};

export default App;
