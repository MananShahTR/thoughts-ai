"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h2 className="text-2xl font-semibold text-red-600">Something went wrong!</h2>
      <p className="text-zinc-600 dark:text-zinc-400 text-center max-w-md">
        {error.message || "Unexpected error."}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}