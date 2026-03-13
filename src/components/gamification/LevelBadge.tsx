"use client";

import type { PlayerLevel } from "@/lib/gamification/types";

interface LevelBadgeProps {
  level: PlayerLevel;
  compact?: boolean;
}

export default function LevelBadge({ level, compact }: LevelBadgeProps) {
  if (compact) {
    return (
      <div className="card-glass rounded-2xl p-4 flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,144,255,0.15))",
            border: "2px solid rgba(0,229,255,0.4)",
            boxShadow: "0 0 12px rgba(0,229,255,0.15)",
          }}
        >
          <span className="text-xl font-black text-accent">{level.level}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted uppercase tracking-wider font-medium">
            {level.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 bg-border/50 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00e5ff] to-[#0090ff] transition-all duration-1000 ease-out"
                style={{ width: `${level.progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-muted tabular-nums shrink-0">
              Lv.{level.level}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-3"
        style={{
          background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,144,255,0.15))",
          border: "3px solid rgba(0,229,255,0.5)",
          boxShadow: "0 0 20px rgba(0,229,255,0.2), 0 0 40px rgba(0,229,255,0.08)",
        }}
      >
        <span className="text-4xl font-black text-accent">{level.level}</span>
      </div>
      <h2 className="text-xl font-bold text-gradient">{level.title}</h2>
      <p className="text-xs text-muted mt-1">
        {level.currentXP.toLocaleString()} XP total
      </p>
      <div className="mt-3 max-w-xs mx-auto">
        <div className="flex items-center justify-between text-[10px] text-muted mb-1">
          <span>{(level.currentXP - level.xpForCurrentLevel).toLocaleString()} XP</span>
          <span>{(level.xpForNextLevel - level.xpForCurrentLevel).toLocaleString()} XP</span>
        </div>
        <div className="bg-border/50 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00e5ff] to-[#0090ff] transition-all duration-1000 ease-out"
            style={{ width: `${level.progressPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-muted mt-1">
          {(level.xpForNextLevel - level.currentXP).toLocaleString()} XP to Level {level.level + 1}
        </p>
      </div>
    </div>
  );
}
