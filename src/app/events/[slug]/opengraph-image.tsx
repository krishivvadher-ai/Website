import { ImageResponse } from "next/og";
import { eventBySlug, EVENTS } from "@/lib/events";
import { eventAgeBadge } from "@/lib/age";
import { formatDate, formatPrice } from "@/lib/format";

// Open Graph image per event, so links pasted into group chats carry a real
// preview — sharing is the acquisition mechanic.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    // Ask Google Fonts for a TTF (satori cannot use woff2) by presenting a
    // legacy user agent, then fetch the file itself.
    const css = await fetch("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.30" },
    }).then((r) => r.text());
    const url = css.match(/src: url\((https:[^)]+)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = eventBySlug(slug);
  const font = await loadFont();

  if (!event || !font) {
    // Fallback: brand mark only — never fail the page over a preview image
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#111111",
          }}
        >
          <div style={{ display: "flex", width: 220, height: 36, backgroundColor: "#D9FF3D" }} />
        </div>
      ),
      size
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 64,
          backgroundColor: "#111111",
          color: "#FBF9F5",
          fontFamily: "Space Grotesk",
        }}
      >
        <div style={{ display: "flex", width: 200, height: 14, backgroundColor: "#D9FF3D", marginBottom: 32 }} />
        <div style={{ display: "flex", fontSize: 64, lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: 1000 }}>
          {event.title}
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 28, fontSize: 30, color: "#FBF9F5" }}>
          <span>{formatDate(event.date)}</span>
          <span style={{ opacity: 0.6 }}>·</span>
          <span>
            {event.venue.name}, {event.venue.area}
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 28, fontSize: 26 }}>
          <span
            style={{
              display: "flex",
              backgroundColor: "#FBF9F5",
              color: "#111111",
              padding: "8px 22px",
              borderRadius: 999,
            }}
          >
            {eventAgeBadge(event)}
          </span>
          <span
            style={{
              display: "flex",
              backgroundColor: "#D9FF3D",
              color: "#111111",
              padding: "8px 22px",
              borderRadius: 999,
            }}
          >
            {formatPrice(event.price)}
          </span>
          <span style={{ display: "flex", padding: "8px 0", marginLeft: "auto", color: "#D9FF3D" }}>ontrack</span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Space Grotesk", data: font, weight: 700, style: "normal" }] }
  );
}
