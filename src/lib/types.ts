export type Level = "beginner" | "intermediate" | "advanced";
export type Goal =
  | "technique"
  | "power"
  | "conditioning"
  | "speed"
  | "general";
export type RoundType =
  | "warmup"
  | "technique"
  | "bagwork"
  | "conditioning"
  | "cooldown";

export interface Round {
  type: RoundType;
  durationSec: number;
  restSec: number;
  title: string;
  instructions: string;
  combos?: string[];
  tips?: string[];
}

export interface Workout {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  level: Level;
  goal: Goal;
  durationMin: number;
  equipment: string[];
  isFree: boolean;
  rounds: Round[];
}

export interface PunchStats {
  total: number;
  byType: Record<string, number>; // { jab: 20, cross: 15, hook: 8, uppercut: 4 }
}

export interface WorkoutLog {
  workoutId: string;
  workoutTitle?: string;
  date: string;
  completedAt?: string;
  durationMin: number;
  roundsCompleted: number;
  totalRounds: number;
  rating: 1 | 2 | 3 | 4;
  punchStats?: PunchStats;
  caloriesEstimate?: number;
  xpEarned?: number;
}

export interface TimerSettings {
  rounds: number;
  roundDurationSec: number;
  restDurationSec: number;
  warningAtSec: number;
  prepTimeSec: number;
  muted?: boolean;
  hapticEnabled?: boolean;
}

export type TimerState =
  | "idle"
  | "preparing"
  | "running"
  | "resting"
  | "paused"
  | "complete";

// ─── Combo Callout Types ───

export interface ParsedPunch {
  number: number | string;
  name: string;
  shortName: string;
  hand: "lead" | "rear";
  type: "straight" | "hook" | "uppercut" | "defense";
  target?: "body" | "head";
}

export interface ParsedCombo {
  raw: string;
  punches: ParsedPunch[];
  isCallable: boolean;
  displayLabel: string;
}

export type CalloutPhase = "idle" | "entering" | "holding" | "exiting";

export interface CalloutState {
  activeCombo: ParsedCombo | null;
  activePunchIndex: number;
  phase: CalloutPhase;
  comboIndex: number;
  lastCombo: ParsedCombo | null;
}

export type CalloutPacing = "slow" | "medium" | "fast" | "progressive";

export interface CalloutSettings {
  pacing: CalloutPacing;
  audioEnabled: boolean;
  audioMode: "names" | "numbers";
}

export const PACING_CONFIG: Record<
  Exclude<CalloutPacing, "progressive">,
  { baseInterval: number; perPunch: number; hold: number; endBuffer: number }
> = {
  slow: { baseInterval: 4, perPunch: 2, hold: 3.5, endBuffer: 6 },
  medium: { baseInterval: 2.5, perPunch: 1.5, hold: 2.5, endBuffer: 5 },
  fast: { baseInterval: 1.5, perPunch: 1, hold: 2, endBuffer: 3 },
};
