"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

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

/** Small embedded map with a single labelled pin. */
export function PlaceMap({ lat, lng, label, zoom = 15 }: { lat: number; lng: number; label: string; zoom?: number }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container: el,
        style: MAP_STYLE,
        center: [lng, lat],
        zoom,
        attributionControl: { compact: true },
        scrollZoom: false,
      });
    } catch {
      return; // no WebGL — the address text above still does the job
    }
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    const pin = document.createElement("div");
    pin.className = "map-pin map-pin-paid";
    pin.textContent = label;
    new maplibregl.Marker({ element: pin }).setLngLat([lng, lat]).addTo(map);

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(el);
    return () => {
      ro.disconnect();
      map.remove();
    };
  }, [lat, lng, label, zoom]);

  return <div ref={container} className="h-[320px] w-full rounded-2xl border border-line overflow-hidden" aria-label={`Map showing ${label}`} />;
}
