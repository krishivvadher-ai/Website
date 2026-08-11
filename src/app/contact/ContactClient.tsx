"use client";

import React from "react";
import dynamic from "next/dynamic";

const PlaceMap = dynamic(() => import("@/components/PlaceMap").then((m) => m.PlaceMap), {
  ssr: false,
  loading: () => <div className="skeleton h-[320px] !rounded-2xl" />,
});

// onTrack HQ — 27 Clerkenwell Close, London EC1R 0AT
const OFFICE = { lat: 51.5241, lng: -0.1077 };

export function ContactClient() {
  return (
    <div className="max-w-[840px] mx-auto px-6 py-8 lg:py-12">
      <h1 className="text-[28px] lg:text-[40px]">Contact us</h1>
      <p className="mt-3 text-grey measure">
        Questions about an event, a listing, a refund — or just an idea that would make onTrack
        better. A real person reads everything and replies within a working day.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <a href="mailto:onTrack@gmail.com" className="card card-hover p-5 block">
          <span className="pill text-grey">Email</span>
          <p className="mt-2 font-display font-semibold text-[17px] break-all">onTrack@gmail.com</p>
          <p className="mt-1 text-[13px] text-grey">Best for anything with details to check.</p>
        </a>
        <a href="tel:+442079460958" className="card card-hover p-5 block">
          <span className="pill text-grey">Phone</span>
          <p className="mt-2 font-display font-semibold text-[17px]">020 7946 0958</p>
          <p className="mt-1 text-[13px] text-grey">Monday to Friday, 9am–5pm.</p>
        </a>
        <div className="card p-5">
          <span className="pill text-grey">Visit</span>
          <p className="mt-2 font-display font-semibold text-[17px] leading-snug">
            27 Clerkenwell Close
            <br />
            London EC1R 0AT
          </p>
          <p className="mt-1 text-[13px] text-grey">Two minutes from Farringdon station.</p>
        </div>
      </div>

      <h2 className="mt-10 text-[22px]">Where we are</h2>
      <div className="mt-3">
        <PlaceMap lat={OFFICE.lat} lng={OFFICE.lng} label="onTrack" />
        <a
          href={`https://www.openstreetmap.org/?mlat=${OFFICE.lat}&mlon=${OFFICE.lng}#map=17/${OFFICE.lat}/${OFFICE.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-[13px] underline text-grey"
        >
          Open in OpenStreetMap for directions
        </a>
      </div>

      <div className="card mt-10 p-6">
        <h2 className="text-[22px]">Faster answers</h2>
        <p className="mt-2 text-[14px] text-grey measure">
          The chat button in the corner answers the common stuff instantly — age eligibility,
          application deadlines, refunds, transfers and finding events. If it can’t help, it hands
          you straight to us.
        </p>
      </div>
    </div>
  );
}
