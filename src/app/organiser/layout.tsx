import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organiser dashboard",
  description: "List events, submit them for review, and see how they perform.",
};

export default function OrganiserLayout({ children }: { children: React.ReactNode }) {
  return children;
}
