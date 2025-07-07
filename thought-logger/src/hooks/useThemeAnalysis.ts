import { useMemo } from 'react';
import { startOfWeek, startOfMonth, startOfQuarter, startOfYear, subDays, subMonths, subYears } from 'date-fns';
import { Thought, ThemeData, ThemeAnalysis, TimeFilter } from '../types';
import { ThemeExtractor } from '../utils/themeExtractor';

export function useThemeAnalysis(thoughts: Thought[]) {
  const themeExtractor = useMemo(() => new ThemeExtractor(), []);

  const getFilteredThoughts = (filter: TimeFilter): Thought[] => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (filter.period) {
      case 'week':
        startDate = startOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        break;
      case 'quarter':
        startDate = startOfQuarter(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        break;
      default:
        return thoughts;
    }

    if (filter.startDate) startDate = filter.startDate;
    if (filter.endDate) endDate = filter.endDate;

    return thoughts.filter(thought => {
      const thoughtDate = new Date(thought.timestamp);
      return thoughtDate >= startDate && thoughtDate <= endDate;
    });
  };

  const analyzeThemes = (filter: TimeFilter): ThemeAnalysis => {
    const filteredThoughts = getFilteredThoughts(filter);
    const themes = themeExtractor.extractThemes(filteredThoughts);
    
    const sentimentCounts = themes.reduce(
      (acc, theme) => {
        acc[theme.sentiment] += theme.frequency;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    const categoryCount = themes.reduce((acc, theme) => {
      acc[theme.category] = (acc[theme.category] || 0) + theme.frequency;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([category]) => category);

    const dateRange = filteredThoughts.reduce(
      (acc, thought) => {
        const date = new Date(thought.timestamp);
        if (!acc.start || date < acc.start) acc.start = date;
        if (!acc.end || date > acc.end) acc.end = date;
        return acc;
      },
      { start: new Date(), end: new Date() }
    );

    return {
      themes,
      totalThoughts: filteredThoughts.length,
      dateRange,
      topCategories,
      sentimentOverview: sentimentCounts
    };
  };

  const getThemesByCategory = (themes: ThemeData[], category: string) => {
    return themes.filter(theme => theme.category === category);
  };

  const getThemesBySentiment = (themes: ThemeData[], sentiment: 'positive' | 'negative' | 'neutral') => {
    return themes.filter(theme => theme.sentiment === sentiment);
  };

  const getThemeTrends = (currentThemes: ThemeData[], previousThemes: ThemeData[]) => {
    const trends = currentThemes.map(currentTheme => {
      const previousTheme = previousThemes.find(t => t.keyword === currentTheme.keyword);
      let trend: 'rising' | 'stable' | 'falling' = 'stable';
      
      if (!previousTheme) {
        trend = 'rising';
      } else if (currentTheme.frequency > previousTheme.frequency) {
        trend = 'rising';
      } else if (currentTheme.frequency < previousTheme.frequency) {
        trend = 'falling';
      }
      
      return { ...currentTheme, trend };
    });

    return trends;
  };

  const getTimeFilters = (): TimeFilter[] => [
    { period: 'week' },
    { period: 'month' },
    { period: 'quarter' },
    { period: 'year' },
    { period: 'all' }
  ];

  return {
    analyzeThemes,
    getFilteredThoughts,
    getThemesByCategory,
    getThemesBySentiment,
    getThemeTrends,
    getTimeFilters
  };
}