"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";

// Organiser onboarding with the Tier A safeguarding self-certification.
// Demo build: nothing here is transmitted or stored beyond this session.
// TODO: submit server-side, store documents, and start the verification
// queue.

export function OnboardingClient() {
  const { setOrganiserSignedIn } = useApp();
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOrganiserSignedIn(true);
    setDone(true);
  };

  if (done) {
    return (
      <div className="max-w-[640px] mx-auto px-6 py-12">
        <h1 className="text-[28px] lg:text-[40px]">You’re set up</h1>
        <p className="mt-3 text-grey measure">
          Your self-certification is recorded. You can list events now — every listing goes to
          an onTrack reviewer before it appears anywhere. If you’d like the “Safeguarding
          verified” badge, reply to your welcome email with your documents and we’ll check
          them, usually within five working days.
        </p>
        <Link
          href="/organiser"
          className="mt-6 inline-flex items-center min-h-[48px] px-7 rounded-full bg-signal text-ink border border-ink font-display font-semibold"
        >
          Go to your dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[640px] mx-auto px-6 py-12">
      <h1 className="text-[28px] lg:text-[40px]">Set up your organisation</h1>
      <p className="mt-3 text-grey measure">
        Ten minutes, once. The safeguarding section is required for anyone listing events open
        to under-18s — it is the deal we make with every young person who uses onTrack.
      </p>

      <form className="mt-8 space-y-8" onSubmit={submit}>
        <section className="card p-6 space-y-4" aria-labelledby="org-details">
          <h2 id="org-details" className="text-[22px]">
            Your organisation
          </h2>
          <Field label="Legal entity name" name="legalName" required placeholder="e.g. Poplar HARCA Ltd" />
          <Field label="Named safeguarding contact" name="dslName" required placeholder="Full name" />
          <Field
            label="Safeguarding contact email"
            name="dslEmail"
            type="email"
            required
            placeholder="They receive every concern about your listings"
          />
        </section>

        <section className="card p-6 space-y-4" aria-labelledby="policy-heading">
          <h2 id="policy-heading" className="text-[22px]">
            Your safeguarding policy
          </h2>
          <Field
            label="A public link to your safeguarding policy"
            name="policyUrl"
            type="url"
            placeholder="https://…"
          />
          <label className="block text-[14px] font-semibold">
            Or upload it
            <input
              type="file"
              name="policyFile"
              accept=".pdf,.doc,.docx"
              className="mt-2 block w-full text-[14px] text-grey file:mr-3 file:min-h-[40px] file:px-4 file:rounded-full file:border file:border-line file:bg-white file:text-ink file:text-[13px] file:font-medium"
            />
            <span className="mt-1 block text-[12px] text-grey font-normal">
              One of link or upload is required. (Demo: files are not transmitted.)
            </span>
          </label>
        </section>

        <section className="card p-6 space-y-4" aria-labelledby="dbs-heading">
          <h2 id="dbs-heading" className="text-[22px]">
            DBS confirmation
          </h2>
          <CheckField name="dbs" required>
            I confirm that everyone engaged by us in regulated activity with children holds an
            Enhanced DBS certificate with a children’s barred list check, assessed against the
            scope of regulated activity as it applies from 1 September 2026.
          </CheckField>
        </section>

        <section className="card p-6 space-y-4" aria-labelledby="insurance-heading">
          <h2 id="insurance-heading" className="text-[22px]">
            Public liability insurance
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-[14px] font-semibold">
              Cover limit
              <select
                name="pliLimit"
                required
                className="mt-2 w-full h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-normal"
              >
                <option value="">Select…</option>
                <option>£5 million</option>
                <option>£10 million</option>
                <option>Other (we’ll be in touch)</option>
              </select>
            </label>
            <Field label="Expiry date" name="pliExpiry" type="date" required />
          </div>
        </section>

        <section className="card p-6 space-y-4" aria-labelledby="conduct-heading">
          <h2 id="conduct-heading" className="text-[22px]">
            Code of conduct
          </h2>
          <CheckField name="conduct" required>
            We accept the{" "}
            <Link href="/organiser-terms#conduct" className="underline">
              Organiser Code of Conduct
            </Link>{" "}
            and the{" "}
            <Link href="/organiser-terms" className="underline">
              organiser terms
            </Link>
            , including onTrack’s right to suspend any listing immediately on a safeguarding
            concern.
          </CheckField>
        </section>

        <button
          type="submit"
          className="min-h-[48px] px-8 rounded-full bg-ink text-paper font-display font-semibold text-[16px]"
        >
          Complete onboarding
        </button>
        <p className="text-[13px] text-grey measure">
          What you certify here is checked against our records and may be audited. False
          certification is grounds for permanent removal.
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-[14px] font-semibold">
      {label}
      {required && <span aria-hidden="true"> *</span>}
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-normal"
      />
    </label>
  );
}

function CheckField({ name, required = false, children }: { name: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex items-start gap-3 text-[14px]">
      <input type="checkbox" name={name} required={required} className="mt-1 w-4 h-4 accent-[#111111]" />
      <span className="measure">{children}</span>
    </label>
  );
}
