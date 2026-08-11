"use client";

import React from "react";
import type { Filters } from "@/lib/types";

const OPTIONS: { value: Filters["intent"]; label: string }[] = [
  { value: "anything", label: "Anything" },
  { value: "fun", label: "Something fun" },
  { value: "useful", label: "Something useful" },
];

/**
 * The intent toggle — signature interaction. Anything is the default and the
 * visual resting state; picking a lane narrows the mix, it never switches to
 * a different-looking product. The choice is deliberately not persisted
 * between sessions.
 *
 * Implemented as a radio group so it is keyboard operable and announced.
 */
export function IntentToggle({
  value,
  onChange,
  className = "",
}: {
  value: Filters["intent"];
  onChange: (v: Filters["intent"]) => void;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="sr-only">What are you in the mood for?</legend>
      <div className="inline-flex rounded-full border border-line bg-white p-1 gap-1" role="radiogroup" aria-label="What are you in the mood for?">
        {OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`relative cursor-pointer select-none rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-150 min-h-[44px] flex items-center ${
                active ? "bg-ink text-paper" : "text-ink hover:bg-line/60"
              }`}
            >
              <input
                type="radio"
                name="intent"
                value={opt.value}
                checked={active}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
