"use client";

import { useSyncExternalStore, useCallback, useMemo } from "react";
import { getWorkoutLogs } from "@/lib/storage";
import { computeGameState } from "@/lib/gamification/engine";
import {
  getEarnedBadges,
  saveEarnedBadges,
  getStreakShields,
  saveStreakShields,
  getDailyChallengeProgress,
  saveDailyChallengeProgress,
  getPersonalRecords,
  savePersonalRecords,
} from "@/lib/gamification/storage";
import type { GameState } from "@/lib/gamification/types";

// ─── External store for gamification reactivity ───

const subscribers = new Set<() => void>();
let cachedVersion = 0;

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function getSnapshot(): number {
  return cachedVersion;
}

function getServerSnapshot(): number {
  return 0;
}

function notify() {
  cachedVersion++;
  subscribers.forEach((cb) => cb());
}

export function useGamification() {
  // Subscribe to version changes
  const version = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Compute full game state from current data — wrapped in try/catch
  const gameState: GameState | null = useMemo(() => {
    if (typeof window === "undefined") return null;

    try {
      const logs = getWorkoutLogs();
      const badges = getEarnedBadges();
      const shields = getStreakShields();
      const prs = getPersonalRecords();
      const challengeProgress = getDailyChallengeProgress();

      return computeGameState(logs, badges, shields, prs, challengeProgress);
    } catch (e) {
      console.error("[useGamification] Failed to compute game state:", e);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  // Process after a workout is completed (call from go/page.tsx after rating)
  const processWorkoutCompletion = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const logs = getWorkoutLogs();
      const badges = getEarnedBadges();
      const shields = getStreakShields();
      const prs = getPersonalRecords();
      const challengeProgress = getDailyChallengeProgress();

      const state = computeGameState(logs, badges, shields, prs, challengeProgress);

      // Persist updated gamification state
      saveEarnedBadges(state.badges.earned);
      saveStreakShields(state.shields);
      saveDailyChallengeProgress(state.challengeProgress);
      savePersonalRecords(state.personalRecords);

      // Notify subscribers to trigger re-renders
      notify();

      return state;
    } catch (e) {
      console.error("[useGamification] Failed to process workout:", e);
      return undefined;
    }
  }, []);

  return {
    gameState,
    processWorkoutCompletion,
  };
}
