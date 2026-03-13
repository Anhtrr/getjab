"use client";

import { useEffect, useRef } from "react";
import {
  requestWakeLock,
  releaseWakeLock,
  setupVisibilityHandler,
} from "@/lib/wakeLock";

export function useWakeLock(active: boolean) {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (active) {
      requestWakeLock();
      cleanupRef.current = setupVisibilityHandler();
    } else {
      releaseWakeLock();
      cleanupRef.current?.();
      cleanupRef.current = null;
    }

    return () => {
      releaseWakeLock();
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [active]);
}
