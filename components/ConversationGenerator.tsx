import React, { useState, useEffect, useCallback } from 'react';
import { teams } from '../data/teams';
import { generateTeamInsights } from '../services/geminiService';
import { cacheService } from '../services/cacheService';
import { TeamInsights } from '../types';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { StarIcon } from './icons/StarIcon';

interface ConversationGeneratorProps {
    favoriteTeam: string;
    onSetFavoriteTeam: (team: string) => void;
}

export const ConversationGenerator: React.FC<ConversationGeneratorProps> = ({ favoriteTeam, onSetFavoriteTeam }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [teamInsights, setTeamInsights] = useState<TeamInsights | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchedTeam, setSearchedTeam] = useState('');


    useEffect(() => {
        if (inputValue.length > 1) {
            const filteredTeams = teams.filter(team =>
                team.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filteredTeams);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }, [inputValue]);

    const handleSelectTeam = (team: string) => {
        setInputValue(team);
        setShowSuggestions(false);
        setTeamInsights(null); // Clear previous results when a new team is selected
    };

    const handleGenerate = useCallback(async (forceRefresh = false) => {
        const teamToSearch = inputValue.trim();
        if (!teamToSearch) return;

        setIsLoading(true);
        setError(null);
        setShowSuggestions(false);
        setSearchedTeam(teamToSearch);
        
        const cacheKey = `insights-${teamToSearch.replace(/\s+/g, '-').toLowerCase()}`;

        if (forceRefresh) {
            cacheService.clear(cacheKey);
            setTeamInsights(null);
        } else {
            const cachedData = cacheService.get<TeamInsights>(cacheKey);
            if (cachedData) {
                setTeamInsights(cachedData);
                setIsLoading(false);
                return;
            }
        }

        try {
            const data = await generateTeamInsights(teamToSearch);
            setTeamInsights(data);
            cacheService.set(cacheKey, data);
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [inputValue]);

    const isCurrentTeamFavorite = favoriteTeam === searchedTeam && !!searchedTeam;

    return (
        <section className="p-6 bg-light-card rounded-xl border border-light-border shadow-sm">
            <h2 className="text-2xl font-bold text-light-text mb-1">Conversation Generator</h2>
            <p className="text-light-text-secondary mb-4">Pick a team to get AI-powered talking points.</p>

            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      if (teamInsights) setTeamInsights(null); // Clear results on new input
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate()}}
                    placeholder="Search for any team (e.g., Real Madrid)"
                    className="w-full px-4 py-2 border border-light-border rounded-md focus:ring-2 focus:ring-brand-green focus:outline-none"
                    aria-label="Search for a football team"
                />
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-light-card border border-light-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map(team => (
                            <li
                                key={team}
                                onClick={() => handleSelectTeam(team)}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                                {team}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                onClick={() => handleGenerate()}
                disabled={isLoading || !inputValue.trim()}
                className="w-full mt-4 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-light-card focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? <LoadingSpinner className="-ml-1 mr-3 h-5 w-5 text-white" /> : <SparklesIcon />}
                <span>{isLoading ? 'Generating...' : `Get Insights for ${inputValue.trim() || '...'}`}</span>
            </button>

            <div className="mt-6">
                {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg border border-red-200">{error}</div>}
                
                {teamInsights && !isLoading && (
                     <div className="bg-gray-50 p-5 rounded-xl border border-light-border relative animate-fade-in">
                        <div className="absolute top-2 right-2 z-10">
                            <button 
                                onClick={() => handleGenerate(true)} 
                                className="text-light-text-secondary hover:text-light-text p-1.5 rounded-full hover:bg-gray-200 transition-colors" 
                                aria-label="Refresh insights"
                                title="Refresh insights"
                            >
                                <RefreshIcon />
                            </button>
                        </div>

                         <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-light-text">{searchedTeam}</h3>
                            <button
                                onClick={() => onSetFavoriteTeam(searchedTeam)}
                                disabled={isCurrentTeamFavorite}
                                className={`flex items-center text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${
                                    isCurrentTeamFavorite 
                                    ? 'bg-yellow-400 text-yellow-900 cursor-default' 
                                    : 'bg-gray-200 text-light-text-secondary hover:bg-gray-300'
                                }`}
                                title={isCurrentTeamFavorite ? `${searchedTeam} is your favorite` : `Set ${searchedTeam} as your favorite`}
                            >
                                <StarIcon className="w-4 h-4" filled={isCurrentTeamFavorite} />
                                <span className="ml-1.5">{isCurrentTeamFavorite ? 'Favorite' : 'Set as Favorite'}</span>
                            </button>
                        </div>
                        
                        <blockquote className="mb-6 text-center border-l-4 border-brand-green pl-4 italic">
                             <p className="text-xl md:text-2xl font-semibold text-light-text leading-tight">
                                "{teamInsights.quote}"
                            </p>
                        </blockquote>

                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-light-text mb-3 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <TrophyIcon className="w-5 h-5 text-gray-500"/>
                                        <span className="ml-2">Latest Results</span>
                                    </div>
                                    {teamInsights.form && (
                                        <div className="flex items-center text-sm font-medium text-light-text-secondary">
                                            <TrendingUpIcon className="w-4 h-4 mr-1.5" />
                                            <span className="font-mono tracking-widest">{teamInsights.form}</span>
                                        </div>
                                    )}
                                </h3>
                                <ul className="space-y-2 list-none text-light-text-secondary">
                                    {teamInsights.results.map((result, index) => (
                                    <li key={index} className="text-sm">{result}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-light-text mb-3 flex items-center">
                                    <ChatBubbleIcon />
                                    <span className="ml-2">Talking Points</span>
                                </h3>
                                <ul className="space-y-2 list-disc list-inside text-light-text">
                                    {teamInsights.starters.map((starter, index) => (
                                    <li key={index}>{starter}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};