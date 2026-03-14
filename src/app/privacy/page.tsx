import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - Jab",
};

export default function PrivacyPage() {
  return (
    <div className="px-4 pt-8 pb-8 max-w-lg mx-auto">
      <Link
        href="/"
        className="text-muted text-sm hover:text-foreground mb-6 inline-block"
      >
        &larr; Home
      </Link>

      <h1 className="text-2xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted text-sm mb-8">Last updated: March 2026</p>

      <div className="space-y-4 stagger-children">
        <section className="card-glass rounded-2xl p-6 animate-fade-in-up">
          <h2 className="text-lg font-bold mb-3">No Data Collection</h2>
          <p className="text-sm text-muted leading-relaxed">
            Jab does not collect, store, or transmit any personal data.
            We do not require accounts, logins, or any form of registration.
          </p>
        </section>

        <section className="card-glass rounded-2xl p-6 animate-fade-in-up">
          <h2 className="text-lg font-bold mb-3">Local Storage Only</h2>
          <p className="text-sm text-muted leading-relaxed">
            All workout data, progress, and preferences are stored locally
            on your device using browser storage. This data never leaves
            your device and is not accessible to us or any third party.
          </p>
        </section>

        <section className="card-glass rounded-2xl p-6 animate-fade-in-up">
          <h2 className="text-lg font-bold mb-3">No Third-Party Tracking</h2>
          <p className="text-sm text-muted leading-relaxed">
            Jab does not use cookies, advertising trackers, or third-party
            analytics that identify individual users. We use Cloudflare Web
            Analytics, a privacy-friendly service that does not use cookies
            or collect personal data.
          </p>
        </section>

        <section className="card-glass rounded-2xl p-6 animate-fade-in-up">
          <h2 className="text-lg font-bold mb-3">No Accounts Required</h2>
          <p className="text-sm text-muted leading-relaxed">
            Jab works entirely without user accounts. There is no sign-up,
            no email collection, and no personal information required to use
            the app.
          </p>
        </section>

        <section className="card-glass rounded-2xl p-6 animate-fade-in-up">
          <h2 className="text-lg font-bold mb-3">Contact</h2>
          <p className="text-sm text-muted leading-relaxed">
            If you have questions about this privacy policy, please visit
            our{" "}
            <Link href="/support" className="text-accent hover:underline">
              support page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
