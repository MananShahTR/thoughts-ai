import { Thought, ThemeData } from '../types';

export class ThemeExtractor {
  private stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'that', 'this', 'it', 'from', 'they', 'we', 'say', 'her', 'she', 'he', 'has', 'had', 'his', 'him', 'i', 'me', 'my', 'was', 'were', 'been', 'be', 'have', 'do', 'did', 'will', 'would', 'could', 'should', 'am', 'are', 'can', 'cant', 'dont', 'wont', 'just', 'now', 'then', 'than', 'so', 'very', 'what', 'when', 'where', 'who', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now'
  ]);

  private emotionWords = {
    positive: ['happy', 'joy', 'love', 'excited', 'grateful', 'peaceful', 'content', 'amazing', 'wonderful', 'great', 'good', 'excellent', 'fantastic', 'awesome', 'beautiful', 'perfect', 'brilliant', 'successful', 'proud', 'confident', 'hopeful', 'optimistic', 'blessed', 'lucky', 'thrilled', 'delighted', 'pleased', 'satisfied', 'cheerful', 'energetic'],
    negative: ['sad', 'angry', 'frustrated', 'worried', 'anxious', 'depressed', 'upset', 'disappointed', 'stressed', 'tired', 'exhausted', 'overwhelmed', 'confused', 'lonely', 'hurt', 'scared', 'afraid', 'nervous', 'annoyed', 'irritated', 'bitter', 'regret', 'guilt', 'shame', 'embarrassed', 'jealous', 'envious', 'hopeless', 'defeated', 'discouraged'],
    neutral: ['okay', 'fine', 'normal', 'regular', 'usual', 'typical', 'standard', 'average', 'moderate', 'calm', 'steady', 'balanced', 'stable', 'consistent', 'routine', 'ordinary', 'common', 'basic', 'simple', 'plain']
  };

  private activityPatterns = [
    'went to', 'visited', 'met with', 'talked to', 'called', 'texted', 'worked on', 'finished', 'started', 'completed', 'read', 'watched', 'played', 'listened to', 'cooked', 'ate', 'bought', 'sold', 'traveled', 'walked', 'ran', 'exercised', 'studied', 'learned', 'taught', 'helped', 'cleaned', 'organized', 'planned', 'decided', 'chose', 'tried', 'attempted', 'succeeded', 'failed', 'achieved', 'accomplished'
  ];

  extractThemes(thoughts: Thought[]): ThemeData[] {
    const themeMap = new Map<string, ThemeData>();
    
    thoughts.forEach(thought => {
      const keywords = this.extractKeywords(thought.content);
      const phrases = this.extractPhrases(thought.content);
      const emotions = this.extractEmotions(thought.content);
      const activities = this.extractActivities(thought.content);
      
      [...keywords, ...phrases, ...emotions, ...activities].forEach(item => {
        if (themeMap.has(item.keyword)) {
          const existing = themeMap.get(item.keyword)!;
          existing.frequency++;
          existing.relatedThoughts.push(thought.id);
        } else {
          themeMap.set(item.keyword, {
            ...item,
            relatedThoughts: [thought.id],
            trend: 'stable'
          });
        }
      });
    });

    return Array.from(themeMap.values())
      .filter(theme => theme.frequency > 1)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 50);
  }

  private extractKeywords(text: string): ThemeData[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length > 2 && 
        !this.stopWords.has(word) &&
        !word.match(/^\d+$/)
      );

    return words.map(word => ({
      keyword: word,
      frequency: 1,
      sentiment: this.getSentiment(word),
      category: this.getCategory(word),
      relatedThoughts: [],
      trend: 'stable' as const
    }));
  }

  private extractPhrases(text: string): ThemeData[] {
    const words = text.toLowerCase().split(/\s+/);
    const phrases: ThemeData[] = [];
    
    for (let i = 0; i < words.length - 1; i++) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      if (!this.stopWords.has(words[i]) && !this.stopWords.has(words[i + 1])) {
        phrases.push({
          keyword: phrase,
          frequency: 1,
          sentiment: this.getSentiment(phrase),
          category: 'concept',
          relatedThoughts: [],
          trend: 'stable'
        });
      }
    }
    
    return phrases;
  }

  private extractEmotions(text: string): ThemeData[] {
    const emotions: ThemeData[] = [];
    const lowerText = text.toLowerCase();
    
    Object.entries(this.emotionWords).forEach(([sentiment, words]) => {
      words.forEach(word => {
        if (lowerText.includes(word)) {
          emotions.push({
            keyword: word,
            frequency: 1,
            sentiment: sentiment as 'positive' | 'negative' | 'neutral',
            category: 'emotion',
            relatedThoughts: [],
            trend: 'stable'
          });
        }
      });
    });
    
    return emotions;
  }

  private extractActivities(text: string): ThemeData[] {
    const activities: ThemeData[] = [];
    const lowerText = text.toLowerCase();
    
    this.activityPatterns.forEach(pattern => {
      if (lowerText.includes(pattern)) {
        activities.push({
          keyword: pattern,
          frequency: 1,
          sentiment: 'neutral',
          category: 'activity',
          relatedThoughts: [],
          trend: 'stable'
        });
      }
    });
    
    return activities;
  }

  private getSentiment(word: string): 'positive' | 'negative' | 'neutral' {
    if (this.emotionWords.positive.includes(word)) return 'positive';
    if (this.emotionWords.negative.includes(word)) return 'negative';
    return 'neutral';
  }

  private getCategory(word: string): 'emotion' | 'activity' | 'person' | 'place' | 'concept' {
    if (this.emotionWords.positive.includes(word) || this.emotionWords.negative.includes(word)) {
      return 'emotion';
    }
    if (this.activityPatterns.some(pattern => pattern.includes(word))) {
      return 'activity';
    }
    if (word.match(/^[A-Z][a-z]+$/)) {
      return 'person';
    }
    return 'concept';
  }
}