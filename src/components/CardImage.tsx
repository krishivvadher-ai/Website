import React from "react";
import type { OnTrackEvent } from "@/lib/types";
import { categoryBySlug } from "@/lib/categories";

// Designed poster graphics for listings. Every event gets deterministic
// artwork: a category-specific illustrated motif, an editorial accent
// colour, and a big typographic title word — a poster wall, not stock
// photography. The same system serves every category so a gig and an
// insight day look like equal citizens.

export function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const ACCENTS = ["#D9FF3D", "#FF5A3D", "#4D7CFF", "#FFB03D", "#3DDCA8", "#FF6FB2"];

export interface PosterTheme {
  bg: string;
  fg: string;
  accent: string;
  inverted: boolean;
}

export function posterTheme(slug: string): PosterTheme {
  const h = hashString(slug);
  const accent = ACCENTS[h % ACCENTS.length];
  const inverted = h % 5 !== 1; // most posters ink, some paper
  return {
    bg: inverted ? "#111111" : "#FBF9F5",
    fg: inverted ? "#FBF9F5" : "#111111",
    accent,
    inverted,
  };
}

/**
 * Category-specific illustrated motif, drawn into a 320×180 viewBox.
 * Exported so the hero slideshow can reuse the same artwork full-bleed.
 */
