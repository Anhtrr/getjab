import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Support - Jab",
};

export default function SupportPage() {
  return (
    <div className="px-4 pt-8 pb-8 max-w-lg md:max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 animate-fade-in-up">Support</h1>
      <p className="text-muted text-sm mb-8">
        Need help? We&apos;re here for you.
      </p>

      <div className="space-y-4 stagger-children">
        <a
          href="mailto:support@getjab.app"
          className="block card-glass rounded-2xl p-5 hover:border-[#00e5ff]/20 transition-all duration-200 animate-fade-in-up"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00e5ff]/15 to-[#0090ff]/15 border border-[#00e5ff]/20 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-bold text-sm">Email Us</p>
              <p className="text-xs text-muted mt-0.5">support@getjab.app</p>
            </div>
          </div>
        </a>

        <a
          href="https://reddit.com/r/getjab"
          target="_blank"
          rel="noopener noreferrer"
          className="block card-glass rounded-2xl p-5 hover:border-[#00e5ff]/20 transition-all duration-200 animate-fade-in-up"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00e5ff]/15 to-[#0090ff]/15 border border-[#00e5ff]/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-bold text-sm">Community</p>
              <p className="text-xs text-muted mt-0.5">r/getjab on Reddit</p>
            </div>
          </div>
        </a>

        <Link
          href="/privacy"
          className="block card-glass rounded-2xl p-5 hover:border-[#00e5ff]/20 transition-all duration-200 animate-fade-in-up"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00e5ff]/15 to-[#0090ff]/15 border border-[#00e5ff]/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-bold text-sm">Privacy Policy</p>
              <p className="text-xs text-muted mt-0.5">How we handle your data</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-8 card-glass rounded-2xl p-6 animate-fade-in-up">
        <h2 className="text-lg font-bold mb-4">FAQ</h2>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold mb-1">Is my data backed up?</p>
            <p className="text-xs text-muted leading-relaxed">
              All data is stored locally on your device. You can export your
              data from Settings. Cloud backup is planned for a future update.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">Is Jab really free?</p>
            <p className="text-xs text-muted leading-relaxed">
              Yes. All current features are completely free with no ads. See
              our{" "}
              <Link href="/pricing" className="text-accent hover:underline">
                pricing page
              </Link>{" "}
              for details.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">How do I report a bug?</p>
            <p className="text-xs text-muted leading-relaxed">
              Send us an email at support@getjab.app with a description of the
              issue and what device and browser you&apos;re using.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
