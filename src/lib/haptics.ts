export function vibrateRoundStart(): void {
  navigator.vibrate?.([100, 50, 100]);
}

export function vibrateRoundEnd(): void {
  navigator.vibrate?.([200, 100, 200, 100, 200]);
}

export function vibrateWarning(): void {
  navigator.vibrate?.([50, 50, 50]);
}
