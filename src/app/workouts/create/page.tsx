"use client";

import Link from "next/link";
import WorkoutBuilderForm from "@/components/WorkoutBuilderForm";

export default function CreateWorkoutPage() {
  return (
      <div className="px-4 pt-8 pb-8 max-w-lg mx-auto">
        <Link
          href="/workouts"
          className="text-muted text-sm hover:text-foreground mb-4 inline-block"
        >
          &larr; Back to workouts
        </Link>

        <h1 className="text-2xl font-bold mb-6 animate-fade-in-up">
          Create Workout
        </h1>

        <WorkoutBuilderForm />
      </div>
  );
}
