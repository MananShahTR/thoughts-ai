import React from 'react';
import { BookOpen, Moon, Sun } from 'lucide-react';

export function Header() {
  return (
    <header className="glass-card border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">ThoughtLogger</h1>
            <p className="text-sm text-neutral-600">Capture your daily reflections</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-neutral-600 hover:text-neutral-800 transition-colors">
            <Sun className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}