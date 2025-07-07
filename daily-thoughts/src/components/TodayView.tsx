"use client";

import { useEffect, useState } from "react";

interface Thought {
  id: number;
  text: string;
  createdAt: string; // ISO string
}

export default function TodayView() {
  const [input, setInput] = useState("");
  const [thoughts, setThoughts] = useState<Thought[]>([]);

  const storageKey = () => {
    const today = new Date();
    return `thoughts-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  };

  // Load today's thoughts from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(storageKey());
      if (stored) {
        setThoughts(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to parse saved thoughts", err);
    }
  }, []);

  // Persist whenever thoughts change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(storageKey(), JSON.stringify(thoughts));
    } catch (err) {
      console.error("Failed to save thoughts", err);
    }
  }, [thoughts]);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newThought: Thought = {
      id: Date.now(),
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    setThoughts([newThought, ...thoughts]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <section className="flex flex-col gap-6 w-full">
      <header>
        <h2 className="text-2xl font-semibold mb-2">Log your thoughts</h2>
        <p className="text-sm text-zinc-500">
          Jot anything that comes to mind. Press <kbd className="px-1 py-0.5 border rounded">Ctrl/Cmd + Enter</kbd> or click
          <span className="font-semibold">&quot;Save&quot;</span> to add it to today&apos;s list.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <textarea
          className="w-full min-h-[120px] p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="What&apos;s on your mind?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleAdd}
          className="self-end bg-blue-600 text-white hover:bg-blue-700 transition-colors px-5 py-2 rounded-md disabled:opacity-50"
          disabled={!input.trim()}
        >
          Save
        </button>
      </div>

      {thoughts.length > 0 && (
        <ul className="flex flex-col gap-4 mt-6" aria-label="Today&apos;s thoughts list">
          {thoughts.map((t) => (
            <li key={t.id} className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800 border-l-4 border-blue-600">
              <time
                dateTime={t.createdAt}
                className="block text-xs text-zinc-500 mb-2"
              >
                {new Date(t.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
              <p className="whitespace-pre-wrap">{t.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}