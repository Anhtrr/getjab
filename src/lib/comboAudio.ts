import type { ParsedCombo } from "./types";

let selectedVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Prefer an English male voice
  const englishMale = voices.find(
    (v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("male"),
  );
  if (englishMale) return englishMale;

  // Fallback: any English voice
  const english = voices.find((v) => v.lang.startsWith("en"));
  if (english) return english;

  return voices[0];
}

/** Initialize audio — call on user gesture (e.g., start button click) */
export function initComboAudio(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // Voices may load asynchronously
  const tryLoad = () => {
    selectedVoice = pickVoice();
    voicesLoaded = true;
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    tryLoad();
  } else {
    window.speechSynthesis.addEventListener("voiceschanged", tryLoad, { once: true });
  }
}

/** Check if TTS is available */
export function isAudioAvailable(): boolean {
  return typeof window !== "undefined" && !!window.speechSynthesis;
}

/** Speak a combo aloud */
export function speakCombo(
  combo: ParsedCombo,
  mode: "names" | "numbers" = "names",
): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (!combo.isCallable || combo.punches.length === 0) return;

  // Cancel any current speech first
  window.speechSynthesis.cancel();

  const text =
    mode === "names"
      ? combo.punches.map((p) => {
          const base = p.name.toLowerCase();
          return p.target ? `${p.target} ${base}` : base;
        }).join(", ")
      : combo.punches.map((p) => {
          // Defense moves always use their name (no number equivalent)
          if (typeof p.number === "string") return p.name.toLowerCase();
          const numWord = ["one", "two", "three", "four", "five", "six"][p.number - 1] || String(p.number);
          return p.target ? `${p.target} ${numWord}` : numWord;
        }).join(", ");

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.3;
  utterance.pitch = 0.9;
  utterance.volume = 0.9;

  if (voicesLoaded && selectedVoice) {
    utterance.voice = selectedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

/** Cancel any current speech */
export function cancelSpeech(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
