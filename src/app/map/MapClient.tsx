"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { EVENTS } from "@/lib/events";
import { DEFAULT_FILTERS, type Filters, type OnTrackEvent } from "@/lib/types";
import { applyFilters } from "@/lib/filter";
import { DEFAULT_LOCATION, distanceMiles } from "@/lib/geo";
import { useApp } from "@/lib/store";
import { useIsDesktop } from "@/lib/useMediaQuery";
import { IntentToggle } from "@/components/IntentToggle";
import { EventCard } from "@/components/EventCard";
import { CATEGORIES } from "@/lib/categories";
import { formatDate, formatPrice } from "@/lib/format";
import { eventAgeBadge } from "@/lib/age";
import { CardImage } from "@/components/CardImage";

// Map style: OpenStreetMap raster tiles — no API key anywhere near the
// client, per the security requirements. Custom HTML pins carry the price.
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

interface PinPoint {
  event: OnTrackEvent;
  x: number;
  y: number;
}
interface Cluster {
  x: number;
  y: number;
  events: OnTrackEvent[];
}

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

export function MapClient() {
  const { profile } = useApp();
  const isDesktop = useIsDesktop();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [centre, setCentre] = useState(DEFAULT_LOCATION);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [locNote, setLocNote] = useState(false);

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [, forceRender] = useState(0);

  const { events } = useMemo(
    () => applyFilters(EVENTS, filters, profile, centre),
    [filters, profile, centre]
  );

  // --- map lifecycle -------------------------------------------------------
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: [DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat],
      zoom: 10,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    const rerender = () => forceRender((n) => n + 1);
    map.on("move", rerender);
    map.on("load", () => {
      map.addSource("radius", { type: "geojson", data: circleGeoJSON(centre.lat, centre.lng, filters.distanceMiles) });
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
      rerender();
    });
    map.on("moveend", () => {
      const c = map.getCenter();
      const moved = distanceMiles(c.lat, c.lng, centre.lat, centre.lng);
      setShowSearchArea(moved > 2);
    });
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Radius circle follows the slider and the search centre
  useEffect(() => {
    const map = mapRef.current;
    const src = map?.getSource("radius") as maplibregl.GeoJSONSource | undefined;
    src?.setData(circleGeoJSON(centre.lat, centre.lng, filters.distanceMiles));
  }, [centre, filters.distanceMiles]);

  // Track pan distance from the current search centre
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const onMoveEnd = () => {
      const c = map.getCenter();
      setShowSearchArea(distanceMiles(c.lat, c.lng, centre.lat, centre.lng) > 2);
    };
    map.on("moveend", onMoveEnd);
    return () => {
      map.off("moveend", onMoveEnd);
    };
  }, [centre]);

  // --- clustering (screen-space, recomputed on every render) ---------------
  const { pins, clusters } = useMemo(() => {
    const map = mapRef.current;
    const pins: PinPoint[] = [];
    const clusters: Cluster[] = [];
    if (!map) return { pins, clusters };
    const CLUSTER_PX = 56;
    const points: PinPoint[] = events.map((event) => {
      const p = map.project([event.venue.lng, event.venue.lat]);
      return { event, x: p.x, y: p.y };
    });
    const taken = new Set<number>();
    for (let i = 0; i < points.length; i++) {
      if (taken.has(i)) continue;
      const group = [points[i]];
      for (let j = i + 1; j < points.length; j++) {
        if (taken.has(j)) continue;
        if (Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y) < CLUSTER_PX) {
          group.push(points[j]);
          taken.add(j);
        }
      }
      if (group.length > 1) {
        clusters.push({
          x: group.reduce((s, g) => s + g.x, 0) / group.length,
          y: group.reduce((s, g) => s + g.y, 0) / group.length,
          events: group.map((g) => g.event),
        });
      } else {
        pins.push(points[i]);
      }
    }
    return { pins, clusters };
    // mapRef.current mutates without identity change; the forced render on
    // "move" keeps this in sync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, forceRender, mapRef.current && mapRef.current.getCenter().toString(), mapRef.current?.getZoom()]);

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

  const searchThisArea = () => {
    const map = mapRef.current;
    if (!map) return;
    const c = map.getCenter();
    setCentre({ lat: c.lat, lng: c.lng, label: "Map area" });
    setShowSearchArea(false);
  };

  const useMyLocation = () => {
    setLocNote(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude, label: "Your location" };
        setCentre(next);
        mapRef.current?.easeTo({ center: [next.lng, next.lat], zoom: 11, duration: 300 });
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

  const selected = events.find((e) => e.id === selectedId) ?? null;

  const pinOverlay = (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-label="Event pins">
      {clusters.map((c, i) => (
        <button
          key={`cluster-${i}`}
          type="button"
          className="map-cluster absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2"
          style={{ left: c.x, top: c.y }}
          aria-label={`${c.events.length} events here — zoom in`}
          onClick={() => {
            mapRef.current?.easeTo({
              center: [c.events[0].venue.lng, c.events[0].venue.lat],
              zoom: (mapRef.current?.getZoom() ?? 10) + 2,
              duration: 300,
            });
          }}
        >
          {c.events.length}
        </button>
      ))}
      {pins.map(({ event, x, y }) => {
        const isSelected = selectedId === event.id || hoveredId === event.id;
        return (
          <button
            key={event.id}
            type="button"
            className={`map-pin absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 ${
              isSelected ? "map-pin-selected" : event.price === 0 ? "map-pin-free" : "map-pin-paid"
            }`}
            style={{ left: x, top: y, zIndex: isSelected ? 30 : 10 }}
            aria-label={`${event.title}, ${formatPrice(event.price)}, ${eventAgeBadge(event)}`}
            onClick={() => selectEvent(event.id, false)}
            onMouseEnter={() => setHoveredId(event.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {formatPrice(event.price)}
          </button>
        );
      })}
    </div>
  );

  const chipRow = (
    <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
      <button
        type="button"
        aria-pressed={filters.price.includes("free")}
        onClick={() =>
          setFilters({
            ...filters,
            price: filters.price.includes("free") ? filters.price.filter((p) => p !== "free") : [...filters.price, "free"],
          })
        }
        className={`pill min-h-[44px] shrink-0 px-4 border ${
          filters.price.includes("free") ? "bg-signal border-ink font-semibold" : "bg-white border-line"
        }`}
      >
        Free
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c.slug}
          type="button"
          aria-pressed={filters.categories.includes(c.slug)}
          onClick={() =>
            setFilters({
              ...filters,
              categories: filters.categories.includes(c.slug)
                ? filters.categories.filter((x) => x !== c.slug)
                : [...filters.categories, c.slug],
            })
          }
          className={`pill min-h-[44px] shrink-0 px-4 border whitespace-nowrap ${
            filters.categories.includes(c.slug) ? "bg-signal border-ink font-semibold" : "bg-white border-line"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );

  const searchAreaBtn = showSearchArea && (
    <button
      type="button"
      onClick={searchThisArea}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-20 min-h-[44px] px-5 rounded-full bg-ink text-paper text-[14px] font-medium"
    >
      Search this area
    </button>
  );

  const locationControls = (
    <div className="flex items-center gap-2">
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
      <label className="flex items-center gap-2 text-[12px] text-grey bg-white border border-line rounded-full px-3 min-h-[44px]">
        {filters.distanceMiles} mi
        <input
          type="range"
          min={1}
          max={25}
          value={filters.distanceMiles}
          onChange={(e) => setFilters({ ...filters, distanceMiles: Number(e.target.value) })}
          className="w-24 accent-[#111111]"
          aria-label={`Distance: ${filters.distanceMiles} miles`}
        />
      </label>
    </div>
  );

  // ---------------------------------------------------------------- desktop
  if (isDesktop) {
    return (
      <div className="grid grid-cols-[45%_55%] h-[calc(100dvh-4rem)]">
        <div className="overflow-y-auto px-6 py-6 border-r border-line">
          <IntentToggle value={filters.intent} onChange={(intent) => setFilters({ ...filters, intent })} />
          <div className="mt-4">{chipRow}</div>
          <div className="mt-3">{locationControls}</div>
          <p className="text-[13px] text-grey mt-4" role="status">
            {events.length} event{events.length === 1 ? "" : "s"} within {filters.distanceMiles} miles
          </p>
          <div className="mt-4 grid gap-6 pb-8">
            {events.map((e) => (
              <EventCard key={e.id} event={e} onHover={setHoveredId} highlighted={hoveredId === e.id || selectedId === e.id} />
            ))}
            {events.length === 0 && (
              <div className="card p-8 text-center">
                <h2 className="text-[20px]">No events match</h2>
                <p className="mt-2 text-grey text-[14px]">Try 25 miles, or clear a filter.</p>
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <div ref={mapContainer} className="absolute inset-0" />
          {pinOverlay}
          {searchAreaBtn}
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
    <div className="relative h-dvh">
      <div ref={mapContainer} className="absolute inset-0" />
      {pinOverlay}
      {searchAreaBtn}

      {/* Filters and intent toggle float over the map */}
      <div className="absolute top-0 inset-x-0 z-20 p-4 space-y-2 pointer-events-none [&>*]:pointer-events-auto">
        <div className="flex items-center gap-2">
          <Link
            href="/browse"
            className="min-h-[44px] px-4 rounded-full bg-ink text-paper text-[13px] font-medium inline-flex items-center"
          >
            List view
          </Link>
          {locationControls}
        </div>
        <IntentToggle value={filters.intent} onChange={(intent) => setFilters({ ...filters, intent })} />
        {chipRow}
      </div>

      {/* Draggable card carousel across the bottom */}
      <div
        ref={carouselRef}
        className="absolute bottom-4 inset-x-0 z-20 flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 [scrollbar-width:none]"
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
                <p className="mt-1 text-[12px] text-grey">{formatDate(e.date)}</p>
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
          <div className="card p-4 bg-white text-[14px]">No events match — try widening the distance.</div>
        )}
      </div>
    </div>
  );
}
