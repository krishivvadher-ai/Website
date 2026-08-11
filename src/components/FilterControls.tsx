"use client";

import React from "react";
import Link from "next/link";
import type { Filters, PriceBucket } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { useApp } from "@/lib/store";
import { profileAgeRange } from "@/lib/age";

const PRICE_OPTIONS: { value: PriceBucket; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "under10", label: "Under £10" },
  { value: "10to25", label: "£10–25" },
  { value: "over25", label: "£25+" },
];

const DATE_OPTIONS: { value: Filters["dateRange"]; label: string }[] = [
  { value: "any", label: "Any time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`pill min-h-[44px] px-4 py-2 border transition-colors duration-150 ${
        active ? "bg-signal text-ink border-ink font-semibold" : "bg-white text-ink border-line hover:border-grey"
      }`}
    >
      {children}
    </button>
  );
}

/** The full filter set — rendered in the desktop sidebar and the mobile sheet. */
export function FilterControls({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const { profile } = useApp();
  const range = profileAgeRange(profile);

  const toggleCategory = (slug: string) =>
    onChange({
      ...filters,
      categories: filters.categories.includes(slug)
        ? filters.categories.filter((c) => c !== slug)
        : [...filters.categories, slug],
    });

  const togglePrice = (b: PriceBucket) =>
    onChange({
      ...filters,
      price: filters.price.includes(b) ? filters.price.filter((p) => p !== b) : [...filters.price, b],
    });

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="filter-age">
        <h3 id="filter-age" className="text-[14px] font-semibold mb-2">
          Age
        </h3>
        {range ? (
          <p className="text-[13px] text-grey measure">
            Showing events open to {range[0] === range[1] ? `age ${range[0]}` : `ages ${range[0]}–${range[1]}`}.{" "}
            <Link href="/you" className="underline text-ink">
              Change in your profile
            </Link>
          </p>
        ) : (
          <p className="text-[13px] text-grey measure">
            <Link href="/you" className="underline text-ink">
              Set your age
            </Link>{" "}
            and everything you can’t attend disappears from the feed.
          </p>
        )}
      </section>

      <section aria-labelledby="filter-price">
        <h3 id="filter-price" className="text-[14px] font-semibold mb-2">
          Price
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRICE_OPTIONS.map((opt) => (
            <Chip key={opt.value} active={filters.price.includes(opt.value)} onClick={() => togglePrice(opt.value)}>
              {opt.label}
            </Chip>
          ))}
        </div>
      </section>

      <section aria-labelledby="filter-distance">
        <h3 id="filter-distance" className="text-[14px] font-semibold mb-2">
          Distance
        </h3>
        <label className="block text-[13px] text-grey mb-1" htmlFor="distance-slider">
          Within {filters.distanceMiles} miles
        </label>
        <input
          id="distance-slider"
          type="range"
          min={1}
          max={25}
          step={1}
          value={filters.distanceMiles}
          onChange={(e) => onChange({ ...filters, distanceMiles: Number(e.target.value) })}
          className="w-full accent-[#111111]"
        />
      </section>

      <section aria-labelledby="filter-date">
        <h3 id="filter-date" className="text-[14px] font-semibold mb-2">
          Date
        </h3>
        <div className="flex flex-wrap gap-2">
          {DATE_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              active={filters.dateRange === opt.value}
              onClick={() => onChange({ ...filters, dateRange: opt.value })}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </section>

      <section aria-labelledby="filter-deadline">
        <h3 id="filter-deadline" className="text-[14px] font-semibold mb-2">
          Deadline
        </h3>
        <Chip active={filters.stillOpen} onClick={() => onChange({ ...filters, stillOpen: !filters.stillOpen })}>
          Still open
        </Chip>
        <p className="mt-1 text-[12px] text-grey">Hide anything whose applications have closed.</p>
      </section>

      <section aria-labelledby="filter-category">
        <h3 id="filter-category" className="text-[14px] font-semibold mb-2">
          Category
        </h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Chip key={c.slug} active={filters.categories.includes(c.slug)} onClick={() => toggleCategory(c.slug)}>
              {c.name}
            </Chip>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Horizontally scrolling chip row for mobile; opens the full sheet. */
export function MobileChipRow({
  filters,
  onChange,
  onOpenSheet,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onOpenSheet: () => void;
}) {
  const activeCount =
    filters.categories.length +
    filters.price.length +
    (filters.dateRange !== "any" ? 1 : 0) +
    (filters.stillOpen ? 1 : 0) +
    (filters.distanceMiles !== 25 ? 1 : 0);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-6 px-6 [scrollbar-width:none]">
      <button
        type="button"
        onClick={onOpenSheet}
        className="pill min-h-[44px] shrink-0 px-4 py-2 border border-ink bg-white font-semibold"
      >
        Filters{activeCount > 0 ? ` (${activeCount})` : ""}
      </button>
      {/* Free is a prominent one-tap toggle — most users spend nothing */}
      <Chip
        active={filters.price.includes("free")}
        onClick={() =>
          onChange({
            ...filters,
            price: filters.price.includes("free")
              ? filters.price.filter((p) => p !== "free")
              : [...filters.price, "free"],
          })
        }
      >
        Free
      </Chip>
      <Chip active={filters.stillOpen} onClick={() => onChange({ ...filters, stillOpen: !filters.stillOpen })}>
        Still open
      </Chip>
      {CATEGORIES.map((c) => (
        <span key={c.slug} className="shrink-0">
          <Chip
            active={filters.categories.includes(c.slug)}
            onClick={() =>
              onChange({
                ...filters,
                categories: filters.categories.includes(c.slug)
                  ? filters.categories.filter((x) => x !== c.slug)
                  : [...filters.categories, c.slug],
              })
            }
          >
            {c.name}
          </Chip>
        </span>
      ))}
    </div>
  );
}

/** Full-height mobile bottom sheet with a sticky results button. */
export function FilterSheet({
  open,
  onClose,
  filters,
  onChange,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  onChange: (f: Filters) => void;
  resultCount: number;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Filters">
      <button type="button" className="absolute inset-0 bg-ink/40" onClick={onClose} aria-label="Close filters" />
      <div className="absolute inset-x-0 bottom-0 top-10 bg-paper rounded-t-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="text-[20px]">Filters</h2>
          <button type="button" onClick={onClose} className="w-11 h-11 flex items-center justify-center" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <FilterControls filters={filters} onChange={onChange} />
        </div>
        <div className="p-4 border-t border-line bg-paper">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[48px] rounded-full bg-signal text-ink font-display font-semibold text-[16px] border border-ink"
          >
            Show {resultCount} event{resultCount === 1 ? "" : "s"}
          </button>
        </div>
      </div>
    </div>
  );
}
