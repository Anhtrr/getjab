import type { Workout } from "./types";

const CUSTOM_WORKOUTS_KEY = "jab_custom_workouts";

export function getCustomWorkouts(): Workout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_WORKOUTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getCustomWorkout(id: string): Workout | undefined {
  return getCustomWorkouts().find((w) => w.id === id);
}

export function saveCustomWorkout(workout: Workout): void {
  const workouts = getCustomWorkouts();
  const index = workouts.findIndex((w) => w.id === workout.id);
  if (index >= 0) {
    workouts[index] = workout;
  } else {
    workouts.push(workout);
  }
  localStorage.setItem(CUSTOM_WORKOUTS_KEY, JSON.stringify(workouts));
}

export function deleteCustomWorkout(id: string): void {
  const workouts = getCustomWorkouts().filter((w) => w.id !== id);
  localStorage.setItem(CUSTOM_WORKOUTS_KEY, JSON.stringify(workouts));
}

export function generateCustomId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let random = "";
  for (let i = 0; i < 5; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }
  return `custom-${Date.now()}-${random}`;
}
