import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You",
  description: "Your age, your settings, your data, and your 'What I've done' record — all on your device.",
};

export default function YouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
