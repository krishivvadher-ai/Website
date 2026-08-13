import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { publishedEvents } from "@/lib/events";
import { SchoolEventGrid } from "./SchoolEventGrid";

// The school/college page — the £995/year product. Data-driven template;
// one demo school is seeded. A real school's page carries its own name and
// its careers lead's picks.

interface SchoolInfo {
  slug: string;
  name: string;
  area: string;
  note: string;
}

const SCHOOLS: SchoolInfo[] = [
  {
    slug: "demo-sixth-form",
    name: "Example Sixth Form College",
    area: "Stratford",
    note: "This is a demonstration school page. A live page carries the school's name, its careers lead's picks, and term-date-aware highlights.",
  },
];

export function generateStaticParams() {
  return SCHOOLS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const school = SCHOOLS.find((s) => s.slug === slug);
  if (!school) return { title: "School not found" };
  return {
    title: `Opportunities for ${school.name}`,
    description: `Events and opportunities picked for ${school.name} students — deadlines tracked, ages filtered.`,
  };
}

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = SCHOOLS.find((s) => s.slug === slug);
  if (!school) notFound();

  const withDeadlines = publishedEvents().filter((e) => e.applicationDeadline).length;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-14">
      <p className="pill inline-block border border-ink px-3 py-1">School licence</p>
      <h1 className="mt-4 text-[36px] lg:text-[56px]">Opportunities for {school.name}</h1>
      <p className="mt-3 text-[16px] text-grey measure">{school.note}</p>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="font-display font-bold text-[28px] leading-none">{withDeadlines}</p>
          <p className="mt-1 text-[13px] text-grey">live application deadlines tracked</p>
        </div>
        <div className="card p-5">
          <p className="font-display font-bold text-[28px] leading-none">UCAS-ready</p>
          <p className="mt-1 text-[13px] text-grey">
            students build a “What I’ve done” record for the new question 3
          </p>
        </div>
        <div className="card p-5">
          <p className="font-display font-bold text-[28px] leading-none">£0</p>
          <p className="mt-1 text-[13px] text-grey">cost to students, always</p>
        </div>
      </div>

      <div className="mt-10">
        <SchoolEventGrid />
      </div>

      <section className="card mt-12 p-8 bg-ink text-paper border-ink md:flex items-end justify-between gap-8">
        <div>
          <h2 className="text-[28px]">For schools and colleges</h2>
          <p className="mt-2 text-paper/70 measure">
            A page like this under your school’s name, staff picks, a deadline digest and
            destinations-friendly reporting — £995 a year, unlimited students.
          </p>
        </div>
        <div className="mt-5 md:mt-0 flex shrink-0 flex-wrap gap-3">
          <Link
            href="/schools/dashboard"
            className="inline-flex items-center min-h-[48px] px-7 rounded-full border border-paper text-paper font-display font-semibold hover:bg-paper hover:text-ink transition-colors"
          >
            Try the staff dashboard
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center min-h-[48px] px-7 rounded-full bg-signal text-ink font-display font-semibold"
          >
            Talk to us
          </Link>
        </div>
      </section>
    </div>
  );
}
