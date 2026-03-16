"use client";

import { useMemo } from "react";
import { useParams, redirect } from "next/navigation";
import Link from "next/link";
import { getCustomWorkout } from "@/lib/customWorkouts";
import WorkoutBuilderForm from "@/components/WorkoutBuilderForm";

export default function EditWorkoutPage() {
  const params = useParams();
  const id = params.id as string;

  const workout = useMemo(() => {
    if (!id.startsWith("custom-")) return null;
    return getCustomWorkout(id) ?? null;
  }, [id]);

  if (!workout) {
    redirect("/workouts");
  }

  return (
    <div className="px-4 pt-8 pb-8 max-w-lg md:max-w-2xl mx-auto">
      <Link
        href={`/workouts/${id}`}
        className="text-muted text-sm hover:text-foreground mb-4 inline-block"
      >
        &larr; Back to workout
      </Link>

      <h1 className="text-2xl font-bold mb-6 animate-fade-in-up">
        Edit Workout
      </h1>

      <WorkoutBuilderForm initialWorkout={workout} />
    </div>
  );
}
