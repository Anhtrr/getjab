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
  const dragStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging = useRef(false);
  const scrollYRef = useRef(0);

  const xp = calculateXP(
    log,
    workout?.level ?? "beginner",
    0,
  );

  // Retroactively compute calories for old logs that don't have them
  const calories = log.caloriesEstimate ?? estimateCalories(log.durationMin, workout?.level ?? "beginner");

  const dismiss = useCallback(() => {
    setDismissing(true);
    setTimeout(() => onClose(), 300);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    scrollYRef.current = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, []);

  // Swipe-to-dismiss handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    // Only allow drag when scrolled to top
    if (sheet.scrollTop > 0) return;
    dragStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const deltaY = e.touches[0].clientY - dragStartY.current;
    if (deltaY > 0) {
      isDragging.current = true;
      // Rubber-band resistance — gets harder to drag the further you go
      setDragOffset(deltaY * 0.6);
      e.preventDefault();
    } else {
      dragStartY.current = null;
      setDragOffset(0);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (dragOffset > 80) {
      dismiss();
    } else {
      setDragOffset(0);
    }
    dragStartY.current = null;
    isDragging.current = false;
  }, [dragOffset, dismiss]);

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
    : dragOffset > 0
      ? { transform: `translateY(${dragOffset}px)`, transition: isDragging.current ? "none" : "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)" }
      : { transition: "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)" };

  const backdropOpacity = dismissing
    ? 0
    : dragOffset > 0
      ? Math.max(0, 1 - dragOffset / 200)
      : 1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      onClick={dismiss}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        style={{ opacity: backdropOpacity, transition: "opacity 0.3s ease-out" }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`relative w-full max-w-lg bg-surface rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto overscroll-contain ${dismissing ? "" : "animate-slide-in-bottom"}`}
        style={{ ...sheetStyle, paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 5rem)" }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle — visual swipe affordance */}
        <div className="flex justify-center mb-4 cursor-grab">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

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
            <p className={`text-lg font-bold ${ratingColors[log.rating]}`}>
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
