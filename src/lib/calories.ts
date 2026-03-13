import type { Level } from "./types";

// MET values for boxing/combat sports by intensity level
// Source: Compendium of Physical Activities
const MET_BY_LEVEL: Record<Level, number> = {
  beginner: 5.5,     // Light bag work, shadow boxing
  intermediate: 7.8, // Moderate bag work, sparring drills
  advanced: 9.5,     // Intense bag work, heavy sparring
};

const DEFAULT_WEIGHT_KG = 70; // ~154 lbs

export function estimateCalories(
  durationMin: number,
  level: Level,
): number {
  const met = MET_BY_LEVEL[level];
  return Math.round(met * DEFAULT_WEIGHT_KG * (durationMin / 60));
}
