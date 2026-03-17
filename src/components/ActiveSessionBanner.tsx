"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, X } from "lucide-react";

const WORKOUT_STATE_KEY = "jab_active_workout";
const STALE_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 hours

interface WorkoutState {
  workoutId: string;
  currentRoundIndex: number;
  secondsLeft: number;
  isResting: boolean;
  roundsCompleted: number;
  startTime: number;
  savedAt: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ActiveSessionBanner() {
  const pathname = usePathname();
  const [workoutState, setWorkoutState] = useState<WorkoutState | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function check() {
      try {
        const raw = sessionStorage.getItem(WORKOUT_STATE_KEY);
        if (raw) {
          const parsed: WorkoutState = JSON.parse(raw);
          if (Date.now() - parsed.savedAt > STALE_THRESHOLD_MS) {
            sessionStorage.removeItem(WORKOUT_STATE_KEY);
            setWorkoutState(null);
          } else {
            setWorkoutState(parsed);
          }
        } else {
          setWorkoutState(null);
        }
      } catch {
        setWorkoutState(null);
      }
    }

    check();
    window.addEventListener("focus", check);
    return () => window.removeEventListener("focus", check);
  }, [pathname]);

  // Hide on go pages (workout handles its own resume)
  if (pathname.includes("/go")) {
    return null;
  }

  if (workoutState && !dismissed) {
    return (
      <div className="fixed bottom-16 left-0 right-0 z-40 px-3 animate-slide-in-bottom">
        <div className="max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto card-glass rounded-2xl p-3 !border-accent/30 !shadow-[0_0_20px_rgba(0,229,255,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
              <Play className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-accent uppercase tracking-wider">
                Workout Paused
              </p>
              <p className="text-xs text-muted truncate">
                Round {workoutState.currentRoundIndex + 1} &middot;{" "}
                {formatTime(workoutState.secondsLeft)}
                {workoutState.isResting ? " (Rest)" : ""}
              </p>
            </div>
            <Link
              href={`/workouts/${workoutState.workoutId}/go`}
              className="btn-primary px-4 py-2 rounded-full text-xs font-bold shrink-0"
            >
              RESUME
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem(WORKOUT_STATE_KEY);
                setWorkoutState(null);
                setDismissed(true);
              }}
              className="text-muted hover:text-foreground transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
