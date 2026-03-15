import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";

const isNative = Capacitor.isNativePlatform();

export function vibrateRoundStart(): void {
  if (isNative) {
    Haptics.impact({ style: ImpactStyle.Heavy });
    setTimeout(() => Haptics.impact({ style: ImpactStyle.Heavy }), 150);
  } else {
    navigator.vibrate?.([100, 50, 100]);
  }
}

export function vibrateRoundEnd(): void {
  if (isNative) {
    Haptics.notification({ type: NotificationType.Success });
  } else {
    navigator.vibrate?.([200, 100, 200, 100, 200]);
  }
}

export function vibrateWarning(): void {
  if (isNative) {
    Haptics.impact({ style: ImpactStyle.Light });
  } else {
    navigator.vibrate?.([50, 50, 50]);
  }
}
