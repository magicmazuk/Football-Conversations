
import { apiKeyManager } from './apiKeyManager';
import * as geminiService from './geminiService';
import * as openaiService from './openaiService';
import { SummaryData, TeamInsights } from '../types';

const getActiveService = () => {
    const provider = apiKeyManager.getActiveProvider();
    return provider === 'openai' ? openaiService : geminiService;
}

export const generateFootballSummary = (query: string, wordCount: number, isFavoriteQuery: boolean = false): Promise<SummaryData> => {
    return getActiveService().generateFootballSummary(query, wordCount, isFavoriteQuery);
};

export const generateTeamInsights = (teamName: string): Promise<TeamInsights> => {
    return getActiveService().generateTeamInsights(teamName);
};

export const generateWaterCoolerQuote = (tone: string): Promise<string> => {
    return getActiveService().generateWaterCoolerQuote(tone);
};

export const healthCheck = (): Promise<{ success: boolean; message: string; }> => {
    return getActiveService().healthCheck();
};
