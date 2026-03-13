import Link from "next/link";
import { CheckCircle } from "lucide-react";
import type { Workout } from "@/lib/types";

interface WorkoutCardProps {
  workout: Workout;
  completionInfo?: {
    completionCount: number;
    lastCompletedAt: string | null;
  };
}

const levelColors = {
  beginner: "text-green-400 bg-green-400/10 border-green-400/20",
  intermediate: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  advanced: "text-red-400 bg-red-400/10 border-red-400/20",
};

const goalLabels: Record<string, string> = {
  technique: "Technique",
  power: "Power",
  conditioning: "Conditioning",
  speed: "Speed",
  general: "General",
};

export default function WorkoutCard({ workout, completionInfo }: WorkoutCardProps) {
  return (
    <Link
      href={`/workouts/${workout.id}`}
      className="block card-glass rounded-2xl p-5 card-premium glow-ring"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-bold text-lg leading-tight">{workout.title}</h3>
          <p className="text-muted text-sm mt-0.5">{workout.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${levelColors[workout.level]}`}
        >
          {workout.level}
        </span>
        <span className="text-xs text-muted bg-border/50 px-2 py-0.5 rounded-full">
          {goalLabels[workout.goal]}
        </span>
        <span className="text-xs text-muted">{workout.durationMin} min</span>
        <span className="text-xs text-muted">{workout.rounds.length} rounds</span>
      </div>

      {workout.equipment.length > 0 && (
        <div className="flex items-center gap-1 mt-2">
          <span className="text-xs text-muted">
            {workout.equipment.join(" + ")}
          </span>
        </div>
      )}

      {completionInfo && completionInfo.completionCount > 0 && (
        <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-border/50">
          <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
          <span className="text-xs text-green-400 font-medium">
            {completionInfo.completionCount}x completed
          </span>
          {completionInfo.lastCompletedAt && (
            <span className="text-xs text-muted ml-auto">
              Last: {new Date(completionInfo.lastCompletedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
