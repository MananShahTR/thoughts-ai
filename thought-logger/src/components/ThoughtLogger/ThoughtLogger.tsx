import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Plus, Save, Calendar, Hash, Smile, Meh, Frown } from 'lucide-react';
import { useThoughts } from '../../hooks/useThoughts';
import { ThoughtFormData } from '../../types';

export function ThoughtLogger() {
  const { thoughts, addThought, todaysThoughts, totalThoughts } = useThoughts();
  const [formData, setFormData] = useState<ThoughtFormData>({
    content: '',
    mood: undefined,
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.content.trim()) {
      addThought(formData);
      setFormData({ content: '', mood: undefined, tags: [] });
      setTagInput('');
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'positive': return <Smile className="w-4 h-4 text-green-500" />;
      case 'negative': return <Frown className="w-4 h-4 text-red-500" />;
      default: return <Meh className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Today's Thoughts</p>
              <p className="text-2xl font-bold text-neutral-800">{todaysThoughts.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Thoughts</p>
              <p className="text-2xl font-bold text-neutral-800">{totalThoughts}</p>
            </div>
            <Plus className="w-8 h-8 text-secondary-500" />
          </div>
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Current Streak</p>
              <p className="text-2xl font-bold text-neutral-800">7 days</p>
            </div>
            <Hash className="w-8 h-8 text-primary-500" />
          </div>
        </div>
      </div>

      {/* Thought Entry Form */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">What's on your mind today?</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your thoughts here..."
              rows={6}
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white/90 backdrop-blur-sm"
            />
          </div>

          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">How are you feeling?</label>
            <div className="flex space-x-3">
              {[
                { value: 'positive', label: 'Positive', icon: Smile, color: 'text-green-600' },
                { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-gray-600' },
                { value: 'negative', label: 'Negative', icon: Frown, color: 'text-red-600' }
              ].map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mood: value as any }))}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                    formData.mood === value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white/90'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${formData.mood === value ? 'text-primary-600' : color}`} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags?.map(tag => (
                <span
                  key={tag}
                  className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag(tagInput))}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/90"
              />
              <button
                type="button"
                onClick={() => handleAddTag(tagInput)}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!formData.content.trim()}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Thought</span>
          </button>
        </form>
      </div>

      {/* Recent Thoughts */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">Recent Thoughts</h2>
        {thoughts.length === 0 ? (
          <p className="text-neutral-500 text-center py-8">
            No thoughts yet. Share what's on your mind!
          </p>
        ) : (
          <div className="space-y-4">
            {thoughts.slice(0, 10).map((thought, index) => (
              <motion.div
                key={thought.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/40"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {thought.mood && getMoodIcon(thought.mood)}
                    <span className="text-sm text-neutral-600">
                      {format(new Date(thought.timestamp), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  {thought.mood && (
                    <span className={`px-2 py-1 rounded-full text-xs ${getMoodColor(thought.mood)}`}>
                      {thought.mood}
                    </span>
                  )}
                </div>
                <p className="text-neutral-800 mb-3 leading-relaxed">{thought.content}</p>
                {thought.tags && thought.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {thought.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}