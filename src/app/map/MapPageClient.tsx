"use client";

import dynamic from "next/dynamic";

// The map is client-only: MapLibre needs the DOM, and the event list is
// derived from now-relative seed dates that must not be baked into static
// HTML. Skeleton until it loads — never a spinner.
export const MapPageClient = dynamic(() => import("./MapClient").then((m) => m.MapClient), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100dvh-4rem)] p-6">
      <div className="skeleton w-full h-full !rounded-2xl" />
    </div>
  ),
});
