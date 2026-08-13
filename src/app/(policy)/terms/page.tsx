import type { Metadata } from "next";
import { PolicyHeader, PolicyNote, PolicySection } from "@/components/policy";

export const metadata: Metadata = {
  title: "Terms",
  description: "Plain-English terms of use — what onTrack is, and what it isn't.",
};

const LAST_UPDATED = "13 August 2026";

export default function TermsPage() {
  return (
    <article>
      <PolicyHeader
        title="Terms of use"
        lastUpdated={LAST_UPDATED}
        toc={[
          { id: "what-ontrack-is", label: "What onTrack is (read this first)" },
          { id: "using", label: "Using onTrack" },
          { id: "listings", label: "Who publishes the listings" },
          { id: "responsibility", label: "What we are responsible for" },
          { id: "changes", label: "Changes and endings" },
          { id: "law", label: "The legal bits" },
        ]}
      />

      <PolicySection id="what-ontrack-is" title="What onTrack is (read this first)">
        <PolicyNote>
          <p>
            <strong>onTrack is a listings platform.</strong> We help you find events. The
            organiser runs the event — not us. onTrack does not supervise events, and onTrack
            staff are not present at them.
          </p>
          <p>
            Before you go to anything: tell someone you trust where you are going, check the
            organiser’s details on the event page, and if anything at an event feels wrong,
            leave and tell an adult you trust. You can also tell us using Report a concern —
            it is at the top of every page.
          </p>
        </PolicyNote>
      </PolicySection>

      <PolicySection id="using" title="Using onTrack">
        <ul>
          <li>onTrack is for 13–18 year olds. It is free, and it will stay free.</li>
          <li>You do not need an account, an email address or a phone number to browse.</li>
          <li>Be honest about your age. The age filter only protects you if it is right.</li>
          <li>Booking a place at an event is an arrangement between you and the organiser. Their rules (and their refund policy) apply to the event itself.</li>
          <li>Do not use onTrack to do anything against the law, and do not try to break, scrape or overload the service.</li>
        </ul>
      </PolicySection>

      <PolicySection id="listings" title="Who publishes the listings">
        <p>
          Every listing on onTrack is published by onTrack. Organisers submit listings, and our
          team reviews each one — for clarity, age accuracy and safeguarding — before it appears
          anywhere on the service. We may edit a listing before publishing it, and we can remove
          or suspend any listing at any time. There is no user-generated content on onTrack: no
          comments, no reviews, no messaging, no user uploads.
        </p>
        <p>
          Getting a listing right matters to us, but the information in it comes from the
          organiser. If a detail is wrong — the time, the price, the age range — tell us and
          we will fix it fast.
        </p>
      </PolicySection>

      <PolicySection id="responsibility" title="What we are responsible for">
        <ul>
          <li>We are responsible for the service: what is listed, how it is described, and how your data is handled.</li>
          <li>The organiser is responsible for the event: safety on the day, supervision, insurance, and delivering what was advertised.</li>
          <li>We are not responsible for loss or disappointment caused by an event being changed or cancelled by its organiser — though report it and we will chase.</li>
          <li>Nothing in these terms takes away rights the law gives you.</li>
        </ul>
      </PolicySection>

      <PolicySection id="changes" title="Changes and endings">
        <p>
          If we change these terms in a way that matters, we will say so on this page and date
          it at the top. If you keep using onTrack after a change, that means you accept it. You
          can stop using onTrack at any time — and delete everything it stored — from the You
          tab.
        </p>
      </PolicySection>

      <PolicySection id="law" title="The legal bits">
        <p>
          These terms are governed by the law of England and Wales. Because our users are under
          18, we rely on legitimate interests rather than contract for core data processing —
          see the <a href="/privacy" className="underline">privacy notice</a>. Questions about
          these terms: onTrack@gmail.com or 27 Clerkenwell Close, London EC1R 0AT.
        </p>
      </PolicySection>
    </article>
  );
}
