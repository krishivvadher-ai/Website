import { NextRequest, NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/categories";

export const runtime = "nodejs";

// Listing assistant. Server-side only — the model key never reaches the
// browser. Every organiser-tool route authenticates before doing anything;
// in this demo build that's a header set after the demo sign-in, standing in
// for a real session check.

interface Draft {
  title: string;
  description: string;
  category: string;
  intent: "fun" | "useful" | "both";
  tags: string[];
  suggestedAgeBand: string;
  needsDeadline: boolean;
  warnings: string[];
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  music: ["gig", "band", "dj", "music", "set", "open mic", "vinyl"],
  talks: ["lecture", "talk", "speaker", "taster day"],
  social: ["social", "games", "meet", "pizza", "food", "party", "disco"],
  careers: ["career", "apprenticeship", "insight", "network", "employer", "work experience", "cv"],
  sport: ["run", "sport", "climb", "tennis", "football", "match", "fitness"],
  workshops: ["workshop", "make", "making", "craft", "coding", "print", "course", "class", "audition"],
  volunteering: ["volunteer", "charity", "fundrais", "cleanup", "cause", "community project"],
};

function heuristicDraft(rough: string): Draft {
  const text = rough.toLowerCase();

  let category = "social";
  let bestScore = 0;
  for (const [slug, words] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = words.reduce((s, w) => s + (text.includes(w) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      category = slug;
    }
  }
  const intent = CATEGORIES.find((c) => c.slug === category)?.intent ?? "both";

  const firstSentence = rough.split(/[.!?\n]/)[0]?.trim() ?? "New event";
  const title = firstSentence.length <= 60 ? firstSentence : `${firstSentence.slice(0, 57).trimEnd()}…`;

  const ageMatch = text.match(/(\d{2})\s*\+|over\s*(\d{2})|(\d{2})\s*(?:to|–|-)\s*(\d{2})/);
  let suggestedAgeBand = "All ages";
  const warnings: string[] = [];
  if (ageMatch) {
    if (ageMatch[3] && ageMatch[4]) suggestedAgeBand = `${ageMatch[3]}–${ageMatch[4]}`;
    else suggestedAgeBand = `${ageMatch[1] ?? ageMatch[2]}+`;
  }
  if (/alcohol|bar|licensed|club night|18\+/.test(text) && !suggestedAgeBand.startsWith("18")) {
    warnings.push(
      "The description mentions a bar, alcohol or a club night but the age band isn’t 18+. Check the band — age mismatches are users’ second-biggest complaint."
    );
    suggestedAgeBand = "18+";
  }

  const tags = Object.entries(CATEGORY_KEYWORDS)
    .flatMap(([, words]) => words.filter((w) => text.includes(w)))
    .slice(0, 5);

  const description = [
    firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`,
    rough.length > firstSentence.length + 10 ? rough.slice(firstSentence.length + 1).trim() : "",
    "\nWhat to bring: nothing — just yourself.\nAccessibility: add step-free and quiet-space details here.",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    title,
    description,
    category,
    intent,
    tags,
    suggestedAgeBand,
    needsDeadline: true,
    warnings,
  };
}

export async function POST(req: NextRequest) {
  // Auth check stands first — no work happens for unauthenticated callers.
  if (req.headers.get("x-demo-organiser") !== "true") {
    return NextResponse.json({ error: "Sign in as an organiser first." }, { status: 401 });
  }

  let rough = "";
  try {
    const body = (await req.json()) as { rough?: string };
    rough = String(body.rough ?? "").slice(0, 4000);
  } catch {
    return NextResponse.json({ error: "Could not read the description." }, { status: 400 });
  }
  if (rough.trim().length < 10) {
    return NextResponse.json({ error: "Write a sentence or two first — anything rough is fine." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: process.env.CHAT_MODEL ?? "claude-haiku-4-5-20251001",
          max_tokens: 800,
          system: `You draft event listings for onTrack (events for 13–18 year olds, East London). Given a rough description, return ONLY a JSON object: {"title": string under 60 chars, "description": string (structured, plain, sentence case), "category": one of ${CATEGORIES.map((c) => c.slug).join("|")}, "intent": "fun"|"useful"|"both", "tags": string[] max 5, "suggestedAgeBand": e.g. "All ages"|"18+"|"15–16", "needsDeadline": boolean, "warnings": string[] (flag any contradiction between the description and the age band)}. No markdown, no commentary.`,
          messages: [{ role: "user", content: rough }],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text: string = data.content?.[0]?.text ?? "";
        const parsed = JSON.parse(text) as Draft;
        if (parsed.title && parsed.description) {
          return NextResponse.json({ draft: parsed, source: "model" });
        }
      }
      // fall through to heuristic on any provider hiccup — never expose the error
    } catch {
      // fall through
    }
  }

  return NextResponse.json({ draft: heuristicDraft(rough), source: "assistant" });
}
