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
    select: { text: true },
  });

  const freq: Record<string, number> = {};
  for (const t of thoughts) {
    const tokens = t.text
      .toLowerCase()
      .split(/[^a-zA-Z0-9']/)
      .filter(Boolean);
    for (const token of tokens) {
      if (STOPWORDS.has(token)) continue;
      freq[token] = (freq[token] || 0) + 1;
    }
  }

  const themes = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count }));

  return NextResponse.json({ period: period ?? "all", themes });
}