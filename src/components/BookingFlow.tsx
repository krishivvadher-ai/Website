"use client";

import React, { useEffect, useState } from "react";
import type { Booking, OnTrackEvent } from "@/lib/types";
import { useApp } from "@/lib/store";
import { formatDateLong, formatPrice, formatTime } from "@/lib/format";
import { eventAgeBadge } from "@/lib/age";
import { hashString } from "./CardImage";

// Demo booking flow. Deliberately collects nothing: no name, no email, no
// card. A booking is a device-local record with a reference — in the live
// product the confirmation goes to the organiser, and this stays the
// user's ticket stub. No countdown timers, no "only 3 left" — booking is a
// calendar action, not a sales tactic.

export function BookingModal({
  event,
  open,
  onClose,
}: {
  event: OnTrackEvent;
  open: boolean;
  onClose: () => void;
}) {
  const { book, bookings } = useApp();
  const [places, setPlaces] = useState(1);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) setConfirmed(null);
  }, [open]);

  if (!open) return null;

  const existing = bookings[event.id];
  const total = event.price * places;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={`Book ${event.title}`}>
      <button type="button" className="absolute inset-0 bg-ink/50" onClick={onClose} aria-label="Close booking" />
      <div className="absolute inset-x-0 bottom-0 lg:inset-x-auto lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[440px] bg-paper rounded-t-2xl lg:rounded-2xl border border-line max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-5">
          <h2 className="text-[20px]">{confirmed || existing ? "You’re booked" : "Book your place"}</h2>
          <button type="button" onClick={onClose} className="w-11 h-11 -mr-2 flex items-center justify-center" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6">
          {confirmed || existing ? (
            <div className="mt-2">
              <Ticket event={event} booking={(confirmed ?? existing)!} />
              <button
                type="button"
                onClick={onClose}
                className="mt-4 w-full min-h-[48px] rounded-full bg-ink text-paper font-display font-semibold text-[15px]"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="mt-1 text-[14px] text-grey">
                {formatDateLong(event.date)}, {formatTime(event.date)} · {event.venue.name},{" "}
                {event.venue.area}
              </p>

              <fieldset className="mt-5">
                <legend className="text-[14px] font-semibold">Places (including you)</legend>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPlaces(n)}
                      aria-pressed={places === n}
                      className={`w-11 h-11 rounded-full border font-display font-semibold ${
                        places === n ? "bg-ink text-paper border-ink" : "bg-white border-line hover:border-ink"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-[12px] text-grey">Bringing a mate counts — book them a place too.</p>
              </fieldset>

              <div className="mt-5 pt-4 border-t border-line flex items-baseline justify-between">
                <span className="text-[14px] text-grey">Total, all-in</span>
                <span className={total === 0 ? "pill bg-signal text-ink px-3 py-1 font-semibold" : "font-display font-bold text-[24px]"}>
                  {total === 0 ? "Free" : formatPrice(total)}
                </span>
              </div>
              {event.feeBreakdown && (
                <p className="mt-1 text-right text-[12px] text-grey">{event.feeBreakdown} per place</p>
              )}

              <button
                type="button"
                onClick={() => setConfirmed(book(event.id, places))}
                className="mt-5 w-full min-h-[48px] rounded-full bg-signal text-ink border border-ink font-display font-semibold text-[16px]"
              >
                {total === 0 ? "Confirm my place" : `Confirm — ${formatPrice(total)}`}
              </button>

              <p className="mt-3 text-[12px] text-grey measure">
                {total > 0 && <>Demo build: no payment is taken and no card is needed. </>}
                The organiser runs this event — your place is with them, and their cancellation
                policy applies. We store this booking on your device only.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** The ticket stub: reference, details, and a decorative demo barcode. */
export function Ticket({ event, booking }: { event: OnTrackEvent; booking: Booking }) {
  const bars = React.useMemo(() => {
    const h = hashString(booking.ref);
    return Array.from({ length: 32 }, (_, i) => 1 + ((h >> i % 28) & 3));
  }, [booking.ref]);

  return (
    <div className="card overflow-hidden bg-white">
      <div className="bg-ink text-paper px-5 py-4">
        <p className="text-[11px] uppercase tracking-[0.04em] text-paper/60">Booking reference</p>
        <p className="font-display font-bold text-[28px] tracking-wide">{booking.ref}</p>
      </div>
      <div className="px-5 py-4">
        <p className="font-medium text-[15px] leading-snug">{event.title}</p>
        <p className="mt-1 text-[13px] text-grey">
          {formatDateLong(event.date)}, {formatTime(event.date)}
        </p>
        <p className="text-[13px] text-grey">
          {event.venue.name}, {event.venue.area}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="pill bg-ink text-paper px-2.5 py-0.5">{eventAgeBadge(event)}</span>
          <span className="pill bg-line text-ink px-2.5 py-0.5">
            {booking.places} place{booking.places === 1 ? "" : "s"}
          </span>
          <span className={`pill px-2.5 py-0.5 ${event.price === 0 ? "bg-signal text-ink font-semibold" : "bg-line"}`}>
            {event.price === 0 ? "Free" : formatPrice(event.price * booking.places)}
          </span>
        </div>
        {/* decorative barcode — a demo stand-in for a real entry code */}
        <div className="mt-4 flex items-end gap-[3px] h-10" aria-hidden="true">
          {bars.map((w, i) => (
            <span key={i} className="bg-ink inline-block h-full" style={{ width: w }} />
          ))}
        </div>
        <p className="mt-2 text-[12px] text-grey">Show this at the door. Demo ticket — not valid for entry.</p>
      </div>
    </div>
  );
}
