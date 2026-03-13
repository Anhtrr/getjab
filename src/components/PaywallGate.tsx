"use client";

import Link from "next/link";
import { useSubscription } from "@/hooks/useSubscription";
import { Lock } from "lucide-react";

interface PaywallGateProps {
  children: React.ReactNode;
}

export default function PaywallGate({ children }: PaywallGateProps) {
  const { isSubscribed } = useSubscription();

  if (isSubscribed) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none opacity-50">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="glass border border-[#00e5ff]/10 rounded-2xl p-6 text-center max-w-sm mx-4 glow-accent animate-fade-in-scale">
          <Lock className="w-10 h-10 text-muted mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-1">Pro Content</h3>
          <p className="text-sm text-muted mb-4">
            Unlock all workouts, progress tracking, and more with Jab Pro.
          </p>
          <Link
            href="/pricing"
            className="inline-block btn-primary px-6 py-3 rounded-full"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  );
}
