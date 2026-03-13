"use client";

import { useState, useCallback } from "react";
import { Share2 } from "lucide-react";
import { shareLevelUpCard } from "@/lib/shareCard";
import { getDisplayName, setDisplayName } from "@/lib/displayName";
import type { PlayerLevel } from "@/lib/gamification/types";

interface LevelUpModalProps {
  level: PlayerLevel;
  onDismiss: () => void;
}

export default function LevelUpModal({ level, onDismiss }: LevelUpModalProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = useCallback(async () => {
    let name = getDisplayName();
    if (!name) {
      const input = window.prompt("What name should appear on your share card?");
      if (input && input.trim()) {
        setDisplayName(input.trim());
        name = input.trim();
      }
    }
    setIsSharing(true);
    try {
      await shareLevelUpCard({
        level: level.level,
        title: level.title,
        totalXP: level.currentXP,
        displayName: name ?? undefined,
      });
    } catch {
      // User cancelled or share failed
    } finally {
      setIsSharing(false);
    }
  }, [level]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-modal-overlay">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onDismiss} />
      <div className="relative z-10 text-center px-6 animate-modal-content">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-6 animate-pulse-ready">
          LEVEL UP
        </p>
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 animate-punch-slam"
          style={{
            background: "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,144,255,0.2))",
            border: "3px solid rgba(0,229,255,0.6)",
            boxShadow: "0 0 30px rgba(0,229,255,0.3), 0 0 60px rgba(0,229,255,0.1)",
          }}
        >
          <span className="text-6xl font-black text-accent">{level.level}</span>
        </div>
        <h2 className="text-3xl font-black text-gradient mb-2">
          {level.title}
        </h2>
        <p className="text-muted text-sm mb-8">
          You&apos;ve reached Level {level.level}
        </p>
        <button
          onClick={onDismiss}
          className="btn-primary px-12 py-4 rounded-full text-lg"
        >
          Continue
        </button>
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="mt-3 border border-accent/30 text-accent font-medium px-12 py-3 rounded-full flex items-center justify-center gap-2 mx-auto disabled:opacity-50 hover:bg-accent/5 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          {isSharing ? "Generating..." : "Share Level Up"}
        </button>
      </div>
    </div>
  );
}
