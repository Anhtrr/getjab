"use client";

import { useSyncExternalStore, useCallback, useMemo } from "react";
import type { WorkoutLog } from "@/lib/types";
import { getWorkoutLogs, addWorkoutLog } from "@/lib/storage";

const subscribers = new Set<() => void>();
let cachedSnapshot: string | null = null;

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function getSnapshot(): string {
  if (cachedSnapshot === null) {
    cachedSnapshot = JSON.stringify(getWorkoutLogs());
  }
  return cachedSnapshot;
}

function getServerSnapshot(): string {
  return "[]";
}

function notify() {
  cachedSnapshot = null;
  subscribers.forEach((cb) => cb());
}

function dayDiff(a: string, b: string): number {
  const dateA = new Date(a);
  const dateB = new Date(b);
  return Math.round(
    Math.abs(dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24),
  );
}

export function useProgress() {
  const logsJson = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Memoize everything derived from logs — no redundant localStorage reads
  const { logs, streak, workoutDates, totalWorkouts } = useMemo(() => {
    const parsed: WorkoutLog[] = JSON.parse(logsJson);

    // Compute streak inline (instead of calling getStreak which re-reads localStorage)
    let current = 0;
    let longest = 0;

    if (parsed.length > 0) {
      const uniqueDates = [...new Set(parsed.map((l) => l.date))].sort().reverse();
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
        let s = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
          if (dayDiff(uniqueDates[i - 1], uniqueDates[i]) === 1) s++;
          else break;
        }
        current = s;
      }

      let tempStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        if (dayDiff(uniqueDates[i - 1], uniqueDates[i]) === 1) tempStreak++;
        else { longest = Math.max(longest, tempStreak); tempStreak = 1; }
      }
      longest = Math.max(longest, tempStreak, current);
    }

    // Compute workout dates inline
    const dates: Record<string, number> = {};
    for (const log of parsed) {
      dates[log.date] = (dates[log.date] || 0) + 1;
    }

    return {
      logs: parsed,
      streak: { current, longest },
      workoutDates: dates,
      totalWorkouts: parsed.length,
    };
  }, [logsJson]);

  const logWorkout = useCallback((log: WorkoutLog) => {
    addWorkoutLog(log);
    notify();
  }, []);

  return { logs, streak, workoutDates, totalWorkouts, logWorkout };
}
