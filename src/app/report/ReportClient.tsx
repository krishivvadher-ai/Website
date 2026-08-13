"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";

// Report a concern: reachable in one tap from every page, never requires an
// account, and never asks for more than the reporter chooses to give.
// Demo build: reports persist locally. TODO: submit server-side to the DSL
// queue with same-day handling.

const KINDS = [
  { value: "event", label: "Something about an event" },
  { value: "organiser", label: "Something about an organiser" },
  { value: "someone-said", label: "Something someone said to me" },
  { value: "other", label: "Something else" },
];

export function ReportClient() {
  const { addReport } = useApp();
  const [kind, setKind] = useState<string | null>(null);
  const [detail, setDetail] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kind) return;
    addReport({ kind, detail: detail.trim(), replyEmail: email.trim() || undefined });
    setDone(true);
  };

  return (
    <div className="max-w-[640px] mx-auto px-6 py-8 lg:py-12">
      <h1 className="text-[28px] lg:text-[40px]">Report a concern</h1>

      {/* Before anything else: real help, independent of this form */}
      <section aria-labelledby="danger-heading" className="card mt-6 p-5 border-coral">
        <h2 id="danger-heading" className="text-[18px]">
          If you are in danger right now
        </h2>
        <ul className="mt-2 space-y-1 text-[15px]">
          <li>
            <strong>Call 999.</strong>
          </li>
          <li>
            <strong>Childline — 0800 1111.</strong> Free, confidential, any time.
          </li>
        </ul>
        <p className="mt-2 text-[14px] text-grey measure">
          You do not have to use this form to get help. Those numbers work whether or not you
          ever tell us anything.
        </p>
      </section>

      {done ? (
        <section className="card mt-6 p-6" aria-live="polite">
          <h2 className="text-[22px]">Thank you — we’ve got it</h2>
          <p className="mt-2 text-[15px] measure">
            A person reads every report. Safeguarding concerns are acted on the same working
            day; everything else within 24 hours. If you left an email address, that’s where
            we’ll reply.
          </p>
        </section>
      ) : (
        <form className="mt-6 space-y-6" onSubmit={submit}>
          <fieldset>
            <legend className="text-[15px] font-semibold">What happened?</legend>
            <div className="mt-3 grid gap-2">
              {KINDS.map((k) => (
                <label
                  key={k.value}
                  className={`card px-4 py-3 flex items-center gap-3 cursor-pointer min-h-[48px] ${
                    kind === k.value ? "border-ink" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="kind"
                    value={k.value}
                    checked={kind === k.value}
                    onChange={() => setKind(k.value)}
                    className="w-4 h-4 accent-[#111111]"
                  />
                  <span className="text-[15px]">{k.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-[15px] font-semibold">
              Tell us more <span className="font-normal text-grey">(optional)</span>
            </span>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              rows={5}
              maxLength={2000}
              className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-[15px]"
              placeholder="Anything you want to say, in your own words. Names, links or event titles all help."
            />
          </label>

          <label className="block">
            <span className="text-[15px] font-semibold">
              An email for a reply <span className="font-normal text-grey">(optional)</span>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full h-11 rounded-xl border border-line bg-white px-3 text-[15px]"
              placeholder="Only if you want us to write back"
            />
          </label>

          <button
            type="submit"
            disabled={!kind}
            className="min-h-[48px] px-7 rounded-full bg-ink text-paper font-display font-semibold text-[16px] disabled:opacity-40"
          >
            Send report
          </button>

          <p className="text-[13px] text-grey measure">
            We read every report. Safeguarding concerns are acted on the same working day, and
            everything else gets a response within 24 hours. You don’t need an account, and you
            don’t have to tell us who you are.
          </p>
        </form>
      )}
    </div>
  );
}
