import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus, Filter, BarChart3, Eye, Hash, Calendar, Heart, Frown, Smile } from 'lucide-react';
import { useThoughts } from '../../hooks/useThoughts';
import { useThemeAnalysis } from '../../hooks/useThemeAnalysis';
import { TimeFilter } from '../../types';

export function ThemeAnalyzer() {
  const { thoughts } = useThoughts();
  const { analyzeThemes, getTimeFilters } = useThemeAnalysis(thoughts);
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>({ period: 'month' });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const analysis = useMemo(() => {
    return analyzeThemes(selectedFilter);
  }, [selectedFilter, thoughts]);

  const filteredThemes = useMemo(() => {
    if (selectedCategory === 'all') return analysis.themes;
    return analysis.themes.filter(theme => theme.category === selectedCategory);
  }, [analysis.themes, selectedCategory]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'falling': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="w-4 h-4 text-green-500" />;
      case 'negative': return <Frown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emotion': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'activity': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'person': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'place': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const timeFilters = getTimeFilters();

  if (thoughts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="glass-card rounded-xl p-8 max-w-md mx-auto">
          <BarChart3 className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-600 mb-2">No Thoughts to Analyze</h2>
          <p className="text-neutral-500 mb-4">Start logging your thoughts to see theme insights!</p>
          <button className="btn-primary">
            Start Writing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Theme Analysis</h1>
            <p className="text-neutral-600">Discover patterns and insights from your thoughts</p>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-neutral-600" />
            <select
              value={selectedFilter.period}
              onChange={(e) => setSelectedFilter({ period: e.target.value as any })}
              className="px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/90"
            >
              {timeFilters.map(filter => (
                <option key={filter.period} value={filter.period}>
                  {filter.period.charAt(0).toUpperCase() + filter.period.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/40">
            <div className="flex items-center space-x-2 mb-2">
              <Hash className="w-5 h-5 text-primary-500" />
              <span className="text-sm text-neutral-600">Total Thoughts</span>
            </div>
            <p className="text-2xl font-bold text-neutral-800">{analysis.totalThoughts}</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/40">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-5 h-5 text-green-500" />
              <span className="text-sm text-neutral-600">Positive</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{analysis.sentimentOverview.positive}</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/40">
            <div className="flex items-center space-x-2 mb-2">
              <Minus className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-neutral-600">Neutral</span>
            </div>
            <p className="text-2xl font-bold text-gray-600">{analysis.sentimentOverview.neutral}</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/40">
            <div className="flex items-center space-x-2 mb-2">
              <Frown className="w-5 h-5 text-red-500" />
              <span className="text-sm text-neutral-600">Negative</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{analysis.sentimentOverview.negative}</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          {['all', 'emotion', 'activity', 'person', 'place', 'concept'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                selectedCategory === category
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white/90 text-neutral-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Themes List */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-6">
          Top Themes 
          <span className="text-sm font-normal text-neutral-600 ml-2">
            ({filteredThemes.length} themes found)
          </span>
        </h2>
        
        {filteredThemes.length === 0 ? (
          <div className="text-center py-8">
            <Eye className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-500">No themes found for the selected filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredThemes.slice(0, 20).map((theme, index) => (
              <motion.div
                key={theme.keyword}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/40 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(theme.trend)}
                      <h3 className="font-semibold text-neutral-800">{theme.keyword}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(theme.category)}`}>
                        {theme.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getSentimentColor(theme.sentiment)} flex items-center space-x-1`}>
                        {getSentimentIcon(theme.sentiment)}
                        <span>{theme.sentiment}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-neutral-800">{theme.frequency}</div>
                    <div className="text-xs text-neutral-500">mentions</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((theme.frequency / Math.max(...filteredThemes.map(t => t.frequency))) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-neutral-600">
                  Found in {theme.relatedThoughts.length} thought{theme.relatedThoughts.length !== 1 ? 's' : ''}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}