"use client";

import * as Tabs from "@radix-ui/react-tabs";
import TodayView from "@/components/TodayView";
import InsightsView from "@/components/InsightsView";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <Tabs.Root defaultValue="today" className="w-full max-w-3xl">
        <Tabs.List
          className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 mb-6"
          aria-label="Main navigation tabs"
        >
          <Tabs.Trigger
            value="today"
            className="px-4 py-2 font-medium transition-colors data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 focus:outline-none text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100"
          >
            Today&apos;s Thoughts
          </Tabs.Trigger>
          <Tabs.Trigger
            value="insights"
            className="px-4 py-2 font-medium transition-colors data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 focus:outline-none text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100"
          >
            Insights
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="today" className="focus:outline-none">
          <TodayView />
        </Tabs.Content>
        <Tabs.Content value="insights" className="focus:outline-none">
          <InsightsView />
        </Tabs.Content>
      </Tabs.Root>
    </main>
  );
}
