import type { Metadata } from "next";
import { PolicyHeader, PolicySection } from "@/components/policy";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Accessibility statement for onTrack — built to WCAG 2.2 Level AA.",
};

const LAST_UPDATED = "13 August 2026";

// Accessibility statement in the GDS format.

export default function AccessibilityPage() {
  return (
    <article>
      <PolicyHeader
        title="Accessibility statement for onTrack"
        lastUpdated={LAST_UPDATED}
        toc={[
          { id: "scope", label: "What this statement covers" },
          { id: "how-accessible", label: "How accessible this website is" },
          { id: "feedback", label: "Feedback and contact information" },
          { id: "enforcement", label: "Enforcement procedure" },
          { id: "technical", label: "Technical information" },
          { id: "non-accessible", label: "Non-accessible content" },
          { id: "preparation", label: "Preparation of this statement" },
        ]}
      />

      <PolicySection id="scope" title="What this statement covers">
        <p>
          This statement applies to the onTrack website. We want as many people as possible to
          be able to use it. That means, for example, that you should be able to:
        </p>
        <ul>
          <li>zoom in up to 200% without text spilling off the screen</li>
          <li>navigate the whole site with a keyboard alone, with a visible focus indicator</li>
          <li>use every feature of the map through the list view instead — nothing is map-only</li>
          <li>use the site with a screen reader, with meaningful headings and labels</li>
          <li>use the site without motion: animations stop when your device asks for reduced motion</li>
        </ul>
      </PolicySection>

      <PolicySection id="how-accessible" title="How accessible this website is">
        <p>
          We build to WCAG 2.2 Level AA. Text and interface colours meet contrast minimums;
          touch targets meet the 24×24 CSS pixel minimum; forms have visible labels; nothing
          relies on colour alone. Discovery never requires location or a map: everything on the
          map is equally available as a list, deliberately, because geolocation-only discovery
          disadvantages young people without smartphones or in transport-poor areas.
        </p>
      </PolicySection>

      <PolicySection id="feedback" title="Feedback and contact information">
        <p>
          If you find anything you cannot use, or you need information from this site in a
          different format, contact onTrack@gmail.com or 020 7946 0958. We respond within two
          working days and we treat accessibility reports as bugs, not requests.
        </p>
      </PolicySection>

      <PolicySection id="enforcement" title="Enforcement procedure">
        <p>
          If you contact us and are not happy with our response, contact the Equality Advisory
          and Support Service (EASS) at equalityadvisoryservice.com.
        </p>
      </PolicySection>

      <PolicySection id="technical" title="Technical information about this website's accessibility">
        <p>
          onTrack is committed to making its website accessible. This website is partially
          compliant with the Web Content Accessibility Guidelines version 2.2 Level AA, due to
          the non-compliances listed below.
        </p>
      </PolicySection>

      <PolicySection id="non-accessible" title="Non-accessible content">
        <ul>
          <li>
            The interactive map itself is not fully operable by screen reader; the complete
            equivalent list view is one tap away and carries the same information.
          </li>
          <li>
            Some generated poster images are decorative and marked as such; where they carry a
            title word it is duplicated in the adjacent text.
          </li>
        </ul>
        <p>We review this list at every release.</p>
      </PolicySection>

      <PolicySection id="preparation" title="Preparation of this statement">
        <p>
          This statement was prepared on {LAST_UPDATED}. The site was last tested against WCAG
          2.2 Level AA by the onTrack team using keyboard-only navigation, contrast tooling and
          screen reader spot checks. {/* TODO: commission an external audit before launch */}
        </p>
      </PolicySection>
    </article>
  );
}
