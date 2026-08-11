import React from "react";
import type { OnTrackEvent } from "@/lib/types";
import { categoryBySlug } from "@/lib/categories";

// Deterministic generated graphic used when an organiser uploads no image.
// Editorial and typographic — a poster crop, not a stock photo. The same
// component serves every category so a gig and an insight day look like
// equal citizens.

const PATTERNS = ["stripes", "dots", "arcs", "grid"] as const;

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function CardImage({ event, className = "" }: { event: OnTrackEvent; className?: string }) {
  const h = hash(event.slug);
  const pattern = PATTERNS[h % PATTERNS.length];
  const inverted = h % 3 === 0; // some posters ink-on-paper, some paper-on-ink
  const bg = inverted ? "#111111" : "#FBF9F5";
  const fg = inverted ? "#FBF9F5" : "#111111";
  const catName = categoryBySlug(event.category)?.name ?? event.category;
  const word = event.title.split(/[\s:—]/).find((w) => w.length > 3) ?? event.title;

  return (
    <div className={`relative aspect-video overflow-hidden ${className}`} style={{ background: bg }} aria-hidden="true">
      <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        {pattern === "stripes" &&
          [0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={-40 + i * 84} y={-20} width={26} height={240} fill={fg} opacity={0.08} transform={`rotate(${12 + (h % 10)} 160 90)`} />
          ))}
        {pattern === "dots" &&
          Array.from({ length: 24 }, (_, i) => (
            <circle key={i} cx={20 + (i % 6) * 56} cy={22 + Math.floor(i / 6) * 46} r={5 + ((h + i) % 3) * 3} fill={fg} opacity={0.1} />
          ))}
        {pattern === "arcs" &&
          [46, 82, 118, 154].map((r) => (
            <circle key={r} cx={300} cy={20} r={r} fill="none" stroke={fg} strokeWidth={10} opacity={0.09} />
          ))}
        {pattern === "grid" && (
          <g opacity={0.1} stroke={fg} strokeWidth={2}>
            {[36, 72, 108, 144].map((y) => (
              <line key={`h${y}`} x1={0} y1={y} x2={320} y2={y} />
            ))}
            {[64, 128, 192, 256].map((x) => (
              <line key={`v${x}`} x1={x} y1={0} x2={x} y2={180} />
            ))}
          </g>
        )}
        <rect x={16} y={140} width={64} height={8} fill="#D9FF3D" />
      </svg>
      <div
        className="absolute inset-0 flex flex-col justify-center px-5 font-display font-bold lowercase"
        style={{ color: fg }}
      >
        <span className="text-[28px] leading-none tracking-tight break-words">{word.toLowerCase()}</span>
        <span className="pill mt-2 inline-block w-fit border px-2 py-0.5 normal-case" style={{ borderColor: fg, opacity: 0.7 }}>
          {catName}
        </span>
      </div>
    </div>
  );
}