export function CategoryMotif({
  category,
  seed,
  fg,
  accent,
  opacity = 1,
}: {
  category: string;
  seed: number;
  fg: string;
  accent: string;
  opacity?: number;
}) {
  switch (category) {
    case "music":
      return (
        <g opacity={opacity}>
          {/* vinyl */}
          <circle cx={252} cy={70} r={54} fill="none" stroke={accent} strokeWidth={3} />
          <circle cx={252} cy={70} r={40} fill="none" stroke={fg} strokeWidth={1.5} opacity={0.5} />
          <circle cx={252} cy={70} r={26} fill="none" stroke={fg} strokeWidth={1.5} opacity={0.5} />
          <circle cx={252} cy={70} r={9} fill={accent} />
          {/* equaliser */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const heights = [22, 44, 30, 56, 38, 50, 26];
            const hgt = heights[(i + seed) % heights.length];
            return <rect key={i} x={18 + i * 16} y={166 - hgt} width={9} height={hgt} rx={4} fill={i % 3 === 0 ? accent : fg} opacity={i % 3 === 0 ? 1 : 0.55} />;
          })}
        </g>
      );
    case "talks":
      return (
        <g opacity={opacity}>
          {/* speech bubble */}
          <rect x={196} y={26} width={104} height={64} rx={16} fill="none" stroke={accent} strokeWidth={3} />
          <path d={`M226 90 L218 110 L246 90`} fill="none" stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <text x={248} y={74} textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="46" fill={accent}>
            “”
          </text>
          {/* audience rows */}
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3, 4].map((col) => (
              <circle key={`${row}-${col}`} cx={26 + col * 26} cy={118 + row * 22} r={6} fill={fg} opacity={0.35 + row * 0.15} />
            ))
          )}
        </g>
      );
    case "social":
      return (
        <g opacity={opacity}>
          {/* confetti + bunting */}
          <path d="M0 20 Q80 52 160 24 T320 28" fill="none" stroke={fg} strokeWidth={2} opacity={0.5} />
          {[30, 82, 134, 186, 238, 290].map((x, i) => (
            <path key={x} d={`M${x} ${26 + (i % 3) * 4} l9 18 l-18 0 Z`} fill={i % 2 === 0 ? accent : fg} opacity={i % 2 === 0 ? 1 : 0.6} />
          ))}
          {Array.from({ length: 14 }, (_, i) => {
            const px = (hashString(`${seed}-${i}x`) % 300) + 10;
            const py = (hashString(`${seed}-${i}y`) % 90) + 76;
            const shapes = i % 3;
            if (shapes === 0) return <circle key={i} cx={px} cy={py} r={5} fill={accent} opacity={0.85} />;
            if (shapes === 1) return <rect key={i} x={px} y={py} width={9} height={9} rx={2} fill={fg} opacity={0.5} transform={`rotate(${(i * 37) % 90} ${px} ${py})`} />;
            return <path key={i} d={`M${px} ${py} q6 -10 12 0`} fill="none" stroke={fg} strokeWidth={2.5} opacity={0.55} />;
          })}
        </g>
      );
    case "careers":
      return (
        <g opacity={opacity}>
          {/* rising blocks + arrow */}
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={22 + i * 40} y={150 - i * 26} width={28} height={20 + i * 26} rx={4} fill={i === 3 ? accent : fg} opacity={i === 3 ? 1 : 0.4 + i * 0.15} />
          ))}
          <path d="M40 96 Q120 44 208 52" fill="none" stroke={accent} strokeWidth={3} strokeDasharray="1 8" strokeLinecap="round" />
          <path d="M208 52 l-16 -6 m16 6 l-13 11" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" />
          {/* lanyard */}
          <rect x={244} y={64} width={52} height={70} rx={8} fill="none" stroke={fg} strokeWidth={2.5} opacity={0.65} />
          <circle cx={270} cy={88} r={9} fill={fg} opacity={0.65} />
          <rect x={256} y={106} width={28} height={5} rx={2.5} fill={fg} opacity={0.65} />
          <rect x={256} y={116} width={20} height={5} rx={2.5} fill={fg} opacity={0.45} />
        </g>
      );
    case "sport":
      return (
        <g opacity={opacity}>
          {/* running-track lanes */}
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M-10 ${186 - i * 16} Q160 ${120 - i * 16} 330 ${176 - i * 16}`} fill="none" stroke={i === 1 ? accent : fg} strokeWidth={i === 1 ? 3.5 : 2} opacity={i === 1 ? 1 : 0.45} />
          ))}
          {/* ball */}
          <circle cx={262} cy={52} r={26} fill="none" stroke={accent} strokeWidth={3} />
          <path d="M240 40 Q262 60 284 40 M240 66 Q262 46 284 66" fill="none" stroke={accent} strokeWidth={2} opacity={0.8} />
          <path d="M40 60 l22 0 m-11 -11 l0 22" stroke={fg} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
        </g>
      );
    case "workshops":
      return (
        <g opacity={opacity}>
          {/* overlapping maker shapes */}
          <circle cx={80} cy={70} r={34} fill="none" stroke={accent} strokeWidth={3} />
          <rect x={96} y={50} width={56} height={56} rx={8} fill="none" stroke={fg} strokeWidth={2.5} opacity={0.6} transform="rotate(12 124 78)" />
          <path d="M170 96 l30 -52 l30 52 Z" fill="none" stroke={fg} strokeWidth={2.5} opacity={0.6} />
          {/* stitches */}
          <path d="M20 140 h280" stroke={fg} strokeWidth={2} strokeDasharray="14 10" opacity={0.5} />
          <path d="M20 156 h280" stroke={accent} strokeWidth={2.5} strokeDasharray="6 12" />
          {/* pencil */}
          <rect x={236} y={36} width={54} height={12} rx={6} fill={accent} transform="rotate(-24 263 42)" />
        </g>
      );
    case "volunteering":
      return (
        <g opacity={opacity}>
          {/* leaves along a stem */}
          <path d="M30 170 Q120 120 170 40" fill="none" stroke={fg} strokeWidth={2.5} opacity={0.6} />
          {[0.25, 0.45, 0.65, 0.85].map((t, i) => {
            const x = 30 + (170 - 30) * t;
            const y = 170 - 130 * t * t - 30 * t;
            return <path key={i} d={`M${x} ${y} q18 -16 30 -2 q-16 14 -30 2Z`} fill={i % 2 === 0 ? accent : fg} opacity={i % 2 === 0 ? 0.95 : 0.5} />;
          })}
          {/* hands/heart */}
          <path d="M240 78 c0 -14 22 -14 22 0 c0 -14 22 -14 22 0 c0 16 -22 26 -22 34 c0 -8 -22 -18 -22 -34Z" fill={accent} />
          <path d="M226 128 q36 24 72 0" fill="none" stroke={fg} strokeWidth={2.5} opacity={0.6} strokeLinecap="round" />
        </g>
      );
    default:
      return (
        <g opacity={opacity}>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={-40 + i * 84} y={-20} width={26} height={240} fill={fg} opacity={0.1} transform={`rotate(${12 + (seed % 10)} 160 90)`} />
          ))}
        </g>
      );
  }
}

export function CardImage({ event, className = "" }: { event: OnTrackEvent; className?: string }) {
  const seed = hashString(event.slug);
  const theme = posterTheme(event.slug);
  const catName = categoryBySlug(event.category)?.name ?? event.category;
  const word = event.title.split(/[\s:—]/).find((w) => w.length > 3) ?? event.title;

  return (
    <div className={`relative aspect-video overflow-hidden ${className}`} style={{ background: theme.bg }} aria-hidden="true">
      <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <CategoryMotif category={event.category} seed={seed} fg={theme.fg} accent={theme.accent} />
        <rect x={16} y={150} width={64} height={8} fill={theme.accent} />
      </svg>
      <div className="absolute inset-0 flex flex-col justify-center px-5 font-display font-bold lowercase" style={{ color: theme.fg }}>
        <span
          className="text-[26px] leading-none tracking-tight break-words"
          style={{ textShadow: theme.inverted ? "0 1px 12px rgba(17,17,17,0.7)" : "0 1px 12px rgba(251,249,245,0.8)" }}
        >
          {word.toLowerCase()}
        </span>
        <span
          className="pill mt-2 inline-block w-fit px-2 py-0.5 normal-case"
          style={{ border: `1px solid ${theme.fg}`, background: theme.bg, opacity: 0.85 }}
        >
          {catName}
        </span>
      </div>
    </div>
  );
}
