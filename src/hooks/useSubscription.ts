"use client";

import { useSyncExternalStore, useCallback } from "react";
import { isSubscribed as checkSubscribed, setSubscription } from "@/lib/storage";

const subscribers = new Set<() => void>();
let cachedSnapshot: boolean | null = null;

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function getSnapshot() {
  if (cachedSnapshot === null) {
    cachedSnapshot = checkSubscribed();
  }
  return cachedSnapshot;
}

function getServerSnapshot() {
  return false;
}

function notify() {
  cachedSnapshot = null;
  subscribers.forEach((cb) => cb());
}

export function useSubscription() {
  const subscribed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const activate = useCallback(() => {
    setSubscription(true);
    notify();
  }, []);

  const deactivate = useCallback(() => {
    setSubscription(false);
    notify();
  }, []);

  return {
    isSubscribed: subscribed,
    activate,
    deactivate,
  };
}
