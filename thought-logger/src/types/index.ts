export interface Thought {
  id: string;
  content: string;
  timestamp: Date;
  mood?: 'positive' | 'neutral' | 'negative';
  tags?: string[];
  keywords?: string[];
}

export interface ThemeData {
  keyword: string;
  frequency: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  relatedThoughts: string[];
  trend: 'rising' | 'stable' | 'falling';
  category: 'emotion' | 'activity' | 'person' | 'place' | 'concept';
}

export interface ThoughtsByDate {
  [date: string]: Thought[];
}

export interface ThemeAnalysis {
  themes: ThemeData[];
  totalThoughts: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  topCategories: string[];
  sentimentOverview: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface TimeFilter {
  period: 'week' | 'month' | 'quarter' | 'year' | 'all';
  startDate?: Date;
  endDate?: Date;
}

export interface LocalStorageData {
  thoughts: Thought[];
  lastBackup: Date;
  version: string;
}

export interface ThoughtFormData {
  content: string;
  mood?: 'positive' | 'neutral' | 'negative';
  tags?: string[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  showMoodSelector: boolean;
  enableNotifications: boolean;
  exportFormat: 'json' | 'csv' | 'markdown';
}