import type { WorkoutLog } from "./types";
import type { Workout } from "./types";

const LOGS_KEY = "jab_logs";
const SUBSCRIPTION_KEY = "jab_subscription";
const CUSTOM_WORKOUTS_KEY = "jab_custom_workouts";
const MIGRATION_KEY = "jab_logs_migrated_v1";
let migrationDone = false;

/** One-time migration: backfill workoutTitle for old custom workout logs */
function migrateLogs(): void {
  if (migrationDone) return;
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(MIGRATION_KEY)) { migrationDone = true; return; }
    // Set flag first to prevent re-entrant calls
    localStorage.setItem(MIGRATION_KEY, "1");

    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return;

    const logs: WorkoutLog[] = JSON.parse(raw);
    const customRaw = localStorage.getItem(CUSTOM_WORKOUTS_KEY);
    const customWorkouts: Workout[] = customRaw ? JSON.parse(customRaw) : [];

    let changed = false;
    for (const log of logs) {
      if (!log.workoutTitle && log.workoutId.startsWith("custom-")) {
        const cw = customWorkouts.find((w) => w.id === log.workoutId);
        if (cw) {
          log.workoutTitle = cw.title;
          changed = true;
        }
      }
    }

    if (changed) {
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    }
  } catch {}
}

export function getWorkoutLogs(): WorkoutLog[] {
  if (typeof window === "undefined") return [];
  try {
    migrateLogs();
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addWorkoutLog(log: WorkoutLog) {
  const logs = getWorkoutLogs();
  logs.push(log);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function deleteWorkoutLog(completedAt: string) {
  const logs = getWorkoutLogs();
  const filtered = logs.filter((l) => l.completedAt !== completedAt);
  localStorage.setItem(LOGS_KEY, JSON.stringify(filtered));
}

export function isSubscribed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const sub = localStorage.getItem(SUBSCRIPTION_KEY);
    if (!sub) return false;
    const parsed = JSON.parse(sub);
    return parsed.active === true;
  } catch {
    return false;
  }
}

export function setSubscription(active: boolean) {
  localStorage.setItem(
    SUBSCRIPTION_KEY,
    JSON.stringify({ active, updatedAt: new Date().toISOString() }),
  );
}

// ─── Data Export / Import ───

export function exportAllData(): string {
  const data: Record<string, unknown> = {};
  const keys = [
    LOGS_KEY,
    CUSTOM_WORKOUTS_KEY,
    "jab_badges",
    "jab_streak_shields",
    "jab_daily_challenge",
    "jab_personal_records",
    "jab_timer_settings",
    "jab_timer_presets",
    "jab_preset_usage",
    "jab_display_name",
    "jab_callout_settings",
  ];
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) data[key] = JSON.parse(raw);
    } catch {}
  }
  data._exportedAt = new Date().toISOString();
  data._version = 1;
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonStr: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(jsonStr);
    if (typeof data !== "object" || data === null) {
      return { success: false, error: "Invalid data format" };
    }

    // Validate expected array fields
    const arrayKeys = [LOGS_KEY, CUSTOM_WORKOUTS_KEY, "jab_badges", "jab_timer_presets"];
    for (const key of arrayKeys) {
      if (data[key] !== undefined && !Array.isArray(data[key])) {
        return { success: false, error: `Invalid format for ${key}` };
      }
    }

    // Validate logs have required fields
    if (Array.isArray(data[LOGS_KEY])) {
      for (const log of data[LOGS_KEY]) {
        if (typeof log !== "object" || !log.workoutId || !log.date || typeof log.durationMin !== "number") {
          return { success: false, error: "Invalid workout log entry" };
        }
      }
    }

    // Validate expected object fields
    const objectKeys = [
      "jab_streak_shields", "jab_daily_challenge", "jab_personal_records",
      "jab_timer_settings", "jab_preset_usage", "jab_callout_settings",
    ];
    for (const key of objectKeys) {
      if (data[key] !== undefined && (typeof data[key] !== "object" || Array.isArray(data[key]))) {
        return { success: false, error: `Invalid format for ${key}` };
      }
    }

    const keys = [
      LOGS_KEY,
      CUSTOM_WORKOUTS_KEY,
      "jab_badges",
      "jab_streak_shields",
      "jab_daily_challenge",
      "jab_personal_records",
      "jab_timer_settings",
      "jab_timer_presets",
      "jab_preset_usage",
      "jab_display_name",
      "jab_callout_settings",
    ];
    for (const key of keys) {
      if (data[key] !== undefined) {
        localStorage.setItem(key, JSON.stringify(data[key]));
      }
    }
    return { success: true };
  } catch {
    return { success: false, error: "Could not parse data file" };
  }
}
