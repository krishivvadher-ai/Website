import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EVENTS, eventBySlug } from "@/lib/events";
import { formatDate, formatPrice } from "@/lib/format";
import { EventDetailGate } from "./EventDetailGate";

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

// Open Graph and Twitter card metadata so links pasted in group chats
// preview properly. Title, date, venue and price only — no listing body,
// since eligibility is checked client-side before content renders.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = eventBySlug(slug);
  if (!event) return { title: "Event not found" };
  const description = `${formatDate(event.date)} · ${event.venue.name}, ${event.venue.area} · ${formatPrice(event.price)}`;
  return {
    title: event.title,
    description,
    openGraph: {
      title: `${event.title} · onTrack`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} · onTrack`,
      description,
    },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = eventBySlug(slug);
  if (!event) notFound();
  return <EventDetailGate slug={slug} />;
}
