import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STOPWORDS = new Set([
  "the",
  "and",
  "a",
  "to",
  "of",
  "in",
  "is",
  "it",
  "for",
  "on",
  "that",
  "this",
  "with",
  "as",
  "i",
  "be",
  "are",
  "was",
  "were",
  "but",
  "have",
  "has",
  "had",
  "at",
  "by",
  "an",
  "or",
  "not",
  "from",
  "my",
  "we",
  "you",
]);

function getStartDate(period: string | null): Date | null {
  const now = new Date();
  switch (period) {
    case "week":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "month":
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    case "year":
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    case "all":
    case null:
    default:
      return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period");
  const startDate = getStartDate(period);

  const where = startDate ? { createdAt: { gte: startDate } } : undefined;

  const thoughts = await prisma.thought.findMany({
    where,
    select: { text: true, sentiment: true },
  });

  const freq: Record<string, number> = {};
  const sentimentTotals: Record<string, number> = {};

  const thoughtsWithSentiment = thoughts as unknown as Array<{ text: string; sentiment: number }>;

  for (const t of thoughtsWithSentiment) {
    const tokens = t.text
      .toLowerCase()
      .split(/[^a-zA-Z0-9']/)
      .filter((tok) => tok && !STOPWORDS.has(tok));

    // unigrams
    for (const token of tokens) {
      freq[token] = (freq[token] || 0) + 1;
      sentimentTotals[token] = (sentimentTotals[token] || 0) + (t.sentiment ?? 0);
    }

    // bigrams & trigrams
    for (let i = 0; i < tokens.length; i++) {
      if (i + 1 < tokens.length) {
        const bigram = `${tokens[i]} ${tokens[i + 1]}`;
        freq[bigram] = (freq[bigram] || 0) + 1;
        sentimentTotals[bigram] = (sentimentTotals[bigram] || 0) + (t.sentiment ?? 0);
      }
      if (i + 2 < tokens.length) {
        const trigram = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
        freq[trigram] = (freq[trigram] || 0) + 1;
        sentimentTotals[trigram] = (sentimentTotals[trigram] || 0) + (t.sentiment ?? 0);
      }
    }
  }

  // Minimum occurrences to be considered theme
  const MIN_OCCUR = 2;

  const themes = Object.entries(freq)
    .filter(([, count]) => count >= MIN_OCCUR)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word, count]) => ({
      word,
      count,
      avgSentiment: parseFloat((sentimentTotals[word] / count).toFixed(2)),
    }));

  const avgSentiment =
    thoughtsWithSentiment.length > 0
      ? thoughtsWithSentiment.reduce((acc, t) => acc + t.sentiment, 0) /
        thoughtsWithSentiment.length
      : 0;

  return NextResponse.json({ period: period ?? "all", avgSentiment, themes });
}