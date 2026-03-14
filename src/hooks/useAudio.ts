"use client";

import { useCallback } from "react";
import {
  initAudio,
  playRoundStart,
  playRoundEnd,
  playWarning,
  stopAudioKeepAlive,
} from "@/lib/audio";

export function useAudio() {
  // Always call initAudio on user gestures - it resumes the AudioContext
  // and starts the keep-alive. No guard needed; initAudio is idempotent.
  const init = useCallback(() => {
    initAudio();
  }, []);

  return {
    init,
    playRoundStart,
    playRoundEnd,
    playWarning,
    stopAudioKeepAlive,
  };
}
