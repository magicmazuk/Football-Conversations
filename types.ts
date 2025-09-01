
export interface NewsTopic {
  id: string;
  title: string;
  query: string;
  gradient: string;
}

export interface Citation {
  uri: string;
  title: string;
}

export interface SummaryData {
  headline: string;
  summary: string;
  conversationStarters: string[];
  citations: Citation[];
  results?: string[];
  form?: string;
}

export interface TeamInsights {
  results: string[];
  starters: string[];
  quote: string;
  form: string;
}