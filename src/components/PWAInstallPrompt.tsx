"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Only show if not already dismissed
      const dismissed = localStorage.getItem("jab_install_dismissed");
      if (!dismissed) {
        // Delay to not interrupt initial experience
        setTimeout(() => setShowPrompt(true), 5000);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("jab_install_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
      <div className="glass border border-white/5 rounded-2xl p-4 shadow-xl flex items-center gap-4 animate-slide-in-bottom">
        <div className="flex-1">
          <p className="font-bold text-sm">Install Jab</p>
          <p className="text-xs text-muted">
            Add to your home screen for the best experience
          </p>
        </div>
        <button
          onClick={handleInstall}
          className="bg-gradient-to-r from-[#00e5ff] to-[#0090ff] text-black text-sm font-bold px-4 py-2 rounded-full shrink-0"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="text-muted hover:text-foreground text-lg shrink-0"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
