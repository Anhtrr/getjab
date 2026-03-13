import type { WorkoutLog } from "../types";

// ─── Boxing Title Ranks ───

export type BoxingTitle =
  | "Novice"
  | "Amateur"
  | "Prospect"
  | "Contender"
  | "Gatekeeper"
  | "Ranked Fighter"
  | "Title Challenger"
  | "Champion"
  | "Undisputed"
  | "Hall of Fame"
  | "GOAT";

export interface PlayerLevel {
  level: number;
  title: BoxingTitle;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
}

// ─── XP ───

export interface XPBreakdown {
  base: number;
  durationBonus: number;
  completionBonus: number;
  difficultyBonus: number;
  streakBonus: number;
  ratingBonus: number;
  total: number;
}

// ─── Badges ───

export type BadgeCategory =
  | "milestone"
  | "streak"
  | "variety"
  | "endurance"
  | "dedication"
  | "mastery";

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  condition: (logs: WorkoutLog[], streakLongest: number) => boolean;
}

export interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
}

// ─── Streak Shields ───

export interface StreakShieldState {
  shields: number;
  totalEarned: number;
  lastEarnedAt: string | null;
  shieldsUsed: number;
  lastUsedAt: string | null;
}

// ─── Daily Challenges ───

export type ChallengeType =
  | "complete_workout"
  | "complete_level"
  | "complete_goal"
  | "duration_target"
  | "rounds_target"
  | "tough_workout";

export interface DailyChallenge {
  id: string;
  date: string;
  type: ChallengeType;
  title: string;
  description: string;
  target: number;
  param?: string;
  xpReward: number;
}

export interface DailyChallengeProgress {
  challengeId: string;
  date: string;
  current: number;
  completed: boolean;
  completedAt?: string;
}

// ─── Personal Records ───

export type PRType =
  | "longest_workout"
  | "most_rounds"
  | "longest_streak"
  | "most_workouts_week"
  | "most_workouts_month"
  | "most_minutes_week"
  | "total_workouts"
  | "total_minutes";

export interface PersonalRecord {
  type: PRType;
  value: number;
  achievedAt: string;
  workoutId?: string;
  previousValue?: number;
}

// ─── Heatmap ───

export interface HeatmapDay {
  date: string;
  count: number;
  totalMinutes: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

// ─── Game State ───

export interface GameState {
  level: PlayerLevel;
  totalXP: number;
  badges: { earned: EarnedBadge[]; newlyUnlocked: string[] };
  streak: { current: number; longest: number };
  shields: StreakShieldState;
  todayChallenge: DailyChallenge;
  challengeProgress: DailyChallengeProgress;
  personalRecords: Record<string, PersonalRecord>;
  newPRs: PersonalRecord[];
  heatmap: HeatmapDay[];
}
