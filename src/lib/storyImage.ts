import type { OnTrackEvent } from "./types";
import { eventAgeBadge } from "./age";
import { formatDateLong, formatPrice, formatTime } from "./format";

/**
 * Generates a 1080×1920 Instagram/TikTok story image for an event on a
 * canvas: Ink background, title in Space Grotesk, date, venue, age band,
 * price, onTrack wordmark. Returns a PNG blob.
 */
export async function generateStoryImage(event: OnTrackEvent): Promise<Blob> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  try {
    await document.fonts.load('700 96px "Space Grotesk"');
    await document.fonts.load('500 44px "Inter"');
  } catch {
    // system fallback fonts still produce a usable image
  }

  // Ink background
  ctx.fillStyle = "#111111";
  ctx.fillRect(0, 0, W, H);

  // Signal accent bar
  ctx.fillStyle = "#D9FF3D";
  ctx.fillRect(96, 300, 220, 24);

  // Title, wrapped, Space Grotesk
  ctx.fillStyle = "#FBF9F5";
  ctx.font = '700 96px "Space Grotesk", sans-serif';
  ctx.textBaseline = "top";
  const words = event.title.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > W - 192 && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  let y = 400;
  for (const l of lines.slice(0, 5)) {
    ctx.fillText(l, 96, y);
    y += 108;
  }

  // Details block
  y += 80;
  ctx.font = '500 44px "Inter", sans-serif';
  ctx.fillStyle = "#FBF9F5";
  const details = [
    `${formatDateLong(event.date)}, ${formatTime(event.date)}`,
    `${event.venue.name}, ${event.venue.area}`,
  ];
  for (const d of details) {
    ctx.fillText(d, 96, y);
    y += 72;
  }

  // Age band + price pills
  y += 40;
  const pill = (text: string, x: number, fill: string, color: string) => {
    ctx.font = '600 40px "Space Grotesk", sans-serif';
    const w = ctx.measureText(text).width + 64;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(x, y, w, 88, 44);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.fillText(text, x + 32, y + 22);
    return x + w + 24;
  };
  let x = 96;
  x = pill(eventAgeBadge(event), x, "#FBF9F5", "#111111");
  pill(formatPrice(event.price), x, "#D9FF3D", "#111111");

  // Logo: disc mark + gradient wordmark
  const markR = 40;
  const markCx = 96 + markR;
  const markCy = H - 180;
  ctx.save();
  ctx.fillStyle = "#FBF9F5";
  ctx.beginPath();
  ctx.arc(markCx, markCy, markR, 0, Math.PI * 2);
  ctx.fill();
  // diagonal track cut and centre hole, drawn in the background colour
  ctx.translate(markCx, markCy);
  ctx.rotate((38 * Math.PI) / 180);
  ctx.fillStyle = "#111111";
  ctx.fillRect(-7, -markR - 8, 14, markR * 2 + 16);
  ctx.rotate((-38 * Math.PI) / 180);
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.font = '700 88px "Space Grotesk", sans-serif';
  const wordX = markCx + markR + 28;
  const grad = ctx.createLinearGradient(wordX, 0, wordX + 400, 0);
  grad.addColorStop(0, "#3A7BC8");
  grad.addColorStop(0.5, "#2F9E77");
  grad.addColorStop(1, "#6FB52C");
  ctx.fillStyle = grad;
  ctx.fillText("ontrack", wordX, H - 220);
  ctx.fillStyle = "#D9FF3D";
  ctx.fillRect(wordX, H - 110, 300, 16);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Export failed"))), "image/png");
  });
}
