import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "About onTrack",
  description:
    "onTrack helps 13–18 year olds find things worth their time — one place to find, fit and never miss what's on. Built in East London.",
};

// The page a judge or a journalist looks for: who we are, in one screen.

const FOUNDERS = [
  {
    name: "[Founder name — TODO]",
    role: "Co-founder — product",
    note: "Leads the consumer product and the research programme with young Londoners.",
  },
  {
    name: "[Founder name — TODO]",
    role: "Co-founder — partnerships",
    note: "Leads borough, school and organiser relationships across East London.",
  },
  {
    name: "[Founder name — TODO]",
    role: "Co-founder — operations & safeguarding",
    note: "Leads trust, safety and the editorial review of every listing.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-[840px] mx-auto px-6 py-12 lg:py-16">
      <Logo markClass="h-8 w-8" textClass="text-[30px]" />
      <h1 className="mt-6 text-[28px] lg:text-[40px] max-w-[20ch]">
        One place for 13–18 year olds to find things worth their time.
      </h1>
      <p className="mt-4 text-[16px] text-grey measure">
        Teenagers told us the same three things everywhere we asked: they don’t know where to
        look, half of what they find they’re not old enough for, and the good stuff closes
        applications before they hear about it. onTrack fixes those three things — find it,
        fit it, never miss it — free for every young person, forever, funded by the
        organisations that run and support youth events rather than by ads or ticket fees.
      </p>

      <h2 className="mt-12 text-[22px]">The founders</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {FOUNDERS.map((f) => (
          <div key={f.role} className="card p-5">
            <p className="font-display font-semibold text-[16px]">{f.name}</p>
            <p className="text-[13px] text-grey">{f.role}</p>
            <p className="mt-2 text-[13px] text-grey measure">{f.note}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-[22px]">Press and contact</h2>
      <p className="mt-3 text-[15px] measure">
        onTrack, 27 Clerkenwell Close, London EC1R 0AT · onTrack@gmail.com · 020 7946 0958.
        We reply to journalists the same day. For how the product protects young people, start
        with our <Link href="/safeguarding" className="underline">safeguarding policy</Link> and{" "}
        <Link href="/privacy" className="underline">privacy notice</Link> — the short versions
        are genuinely short.
      </p>
    </div>
  );
}
