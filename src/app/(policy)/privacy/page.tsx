import type { Metadata } from "next";
import { PolicyHeader, PolicyNote, PolicySection } from "@/components/policy";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What onTrack stores, what it never stores, and how to delete it.",
};

// Layered privacy notice. The short version at the top is written for a
// reading age of nine to eleven — ICO Children's Code Standard 4 requires
// transparency a child can actually use, not a stylistic choice.

const LAST_UPDATED = "13 August 2026";

export default function PrivacyPage() {
  return (
    <article>
      <PolicyHeader
        title="Privacy"
        lastUpdated={LAST_UPDATED}
        toc={[
          { id: "short", label: "The short version" },
          { id: "what", label: "What we collect, field by field" },
          { id: "never", label: "What we never do" },
          { id: "full", label: "The full notice" },
          { id: "rights", label: "Your rights" },
          { id: "contact", label: "Questions and complaints" },
        ]}
      />

      <PolicySection id="short" title="The short version">
        <PolicyNote>
          <ul>
            <li>We store your age band, your saved events and your reminder settings.</li>
            <li>All of that stays on your own phone or computer — not on our servers.</li>
            <li>We never store your exact location, your school, or your real name.</li>
            <li>Nobody else can see your age or anything you save. Not organisers, not other users.</li>
            <li>We never sell anything about you, and we never show you targeted ads.</li>
            <li>
              To delete everything, go to <a href="/you" className="underline">You → Your data → Delete</a>. It works
              straight away.
            </li>
            <li>If something worries you, tell us at onTrack@gmail.com or use Report a concern.</li>
            <li>A grown-up who wants the detail can read the full notice below.</li>
          </ul>
        </PolicyNote>
      </PolicySection>

      <PolicySection id="what" title="What we collect, field by field">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px] min-w-[640px]">
            <thead>
              <tr className="text-left text-grey border-b border-line">
                <th className="py-2 pr-4 font-medium">Data</th>
                <th className="py-2 pr-4 font-medium">Why we need it</th>
                <th className="py-2 pr-4 font-medium">Where it lives &amp; how long</th>
                <th className="py-2 font-medium">Lawful basis</th>
              </tr>
            </thead>
            <tbody className="[&_td]:py-2 [&_td]:pr-4 [&_tr]:border-b [&_tr]:border-line">
              <tr>
                <td>Age band (or date of birth, if you choose to enter one)</td>
                <td>To hide events you are not old enough — or too old — to attend</td>
                <td>Your device only, until you delete it</td>
                <td>Legitimate interests</td>
              </tr>
              <tr>
                <td>Saved events and attendance notes</td>
                <td>Your saved list, deadlines and “What I’ve done”</td>
                <td>Your device only, until you delete them</td>
                <td>Legitimate interests</td>
              </tr>
              <tr>
                <td>Reminder settings</td>
                <td>To send only the reminders you switched on</td>
                <td>Your device only, until you delete them</td>
                <td>Consent (each reminder is opt-in)</td>
              </tr>
              <tr>
                <td>Approximate location (only if you tap “Use my location”)</td>
                <td>To centre the map once. Used in the moment, never stored</td>
                <td>Not stored at all</td>
                <td>Consent (one tap, one use)</td>
              </tr>
              <tr>
                <td>Support chat messages</td>
                <td>To answer your question and check answer quality</td>
                <td>Our servers, deleted within 90 days</td>
                <td>Legitimate interests</td>
              </tr>
              <tr>
                <td>Concern reports</td>
                <td>To act on safeguarding and content concerns</td>
                <td>Kept as long as safeguarding law requires</td>
                <td>Legal obligation / legitimate interests</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[14px] text-grey">
          Our primary lawful basis for core processing is legitimate interests rather than
          contract, because a contract with a person under 18 is voidable and cannot safely
          carry a child’s data rights. Where we rely on consent, it is a real choice: unticked
          by default, easy to withdraw, and never a condition of using onTrack.
        </p>
      </PolicySection>

      <PolicySection id="never" title="What we never do">
        <PolicyNote>
          <ul>
            <li>We never sell data. To anyone, for anything.</li>
            <li>We never run behavioural or targeted advertising.</li>
            <li>We never store precise coordinates or track where you go.</li>
            <li>We never train any AI model on user data.</li>
            <li>We never build a profile of you, and we never recommend events based on one.</li>
            <li>We never show any user’s information to another user or to an organiser.</li>
          </ul>
        </PolicyNote>
      </PolicySection>

      <PolicySection id="full" title="The full notice (for parents, schools, councils and organisers)">
        <p>
          onTrack is a listings service that helps 13–18 year olds in London find events and track
          application deadlines. This section is the complete notice for adults with
          responsibility for a young person, and for our organisation customers.
        </p>
        <p>
          <strong>Controller.</strong> onTrack (contact details below) is the data controller for
          the processing described here. Organisers are independent controllers of anything a
          young person gives them directly when they attend an event — that processing is covered
          by the organiser’s own notice, and our organiser terms require them to have one.
        </p>
        <p>
          <strong>Architecture.</strong> The consumer product is deliberately local-first: age
          band, saved events, notes and settings are stored in the browser’s local storage on the
          user’s own device and are not transmitted to onTrack. Server-side processing is limited
          to support chat (retained no longer than 90 days), concern reports, and aggregate,
          non-identifying usage counts.
        </p>
        <p>
          <strong>Retention schedule.</strong> Device-stored data: until the user deletes it, which
          they can do at any time from the You tab. Support chat transcripts: 90 days. Concern
          reports and safeguarding records: in line with statutory safeguarding retention
          guidance, reviewed annually. Aggregate statistics contain no personal data and are kept
          indefinitely.
        </p>
        <p>
          <strong>International transfers.</strong> onTrack is hosted in the UK/EEA. Where a
          supplier processes data outside the UK, we rely on UK adequacy regulations or the
          International Data Transfer Agreement, and we list those suppliers in this notice.
          {/* TODO: list actual suppliers before launch */}
        </p>
        <p>
          <strong>Children’s Code.</strong> We apply the ICO Age Appropriate Design Code to every
          user, whatever age they state: high-privacy defaults, geolocation off, no profiling, no
          nudge techniques, and transparency written for the age of our youngest likely user.
        </p>
      </PolicySection>

      <PolicySection id="rights" title="Your rights">
        <p>Whatever your age, you can:</p>
        <ul>
          <li>ask for a copy of anything we hold about you (most of it is already on your device — you can download it from the You tab)</li>
          <li>ask us to correct anything that is wrong</li>
          <li>delete everything, instantly, from the You tab</li>
          <li>object to any processing, and withdraw any consent, without losing access to onTrack</li>
          <li>complain to the ICO at ico.org.uk or 0303 123 1113 — you do not need our permission</li>
        </ul>
        <p>
          You do not need a parent’s help to use these rights, though you are welcome to bring
          one.
        </p>
      </PolicySection>

      <PolicySection id="contact" title="Questions and complaints">
        <p>
          Email onTrack@gmail.com, call 020 7946 0958 (Monday–Friday, 9am–5pm), or write to
          onTrack, 27 Clerkenwell Close, London EC1R 0AT. We reply within one working day.
        </p>
      </PolicySection>
    </article>
  );
}
