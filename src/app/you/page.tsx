"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { AGE_BANDS, ageFromDob, profileAgeRange, recordUnder13Rejection, under13BlockActive } from "@/lib/age";
import { publishedEvents } from "@/lib/events";
import { categoryBySlug } from "@/lib/categories";
import { formatDate } from "@/lib/format";

export default function YouPage() {
  const { ready, profile, setProfile, saved, attended, setAttended, exportData, deleteAllData } = useApp();
  const [dob, setDob] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);
  const ageSectionRef = useRef<HTMLElement>(null);
  const range = profileAgeRange(profile);

  React.useEffect(() => {
    if (ready) setBlocked(under13BlockActive());
  }, [ready]);

  const attendedList = useMemo(() => {
    return publishedEvents()
      .filter((e) => attended[e.id])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [attended]);

  const savedEvents = useMemo(
    () => publishedEvents().filter((e) => saved.includes(e.id) && !attended[e.id]),
    [saved, attended]
  );

  if (!ready) return null;

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

  const downloadData = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-ontrack-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyForApplication = async () => {
    const lines = attendedList.map((e) => {
      const note = attended[e.id]?.note?.trim();
      const cat = categoryBySlug(e.category)?.name ?? e.category;
      return `${formatDate(e.date)} — ${e.title} (${cat}, ${e.organiser})${note ? `\n  ${note}` : ""}`;
    });
    const text = `Things I have done outside education:\n\n${lines.join("\n\n")}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-[640px] mx-auto px-6 py-8">
      <h1 className="text-[28px] lg:text-[40px] print:hidden">You</h1>

      <section ref={ageSectionRef} className="card mt-8 p-6 print:hidden" aria-labelledby="age-heading" id="age">
        <h2 id="age-heading" className="text-[22px]">
          Your age
        </h2>
        <p className="mt-1 text-[14px] text-grey measure">
          We store your age band on this device. We never show it to anyone else, and we never
          send it to an organiser.
        </p>
        {range && (
          <p className="mt-3 text-[15px] font-medium">
            Currently: {range[0] === range[1] ? `age ${range[0]}` : `ages ${range[0]}–${range[1]}`}
          </p>
        )}
        {blocked && !profile.dob && !profile.band ? (
          <p className="mt-3 text-[14px] text-grey measure">
            The date of birth entered on this device is under 13, so age setup is paused for 24
            hours. onTrack is for 13–18 year olds.
          </p>
        ) : (
          <>
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
            <form className="mt-4 flex flex-wrap items-end gap-2" onSubmit={submitDob}>
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
          </>
        )}
      </section>

      {/* ------------------------------------------------ What I've done */}
      <section className="card mt-6 p-6 print:border-0 print:p-0" aria-labelledby="done-heading" id="ucas-print">
        <h2 id="done-heading" className="text-[22px]">
          What I’ve done
        </h2>
        <p className="mt-1 text-[14px] text-grey measure print:hidden">
          UCAS now asks every applicant: “What else have you done to prepare outside of
          education, and why are these experiences useful?” This list is your answer, building
          itself. It stays on this device — we never send it anywhere.
        </p>

        {attendedList.length === 0 ? (
          <p className="mt-4 text-[14px] text-grey measure">
            Mark an event as “I went to this” — on the event page, or from your saved list
            below — and it starts your record.
          </p>
        ) : (
          <ol className="mt-4 space-y-4">
            {attendedList.map((e) => (
              <li key={e.id} className="border-b border-line pb-4 last:border-0">
                <p className="font-medium text-[15px]">{e.title}</p>
                <p className="text-[13px] text-grey">
                  {formatDate(e.date)} · {e.organiser} · {categoryBySlug(e.category)?.name ?? e.category}
                </p>
                <label className="block mt-2 print:hidden">
                  <span className="sr-only">What you got from {e.title}</span>
                  <input
                    value={attended[e.id]?.note ?? ""}
                    onChange={(ev) => setAttended(e.id, { ...attended[e.id], note: ev.target.value })}
                    placeholder="One line on what you got from it…"
                    className="w-full h-10 px-3 rounded-lg border border-line bg-white text-[14px]"
                  />
                </label>
                {attended[e.id]?.note && <p className="hidden print:block text-[13px] mt-1">{attended[e.id].note}</p>}
                <button
                  type="button"
                  onClick={() => setAttended(e.id, null)}
                  className="mt-2 text-[12px] underline text-grey print:hidden"
                >
                  Remove
                </button>
              </li>
            ))}
          </ol>
        )}

        {attendedList.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 print:hidden">
            <button
              type="button"
              onClick={copyForApplication}
              className="min-h-[44px] px-5 rounded-full bg-signal text-ink border border-ink font-display font-semibold text-[14px]"
            >
              {copied ? "Copied" : "Copy for my application"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-[44px] px-5 rounded-full border border-ink text-[14px] font-medium hover:bg-ink hover:text-paper transition-colors"
            >
              Print this list
            </button>
          </div>
        )}

        {savedEvents.length > 0 && (
          <div className="mt-6 pt-4 border-t border-line print:hidden">
            <h3 className="text-[14px] font-semibold">From your saved events</h3>
            <ul className="mt-2 space-y-2">
              {savedEvents.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 text-[14px]">
                  <span className="min-w-0 truncate">{e.title}</span>
                  <button
                    type="button"
                    onClick={() => setAttended(e.id, { note: "", markedAt: new Date().toISOString() })}
                    className="pill shrink-0 min-h-[36px] px-3 border border-line hover:border-ink"
                  >
                    I went to this
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="card mt-6 p-6 print:hidden" aria-labelledby="settings-heading">
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

      {/* ------------------------------------------------------ Your data */}
      <section className="card mt-6 p-6 print:hidden" aria-labelledby="data-heading">
        <h2 id="data-heading" className="text-[22px]">
          Your data
        </h2>
        <p className="mt-1 text-[14px] text-grey measure">
          Everything onTrack knows about you lives on this device. The{" "}
          <Link href="/privacy" className="underline text-ink">
            privacy notice
          </Link>{" "}
          explains it in full — the short version is at the top, and it’s actually short.
        </p>
        <div className="mt-4 grid gap-2">
          <button
            type="button"
            onClick={downloadData}
            className="min-h-[44px] px-5 rounded-full border border-ink text-[14px] font-medium text-left hover:bg-ink hover:text-paper transition-colors"
          >
            Download my data
          </button>
          <button
            type="button"
            onClick={() => ageSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="min-h-[44px] px-5 rounded-full border border-ink text-[14px] font-medium text-left hover:bg-ink hover:text-paper transition-colors"
          >
            Correct my details
          </button>
          {confirmDelete ? (
            <div className="card p-4 border-coral">
              <p className="text-[14px] font-medium">
                Delete everything onTrack stores on this device? This can’t be undone.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    deleteAllData();
                    setConfirmDelete(false);
                  }}
                  className="min-h-[44px] px-5 rounded-full bg-ink text-paper text-[14px] font-medium"
                >
                  Yes, delete it all
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="min-h-[44px] px-5 rounded-full border border-line text-[14px] font-medium"
                >
                  Keep my stuff
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="min-h-[44px] px-5 rounded-full border border-ink text-[14px] font-medium text-left hover:bg-ink hover:text-paper transition-colors"
            >
              Delete my account
            </button>
          )}
        </div>
      </section>

      <section className="card mt-6 p-6 print:hidden" aria-labelledby="org-heading">
        <h2 id="org-heading" className="text-[22px]">
          Run events?
        </h2>
        <p className="mt-2 text-[14px] text-grey measure">
          Listing is free, and the tools catch age-band mistakes before they cost you attendees.
        </p>
        <Link
          href="/for-organisers"
          className="mt-3 inline-flex items-center min-h-[44px] px-5 rounded-full border border-ink font-medium text-[14px] hover:bg-ink hover:text-paper transition-colors"
        >
          See how listing works
        </Link>
      </section>
    </div>
  );
}
