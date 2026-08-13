"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { publishedEvents } from "@/lib/events";
import { DEFAULT_FILTERS, type Filters, type OnTrackEvent } from "@/lib/types";
import { applyFilters } from "@/lib/filter";
import { DEFAULT_LOCATION } from "@/lib/geo";
import { useApp } from "@/lib/store";
import { useIsDesktop } from "@/lib/useMediaQuery";
import { IntentToggle } from "@/components/IntentToggle";
import { EventCard } from "@/components/EventCard";
import { FilterSheet, MobileChipRow } from "@/components/FilterControls";
import { CATEGORIES } from "@/lib/categories";
import { formatDate, formatPrice } from "@/lib/format";
import { eventAgeBadge } from "@/lib/age";
import { CardImage } from "@/components/CardImage";

// Map style: OpenStreetMap raster tiles — no API key anywhere near the
// client, per the security requirements. Pins are native MapLibre markers
// (DOM buttons), so the map itself positions them during pan and zoom.
const MAP_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

/** Circle polygon for the distance radius, drawn live with the slider. */
function circleGeoJSON(lat: number, lng: number, miles: number): GeoJSON.Feature<GeoJSON.Polygon> {
  const points = 64;
  const coords: [number, number][] = [];
  const distX = miles / (69.172 * Math.cos((lat * Math.PI) / 180));
  const distY = miles / 68.972;
  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * 2 * Math.PI;
    coords.push([lng + distX * Math.cos(theta), lat + distY * Math.sin(theta)]);
  }
  return { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [coords] } };
}

function eventsBounds(events: OnTrackEvent[]): maplibregl.LngLatBounds | null {
  if (events.length === 0) return null;
  const b = new maplibregl.LngLatBounds();
  for (const e of events) b.extend([e.venue.lng, e.venue.lat]);
  return b;
}

export function MapClient() {
  const isDesktop = useIsDesktop();
  // Shared state lives here so it survives the desktop↔mobile remount
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  // The map must not initialise until we know which layout it lives in —
  // initialising into one container and re-parenting breaks the canvas.
  if (isDesktop === null) {
    return (
      <div className="h-[calc(100dvh-4rem)] p-6">
        <div className="skeleton w-full h-full !rounded-2xl" />
      </div>
    );
  }

  return (
    <MapView
      key={isDesktop ? "desktop" : "mobile"}
      isDesktop={isDesktop}
      filters={filters}
      setFilters={setFilters}
    />
  );
}

