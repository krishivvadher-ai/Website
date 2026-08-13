"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { AGE_BANDS, ageFromDob, recordUnder13Rejection, under13BlockActive } from "@/lib/age";

/**
 * One-time age setup, shown at the top of the feed until the user sets an
 * age. Set once, applied everywhere.
 *
 * Children's Code notes (keep in sync with src/lib/age.ts):
 * - the date field is neutral — no default, no pre-ticked "I am over 13"
 * - an under-13 date of birth is rejected and re-entry is blocked on this
 *   device for 24 hours
 * - every user gets the highest protections regardless of the age entered
 */
export function AgePrompt() {
  const { ready, profile, setProfile } = useApp();
  const [dob, setDob] = useState("");
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (ready) setBlocked(under13BlockActive());
  }, [ready]);

  if (!ready || profile.dob || profile.band) return null;

  if (blocked) {
    return (
      <section className="card p-5 bg-white" aria-labelledby="age-blocked-title">
        <h2 id="age-blocked-title" className="text-[20px]">
          onTrack is for 13–18 year olds
        </h2>
        <p className="mt-1 text-[14px] text-grey measure">
          The date of birth entered on this device is under 13, so age setup is paused for 24
          hours. onTrack isn’t built for under-13s — but it will be here when you are.
        </p>
      </section>
    );
  }

  const submitDob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;
    if (ageFromDob(dob) < 13) {
      recordUnder13Rejection();
      setBlocked(true);
      return;
    }
    setProfile({ ...profile, dob, band: undefined });
  };

  return (
    <section className="card p-5 bg-white" aria-labelledby="age-prompt-title">
      <h2 id="age-prompt-title" className="text-[20px]">
        First, your age
      </h2>
      <p className="mt-1 text-[14px] text-grey measure">
        Set it once and everything you can’t attend disappears — no scrolling past 16+ nights at
        fourteen.
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
      <form className="mt-3 flex flex-wrap items-end gap-2" onSubmit={submitDob}>
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
      <p className="mt-3 text-[13px] text-grey measure">
        We store your age band on this device. We never show it to anyone else, and we never
        send it to an organiser.
      </p>
    </section>
  );
}
