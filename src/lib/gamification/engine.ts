import type {
  BoxingTitle,
  PlayerLevel,
  XPBreakdown,
  EarnedBadge,
  StreakShieldState,
  DailyChallengeProgress,
  PersonalRecord,
  PRType,
  HeatmapDay,
  GameState,
} from "./types";
import type { WorkoutLog, Workout } from "../types";
import { BADGE_DEFINITIONS } from "./badges";
import { generateDailyChallenge, evaluateChallengeProgress } from "./challenges";

// ─── XP Calculation ───

const DIFFICULTY_MULT: Record<string, number> = {
  beginner: 1.0,
  intermediate: 1.5,
  advanced: 2.0,
};

const RATING_BONUS: Record<number, number> = { 1: 0, 2: 10, 3: 20, 4: 30 };

export function calculateXP(
  log: WorkoutLog,
  workoutLevel: string | undefined,
  currentStreak: number,
): XPBreakdown {
  const base = 50;
  const durationBonus = (log.durationMin || 0) * 2;
  const completionBonus = (log.roundsCompleted || 0) >= (log.totalRounds || 1) ? 25 : 0;
  const mult = DIFFICULTY_MULT[workoutLevel ?? "beginner"] ?? 1.0;
  const difficultyBonus = Math.round(base * (mult - 1));
  const streakMultiplier = Math.min((currentStreak || 0) * 0.1, 0.5);
  const streakBonus = Math.round(base * streakMultiplier);
  const ratingBonus = RATING_BONUS[log.rating] ?? 0;
  const total = base + durationBonus + completionBonus + difficultyBonus + streakBonus + ratingBonus;

  return { base, durationBonus, completionBonus, difficultyBonus, streakBonus, ratingBonus, total };
}

export function computeTotalXP(
  logs: WorkoutLog[],
  challengeCompletions: number,
): number {
  let xp = 0;
  for (const log of logs) {
    // Use stored XP if available (accurate), otherwise fall back to base calculation
    if (log.xpEarned != null) {
      xp += log.xpEarned;
    } else {
      const breakdown = calculateXP(log, undefined, 0);
      xp += breakdown.total;
    }
  }
  // Add challenge XP (30-60 per challenge, simplified to 40 average)
  xp += challengeCompletions * 40;
  return xp;
}

// ─── Levels ───

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return 75 * level * level + 25 * level - 100;
}

export function getBoxingTitle(level: number): BoxingTitle {
  if (level >= 50) return "GOAT";
  if (level >= 45) return "Hall of Fame";
  if (level >= 40) return "Undisputed";
  if (level >= 35) return "Champion";
  if (level >= 30) return "Title Challenger";
  if (level >= 25) return "Ranked Fighter";
  if (level >= 20) return "Gatekeeper";
  if (level >= 15) return "Contender";
  if (level >= 10) return "Prospect";
  if (level >= 5) return "Amateur";
  return "Novice";
}

export function getPlayerLevel(totalXP: number): PlayerLevel {
  // Safety: clamp to valid number, cap at level 100 to prevent runaway loops
  const safeXP = Number.isFinite(totalXP) ? Math.max(0, totalXP) : 0;
  let level = 1;
  while (xpForLevel(level + 1) <= safeXP && level < 100) {
    level++;
  }
  const currentThreshold = xpForLevel(level);
  const nextThreshold = xpForLevel(level + 1);
  const range = nextThreshold - currentThreshold;
  const progress = safeXP - currentThreshold;
  const progressPercent = range > 0 ? Math.min(Math.round((progress / range) * 100), 100) : 0;

  return {
    level,
    title: getBoxingTitle(level),
    currentXP: safeXP,
    xpForCurrentLevel: currentThreshold,
    xpForNextLevel: nextThreshold,
    progressPercent,
  };
}

// ─── Badges ───

export function evaluateBadges(
  logs: WorkoutLog[],
  longestStreak: number,
  earned: EarnedBadge[],
): { earned: EarnedBadge[]; newlyUnlocked: string[] } {
  const earnedIds = new Set(earned.map((b) => b.badgeId));
  const newlyUnlocked: string[] = [];
  const allEarned = [...earned];

  for (const badge of BADGE_DEFINITIONS) {
    if (earnedIds.has(badge.id)) continue;
    if (badge.condition(logs, longestStreak)) {
      const newBadge: EarnedBadge = {
        badgeId: badge.id,
        earnedAt: new Date().toISOString(),
      };
      allEarned.push(newBadge);
      newlyUnlocked.push(badge.id);
    }
  }

  return { earned: allEarned, newlyUnlocked };
}

