"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { EVENTS } from "@/lib/events";
import { CATEGORIES } from "@/lib/categories";
import { useApp } from "@/lib/store";
import { formatDate, formatPrice, deadlineFlag, daysUntil } from "@/lib/format";
import { eventAgeBadge } from "@/lib/age";
import { hashString } from "@/components/CardImage";

// The organiser dashboard — the £29/month product. Six tabs: overview,
// listings, submit, audience, safeguarding, plan. All analytics shown are
// aggregate-only: onTrack never exposes an individual young person to an
// organiser.

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

// The demo organiser "owns" a slice of the seed listings
const MY_EVENTS = EVENTS.slice(0, 6);

function fakeMetric(slug: string, salt: string, min: number, max: number): number {
  return min + (hashString(`${slug}-${salt}`) % (max - min));
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "listings", label: "Listings" },
  { id: "submit", label: "Submit a listing" },
  { id: "audience", label: "Audience" },
  { id: "safeguarding", label: "Safeguarding" },
  { id: "plan", label: "Plan & billing" },
] as const;

type TabId = (typeof TABS)[number]["id"];

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
            This demo signs you in as Poplar Union. In production this is real authentication —
            every organiser tool checks it before doing anything.
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

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="text-[28px] lg:text-[40px]">Poplar Union</h1>
        <span className="pill bg-signal text-ink border border-ink px-3 py-1 font-semibold">Boost · £29/mo</span>
        <span className="pill bg-ink text-paper px-3 py-1">Safeguarding verified</span>
        <button type="button" onClick={onSignOut} className="ml-auto text-[14px] underline text-grey">
          Sign out
        </button>
      </div>

      <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-line [scrollbar-width:none]" aria-label="Dashboard sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
            className={`shrink-0 min-h-[48px] px-4 text-[14px] font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? "border-ink text-ink" : "border-transparent text-grey hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "overview" && <OverviewTab goTo={setTab} />}
        {tab === "listings" && <ListingsTab />}
        {tab === "submit" && <SubmitTab />}
        {tab === "audience" && <AudienceTab />}
        {tab === "safeguarding" && <SafeguardingTab />}
        {tab === "plan" && <PlanTab />}
      </div>
    </div>
  );
}

/* ================================================================ overview */

function OverviewTab({ goTo }: { goTo: (t: TabId) => void }) {
  const { pendingListings } = useApp();
  const closingSoon = MY_EVENTS.filter(
    (e) => e.applicationDeadline && daysUntil(e.applicationDeadline) >= 0 && daysUntil(e.applicationDeadline) <= 7
  );

  return (
    <div className="grid gap-6">
      <StatsRow />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
        <ViewsChart />
        <div className="grid gap-6">
          <section className="card p-5" aria-labelledby="closing-heading">
            <h2 id="closing-heading" className="text-[18px]">
              Closing soon
            </h2>
            {closingSoon.length === 0 ? (
              <p className="mt-2 text-[13px] text-grey">No application deadlines in the next 7 days.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {closingSoon.map((e) => (
                  <li key={e.id} className="text-[14px]">
                    <p className="font-medium leading-tight">{e.title}</p>
                    <p className="text-[12px] text-coral-deep font-medium">{deadlineFlag(e.applicationDeadline)}</p>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-[12px] text-grey">
              Boost sends a deadline push to everyone who saved these — automatically.
            </p>
          </section>

          <section className="card p-5" aria-labelledby="queue-heading">
            <h2 id="queue-heading" className="text-[18px]">
              Review queue
            </h2>
            <p className="mt-2 text-[14px]">
              {pendingListings.length === 0
                ? "Nothing awaiting review."
                : `${pendingListings.length} listing${pendingListings.length === 1 ? "" : "s"} awaiting onTrack review.`}
            </p>
            <button type="button" onClick={() => goTo("submit")} className="mt-2 text-[13px] underline">
              Submit a new listing
            </button>
          </section>
        </div>
      </div>

      <BalanceMonitor />
    </div>
  );
}

function StatsRow() {
  const stats = useMemo(() => {
    const views = MY_EVENTS.reduce((s, e) => s + fakeMetric(e.slug, "views", 220, 1400), 0);
    const saves = MY_EVENTS.reduce((s, e) => s + fakeMetric(e.slug, "saves", 18, 160), 0);
    const booked = MY_EVENTS.reduce((s, e) => s + fakeMetric(e.slug, "book", 6, 80), 0);
    const shares = MY_EVENTS.reduce((s, e) => s + fakeMetric(e.slug, "shares", 6, 70), 0);
    return [
      { label: "Views, 30 days", value: views.toLocaleString("en-GB"), note: "60% from shared links" },
      { label: "Saves", value: saves.toLocaleString("en-GB"), note: `${Math.round((saves / views) * 100)}% of views` },
      { label: "Bookings", value: booked.toLocaleString("en-GB"), note: `${Math.round((booked / saves) * 100)}% of saves` },
      { label: "Shares", value: shares.toLocaleString("en-GB"), note: "mostly one-to-one" },
    ];
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

function ViewsChart() {
  // Deterministic 30-day view series for the demo
  const series = useMemo(
    () => Array.from({ length: 30 }, (_, i) => 40 + (hashString(`views-day-${i}`) % 90) + (i > 22 ? 60 : 0)),
    []
  );
  const max = Math.max(...series);

  return (
    <section className="card p-5" aria-labelledby="views-heading">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="views-heading" className="text-[18px]">
          Views, last 30 days
        </h2>
        <span className="text-[12px] text-grey">The step up is your deadline push</span>
      </div>
      <div className="mt-4 flex items-end gap-[3px] h-[160px]" role="img" aria-label="Daily views over the last 30 days, rising towards the end">
        {series.map((v, i) => (
          <span
            key={i}
            className={`flex-1 rounded-t-[3px] ${i > 22 ? "bg-ink" : "bg-line"}`}
            style={{ height: `${(v / max) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-grey">
        <span>30 days ago</span>
        <span>today</span>
      </div>
    </section>
  );
}

