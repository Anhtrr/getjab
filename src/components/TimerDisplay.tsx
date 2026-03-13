import { memo, useMemo, useRef, useCallback } from "react";
import type { TimerState } from "@/lib/types";

interface TimerDisplayProps {
  secondsLeft: number;
  state: TimerState;
  currentRound: number;
  totalRounds: number;
  warningAtSec?: number;
  roundDurationSec?: number;
  restDurationSec?: number;
  onSkipPhase?: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function getGlowGradient(
  state: TimerState,
  secondsLeft: number,
  warningAtSec: number,
): string {
  if (state === "idle") return "none";
  // Warning: red
  if (state === "running" && warningAtSec > 0 && secondsLeft <= warningAtSec)
    return "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(239,68,68,0.25) 0%, rgba(239,68,68,0.1) 35%, transparent 65%)";
  // Running: brand cyan
  if (state === "running")
    return "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(0,229,255,0.2) 0%, rgba(0,229,255,0.07) 35%, transparent 65%)";
  // Rest: purple/violet
  if (state === "resting")
    return "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(168,85,247,0.22) 0%, rgba(168,85,247,0.08) 35%, transparent 65%)";
  // Preparing: amber
  if (state === "preparing")
    return "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.07) 35%, transparent 65%)";
  // Paused: yellow
  if (state === "paused")
    return "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(234,179,8,0.15) 0%, rgba(234,179,8,0.05) 35%, transparent 65%)";
  // Complete: green
  if (state === "complete")
    return "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0.06) 35%, transparent 65%)";
  return "none";
}

function TimerDisplay({
  secondsLeft,
  state,
  currentRound,
  totalRounds,
  warningAtSec = 10,
  roundDurationSec = 180,
  restDurationSec = 60,
  onSkipPhase,
}: TimerDisplayProps) {
  // Triple-tap to skip phase (hidden dev shortcut)
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCountdownTap = useCallback(() => {
    if (!onSkipPhase) return;
    if (state === "idle" || state === "complete") return;

    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      onSkipPhase();
      return;
    }

    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 500);
  }, [onSkipPhase, state]);
  const stateLabel =
    state === "preparing"
      ? "GET READY"
      : state === "resting"
        ? "REST"
        : state === "running"
          ? "ROUND"
          : state === "paused"
            ? "PAUSED"
            : state === "complete"
              ? "DONE"
              : "";

  const stateColor =
    state === "preparing"
      ? "text-amber-400"
      : state === "resting"
        ? "text-purple-400"
        : state === "running"
          ? "text-accent"
          : state === "paused"
            ? "text-yellow-400"
            : state === "complete"
              ? "text-green-400"
              : "text-muted";

  const isActive = state !== "idle" && state !== "complete";
  const isWarning =
    state === "running" && warningAtSec > 0 && secondsLeft <= warningAtSec;
  const glowGradient = getGlowGradient(state, secondsLeft, warningAtSec);

  // Segmented progress bar
  const roundProgress = useMemo(() => {
    if (!isActive || totalRounds <= 1) return null;

    return (
      <div className="flex items-center gap-1 w-full max-w-xs px-4">
        {Array.from({ length: totalRounds }, (_, i) => {
          const isCompleted = i < currentRound - 1;
          const isCurrent = i === currentRound - 1;
          const isResting = state === "resting" && i === currentRound - 1;

          return (
            <div
              key={i}
              className="flex-1 relative"
              style={{ height: 6, borderRadius: 3 }}
            >
              {/* Background track */}
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: "rgba(255,255,255,0.1)" }}
              />
              {/* Fill */}
              {(isCompleted || isCurrent) && (
                <div
                  className="absolute inset-0 rounded-full transition-all duration-300"
                  style={{
                    background: isResting
                      ? "rgb(168,85,247)"
                      : isWarning && isCurrent
                        ? "rgb(239,68,68)"
                        : "rgb(0,229,255)",
                    boxShadow: isCurrent
                      ? isResting
                        ? "0 0 8px rgba(168,85,247,0.5)"
                        : isWarning
                          ? "0 0 8px rgba(239,68,68,0.5)"
                          : "0 0 8px rgba(0,229,255,0.5)"
                      : "none",
                    opacity: isCompleted ? 0.5 : 1,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }, [isActive, totalRounds, currentRound, state, isWarning]);

  return (
    <>
      {/* Ambient radial glow — soft, centered, no hard edges */}
      {state !== "idle" && (
        <div
          className={`fixed inset-0 -z-10 pointer-events-none transition-opacity duration-700 ${
            isWarning ? "animate-timer-bg-pulse" : ""
          }`}
          style={{ backgroundImage: glowGradient }}
        />
      )}

      <div className="flex flex-col items-center justify-center gap-4 animate-fade-in w-full">
        {state !== "idle" && (
          <div className="flex items-center gap-3">
            <span
              className={`text-lg font-bold uppercase tracking-[0.2em] ${stateColor} ${state === "preparing" ? "animate-pulse-ready" : ""}`}
            >
              {stateLabel}
            </span>
            {state !== "complete" && state !== "preparing" && (
              <span className="text-lg text-muted font-medium">
                {currentRound} / {totalRounds}
              </span>
            )}
          </div>
        )}

        {/* Timer digits — large and dominant (triple-tap to skip) */}
        <div className="relative" onClick={handleCountdownTap}>
          {/* Glow backdrop */}
          {isActive && (
            <div
              className={`absolute inset-0 blur-3xl opacity-20 rounded-full scale-150 ${
                state === "resting"
                  ? "bg-purple-500"
                  : isWarning
                    ? "bg-red-500"
                    : "bg-[#00e5ff]"
              }`}
            />
          )}
          <div
            className={`relative font-mono font-black tabular-nums tracking-wider leading-none ${
              state === "idle"
                ? "text-6xl"
                : "text-[clamp(7rem,35vw,20rem)]"
            } ${
              state === "preparing" ? "text-amber-400 animate-pulse-ready" : ""
            } ${state === "resting" ? "text-purple-400 animate-rest-glow" : ""} ${
              isWarning ? "text-red-400 animate-timer-warning" : ""
            } ${state === "running" && !isWarning ? "text-accent animate-timer-glow" : ""} ${
              state === "complete" ? "text-green-400" : ""
            }`}
          >
            {state === "complete" ? "0:00" : formatTime(secondsLeft)}
          </div>
        </div>

        {/* Round progress bar */}
        {roundProgress}

        {/* Total session remaining */}
        {isActive && state !== "preparing" && (() => {
          const remainingRounds = totalRounds - currentRound;
          const currentPhaseLeft = secondsLeft;
          const futureRoundsTime = remainingRounds * roundDurationSec;
          const futureRestsTime = state === "resting"
            ? remainingRounds * restDurationSec
            : Math.max(0, remainingRounds) * restDurationSec;
          const totalLeft = currentPhaseLeft + futureRoundsTime + futureRestsTime;
          const mins = Math.floor(totalLeft / 60);
          const secs = totalLeft % 60;
          return (
            <p className="text-xs text-muted tabular-nums mt-1">
              {mins}:{secs.toString().padStart(2, "0")} total remaining
            </p>
          );
        })()}

        {/* Summary line and CTA handled by parent in idle state */}
      </div>
    </>
  );
}

export default memo(TimerDisplay);
