import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For organisers",
  description:
    "List youth events free, forever. Reach 13–18 year olds in East London who are actually looking — and pay only for reach, never per ticket.",
};

// The sales page. The audience is a youth worker or a small charity with no
// marketing budget, and a council or school procurement officer reading over
// their shoulder. Honest arithmetic beats adjectives.

const TIERS = [
  {
    name: "List",
    price: "Free, always",
    monthly: null,
    features: [
      "Unlimited listings",
      "Appear in browse and on the map",
      "Basic view counts",
      "Editorial review and publication by onTrack",
    ],
    cta: { label: "Start listing", href: "/organiser/onboarding" },
    highlight: false,
  },
  {
    name: "Boost",
    price: "£29 / month",
    monthly: "£29",
    features: [
      "Everything in List",
      "Featured placement in browse",
      "A deadline push to everyone who saved your event",
      "Applicant analytics",
      "Calendar sync",
      "Safeguarding Verified badge (after document checks)",
    ],
    cta: { label: "Start with Boost", href: "/organiser/onboarding" },
    highlight: true,
  },
  {
    name: "Partner",
    price: "£149 / month",
    monthly: "£149",
    features: [
      "Everything in Boost",
      "For multi-site organisations: up to 25 venues",
      "API access",
      "Impact reporting formatted for funders",
    ],
    cta: { label: "Talk to us", href: "/contact" },
    highlight: false,
  },
];

export default function ForOrganisersPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 lg:py-16">
      <p className="pill inline-block border border-ink px-3 py-1">For organisers</p>
      <h1 className="mt-5 text-[36px] lg:text-[56px] max-w-[18ch]">
        The 13–18 year olds you run events for are on here, looking.
      </h1>
      <p className="mt-4 text-[18px] text-grey measure">
        onTrack is where East London teenagers find things worth doing. Listing is free and
        stays free — you pay only if you want more reach, never per ticket.
      </p>

      {/* ------------------------------------------------------------ tiers */}
      <div className="mt-12 grid gap-6 lg:grid-cols-3 items-start">
        {TIERS.map((tier) => (
          <div key={tier.name} className={`card p-6 ${tier.highlight ? "border-ink" : ""}`}>
            {tier.highlight && <p className="pill inline-block bg-signal text-ink px-2.5 py-1 mb-3">Most popular</p>}
            <h2 className="text-[22px]">{tier.name}</h2>
            <p className="mt-1 font-display font-bold text-[28px]">{tier.price}</p>
            <ul className="mt-4 space-y-2 text-[14px]">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span aria-hidden="true" className="text-grey">
                    —
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={tier.cta.href}
              className={`mt-6 inline-flex items-center min-h-[48px] px-6 rounded-full font-display font-semibold text-[15px] ${
                tier.highlight ? "bg-signal text-ink border border-ink" : "border border-ink hover:bg-ink hover:text-paper transition-colors"
              }`}
            >
              {tier.cta.label}
            </Link>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[13px] text-grey measure">
        Boroughs (£6,000/year) and schools and colleges (£995/year) have their own products —{" "}
        <Link href="/boroughs/tower-hamlets" className="underline">
          see a live borough page
        </Link>
        , try the{" "}
        <Link href="/schools/dashboard" className="underline">
          school staff dashboard
        </Link>{" "}
        or <Link href="/contact" className="underline">talk to us</Link>.
      </p>

      {/* --------------------------------------------- the honest arithmetic */}
      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <div className="card p-8">
          <h2 className="text-[28px]">What it costs you to reach 100 teenagers</h2>
          <div className="mt-4 space-y-4 text-[15px] measure">
            <p>
              <strong>Flyers:</strong> a 1,000-flyer print run is roughly £120, plus a day of
              legwork. Typical response is 1–2%, so reaching 100 genuinely interested teenagers
              costs £600–£1,200 and several print runs.
            </p>
            <p>
              <strong>Social media ads:</strong> you can’t. Behavioural targeting of under-18s
              is prohibited, so paid social either misses your audience or breaks the rules
              reaching it.
            </p>
            <p>
              <strong>School assemblies:</strong> free but slow — each school is its own
              negotiation, and you present to everyone rather than the ones who’d come.
            </p>
            <p>
              <strong>onTrack:</strong> a free listing goes in front of local 13–18s who opened
              an app to find something to do. Boost, at £29 a month, adds featured placement
              and a deadline push to everyone who saved your event — people who already told
              us they’re interested.
            </p>
          </div>
        </div>
        <div className="card p-8">
          <h2 className="text-[28px]">Why we are free to list</h2>
          <div className="mt-4 space-y-4 text-[15px] measure">
            <p>
              Most youth events are free to attend. A platform that takes a cut of ticket sales
              earns nothing on a free event — which is exactly why nobody else serves this
              market, and why the platforms that exist keep nudging youth organisers towards
              ticketing fees.
            </p>
            <p>
              We charge for reach and tooling on the supply side — organisers, boroughs,
              schools — and never per ticket, never per young person. That means a free games
              night and a paid workshop get the same shop window, and your free event is a
              first-class citizen, not a loss leader.
            </p>
            <p>
              The consumer side stays free, with no ads. That is a product decision and a legal
              one: behavioural advertising to minors is prohibited, and we would not build on
              it anyway.
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- cta */}
      <section className="mt-16 card p-8 lg:p-12 md:flex items-end justify-between gap-8 bg-ink text-paper border-ink">
        <div>
          <h2 className="text-[28px] lg:text-[40px]">List your first event today.</h2>
          <p className="mt-3 text-paper/70 measure">
            Ten minutes of onboarding — including the safeguarding self-certification every
            organiser completes — and your first listing goes to our reviewers.
          </p>
        </div>
        <Link
          href="/organiser/onboarding"
          className="mt-6 md:mt-0 inline-flex shrink-0 items-center min-h-[48px] px-7 rounded-full bg-signal text-ink font-display font-semibold text-[16px]"
        >
          Get started
        </Link>
      </section>
    </div>
  );
}
