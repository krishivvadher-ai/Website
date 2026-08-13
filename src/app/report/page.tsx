import type { Metadata } from "next";
import { ReportClient } from "./ReportClient";

export const metadata: Metadata = {
  title: "Report a concern",
  description: "Tell us about anything on onTrack that worried you. We read every report.",
};

export default function ReportPage() {
  return <ReportClient />;
}
