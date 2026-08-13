import type { Metadata } from "next";
import { PolicyHeader, PolicyNote, PolicySection } from "@/components/policy";

export const metadata: Metadata = {
  title: "What the safeguarding badges mean",
  description: "Exactly what onTrack checked — and what it didn't — for each badge level.",
};

const LAST_UPDATED = "13 August 2026";

// This page must never overclaim. "Verified" describes checks of documents,
// not a guarantee of safety, and the copy says so plainly.

export default function VerificationPage() {
  return (
    <article>
      <PolicyHeader
        title="What the safeguarding badges mean"
        lastUpdated={LAST_UPDATED}
        toc={[
          { id: "self-certified", label: "“Safeguarding self-certified”" },
          { id: "verified", label: "“Safeguarding verified”" },
          { id: "neither", label: "Listings with no badge" },
          { id: "limits", label: "What no badge can promise" },
        ]}
      />

      <PolicySection id="self-certified" title="“Safeguarding self-certified”">
        <p>The organiser has formally declared to us, in writing, that they have:</p>
        <ul>
          <li>a written safeguarding policy reviewed in the last 12 months</li>
          <li>a named safeguarding lead we can contact</li>
          <li>Enhanced DBS checks with children’s barred list checks for everyone working in regulated activity with children</li>
          <li>NSPCC-guideline staffing ratios and first aid cover at their events</li>
          <li>public liability insurance in force</li>
        </ul>
        <p>
          With this badge, we hold their declaration. We have not yet inspected the documents
          behind it.
        </p>
      </PolicySection>

      <PolicySection id="verified" title="“Safeguarding verified”">
        <p>
          Everything in self-certification, plus: onTrack has actually seen the documents — the
          safeguarding policy itself, evidence of DBS checks, and the insurance certificate —
          and checked their dates and scope. We re-check annually and whenever anything is
          reported to us.
        </p>
      </PolicySection>

      <PolicySection id="neither" title="Listings with no badge">
        <p>
          A listing with no badge comes from an organiser who has not completed
          self-certification. Every listing, badged or not, still goes through onTrack’s
          editorial review before it is published.
        </p>
      </PolicySection>

      <PolicySection id="limits" title="What no badge can promise">
        <PolicyNote>
          <p>
            No badge means an event is guaranteed to be safe, and we will never use words like
            “safe”, “trusted” or “approved”. The badges describe paperwork we have received or
            inspected — nothing more. The organiser runs the event; onTrack does not supervise
            events. If anything at an event worries you,{" "}
            <a href="/report" className="underline">report it to us</a> and tell an adult you
            trust.
          </p>
        </PolicyNote>
      </PolicySection>
    </article>
  );
}
