"use client";

import Link from "next/link";
import { Sparkles, Check, Lock } from "lucide-react";

const freeFeatures = [
  "All boxing & combat sports workouts",
  "Round timer with bell sounds & presets",
  "Real-time combo callouts (audio + visual)",
  "Progress tracking, streaks & heatmap",
  "XP, levels & 25+ achievement badges",
  "Personal records tracking",
  "Shareable workout cards",
  "Offline support — no internet needed",
  "No account required",
];

const proFeatures = [
  "Custom workout builder",
  "Cloud backup & sync across devices",
  "Advanced analytics & training trends",
  "Structured training programs",
];

export default function PricingPage() {
  return (
    <div className="px-4 pt-8 pb-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">
        Train Free. Forever.
      </h1>
      <p className="text-muted text-sm text-center mb-8">
        The full training experience is free — no paywalls, no ads, no account needed.
      </p>

      <div className="space-y-4 stagger-children">
        {/* Current Free Plan */}
        <div className="card-glass rounded-2xl p-6 relative border-2 !border-accent shadow-[0_0_20px_rgba(0,229,255,0.12),0_0_40px_rgba(0,229,255,0.06)] animate-fade-in-up">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00e5ff] to-[#0090ff] text-black text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_8px_rgba(0,229,255,0.2)] tracking-wider">
            CURRENT PLAN
          </span>
          <h2 className="text-xl font-bold mb-1">Free</h2>
          <p className="text-3xl font-black mb-4">
            $0
            <span className="text-sm font-normal text-muted">/forever</span>
          </p>
          <ul className="space-y-2 mb-6">
            {freeFeatures.map((f, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/workouts"
            className="block w-full text-center btn-primary py-3 rounded-full"
          >
            Start Training
          </Link>
        </div>

        {/* Pro Coming Soon */}
        <div className="card-glass rounded-2xl p-6 animate-fade-in-up opacity-70">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold">Pro — Coming Soon</h2>
          </div>
          <p className="text-sm text-muted mb-4">
            We&apos;re building advanced tools for serious fighters.
            Everything above stays free — Pro adds power features on top.
          </p>
          <ul className="space-y-2">
            {proFeatures.map((f, i) => (
              <li key={i} className="text-sm flex items-start gap-2 text-muted">
                <Lock className="w-3.5 h-3.5 text-muted mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
