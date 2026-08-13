import type { Metadata } from "next";
import { PolicyHeader, PolicyNote, PolicySection } from "@/components/policy";

export const metadata: Metadata = {
  title: "Safeguarding",
  description: "onTrack's safeguarding policy, contacts and escalation routes.",
};

const LAST_UPDATED = "13 August 2026";

export default function SafeguardingPage() {
  return (
    <article>
      <PolicyHeader
        title="Safeguarding"
        lastUpdated={LAST_UPDATED}
        toc={[
          { id: "help-now", label: "If you need help right now" },
          { id: "statement", label: "Our safeguarding statement" },
          { id: "dsl", label: "Who is responsible at onTrack" },
          { id: "escalation", label: "How concerns are escalated" },
          { id: "organisers", label: "What we require from organisers" },
          { id: "product", label: "How the product itself protects you" },
        ]}
      />

      <PolicySection id="help-now" title="If you need help right now">
        <PolicyNote>
          <ul>
            <li>
              <strong>In danger right now: call 999.</strong>
            </li>
            <li>
              <strong>Childline — 0800 1111.</strong> Free, confidential, any time, any age up
              to 19. childline.org.uk
            </li>
            <li>
              <strong>NSPCC — 0808 800 5000.</strong> For anyone worried about a child.
              help@nspcc.org.uk
            </li>
          </ul>
          <p>
            You never have to use onTrack’s own form to get help. These services are
            independent of us.
          </p>
        </PolicyNote>
      </PolicySection>

      <PolicySection id="statement" title="Our safeguarding statement">
        <p>
          onTrack exists so that 13–18 year olds can find things worth doing. Everyone who works
          on onTrack shares responsibility for their safety while they use it. We design the
          product so that no user can be contacted, profiled or identified through it; we review
          every listing before it is published; we require safeguarding commitments from every
          organiser; and we treat every concern reported to us as urgent until we know it is
          not. Safeguarding concerns take priority over every commercial relationship,
          including paid ones.
        </p>
      </PolicySection>

      <PolicySection id="dsl" title="Who is responsible at onTrack">
        <ul>
          <li>
            <strong>Designated Safeguarding Lead:</strong> [TODO: full name], [TODO: direct
            email], [TODO: direct phone]. {/* TODO: real DSL details before launch */}
          </li>
          <li>
            <strong>Deputy Safeguarding Lead:</strong> [TODO: full name], [TODO: direct
            email], [TODO: direct phone]. {/* TODO: real deputy details before launch */}
          </li>
        </ul>
        <p>
          The DSL reviews every concern report, keeps our safeguarding records, and has the
          authority to suspend any listing or organiser immediately, without reference to
          anyone else in the company.
        </p>
      </PolicySection>

      <PolicySection id="escalation" title="How concerns are escalated">
        <ol>
          <li>
            <strong>Immediate danger</strong> — we call 999, then inform the relevant local
            authority.
          </li>
          <li>
            <strong>Concern about a child’s welfare</strong> — referred to children’s social
            care in the child’s local authority (for our launch boroughs: Tower Hamlets,
            Newham, Hackney, Waltham Forest or Redbridge front door services).
          </li>
          <li>
            <strong>Concern about an adult working with children</strong> — referred to the
            Local Authority Designated Officer (LADO) in the borough where the organiser is
            based, and the listing is suspended while that referral is open.
          </li>
          <li>
            <strong>Online concern</strong> — grooming, exploitation or abuse online is
            reported to CEOP at ceop.police.uk.
          </li>
        </ol>
        <p>
          We acknowledge every report within 24 hours, act on safeguarding reports the same
          working day, and keep records of every referral and its outcome.
        </p>
      </PolicySection>

      <PolicySection id="organisers" title="What we require from organisers">
        <p>
          Every organiser accepts our <a href="/organiser-terms" className="underline">organiser terms</a>,
          which include a safeguarding self-certification: a named safeguarding contact, a
          written safeguarding policy, Enhanced DBS checks with children’s barred list checks
          for everyone in regulated activity, and public liability insurance. Where a listing
          shows a “Safeguarding verified” badge, we have seen those documents ourselves;
          “self-certified” means the organiser has formally declared them. We suspend listings
          immediately on any safeguarding concern, with no notice and no refund.
        </p>
      </PolicySection>

      <PolicySection id="product" title="How the product itself protects you">
        <ul>
          <li>No messaging, no comments, no public profiles — nobody can contact you through onTrack.</li>
          <li>Your age hides events you should not see; it is never shown to anyone.</li>
          <li>No precise location is ever collected or stored.</li>
          <li>Every listing is reviewed by a person before it is published.</li>
          <li>Report a concern is at the top of every page and never needs an account.</li>
        </ul>
      </PolicySection>
    </article>
  );
}
