import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved",
  description: "Events you've saved — deadlines tracked automatically.",
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
