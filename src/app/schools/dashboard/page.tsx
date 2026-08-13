import type { Metadata } from "next";
import { SchoolDashboardClient } from "./SchoolDashboardClient";

export const metadata: Metadata = {
  title: "School dashboard",
  description: "The staff dashboard for the onTrack school licence — picks, deadlines and destinations reporting.",
};

export default function SchoolDashboardPage() {
  return <SchoolDashboardClient />;
}
