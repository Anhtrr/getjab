interface StreakCounterProps {
  current: number;
  longest: number;
  totalWorkouts: number;
}

export default function StreakCounter({
  current,
  longest,
  totalWorkouts,
}: StreakCounterProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="card-glass rounded-xl p-4 text-center">
        <span className="text-3xl font-black text-accent block animate-streak-in">
          {current}
        </span>
        <span className="text-xs text-muted">Day Streak</span>
      </div>
      <div className="card-glass rounded-xl p-4 text-center">
        <span className="text-3xl font-black text-accent-secondary block animate-streak-in" style={{ animationDelay: "100ms" }}>
          {longest}
        </span>
        <span className="text-xs text-muted">Best Streak</span>
      </div>
      <div className="card-glass rounded-xl p-4 text-center">
        <span className="text-3xl font-black block animate-streak-in" style={{ animationDelay: "200ms" }}>{totalWorkouts}</span>
        <span className="text-xs text-muted">Total</span>
      </div>
    </div>
  );
}
