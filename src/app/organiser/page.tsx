"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { EVENTS } from "@/lib/events";
import { CATEGORIES, categoryBySlug } from "@/lib/categories";
import { useApp } from "@/lib/store";
import { formatDate, formatPrice, deadlineFlag, daysUntil } from "@/lib/format";
import { eventAgeBadge } from "@/lib/age";
import { hashString } from "@/components/CardImage";

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

export default function OrganiserPage() {
  const { ready, organiserSignedIn, setOrganiserSignedIn } = useApp();

  if (!ready) return null;

  if (!organiserSignedIn) {
    return (
      <div className="max-w-[640px] mx-auto px-6 py-16">
        <h1 className="text-[28px] lg:text-[40px]">Organiser dashboard</h1>
        <p className="mt-3 text-grey measure">
          List events free, reach 13–18 year olds who are actually looking, and get tools that
          write listings with you and catch age-band mistakes before they cost you attendees.
        </p>
        <div className="card mt-8 p-6">
          <h2 className="text-[22px]">Sign in</h2>
          <p className="mt-1 text-[13px] text-grey">
            This demo signs you in as a sample organiser. In production this is real
            authentication — every organiser tool checks it before doing anything.
          </p>
          <button
            type="button"
            onClick={() => setOrganiserSignedIn(true)}
            className="mt-4 min-h-[48px] px-6 rounded-full bg-ink text-paper font-display font-semibold"
          >
            Sign in as demo organiser
          </button>
          <p className="mt-3 text-[13px] text-grey">
            New here?{" "}
            <Link href="/organiser/onboarding" className="underline text-ink">
              Set up your organisation
            </Link>{" "}
            — ten minutes, including the safeguarding self-certification.{" "}
            <Link href="/for-organisers" className="underline text-ink">
              See pricing
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  return <Dashboard onSignOut={() => setOrganiserSignedIn(false)} />;
}

// The demo organiser "owns" a slice of the seed listings
const MY_EVENTS = EVENTS.slice(0, 6);

function fakeMetric(slug: string, salt: string, min: number, max: number): number {
  return min + (hashString(`${slug}-${salt}`) % (max - min));
}

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[28px] lg:text-[40px]">Your events</h1>
        <button type="button" onClick={onSignOut} className="text-[14px] underline text-grey">
          Sign out
        </button>
      </div>

      <StatsRow />
      <ListingsTable />
      <PendingListings />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <ListingAssistant />
        <div className="grid gap-8 content-start">
          <BalanceMonitor />
          <EligibilityChecker />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <PricingGuidance />
        <PerformanceSummary />
      </div>
    </div>
  );
}

function StatsRow() {
  const stats = useMemo(() => {
    const views = MY_EVENTS.reduce((s, e) => s + fakeMetric(e.slug, "views", 220, 1400), 0);
    const saves = MY_EVENTS.reduce((s, e) => s + fakeMetric(e.slug, "saves", 18, 160), 0);
    const shares = MY_EVENTS.reduce((s, e) => s + fakeMetric(e.slug, "shares", 6, 70), 0);
    return [
      { label: "Live listings", value: String(MY_EVENTS.length), note: "all approved" },
      { label: "Views, 30 days", value: views.toLocaleString("en-GB"), note: "60% from shared links" },
      { label: "Saves", value: saves.toLocaleString("en-GB"), note: `${Math.round((saves / views) * 100)}% of views` },
      { label: "Shares", value: shares.toLocaleString("en-GB"), note: "mostly one-to-one" },
    ];
  }, []);

  return (
    <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="card p-5">
          <p className="text-[12px] uppercase tracking-[0.04em] text-grey">{s.label}</p>
          <p className="mt-1 font-display font-bold text-[28px] leading-none">{s.value}</p>
          <p className="mt-1 text-[12px] text-grey">{s.note}</p>
        </div>
      ))}
    </div>
  );
}

