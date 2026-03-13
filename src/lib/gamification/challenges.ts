import type { DailyChallenge, DailyChallengeProgress } from "./types";
import type { WorkoutLog } from "../types";

interface ChallengeTemplate {
  type: DailyChallenge["type"];
  title: string;
  description: string;
  target: number;
  xpReward: number;
  param?: string;
}

const TEMPLATES: ChallengeTemplate[] = [
  { type: "complete_workout", title: "Daily Training", description: "Complete any workout today", target: 1, xpReward: 30 },
  { type: "complete_workout", title: "Double Down", description: "Complete 2 workouts today", target: 2, xpReward: 60 },
  { type: "complete_level", title: "Step Up", description: "Complete an intermediate or advanced workout", target: 1, xpReward: 40, param: "intermediate" },
  { type: "complete_level", title: "Advanced Challenge", description: "Complete an advanced workout", target: 1, xpReward: 50, param: "advanced" },
  { type: "complete_goal", title: "Power Day", description: "Complete a power-focused workout", target: 1, xpReward: 40, param: "power" },
  { type: "complete_goal", title: "Speed Demon", description: "Complete a speed-focused workout", target: 1, xpReward: 40, param: "speed" },
  { type: "complete_goal", title: "Conditioning Day", description: "Complete a conditioning workout", target: 1, xpReward: 40, param: "conditioning" },
  { type: "duration_target", title: "30-Minute Session", description: "Train for at least 30 minutes total today", target: 30, xpReward: 45 },
  { type: "duration_target", title: "Marathon Session", description: "Train for at least 45 minutes total today", target: 45, xpReward: 60 },
  { type: "rounds_target", title: "Round Collector", description: "Complete at least 12 rounds today", target: 12, xpReward: 40 },
  { type: "tough_workout", title: "Embrace the Pain", description: "Rate a workout as Tough or Destroyed Me", target: 1, xpReward: 35 },
];

function hashDate(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function generateDailyChallenge(dateStr: string): DailyChallenge {
  const seed = hashDate(dateStr);
  const template = TEMPLATES[seed % TEMPLATES.length];

  return {
    id: `challenge-${dateStr}`,
    date: dateStr,
    type: template.type,
    title: template.title,
    description: template.description,
    target: template.target,
    param: template.param,
    xpReward: template.xpReward,
  };
}

export function evaluateChallengeProgress(
  todayLogs: WorkoutLog[],
  challenge: DailyChallenge,
  existing: DailyChallengeProgress | null,
): DailyChallengeProgress {
  // If already completed, keep it
  if (existing?.completed && existing.challengeId === challenge.id) {
    return existing;
  }

  let current = 0;

  switch (challenge.type) {
    case "complete_workout":
      current = todayLogs.length;
      break;
    case "complete_level":
      // We can't check workout level without the workout object,
      // so count all workouts (the hook will filter by level when integrating)
      current = todayLogs.length;
      break;
    case "complete_goal":
      current = todayLogs.length;
      break;
    case "duration_target":
      current = todayLogs.reduce((sum, l) => sum + l.durationMin, 0);
      break;
    case "rounds_target":
      current = todayLogs.reduce((sum, l) => sum + l.roundsCompleted, 0);
      break;
    case "tough_workout":
      current = todayLogs.filter((l) => l.rating >= 3).length;
      break;
  }

  const completed = current >= challenge.target;

  return {
    challengeId: challenge.id,
    date: challenge.date,
    current,
    completed,
    completedAt: completed && !existing?.completed ? new Date().toISOString() : existing?.completedAt,
  };
}
