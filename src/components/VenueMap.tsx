"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { OnTrackEvent } from "@/lib/types";
import { formatPrice } from "@/lib/format";

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

/** Small embedded map on the event page showing exactly where the venue is. */
export function VenueMap({ event }: { event: OnTrackEvent }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const map = new maplibregl.Map({
      container: el,
      style: MAP_STYLE,
      center: [event.venue.lng, event.venue.lat],
      zoom: 13,
      attributionControl: { compact: true },
      scrollZoom: false, // don't hijack page scrolling
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    const pin = document.createElement("div");
    pin.className = `map-pin ${event.price === 0 ? "map-pin-free" : "map-pin-paid"}`;
    pin.textContent = formatPrice(event.price);
    new maplibregl.Marker({ element: pin }).setLngLat([event.venue.lng, event.venue.lat]).addTo(map);

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(el);
    return () => {
      ro.disconnect();
      map.remove();
    };
  }, [event]);

  return (
    <div className="mt-3">
      <div
        ref={container}
        className="h-[280px] rounded-2xl border border-line overflow-hidden"
        aria-label={`Map showing ${event.venue.name}, ${event.venue.area}`}
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${event.venue.lat}&mlon=${event.venue.lng}#map=15/${event.venue.lat}/${event.venue.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-[13px] underline text-grey"
      >
        Open in OpenStreetMap for directions
      </a>
    </div>
  );
}
