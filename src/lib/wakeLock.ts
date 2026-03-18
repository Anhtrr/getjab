import { Capacitor } from "@capacitor/core";
import NativeAudioPlayer from "./nativeAudio";

let wakeLock: WakeLockSentinel | null = null;
const isNative = typeof window !== "undefined" && Capacitor.isNativePlatform();

export async function requestWakeLock() {
  if (isNative) {
    try {
      await NativeAudioPlayer.keepAwake();
    } catch {}
    return;
  }

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
  if (isNative) {
    try {
      await NativeAudioPlayer.allowSleep();
    } catch {}
    return;
  }

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
