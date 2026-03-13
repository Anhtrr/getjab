"use client";

import { useCallback, useRef } from "react";
import {
  initAudio,
  playRoundStart,
  playRoundEnd,
  playWarning,
} from "@/lib/audio";

export function useAudio() {
  const initialized = useRef(false);

  const init = useCallback(() => {
    if (!initialized.current) {
      initAudio();
      initialized.current = true;
    }
  }, []);

  return {
    init,
    playRoundStart,
    playRoundEnd,
    playWarning,
  };
}
