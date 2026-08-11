"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { AGE_BANDS, profileAgeRange } from "@/lib/age";

export default function YouPage() {
  const { ready, profile, setProfile, saved } = useApp();
  const [dob, setDob] = useState("");
  const range = profileAgeRange(profile);

  if (!ready) return null;

  return (
    <div className="max-w-[640px] mx-auto px-6 py-8">
      <h1 className="text-[28px] lg:text-[40px]">You</h1>

      <section className="card mt-8 p-6" aria-labelledby="age-heading">
        <h2 id="age-heading" className="text-[22px]">
          Your age
        </h2>
        <p className="mt-1 text-[14px] text-grey measure">
          Set once, applied everywhere: feed, map, search, saved and shared links. It stays on this
          device and is never shown to another user.
        </p>
        {range && (
          <p className="mt-3 text-[15px] font-medium">
            Currently: {range[0] === range[1] ? `age ${range[0]}` : `ages ${range[0]}–${range[1]}`}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {AGE_BANDS.map((b) => {
            const active = !!profile.band && profile.band[0] === b.min && profile.band[1] === b.max;
            return (
              <button
                key={b.label}
                type="button"
                aria-pressed={active}
                onClick={() => setProfile({ ...profile, band: [b.min, b.max], dob: undefined })}
                className={`pill min-h-[44px] px-4 py-2 border ${
                  active ? "bg-signal border-ink font-semibold" : "bg-white border-line hover:border-ink"
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>
        <form
          className="mt-4 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (dob) setProfile({ ...profile, dob, band: undefined });
          }}
        >
          <label className="text-[13px] text-grey">
            Or use your date of birth{profile.dob ? " (set)" : ""}
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

      <section className="card mt-6 p-6" aria-labelledby="settings-heading">
        <h2 id="settings-heading" className="text-[22px]">
          Settings
        </h2>
        <label className="mt-4 flex items-start gap-3 min-h-[44px]">
          <input
            type="checkbox"
            checked={profile.showIneligible}
            onChange={(e) => setProfile({ ...profile, showIneligible: e.target.checked })}
            className="mt-1 w-4 h-4 accent-[#111111]"
          />
          <span>
            <span className="font-medium text-[15px]">Also show events I’m not old enough for</span>
            <span className="block text-[13px] text-grey measure">
              Off by default. Turn it on if your birthday’s coming up and you want to see what
              opens up — you still can’t book anything outside your age.
            </span>
          </span>
        </label>
      </section>

      <section className="card mt-6 p-6" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="text-[22px]">
          Your stuff
        </h2>
        <p className="mt-2 text-[15px]">
          <Link href="/saved" className="underline">
            {saved.length} saved event{saved.length === 1 ? "" : "s"}
          </Link>{" "}
          ·{" "}
          <Link href="/deadlines" className="underline">
            deadlines
          </Link>
        </p>
      </section>

      <section className="card mt-6 p-6" aria-labelledby="org-heading">
        <h2 id="org-heading" className="text-[22px]">
          Run events?
        </h2>
        <p className="mt-2 text-[14px] text-grey measure">
          Listing is free, and the tools catch age-band mistakes before they cost you attendees.
        </p>
        <Link
          href="/organiser"
          className="mt-3 inline-flex items-center min-h-[44px] px-5 rounded-full border border-ink font-medium text-[14px] hover:bg-ink hover:text-paper transition-colors"
        >
          Go to the organiser dashboard
        </Link>
      </section>
    </div>
  );
}