// ─── Streak with Shields ───

function dayDiff(a: string, b: string): number {
  const dateA = new Date(a);
  const dateB = new Date(b);
  return Math.round(Math.abs(dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24));
}

export function computeStreakWithShields(
  logs: WorkoutLog[],
  shields: StreakShieldState,
): { current: number; longest: number; shieldsRemaining: number; shieldsUsedNow: number } {
  if (logs.length === 0) return { current: 0, longest: 0, shieldsRemaining: shields.shields, shieldsUsedNow: 0 };

  const uniqueDates = [...new Set(logs.map((l) => l.date))].sort().reverse();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Check if streak is active
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    // Check if a shield can bridge the gap
    const gap = dayDiff(today, uniqueDates[0]);
    if (gap === 2 && shields.shields > 0) {
      // Shield can bridge 1 missed day (gap of 2 means 1 day missed)
      // Calculate streak with shield
      let streak = 1;
      let shieldsUsed = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const diff = dayDiff(uniqueDates[i - 1], uniqueDates[i]);
        if (diff === 1) {
          streak++;
        } else if (diff === 2 && shieldsUsed < shields.shields) {
          streak++;
          shieldsUsed++;
        } else {
          break;
        }
      }
      // Calculate longest
      let longest = streak;
      let tempStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const diff = dayDiff(uniqueDates[i - 1], uniqueDates[i]);
        if (diff <= 2) tempStreak++;
        else {
          longest = Math.max(longest, tempStreak);
          tempStreak = 1;
        }
      }
      longest = Math.max(longest, tempStreak);
      return { current: streak, longest, shieldsRemaining: shields.shields - shieldsUsed, shieldsUsedNow: shieldsUsed };
    }

    // Streak broken
    let longest = 0;
    let tempStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = dayDiff(uniqueDates[i - 1], uniqueDates[i]);
      if (diff === 1) tempStreak++;
      else { longest = Math.max(longest, tempStreak); tempStreak = 1; }
    }
    longest = Math.max(longest, tempStreak);
    return { current: 0, longest, shieldsRemaining: shields.shields, shieldsUsedNow: 0 };
  }

  // Active streak
  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = dayDiff(uniqueDates[i - 1], uniqueDates[i]);
    if (diff === 1) streak++;
    else break;
  }

  let longest = streak;
  let tempStreak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = dayDiff(uniqueDates[i - 1], uniqueDates[i]);
    if (diff === 1) tempStreak++;
    else { longest = Math.max(longest, tempStreak); tempStreak = 1; }
  }
  longest = Math.max(longest, tempStreak);

  return { current: streak, longest, shieldsRemaining: shields.shields, shieldsUsedNow: 0 };
}

export function computeShieldEarnings(longestStreak: number, shields: StreakShieldState): StreakShieldState {
  // Earn 1 shield per 7-day streak milestone, max 3 stockpiled
  const milestonesReached = Math.floor(longestStreak / 7);
  const shouldHaveEarned = milestonesReached;
  const newEarnings = Math.max(0, shouldHaveEarned - shields.totalEarned);

  if (newEarnings > 0) {
    return {
      ...shields,
      shields: Math.min(shields.shields + newEarnings, 3),
      totalEarned: shields.totalEarned + newEarnings,
      lastEarnedAt: new Date().toISOString(),
    };
  }
  return shields;
}

// ─── Personal Records ───

