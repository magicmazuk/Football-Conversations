
export interface NewsTopic {
  id: string;
  title: string;
  query: string;
  gradient: string;
  isFavorite?: boolean;
}

export interface Citation {
  uri: string;
  title: string;
}

export interface LeagueTableRow {
  position: string;
  teamName: string;
  played: string;
  goalDifference: string;
  points: string;
}

export interface SummaryData {
  headline: string;
  summary: string;
  conversationStarters: string[];
  citations: Citation[];
  results?: string[];
  form?: string;
  leagueTable?: LeagueTableRow[];
}

export interface TeamInsights {
  results: string[];
  starters: string[];
  quote: string;
  form: string;
}