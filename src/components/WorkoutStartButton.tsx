import Link from "next/link";

interface WorkoutStartButtonProps {
  workoutId: string;
}

export default function WorkoutStartButton({
  workoutId,
}: WorkoutStartButtonProps) {
  return (
    <Link
      href={`/workouts/${workoutId}/go`}
      className="block w-full text-center btn-primary text-lg py-4 rounded-full"
    >
      Start Workout
    </Link>
  );
}