function getISOWeek(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

function getMonth(dateStr: string): string {
  return dateStr.slice(0, 7);
}

export function checkPersonalRecords(
  logs: WorkoutLog[],
  longestStreak: number,
  existing: Record<string, PersonalRecord>,
): { updated: Record<string, PersonalRecord>; newPRs: PersonalRecord[] } {
  const updated = { ...existing };
  const newPRs: PersonalRecord[] = [];

  function checkPR(type: PRType, value: number, workoutId?: string) {
    if (!existing[type] || value > existing[type].value) {
      const pr: PersonalRecord = {
        type,
        value,
        achievedAt: new Date().toISOString(),
        workoutId,
        previousValue: existing[type]?.value,
      };
      updated[type] = pr;
      if (existing[type]) newPRs.push(pr);
    }
  }

  if (logs.length === 0) return { updated, newPRs };

  // Longest workout
  const maxDuration = Math.max(...logs.map((l) => l.durationMin || 0));
  if (Number.isFinite(maxDuration)) checkPR("longest_workout", maxDuration);

  // Most rounds
  const maxRounds = Math.max(...logs.map((l) => l.roundsCompleted || 0));
  if (Number.isFinite(maxRounds)) checkPR("most_rounds", maxRounds);

  // Longest streak
  checkPR("longest_streak", longestStreak);

  // Most workouts in a week
  const weekCounts = new Map<string, number>();
  for (const log of logs) {
    const week = getISOWeek(log.date);
    weekCounts.set(week, (weekCounts.get(week) || 0) + 1);
  }
  const maxWeekWorkouts = weekCounts.size > 0 ? Math.max(...weekCounts.values()) : 0;
  if (Number.isFinite(maxWeekWorkouts)) checkPR("most_workouts_week", maxWeekWorkouts);

  // Most workouts in a month
  const monthCounts = new Map<string, number>();
  for (const log of logs) {
    const month = getMonth(log.date);
    monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
  }
  const maxMonthWorkouts = monthCounts.size > 0 ? Math.max(...monthCounts.values()) : 0;
  if (Number.isFinite(maxMonthWorkouts)) checkPR("most_workouts_month", maxMonthWorkouts);

  // Most minutes in a week
  const weekMinutes = new Map<string, number>();
  for (const log of logs) {
    const week = getISOWeek(log.date);
    weekMinutes.set(week, (weekMinutes.get(week) || 0) + log.durationMin);
  }
  const maxWeekMinutes = weekMinutes.size > 0 ? Math.max(...weekMinutes.values()) : 0;
  if (Number.isFinite(maxWeekMinutes)) checkPR("most_minutes_week", maxWeekMinutes);

  // Total milestones
  checkPR("total_workouts", logs.length);
  checkPR("total_minutes", logs.reduce((s, l) => s + l.durationMin, 0));

  return { updated, newPRs };
}

// ─── Heatmap ───

export function computeHeatmap(logs: WorkoutLog[]): HeatmapDay[] {
  const dayMap = new Map<string, { count: number; minutes: number }>();

  for (const log of logs) {
    const existing = dayMap.get(log.date) || { count: 0, minutes: 0 };
    dayMap.set(log.date, {
      count: existing.count + 1,
      minutes: existing.minutes + log.durationMin,
    });
  }

  // Generate 26 weeks of days
  const days: HeatmapDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 26 * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const data = dayMap.get(dateStr);

    let intensity: 0 | 1 | 2 | 3 | 4 = 0;
    if (data) {
      if (data.minutes >= 46) intensity = 4;
      else if (data.minutes >= 31) intensity = 3;
      else if (data.minutes >= 16) intensity = 2;
      else intensity = 1;
    }

    days.push({
      date: dateStr,
      count: data?.count || 0,
      totalMinutes: data?.minutes || 0,
      intensity,
    });
  }

  return days;
}

// ─── Full Game State Computation ───

export function computeGameState(
  logs: WorkoutLog[],
  earnedBadges: EarnedBadge[],
  shields: StreakShieldState,
  personalRecords: Record<string, PersonalRecord>,
  challengeProgress: DailyChallengeProgress | null,
): GameState {
  const today = new Date().toISOString().split("T")[0];
  const todayLogs = logs.filter((l) => l.date === today);

  // Streak
  const streakResult = computeStreakWithShields(logs, shields);

  // Shields
  const updatedShields = computeShieldEarnings(streakResult.longest, shields);

  // XP & Level
  const completedChallenges = challengeProgress?.completed ? 1 : 0;
  const totalXP = computeTotalXP(logs, completedChallenges);
  const level = getPlayerLevel(totalXP);

  // Badges
  const badgeResult = evaluateBadges(logs, streakResult.longest, earnedBadges);

  // Daily challenge
  const todayChallenge = generateDailyChallenge(today);
  const updatedChallengeProgress = evaluateChallengeProgress(todayLogs, todayChallenge, challengeProgress);

  // PRs
  const prResult = checkPersonalRecords(logs, streakResult.longest, personalRecords);

  // Heatmap
  const heatmap = computeHeatmap(logs);

  return {
    level,
    totalXP,
    badges: badgeResult,
    streak: { current: streakResult.current, longest: streakResult.longest },
    shields: updatedShields,
    todayChallenge,
    challengeProgress: updatedChallengeProgress,
    personalRecords: prResult.updated,
    newPRs: prResult.newPRs,
    heatmap,
  };
}