function ListingsTable() {
  return (
    <section className="card mt-6 p-6 overflow-hidden" aria-labelledby="listings-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="listings-heading" className="text-[22px]">
          Live listings
        </h2>
        <span className="text-[13px] text-grey">Publishing and editing are disabled in this demo</span>
      </div>
      <div className="mt-4 overflow-x-auto -mx-6 px-6">
        <table className="w-full text-[14px] min-w-[720px]">
          <thead>
            <tr className="text-left text-grey border-b border-line text-[12px] uppercase tracking-[0.04em]">
              <th className="py-2 pr-4 font-medium">Event</th>
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Age</th>
              <th className="py-2 pr-4 font-medium">Price</th>
              <th className="py-2 pr-4 font-medium">Views</th>
              <th className="py-2 pr-4 font-medium">Saves</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {MY_EVENTS.map((e) => {
              const flag = deadlineFlag(e.applicationDeadline);
              return (
                <tr key={e.id} className="border-b border-line last:border-0 align-top">
                  <td className="py-3 pr-4">
                    <p className="font-medium leading-tight">{e.title}</p>
                    {flag && <p className="mt-0.5 text-[12px] text-coral-deep font-medium">{flag}</p>}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">{formatDate(e.date)}</td>
                  <td className="py-3 pr-4">
                    <span className="pill bg-ink text-paper px-2 py-0.5">{eventAgeBadge(e)}</span>
                  </td>
                  <td className="py-3 pr-4">{formatPrice(e.price)}</td>
                  <td className="py-3 pr-4">{fakeMetric(e.slug, "views", 220, 1400).toLocaleString("en-GB")}</td>
                  <td className="py-3 pr-4">{fakeMetric(e.slug, "saves", 18, 160)}</td>
                  <td className="py-3">
                    <span className={`pill px-2.5 py-0.5 ${daysUntil(e.date) >= 0 ? "bg-signal text-ink" : "bg-line text-grey"}`}>
                      {daysUntil(e.date) >= 0 ? "Live" : "Past"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PendingListings() {
  const { pendingListings } = useApp();
  if (pendingListings.length === 0) return null;
  return (
    <section className="card mt-6 p-6" aria-labelledby="pending-heading">
      <h2 id="pending-heading" className="text-[22px]">
        Awaiting review
      </h2>
      <p className="mt-1 text-[13px] text-grey measure">
        Not publicly visible. An onTrack reviewer checks every listing — and may edit it for
        clarity, age accuracy and safeguarding — before publication.
      </p>
      <ul className="mt-4 space-y-4">
        {pendingListings.map((l) => (
          <li key={l.id} className="border-b border-line pb-4 last:border-0">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-[15px]">{l.title}</p>
              <span className="pill bg-line text-ink px-2.5 py-0.5 shrink-0">Pending</span>
            </div>
            <p className="text-[13px] text-grey">
              {l.category} · {l.intent} · suggested age {l.suggestedAgeBand}
              {l.deadline ? ` · apply by ${l.deadline}` : ""}
            </p>
            {/* Audit trail — who did what, when. TODO: persist server-side;
                local state is demo-only evidence of the workflow. */}
            <ol className="mt-2 text-[12px] text-grey space-y-0.5">
              {l.audit.map((a, i) => (
                <li key={i}>
                  {new Date(a.at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}{" "}
                  — {a.by}: {a.action}
                  {a.detail ? ` (${a.detail})` : ""}
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ListingAssistant() {
  const { addPendingListing } = useApp();
  const [rough, setRough] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [previous, setPrevious] = useState<Draft | null>(null);
  const [manual, setManual] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deadline, setDeadline] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitForReview = () => {
    if (!draft) return;
    addPendingListing({
      title: draft.title,
      description: draft.description,
      category: draft.category,
      intent: draft.intent,
      suggestedAgeBand: draft.suggestedAgeBand,
      deadline: deadline || undefined,
    });
    setSubmitted(true);
    setDraft(null);
    setPrevious(null);
    setRough("");
    setDeadline("");
  };

  const generate = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/organiser/assist", {
        method: "POST",
        headers: { "content-type": "application/json", "x-demo-organiser": "true" },
        body: JSON.stringify({ rough }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "That didn’t work — try again.");
        return;
      }
      setPrevious(draft);
      setDraft(data.draft as Draft);
    } catch {
      setError("That didn’t work — check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card p-6" aria-labelledby="assistant-heading">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 id="assistant-heading" className="text-[22px]">
          Listing assistant
        </h2>
        <button type="button" className="text-[13px] underline text-grey" onClick={() => setManual(!manual)}>
          {manual ? "Use the assistant" : "Write it manually instead"}
        </button>
      </div>

      {submitted && (
        <div className="card mt-4 p-4 border-ink" role="status">
          <p className="text-[14px] font-medium">Submitted for review.</p>
          <p className="mt-1 text-[13px] text-grey measure">
            onTrack reviews and publishes every listing. We may edit for clarity, age accuracy
            and safeguarding before it goes live. You’ll see it under “Awaiting review” below.
          </p>
        </div>
      )}

      {manual ? (
        <ManualListingForm />
      ) : (
        <>
          <label htmlFor="rough" className="mt-3 block text-[14px] text-grey">
            Describe your event roughly — a sentence or a paragraph, however it comes out.
          </label>
          <textarea
            id="rough"
            value={rough}
            onChange={(e) => setRough(e.target.value)}
            rows={4}
            className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-[14px]"
            placeholder="e.g. friday night football under lights at the leisure centre, all welcome, £2, bar for parents"
          />
          <button
            type="button"
            onClick={generate}
            disabled={busy || rough.trim().length < 10}
            className="mt-3 min-h-[44px] px-6 rounded-full bg-ink text-paper font-medium text-[14px] disabled:opacity-40"
          >
            {busy ? "Drafting…" : draft ? "Redraft" : "Draft the listing"}
          </button>
          {error && <p className="mt-2 text-[13px] text-coral-deep">{error}</p>}

          {draft && (
            <div className="mt-5 border-t border-line pt-5">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="pill bg-line text-ink px-2.5 py-1">Draft — review before publishing</span>
                {previous && (
                  <button
                    type="button"
                    className="text-[13px] underline"
                    onClick={() => {
                      setDraft(previous);
                      setPrevious(null);
                    }}
                  >
                    Undo — back to previous draft
                  </button>
                )}
              </div>

              {draft.warnings.map((w, i) => (
                <p key={i} className="mt-3 text-[13px] text-coral-deep font-medium">
                  ⚠ {w}
                </p>
              ))}

              <div className="mt-4 grid gap-3">
                <EditableField
                  label={`Title (${draft.title.length}/60)`}
                  value={draft.title}
                  onChange={(v) => setDraft({ ...draft, title: v.slice(0, 60) })}
                />
                <label className="text-[13px] font-semibold">
                  Description
                  <textarea
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    rows={6}
                    className="mt-1 w-full rounded-xl border border-line bg-white p-3 text-[14px] font-normal"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-[13px] font-semibold">
                    Category
                    <select
                      value={draft.category}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                      className="mt-1 w-full h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-normal"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-[13px] font-semibold">
                    Intent tag
                    <select
                      value={draft.intent}
                      onChange={(e) => setDraft({ ...draft, intent: e.target.value as Draft["intent"] })}
                      className="mt-1 w-full h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-normal"
                    >
                      <option value="fun">Fun</option>
                      <option value="useful">Useful</option>
                      <option value="both">Both</option>
                    </select>
                  </label>
                </div>
                <EditableField
                  label="Suggested age band"
                  value={draft.suggestedAgeBand}
                  onChange={(v) => setDraft({ ...draft, suggestedAgeBand: v })}
                />
                <EditableField
                  label="Tags"
                  value={draft.tags.join(", ")}
                  onChange={(v) => setDraft({ ...draft, tags: v.split(",").map((t) => t.trim()).filter(Boolean) })}
                />
                {draft.needsDeadline && (
                  <label className="text-[13px] font-semibold">
                    Application or booking deadline{" "}
                    <span className="font-normal text-grey">
                      — separate from the event date; it’s what people miss
                    </span>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="mt-1 block h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-normal"
                    />
                  </label>
                )}
              </div>
              <button
                type="button"
                onClick={submitForReview}
                className="mt-4 min-h-[48px] px-6 rounded-full bg-signal text-ink border border-ink font-display font-semibold"
              >
                Submit for review
              </button>
              <p className="mt-2 text-[12px] text-grey measure">
                onTrack reviews and publishes every listing. We may edit for clarity, age
                accuracy and safeguarding before it goes live. Nothing you submit is publicly
                visible until a reviewer publishes it.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function EditableField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="text-[13px] font-semibold">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-normal"
      />
    </label>
  );
}

function ManualListingForm() {
  const { addPendingListing } = useApp();
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    if (!title) return;
    addPendingListing({
      title: title.slice(0, 60),
      description: String(data.get("description") ?? ""),
      category: String(data.get("category") ?? ""),
      intent: String(data.get("intent") ?? "both").toLowerCase(),
      suggestedAgeBand: `${data.get("minAge") || "13"}${data.get("maxAge") ? `–${data.get("maxAge")}` : "+"}`,
      deadline: String(data.get("deadline") ?? "") || undefined,
    });
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <form className="mt-4 grid gap-3" onSubmit={submit}>
      <p className="text-[13px] text-grey">
        The manual path — every field, no assistant. Same review before anything publishes.
      </p>
      {sent && (
        <div className="card p-4 border-ink" role="status">
          <p className="text-[14px] font-medium">Submitted for review.</p>
          <p className="mt-1 text-[13px] text-grey measure">
            onTrack reviews and publishes every listing. We may edit for clarity, age accuracy
            and safeguarding before it goes live.
          </p>
        </div>
      )}
      <EditableStatic label="Title (max 60 characters)" name="title" required />
      <label className="text-[13px] font-semibold">
        Description
        <textarea
          name="description"
          rows={5}
          className="mt-1 w-full rounded-xl border border-line bg-white p-3 text-[14px] font-normal"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-[13px] font-semibold">
          Category
          <select name="category" className="mt-1 w-full h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-normal">
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[13px] font-semibold">
          Intent tag
          <select name="intent" className="mt-1 w-full h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-normal">
            <option>Fun</option>
            <option>Useful</option>
            <option>Both</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-[13px] font-semibold">
          Event date
          <input type="date" name="eventDate" className="mt-1 w-full h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-normal" />
        </label>
        <label className="text-[13px] font-semibold">
          Application deadline
          <input type="date" name="deadline" className="mt-1 w-full h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-normal" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <EditableStatic label="Minimum age" name="minAge" />
        <EditableStatic label="Maximum age (optional)" name="maxAge" />
      </div>
      <button
        type="submit"
        className="min-h-[48px] px-6 rounded-full bg-signal text-ink border border-ink font-display font-semibold"
      >
        Submit for review
      </button>
      <p className="text-[12px] text-grey measure">
        onTrack reviews and publishes every listing. We may edit for clarity, age accuracy and
        safeguarding before it goes live.
      </p>
    </form>
  );
}

function EditableStatic({ label, name, required = false }: { label: string; name?: string; required?: boolean }) {
  return (
    <label className="text-[13px] font-semibold">
      {label}
      <input
        name={name}
        required={required}
        className="mt-1 w-full h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-normal"
      />
    </label>
  );
}

/* ------------------------------------------------------------------ */

function BalanceMonitor() {
  const { fun, useful, both, funShare, usefulShare, flagged } = useMemo(() => {
    const fun = EVENTS.filter((e) => e.intent === "fun").length;
    const useful = EVENTS.filter((e) => e.intent === "useful").length;
    const both = EVENTS.filter((e) => e.intent === "both").length;
    const total = EVENTS.length;
    // "both" counts toward each side — that's the point of it
    const funShare = (fun + both) / total;
    const usefulShare = (useful + both) / total;
    return { fun, useful, both, funShare, usefulShare, flagged: funShare < 0.35 || usefulShare < 0.35 };
  }, []);

  return (
    <section className="card p-6" aria-labelledby="balance-heading">
      <h2 id="balance-heading" className="text-[22px]">
        Balance monitor
      </h2>
      <p className="mt-1 text-[13px] text-grey measure">
        The live feed must stay a real mix of fun and useful — it’s a product requirement, not an
        accident of who signs up. Either side under ~35% flags to the team.
      </p>
      <div className="mt-4 space-y-3">
        <Bar label={`Fun (${fun} + ${both} both)`} share={funShare} />
        <Bar label={`Useful (${useful} + ${both} both)`} share={usefulShare} />
      </div>
      <p className={`mt-3 text-[14px] font-medium ${flagged ? "text-coral-deep" : ""}`}>
        {flagged
          ? "⚠ The mix has drifted — one side is under 35% of the local feed."
          : "East London: the mix is healthy."}
      </p>
    </section>
  );
}

function Bar({ label, share }: { label: string; share: number }) {
  const pct = Math.round(share * 100);
  return (
    <div>
      <div className="flex justify-between text-[13px]">
        <span>{label}</span>
        <span className="font-semibold">{pct}%</span>
      </div>
      <div className="mt-1 h-3 rounded-full bg-line overflow-hidden">
        <div className="h-full bg-ink rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function EligibilityChecker() {
  const issues = useMemo(() => {
    // Flags listings whose stated age band contradicts the description —
    // organisers cause the age-mismatch problem; this catches it at source.
    const found: { title: string; note: string }[] = [];
    for (const e of EVENTS) {
      const text = e.description.toLowerCase();
      const adultSignals = /\b(bar|licensed|alcohol|club night|bring id)\b/.test(text);
      if (adultSignals && e.minAge < 18) {
        found.push({
          title: e.title,
          note: `Description mentions ID/alcohol but the band is ${eventAgeBadge(e)} — check which is right.`,
        });
      }
      const under18Signals = /\byear (7|8|9|10|11)\b|school students only/.test(text);
      if (under18Signals && (e.maxAge === undefined || e.maxAge > 18)) {
        found.push({
          title: e.title,
          note: `Description sounds school-age but the band allows over-18s — add a maximum age?`,
        });
      }
    }
    return found;
  }, []);

  return (
    <section className="card p-6" aria-labelledby="eligibility-heading">
      <h2 id="eligibility-heading" className="text-[22px]">
        Eligibility checker
      </h2>
      <p className="mt-1 text-[13px] text-grey measure">
        Scans your live listings for age bands that contradict their descriptions.
      </p>
      {issues.length === 0 ? (
        <p className="mt-4 text-[14px]">No contradictions found across your live listings.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {issues.map((i, idx) => (
            <li key={idx} className="text-[14px]">
              <span className="font-medium">{i.title}</span>
              <span className="block text-[13px] text-coral-deep">{i.note}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */

function PricingGuidance() {
  const rows = useMemo(() => {
    return CATEGORIES.map((c) => {
      const inCat = EVENTS.filter((e) => e.category === c.slug);
      if (inCat.length === 0) return null;
      const free = inCat.filter((e) => e.price === 0).length;
      const paid = inCat.filter((e) => e.price > 0);
      const median = paid.length
        ? paid.map((e) => e.price).sort((a, b) => a - b)[Math.floor(paid.length / 2)]
        : 0;
      return { name: c.name, count: inCat.length, freeShare: free / inCat.length, median };
    }).filter(Boolean) as { name: string; count: number; freeShare: number; median: number }[];
  }, []);

  return (
    <section className="card p-6" aria-labelledby="pricing-heading">
      <h2 id="pricing-heading" className="text-[22px]">
        Pricing guidance
      </h2>
      <p className="mt-1 text-[13px] text-grey measure">
        Similar events by category in your area. Most of this audience spends nothing — where the
        data supports free or low-cost, go free: attendance follows.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-grey border-b border-line">
              <th className="py-2 pr-4 font-medium">Category</th>
              <th className="py-2 pr-4 font-medium">Listings</th>
              <th className="py-2 pr-4 font-medium">Free</th>
              <th className="py-2 font-medium">Median paid</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-b border-line last:border-0">
                <td className="py-2 pr-4">{r.name}</td>
                <td className="py-2 pr-4">{r.count}</td>
                <td className="py-2 pr-4">{Math.round(r.freeShare * 100)}%</td>
                <td className="py-2">{r.median === 0 ? "—" : formatPrice(r.median)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PerformanceSummary() {
  const nextClash = useMemo(() => {
    const sorted = [...EVENTS].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (let i = 1; i < sorted.length; i++) {
      const a = sorted[i - 1];
      const b = sorted[i];
      if (formatDate(a.date) === formatDate(b.date) && a.category === b.category) {
        return { a: a.title, b: b.title, date: formatDate(a.date) };
      }
    }
    return null;
  }, []);

  return (
    <section className="card p-6" aria-labelledby="performance-heading">
      <h2 id="performance-heading" className="text-[22px]">
        Performance &amp; timing
      </h2>
      <div className="mt-4 space-y-4 text-[14px] measure">
        <div>
          <h3 className="text-[15px] font-semibold">Last 30 days, in plain English</h3>
          <p className="mt-1 text-grey">
            Views climbed steadily until your application deadline, then dropped off a cliff — 60%
            of clicks came from shared links, not search. Most drop-off happens on listings with no
            journey-time information.
          </p>
        </div>
        <div>
          <h3 className="text-[15px] font-semibold">Three things to try</h3>
          <ul className="mt-1 list-disc pl-5 text-grey space-y-1">
            <li>Add public-transport journey time to your two listings missing it.</li>
            <li>Your Saturday events outperform weekdays 3:1 — move the workshop series.</li>
            <li>GCSE results day is in your next window — avoid the morning, evenings are fine.</li>
          </ul>
        </div>
        {nextClash && (
          <p className="text-[13px] text-coral-deep">
            ⚠ Timing clash: “{nextClash.a}” and “{nextClash.b}” are both {nextClash.date} in the
            same category.
          </p>
        )}
        <p className="text-[12px] text-grey">
          Image alt text is generated on upload and editable in each listing’s media panel.
        </p>
      </div>
    </section>
  );
}
