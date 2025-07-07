import { useMemo } from 'react';
import { format } from 'date-fns';
import { Thought, ThoughtFormData } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useThoughts() {
  const [thoughts, setThoughts] = useLocalStorage<Thought[]>('thoughts', []);

  const addThought = (thoughtData: ThoughtFormData) => {
    const newThought: Thought = {
      id: crypto.randomUUID(),
      content: thoughtData.content,
      timestamp: new Date(),
      mood: thoughtData.mood,
      tags: thoughtData.tags || [],
      keywords: []
    };

    setThoughts(prev => [newThought, ...prev]);
    return newThought;
  };

  const updateThought = (id: string, updates: Partial<Thought>) => {
    setThoughts(prev => 
      prev.map(thought => 
        thought.id === id ? { ...thought, ...updates } : thought
      )
    );
  };

  const deleteThought = (id: string) => {
    setThoughts(prev => prev.filter(thought => thought.id !== id));
  };

  const getThoughtsByDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return thoughts.filter(thought => 
      format(new Date(thought.timestamp), 'yyyy-MM-dd') === dateStr
    );
  };

  const getThoughtsByDateRange = (startDate: Date, endDate: Date) => {
    return thoughts.filter(thought => {
      const thoughtDate = new Date(thought.timestamp);
      return thoughtDate >= startDate && thoughtDate <= endDate;
    });
  };

  const thoughtsByDate = useMemo(() => {
    return thoughts.reduce((acc, thought) => {
      const dateStr = format(new Date(thought.timestamp), 'yyyy-MM-dd');
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(thought);
      return acc;
    }, {} as Record<string, Thought[]>);
  }, [thoughts]);

  const todaysThoughts = useMemo(() => {
    return getThoughtsByDate(new Date());
  }, [thoughts]);

  const totalThoughts = thoughts.length;

  const exportThoughts = () => {
    const dataStr = JSON.stringify(thoughts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `thoughts-${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importThoughts = (data: Thought[]) => {
    setThoughts(prev => [...prev, ...data]);
  };

  const clearAllThoughts = () => {
    setThoughts([]);
  };

  return {
    thoughts,
    addThought,
    updateThought,
    deleteThought,
    getThoughtsByDate,
    getThoughtsByDateRange,
    thoughtsByDate,
    todaysThoughts,
    totalThoughts,
    exportThoughts,
    importThoughts,
    clearAllThoughts
  };
}