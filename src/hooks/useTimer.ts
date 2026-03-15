"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { TimerState, TimerSettings } from "@/lib/types";

export interface TimerSessionData {
  rounds: number;
  roundDurationSec: number;
  restDurationSec: number;
  startedAt: string;
  completedAt: string;
  durationMin: number;
}

interface TimerHookReturn {
  state: TimerState;
  secondsLeft: number;
  currentRound: number;
  totalRounds: number;
  settings: TimerSettings;
  setSettings: (s: TimerSettings) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skipPhase: () => void;
  sessionData: TimerSessionData | null;
}

const TIMER_SETTINGS_KEY = "jab_timer_settings";

const DEFAULT_SETTINGS: TimerSettings = {
  rounds: 3,
  roundDurationSec: 180,
  restDurationSec: 60,
  warningAtSec: 10,
  prepTimeSec: 5,
};

function loadTimerSettings(): TimerSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(TIMER_SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveTimerSettings(s: TimerSettings) {
  try {
    localStorage.setItem(TIMER_SETTINGS_KEY, JSON.stringify(s));
  } catch {}
}

export function useTimer(
  onRoundStart?: () => void,
  onRoundEnd?: () => void,
  onWarning?: () => void,
  onComplete?: () => void,
): TimerHookReturn {
  const [settings, setSettings] = useState<TimerSettings>(loadTimerSettings);
  const [state, setState] = useState<TimerState>("idle");
  const [secondsLeft, setSecondsLeft] = useState(settings.roundDurationSec);
  const [currentRound, setCurrentRound] = useState(1);

  const [sessionData, setSessionData] = useState<TimerSessionData | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  const roundRef = useRef(currentRound);
  const settingsRef = useRef(settings);
  const warningFiredRef = useRef(false);
  const lastPrepWarningRef = useRef(0);
  const prePauseStateRef = useRef<"running" | "resting" | "preparing">("running");
  const startedAtRef = useRef<string | null>(null);

  // Wall-clock based timing: stores when the current phase ends
  const endTimeRef = useRef(0);
  // Stores remaining ms when paused
  const remainingMsRef = useRef(0);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    roundRef.current = currentRound;
  }, [currentRound]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const s = settingsRef.current;
    const currentState = stateRef.current;

    if (currentState !== "running" && currentState !== "resting" && currentState !== "preparing") return;

    // Derive seconds from wall clock - eliminates drift
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
    setSecondsLeft(remaining);

    // Handle preparing countdown
    if (currentState === "preparing") {
      if (remaining <= 3 && remaining > 0 && remaining < lastPrepWarningRef.current) {
        lastPrepWarningRef.current = remaining;
        onWarning?.();
      }
      if (remaining <= 0) {
        setState("running");
        stateRef.current = "running";
        prePauseStateRef.current = "running";
        endTimeRef.current = Date.now() + s.roundDurationSec * 1000;
        setSecondsLeft(s.roundDurationSec);
        warningFiredRef.current = false;
        onRoundStart?.();
        return;
      }
      return;
    }

    if (
      currentState === "running" &&
      !warningFiredRef.current &&
      remaining === s.warningAtSec &&
      remaining > 0
    ) {
      warningFiredRef.current = true;
      onWarning?.();
    }

    if (remaining <= 0) {
      if (currentState === "running") {
        onRoundEnd?.();
        if (roundRef.current >= s.rounds) {
          const completedAt = new Date().toISOString();
          const startedAt = startedAtRef.current || completedAt;
          const elapsed = (new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 60000;
          setSessionData({
            rounds: s.rounds,
            roundDurationSec: s.roundDurationSec,
            restDurationSec: s.restDurationSec,
            startedAt,
            completedAt,
            durationMin: Math.round(elapsed),
          });
          setState("complete");
          setSecondsLeft(0);
          clearTimer();
          onComplete?.();
          return;
        }
        setState("resting");
        stateRef.current = "resting";
        prePauseStateRef.current = "resting";
        endTimeRef.current = Date.now() + s.restDurationSec * 1000;
        setSecondsLeft(s.restDurationSec);
        warningFiredRef.current = false;
        return;
      }
      if (currentState === "resting") {
        const nextRound = roundRef.current + 1;
        setCurrentRound(nextRound);
        roundRef.current = nextRound;
        setState("running");
        stateRef.current = "running";
        prePauseStateRef.current = "running";
        endTimeRef.current = Date.now() + s.roundDurationSec * 1000;
        setSecondsLeft(s.roundDurationSec);
        warningFiredRef.current = false;
        onRoundStart?.();
        return;
      }
    }
  }, [onRoundStart, onRoundEnd, onWarning, onComplete, clearTimer]);

  const start = useCallback(() => {
    const s = settingsRef.current;
    clearTimer();
    startedAtRef.current = new Date().toISOString();
    setSessionData(null);

    if (s.prepTimeSec > 0) {
      setState("preparing");
      stateRef.current = "preparing";
      prePauseStateRef.current = "preparing";
      setCurrentRound(1);
      roundRef.current = 1;
      setSecondsLeft(s.prepTimeSec);
      endTimeRef.current = Date.now() + s.prepTimeSec * 1000;
      warningFiredRef.current = false;
      lastPrepWarningRef.current = s.prepTimeSec + 1;
      intervalRef.current = setInterval(tick, 250);
    } else {
      setState("running");
      stateRef.current = "running";
      prePauseStateRef.current = "running";
      setCurrentRound(1);
      roundRef.current = 1;
      setSecondsLeft(s.roundDurationSec);
      endTimeRef.current = Date.now() + s.roundDurationSec * 1000;
      warningFiredRef.current = false;
      intervalRef.current = setInterval(tick, 250);
      onRoundStart?.();
    }
  }, [tick, clearTimer, onRoundStart]);

  const pause = useCallback(() => {
    const cur = stateRef.current;
    prePauseStateRef.current =
      cur === "resting" ? "resting" : cur === "preparing" ? "preparing" : "running";
    // Save remaining time before pausing
    remainingMsRef.current = Math.max(0, endTimeRef.current - Date.now());
    setState("paused");
    stateRef.current = "paused";
    clearTimer();
  }, [clearTimer]);

  const resume = useCallback(() => {
    const resumeTo = prePauseStateRef.current;
    setState(resumeTo);
    stateRef.current = resumeTo;
    // Restore end time from saved remaining
    endTimeRef.current = Date.now() + remainingMsRef.current;
    clearTimer();
    intervalRef.current = setInterval(tick, 250);
  }, [tick, clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setState("idle");
    stateRef.current = "idle";
    setCurrentRound(1);
    roundRef.current = 1;
    setSecondsLeft(settingsRef.current.roundDurationSec);
    warningFiredRef.current = false;
    endTimeRef.current = 0;
    remainingMsRef.current = 0;
    startedAtRef.current = null;
    setSessionData(null);
  }, [clearTimer]);

  const skipPhase = useCallback(() => {
    const s = settingsRef.current;
    const cur = stateRef.current;

    if (cur === "preparing") {
      // Skip prep → start round 1
      setState("running");
      stateRef.current = "running";
      prePauseStateRef.current = "running";
      endTimeRef.current = Date.now() + s.roundDurationSec * 1000;
      setSecondsLeft(s.roundDurationSec);
      warningFiredRef.current = false;
      onRoundStart?.();
      return;
    }

    if (cur === "running") {
      onRoundEnd?.();
      if (roundRef.current >= s.rounds) {
        // Last round - complete
        const completedAt = new Date().toISOString();
        const startedAt = startedAtRef.current || completedAt;
        const elapsed = (new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 60000;
        setSessionData({
          rounds: s.rounds,
          roundDurationSec: s.roundDurationSec,
          restDurationSec: s.restDurationSec,
          startedAt,
          completedAt,
          durationMin: Math.round(elapsed),
        });
        setState("complete");
        setSecondsLeft(0);
        clearTimer();
        onComplete?.();
        return;
      }
      // Skip to rest
      setState("resting");
      stateRef.current = "resting";
      prePauseStateRef.current = "resting";
      endTimeRef.current = Date.now() + s.restDurationSec * 1000;
      setSecondsLeft(s.restDurationSec);
      warningFiredRef.current = false;
      return;
    }

    if (cur === "resting") {
      // Skip rest → start next round
      const nextRound = roundRef.current + 1;
      setCurrentRound(nextRound);
      roundRef.current = nextRound;
      setState("running");
      stateRef.current = "running";
      prePauseStateRef.current = "running";
      endTimeRef.current = Date.now() + s.roundDurationSec * 1000;
      setSecondsLeft(s.roundDurationSec);
      warningFiredRef.current = false;
      onRoundStart?.();
      return;
    }
  }, [onRoundStart, onRoundEnd, onComplete, clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const setSettingsAndSync = useCallback((s: TimerSettings) => {
    setSettings(s);
    saveTimerSettings(s);
    if (stateRef.current === "idle") {
      setSecondsLeft(s.roundDurationSec);
    }
  }, []);

  return {
    state,
    secondsLeft,
    currentRound,
    totalRounds: settings.rounds,
    settings,
    setSettings: setSettingsAndSync,
    start,
    pause,
    resume,
    reset,
    skipPhase,
    sessionData,
  };
}
