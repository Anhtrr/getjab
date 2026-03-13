let wakeLock: WakeLockSentinel | null = null;

export async function requestWakeLock() {
  if ("wakeLock" in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => {
        wakeLock = null;
      });
    } catch {
      // Wake lock request failed (e.g., low battery)
    }
  }
}

export async function releaseWakeLock() {
  if (wakeLock) {
    await wakeLock.release();
    wakeLock = null;
  }
}

export function setupVisibilityHandler() {
  const handler = () => {
    if (document.visibilityState === "visible" && !wakeLock) {
      requestWakeLock();
    }
  };
  document.addEventListener("visibilitychange", handler);
  return () => document.removeEventListener("visibilitychange", handler);
}
