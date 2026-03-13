"use client";

import { useSyncExternalStore, useCallback, useMemo } from "react";
import type { Workout } from "@/lib/types";
import {
  getCustomWorkouts,
  saveCustomWorkout,
  deleteCustomWorkout,
} from "@/lib/customWorkouts";

const subscribers = new Set<() => void>();
let cachedSnapshot: string | null = null;

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function getSnapshot(): string {
  if (cachedSnapshot === null) {
    cachedSnapshot = JSON.stringify(getCustomWorkouts());
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

export function useCustomWorkouts() {
  const json = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const customWorkouts: Workout[] = useMemo(() => JSON.parse(json), [json]);

  const save = useCallback((workout: Workout) => {
    saveCustomWorkout(workout);
    notify();
  }, []);

  const remove = useCallback((id: string) => {
    deleteCustomWorkout(id);
    notify();
  }, []);

  return { customWorkouts, save, remove };
}
