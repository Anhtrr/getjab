"use client";

import { useState, useCallback } from "react";
import type { PersonalRecord } from "@/lib/gamification/types";
import { sharePRCard } from "@/lib/shareCard";
import { getDisplayName, setDisplayName } from "@/lib/displayName";
import { useGamification } from "@/hooks/useGamification";
import { Trophy, Share2 } from "lucide-react";

const PR_LABELS: Record<string, { label: string; unit: string }> = {
  longest_workout: { label: "Longest Workout", unit: "min" },
  most_rounds: { label: "Most Rounds", unit: "rounds" },
  longest_streak: { label: "Longest Streak", unit: "days" },
  most_workouts_week: { label: "Best Week", unit: "workouts" },
  most_workouts_month: { label: "Best Month", unit: "workouts" },
  most_minutes_week: { label: "Best Week (Time)", unit: "min" },
  total_workouts: { label: "Total Workouts", unit: "" },
  total_minutes: { label: "Total Training", unit: "min" },
  most_punches: { label: "Most Punches", unit: "punches" },
  highest_punches_per_min: { label: "Best Intensity", unit: "punches/min" },
};

interface PersonalRecordsListProps {
  records: Record<string, PersonalRecord>;
  newPRs?: PersonalRecord[];
}

export default function PersonalRecordsList({ records, newPRs = [] }: PersonalRecordsListProps) {
  const newPRIds = new Set(newPRs.map((p) => p.type));
  const entries = Object.entries(records).filter(
    ([, pr]) => pr.value > 0,
  );
  const { gameState } = useGamification();
  const [sharingType, setSharingType] = useState<string | null>(null);

  const handleSharePR = useCallback(async (type: string, pr: PersonalRecord) => {
    if (!gameState) return;
    const info = PR_LABELS[type];
    if (!info) return;

    let name = getDisplayName();
    if (!name) {
      const input = window.prompt("What name should appear on your share card?");
      if (input && input.trim()) {
        setDisplayName(input.trim());
        name = input.trim();
      }
    }

    setSharingType(type);
    try {
      await sharePRCard({
        prLabel: info.label,
        prUnit: info.unit,
        value: pr.value,
        previousValue: pr.previousValue,
        level: gameState.level.level,
        title: gameState.level.title,
        streakCurrent: gameState.streak.current,
        displayName: name ?? undefined,
      });
    } catch {
      // User cancelled or share failed
    } finally {
      setSharingType(null);
    }
  }, [gameState]);

  if (entries.length === 0) return null;

  return (
    <div>
      <h3 className="font-bold text-lg mb-3">Personal Records</h3>
      <div className="grid grid-cols-2 gap-2 stagger-children">
        {entries.map(([type, pr]) => {
          const info = PR_LABELS[type];
          if (!info) return null;
          const isNew = newPRIds.has(type as PersonalRecord["type"]);
          return (
            <button
              key={type}
              onClick={() => handleSharePR(type, pr)}
              disabled={sharingType === type}
              className={`w-full text-left card-glass rounded-xl p-3 transition-all hover:border-[#00e5ff]/20 ${
                isNew ? "!border-accent/40 !shadow-[0_0_12px_rgba(0,229,255,0.15)] animate-punch-slam" : ""
              } ${sharingType === type ? "opacity-50" : ""}`}
            >
              <div className="flex items-start gap-2">
                <Trophy
                  className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                    isNew ? "text-accent" : "text-muted"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-[10px] text-muted uppercase tracking-wider">
                    {info.label}
                  </p>
                  <p className="font-bold text-lg leading-tight tabular-nums">
                    {pr.value.toLocaleString()}
                    {info.unit && (
                      <span className="text-xs text-muted ml-1">{info.unit}</span>
                    )}
                  </p>
                </div>
                <Share2 className="w-3 h-3 text-muted mt-1 shrink-0" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
