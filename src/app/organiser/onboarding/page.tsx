import type { Metadata } from "next";
import { OnboardingClient } from "./OnboardingClient";

export const metadata: Metadata = {
  title: "Organiser onboarding",
  description: "Set up your organisation on onTrack, including the safeguarding self-certification.",
};

export default function OnboardingPage() {
  return <OnboardingClient />;
}
