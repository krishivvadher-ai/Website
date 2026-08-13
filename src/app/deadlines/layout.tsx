import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deadlines",
  description: "Application deadlines from your saved events, on a calendar, soonest first.",
};

export default function DeadlinesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
