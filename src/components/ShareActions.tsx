"use client";

import React, { useState } from "react";
import type { OnTrackEvent } from "@/lib/types";
import { generateStoryImage } from "@/lib/storyImage";

// Sharing is the acquisition mechanic: native share sheet where available,
// a story image one tap away, and "Ask a mate" for the people who said they
// had nobody to go with. Always user-initiated, always one-to-one.

function eventUrl(event: OnTrackEvent): string {
  return `${window.location.origin}/events/${event.slug}`;
}

export function ShareActions({ event, compact = false }: { event: OnTrackEvent; compact?: boolean }) {
  const [note, setNote] = useState<string | null>(null);

  const flash = (msg: string) => {
    setNote(msg);
    window.setTimeout(() => setNote(null), 2500);
  };

  const share = async (text: string) => {
    const url = eventUrl(event);
    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, text, url });
        return;
      } catch {
        // user closed the sheet — nothing to do
        return;
      }
    }
    await navigator.clipboard.writeText(`${text} ${url}`);
    flash("Link copied");
  };

  const storyImage = async () => {
    try {
      const blob = await generateStoryImage(event);
      const file = new File([blob], `ontrack-${event.slug}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: event.title });
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
      flash("Story image downloaded");
    } catch {
      flash("Couldn’t make the image — try again");
    }
  };

  const btn =
    "inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border border-line bg-white text-[14px] font-medium hover:border-ink transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" className={btn} onClick={() => share(event.title)}>
        <ShareIcon /> Share
      </button>
      <button type="button" className={btn} onClick={() => share(`Thinking of going to this — come with me? ${event.title}`)}>
        Ask a mate
      </button>
      {!compact && (
        <button type="button" className={btn} onClick={storyImage}>
          Story image
        </button>
      )}
      {note && (
        <span role="status" className="text-[13px] text-grey">
          {note}
        </span>
      )}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v13M12 3 7 8m5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 13v7h14v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
