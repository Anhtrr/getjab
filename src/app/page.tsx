"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useGamification } from "@/hooks/useGamification";
import { workouts, getWorkout } from "@/data/workouts";
import { getPresets } from "@/lib/timerPresets";
import DailyChallengeCard from "@/components/gamification/DailyChallengeCard";
import {
  Trophy,
  FileText,
  ChevronRight,
  Play,
  Timer as TimerIcon,
  Flame,
} from "lucide-react";

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
  const { logs, streak, totalWorkouts } = useProgress();
  const { gameState } = useGamification();
  const [mounted, setMounted] = useState(false);

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
  const weekWorkouts = logs.filter((log) => new Date(log.date) >= monday).length;

  // Suggested workout
  const { suggestedWorkout, suggestionLabel, trySomethingNew } = useMemo(() => {
    if (logs.length === 0) {
      const first = workouts.find((w) => w.id === "first-boxing-workout") || workouts[0];
      return { suggestedWorkout: first, suggestionLabel: "Start Here", trySomethingNew: null };
    }

    const sortedLogs = [...logs].sort((a, b) =>
      new Date(b.completedAt || b.date).getTime() - new Date(a.completedAt || a.date).getTime()
    );
    const lastWorkoutId = sortedLogs[0]?.workoutId;
    const lastWorkout = lastWorkoutId ? getWorkout(lastWorkoutId) : null;

    const completedIds = new Set(logs.map((l) => l.workoutId));
    const neverDone = workouts.find((w) => !completedIds.has(w.id) && w.isFree);
    const workoutCounts: Record<string, number> = {};
    for (const log of logs) workoutCounts[log.workoutId] = (workoutCounts[log.workoutId] || 0) + 1;
    const leastDone = workouts
      .filter((w) => completedIds.has(w.id) && w.id !== lastWorkoutId && w.isFree)
      .sort((a, b) => (workoutCounts[a.id] || 0) - (workoutCounts[b.id] || 0))[0];

    const tryNew = neverDone || leastDone || null;

    if (lastWorkout) {
      return { suggestedWorkout: lastWorkout, suggestionLabel: "Continue Training", trySomethingNew: tryNew };
    }

    return { suggestedWorkout: workouts[0], suggestionLabel: "Up Next", trySomethingNew: tryNew };
  }, [logs]);

  // Last used timer preset
  const lastPreset = useMemo(() => {
    if (!mounted) return null;
    const presets = getPresets();
    return presets[0] || null;
  }, [mounted]);

  // Animation delay counter
  let delayCounter = 0;
  const nextDelay = () => {
    delayCounter += 30;
    return `${delayCounter}ms`;
  };

  if (!mounted) {
    return (
      <div className="max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto px-4 pt-8 pb-8">
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
    <div className="max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto px-4 pt-8 pb-8">
      {/* Header */}
      <div className="relative mb-8 animate-fade-in-up">
        <div className="absolute -top-12 left-0 w-32 h-32 bg-[#00e5ff]/8 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-3xl font-black tracking-tight relative">
          <span className="bg-gradient-to-r from-[#00e5ff] via-[#00c8ff] to-[#0090ff] bg-clip-text text-transparent">
            JAB
          </span>
        </h1>
        <p className="text-muted text-sm mt-1">
          {getMotivationLine(totalWorkouts, streak.current, streak.longest, trainedToday)}
        </p>
      </div>

      <div className="space-y-4">
        {/* ─── NEW USER: Welcome Hero ─── */}
        {isNewUser && (
          <div className="animate-fade-in-up" style={{ animationDelay: nextDelay() }}>
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
                  <p className="text-xs text-muted mt-0.5">Start with the basics</p>
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
                  <p className="text-xs text-muted mt-0.5">Jump into your first workout</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted shrink-0 group-hover:text-[#00e5ff] transition-colors" />
              </Link>
            </div>
          </div>
        )}

        {/* ─── RETURNING USER: Suggested Workout ─── */}
        {!isNewUser && suggestedWorkout && (
          <div className="animate-fade-in-up" style={{ animationDelay: nextDelay() }}>
            <h2 className="text-sm font-semibold tracking-wide uppercase text-muted mb-2">
              {suggestionLabel}
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
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${levelColors[suggestedWorkout.level]}`}>
                        {suggestedWorkout.level}
                      </span>
                      <span className="text-xs text-muted">{suggestedWorkout.durationMin} min</span>
                      <span className="text-xs text-muted">{suggestedWorkout.rounds.length} rounds</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted shrink-0 group-hover:text-[#00e5ff] group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
              </div>
            </Link>
            <div className="flex items-center justify-center gap-4 mt-3">
              {trySomethingNew && (
                <Link
                  href={`/workouts/${trySomethingNew.id}`}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Try: {trySomethingNew.title}
                </Link>
              )}
              <Link
                href="/workouts"
                className="text-sm text-[#00e5ff] font-medium hover:text-[#00c8ff] transition-colors"
              >
                Browse All
              </Link>
            </div>
          </div>
        )}

        {/* ─── Quick Timer ─── */}
        <div className="animate-fade-in-up" style={{ animationDelay: nextDelay() }}>
          <Link
            href="/timer"
            className="group flex items-center gap-3 card-glass rounded-xl p-3 hover:border-[#00e5ff]/20 transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00e5ff]/15 to-[#0090ff]/15 flex items-center justify-center shrink-0">
              <TimerIcon className="w-4 h-4 text-[#00e5ff]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">
                {isNewUser || !lastPreset ? "Round Timer" : lastPreset.name}
              </p>
              <p className="text-xs text-muted">
                {isNewUser || !lastPreset
                  ? "Customizable round & rest intervals"
                  : `${lastPreset.settings.rounds} × ${Math.floor(lastPreset.settings.roundDurationSec / 60)}:${(lastPreset.settings.roundDurationSec % 60).toString().padStart(2, "0")} / ${Math.floor(lastPreset.settings.restDurationSec / 60)}:${(lastPreset.settings.restDurationSec % 60).toString().padStart(2, "0")} rest`
                }
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted shrink-0 group-hover:text-[#00e5ff] transition-colors" />
          </Link>
        </div>

        {/* ─── Daily Challenge ─── */}
        {mounted && gameState && (
          <div className="animate-fade-in-up" style={{ animationDelay: nextDelay() }}>
            <DailyChallengeCard
              challenge={gameState.todayChallenge}
              progress={gameState.challengeProgress}
            />
          </div>
        )}

        {/* ─── Compact Stats Row ─── */}
        {!isNewUser && (
          <div className="animate-fade-in-up" style={{ animationDelay: nextDelay() }}>
            <div className="flex items-center justify-between card-glass rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-bold">{streak.current}</span>
                <span className="text-xs text-muted">day streak</span>
              </div>
              <div className="w-px h-4 bg-border/40" />
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold">{weekWorkouts}</span>
                <span className="text-xs text-muted">this week</span>
              </div>
              <div className="w-px h-4 bg-border/40" />
              <Link
                href="/progress"
                className="text-xs text-[#00e5ff] font-medium hover:text-[#00c8ff] transition-colors"
              >
                View Progress
              </Link>
            </div>
          </div>
        )}

        {/* ─── Learn Links (onboarding only) ─── */}
        {isOnboarding && (
          <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: nextDelay() }}>
            {!isNewUser && (
              <Link
                href="/learn/first-workout"
                className="group block card-glass rounded-2xl p-5 hover:border-[#00e5ff]/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00e5ff]/15 to-[#0090ff]/15 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-[#00e5ff]" />
                  </div>
                  <div>
                    <h3 className="font-bold">New to Boxing?</h3>
                    <p className="text-sm text-muted">Start with our guided introduction</p>
                  </div>
                </div>
              </Link>
            )}
            <Link
              href="/learn/combos"
              className="group block card-glass rounded-2xl p-5 hover:border-[#00e5ff]/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00e5ff]/15 to-[#0090ff]/15 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#00e5ff]" />
                </div>
                <div>
                  <h3 className="font-bold">Combo Reference</h3>
                  <p className="text-sm text-muted">Learn the punch numbering system</p>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
