import type { Metadata } from "next";
import { PolicyHeader, PolicyNote, PolicySection } from "@/components/policy";

export const metadata: Metadata = {
  title: "Cookies",
  description: "onTrack sets no third-party cookies. Here is everything it stores.",
};

const LAST_UPDATED = "13 August 2026";

export default function CookiesPage() {
  return (
    <article>
      <PolicyHeader
        title="Cookies and storage"
        lastUpdated={LAST_UPDATED}
        toc={[
          { id: "position", label: "The one-line version" },
          { id: "storage", label: "Everything we store, listed" },
          { id: "why-no-banner", label: "Why there is no consent banner" },
        ]}
      />

      <PolicySection id="position" title="The one-line version">
        <PolicyNote>
          <p>
            <strong>onTrack sets no third-party cookies, no advertising identifiers and no
            tracking of any kind.</strong> The only things stored are a few settings on your
            own device, listed in full below.
          </p>
        </PolicyNote>
      </PolicySection>

      <PolicySection id="storage" title="Everything we store, listed">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px] min-w-[560px]">
            <thead>
              <tr className="text-left text-grey border-b border-line">
                <th className="py-2 pr-4 font-medium">Key</th>
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 pr-4 font-medium">What it does</th>
                <th className="py-2 font-medium">Expires</th>
              </tr>
            </thead>
            <tbody className="[&_td]:py-2 [&_td]:pr-4 [&_tr]:border-b [&_tr]:border-line">
              <tr>
                <td>ontrack.v1</td>
                <td>Local storage</td>
                <td>Your age band, saved events, notes and settings</td>
                <td>When you delete it (You → Your data)</td>
              </tr>
              <tr>
                <td>ontrack.agegate.v1</td>
                <td>Local storage</td>
                <td>Records that an under-13 date of birth was entered, to pause re-entry for 24 hours</td>
                <td>24 hours</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[14px] text-grey">
          That is the complete list. There are no analytics cookies, no social media pixels,
          and no cross-site anything. Any usage measurement we do is server-side and
          aggregate-only — counts, never identities — as described in the{" "}
          <a href="/privacy" className="underline">privacy notice</a>.
        </p>
      </PolicySection>

      <PolicySection id="why-no-banner" title="Why there is no consent banner">
        <p>
          Consent banners exist to legitimise non-essential tracking. We do not do any, so
          there is nothing to consent to: the storage above is strictly necessary for features
          you asked for, which UK law (PECR) does not require a banner for. For a service used
          by 13–18 year olds we think this is the only honest position — and if that ever
          changes, any choice we offer will show Accept and Reject with identical weight.
        </p>
      </PolicySection>
    </article>
  );
}
