"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { publishedEvents } from "@/lib/events";
import { DEFAULT_FILTERS, type Filters } from "@/lib/types";
import { applyFilters } from "@/lib/filter";
import { useApp } from "@/lib/store";
import { useIsDesktop } from "@/lib/useMediaQuery";
import { IntentToggle } from "@/components/IntentToggle";
import { FilterControls, FilterSheet, MobileChipRow } from "@/components/FilterControls";
import { EventCard, EventCardSkeleton } from "@/components/EventCard";
import { AgePrompt } from "@/components/AgePrompt";

export function BrowseClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const { ready, profile } = useApp();
  const isDesktop = useIsDesktop();
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS, query: initialQuery });
  const [sheetOpen, setSheetOpen] = useState(false);

  // Keep the URL query in sync when arriving from the header search
  React.useEffect(() => {
    setFilters((f) => ({ ...f, query: initialQuery }));
  }, [initialQuery]);

  const { events, loosenHint } = useMemo(
    () => applyFilters(publishedEvents(), filters, profile),
    [filters, profile]
  );

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-[28px] lg:text-[40px]">What’s on near you</h1>
        {filters.query.trim() && (
          <p className="text-[14px] text-grey">
            Results for “{filters.query.trim()}” ·{" "}
            <button type="button" className="underline text-ink" onClick={() => setFilters({ ...filters, query: "" })}>
              Clear search
            </button>
          </p>
        )}
        <AgePrompt />
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[280px_1fr] lg:gap-10 lg:items-start">
        {/* Desktop: persistent sticky sidebar, intent toggle at its top */}
        {isDesktop && (
          <aside className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pr-2 pb-8">
            <IntentToggle
              value={filters.intent}
              onChange={(intent) => setFilters({ ...filters, intent })}
              className="mb-6"
            />
            <FilterControls filters={filters} onChange={setFilters} />
          </aside>
        )}

        <div>
          {/* Mobile: intent toggle above the chips, both stay visible */}
          {isDesktop === false && (
            <div className="sticky top-0 z-30 bg-paper pt-2 pb-3 -mx-6 px-6 space-y-3">
              <IntentToggle value={filters.intent} onChange={(intent) => setFilters({ ...filters, intent })} />
              <MobileChipRow filters={filters} onChange={setFilters} onOpenSheet={() => setSheetOpen(true)} />
            </div>
          )}

          {!ready ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {Array.from({ length: 6 }, (_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="card p-8 mt-4 text-center">
              <h2 className="text-[22px]">No events match</h2>
              {loosenHint && <p className="mt-2 text-grey">{loosenHint}</p>}
              <button
                type="button"
                onClick={() => setFilters({ ...DEFAULT_FILTERS })}
                className="mt-4 min-h-[44px] px-6 rounded-full bg-ink text-paper text-[14px] font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-[13px] text-grey mt-2 mb-4" role="status">
                {events.length} event{events.length === 1 ? "" : "s"}
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {isDesktop === false && (
        <FilterSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          filters={filters}
          onChange={setFilters}
          resultCount={events.length}
        />
      )}
    </div>
  );
}
