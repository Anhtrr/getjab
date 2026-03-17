"use client";

import { useState, useEffect } from "react";
import type { XPBreakdown } from "@/lib/gamification/types";
import { ChevronDown, ChevronUp } from "lucide-react";

interface XPGainToastProps {
  breakdown: XPBreakdown;
  onDismiss: () => void;
}

export default function XPGainToast({ breakdown, onDismiss }: XPGainToastProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(onDismiss, expanded ? 8000 : 4000);
    return () => clearTimeout(timer);
  }, [onDismiss, expanded]);

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-40 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto animate-slide-in-bottom"
    >
      <div className="card-glass rounded-2xl p-4 !border-accent/30 !shadow-[0_0_20px_rgba(0,229,255,0.15)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-accent animate-punch-slam">
              +{breakdown.total}
            </span>
            <span className="text-sm font-bold text-accent">XP</span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-border space-y-1 animate-fade-in">
            {breakdown.base > 0 && <Row label="Base" value={breakdown.base} />}
            {breakdown.durationBonus > 0 && <Row label="Duration" value={breakdown.durationBonus} />}
            {breakdown.completionBonus > 0 && <Row label="All Rounds" value={breakdown.completionBonus} />}
            {breakdown.difficultyBonus > 0 && <Row label="Difficulty" value={breakdown.difficultyBonus} />}
            {breakdown.streakBonus > 0 && <Row label="Streak" value={breakdown.streakBonus} />}
            {breakdown.ratingBonus > 0 && <Row label="Effort" value={breakdown.ratingBonus} />}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted">{label}</span>
      <span className="text-foreground font-mono">+{value}</span>
    </div>
  );
}
