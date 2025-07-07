import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ThoughtInput = z.object({
  text: z.string().min(1).max(2000),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  const thoughts = await prisma.thought.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json(thoughts);
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = ThoughtInput.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const thought = await prisma.thought.create({
    data: {
      text: parsed.data.text,
    },
  });

  return NextResponse.json(thought, { status: 201 });
}