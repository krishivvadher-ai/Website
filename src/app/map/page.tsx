import type { Metadata } from "next";
import { MapPageClient } from "./MapPageClient";

export const metadata: Metadata = {
  title: "Map",
  description: "Everything on near you, on a map — pins show the price, not a teardrop.",
};

export default function MapPage() {
  return <MapPageClient />;
}
