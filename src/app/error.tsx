"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Jab app error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted text-sm mb-6">
          An unexpected error occurred. Your workout data is safe.
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="block w-full btn-primary py-3 rounded-full text-sm font-bold"
          >
            Try Again
          </button>
          <a
            href="/"
            className="block w-full btn-secondary border border-border text-muted font-medium py-3 rounded-full text-sm"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
