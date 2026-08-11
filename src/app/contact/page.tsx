import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Email, call or visit the onTrack team — we answer within a working day.",
};

export default function ContactPage() {
  return <ContactClient />;
}
