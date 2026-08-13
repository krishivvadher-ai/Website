import { NextRequest } from "next/server";
import { findHelpTopic, HELP_TOPICS } from "@/lib/helpContent";
import { publishedEvents } from "@/lib/events";
import { formatDate } from "@/lib/format";
import { eventAgeBadge } from "@/lib/age";

export const runtime = "nodejs";

// Support chat endpoint. The model key lives ONLY in the server-side
// environment (ANTHROPIC_API_KEY — no NEXT_PUBLIC_ prefix, never sent to the
// browser). The browser talks to this route; this route talks to the
// provider. Without a key the route answers from help content directly, so
// nothing breaks in environments where no key is configured.

const MAX_MESSAGE_CHARS = 1000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

// Per-IP sliding window. In production this moves to a shared store
// (Redis/Upstash) plus a hard monthly spend cap on the provider account.
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (list.length >= RATE_LIMIT_MAX) return true;
  list.push(now);
  hits.set(ip, list);
  return false;
}

// Input safety screen: route real-world risk to real support, never a dead
// end. Deliberately broad — false positives cost a canned message, false
// negatives cost more. Mental-health, medical and self-harm topics are
// refused outright and handed off; the model never answers them.
const CRISIS_PATTERNS = /suicide|self.?harm|kill (myself|me)|hurt (myself|me)|end my life|abuse|assault|overdose/i;
const HEALTH_PATTERNS =
  /depress|anxiet|anxious about (my|me|life)|panic attack|eating disorder|therap(y|ist)|medication|diagnos|mental health|counsell/i;
const PII_REQUEST_BLOCK = /(date of birth|dob|home address|postcode|phone number|school name|what school)/i;

const CRISIS_RESPONSE =
  "It sounds like you might be going through something serious. This chat is only for event questions, but you deserve real support: Childline is free on 0800 1111 (under 19), Samaritans on 116 123 (any age, any time), or text SHOUT to 85258. If you're in immediate danger, call 999. The onTrack team is also reachable via Talk to a person above.";

const HEALTH_RESPONSE =
  "I'm only built to answer questions about events, and health deserves better than an events bot. For someone real to talk to: Childline is free on 0800 1111, Samaritans are on 116 123 any time, and for anything medical speak to your GP or call 111. If it's urgent, call 999.";

/**
 * Every safety hand-off is logged (kind + timestamp only, never message
 * content). Transcript retention is capped at 90 days server-side.
 * TODO: replace console logging with the durable safety-event log, and wire
 * the 90-day transcript deletion job.
 *
 * Note: chat output is render-only in the panel — there is deliberately no
 * share, save or post mechanism for chat content anywhere in the product.
 */
function logHandOff(kind: "crisis" | "health" | "pii") {
  console.warn(`[chat] safety hand-off: ${kind} at ${new Date().toISOString()}`);
}

function systemPrompt(): string {
  const eventSummaries = publishedEvents().slice(0, 40)
    .map((e) => `- ${e.title} | ${formatDate(e.date)} | ${e.venue.area} | ${eventAgeBadge(e)} | ${e.price === 0 ? "Free" : `£${(e.price / 100).toFixed(2)}`}${e.applicationDeadline ? ` | applications close ${formatDate(e.applicationDeadline)}` : ""}`)
    .join("\n");
  const help = HELP_TOPICS.map((t) => `## ${t.title}\n${t.answer}`).join("\n\n");
  return `You are the onTrack support assistant. onTrack helps 13–18 year olds in East London find and track events.

You are a support tool with a defined job, not a companion. Many users are minors. Hard rules:
- Answer ONLY questions about: age eligibility, application deadlines, refunds, ticket transfers, what fees cover, how to find events, and venue accessibility. For anything else say you can't help with that here and point to "Talk to a person".
- REFUSE all mental-health, medical and self-harm topics outright. Do not advise, sympathise at length, or engage — hand off immediately to Childline 0800 1111, Samaritans 116 123, and 999 for danger.
- NEVER ask for date of birth, address, school, phone number, or any personal details. Never restate a user's age back to them.
- Never invent deadlines, eligibility rules, refund terms or event details. If the grounding below doesn't answer it, say "I don't know — here's how to reach the team" and point to Talk to a person.
- Never recommend an event whose age band may be outside the user's eligibility; when unsure, tell them the app filters their feed to eligible events automatically.
- Keep answers short, plain and friendly. Sentence case. No emoji. When an answer touches money, eligibility or policy, end with: "More in Help: <topic>".

# Help content (your only source for policy answers)
${help}

# Live listings (for factual questions only)
${eventSummaries}`;
}

function streamText(text: string): Response {
  const encoder = new TextEncoder();
  const words = text.split(" ");
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        controller.enqueue(encoder.encode(words[i] + (i < words.length - 1 ? " " : "")));
        await new Promise((r) => setTimeout(r, 24));
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return streamText("You’re sending messages a bit fast — give it a minute and try again, or use Talk to a person.");
  }

  let message = "";
  try {
    const body = (await req.json()) as { message?: string };
    message = String(body.message ?? "").slice(0, MAX_MESSAGE_CHARS);
  } catch {
    return streamText("Something went wrong reading that. Try again, or use Talk to a person.");
  }

  if (!message.trim()) {
    return streamText("Ask me about age eligibility, deadlines, refunds, transfers, fees, finding events, or venue access.");
  }

  if (CRISIS_PATTERNS.test(message)) {
    logHandOff("crisis");
    return streamText(CRISIS_RESPONSE);
  }
  if (HEALTH_PATTERNS.test(message)) {
    logHandOff("health");
    return streamText(HEALTH_RESPONSE);
  }
  if (PII_REQUEST_BLOCK.test(message)) {
    logHandOff("pii");
    return streamText(
      "I never ask for or handle personal details like that in chat — and you shouldn’t share them here either. If an account issue needs identity checks, use Talk to a person and the team will do it properly."
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // No key configured: answer from help content directly. Same scope, same
    // tone, honest about limits.
    const topic = findHelpTopic(message);
    if (topic) {
      return streamText(`${topic.answer} More in Help: ${topic.title}.`);
    }
    return streamText(
      "I don’t know the answer to that one — and I’d rather not guess. Tap Talk to a person and the team will sort it, usually within a day."
    );
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.CHAT_MODEL ?? "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: systemPrompt(),
        messages: [{ role: "user", content: message }],
        stream: true,
      }),
    });

    if (!upstream.ok || !upstream.body) {
      // Never echo raw provider errors to the client.
      return streamText("The assistant is having a moment. Try again shortly, or use Talk to a person.");
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = upstream.body.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              try {
                const evt = JSON.parse(line.slice(6));
                if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
                  controller.enqueue(encoder.encode(evt.delta.text));
                }
              } catch {
                // partial JSON across chunks — ignored, buffer handles it
              }
            }
          }
        } finally {
          controller.close();
        }
      },
    });
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch {
    return streamText("The assistant is having a moment. Try again shortly, or use Talk to a person.");
  }
}
