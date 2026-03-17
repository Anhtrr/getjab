"use client";

import { useState, useEffect } from "react";
import { useProgress } from "@/hooks/useProgress";
import { useGamification } from "@/hooks/useGamification";
import StreakCounter from "@/components/StreakCounter";
import StreakShieldDisplay from "@/components/gamification/StreakShieldDisplay";
import LevelBadge from "@/components/gamification/LevelBadge";
import DailyChallengeCard from "@/components/gamification/DailyChallengeCard";
import TrainingHeatmap from "@/components/gamification/TrainingHeatmap";
import AchievementGrid from "@/components/gamification/AchievementGrid";
import PersonalRecordsList from "@/components/gamification/PersonalRecordsList";
import DataManagement from "@/components/DataManagement";
import WorkoutLogDetail from "@/components/WorkoutLogDetail";
import { workouts } from "@/data/workouts";
import Link from "next/link";
import { Dumbbell, ChevronRight } from "lucide-react";
import type { WorkoutLog } from "@/lib/types";

const ratingLabels: Record<number, string> = {
  1: "Easy",
  2: "Just Right",
  3: "Tough",
  4: "Destroyed Me",
};

export default function ProgressPage() {
  const { logs, streak, totalWorkouts } = useProgress();
  const { gameState } = useGamification();
  const [mounted, setMounted] = useState(false);
  const [selectedLog, setSelectedLog] = useState<WorkoutLog | null>(null);
  const [showAllLogs, setShowAllLogs] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allRecentLogs = [...logs].reverse();
  const recentLogs = showAllLogs ? allRecentLogs : allRecentLogs.slice(0, 5);
  const hasMore = allRecentLogs.length > 5;

  if (!mounted || !gameState) {
    return (
      <div className="px-4 pt-8 pb-8 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 animate-fade-in-up">Progress</h1>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card-glass rounded-xl p-4 text-center">
                <span className="text-3xl font-black block">-</span>
                <span className="text-xs text-muted">&nbsp;</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-8 pb-8 max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 animate-fade-in-up">Progress</h1>

      <div className="space-y-6">
          {/* Level & XP */}
          <div className="animate-fade-in-up">
            <LevelBadge level={gameState.level} />
          </div>

          {/* Streak + Shields */}
          <div className="animate-fade-in-up" style={{ animationDelay: "60ms" }}>
            <StreakCounter
              current={streak.current}
              longest={streak.longest}
              totalWorkouts={totalWorkouts}
            />
            <div className="mt-2 flex justify-center">
              <StreakShieldDisplay shields={gameState.shields} />
            </div>
          </div>

          {/* Daily Challenge */}
          <div className="animate-fade-in-up" style={{ animationDelay: "120ms" }}>
            <DailyChallengeCard
              challenge={gameState.todayChallenge}
              progress={gameState.challengeProgress}
            />
          </div>

          {/* Recent Workouts */}
          <div className="animate-fade-in-up" style={{ animationDelay: "180ms" }}>
            <h3 className="font-bold text-lg mb-3">Recent Workouts</h3>
            {recentLogs.length === 0 ? (
              <div className="card-glass rounded-xl p-6 text-center animate-fade-in">
                <Dumbbell className="w-10 h-10 text-muted mx-auto mb-3" />
                <p className="text-muted text-sm">
                  No workouts yet. Complete a workout to see your history here.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2 stagger-children">
                  {recentLogs.map((log) => {
                    const workout = workouts.find((w) => w.id === log.workoutId);
                    return (
                      <button
                        key={log.completedAt || `${log.workoutId}-${log.date}`}
                        onClick={() => setSelectedLog(log)}
                        className="w-full text-left card-glass rounded-xl p-4 hover:border-[#00e5ff]/20 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm">
                              {workout?.title || log.workoutTitle || log.workoutId}
                            </p>
                            <p className="text-xs text-muted mt-0.5">
                              {new Date(log.completedAt || log.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                              {log.completedAt && (
                                <span className="ml-1">
                                  {new Date(log.completedAt).toLocaleTimeString("en-US", {
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
                {hasMore && (
                  <button
                    onClick={() => setShowAllLogs((v) => !v)}
                    className="w-full text-center text-xs text-accent font-medium py-2 mt-1 hover:underline transition-colors"
                  >
                    {showAllLogs ? "Show Less" : `View All (${allRecentLogs.length})`}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Personal Records */}
          <div className="animate-fade-in-up" style={{ animationDelay: "240ms" }}>
            <PersonalRecordsList
              records={gameState.personalRecords}
              newPRs={gameState.newPRs}
            />
          </div>

          {/* Training Heatmap */}
          <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <TrainingHeatmap days={gameState.heatmap} />
          </div>

          {/* Achievement Badges */}
          <div className="animate-fade-in-up" style={{ animationDelay: "360ms" }}>
            <AchievementGrid earned={gameState.badges.earned} />
          </div>

        {/* Data Management */}
        <div className="animate-fade-in-up" style={{ animationDelay: "420ms" }}>
          <DataManagement />
        </div>

        {/* Utility Links */}
        <div className="animate-fade-in-up text-center text-xs text-muted pt-2 pb-4" style={{ animationDelay: "480ms" }}>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <span className="mx-2">·</span>
          <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
          <span className="mx-2">·</span>
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
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
