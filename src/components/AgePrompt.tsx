"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { AGE_BANDS } from "@/lib/age";

/**
 * One-time age setup, shown at the top of the feed until the user sets an
 * age. Set once, applied everywhere. DOB or band, stored locally, never
 * shown to other users, never asked for again in chat.
 */
export function AgePrompt() {
  const { ready, profile, setProfile } = useApp();
  const [dob, setDob] = useState("");

  if (!ready || profile.dob || profile.band) return null;

  return (
    <section className="card p-5 bg-white" aria-labelledby="age-prompt-title">
      <h2 id="age-prompt-title" className="text-[20px]">
        First, your age
      </h2>
      <p className="mt-1 text-[14px] text-grey measure">
        Set it once and everything you can’t attend disappears — no scrolling past 18+ nights at
        fifteen. It stays on this device and is never shown to anyone.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {AGE_BANDS.map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={() => setProfile({ ...profile, band: [b.min, b.max], dob: undefined })}
            className="pill min-h-[44px] px-4 py-2 border border-line bg-white hover:border-ink"
          >
            {b.label}
          </button>
        ))}
      </div>
      <form
        className="mt-3 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (dob) setProfile({ ...profile, dob, band: undefined });
        }}
      >
        <label className="text-[13px] text-grey">
          Or enter your date of birth
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="mt-1 block h-11 px-3 rounded-lg border border-line bg-white text-ink"
          />
        </label>
        <button
          type="submit"
          disabled={!dob}
          className="min-h-[44px] px-5 rounded-full bg-ink text-paper text-[14px] font-medium disabled:opacity-40"
        >
          Set age
        </button>
      </form>
    </section>
  );
}
