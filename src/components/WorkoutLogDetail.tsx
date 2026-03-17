"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { X, Share2, Clock, Target, Flame, Zap, Trophy, Gauge } from "lucide-react";
import { shareWorkoutCard } from "@/lib/shareCard";
import { getDisplayName, setDisplayName } from "@/lib/displayName";
import { estimateCalories } from "@/lib/calories";
import { workouts } from "@/data/workouts";
import { calculateXP } from "@/lib/gamification/engine";
import { useGamification } from "@/hooks/useGamification";
import type { WorkoutLog } from "@/lib/types";

const ratingLabels: Record<number, string> = {
  1: "Easy",
  2: "Just Right",
  3: "Tough",
  4: "Destroyed Me",
};

const ratingColors: Record<number, string> = {
  1: "text-green-400",
  2: "text-accent",
  3: "text-orange-400",
  4: "text-red-400",
};

interface Props {
  log: WorkoutLog;
  onClose: () => void;
}

export default function WorkoutLogDetail({ log, onClose }: Props) {
  const [isSharing, setIsSharing] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const { gameState } = useGamification();
  const workout = workouts.find((w) => w.id === log.workoutId);
  const sheetRef = useRef<HTMLDivElement>(null);

  const xp = calculateXP(
    log,
    workout?.level ?? "beginner",
    0,
  );

  // Retroactively compute calories for old logs that don't have them
  const calories = log.caloriesEstimate ?? estimateCalories(log.durationMin, workout?.level ?? "beginner");

  const dismiss = useCallback(() => {
    setDismissing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  // Prevent background scrolling while sheet is open
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // iOS: prevent touch-scroll on areas outside the sheet
    const preventScroll = (e: TouchEvent) => {
      if (sheetRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
    };
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  const handleShare = useCallback(async () => {
    if (!gameState) return;
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
      await shareWorkoutCard({
        workoutTitle: workout?.title || log.workoutTitle || log.workoutId,
        roundsCompleted: log.roundsCompleted,
        totalRounds: log.totalRounds,
        durationMin: log.durationMin,
        xpEarned: xp.total,
        level: gameState.level.level,
        title: gameState.level.title,
        streakCurrent: gameState.streak.current,
        date: log.date,
        displayName: name ?? undefined,
        punchesThrown: log.punchStats?.total,
        caloriesEstimate: calories,
        currentXP: gameState.level.currentXP,
        xpForNextLevel: gameState.level.xpForNextLevel,
        progressPercent: gameState.level.progressPercent,
      });
    } catch {
      // User cancelled or share failed
    } finally {
      setIsSharing(false);
    }
  }, [log, workout, gameState, xp, calories]);

  const sheetStyle: React.CSSProperties = dismissing
    ? { transform: "translateY(100%)", transition: "transform 0.3s cubic-bezier(0.4, 0, 1, 1)" }
    : { transition: "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)" };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      onClick={dismiss}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        style={{ opacity: dismissing ? 0 : 1, transition: "opacity 0.3s ease-out" }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`relative w-full max-w-lg md:max-w-2xl lg:max-w-4xl bg-surface rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto overscroll-contain ${dismissing ? "" : "animate-slide-in-bottom"}`}
        style={{ ...sheetStyle, paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-5 right-5 p-2 text-muted hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-1">
          {workout?.title || log.workoutTitle || log.workoutId}
        </h2>
        <p className="text-sm text-muted mb-5">
          {new Date(log.completedAt || log.date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          {log.completedAt && (
            <span className="ml-1">
              at{" "}
              {new Date(log.completedAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          )}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="card-glass rounded-xl p-3 text-center">
            <Target className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold">{log.roundsCompleted}/{log.totalRounds}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted">Rounds</p>
          </div>
          <div className="card-glass rounded-xl p-3 text-center">
            <Clock className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold">{log.durationMin}<span className="text-xs font-normal text-muted">m</span></p>
            <p className="text-[10px] uppercase tracking-wider text-muted">Duration</p>
          </div>
          <div className="card-glass rounded-xl p-3 text-center">
            <Zap className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold">+{xp.total}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted">XP</p>
          </div>

          {log.punchStats && log.punchStats.total > 0 && (
            <div className="card-glass rounded-xl p-3 text-center">
              <Trophy className="w-4 h-4 text-accent mx-auto mb-1" />
              <p className="text-lg font-bold">{log.punchStats.total}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted">Punches</p>
            </div>
          )}

          {calories > 0 && (
            <div className="card-glass rounded-xl p-3 text-center">
              <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <p className="text-lg font-bold">~{calories}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted">Calories</p>
            </div>
          )}

          <div className="card-glass rounded-xl p-3 text-center">
            <Gauge className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className={`text-sm font-bold whitespace-nowrap ${ratingColors[log.rating]}`}>
              {ratingLabels[log.rating]}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted">Effort</p>
          </div>
        </div>

        {/* Punch breakdown */}
        {log.punchStats && log.punchStats.total > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Punch Breakdown</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(log.punchStats.byType)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <span key={type} className="text-xs bg-surface-elevated px-2.5 py-1 rounded-full text-muted">
                    {count} {type}{count !== 1 ? "s" : ""}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Share button */}
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="w-full btn-secondary border border-accent/30 text-accent font-medium py-3.5 rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Share2 className="w-5 h-5" />
          {isSharing ? "Generating..." : "Share Workout"}
        </button>
      </div>
    </div>
  );
}
