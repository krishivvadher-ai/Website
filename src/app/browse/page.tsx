import { Suspense } from "react";
import type { Metadata } from "next";
import { BrowseClient } from "./BrowseClient";

export const metadata: Metadata = {
  title: "Browse events",
  description: "Everything on near you — fun and useful, filtered to what you can actually attend.",
};

export default function BrowsePage() {
  return (
    <Suspense fallback={null}>
      <BrowseClient />
    </Suspense>
  );
}
