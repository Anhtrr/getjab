"use client";

import { useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import { Clock, Target, CheckCircle, Smile, ThumbsUp, Flame, Skull, Share2 } from "lucide-react";
import { useTimer } from "@/hooks/useTimer";
import { useAudio } from "@/hooks/useAudio";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useProgress } from "@/hooks/useProgress";
import { useGamification } from "@/hooks/useGamification";
import { vibrateRoundStart, vibrateRoundEnd, vibrateWarning } from "@/lib/haptics";
import { findMatchingPreset } from "@/lib/timerPresets";
import { shareWorkoutCard } from "@/lib/shareCard";
import { getDisplayName, setDisplayName } from "@/lib/displayName";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";
import TimerSettings from "./TimerSettings";

const ratings: { value: 1 | 2 | 3 | 4; label: string; icon: ReactNode }[] = [
  { value: 1, label: "Easy", icon: <Smile className="w-6 h-6" /> },
  { value: 2, label: "Just Right", icon: <ThumbsUp className="w-6 h-6" /> },
  { value: 3, label: "Tough", icon: <Flame className="w-6 h-6" /> },
  { value: 4, label: "Destroyed", icon: <Skull className="w-6 h-6" /> },
];

export default function Timer() {
  const audio = useAudio();
  const { logWorkout } = useProgress();
  const { gameState } = useGamification();
  const settingsRef = useRef<{ muted?: boolean; hapticEnabled?: boolean }>({});
  const [rated, setRated] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [sessionRating, setSessionRating] = useState<1 | 2 | 3 | 4>(2);

  const onRoundStart = useCallback(() => {
    if (!settingsRef.current.muted) audio.playRoundStart();
    if (settingsRef.current.hapticEnabled) vibrateRoundStart();
  }, [audio]);

  const onRoundEnd = useCallback(() => {
    if (!settingsRef.current.muted) audio.playRoundEnd();
    if (settingsRef.current.hapticEnabled) vibrateRoundEnd();
  }, [audio]);

  const onWarning = useCallback(() => {
    if (!settingsRef.current.muted) audio.playWarning();
    if (settingsRef.current.hapticEnabled) vibrateWarning();
  }, [audio]);

  const onComplete = useCallback(() => {
    if (!settingsRef.current.muted) audio.playRoundEnd();
    if (settingsRef.current.hapticEnabled) vibrateRoundEnd();
  }, [audio]);

  const timer = useTimer(onRoundStart, onRoundEnd, onWarning, onComplete);

  // Keep settings ref in sync
  settingsRef.current = {
    muted: timer.settings.muted,
    hapticEnabled: timer.settings.hapticEnabled,
  };

  useWakeLock(timer.state === "running" || timer.state === "resting" || timer.state === "preparing");

  const getSessionTitle = useCallback(
    (rating: 1 | 2 | 3 | 4) => {
      const preset = findMatchingPreset(timer.settings);
      if (preset) return preset.name;

      const session = timer.sessionData;
      if (!session) return "Timer Session";

      const hour = new Date().getHours();
      const rounds = session.rounds;
      const mins = session.durationMin;

      // Time-of-day prefix
      let timeTag = "";
      if (hour < 7) timeTag = "Dawn Patrol: ";
      else if (hour >= 22) timeTag = "Midnight Rounds: ";

      // Rating-based override (strongest signal)
      if (rating === 4) return timeTag + "Survived the Storm";
      if (rating === 1 && mins < 15) return timeTag + "Warm-Up Rounds";

      // Round/duration-based title
      let core: string;
      if (rounds >= 12) core = "Championship Rounds";
      else if (rounds >= 8) core = "Going the Distance";
      else if (mins >= 30) core = "Iron Session";
      else if (rounds >= 5) core = "Fight Night";
      else if (rounds >= 3) core = "Quick Work";
      else core = "Speed Drill";

      return timeTag + core;
    },
    [timer.settings, timer.sessionData],
  );

  const handleStart = () => {
    audio.init();
    setRated(false);
    timer.start();
  };

  const getLogTitle = useCallback(() => {
    const preset = findMatchingPreset(timer.settings);
    if (preset) return preset.name;
    const s = timer.settings;
    const fmtRound = `${Math.floor(s.roundDurationSec / 60)}:${(s.roundDurationSec % 60).toString().padStart(2, "0")}`;
    return `Timer · ${s.rounds} × ${fmtRound}`;
  }, [timer.settings]);

  const logSession = useCallback(
    (rating: 1 | 2 | 3 | 4) => {
      const session = timer.sessionData;
      if (!session) return;

      logWorkout({
        workoutId: "timer-session",
        workoutTitle: getLogTitle(),
        date: new Date().toISOString().split("T")[0],
        completedAt: session.completedAt,
        durationMin: session.durationMin,
        roundsCompleted: session.rounds,
        totalRounds: session.rounds,
        rating,
      });
    },
    [timer.sessionData, getLogTitle, logWorkout],
  );

  const handleRate = useCallback(
    (rating: 1 | 2 | 3 | 4) => {
      logSession(rating);
      setSessionRating(rating);
      setRated(true);
    },
    [logSession],
  );

  const handleShare = useCallback(async () => {
    if (!timer.sessionData || !gameState) return;
    let name = getDisplayName();
    if (!name) {
      const input = window.prompt("What name should appear on your share card?");
      if (input && input.trim()) {
        setDisplayName(input.trim());
        name = input.trim();
      }
    }
    setIsSharing(true);
    try {
      await shareWorkoutCard({
        workoutTitle: getSessionTitle(sessionRating),
        roundsCompleted: timer.sessionData.rounds,
        totalRounds: timer.sessionData.rounds,
        durationMin: timer.sessionData.durationMin,
        xpEarned: 0,
        level: gameState.level.level,
        title: gameState.level.title,
        streakCurrent: gameState.streak.current,
        date: new Date().toISOString().split("T")[0],
        displayName: name ?? undefined,
      });
    } catch {
      // User cancelled or share failed
    } finally {
      setIsSharing(false);
    }
  }, [timer.sessionData, gameState, getSessionTitle, sessionRating]);

  const isActive = timer.state !== "idle" && timer.state !== "complete";
  const isComplete = timer.state === "complete";
  const session = timer.sessionData;
  const preset = isComplete ? findMatchingPreset(timer.settings) : null;

  // Session summary for idle state
  const sessionSummary = (() => {
    const s = timer.settings;
    const totalSec = s.rounds * s.roundDurationSec + (s.rounds - 1) * s.restDurationSec;
    const totalMin = Math.ceil(totalSec / 60);
    const fmtRound = `${Math.floor(s.roundDurationSec / 60)}:${(s.roundDurationSec % 60).toString().padStart(2, "0")}`;
    const fmtRest = `${Math.floor(s.restDurationSec / 60)}:${(s.restDurationSec % 60).toString().padStart(2, "0")}`;
    return `${s.rounds} × ${fmtRound} + ${fmtRest} rest · ~${totalMin} min`;
  })();

  // Completion screen
  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 animate-fade-in">
        {/* Green ambient glow */}
        <div
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.04) 40%, transparent 70%)",
          }}
        />

        {/* Checkmark */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5 animate-punch-slam"
          style={{
            background: "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))",
            border: "2px solid rgba(34,197,94,0.4)",
            boxShadow: "0 0 30px rgba(34,197,94,0.2)",
          }}
        >
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-green-400 mb-1">
          Session Complete
        </p>
        <h2 className="text-2xl font-black mb-6">
          {rated ? getSessionTitle(sessionRating) : (preset ? preset.name : "Timer Session")}
        </h2>

        {/* Stats row */}
        {session && (
          <div className="flex gap-4 mb-8">
            <div className="card-glass rounded-xl px-5 py-3 text-center">
              <Target className="w-4 h-4 text-accent mx-auto mb-1" />
              <p className="text-xl font-bold tabular-nums">{session.rounds}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Rounds</p>
            </div>
            <div className="card-glass rounded-xl px-5 py-3 text-center">
              <Clock className="w-4 h-4 text-accent mx-auto mb-1" />
              <p className="text-xl font-bold tabular-nums">{session.durationMin}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Minutes</p>
            </div>
          </div>
        )}

        {/* Inline rating */}
        {!rated ? (
          <div className="w-full max-w-sm animate-fade-in-up">
            <p className="text-sm font-medium text-center mb-3 text-muted">
              How did that feel?
            </p>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {ratings.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleRate(r.value)}
                  className="card-glass rounded-xl py-3 text-center hover:border-[#00e5ff]/30 hover:shadow-[0_0_12px_rgba(0,229,255,0.12)] transition-all active:scale-95"
                >
                  <span className="flex justify-center mb-1">{r.icon}</span>
                  <span className="text-[10px] font-medium text-muted">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-green-400 font-medium mb-4 animate-fade-in">
            Session logged
          </p>
        )}

        <div className="flex flex-col gap-3 w-full max-w-sm mt-2">
          <button
            onClick={() => {
              if (!rated && session) {
                logSession(2);
                setRated(true);
              }
              timer.reset();
            }}
            className="btn-primary py-3 rounded-full text-base w-full"
          >
            {rated ? "New Session" : "Skip & Restart"}
          </button>
          {rated && (
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="btn-secondary border border-accent/30 text-accent font-medium py-3 rounded-full flex items-center justify-center gap-2 w-full disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" />
              {isSharing ? "Generating..." : "Share Session"}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isActive) {
    const isTimerWarning = timer.state === "running" && timer.secondsLeft <= (timer.settings.warningAtSec ?? 10);

    return (
      <div
        className="fixed inset-0 z-[100] overflow-hidden animate-fade-in"
        style={{ height: "100dvh" }}
      >
        {/* Opaque background */}
        <div className="absolute inset-0 bg-background" />

        {/* Ambient glow - crossfade layers */}
        {(["preparing", "resting", "warning", "running", "paused"] as const).map((glowState) => {
          const active =
            glowState === "warning"
              ? isTimerWarning
              : glowState === "running"
                ? timer.state === "running" && !isTimerWarning
                : timer.state === glowState;
          const gradient =
            glowState === "preparing"
              ? "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(245,158,11,0.3) 0%, rgba(245,158,11,0.1) 35%, transparent 65%)"
              : glowState === "resting"
                ? "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(168,85,247,0.35) 0%, rgba(168,85,247,0.12) 35%, transparent 65%)"
                : glowState === "warning"
                  ? "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(239,68,68,0.4) 0%, rgba(239,68,68,0.15) 35%, transparent 65%)"
                  : glowState === "running"
                    ? "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(0,229,255,0.35) 0%, rgba(0,229,255,0.12) 35%, transparent 65%)"
                    : "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(234,179,8,0.25) 0%, rgba(234,179,8,0.08) 35%, transparent 65%)";
          return (
            <div
              key={glowState}
              className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
                glowState === "warning" && active ? "animate-timer-bg-pulse" : ""
              }`}
              style={{ backgroundImage: gradient, opacity: active ? 1 : 0 }}
            />
          );
        })}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex-1 flex items-center justify-center">
            <TimerDisplay
              secondsLeft={timer.secondsLeft}
              state={timer.state}
              currentRound={timer.currentRound}
              totalRounds={timer.totalRounds}
              warningAtSec={timer.settings.warningAtSec}
              roundDurationSec={timer.settings.roundDurationSec}
              restDurationSec={timer.settings.restDurationSec}
              onSkipPhase={timer.skipPhase}
            />
          </div>
          <div className="px-4" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 3rem)" }}>
            <TimerControls
              state={timer.state}
              onStart={handleStart}
              onPause={timer.pause}
              onResume={() => { audio.init(); timer.resume(); }}
              onReset={timer.reset}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col animate-fade-in-up" style={{ minHeight: "calc(100vh - 8rem)" }}>
      <div className="flex flex-col gap-6 flex-1">
        <h1 className="text-2xl font-bold text-center mb-2 animate-fade-in-up">
          Round Timer
        </h1>

        <TimerSettings
          settings={timer.settings}
          onChange={timer.setSettings}
          disabled={isActive}
        />

        <TimerDisplay
          secondsLeft={timer.secondsLeft}
          state={timer.state}
          currentRound={timer.currentRound}
          totalRounds={timer.totalRounds}
          warningAtSec={timer.settings.warningAtSec}
          roundDurationSec={timer.settings.roundDurationSec}
          restDurationSec={timer.settings.restDurationSec}
        />

        <p className="text-xs text-muted text-center tabular-nums">
          {sessionSummary}
        </p>
      </div>

      <div className="mt-auto pt-4 pb-2">
        <TimerControls
          state={timer.state}
          onStart={handleStart}
          onPause={timer.pause}
          onResume={() => { audio.init(); timer.resume(); }}
          onReset={timer.reset}
        />
      </div>
    </div>
  );
}
