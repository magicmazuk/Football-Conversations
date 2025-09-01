import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NewsFeed } from './components/NewsFeed';
import { ConversationGenerator } from './components/ConversationGenerator';
import { WaterCoolerQuote } from './components/WaterCoolerQuote';
import { NewsTopic } from './types';
import { generateWaterCoolerQuote } from './services/geminiService';
import { cacheService } from './services/cacheService';


const App: React.FC = () => {
  const [quote, setQuote] = useState('');
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);
  const [quoteTone, setQuoteTone] = useState('A Neutral Colleague');

  const quoteTones = [
    { value: 'A Neutral Colleague', label: 'Neutral Colleague' },
    { value: 'My Boss', label: 'My Boss' },
    { value: 'A Funny Colleague', label: 'Funny Colleague' },
    { value: 'A Die-hard Celtic Fan', label: 'Celtic Fan' },
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

  const newsTopics: NewsTopic[] = [
    {
      id: 'celtic',
      title: "Celtic FC Focus",
      query: "latest news and developments about Celtic FC from the past week",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      id: 'scottish',
      title: "Scottish Football Roundup",
      query: "latest major news and results in Scottish football from the past week",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      id: 'world',
      title: "World Football Highlights",
      query: "most significant world football news, transfers, and results from the past week",
      gradient: "from-purple-500 to-violet-600"
    }
  ];

  return (
    <div className="min-h-screen bg-light-bg font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <WaterCoolerQuote 
          quote={quote} 
          isLoading={isQuoteLoading}
          tones={quoteTones}
          selectedTone={quoteTone}
          onToneChange={setQuoteTone} 
        />
        <ConversationGenerator />
        
        <div className="mt-12">
            <h2 className="text-3xl font-bold text-light-text mb-6">Your Weekly Briefing</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {newsTopics.map((topic) => (
                <NewsFeed key={topic.id} topic={topic} />
              ))}
            </div>
        </div>

        <footer className="text-center mt-12 text-light-text-secondary text-sm">
          <p>Powered by Gemini AI. Your weekly football briefing is ready.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;