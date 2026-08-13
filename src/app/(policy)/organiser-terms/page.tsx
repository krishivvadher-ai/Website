import type { Metadata } from "next";
import { PolicyHeader, PolicyNote, PolicySection } from "@/components/policy";

export const metadata: Metadata = {
  title: "Organiser terms",
  description: "The terms for listing events on onTrack, including safeguarding requirements.",
};

const LAST_UPDATED = "13 August 2026";

export default function OrganiserTermsPage() {
  return (
    <article>
      <PolicyHeader
        title="Organiser terms"
        lastUpdated={LAST_UPDATED}
        toc={[
          { id: "relationship", label: "The relationship" },
          { id: "publishing", label: "Publishing and editorial control" },
          { id: "tier-a", label: "Safeguarding self-certification (Tier A)" },
          { id: "conduct", label: "Organiser Code of Conduct" },
          { id: "insurance", label: "Insurance" },
          { id: "suspension", label: "Suspension" },
          { id: "fees", label: "Fees and billing" },
          { id: "general", label: "General terms" },
        ]}
      />

      <PolicySection id="relationship" title="The relationship">
        <p>
          These terms apply to every organisation that lists events on onTrack, on any tier
          including the free one. You run your events; we run the platform. You are at all
          times solely responsible for the safety, supervision, staffing, insurance and
          delivery of your events. Nothing in these terms makes onTrack an operator,
          co-organiser or supervisor of any event.
        </p>
      </PolicySection>

      <PolicySection id="publishing" title="Publishing and editorial control">
        <p>
          onTrack is the publisher of all listings. When you submit a listing it enters a
          pending state and is not visible to the public. An onTrack reviewer checks every
          listing — and may edit it for clarity, age accuracy and safeguarding — before it is
          published. We may decline, amend or unpublish any listing at our discretion. You
          warrant that everything you submit is accurate, that you hold the rights to any
          material in it, and that the age range you state is correct.
        </p>
      </PolicySection>

      <PolicySection id="tier-a" title="Safeguarding self-certification (Tier A)">
        <p>By listing any event open to under-18s, you certify all of the following:</p>
        <ol>
          <li>You have a written safeguarding and child protection policy, reviewed within the last 12 months, and you have given us a copy or a public link to it.</li>
          <li>You have a named safeguarding lead, and you have given us their name and contact details.</li>
          <li>
            Everyone engaged by you in regulated activity with children holds an Enhanced DBS
            certificate with a children’s barred list check, assessed against the scope of
            regulated activity as it applies from 1 September 2026.
          </li>
          <li>Staffing ratios at your events follow NSPCC guidance for the age group attending.</li>
          <li>At least one person with a current paediatric-appropriate first aid qualification is present at every event.</li>
          <li>You will tell us within 24 hours of any safeguarding allegation or incident connected to a listed event.</li>
        </ol>
        <p>
          “Self-certified” on a listing means you have made these declarations.
          “Verified” means onTrack has additionally inspected the underlying documents. We
          may audit any declaration at any time, and false certification is grounds for
          immediate permanent removal.
        </p>
      </PolicySection>

      <PolicySection id="conduct" title="Organiser Code of Conduct">
        <ul>
          <li>Describe events honestly: real price with every fee shown, real age range, real programme.</li>
          <li>Never collect more personal data from attendees than the event genuinely needs, and never use attendee data for marketing to under-18s.</li>
          <li>Never contact a young person through channels not visible to your safeguarding lead.</li>
          <li>Honour advertised free places and advertised prices.</li>
          <li>Communicate cancellations and changes as soon as they are known, so we can update the listing and notify savers.</li>
          <li>Cooperate fully and promptly with any safeguarding enquiry from onTrack, a local authority or the police.</li>
        </ul>
      </PolicySection>

      <PolicySection id="insurance" title="Insurance">
        <p>
          You must hold public liability insurance appropriate to your events — no less than
          £5 million per claim unless we agree otherwise in writing — and keep it in force for
          every listed event. We record your insurer, limit and expiry at onboarding and may
          request the certificate at any time.
        </p>
      </PolicySection>

      <PolicySection id="suspension" title="Suspension">
        <PolicyNote>
          <p>
            On any safeguarding concern — reported by a user, a parent, an authority or our own
            review — we may suspend any or all of your listings <strong>immediately, with no
            notice and no refund</strong> of any fees for any tier. Suspension is not a finding
            of fault; it is how we hold the ring while a concern is looked at. We reinstate
            promptly when a concern is resolved.
          </p>
        </PolicyNote>
      </PolicySection>

      <PolicySection id="fees" title="Fees and billing">
        <p>
          Listing is free. Paid tiers (Boost at £29/month, Partner at £149/month) are billed
          monthly in advance and can be cancelled at any time, taking effect at the end of the
          billing period. Borough partnerships (£6,000/year) and school and college licences
          (£995/year) are billed annually under separate order forms. No onTrack fee is ever
          charged to a young person.
        </p>
      </PolicySection>

      <PolicySection id="general" title="General terms">
        <p>
          Either side may end the relationship at any time; published listings come down when
          you leave. These terms are governed by the law of England and Wales. Questions:
          onTrack@gmail.com, or onTrack, 27 Clerkenwell Close, London EC1R 0AT.
        </p>
      </PolicySection>
    </article>
  );
}
