"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getWorkout } from "@/data/workouts";
import { useAudio } from "@/hooks/useAudio";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useComboCallout } from "@/hooks/useComboCallout";
import { addWorkoutLog } from "@/lib/storage";
import { initComboAudio, cancelSpeech } from "@/lib/comboAudio";
import { useGamification } from "@/hooks/useGamification";
import { calculateXP } from "@/lib/gamification/engine";
import PostWorkoutRating from "@/components/PostWorkoutRating";
import { ComboCallout, CalloutPacingSelector } from "@/components/ComboCallout";
import XPGainToast from "@/components/gamification/XPGainToast";
import LevelUpModal from "@/components/gamification/LevelUpModal";
import NewBadgeModal from "@/components/gamification/NewBadgeModal";
import { shareWorkoutCard } from "@/lib/shareCard";
import { estimateCalories } from "@/lib/calories";
import { getDisplayName, setDisplayName } from "@/lib/displayName";
import { Trophy, ChevronRight, Share2 } from "lucide-react";
import type { TimerState, PunchStats } from "@/lib/types";
import type { XPBreakdown, PlayerLevel } from "@/lib/gamification/types";

const WORKOUT_STATE_KEY = "jab_active_workout";
const STALE_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 hours

interface PersistedWorkoutState {
  workoutId: string;
  currentRoundIndex: number;
  secondsLeft: number;
  isResting: boolean;
  roundsCompleted: number;
  startTime: number;
  savedAt: number;
}

function saveWorkoutState(s: PersistedWorkoutState) {
  try { sessionStorage.setItem(WORKOUT_STATE_KEY, JSON.stringify(s)); } catch {}
}

function loadWorkoutState(workoutId: string): PersistedWorkoutState | null {
  try {
    const raw = sessionStorage.getItem(WORKOUT_STATE_KEY);
    if (!raw) return null;
    const parsed: PersistedWorkoutState = JSON.parse(raw);
    if (parsed.workoutId !== workoutId) return null;
    if (Date.now() - parsed.savedAt > STALE_THRESHOLD_MS) return null;
    return parsed;
  } catch { return null; }
}

