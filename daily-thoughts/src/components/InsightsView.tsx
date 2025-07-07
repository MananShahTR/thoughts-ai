"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface Theme {
  word: string;
  count: number;
}

const periods = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
  { label: "All", value: "all" },
];

export default function InsightsView() {
  const [period, setPeriod] = useState<string>("month");

  const { data, isLoading, error } = useQuery<{ themes: Theme[] }>({
    queryKey: ["themes", period],
    queryFn: async () => {
      const res = await fetch(`/api/insights/themes?period=${period}`);
      if (!res.ok) throw new Error("Failed to fetch themes");
      return res.json();
    },
  });

  return (
    <section className="flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-semibold">Insights</h2>

      {/* Period Selection */}
      <div className="flex gap-2">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-3 py-1 rounded-full border text-sm transition-colors ${
              period === p.value
                ? "bg-blue-600 text-white border-blue-600"
                : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Themes List */}
      {isLoading && <p className="text-zinc-500">Loading themes...</p>}
      {error && <p className="text-red-500">Error loading themes.</p>}

      {data && data.themes.length === 0 && (
        <p className="text-zinc-500">No themes yet for this period.</p>
      )}

      {data && data.themes.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {data.themes.map((t) => (
            <li
              key={t.word}
              className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 flex flex-col items-center"
            >
              <span className="text-lg font-semibold">{t.word}</span>
              <span className="text-sm">{t.count} mention{t.count > 1 ? "s" : ""}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}