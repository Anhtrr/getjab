"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useGamification } from "@/hooks/useGamification";
import { workouts } from "@/data/workouts";
import ProgressCalendar from "@/components/ProgressCalendar";
import DailyChallengeCard from "@/components/gamification/DailyChallengeCard";
import StreakShieldDisplay from "@/components/gamification/StreakShieldDisplay";
import { BadgeIconContainer } from "@/components/gamification/BadgeIcon";
import { BADGE_DEFINITIONS } from "@/lib/gamification/badges";
import WorkoutLogDetail from "@/components/WorkoutLogDetail";
import {
  Trophy,
  FileText,
  ChevronRight,
  Play,
  Timer as TimerIcon,
  Flame,
  Zap,
  Award,
} from "lucide-react";
import type { WorkoutLog } from "@/lib/types";

const ratingLabels: Record<number, string> = {
  1: "Easy",
  2: "Just Right",
  3: "Tough",
  4: "Destroyed Me",
};

const levelColors: Record<string, string> = {
  beginner: "text-green-400 bg-green-400/10 border-green-400/20",
  intermediate: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  advanced: "text-red-400 bg-red-400/10 border-red-400/20",
};

function getMotivationLine(
  totalWorkouts: number,
  streakCurrent: number,
  streakLongest: number,
  trainedToday: boolean,
): string {
  if (totalWorkouts === 0) return "Ready to start your journey?";
  if (trainedToday) return "You showed up today. Respect.";
  if (streakCurrent >= 7) return `${streakCurrent}-day streak. Unstoppable.`;
  if (streakCurrent >= 3) return `${streakCurrent} days strong. Keep it going.`;
  if (streakCurrent === 0 && streakLongest > 0) {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning. Time to get back in the ring.";
    if (hour < 18) return "Good afternoon. Time to get back in the ring.";
    return "Good evening. Time to get back in the ring.";
  }
  const hour = new Date().getHours();
  if (hour < 12) return "Morning session?";
  if (hour < 18) return "Afternoon rounds?";
  return "Evening grind. Let's go.";
}

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Home() {
  const { logs, streak, workoutDates, totalWorkouts } = useProgress();
  const { gameState } = useGamification();
  const [mounted, setMounted] = useState(false);
  const [selectedLog, setSelectedLog] = useState<WorkoutLog | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isNewUser = totalWorkouts === 0;
  const isOnboarding = totalWorkouts < 3;

  const trainedToday = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return logs.some((l) => l.date === today);
  }, [logs]);

  // This week stats
  const now = new Date();
  const monday = getMondayOfWeek(now);
  const weekLogs = logs.filter((log) => new Date(log.date) >= monday);
  const weekWorkouts = weekLogs.length;

  // Suggested workout
  const suggestedWorkout = useMemo(() => {
    if (logs.length === 0) {
      return workouts.find((w) => w.id === "first-boxing-workout") || workouts[0];
    }
    const completedIds = new Set(logs.map((l) => l.workoutId));
    return workouts.find((w) => !completedIds.has(w.id)) || workouts[0];
  }, [logs]);

  // Recent activity
  const recentLogs = [...logs].reverse().slice(0, 3);

  // Badge data
  const earnedBadgeIds = useMemo(() => {
    if (!gameState) return new Set<string>();
    return new Set(gameState.badges.earned.map((b) => b.badgeId));
  }, [gameState]);

  const earnedBadges = useMemo(() => {
    if (!gameState) return [];
    return gameState.badges.earned
      .sort(
        (a, b) =>
          new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime(),
      )
      .slice(0, 5)
      .map((eb) => BADGE_DEFINITIONS.find((bd) => bd.id === eb.badgeId))
      .filter(Boolean);
  }, [gameState]);

  // Animation delay counter
  let delayCounter = 0;
  const nextDelay = () => {
    delayCounter += 30;
    return `${delayCounter}ms`;
  };

  if (!mounted) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-8 pb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-[#00e5ff] to-[#0090ff] bg-clip-text text-transparent">
              JAB
            </span>
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-8">
      {/* Header */}
      <div className="relative mb-8 animate-fade-in-up">
        <div className="absolute -top-12 left-0 w-32 h-32 bg-[#00e5ff]/8 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-3xl font-black tracking-tight relative">
          <span className="bg-gradient-to-r from-[#00e5ff] via-[#00c8ff] to-[#0090ff] bg-clip-text text-transparent">
            JAB
          </span>
        </h1>
        <p className="text-muted text-sm mt-1">
          {getMotivationLine(
            totalWorkouts,
            streak.current,
            streak.longest,
            trainedToday,
          )}
        </p>
      </div>

      <div className="space-y-5">
        {/* ─── NEW USER: Welcome Hero ─── */}
        {isNewUser && (
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: nextDelay() }}
          >
            <div className="card-glass rounded-2xl overflow-hidden">
              <Link
                href="/learn/first-workout"
                className="group flex items-center gap-4 p-5 border-b border-border/30 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00e5ff]/15 to-[#0090ff]/15 border border-[#00e5ff]/20 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-[#00e5ff]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">New to boxing?</p>
                  <p className="text-xs text-muted mt-0.5">
                    Start with the basics
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted shrink-0 group-hover:text-[#00e5ff] transition-colors" />
              </Link>
              <Link
                href={`/workouts/${suggestedWorkout?.id || "first-boxing-workout"}`}
                className="group flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00e5ff]/20 to-[#0090ff]/20 border border-[#00e5ff]/20 flex items-center justify-center shrink-0 group-hover:shadow-[0_0_16px_rgba(0,229,255,0.2)] transition-shadow">
                  <Play className="w-5 h-5 text-[#00e5ff]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">Ready to train?</p>
                  <p className="text-xs text-muted mt-0.5">
                    Jump into your first workout
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted shrink-0 group-hover:text-[#00e5ff] transition-colors" />
              </Link>
            </div>
          </div>
        )}

        {/* ─── RETURNING USER: Suggested Workout ─── */}
        {!isNewUser && suggestedWorkout && (
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: nextDelay() }}
          >
            <h2 className="text-sm font-semibold tracking-wide uppercase text-muted mb-2">
              Up Next
            </h2>
            <Link
              href={`/workouts/${suggestedWorkout.id}`}
              className="group block relative rounded-2xl p-[1px] bg-gradient-to-r from-[#00e5ff]/25 to-[#0090ff]/25 hover:from-[#00e5ff]/40 hover:to-[#0090ff]/40 transition-all duration-300"
            >
              <div className="bg-surface/90 backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 group-hover:bg-surface/70">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00e5ff]/20 to-[#0090ff]/20 border border-[#00e5ff]/20 flex items-center justify-center shrink-0 group-hover:shadow-[0_0_16px_rgba(0,229,255,0.2)] transition-shadow duration-300">
                    <Play className="w-5 h-5 text-[#00e5ff]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg leading-tight truncate">
                      {suggestedWorkout.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${levelColors[suggestedWorkout.level]}`}
                      >
                        {suggestedWorkout.level}
                      </span>
                      <span className="text-xs text-muted">
                        {suggestedWorkout.durationMin} min
                      </span>
                      <span className="text-xs text-muted">
                        {suggestedWorkout.rounds.length} rounds
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted shrink-0 group-hover:text-[#00e5ff] group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
              </div>
            </Link>
            <Link
              href="/workouts"
              className="block text-center text-sm text-[#00e5ff] font-medium mt-3 py-1 hover:text-[#00c8ff] transition-colors"
            >
              Browse All Workouts
            </Link>
          </div>
        )}

        {/* ─── Quick Timer ─── */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: nextDelay() }}
        >
          <Link
            href="/timer"
            className="group flex items-center gap-3 card-glass rounded-xl p-3 hover:border-[#00e5ff]/20 transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00e5ff]/15 to-[#0090ff]/15 flex items-center justify-center shrink-0">
              <TimerIcon className="w-4 h-4 text-[#00e5ff]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">
                {isNewUser ? "Round Timer" : "Quick Timer"}
              </p>
              {isNewUser && (
                <p className="text-xs text-muted">
                  Customizable round & rest intervals
                </p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-muted shrink-0 group-hover:text-[#00e5ff] transition-colors" />
          </Link>
        </div>

        {/* ─── RETURNING USER: Progress Snapshot ─── */}
        {!isNewUser && gameState && (
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: nextDelay() }}
          >
            <div className="card-glass rounded-2xl p-5">
              {/* Level + XP bar */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,144,255,0.15))",
                    border: "2px solid rgba(0,229,255,0.4)",
                    boxShadow: "0 0 12px rgba(0,229,255,0.15)",
                  }}
                >
                  <span className="text-xl font-black text-accent">
                    {gameState.level.level}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted uppercase tracking-wider font-medium">
                    {gameState.level.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 bg-border/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#00e5ff] to-[#0090ff] transition-all duration-1000 ease-out"
                        style={{
                          width: `${gameState.level.progressPercent}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-muted tabular-nums shrink-0">
                      Lv.{gameState.level.level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 pt-3 border-t border-border/30">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-lg font-black">{streak.current}</span>
                  <span className="text-xs text-muted">streak</span>
                </div>
                <div className="w-px h-5 bg-border/40" />
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#00e5ff]" />
                  <span className="text-lg font-black">{weekWorkouts}</span>
                  <span className="text-xs text-muted">this week</span>
                </div>
                <div className="w-px h-5 bg-border/40" />
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-accent-secondary" />
                  <span className="text-lg font-black">{totalWorkouts}</span>
                  <span className="text-xs text-muted">total</span>
                </div>
              </div>

              {/* Streak shields */}
              {gameState.shields.shields > 0 && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <StreakShieldDisplay shields={gameState.shields} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Daily Challenge */}
        {mounted && gameState && (
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: nextDelay() }}
          >
            <DailyChallengeCard
              challenge={gameState.todayChallenge}
              progress={gameState.challengeProgress}
            />
            {isNewUser && (
              <p className="text-xs text-muted text-center mt-2">
                Complete your first workout to earn XP
              </p>
            )}
          </div>
        )}

        {/* ─── Learn Links (onboarding users only) ─── */}
        {isOnboarding && (
          <div
            className="space-y-3 animate-fade-in-up"
            style={{ animationDelay: nextDelay() }}
          >
            {/* "New to Boxing?" - only for users with 1-2 workouts (new users have it in Welcome Hero) */}
            {!isNewUser && (
              <Link
                href="/learn/first-workout"
                className="group block card-glass rounded-2xl p-5 card-premium glow-ring hover:shadow-[0_0_24px_rgba(0,229,255,0.08)] transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00e5ff]/15 to-[#0090ff]/15 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-[#00e5ff]" />
                  </div>
                  <div>
                    <h3 className="font-bold">New to Boxing?</h3>
                    <p className="text-sm text-muted">
                      Start with our guided introduction
                    </p>
                  </div>
                </div>
              </Link>
            )}
            <Link
              href="/learn/combos"
              className="group block card-glass rounded-2xl p-5 card-premium glow-ring hover:shadow-[0_0_24px_rgba(0,229,255,0.08)] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00e5ff]/15 to-[#0090ff]/15 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#00e5ff]" />
                </div>
                <div>
                  <h3 className="font-bold">Combo Reference</h3>
                  <p className="text-sm text-muted">
                    Learn the punch numbering system
                  </p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* ─── RETURNING USER: Recent Activity ─── */}
        {!isNewUser && (
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: nextDelay() }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-muted">
                Recent Activity
              </h2>
              {recentLogs.length > 0 && (
                <Link
                  href="/progress"
                  className="text-xs text-[#00e5ff] font-medium hover:text-[#00c8ff] transition-colors"
                >
                  View All
                </Link>
              )}
            </div>
            {recentLogs.length === 0 ? (
              <div className="card-glass rounded-2xl p-6 text-center">
                <p className="text-sm text-muted">
                  Complete a workout to see your activity here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentLogs.map((log) => {
                  const workout = workouts.find(
                    (w) => w.id === log.workoutId,
                  );
                  return (
                    <button
                      key={log.completedAt || `${log.workoutId}-${log.date}`}
                      onClick={() => setSelectedLog(log)}
                      className="w-full text-left card-glass rounded-xl p-4 hover:border-[#00e5ff]/20 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">
                            {workout?.title ||
                              log.workoutTitle ||
                              log.workoutId}
                          </p>
                          <p className="text-xs text-muted mt-0.5">
                            {new Date(
                              log.completedAt || log.date,
                            ).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                            {log.completedAt && (
                              <span className="ml-1">
                                {new Date(
                                  log.completedAt,
                                ).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-xs text-muted">
                              {log.roundsCompleted}/{log.totalRounds} rounds
                            </p>
                            <p className="text-xs text-muted">
                              {ratingLabels[log.rating]}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── RETURNING USER: Activity Calendar ─── */}
        {!isNewUser && (
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: nextDelay() }}
          >
            <ProgressCalendar workoutDates={workoutDates} />
          </div>
        )}

        {/* ─── Badge Teaser ─── */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: nextDelay() }}
        >
          {isNewUser ? (
            <div className="card-glass rounded-2xl p-5">
              <h2 className="text-sm font-semibold tracking-wide uppercase text-muted mb-3">
                Badges to Earn
              </h2>
              <div className="flex gap-3">
                {BADGE_DEFINITIONS.filter((b) =>
                  [
                    "first-blood",
                    "streak-3",
                    "30-min-club",
                    "getting-started",
                  ].includes(b.id),
                ).map((badge) => (
                  <div key={badge.id} className="flex-1 min-w-0 flex flex-col items-center text-center">
                    <BadgeIconContainer
                      icon={badge.icon}
                      rarity={badge.rarity}
                      earned={false}
                      size="sm"
                    />
                    <p className="text-[9px] text-muted mt-1 leading-tight">
                      {badge.name}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/progress"
                className="block text-xs text-[#00e5ff] font-medium mt-3 hover:text-[#00c8ff] transition-colors"
              >
                Complete workouts to start earning →
              </Link>
            </div>
          ) : earnedBadges.length > 0 ? (
            <div className="card-glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-muted">
                  Badges
                </h2>
                <Link
                  href="/progress"
                  className="text-xs text-[#00e5ff] font-medium hover:text-[#00c8ff] transition-colors"
                >
                  {earnedBadgeIds.size}/{BADGE_DEFINITIONS.length} View All
                </Link>
              </div>
              <div className="flex gap-3">
                {earnedBadges.map(
                  (badge) =>
                    badge && (
                      <div key={badge.id} className="flex-1 min-w-0 flex flex-col items-center text-center">
                        <BadgeIconContainer
                          icon={badge.icon}
                          rarity={badge.rarity}
                          earned={true}
                          size="sm"
                        />
                        <p className="text-[9px] text-muted mt-1 leading-tight">
                          {badge.name}
                        </p>
                      </div>
                    ),
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Workout detail sheet */}
      {selectedLog && (
        <WorkoutLogDetail
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}
