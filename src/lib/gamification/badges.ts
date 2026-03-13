import type { BadgeDefinition } from "./types";
import type { WorkoutLog } from "../types";

function totalMinutes(logs: WorkoutLog[]): number {
  return logs.reduce((sum, l) => sum + l.durationMin, 0);
}

function hasWeekendPair(logs: WorkoutLog[]): boolean {
  const weekends = new Map<string, Set<number>>();
  for (const log of logs) {
    const d = new Date(log.date);
    const day = d.getDay(); // 0=Sun, 6=Sat
    if (day === 0 || day === 6) {
      // Group by ISO week (use the Saturday's date as key)
      const sat = new Date(d);
      if (day === 0) sat.setDate(sat.getDate() - 1);
      const key = sat.toISOString().split("T")[0];
      if (!weekends.has(key)) weekends.set(key, new Set());
      weekends.get(key)!.add(day);
    }
  }
  for (const days of weekends.values()) {
    if (days.has(0) && days.has(6)) return true;
  }
  return false;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ── Milestone ──
  { id: "first-blood", name: "First Blood", description: "Complete your first workout", icon: "target", category: "milestone", rarity: "common", condition: (logs) => logs.length >= 1 },
  { id: "getting-started", name: "Getting Started", description: "Complete 5 workouts", icon: "trending-up", category: "milestone", rarity: "common", condition: (logs) => logs.length >= 5 },
  { id: "double-digits", name: "Double Digits", description: "Complete 10 workouts", icon: "flame", category: "milestone", rarity: "common", condition: (logs) => logs.length >= 10 },
  { id: "quarter-century", name: "Quarter Century", description: "Complete 25 workouts", icon: "zap", category: "milestone", rarity: "rare", condition: (logs) => logs.length >= 25 },
  { id: "half-century", name: "Half Century", description: "Complete 50 workouts", icon: "star", category: "milestone", rarity: "rare", condition: (logs) => logs.length >= 50 },
  { id: "centurion", name: "Centurion", description: "Complete 100 workouts", icon: "trophy", category: "milestone", rarity: "epic", condition: (logs) => logs.length >= 100 },
  { id: "bicentennial", name: "Bicentennial", description: "Complete 200 workouts", icon: "crown", category: "milestone", rarity: "legendary", condition: (logs) => logs.length >= 200 },

  // ── Streak ──
  { id: "streak-3", name: "Hot Start", description: "Achieve a 3-day streak", icon: "flame", category: "streak", rarity: "common", condition: (_, s) => s >= 3 },
  { id: "streak-7", name: "Week Warrior", description: "Achieve a 7-day streak", icon: "calendar-check", category: "streak", rarity: "common", condition: (_, s) => s >= 7 },
  { id: "streak-14", name: "Fortnight Fighter", description: "Achieve a 14-day streak", icon: "bolt", category: "streak", rarity: "rare", condition: (_, s) => s >= 14 },
  { id: "streak-30", name: "Monthly Machine", description: "Achieve a 30-day streak", icon: "shield", category: "streak", rarity: "epic", condition: (_, s) => s >= 30 },
  { id: "streak-60", name: "Iron Discipline", description: "Achieve a 60-day streak", icon: "gem", category: "streak", rarity: "legendary", condition: (_, s) => s >= 60 },

  // ── Variety ──
  { id: "custom-creator", name: "Custom Creator", description: "Complete a custom workout", icon: "wrench", category: "variety", rarity: "common", condition: (logs) => logs.some((l) => l.workoutId.startsWith("custom-")) },
  { id: "all-levels", name: "No Limits", description: "Complete at least 3 different workouts", icon: "layers", category: "variety", rarity: "rare", condition: (logs) => {
    const ids = new Set(logs.map((l) => l.workoutId));
    return ids.size >= 3;
  }},

  // ── Endurance ──
  { id: "30-min-club", name: "30-Minute Club", description: "Complete a 30+ minute workout", icon: "timer", category: "endurance", rarity: "common", condition: (logs) => logs.some((l) => l.durationMin >= 30) },
  { id: "45-min-club", name: "45-Minute Club", description: "Complete a 45+ minute workout", icon: "clock", category: "endurance", rarity: "rare", condition: (logs) => logs.some((l) => l.durationMin >= 45) },
  { id: "hour-power", name: "Hour Power", description: "Train for 60+ minutes in one session", icon: "hourglass", category: "endurance", rarity: "epic", condition: (logs) => logs.some((l) => l.durationMin >= 60) },
  { id: "500-minutes", name: "500 Minutes", description: "Accumulate 500 total training minutes", icon: "bar-chart-3", category: "endurance", rarity: "rare", condition: (logs) => totalMinutes(logs) >= 500 },
  { id: "1000-minutes", name: "1000 Minutes", description: "Accumulate 1000 total training minutes", icon: "award", category: "endurance", rarity: "epic", condition: (logs) => totalMinutes(logs) >= 1000 },

  // ── Dedication ──
  { id: "early-bird", name: "Early Bird", description: "Complete a workout before 7 AM", icon: "sunrise", category: "dedication", rarity: "common", condition: (logs) => logs.some((l) => { if (!l.completedAt) return false; const h = new Date(l.completedAt).getHours(); return h < 7; }) },
  { id: "night-owl", name: "Night Owl", description: "Complete a workout after 10 PM", icon: "moon", category: "dedication", rarity: "common", condition: (logs) => logs.some((l) => { if (!l.completedAt) return false; const h = new Date(l.completedAt).getHours(); return h >= 22; }) },
  { id: "weekend-warrior", name: "Weekend Warrior", description: "Work out on both Saturday and Sunday", icon: "sparkles", category: "dedication", rarity: "common", condition: (logs) => hasWeekendPair(logs) },
  { id: "destroyer", name: "Destroyer", description: "Get 'Destroyed Me' rating 10 times", icon: "skull", category: "dedication", rarity: "rare", condition: (logs) => logs.filter((l) => l.rating === 4).length >= 10 },

  // ── Mastery ──
  { id: "perfect-week", name: "Perfect Week", description: "Work out every day for a full week", icon: "sparkles", category: "mastery", rarity: "epic", condition: (_, s) => s >= 7 },
  { id: "completionist", name: "Completionist", description: "Finish all rounds in 20 workouts", icon: "check-circle-2", category: "mastery", rarity: "epic", condition: (logs) => logs.filter((l) => l.roundsCompleted >= l.totalRounds).length >= 20 },
  { id: "pain-seeker", name: "Pain Seeker", description: "Complete 5 workouts rated 'Tough' or harder", icon: "medal", category: "mastery", rarity: "rare", condition: (logs) => logs.filter((l) => l.rating >= 3).length >= 5 },
];
