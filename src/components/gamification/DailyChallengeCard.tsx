"use client";

import type { DailyChallenge, DailyChallengeProgress } from "@/lib/gamification/types";
import { Target, Check } from "lucide-react";

interface DailyChallengeCardProps {
  challenge: DailyChallenge;
  progress: DailyChallengeProgress;
}

export default function DailyChallengeCard({ challenge, progress }: DailyChallengeCardProps) {
  const percent = challenge.target > 0 ? Math.min(Math.round((progress.current / challenge.target) * 100), 100) : 0;

  return (
    <div
      className={`card-glass rounded-2xl p-4 transition-all ${
        progress.completed ? "!border-green-500/30" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            progress.completed
              ? "bg-green-500/15"
              : "bg-accent/10"
          }`}
        >
          {progress.completed ? (
            <Check className="w-5 h-5 text-green-400" />
          ) : (
            <Target className="w-5 h-5 text-accent" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-xs text-muted uppercase tracking-wider font-medium">
              Daily Challenge
            </p>
            <span className="text-xs font-bold text-accent">
              +{challenge.xpReward} XP
            </span>
          </div>
          <p className="font-medium text-sm">{challenge.title}</p>
          <p className="text-xs text-muted mt-0.5">{challenge.description}</p>

          {!progress.completed && (
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-[10px] text-muted mb-1">
                <span>{progress.current}/{challenge.target}</span>
                <span>{percent}%</span>
              </div>
              <div className="bg-border/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00e5ff] to-[#0090ff] transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}
          {progress.completed && (
            <p className="text-xs text-green-400 font-medium mt-1.5">
              Completed!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
