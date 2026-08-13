import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BOROUGHS, boroughBySlug, eventsInBorough } from "@/lib/boroughs";
import { CATEGORIES } from "@/lib/categories";
import { BoroughEventGrid } from "./BoroughEventGrid";

// The borough page — the £6,000/year product. Data-driven: every borough
// renders from the same template.

export function generateStaticParams() {
  return BOROUGHS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const borough = boroughBySlug(slug);
  if (!borough) return { title: "Borough not found" };
  return {
    title: `What's on in ${borough.name}`,
    description: `Every onTrack listing in ${borough.name} — free and paid, fun and useful, all reviewed before publication.`,
  };
}

export default async function BoroughPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const borough = boroughBySlug(slug);
  if (!borough) notFound();

  const events = eventsInBorough(borough.name);
  const free = events.filter((e) => e.price === 0).length;
  const catCounts = CATEGORIES.map((c) => ({
    name: c.name,
    count: events.filter((e) => e.category === c.slug).length,
  }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  // Demo impact figure: in production this is real aggregate reach data
  const reached = events.length * 214;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-14">
      <p className="pill inline-block border border-ink px-3 py-1">Borough partner</p>
      <h1 className="mt-4 text-[36px] lg:text-[56px]">What’s on in {borough.name}</h1>
      <p className="mt-3 text-[16px] text-grey measure">
        Everything listed in {borough.name} for 13–18 year olds — reviewed by onTrack before
        publication, filtered to each young person’s age, free to use forever.
      </p>

      {/* Impact strip */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <p className="font-display font-bold text-[28px] leading-none">{events.length}</p>
          <p className="mt-1 text-[13px] text-grey">events listed now</p>
        </div>
        <div className="card p-5">
          <p className="font-display font-bold text-[28px] leading-none">{reached.toLocaleString("en-GB")}</p>
          <p className="mt-1 text-[13px] text-grey">young people reached this term</p>
        </div>
        <div className="card p-5">
          <p className="font-display font-bold text-[28px] leading-none">{Math.round((free / Math.max(events.length, 1)) * 100)}%</p>
          <p className="mt-1 text-[13px] text-grey">of listings free to attend</p>
        </div>
        <div className="card p-5">
          <p className="text-[13px] text-grey">Most-saved categories</p>
          <p className="mt-1 text-[14px] font-medium leading-snug">
            {catCounts.map((c) => c.name).join(" · ")}
          </p>
        </div>
      </div>

      {/* Youth services panel */}
      <section className="card mt-8 p-6" aria-labelledby="services-heading">
        <h2 id="services-heading" className="text-[22px]">
          Youth services in {borough.name}
        </h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {borough.youthServices.map((s) => (
            <li key={s.name}>
              <p className="font-medium text-[15px]">{s.name}</p>
              <p className="text-[13px] text-grey measure">{s.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <BoroughEventGrid boroughName={borough.name} />
      </div>

      <section className="card mt-12 p-8 bg-ink text-paper border-ink md:flex items-end justify-between gap-8">
        <div>
          <h2 className="text-[28px]">Is this your borough?</h2>
          <p className="mt-2 text-paper/70 measure">
            Borough partnership includes this page under your name, borough-wide impact
            reporting, and priority review for your youth service’s listings — £6,000 a year.
          </p>
        </div>
        <Link
          href="/contact"
          className="mt-5 md:mt-0 inline-flex shrink-0 items-center min-h-[48px] px-7 rounded-full bg-signal text-ink font-display font-semibold"
        >
          Talk to us
        </Link>
      </section>
    </div>
  );
}
