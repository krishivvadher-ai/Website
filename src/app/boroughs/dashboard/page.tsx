import type { Metadata } from "next";
import { BoroughDashboardClient } from "./BoroughDashboardClient";

export const metadata: Metadata = {
  title: "Borough dashboard",
  description: "The borough partnership dashboard — youth activity, provision gaps and impact reporting for council teams.",
};

export default function BoroughDashboardPage() {
  return <BoroughDashboardClient />;
}
