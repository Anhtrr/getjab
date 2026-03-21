"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { parseRoundCombos, getCallableCombos } from "@/lib/comboParser";
import { speakCombo, cancelSpeech } from "@/lib/comboAudio";
import type {
  ParsedCombo,
  CalloutState,
  CalloutPhase,
  CalloutSettings,
  CalloutPacing,
} from "@/lib/types";
import { PACING_CONFIG } from "@/lib/types";

const STORAGE_KEY = "jab_callout_settings";
const STAGGER_MS = 150;
const SLAM_DURATION_MS = 350;
const EXIT_DURATION_MS = 400;
const FIRST_CALLOUT_AT = 3; // seconds elapsed before first callout (allows round title announcement to finish)

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function loadSettings(): CalloutSettings {
  if (typeof window === "undefined") {
    return { pacing: "medium", audioEnabled: true, audioMode: "names", comboOrder: "random" };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { pacing: "medium", audioEnabled: true, audioMode: "names", comboOrder: "random", ...parsed };
    }
  } catch {}
  return { pacing: "medium", audioEnabled: true, audioMode: "names", comboOrder: "random" };
}

function saveSettings(settings: CalloutSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

function getInterval(pacing: CalloutPacing, punchCount: number, elapsedRatio: number): number {
  if (pacing === "progressive") {
    const slowInterval = PACING_CONFIG.slow.baseInterval + PACING_CONFIG.slow.perPunch * punchCount;
    const fastInterval = PACING_CONFIG.fast.baseInterval + PACING_CONFIG.fast.perPunch * punchCount;
    return lerp(slowInterval, fastInterval, elapsedRatio);
  }
  const config = PACING_CONFIG[pacing];
  return config.baseInterval + config.perPunch * punchCount;
}

function getHold(pacing: CalloutPacing, punchCount: number): number {
  const basePerPunch =
    pacing === "progressive"
      ? 0.5
      : pacing === "slow" ? 0.7 : pacing === "medium" ? 0.5 : 0.4;
  // Hold scales with punch count so cards stay visible until voice finishes
  return 0.8 + basePerPunch * punchCount;
}

function getEndBuffer(pacing: CalloutPacing): number {
  if (pacing === "progressive") return PACING_CONFIG.medium.endBuffer;
  return PACING_CONFIG[pacing].endBuffer;
}

export function useComboCallout(
  roundCombos: string[] | undefined,
  isRunning: boolean,
  secondsLeft: number,
  roundDurationSec: number,
  isPaused: boolean,
  onComboFired?: (combo: ParsedCombo) => void,
  isConditioning?: boolean,
) {
  const [calloutState, setCalloutState] = useState<CalloutState>({
    activeCombo: null,
    activePunchIndex: -1,
    phase: "idle",
    comboIndex: 0,
    lastCombo: null,
  });

  const [settings, setSettings] = useState<CalloutSettings>(loadSettings);

  const callableCombosRef = useRef<ParsedCombo[]>([]);
  const rotationIndexRef = useRef(0);
  const nextCalloutAtRef = useRef(FIRST_CALLOUT_AT);
  const conditioningFiredRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const phaseRef = useRef<CalloutPhase>("idle");
  const settingsRef = useRef(settings);
  const onComboFiredRef = useRef(onComboFired);

  // Keep settings ref in sync
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Keep callback ref in sync
  useEffect(() => {
    onComboFiredRef.current = onComboFired;
  }, [onComboFired]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const resetToIdle = useCallback(() => {
    clearAllTimeouts();
    phaseRef.current = "idle";
    setCalloutState((prev) => ({
      ...prev,
      activeCombo: null,
      activePunchIndex: -1,
      phase: "idle",
    }));
  }, [clearAllTimeouts]);

  // Stabilize roundCombos to avoid infinite loops from new array references
  // (custom workouts are parsed from localStorage each render)
  const combosKey = useMemo(
    () => (roundCombos ? roundCombos.join("|") : ""),
    [roundCombos],
  );

  // Parse combos when round changes
  useEffect(() => {
    const parsed = roundCombos ? parseRoundCombos(roundCombos) : [];
    callableCombosRef.current = getCallableCombos(parsed);
    rotationIndexRef.current = 0;
    nextCalloutAtRef.current = FIRST_CALLOUT_AT;
    conditioningFiredRef.current = false;
    resetToIdle();
    setCalloutState((prev) => ({
      ...prev,
      comboIndex: 0,
      lastCombo: null,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combosKey, resetToIdle]);

  // Fire a callout: enter → hold → exit lifecycle
  // CSS animation-delay handles the per-punch stagger - no JS timeouts per punch
  const fireCallout = useCallback((combo: ParsedCombo, persistent = false) => {
    clearAllTimeouts();
    const s = settingsRef.current;

    // Phase 1: ENTERING - all punches set immediately, CSS staggers the reveal
    phaseRef.current = "entering";
    setCalloutState((prev) => ({
      ...prev,
      activeCombo: combo,
      activePunchIndex: combo.punches.length - 1,
      phase: "entering",
    }));

    if (s.audioEnabled) {
      speakCombo(combo, s.audioMode);
    }

    // Notify parent that a combo was called out (for punch counting)
    onComboFiredRef.current?.(combo);

    // Wait for CSS stagger + slam animation to finish before holding
    const enterDone = (combo.punches.length - 1) * STAGGER_MS + SLAM_DURATION_MS;

    // Phase 2: HOLDING - all punches visible, subtle breathe animation
    const holdTimeout = setTimeout(() => {
      phaseRef.current = "holding";
      setCalloutState((prev) => ({
        ...prev,
        phase: "holding",
      }));
    }, enterDone);
    timeoutsRef.current.push(holdTimeout);

    // For conditioning rounds, keep cards visible permanently (no exit/idle)
    if (persistent) return;

    const holdDuration = getHold(s.pacing, combo.punches.length) * 1000;

    // Phase 3: EXITING - fade out
    const exitTimeout = setTimeout(() => {
      phaseRef.current = "exiting";
      setCalloutState((prev) => ({
        ...prev,
        phase: "exiting",
      }));
    }, enterDone + holdDuration);
    timeoutsRef.current.push(exitTimeout);

    // Phase 4: IDLE - clean slate
    const idleTimeout = setTimeout(() => {
      phaseRef.current = "idle";
      setCalloutState((prev) => ({
        ...prev,
        activeCombo: null,
        activePunchIndex: -1,
        phase: "idle",
        lastCombo: combo,
      }));
    }, enterDone + holdDuration + EXIT_DURATION_MS);
    timeoutsRef.current.push(idleTimeout);
  }, [clearAllTimeouts]);

  // React to changing secondsLeft (driven by external timer tick)
  useEffect(() => {
    if (!isRunning || isPaused) return;
    const callable = callableCombosRef.current;
    if (callable.length === 0) return;

    // Conditioning rounds: fire first combo once, keep cards visible
    if (isConditioning && !conditioningFiredRef.current) {
      conditioningFiredRef.current = true;
      const combo = callable[0];
      setCalloutState((prev) => ({ ...prev, comboIndex: 1 }));
      fireCallout(combo, true);
      return;
    }
    if (isConditioning) return; // Already fired, don't cycle

    const elapsed = roundDurationSec - secondsLeft;
    const s = settingsRef.current;
    const endBuffer = getEndBuffer(s.pacing);

    // Don't fire in the end buffer zone
    if (secondsLeft < endBuffer) return;

    // Check if it's time for the next callout
    if (elapsed >= nextCalloutAtRef.current && phaseRef.current === "idle") {
      let combo: ParsedCombo;
      if (s.comboOrder === "random" && callable.length > 1) {
        // Pick a random combo, avoiding the last one called
        let idx: number;
        do {
          idx = Math.floor(Math.random() * callable.length);
        } while (idx === (rotationIndexRef.current - 1) % callable.length && callable.length > 1);
        combo = callable[idx];
        rotationIndexRef.current = idx + 1;
      } else {
        combo = callable[rotationIndexRef.current % callable.length];
        rotationIndexRef.current++;
      }

      // Calculate next interval based on the combo's punch count
      const elapsedRatio = elapsed / roundDurationSec;
      const punchCount = combo.punches.filter(p => p.type !== "defense").length || 1;
      const interval = getInterval(s.pacing, punchCount, elapsedRatio);
      nextCalloutAtRef.current = elapsed + interval;

      setCalloutState((prev) => ({
        ...prev,
        comboIndex: rotationIndexRef.current,
      }));

      fireCallout(combo);
    }
  }, [secondsLeft, isRunning, isPaused, roundDurationSec, fireCallout]);

  // Handle pause: clear timeouts + cancel TTS
  useEffect(() => {
    if (isPaused) {
      clearAllTimeouts();
      cancelSpeech();
      phaseRef.current = "idle";
      setCalloutState((prev) => ({
        ...prev,
        activeCombo: null,
        activePunchIndex: -1,
        phase: "idle",
      }));
    }
  }, [isPaused, clearAllTimeouts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      cancelSpeech();
    };
  }, [clearAllTimeouts]);

  const updateSettings = useCallback((partial: Partial<CalloutSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveSettings(next);
      settingsRef.current = next;
      return next;
    });
  }, []);

  const hasCallableCombos = callableCombosRef.current.length > 0;

  return { calloutState, settings, updateSettings, hasCallableCombos };
}