function clearWorkoutState() {
  try { sessionStorage.removeItem(WORKOUT_STATE_KEY); } catch {}
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function WorkoutGoPage() {
  const params = useParams();
  const router = useRouter();
  const workout = getWorkout(params.id as string);
  const audio = useAudio();

  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [state, setState] = useState<TimerState>("idle");
  const [isResting, setIsResting] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rated, setRated] = useState(false);
  const [prepCountdown, setPrepCountdown] = useState(0);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [xpBreakdown, setXpBreakdown] = useState<XPBreakdown | null>(null);
  const [levelUpData, setLevelUpData] = useState<PlayerLevel | null>(null);
  const [newBadgeQueue, setNewBadgeQueue] = useState<string[]>([]);
  const [completedDurationMin, setCompletedDurationMin] = useState(0);
  const [completedPunchStats, setCompletedPunchStats] = useState<PunchStats | null>(null);
  const [completedCalories, setCompletedCalories] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const punchCountRef = useRef<{ total: number; byType: Record<string, number> }>({ total: 0, byType: {} });
  const lastCountedComboIndexRef = useRef(-1);
  const startTimeRef = useRef<number>(0);
  const prepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevLevelRef = useRef<number | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  const isRestingRef = useRef(isResting);
  const currentRoundIndexRef = useRef(currentRoundIndex);
  const warningFiredRef = useRef(false);

  // Wall-clock timing refs
  const endTimeRef = useRef(0);
  const remainingMsRef = useRef(0);

  // Triple-tap to skip phase (hidden dev shortcut)
  const skipTapCountRef = useRef(0);
  const skipTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { gameState, processWorkoutCompletion } = useGamification();

  const [hasSavedState, setHasSavedState] = useState(false);
  const restoredRef = useRef(false);

  // Track the level before workout completes
  useEffect(() => {
    if (gameState && prevLevelRef.current === null) {
      prevLevelRef.current = gameState.level.level;
    }
  }, [gameState]);

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { isRestingRef.current = isResting; }, [isResting]);
  useEffect(() => { currentRoundIndexRef.current = currentRoundIndex; }, [currentRoundIndex]);

  // Restore persisted workout state on mount
  useEffect(() => {
    if (restoredRef.current || !workout) return;
    restoredRef.current = true;
    const saved = loadWorkoutState(workout.id);
    if (saved) {
      setCurrentRoundIndex(saved.currentRoundIndex);
      currentRoundIndexRef.current = saved.currentRoundIndex;
      setSecondsLeft(saved.secondsLeft);
      remainingMsRef.current = saved.secondsLeft * 1000;
      setIsResting(saved.isResting);
      isRestingRef.current = saved.isResting;
      setRoundsCompleted(saved.roundsCompleted);
      startTimeRef.current = saved.startTime;
      setState("paused");
      setHasSavedState(true);
    }
  }, [workout]);

  // Auto-pause on visibility change (tab switch, nav away)
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden && stateRef.current === "running") {
        remainingMsRef.current = Math.max(0, endTimeRef.current - Date.now());
        setState("paused");
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        cancelSpeech();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Persist state on every tick and state transition
  useEffect(() => {
    if (!workout) return;
    if (state === "running" || state === "paused") {
      saveWorkoutState({
        workoutId: workout.id,
        currentRoundIndex,
        secondsLeft,
        isResting,
        roundsCompleted,
        startTime: startTimeRef.current,
        savedAt: Date.now(),
      });
    }
  }, [workout, state, currentRoundIndex, secondsLeft, isResting, roundsCompleted]);

  useWakeLock(state === "running");

  const currentRoundForCallout = workout?.rounds[currentRoundIndex];
  const { calloutState, settings: calloutSettings, updateSettings: updateCalloutSettings, hasCallableCombos } =
    useComboCallout(
      currentRoundForCallout?.combos,
      state === "running",
      secondsLeft,
      currentRoundForCallout?.durationSec ?? 0,
      state === "paused",
    );

  // Track punches from combo callouts
  useEffect(() => {
    if (
      calloutState.phase === "idle" &&
      calloutState.lastCombo &&
      calloutState.comboIndex > lastCountedComboIndexRef.current
    ) {
      lastCountedComboIndexRef.current = calloutState.comboIndex;
      const combo = calloutState.lastCombo;
      const counts = punchCountRef.current;
      for (const punch of combo.punches) {
        if (punch.type === "defense") continue;
        counts.total++;
        const key = punch.shortName.toLowerCase();
        counts.byType[key] = (counts.byType[key] || 0) + 1;
      }
    }
  }, [calloutState.phase, calloutState.lastCombo, calloutState.comboIndex]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (stateRef.current !== "running" || !workout) return;

    // Wall-clock derived remaining time — eliminates drift
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
    setSecondsLeft(remaining);

    if (
      !isRestingRef.current &&
      !warningFiredRef.current &&
      remaining <= 10 &&
      remaining > 0
    ) {
      warningFiredRef.current = true;
      audio.playWarning();
    }

    if (remaining <= 0) {
      if (!isRestingRef.current) {
        audio.playRoundEnd();
        const roundIdx = currentRoundIndexRef.current;
        const round = workout.rounds[roundIdx];
        setRoundsCompleted((p) => p + 1);

        if (roundIdx >= workout.rounds.length - 1) {
          setState("complete");
          setWorkoutComplete(true);
          setShowRating(true);
          clearTimer();
          clearWorkoutState();
          return;
        }

        if (round.restSec > 0) {
          setIsResting(true);
          isRestingRef.current = true;
          endTimeRef.current = Date.now() + round.restSec * 1000;
          setSecondsLeft(round.restSec);
          warningFiredRef.current = false;
          return;
        }

        // No rest, move to next round
        const nextIdx = roundIdx + 1;
        if (nextIdx >= workout.rounds.length) return;
        setCurrentRoundIndex(nextIdx);
        currentRoundIndexRef.current = nextIdx;
        endTimeRef.current = Date.now() + workout.rounds[nextIdx].durationSec * 1000;
        setSecondsLeft(workout.rounds[nextIdx].durationSec);
        warningFiredRef.current = false;
        audio.playRoundStart();
        return;
      }

      // Rest is over, move to next round
      const nextIdx = currentRoundIndexRef.current + 1;
      if (nextIdx >= workout.rounds.length) return;
      audio.playRoundStart();
      setCurrentRoundIndex(nextIdx);
      currentRoundIndexRef.current = nextIdx;
      setIsResting(false);
      isRestingRef.current = false;
      endTimeRef.current = Date.now() + workout.rounds[nextIdx].durationSec * 1000;
      setSecondsLeft(workout.rounds[nextIdx].durationSec);
      warningFiredRef.current = false;
      return;
    }
  }, [workout, audio, clearTimer]);

  const beginRound1 = useCallback(() => {
    if (!workout) return;
    const dur = workout.rounds[0].durationSec;
    setSecondsLeft(dur);
    startTimeRef.current = Date.now();
    endTimeRef.current = Date.now() + dur * 1000;
    setState("running");
    clearTimer();
    intervalRef.current = setInterval(tick, 250);
    audio.playRoundStart();
  }, [workout, audio, tick, clearTimer]);

  const startWorkout = useCallback(() => {
    if (!workout) return;
    audio.init();
    initComboAudio();
    setCurrentRoundIndex(0);
    currentRoundIndexRef.current = 0;
    setIsResting(false);
    isRestingRef.current = false;
    setRoundsCompleted(0);
    setWorkoutComplete(false);
    warningFiredRef.current = false;
    setShowRating(false);
    setRated(false);

    // Start prep countdown using wall-clock timing
    const prepDuration = 10;
    setPrepCountdown(prepDuration);
    setState("preparing");

    // Clear any existing prep interval
    if (prepIntervalRef.current) clearInterval(prepIntervalRef.current);

    const prepEndTime = Date.now() + prepDuration * 1000;
    let lastPrepWarning = prepDuration + 1;
    prepIntervalRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((prepEndTime - Date.now()) / 1000));
      setPrepCountdown(remaining);
      if (remaining <= 3 && remaining > 0 && remaining < lastPrepWarning) {
        lastPrepWarning = remaining;
        audio.playWarning();
      }
      if (remaining <= 0) {
        if (prepIntervalRef.current) clearInterval(prepIntervalRef.current);
        prepIntervalRef.current = null;
        beginRound1();
      }
    }, 250);
  }, [workout, audio, beginRound1]);

  const handleRate = useCallback(
    (rating: 1 | 2 | 3 | 4) => {
      if (!workout) return;
      const durationMin = Math.max(1, Math.round(
        (Date.now() - startTimeRef.current) / 60000,
      ));
      setCompletedDurationMin(durationMin);
      const punchStats = punchCountRef.current.total > 0
        ? { total: punchCountRef.current.total, byType: { ...punchCountRef.current.byType } }
        : undefined;
      const calories = estimateCalories(durationMin, workout.level);
      setCompletedPunchStats(punchStats ?? null);
      setCompletedCalories(calories);
      // Compute XP breakdown first so we can store it in the log
      const tempLog = {
        workoutId: workout.id,
        workoutTitle: workout.title,
        date: new Date().toISOString().split("T")[0],
        completedAt: new Date().toISOString(),
        durationMin,
        roundsCompleted: roundsCompleted,
        totalRounds: workout.rounds.length,
        rating,
        punchStats,
        caloriesEstimate: calories,
      };
      const xp = calculateXP(tempLog, workout.level, gameState?.streak.current ?? 0);
      setXpBreakdown(xp);

      const log = { ...tempLog, xpEarned: xp.total };
      addWorkoutLog(log);

      // Process gamification (persist badges, shields, PRs, challenge progress)
      const prevLevel = prevLevelRef.current ?? 1;
      const newState = processWorkoutCompletion();

      if (newState) {
        // Check for level up
        if (newState.level.level > prevLevel) {
          setLevelUpData(newState.level);
        }
        // Check for new badges
        if (newState.badges.newlyUnlocked.length > 0) {
          setNewBadgeQueue(newState.badges.newlyUnlocked);
        }
      }

      setRated(true);
      setShowRating(false);
    },
    [workout, roundsCompleted, gameState, processWorkoutCompletion],
  );

  const handleShare = useCallback(async () => {
    if (!workout || !gameState) return;
    // Prompt for display name on first share
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
        workoutTitle: workout.title,
        roundsCompleted,
        totalRounds: workout.rounds.length,
        durationMin: completedDurationMin,
        xpEarned: xpBreakdown?.total ?? 0,
        level: gameState.level.level,
        title: gameState.level.title,
        streakCurrent: gameState.streak.current,
        date: new Date().toISOString().split("T")[0],
        displayName: name ?? undefined,
        punchesThrown: completedPunchStats?.total,
        caloriesEstimate: completedCalories || undefined,
      });
    } catch {
      // User cancelled or share failed — silently ignore
    } finally {
      setIsSharing(false);
    }
  }, [workout, gameState, roundsCompleted, completedDurationMin, xpBreakdown, completedPunchStats, completedCalories]);

  const skipPhase = useCallback(() => {
    if (!workout) return;
    const cur = stateRef.current;

    if (cur === "running" && !isRestingRef.current) {
      const roundIdx = currentRoundIndexRef.current;
      const round = workout.rounds[roundIdx];
      setRoundsCompleted((p) => p + 1);

      if (roundIdx >= workout.rounds.length - 1) {
        // Last round — complete
        setState("complete");
        setWorkoutComplete(true);
        setShowRating(true);
        clearTimer();
        return;
      }

      if (round.restSec > 0) {
        setIsResting(true);
        isRestingRef.current = true;
        endTimeRef.current = Date.now() + round.restSec * 1000;
        setSecondsLeft(round.restSec);
        warningFiredRef.current = false;
        return;
      }

      // No rest, next round
      const nextIdx = roundIdx + 1;
      if (nextIdx >= workout.rounds.length) return;
      setCurrentRoundIndex(nextIdx);
      currentRoundIndexRef.current = nextIdx;
      endTimeRef.current = Date.now() + workout.rounds[nextIdx].durationSec * 1000;
      setSecondsLeft(workout.rounds[nextIdx].durationSec);
      warningFiredRef.current = false;
      return;
    }

    if (cur === "running" && isRestingRef.current) {
      // Skip rest → next round
      const nextIdx = currentRoundIndexRef.current + 1;
      if (nextIdx >= workout.rounds.length) return;
      setCurrentRoundIndex(nextIdx);
      currentRoundIndexRef.current = nextIdx;
      setIsResting(false);
      isRestingRef.current = false;
      endTimeRef.current = Date.now() + workout.rounds[nextIdx].durationSec * 1000;
      setSecondsLeft(workout.rounds[nextIdx].durationSec);
      warningFiredRef.current = false;
      return;
    }
  }, [workout, clearTimer]);

  const handleCountdownTap = useCallback(() => {
    if (state !== "running") return;
    skipTapCountRef.current += 1;
    if (skipTapTimerRef.current) clearTimeout(skipTapTimerRef.current);

    if (skipTapCountRef.current >= 3) {
      skipTapCountRef.current = 0;
      skipPhase();
      return;
    }

    skipTapTimerRef.current = setTimeout(() => {
      skipTapCountRef.current = 0;
    }, 500);
  }, [state, skipPhase]);

  const pauseWorkout = useCallback(() => {
    remainingMsRef.current = Math.max(0, endTimeRef.current - Date.now());
    setState("paused");
    clearTimer();
    cancelSpeech();
  }, [clearTimer]);

  const resumeWorkout = useCallback(() => {
    audio.init();
    initComboAudio();
    endTimeRef.current = Date.now() + remainingMsRef.current;
    setState("running");
    clearTimer();
    intervalRef.current = setInterval(tick, 250);
  }, [audio, tick, clearTimer]);

  useEffect(() => {
    return () => {
      clearTimer();
      if (prepIntervalRef.current) clearInterval(prepIntervalRef.current);
    };
  }, [clearTimer]);

  if (!workout) {
    return (
      <div className="px-4 pt-12 text-center">
        <p className="text-muted">Workout not found.</p>
      </div>
    );
  }

  const currentRound = workout.rounds[currentRoundIndex];

  if (workoutComplete) {
    return (
      <div className="px-4 pt-16 pb-8 max-w-lg mx-auto text-center">
        {showRating && (
          <PostWorkoutRating
            onRate={handleRate}
            onSkip={() => handleRate(2)}
          />
        )}

        {/* Gamification modals */}
        {levelUpData && (
          <LevelUpModal
            level={levelUpData}
            onDismiss={() => setLevelUpData(null)}
          />
        )}
        {!levelUpData && newBadgeQueue.length > 0 && (
          <NewBadgeModal
            badgeId={newBadgeQueue[0]}
            onDismiss={() => setNewBadgeQueue((q) => q.slice(1))}
          />
        )}

        <div className="mb-4 animate-fade-in-scale flex justify-center">
          <Trophy className="w-14 h-14 text-accent" />
        </div>
        <h1 className="text-3xl font-black mb-2 text-gradient">Workout Complete!</h1>
        <p className="text-muted text-lg mb-2">{workout.title}</p>
        <p className="text-muted mb-4">
          {roundsCompleted} of {workout.rounds.length} rounds completed
          {rated && " — Logged!"}
        </p>

        {/* Stats summary */}
        {rated && (
          <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-in-up">
            <div className="card-glass rounded-xl p-3">
              <p className="text-xl font-bold text-accent">{completedDurationMin}<span className="text-sm font-normal text-muted"> min</span></p>
              <p className="text-[10px] uppercase tracking-wider text-muted mt-0.5">Duration</p>
            </div>
            {completedPunchStats && completedPunchStats.total > 0 && (
              <div className="card-glass rounded-xl p-3">
                <p className="text-xl font-bold text-accent">{completedPunchStats.total}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted mt-0.5">Punches</p>
              </div>
            )}
            {completedCalories > 0 && (
              <div className="card-glass rounded-xl p-3">
                <p className="text-xl font-bold text-accent">~{completedCalories}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted mt-0.5">Calories</p>
              </div>
            )}
          </div>
        )}

        {/* Punch breakdown */}
        {rated && completedPunchStats && completedPunchStats.total > 0 && (
          <p className="text-xs text-muted mb-6 animate-fade-in">
            {Object.entries(completedPunchStats.byType)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => `${count} ${type}${count !== 1 ? "s" : ""}`)
              .join(" · ")}
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/workouts/${workout.id}`)}
            className="block w-full btn-primary text-lg py-4 rounded-full"
          >
            Done
          </button>
          {rated && (
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="block w-full btn-secondary border border-accent/30 text-accent font-medium py-4 rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Share2 className="w-5 h-5" />
              {isSharing ? "Generating..." : "Share Workout"}
            </button>
          )}
          <button
            onClick={startWorkout}
            className="block w-full btn-secondary border border-border text-foreground font-medium py-4 rounded-full"
          >
            Do It Again
          </button>
        </div>

        {/* XP Gain Toast */}
        {xpBreakdown && !showRating && (
          <XPGainToast
            breakdown={xpBreakdown}
            onDismiss={() => setXpBreakdown(null)}
          />
        )}
      </div>
    );
  }

  if (state === "idle") {
    return (
      <div className="px-4 pt-12 pb-8 max-w-lg mx-auto text-center">
        <h1 className="text-2xl font-bold mb-2">{workout.title}</h1>
        <p className="text-muted mb-2">
          {workout.rounds.length} rounds &middot; {workout.durationMin} min
        </p>
        <p className="text-sm text-muted mb-6">Tap start when you&apos;re ready</p>

        <div className="mb-8 max-w-xs mx-auto">
          <CalloutPacingSelector
            settings={calloutSettings}
            onUpdate={updateCalloutSettings}
          />
        </div>

        <button
          onClick={startWorkout}
          className="btn-primary text-xl px-16 py-5 rounded-full"
        >
          START
        </button>

        <button
          onClick={() => router.back()}
          className="block mx-auto mt-6 text-muted text-sm hover:text-foreground"
        >
          &larr; Go back
        </button>
      </div>
    );
  }

  // Restored paused state — show resume prompt
  if (state === "paused" && hasSavedState) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center px-4" style={{ zIndex: 9999 }}>
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
          WORKOUT PAUSED
        </p>
        <div className="font-mono text-5xl font-black text-foreground mb-2 tabular-nums">
          {formatTime(secondsLeft)}
        </div>
        <p className="text-muted text-sm mb-1">
          Round {currentRoundIndex + 1} of {workout.rounds.length}
          {isResting ? " (Rest)" : ` — ${currentRound.title}`}
        </p>
        <p className="text-muted text-xs mb-8">
          {roundsCompleted} rounds completed
        </p>

        <div className="space-y-3 w-full max-w-xs">
          <button
            onClick={() => {
              audio.init();
              initComboAudio();
              setHasSavedState(false);
              resumeWorkout();
            }}
            className="w-full btn-primary text-lg py-4 rounded-full"
          >
            RESUME
          </button>
          <button
            onClick={() => {
              clearWorkoutState();
              setHasSavedState(false);
              setState("idle");
              setCurrentRoundIndex(0);
              currentRoundIndexRef.current = 0;
              setSecondsLeft(0);
              endTimeRef.current = 0;
              remainingMsRef.current = 0;
              setRoundsCompleted(0);
              setIsResting(false);
              isRestingRef.current = false;
            }}
            className="w-full btn-secondary border border-border text-muted font-medium py-4 rounded-full"
          >
            START OVER
          </button>
        </div>
      </div>
    );
  }

  // Preparing state — full-screen countdown
  if (state === "preparing") {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center" style={{ zIndex: 9999 }}>
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4 animate-pulse-ready">
          GET READY
        </p>
        <div className="font-mono text-9xl font-black text-accent animate-timer-warning tabular-nums">
          {prepCountdown}
        </div>
        <p className="text-muted text-sm mt-6">{workout.title}</p>
        <p className="text-muted text-xs mt-1">
          Round 1: {currentRound.title}
        </p>
        <button
          onClick={() => {
            if (prepIntervalRef.current) clearInterval(prepIntervalRef.current);
            prepIntervalRef.current = null;
            setState("idle");
          }}
          className="mt-12 btn-secondary border border-border text-muted font-medium px-8 py-3 rounded-full"
        >
          CANCEL
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col" style={{ zIndex: 9999 }}>
      {/* Timer header */}
      <div className="pt-safe pb-2 px-4 text-center" style={{ paddingTop: "max(env(safe-area-inset-top, 32px), 32px)" }}>
        <div className="flex items-center justify-center gap-3 mb-1">
          <span
            className={`text-sm font-bold uppercase tracking-widest ${
              isResting ? "text-blue-400" : "text-accent"
            }`}
          >
            {isResting ? "REST" : currentRound.type}
          </span>
          <span className="text-sm text-muted">
            {currentRoundIndex + 1} / {workout.rounds.length}
          </span>
        </div>

        {!isResting && (
          <p className="text-base text-muted mb-1">{currentRound.title}</p>
        )}

        <div
          role="timer"
          aria-live="off"
          aria-label={`${formatTime(secondsLeft)} remaining${isResting ? ", resting" : ""}`}
          onClick={handleCountdownTap}
          className={`font-mono font-black tabular-nums leading-none ${
            isResting
              ? "text-blue-400 animate-rest-glow"
              : secondsLeft <= 10
                ? "text-accent animate-timer-warning"
                : state === "running"
                  ? "animate-timer-glow"
                  : ""
          }`}
          style={{ fontSize: "clamp(5rem, 25vw, 12rem)" }}
        >
          {formatTime(secondsLeft)}
        </div>
      </div>

      {/* Round info */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto hide-scrollbar">
        {!isResting && (
          <div className="max-w-lg mx-auto">
            {/* Instructions & tips — only visible when paused */}
            {state !== "running" && (
              <>
                <h2 className="font-bold text-xl mb-2">{currentRound.title}</h2>
                <p className="text-sm text-muted leading-relaxed mb-4">
                  {currentRound.instructions}
                </p>
              </>
            )}

            {currentRound.combos && currentRound.combos.length > 0 && (
              hasCallableCombos && state === "running" ? (
                <div className="mb-4">
                  <ComboCallout state={calloutState} />
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {currentRound.combos.map((combo, i) => (
                    <div
                      key={i}
                      className="font-mono text-base card-glass rounded-xl px-4 py-3 text-center font-bold animate-fade-in-up"
                    >
                      {combo}
                    </div>
                  ))}
                </div>
              )
            )}

            {state !== "running" && currentRound.tips && currentRound.tips.length > 0 && (
              <div className="space-y-1.5">
                {currentRound.tips.map((tip, i) => (
                  <p
                    key={i}
                    className="text-xs text-muted flex items-start gap-1.5"
                  >
                    <ChevronRight className="w-3 h-3 text-accent-secondary mt-0.5 shrink-0" />
                    {tip}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {isResting && (
          <div className="max-w-lg mx-auto text-center py-6">
            <p className="text-lg font-bold text-blue-400 mb-1">Up Next</p>
            <p className="text-base text-foreground font-medium mb-2">
              {workout.rounds[currentRoundIndex + 1]?.title}
            </p>
            {workout.rounds[currentRoundIndex + 1]?.instructions && (
              <p className="text-sm text-muted leading-relaxed mb-4">
                {workout.rounds[currentRoundIndex + 1].instructions}
              </p>
            )}
            {workout.rounds[currentRoundIndex + 1]?.combos && (
              <div className="space-y-2">
                {workout.rounds[currentRoundIndex + 1].combos!.map((combo, i) => (
                  <div
                    key={i}
                    className="font-mono text-base card-glass rounded-xl px-4 py-3 text-center text-muted font-bold"
                  >
                    {combo}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="px-4 pt-4 border-t border-border" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2rem)" }}>
        <div className="flex items-center justify-center gap-4 max-w-lg mx-auto">
          {state === "running" && (
            <button
              onClick={pauseWorkout}
              aria-label="Pause workout"
              className="flex-1 btn-secondary border border-border text-foreground font-bold text-lg py-4 rounded-full"
            >
              PAUSE
            </button>
          )}
          {state === "paused" && (
            <button
              onClick={resumeWorkout}
              aria-label="Resume workout"
              className="flex-1 btn-primary text-lg py-4 rounded-full"
            >
              RESUME
            </button>
          )}
          <button
            aria-label="Quit workout"
            onClick={() => {
              if (state === "running") pauseWorkout();
              setShowQuitConfirm(true);
            }}
            className="btn-secondary border border-border text-muted font-medium px-6 py-4 rounded-full"
          >
            QUIT
          </button>
        </div>

        {/* Round progress bar */}
        <div className="flex gap-1 mt-4 max-w-lg mx-auto">
          {workout.rounds.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < currentRoundIndex
                  ? "bg-gradient-to-r from-[#00e5ff] to-[#0090ff] shadow-[0_0_4px_rgba(0,229,255,0.2)]"
                  : i === currentRoundIndex
                    ? isResting
                      ? "bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.3)]"
                      : "bg-gradient-to-r from-[#0090ff] to-[#00e5ff] shadow-[0_0_4px_rgba(0,229,255,0.2)]"
                    : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quit Confirmation */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center animate-modal-overlay">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowQuitConfirm(false)} />
          <div className="relative z-10 bg-surface border border-border rounded-2xl p-6 mx-6 max-w-sm w-full animate-modal-content">
            <h3 className="text-lg font-bold text-center mb-2">End workout?</h3>
            <p className="text-muted text-sm text-center mb-6">
              You&apos;ve completed {roundsCompleted} of {workout.rounds.length} rounds. Your progress won&apos;t be saved.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowQuitConfirm(false);
                  if (state === "paused") resumeWorkout();
                }}
                className="w-full btn-primary py-3 rounded-full font-bold"
              >
                Keep Going
              </button>
              <button
                onClick={() => {
                  clearTimer();
                  cancelSpeech();
                  clearWorkoutState();
                  if (prepIntervalRef.current) clearInterval(prepIntervalRef.current);
                  router.push(`/workouts/${workout.id}`);
                }}
                className="w-full btn-secondary border border-border text-muted font-medium py-3 rounded-full"
              >
                Quit Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
