import { memo } from "react";
import type { TimerState } from "@/lib/types";

interface TimerControlsProps {
  state: TimerState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

function TimerControls({
  state,
  onStart,
  onPause,
  onResume,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 animate-fade-in-up">
      {state === "idle" && (
        <button
          onClick={onStart}
          className="btn-primary text-xl w-full py-5 rounded-full animate-start-glow"
        >
          START
        </button>
      )}

      {(state === "running" || state === "resting" || state === "preparing") && (
        <>
          <button
            onClick={onPause}
            className="btn-secondary border border-border text-foreground font-bold text-lg px-8 py-4 rounded-full"
          >
            PAUSE
          </button>
          <button
            onClick={onReset}
            className="btn-secondary border border-border text-muted font-medium px-6 py-4 rounded-full"
          >
            RESET
          </button>
        </>
      )}

      {state === "paused" && (
        <>
          <button
            onClick={onResume}
            className="btn-primary text-lg px-8 py-4 rounded-full"
          >
            RESUME
          </button>
          <button
            onClick={onReset}
            className="btn-secondary border border-border text-muted font-medium px-6 py-4 rounded-full"
          >
            RESET
          </button>
        </>
      )}

      {state === "complete" && (
        <button
          onClick={onReset}
          className="btn-primary text-lg px-12 py-4 rounded-full"
        >
          RESTART
        </button>
      )}
    </div>
  );
}

export default memo(TimerControls);