/* ================================================================ listings */

function ListingsTab() {
  return (
    <div className="grid gap-6">
      <ListingsTable />
      <PendingListings alwaysShow />
    </div>
  );
}

function ListingsTable() {
  return (
    <section className="card p-6 overflow-hidden" aria-labelledby="listings-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="listings-heading" className="text-[22px]">
          Live listings
        </h2>
        <span className="text-[13px] text-grey">Editing is disabled in this demo</span>
      </div>
      <div className="mt-4 overflow-x-auto -mx-6 px-6">
        <table className="w-full text-[14px] min-w-[760px]">
          <thead>
            <tr className="text-left text-grey border-b border-line text-[12px] uppercase tracking-[0.04em]">
              <th className="py-2 pr-4 font-medium">Event</th>
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Age</th>
              <th className="py-2 pr-4 font-medium">Price</th>
              <th className="py-2 pr-4 font-medium">Views</th>
              <th className="py-2 pr-4 font-medium">Saves</th>
              <th className="py-2 pr-4 font-medium">Bookings</th>
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
                  <td className="py-3 pr-4">{fakeMetric(e.slug, "book", 6, 80)}</td>
                  <td className="py-3">
                    <span className={`pill px-2.5 py-0.5 ${daysUntil(e.date) >= 0 ? "bg-signal text-ink" : "bg-line text-grey"}`}>
                      {daysUntil(e.date) >= 0 ? "Published" : "Past"}
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

function PendingListings({ alwaysShow = false }: { alwaysShow?: boolean }) {
  const { pendingListings } = useApp();
  if (pendingListings.length === 0 && !alwaysShow) return null;
  return (
    <section className="card p-6" aria-labelledby="pending-heading">
      <h2 id="pending-heading" className="text-[22px]">
        Awaiting review
      </h2>
      <p className="mt-1 text-[13px] text-grey measure">
        Not publicly visible. An onTrack reviewer checks every listing — and may edit it for
        clarity, age accuracy and safeguarding — before publication.
      </p>
      {pendingListings.length === 0 ? (
        <p className="mt-3 text-[14px]">Nothing awaiting review.</p>
      ) : (
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
      )}
    </section>
  );
}

/* ================================================================== submit */

function SubmitTab() {
  return (
    <div className="grid gap-8 lg:grid-cols-2 items-start">
      <ListingAssistant />
      <section className="card p-6" aria-labelledby="manual-heading">
        <h2 id="manual-heading" className="text-[22px]">
          Or write it yourself
        </h2>
        <ManualListingForm />
      </section>
    </div>
  );
}

function ListingAssistant() {
  const { addPendingListing } = useApp();
  const [rough, setRough] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [previous, setPrevious] = useState<Draft | null>(null);
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
    setSubmitted(false);
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
      <h2 id="assistant-heading" className="text-[22px]">
        Listing assistant
      </h2>
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

      {submitted && (
        <div className="card mt-4 p-4 border-ink" role="status">
          <p className="text-[14px] font-medium">Submitted for review.</p>
          <p className="mt-1 text-[13px] text-grey measure">
            onTrack reviews and publishes every listing. We may edit for clarity, age accuracy
            and safeguarding before it goes live. You’ll see it under Listings → Awaiting
            review.
          </p>
        </div>
      )}

      {draft && (
        <div className="mt-5 border-t border-line pt-5">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="pill bg-signal text-ink px-2.5 py-1 border border-ink">
              AI-generated — check every field
            </span>
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
                <span className="font-normal text-grey">— separate from the event date; it’s what people miss</span>
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
            onTrack reviews and publishes every listing. We may edit for clarity, age accuracy
            and safeguarding before it goes live. Nothing you submit is publicly visible until a
            reviewer publishes it.
          </p>
        </div>
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
      <StaticField label="Title (max 60 characters)" name="title" required />
      <label className="text-[13px] font-semibold">
        Description
        <textarea name="description" rows={5} className="mt-1 w-full rounded-xl border border-line bg-white p-3 text-[14px] font-normal" />
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
        <StaticField label="Minimum age" name="minAge" />
        <StaticField label="Maximum age (optional)" name="maxAge" />
      </div>
      <button type="submit" className="min-h-[48px] px-6 rounded-full bg-signal text-ink border border-ink font-display font-semibold">
        Submit for review
      </button>
      <p className="text-[12px] text-grey measure">
        onTrack reviews and publishes every listing. We may edit for clarity, age accuracy and
        safeguarding before it goes live.
      </p>
    </form>
  );
}

function StaticField({ label, name, required = false }: { label: string; name?: string; required?: boolean }) {
  return (
    <label className="text-[13px] font-semibold">
      {label}
      <input name={name} required={required} className="mt-1 w-full h-11 rounded-xl border border-line bg-white px-3 text-[14px] font-normal" />
    </label>
  );
}

/* ================================================================ audience */

function HBar({ label, value, max, note }: { label: string; value: number; max: number; note?: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-[13px]">
        <span>{label}</span>
        <span className="font-semibold">
          {value.toLocaleString("en-GB")}
          {note ? <span className="font-normal text-grey"> {note}</span> : null}
        </span>
      </div>
      <div className="mt-1 h-3 rounded-full bg-line overflow-hidden">
        <div className="h-full bg-ink rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function AudienceTab() {
  const boroughs = ["Tower Hamlets", "Newham", "Hackney", "Waltham Forest", "Redbridge"];
  const boroughViews = boroughs.map((b) => ({ label: b, value: fakeMetric(b, "bviews", 180, 2400) }));
  const bands = [
    { label: "13–14", value: fakeMetric("band1", "a", 200, 900) },
    { label: "15–16", value: fakeMetric("band2", "a", 400, 1200) },
    { label: "17–18", value: fakeMetric("band3", "a", 300, 1100) },
  ];
  const sources = [
    { label: "Shared links", value: 60 },
    { label: "Browse & search", value: 26 },
    { label: "Map", value: 9 },
    { label: "Borough & school pages", value: 5 },
  ];
  const funnel = useMemo(() => {
    const views = MY_EVENTS.reduce((s, e) => s + fakeMetric(e.slug, "views", 220, 1400), 0);
    const saves = MY_EVENTS.reduce((s, e) => s + fakeMetric(e.slug, "saves", 18, 160), 0);
    const booked = MY_EVENTS.reduce((s, e) => s + fakeMetric(e.slug, "book", 6, 80), 0);
    return [
      { label: "Viewed a listing", value: views },
      { label: "Saved it", value: saves },
      { label: "Booked a place", value: booked },
    ];
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      <section className="card p-6" aria-labelledby="funnel-heading">
        <h2 id="funnel-heading" className="text-[22px]">
          From view to booking
        </h2>
        <div className="mt-4 space-y-3">
          {funnel.map((f) => (
            <HBar key={f.label} label={f.label} value={f.value} max={funnel[0].value} />
          ))}
        </div>
        <p className="mt-3 text-[12px] text-grey measure">
          Listings with a public-transport journey time convert roughly twice as well — add one
          to every listing.
        </p>
      </section>

      <section className="card p-6" aria-labelledby="borough-heading">
        <h2 id="borough-heading" className="text-[22px]">
          Views by borough
        </h2>
        <div className="mt-4 space-y-3">
          {boroughViews.map((b) => (
            <HBar key={b.label} label={b.label} value={b.value} max={Math.max(...boroughViews.map((x) => x.value))} />
          ))}
        </div>
      </section>

      <section className="card p-6" aria-labelledby="bands-heading">
        <h2 id="bands-heading" className="text-[22px]">
          Age band mix
        </h2>
        <div className="mt-4 space-y-3">
          {bands.map((b) => (
            <HBar key={b.label} label={b.label} value={b.value} max={Math.max(...bands.map((x) => x.value))} />
          ))}
        </div>
        <p className="mt-3 text-[12px] text-grey measure">
          Aggregate counts only. onTrack never shows an organiser any individual young person —
          no names, no profiles, no attendee lists.
        </p>
      </section>

      <section className="card p-6" aria-labelledby="sources-heading">
        <h2 id="sources-heading" className="text-[22px]">
          Where views come from
        </h2>
        <div className="mt-4 space-y-3">
          {sources.map((s) => (
            <HBar key={s.label} label={s.label} value={s.value} max={100} note="%" />
          ))}
        </div>
        <p className="mt-3 text-[12px] text-grey measure">
          Word of mouth is the channel: most views arrive from links shared in group chats.
          Story images (on every event page) are built for exactly that.
        </p>
      </section>
    </div>
  );
}

/* ============================================================ safeguarding */

function SafeguardingTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      <section className="card p-6 border-ink" aria-labelledby="verification-heading">
        <h2 id="verification-heading" className="text-[22px]">
          Verification status
        </h2>
        <p className="mt-2">
          <span className="pill bg-ink text-paper px-3 py-1">Safeguarding verified</span>
        </p>
        <ul className="mt-4 space-y-2 text-[14px]">
          {[
            ["Safeguarding policy", "Seen and checked · reviewed 12 May 2026"],
            ["Named safeguarding lead", "On file · contactable"],
            ["Enhanced DBS + barred list checks", "Evidence inspected · post-Sept-2026 scope"],
            ["Public liability insurance", "£5m · expires 31 Mar 2027"],
          ].map(([item, status]) => (
            <li key={item} className="flex items-start gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
                <path d="m5 12 5 5L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>
                <span className="font-medium">{item}</span>
                <span className="block text-[12px] text-grey">{status}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[12px] text-grey measure">
          We re-check annually and whenever anything is reported.{" "}
          <Link href="/verification" className="underline">
            What the badge does and doesn’t mean
          </Link>
          . Any safeguarding concern suspends listings immediately —{" "}
          <Link href="/organiser-terms#suspension" className="underline">
            organiser terms
          </Link>
          .
        </p>
      </section>

      <EligibilityChecker />
    </div>
  );
}

function EligibilityChecker() {
  const issues = useMemo(() => {
    // Flags listings whose stated age band contradicts the description —
    // organisers cause the age-mismatch problem; this catches it at source.
    const found: { title: string; note: string }[] = [];
    for (const e of MY_EVENTS) {
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
        Scans your live listings for age bands that contradict their descriptions — the users’
        second-biggest complaint, caught at source.
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

/* ==================================================================== plan */

function PlanTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 items-start">
      <section className="card p-6 border-ink" aria-labelledby="plan-heading">
        <h2 id="plan-heading" className="text-[22px]">
          Your plan: Boost
        </h2>
        <p className="mt-1 font-display font-bold text-[28px]">£29 / month</p>
        <ul className="mt-3 space-y-1.5 text-[14px]">
          <li>— Featured placement in browse</li>
          <li>— Deadline pushes to everyone who saved your events</li>
          <li>— Applicant analytics (the Audience tab)</li>
          <li>— Calendar sync</li>
          <li>— Safeguarding Verified badge (documents checked)</li>
        </ul>
        <div className="mt-4 pt-4 border-t border-line">
          <p className="text-[14px] font-medium">Need more than one venue?</p>
          <p className="text-[13px] text-grey measure">
            Partner (£149/month) covers up to 25 venues, API access and funder-ready impact
            reporting.
          </p>
          <Link
            href="/contact"
            className="mt-3 inline-flex items-center min-h-[44px] px-5 rounded-full border border-ink text-[14px] font-medium hover:bg-ink hover:text-paper transition-colors"
          >
            Talk to us about Partner
          </Link>
        </div>
        <p className="mt-4 text-[12px] text-grey">
          Cancel any time, effective at the end of the billing period. No onTrack fee is ever
          charged to a young person.
        </p>
      </section>

      <div className="grid gap-6">
        <section className="card p-6" aria-labelledby="invoices-heading">
          <h2 id="invoices-heading" className="text-[22px]">
            Invoices
          </h2>
          <table className="mt-3 w-full text-[14px]">
            <tbody>
              {["August 2026", "July 2026", "June 2026"].map((m) => (
                <tr key={m} className="border-b border-line last:border-0">
                  <td className="py-2">{m}</td>
                  <td className="py-2 text-grey">Boost</td>
                  <td className="py-2">£29.00</td>
                  <td className="py-2">
                    <span className="pill bg-line px-2.5 py-0.5">Paid</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[12px] text-grey">Demo data — billing is not live in this build.</p>
        </section>

        <PricingGuidance />
      </div>
    </div>
  );
}

function PricingGuidance() {
  const rows = useMemo(() => {
    return CATEGORIES.map((c) => {
      const inCat = EVENTS.filter((e) => e.category === c.slug);
      if (inCat.length === 0) return null;
      const free = inCat.filter((e) => e.price === 0).length;
      const paid = inCat.filter((e) => e.price > 0);
      const median = paid.length ? paid.map((e) => e.price).sort((a, b) => a - b)[Math.floor(paid.length / 2)] : 0;
      return { name: c.name, count: inCat.length, freeShare: free / inCat.length, median };
    }).filter(Boolean) as { name: string; count: number; freeShare: number; median: number }[];
  }, []);

  return (
    <section className="card p-6" aria-labelledby="pricing-heading">
      <h2 id="pricing-heading" className="text-[22px]">
        Pricing guidance
      </h2>
      <p className="mt-1 text-[13px] text-grey measure">
        Similar events by category in East London. Most of this audience spends nothing — where
        the data supports free or low-cost, go free: attendance follows.
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

/* ================================================================= balance */

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
      <div className="mt-4 space-y-3 max-w-[560px]">
        <HBar label={`Fun (${fun} + ${both} both)`} value={Math.round(funShare * 100)} max={100} note="%" />
        <HBar label={`Useful (${useful} + ${both} both)`} value={Math.round(usefulShare * 100)} max={100} note="%" />
      </div>
      <p className={`mt-3 text-[14px] font-medium ${flagged ? "text-coral-deep" : ""}`}>
        {flagged ? "⚠ The mix has drifted — one side is under 35% of the local feed." : "East London: the mix is healthy."}
      </p>
    </section>
  );
}