function MapView({
  isDesktop,
  filters,
  setFilters,
}: {
  isDesktop: boolean;
  filters: Filters;
  setFilters: (f: Filters) => void;
}) {
  const { profile } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [locNote, setLocNote] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [zoomStamp, setZoomStamp] = useState(0);

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<(id: string, pan: boolean) => void>(() => {});

  const { events } = useMemo(
    () => applyFilters(publishedEvents(), filters, profile, DEFAULT_LOCATION),
    [filters, profile]
  );

  // --- map lifecycle -------------------------------------------------------
  useEffect(() => {
    const container = mapContainer.current;
    if (!container) return;
    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container,
        style: MAP_STYLE,
        center: [DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat],
        zoom: 6,
        attributionControl: { compact: true },
      });
    } catch {
      // No WebGL on this device/browser — fail to a usable page, not a blank one
      setMapFailed(true);
      return;
    }
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), isDesktop ? "top-right" : "bottom-right");
    map.on("error", () => {
      // tile errors etc. — the map stays interactive; never crash the page
    });
    mapRef.current = map;

    // Show the whole launch area with every pin clear of the floating UI
    const bounds = eventsBounds(publishedEvents());
    if (bounds) {
      map.fitBounds(bounds, {
        padding: isDesktop
          ? { top: 80, bottom: 80, left: 80, right: 80 }
          : { top: 210, bottom: 190, left: 44, right: 44 },
        duration: 0,
      });
    }

    // Clustering only changes with zoom, so markers rebuild on zoomend;
    // panning is handled natively by MapLibre moving the markers.
    map.on("zoomend", () => setZoomStamp((n) => n + 1));
    map.on("load", () => {
      map.addSource("radius", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
      map.addLayer({
        id: "radius-fill",
        type: "fill",
        source: "radius",
        paint: { "fill-color": "#111111", "fill-opacity": 0.05 },
      });
      map.addLayer({
        id: "radius-line",
        type: "line",
        source: "radius",
        paint: { "line-color": "#111111", "line-opacity": 0.35, "line-width": 1.5, "line-dasharray": [2, 2] },
      });
      setMapReady(true);
    });

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(container);

    return () => {
      ro.disconnect();
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  // Radius circle follows the slider (only when a radius is set — the
  // default is all of London)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const src = map.getSource("radius") as maplibregl.GeoJSONSource | undefined;
    if (!src) return;
    if (filters.distanceMiles === null) {
      src.setData({ type: "FeatureCollection", features: [] });
    } else {
      src.setData(circleGeoJSON(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng, filters.distanceMiles));
    }
  }, [filters.distanceMiles, mapReady]);

  const selectEvent = useCallback(
    (id: string | null, pan = false) => {
      setSelectedId(id);
      const map = mapRef.current;
      if (!id || !map) return;
      const event = events.find((e) => e.id === id);
      if (!event) return;
      if (pan) map.easeTo({ center: [event.venue.lng, event.venue.lat], duration: 300 });
      const cardEl = carouselRef.current?.querySelector<HTMLElement>(`[data-carousel-id="${id}"]`);
      cardEl?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    },
    [events]
  );
  selectRef.current = (id, pan) => selectEvent(id, pan);

  // --- markers: cluster in screen space, then hand DOM buttons to MapLibre --
  useEffect(() => {
    const map = mapRef.current;
    if (!map || mapFailed) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const CLUSTER_PX = 52;
    const points = events.map((event) => ({ event, p: map.project([event.venue.lng, event.venue.lat]) }));
    const taken = new Set<number>();
    const singles: OnTrackEvent[] = [];
    const clusters: { events: OnTrackEvent[] }[] = [];
    for (let i = 0; i < points.length; i++) {
      if (taken.has(i)) continue;
      const group = [points[i]];
      for (let j = i + 1; j < points.length; j++) {
        if (taken.has(j)) continue;
        if (Math.hypot(points[i].p.x - points[j].p.x, points[i].p.y - points[j].p.y) < CLUSTER_PX) {
          group.push(points[j]);
          taken.add(j);
        }
      }
      if (group.length > 1) clusters.push({ events: group.map((g) => g.event) });
      else singles.push(points[i].event);
    }

    for (const c of clusters) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "map-cluster";
      el.textContent = String(c.events.length);
      el.setAttribute("aria-label", `${c.events.length} events here — zoom in`);
      const lat = c.events.reduce((s, e) => s + e.venue.lat, 0) / c.events.length;
      const lng = c.events.reduce((s, e) => s + e.venue.lng, 0) / c.events.length;
      el.addEventListener("click", () => {
        map.easeTo({ center: [lng, lat], zoom: map.getZoom() + 2, duration: 300 });
      });
      markersRef.current.push(new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map));
    }

    for (const event of singles) {
      const el = document.createElement("button");
      el.type = "button";
      const active = selectedId === event.id || hoveredId === event.id;
      el.className = `map-pin ${active ? "map-pin-selected" : event.price === 0 ? "map-pin-free" : "map-pin-paid"}`;
      el.textContent = formatPrice(event.price);
      el.setAttribute("aria-label", `${event.title}, ${formatPrice(event.price)}, ${eventAgeBadge(event)}`);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        selectRef.current(event.id, !isDesktop);
      });
      el.addEventListener("mouseenter", () => setHoveredId(event.id));
      el.addEventListener("mouseleave", () => setHoveredId(null));
      const marker = new maplibregl.Marker({ element: el }).setLngLat([event.venue.lng, event.venue.lat]).addTo(map);
      if (active) el.style.zIndex = "30";
      markersRef.current.push(marker);
    }
  }, [events, selectedId, hoveredId, mapFailed, zoomStamp, isDesktop, mapReady]);

  const useMyLocation = () => {
    setLocNote(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.easeTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 11, duration: 400 });
      },
      () => setLocNote(false)
    );
  };

  // Keyboard: Escape clears the selected pin/popover
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Swiping the mobile carousel pans the map to the centred card
  useEffect(() => {
    if (isDesktop) return;
    const el = carouselRef.current;
    if (!el) return;
    let timer: number | undefined;
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const mid = el.scrollLeft + el.clientWidth / 2;
        let best: { id: string; dist: number } | null = null;
        el.querySelectorAll<HTMLElement>("[data-carousel-id]").forEach((card) => {
          const centre = card.offsetLeft + card.offsetWidth / 2;
          const dist = Math.abs(centre - mid);
          if (!best || dist < best.dist) best = { id: card.dataset.carouselId!, dist };
        });
        if (best) {
          const found = events.find((e) => e.id === best!.id);
          if (found) {
            setSelectedId(found.id);
            mapRef.current?.easeTo({ center: [found.venue.lng, found.venue.lat], duration: 300 });
          }
        }
      }, 160);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      el.removeEventListener("scroll", onScroll);
    };
  }, [isDesktop, events]);

  const selected = events.find((e) => e.id === selectedId) ?? null;

  const mapFallback = mapFailed && (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-paper p-6">
      <div className="card p-8 max-w-[420px] text-center bg-white">
        <h2 className="text-[22px]">The map can’t load here</h2>
        <p className="mt-2 text-[14px] text-grey">
          This browser or device doesn’t support the graphics the map needs (WebGL). Everything is
          still in the list view.
        </p>
        <Link
          href="/browse"
          className="mt-4 inline-flex items-center min-h-[44px] px-6 rounded-full bg-signal text-ink border border-ink font-display font-semibold"
        >
          Browse the list
        </Link>
      </div>
    </div>
  );

  const zoomHint = (
    <p className="text-[12px] text-grey">Drag to explore · numbered circles are groups, tap to zoom in</p>
  );

  // ---------------------------------------------------------------- desktop
  if (isDesktop) {
    return (
      <div className="grid grid-cols-[45%_55%] h-[calc(100dvh-4rem)]">
        <div className="overflow-y-auto px-6 py-6 border-r border-line">
          <IntentToggle value={filters.intent} onChange={(intent) => setFilters({ ...filters, intent })} />
          <div className="mt-4 flex gap-2 overflow-x-auto [scrollbar-width:none]">
            <FilterChip
              active={filters.price.includes("free")}
              onClick={() =>
                setFilters({
                  ...filters,
                  price: filters.price.includes("free")
                    ? filters.price.filter((p) => p !== "free")
                    : [...filters.price, "free"],
                })
              }
            >
              Free
            </FilterChip>
            {CATEGORIES.map((c) => (
              <FilterChip
                key={c.slug}
                active={filters.categories.includes(c.slug)}
                onClick={() =>
                  setFilters({
                    ...filters,
                    categories: filters.categories.includes(c.slug)
                      ? filters.categories.filter((x) => x !== c.slug)
                      : [...filters.categories, c.slug],
                  })
                }
              >
                {c.name}
              </FilterChip>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => (locNote ? useMyLocation() : setLocNote(true))}
              className="min-h-[44px] px-4 rounded-full border border-line bg-white text-[13px] font-medium"
            >
              Use my location
            </button>
            {locNote && (
              <span className="text-[12px] text-grey bg-white border border-line rounded-lg px-3 py-2">
                Used once to centre the map — never stored.{" "}
                <button type="button" className="underline text-ink" onClick={useMyLocation}>
                  OK
                </button>
              </span>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            <p className="text-[13px] text-grey" role="status">
              {events.length} event{events.length === 1 ? "" : "s"} on the map
            </p>
            {zoomHint}
          </div>
          <div className="mt-4 grid gap-6 pb-8">
            {events.map((e) => (
              <EventCard key={e.id} event={e} onHover={setHoveredId} highlighted={hoveredId === e.id || selectedId === e.id} />
            ))}
            {events.length === 0 && (
              <div className="card p-8 text-center">
                <h2 className="text-[20px]">No events match</h2>
                <p className="mt-2 text-grey text-[14px]">Clear a filter to see the map fill back up.</p>
              </div>
            )}
          </div>
        </div>
        <div className="relative h-full overflow-hidden">
          {/* Explicit w/h — MapLibre's own .maplibregl-map class overrides
              Tailwind positioning classes, so the container must be sized
              directly or it collapses to 0 height */}
          <div ref={mapContainer} className="w-full h-full" />
          {mapFallback}
          {selected && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[320px] card overflow-hidden bg-white" role="dialog" aria-label={selected.title}>
              <Link href={`/events/${selected.slug}`}>
                <CardImage event={selected} />
              </Link>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="pill bg-ink text-paper px-2.5 py-1">{eventAgeBadge(selected)}</span>
                  <span className={selected.price === 0 ? "pill bg-signal px-2.5 py-1 font-semibold" : "font-display font-semibold"}>
                    {formatPrice(selected.price)}
                  </span>
                </div>
                <h3 className="mt-2 text-[17px] leading-tight">
                  <Link href={`/events/${selected.slug}`} className="hover:underline">
                    {selected.title}
                  </Link>
                </h3>
                <p className="mt-1 text-[13px] text-grey">{formatDate(selected.date)}</p>
                <button type="button" className="mt-2 text-[13px] underline" onClick={() => setSelectedId(null)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------- mobile
  return (
    <div className="relative h-dvh overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
      {mapFallback}

      {/* Compact controls floating over the map */}
      <div className="absolute top-0 inset-x-0 z-20 p-3 space-y-2 pointer-events-none [&>*]:pointer-events-auto">
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
          <Link
            href="/browse"
            className="min-h-[44px] px-4 rounded-full bg-ink text-paper text-[13px] font-medium inline-flex items-center shrink-0"
          >
            List view
          </Link>
          <IntentToggle
            className="shrink-0"
            value={filters.intent}
            onChange={(intent) => setFilters({ ...filters, intent })}
          />
        </div>
        <MobileChipRow filters={filters} onChange={setFilters} onOpenSheet={() => setSheetOpen(true)} />
      </div>

      {/* Card carousel above the tab bar; swiping pans the map */}
      <div
        ref={carouselRef}
        className="absolute bottom-[68px] inset-x-0 z-20 flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-1 [scrollbar-width:none]"
      >
        {events.map((e) => (
          <div
            key={e.id}
            data-carousel-id={e.id}
            className={`snap-center shrink-0 w-[280px] card overflow-hidden bg-white ${
              selectedId === e.id ? "border-ink" : ""
            }`}
            onClick={() => selectEvent(e.id, true)}
          >
            <div className="flex gap-3 p-3">
              <div className="w-20 shrink-0 rounded-lg overflow-hidden">
                <CardImage event={e} className="!aspect-square" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[14px] leading-tight clamp-2">
                  <Link href={`/events/${e.slug}`} className="hover:underline">
                    {e.title}
                  </Link>
                </h3>
                <p className="mt-1 text-[12px] text-grey">
                  {formatDate(e.date)} · {e.venue.area}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="pill bg-ink text-paper px-2 py-0.5">{eventAgeBadge(e)}</span>
                  <span className={e.price === 0 ? "pill bg-signal px-2 py-0.5 font-semibold" : "text-[13px] font-display font-semibold"}>
                    {formatPrice(e.price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="card p-4 bg-white text-[14px]">No events match — clear a filter.</div>
        )}
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filters={filters}
        onChange={setFilters}
        resultCount={events.length}
      />
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`pill min-h-[44px] shrink-0 px-4 border whitespace-nowrap ${
        active ? "bg-signal border-ink font-semibold" : "bg-white border-line"
      }`}
    >
      {children}
    </button>
  );
}
