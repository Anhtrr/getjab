interface WorkoutStartButtonProps {
  onClick: () => void;
}

export default function WorkoutStartButton({
  onClick,
}: WorkoutStartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-center btn-primary text-lg py-4 rounded-full animate-start-glow"
    >
      Start Workout
    </button>
  );
}
