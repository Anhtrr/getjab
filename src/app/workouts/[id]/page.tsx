"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getWorkout } from "@/data/workouts";
import { useCustomWorkouts } from "@/hooks/useCustomWorkouts";
import WorkoutStartButton from "@/components/WorkoutStartButton";
import type { RoundType } from "@/lib/types";
import { Pencil, Trash2 } from "lucide-react";

const roundTypeColors: Record<RoundType, string> = {
  warmup: "text-yellow-400 bg-yellow-400/10",
  technique: "text-blue-400 bg-blue-400/10",
  bagwork: "text-red-400 bg-red-400/10",
  conditioning: "text-orange-400 bg-orange-400/10",
  cooldown: "text-green-400 bg-green-400/10",
};

const levelColors = {
  beginner: "text-green-400",
  intermediate: "text-yellow-400",
  advanced: "text-red-400",
};

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { remove } = useCustomWorkouts();
  const id = params.id as string;
  const workout = getWorkout(id);

  if (!workout) {
    return (
      <div className="px-4 pt-8 pb-8 max-w-lg md:max-w-2xl mx-auto text-center">
        <p className="text-muted mb-4">Workout not found.</p>
        <Link href="/workouts" className="text-[#00e5ff] hover:underline">
          Back to workouts
        </Link>
      </div>
    );
  }

  const isCustom = id.startsWith("custom-");

  const totalDuration = workout.rounds.reduce(
    (sum, r) => sum + r.durationSec + r.restSec,
    0,
  );

  function handleDelete() {
    if (window.confirm("Delete this workout? This can't be undone.")) {
      remove(id);
      router.push("/workouts");
    }
  }

  return (
    <div className="px-4 pt-8 pb-8 max-w-lg md:max-w-2xl mx-auto">
      <Link
        href="/workouts"
        className="text-muted text-sm hover:text-foreground mb-4 inline-block"
      >
        &larr; Back to workouts
      </Link>

      <div className="mb-6 animate-fade-in-up">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold">{workout.title}</h1>
          <div className="flex items-center gap-2 ml-2 shrink-0">
            {isCustom && (
              <>
                <Link
                  href={`/workouts/edit/${id}`}
                  className="text-muted hover:text-[#00e5ff] transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-muted hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
        <p className="text-muted mt-1">{workout.description}</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <span className={`text-sm font-medium ${levelColors[workout.level]}`}>
          {workout.level}
        </span>
        <span className="text-sm text-muted">
          {Math.round(totalDuration / 60)} min
        </span>
        <span className="text-sm text-muted">
          {workout.rounds.length} rounds
        </span>
        {workout.equipment.length > 0 && (
          <span className="text-sm text-muted">
            {workout.equipment.join(", ")}
          </span>
        )}
      </div>

      <div className="space-y-3 mb-8 stagger-children">
        {workout.rounds.map((round, i) => (
          <div
            key={i}
            className="card-glass rounded-xl p-4 hover:border-[#00e5ff]/20 transition-colors animate-fade-in-up"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted font-mono">
                  R{i + 1}
                </span>
                <span className="font-medium">{round.title}</span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${roundTypeColors[round.type]}`}
              >
                {round.type}
              </span>
            </div>
            <p className="text-sm text-muted mt-1">{round.instructions}</p>
            {round.combos && round.combos.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {round.combos.map((combo, j) => (
                  <span
                    key={j}
                    className="text-xs font-mono bg-border/50 text-foreground px-2 py-0.5 rounded"
                  >
                    {combo}
                  </span>
                ))}
              </div>
            )}
            <div className="text-xs text-muted mt-2">
              {Math.floor(round.durationSec / 60)}:
              {(round.durationSec % 60).toString().padStart(2, "0")}
              {round.restSec > 0 && ` + ${round.restSec}s rest`}
            </div>
          </div>
        ))}
      </div>

      <WorkoutStartButton workoutId={workout.id} />
    </div>
  );
}
