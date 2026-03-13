import type {
  EarnedBadge,
  StreakShieldState,
  DailyChallengeProgress,
  PersonalRecord,
} from "./types";

const BADGES_KEY = "jab_badges";
const SHIELDS_KEY = "jab_streak_shields";
const CHALLENGE_KEY = "jab_daily_challenge";
const PRS_KEY = "jab_personal_records";

// ─── Badges ───

export function getEarnedBadges(): EarnedBadge[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BADGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEarnedBadges(badges: EarnedBadge[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
  } catch {}
}

// ─── Streak Shields ───

const DEFAULT_SHIELDS: StreakShieldState = {
  shields: 0,
  totalEarned: 0,
  lastEarnedAt: null,
  shieldsUsed: 0,
  lastUsedAt: null,
};

export function getStreakShields(): StreakShieldState {
  if (typeof window === "undefined") return DEFAULT_SHIELDS;
  try {
    const raw = localStorage.getItem(SHIELDS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SHIELDS;
  } catch {
    return DEFAULT_SHIELDS;
  }
}

export function saveStreakShields(state: StreakShieldState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SHIELDS_KEY, JSON.stringify(state));
  } catch {}
}

// ─── Daily Challenge ───

export function getDailyChallengeProgress(): DailyChallengeProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CHALLENGE_KEY);
    if (!raw) return null;
    const progress: DailyChallengeProgress = JSON.parse(raw);
    // Discard if not today
    const today = new Date().toISOString().split("T")[0];
    if (progress.date !== today) return null;
    return progress;
  } catch {
    return null;
  }
}

export function saveDailyChallengeProgress(progress: DailyChallengeProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHALLENGE_KEY, JSON.stringify(progress));
  } catch {}
}

// ─── Personal Records ───

export function getPersonalRecords(): Record<string, PersonalRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PRS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function savePersonalRecords(records: Record<string, PersonalRecord>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRS_KEY, JSON.stringify(records));
  } catch {}
}
