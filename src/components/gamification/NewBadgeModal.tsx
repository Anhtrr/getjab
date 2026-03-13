"use client";

import { BADGE_DEFINITIONS } from "@/lib/gamification/badges";
import BadgeIcon from "./BadgeIcon";
import type { BadgeRarity } from "@/lib/gamification/types";

const RARITY_GLOW: Record<BadgeRarity, string> = {
  common: "0 0 20px rgba(255,255,255,0.1)",
  rare: "0 0 20px rgba(96,165,250,0.3), 0 0 40px rgba(96,165,250,0.1)",
  epic: "0 0 20px rgba(168,85,247,0.3), 0 0 40px rgba(168,85,247,0.1)",
  legendary: "0 0 20px rgba(250,204,21,0.3), 0 0 40px rgba(250,204,21,0.1)",
};

const RARITY_BORDER: Record<BadgeRarity, string> = {
  common: "rgba(255,255,255,0.2)",
  rare: "rgba(96,165,250,0.4)",
  epic: "rgba(168,85,247,0.4)",
  legendary: "rgba(250,204,21,0.5)",
};

const RARITY_LABEL_COLOR: Record<BadgeRarity, string> = {
  common: "text-muted",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400",
};

const RARITY_BG: Record<BadgeRarity, string> = {
  common: "rgba(255,255,255,0.05)",
  rare: "rgba(96,165,250,0.1)",
  epic: "rgba(168,85,247,0.1)",
  legendary: "rgba(250,204,21,0.08)",
};

interface NewBadgeModalProps {
  badgeId: string;
  onDismiss: () => void;
}

export default function NewBadgeModal({ badgeId, onDismiss }: NewBadgeModalProps) {
  const badge = BADGE_DEFINITIONS.find((b) => b.id === badgeId);
  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-modal-overlay">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onDismiss} />
      <div className="relative z-10 text-center px-6 animate-modal-content">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-6">
          ACHIEVEMENT UNLOCKED
        </p>
        <div
          className="w-28 h-28 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-punch-slam"
          style={{
            background: RARITY_BG[badge.rarity],
            border: `3px solid ${RARITY_BORDER[badge.rarity]}`,
            boxShadow: RARITY_GLOW[badge.rarity],
          }}
        >
          <BadgeIcon icon={badge.icon} rarity={badge.rarity} size="lg" />
        </div>
        <h2 className="text-2xl font-black mb-1">{badge.name}</h2>
        <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${RARITY_LABEL_COLOR[badge.rarity]}`}>
          {badge.rarity}
        </p>
        <p className="text-muted text-sm mb-8">
          {badge.description}
        </p>
        <button
          onClick={onDismiss}
          className="btn-primary px-12 py-4 rounded-full text-lg"
        >
          Nice!
        </button>
      </div>
    </div>
  );
}
