"use client";

import React from "react";

// Chart primitives for the partner dashboards. Ink on line-grey tracks with
// Signal highlights — same palette as the rest of the product, no chart
// library, everything renders as HTML/SVG.

export function StatCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="card p-5">
      <p className="text-[12px] uppercase tracking-[0.04em] text-grey">{label}</p>
      <p className="mt-1 font-display font-bold text-[28px] leading-none">{value}</p>
      {note && <p className="mt-1 text-[12px] text-grey">{note}</p>}
    </div>
  );
}

export function HBar({
  label,
  value,
  max,
  note,
  accent = false,
}: {
  label: string;
  value: number;
  max: number;
  note?: string;
  accent?: boolean;
}) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-[13px]">
        <span>{label}</span>
        <span className="font-semibold">
          {value.toLocaleString("en-GB")}
          {note ? <span className="font-normal text-grey"> {note}</span> : null}
        </span>
      </div>
      <div className="mt-1 h-3 rounded-full bg-line overflow-hidden">
        <div className={`h-full rounded-full ${accent ? "bg-signal border border-ink/20" : "bg-ink"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Two bars per row — e.g. demand vs supply — with a shared scale. */
export function PairedBars({
  rows,
  aLabel,
  bLabel,
}: {
  rows: { label: string; a: number; b: number }[];
  aLabel: string;
  bLabel: string;
}) {
  const max = Math.max(...rows.flatMap((r) => [r.a, r.b]), 1);
  return (
    <div>
      <div className="flex gap-4 text-[12px] text-grey">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-ink inline-block" /> {aLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-signal border border-ink/20 inline-block" /> {bLabel}
        </span>
      </div>
      <div className="mt-3 space-y-3">
        {rows.map((r) => (
          <div key={r.label}>
            <p className="text-[13px]">{r.label}</p>
            <div className="mt-1 space-y-1">
              <div className="h-2.5 rounded-full bg-line overflow-hidden">
                <div className="h-full bg-ink rounded-full" style={{ width: `${(r.a / max) * 100}%` }} />
              </div>
              <div className="h-2.5 rounded-full bg-line overflow-hidden">
                <div className="h-full bg-signal rounded-full" style={{ width: `${(r.b / max) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Area/line trend over time, SVG. */
export function TrendChart({
  series,
  height = 160,
  startLabel,
  endLabel,
  ariaLabel,
}: {
  series: number[];
  height?: number;
  startLabel: string;
  endLabel: string;
  ariaLabel: string;
}) {
  const w = 600;
  const max = Math.max(...series) * 1.1;
  const pts = series.map((v, i) => [i * (w / (series.length - 1)), height - (v / max) * height] as const);
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${height} L0,${height} Z`;
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} role="img" aria-label={ariaLabel} preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1={0} x2={w} y1={height * t} y2={height * t} stroke="#E3E0DA" strokeWidth={1} />
        ))}
        <path d={area} fill="#D9FF3D" opacity={0.35} />
        <path d={line} fill="none" stroke="#111111" strokeWidth={2.5} />
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={5} fill="#111111" />
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-grey">
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>
    </div>
  );
}

/** Day × time-slot activity heat grid. */
export function Heatmap({
  rows,
  cols,
  values,
  ariaLabel,
}: {
  rows: string[];
  cols: string[];
  values: number[][]; // [row][col]
  ariaLabel: string;
}) {
  const max = Math.max(...values.flat(), 1);
  return (
    <div role="img" aria-label={ariaLabel}>
      <div className="grid gap-1" style={{ gridTemplateColumns: `44px repeat(${cols.length}, 1fr)` }}>
        <span />
        {cols.map((c) => (
          <span key={c} className="text-[10px] text-grey text-center uppercase tracking-[0.04em]">
            {c}
          </span>
        ))}
        {rows.map((r, ri) => (
          <React.Fragment key={r}>
            <span className="text-[11px] text-grey self-center">{r}</span>
            {cols.map((c, ci) => {
              const v = values[ri][ci] / max;
              return (
                <span
                  key={c}
                  className="h-7 rounded-[6px]"
                  style={{
                    backgroundColor: v > 0.66 ? "#111111" : v > 0.33 ? "#6B6B6B" : "#E3E0DA",
                    opacity: v > 0.66 ? 1 : v > 0.33 ? 0.55 + v * 0.3 : 0.9,
                  }}
                  title={`${r} ${c}`}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-grey">
        quieter
        <span className="w-4 h-3 rounded-[4px] bg-line inline-block" />
        <span className="w-4 h-3 rounded-[4px] bg-grey inline-block" />
        <span className="w-4 h-3 rounded-[4px] bg-ink inline-block" />
        busier
      </div>
    </div>
  );
}
