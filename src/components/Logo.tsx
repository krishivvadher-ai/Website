"use client";

import React, { useId } from "react";

// The onTrack logo: a disc mark (circle with a diagonal track cut and a
// centre hole) followed by a bold lowercase wordmark in the brand gradient,
// blue through teal to green.

export const LOGO_GRADIENT = ["#3A7BC8", "#2F9E77", "#6FB52C"] as const;

export function LogoMark({ className = "", light = false }: { className?: string; light?: boolean }) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <mask id={id}>
        <circle cx="50" cy="50" r="50" fill="#fff" />
        <circle cx="50" cy="50" r="13" fill="#000" />
        <rect x="42" y="-14" width="16" height="128" fill="#000" transform="rotate(38 50 50)" />
      </mask>
      <circle cx="50" cy="50" r="50" fill={light ? "#FBF9F5" : "#111111"} mask={`url(#${id})`} />
    </svg>
  );
}

export function Logo({
  className = "",
  markClass = "h-6 w-6",
  textClass = "text-2xl",
  light = false,
}: {
  className?: string;
  markClass?: string;
  textClass?: string;
  light?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className={`${markClass} shrink-0`} light={light} />
      <span
        className={`font-display font-bold lowercase tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#3A7BC8] via-[#2F9E77] to-[#6FB52C] ${textClass}`}
      >
        ontrack
      </span>
    </span>
  );
}
