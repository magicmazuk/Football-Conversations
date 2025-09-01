import { GoogleGenAI } from "@google/genai";
import { SummaryData, Citation, TeamInsights } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const parseResponseText = (text: string): Omit<SummaryData, 'citations'> => {
  const headline = text.match(/\[HEADLINE\]([\s\S]*?)\[\/HEADLINE\]/)?.[1]?.trim() || '';
  const summary = text.match(/\[SUMMARY\]([\s\S]*?)\[\/SUMMARY\]/)?.[1]?.trim() || '';
  const startersBlock = text.match(/\[STARTERS\]([\s\S]*?)\[\/STARTERS\]/)?.[1]?.trim() || '';
  
  const conversationStarters = startersBlock
    .split('- ')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const resultsBlock = text.match(/\[RESULTS\]([\s\S]*?)\[\/RESULTS\]/)?.[1]?.trim() || '';
  const results = resultsBlock.split('\n').map(s => s.trim().replace(/^- /, '')).filter(s => s.length > 0);
  const form = text.match(/\[FORM\]([\s\S]*?)\[\/FORM\]/)?.[1]?.trim() || '';

  const data: Omit<SummaryData, 'citations'> = { headline, summary, conversationStarters };

  if (results.length > 0) {
    data.results = results;
  }
  if (form) {
    data.form = form;
  }
  
  return data;
};

export const generateFootballSummary = async (query: string, wordCount: number, isFavoriteQuery: boolean = false): Promise<SummaryData> => {
  try {

    const favoriteTeamAddon = `
      You are also providing information for a dedicated fan of the team in this query. Please also include the following sections if available from recent news:

      [RESULTS]
      - The results of their last 2-3 matches, including the competition.
      - Example: Celtic 3 - 0 St. Mirren (Scottish Premiership)
      [/RESULTS]

      [FORM]
      - A short summary of their recent form as a string of letters (W for Win, D for Draw, L for Loss) for the last 5 matches, most recent first (e.g., WWDLD).
      [/FORM]
    `;

    const prompt = `
      You are a football news expert and a friendly colleague, acting as an AI assistant for the "Watercooler FC" app.
      Your task is to provide a summary of the most important football news from the past week about ${query}.
      The summary should be approximately ${wordCount} words.

      Your entire response must be structured using the following special markers, and nothing else:

      [HEADLINE]
      A catchy, conversational headline about the most exciting news.
      [/HEADLINE]

      [SUMMARY]
      The news summary text goes here.
      [/SUMMARY]

      [STARTERS]
      - A conversation starter based on the news.
      - Another conversation starter.
      - A third conversation starter.
      [/STARTERS]
      
      ${isFavoriteQuery ? favoriteTeamAddon : ''}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const parsedTextData = parseResponseText(response.text);
    
    const rawCitations = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const citations: Citation[] = (rawCitations || [])
      .map((chunk: any) => ({
        uri: chunk?.web?.uri || '',
        title: chunk?.web?.title || 'Source',
      }))
      .filter(citation => citation.uri);
      
    const uniqueCitations = Array.from(new Map(citations.map(item => [item['uri'], item])).values());

    return {
      ...parsedTextData,
      citations: uniqueCitations,
    };
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    throw new Error("Failed to generate summary. Please check your API key and connection.");
  }
};

export const generateTeamInsights = async (teamName: string): Promise<TeamInsights> => {
  try {
    const prompt = `
      You are a football expert from "Watercooler FC".
      For the team "${teamName}", provide the following information based on the latest available data:
      1. The results of their last 2-3 matches, including the competition.
      2. 3-4 interesting and up-to-date conversation starters.
      3. One single, catchy "water cooler conversation starter" about the team, phrased as a quote.
      4. A short summary of their recent form as a string of letters (W for Win, D for Draw, L for Loss) for the last 5 matches, most recent first (e.g., WWDLD).

      Your entire response must be structured using the following special markers, and nothing else:

      [RESULTS]
      - [Home Team] X - Y [Away Team] ([Competition])
      - [Home Team] A - B [Away Team] ([Competition])
      [/RESULTS]

      [STARTERS]
      - A conversation starter.
      - Another conversation starter.
      - A third conversation starter.
      [/STARTERS]

      [QUOTE]
      The single, catchy water cooler quote goes here.
      [/QUOTE]

      [FORM]
      The form string (e.g., WWDLD) goes here.
      [/FORM]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    
    const resultsBlock = text.match(/\[RESULTS\]([\s\S]*?)\[\/RESULTS\]/)?.[1]?.trim() || '';
    const results = resultsBlock.split('\n').map(s => s.trim().replace(/^- /, '')).filter(s => s.length > 0);

    const startersBlock = text.match(/\[STARTERS\]([\s\S]*?)\[\/STARTERS\]/)?.[1]?.trim() || '';
    const starters = startersBlock.split('\n').map(s => s.trim().replace(/^- /, '')).filter(s => s.length > 0);

    const quote = text.match(/\[QUOTE\]([\s\S]*?)\[\/QUOTE\]/)?.[1]?.trim() || `Couldn't generate a quote for ${teamName}, but are they signing anyone new?`;

    const form = text.match(/\[FORM\]([\s\S]*?)\[\/FORM\]/)?.[1]?.trim() || 'N/A';

    return { results, starters, quote, form };

  } catch (error) {
    console.error(`Error generating insights for ${teamName}:`, error);
    throw new Error(`Failed to generate insights for ${teamName}.`);
  }
};

export const generateWaterCoolerQuote = async (tone: string): Promise<string> => {
  try {
    const prompt = `
      You are a witty football pundit with a knack for tailoring your comments to your audience.
      Your task is to provide one short, insightful, or funny "water cooler" quote about the current state of world football.
      
      The quote should be tailored for speaking to the following person: "${tone}".
      
      For example, if talking to "My Boss", the quote should be more insightful and professional.
      If talking to "A Funny Colleague", it can be more humorous or sarcastic.
      If the tone includes a specific team name (e.g., "A Die-hard Liverpool Fan"), the quote should be something a fan of that team would appreciate or find interesting.

      It must be a single sentence.
      
      IMPORTANT: Return only the quote itself. Do not include any extra text, labels, or quotation marks.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    // Trim whitespace and remove any surrounding quotes the model might add.
    return response.text.trim().replace(/^"|"$/g, '');
  } catch (error) {
    console.error("Error generating water cooler quote:", error);
    throw new Error("Failed to generate a quote.");
  }
};
