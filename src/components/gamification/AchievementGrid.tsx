"use client";

import { useState, useMemo } from "react";
import type { EarnedBadge, BadgeRarity } from "@/lib/gamification/types";
import { BADGE_DEFINITIONS } from "@/lib/gamification/badges";
import BadgeIcon from "./BadgeIcon";
import { Lock } from "lucide-react";

const RARITY_BORDER: Record<BadgeRarity, string> = {
  common: "border-white/10",
  rare: "border-blue-400/25",
  epic: "border-purple-400/25",
  legendary: "border-yellow-400/30",
};

const RARITY_GLOW: Record<BadgeRarity, string> = {
  common: "",
  rare: "shadow-[0_0_8px_rgba(96,165,250,0.08)]",
  epic: "shadow-[0_0_8px_rgba(168,85,247,0.08)]",
  legendary: "shadow-[0_0_12px_rgba(250,204,21,0.12)]",
};

const RARITY_LABEL_COLORS: Record<BadgeRarity, string> = {
  common: "text-muted",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400",
};

interface AchievementGridProps {
  earned: EarnedBadge[];
}

export default function AchievementGrid({ earned }: AchievementGridProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const earnedIds = useMemo(() => new Set(earned.map((b) => b.badgeId)), [earned]);
  const earnedCount = earnedIds.size;

  const selectedBadge = selected ? BADGE_DEFINITIONS.find((b) => b.id === selected) : null;
  const selectedEarned = selected ? earned.find((b) => b.badgeId === selected) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">Achievements</h3>
        <span className="text-xs text-muted tabular-nums">
          {earnedCount}/{BADGE_DEFINITIONS.length}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 stagger-children">
        {BADGE_DEFINITIONS.map((badge) => {
          const isEarned = earnedIds.has(badge.id);
          return (
            <button
              key={badge.id}
              onClick={() => setSelected(selected === badge.id ? null : badge.id)}
              aria-label={`${badge.name}${isEarned ? " — earned" : " — locked"}`}
              className={`aspect-square rounded-xl flex items-center justify-center transition-all border ${
                isEarned
                  ? `bg-surface/80 ${RARITY_BORDER[badge.rarity]} ${RARITY_GLOW[badge.rarity]}`
                  : "bg-border/10 border-transparent opacity-30"
              } ${selected === badge.id ? "ring-2 ring-accent/40 scale-105" : "hover:scale-[1.03]"}`}
            >
              {isEarned ? (
                <BadgeIcon icon={badge.icon} rarity={badge.rarity} size="sm" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-muted/40" />
              )}
            </button>
          );
        })}
      </div>

      {selectedBadge && (
        <div className={`card-glass rounded-xl p-3 mt-3 animate-fade-in border ${
          earnedIds.has(selectedBadge.id) ? RARITY_BORDER[selectedBadge.rarity] : "border-transparent"
        }`}>
          <div className="flex items-center gap-3 mb-1">
            <BadgeIcon
              icon={selectedBadge.icon}
              rarity={selectedBadge.rarity}
              size="md"
              earned={earnedIds.has(selectedBadge.id)}
            />
            <div>
              <p className="font-bold text-sm">{selectedBadge.name}</p>
              <p className={`text-[10px] uppercase font-bold tracking-wider ${RARITY_LABEL_COLORS[selectedBadge.rarity]}`}>
                {selectedBadge.rarity}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted mt-1">{selectedBadge.description}</p>
          {selectedEarned && (
            <p className="text-[10px] text-accent mt-1.5">
              Earned {new Date(selectedEarned.earnedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
