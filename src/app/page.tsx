import Link from "next/link";
import { Ticker } from "@/components/Ticker";
import { LandingFeed } from "@/components/LandingFeed";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { CATEGORIES } from "@/lib/categories";

// Landing page: editorial and typographic — a poster wall, not a SaaS
// dashboard. Fun and useful get equal weight everywhere on this page.

export default function LandingPage() {
  return (
    <>
      <HeroSlideshow />

      <Ticker />

      <section className="max-w-[1200px] mx-auto px-6 py-16 lg:py-24">
        <h2 className="text-[28px] lg:text-[40px]">Three jobs. In order.</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Find",
              body: "One searchable place instead of fifteen scattered ones. If it’s on near you, it’s in here.",
            },
            {
              n: "02",
              title: "Fit",
              body: "Set your age once and everything you can’t attend disappears. Filter by price, distance and type — nothing shown is out of reach.",
            },
            {
              n: "03",
              title: "Don’t miss it",
              body: "Application deadlines tracked separately from event dates, with reminders you choose. Finding something too late is the same as not finding it.",
            },
          ].map((item) => (
            <div key={item.n} className="card p-6">
              <span className="font-display font-bold text-signal text-[28px] bg-ink px-2 leading-tight inline-block">
                {item.n}
              </span>
              <h3 className="mt-4 text-[22px]">{item.title}</h3>
              <p className="mt-2 text-[15px] text-grey measure">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[28px] lg:text-[40px]">Fun and useful. Never one without the other.</h2>
          <p className="mt-4 text-[16px] text-paper/70 measure">
            Half of you want somewhere to relax and meet people. Half want things that get you
            somewhere. Almost everyone wants both — so the feed never makes you pick a lane.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href="/browse"
                  className="pill inline-flex min-h-[44px] items-center border border-paper/40 px-4 py-2 hover:bg-paper hover:text-ink transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LandingFeed />

      <section className="max-w-[1200px] mx-auto px-6 py-16 lg:py-24">
        <div className="card p-8 lg:p-12 md:flex items-end justify-between gap-8">
          <div>
            <h2 className="text-[28px] lg:text-[40px]">Run something worth doing?</h2>
            <p className="mt-3 text-grey measure">
              List it free. Reach 13–18 year olds who are actually looking, with tools that write
              the listing with you and catch age-band mistakes before they cost you attendees.
            </p>
          </div>
          <Link
            href="/organiser"
            className="mt-6 md:mt-0 inline-flex shrink-0 items-center min-h-[48px] px-7 rounded-full bg-ink text-paper font-display font-semibold text-[16px]"
          >
            List an event
          </Link>
        </div>
      </section>
    </>
  );
}
