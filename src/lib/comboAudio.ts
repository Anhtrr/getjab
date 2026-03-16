import type { ParsedCombo, ParsedPunch } from "./types";

// ─── Pre-recorded audio clip system ───

const PUNCH_AUDIO_MAP: Record<string, string> = {
  // Names mode
  "jab": "/audio/jab.mp3",
  "cross": "/audio/cross.mp3",
  "lead hook": "/audio/hook.mp3",
  "rear hook": "/audio/rear-hook.mp3",
  "lead uppercut": "/audio/uppercut.mp3",
  "rear uppercut": "/audio/rear-uppercut.mp3",
  "body": "/audio/body.mp3",
  "slip left": "/audio/slip.mp3",
  "slip right": "/audio/slip.mp3",
  "roll left": "/audio/roll.mp3",
  "roll right": "/audio/roll.mp3",
  // Numbers mode
  "one": "/audio/one.mp3",
  "two": "/audio/two.mp3",
  "three": "/audio/three.mp3",
  "four": "/audio/four.mp3",
  "five": "/audio/five.mp3",
  "six": "/audio/six.mp3",
};

const ROUND_AUDIO_MAP: Record<string, string> = {
  "burnout": "/audio/burnout-round.mp3",
  "conditioning": "/audio/conditioning.mp3",
  "cooldown": "/audio/cooldown.mp3",
  "shadow": "/audio/shadow-boxing.mp3",
};

const audioCache = new Map<string, HTMLAudioElement>();
let clipPlaybackActive = false;
let clipTimeouts: ReturnType<typeof setTimeout>[] = [];

function preloadClip(src: string): HTMLAudioElement {
  const cached = audioCache.get(src);
  if (cached) return cached;
  const audio = new Audio(src);
  audio.preload = "auto";
  audioCache.set(src, audio);
  return audio;
}

function playClip(src: string): Promise<void> {
  return new Promise((resolve) => {
    const audio = preloadClip(src);
    audio.currentTime = 0;
    audio.volume = 0.9;
    audio.onended = () => resolve();
    audio.onerror = () => resolve();
    audio.play().catch(() => resolve());
  });
}

interface ClipEntry {
  key: string;
  isBodyPrefix: boolean;
}

function getPunchClipEntries(punch: ParsedPunch, mode: "names" | "numbers"): ClipEntry[] {
  const entries: ClipEntry[] = [];

  if (mode === "numbers" && punch.type !== "defense") {
    if (punch.target === "body") entries.push({ key: "body", isBodyPrefix: true });
    const numWord = ["one", "two", "three", "four", "five", "six"][(punch.number as number) - 1];
    if (numWord) entries.push({ key: numWord, isBodyPrefix: false });
  } else {
    if (punch.target === "body") entries.push({ key: "body", isBodyPrefix: true });
    entries.push({ key: punch.name.toLowerCase(), isBodyPrefix: false });
  }

  return entries;
}

// ─── TTS fallback ───

let selectedVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const englishMale = voices.find(
    (v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("male"),
  );
  if (englishMale) return englishMale;

  const english = voices.find((v) => v.lang.startsWith("en"));
  if (english) return english;

  return voices[0];
}

function speakTTS(text: string, rate = 1.3): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 0.9;
  utterance.volume = 0.9;

  if (voicesLoaded && selectedVoice) {
    utterance.voice = selectedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// ─── iOS TTS Keep-Alive ───

let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

export function startTTSKeepAlive(): void {
  stopTTSKeepAlive();
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  keepAliveInterval = setInterval(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
      const silent = new SpeechSynthesisUtterance("");
      silent.volume = 0;
      window.speechSynthesis.speak(silent);
    }
  }, 10000);
}

export function stopTTSKeepAlive(): void {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
}

// ─── Public API ───

/** Initialize audio - call on user gesture */
export function initComboAudio(): void {
  // Preload all audio clips
  for (const src of Object.values(PUNCH_AUDIO_MAP)) {
    preloadClip(src);
  }
  for (const src of Object.values(ROUND_AUDIO_MAP)) {
    preloadClip(src);
  }

  // Also init TTS as fallback
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const unlock = new SpeechSynthesisUtterance("");
    unlock.volume = 0;
    window.speechSynthesis.speak(unlock);

    startTTSKeepAlive();

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
}

/** Check if audio is available */
export function isAudioAvailable(): boolean {
  return typeof window !== "undefined" && (!!window.Audio || !!window.speechSynthesis);
}

/** Speak a combo using pre-recorded clips, fall back to TTS */
export function speakCombo(
  combo: ParsedCombo,
  mode: "names" | "numbers" = "names",
): void {
  if (!combo.isCallable || combo.punches.length === 0) return;

  cancelSpeech();

  // Build the list of clip entries for this combo
  const entries: ClipEntry[] = [];
  for (const punch of combo.punches) {
    entries.push(...getPunchClipEntries(punch, mode));
  }

  // Check if all clips are available
  const allAvailable = entries.every((e) => PUNCH_AUDIO_MAP[e.key]);

  if (!allAvailable) {
    // Fall back to TTS
    const text =
      mode === "names"
        ? combo.punches.map((p) => {
            const base = p.name.toLowerCase();
            return p.target ? `${p.target} ${base}` : base;
          }).join(", ")
        : combo.punches.map((p) => {
            if (typeof p.number === "string") return p.name.toLowerCase();
            const numWord = ["one", "two", "three", "four", "five", "six"][(p.number as number) - 1] || String(p.number);
            return p.target ? `${p.target} ${numWord}` : numWord;
          }).join(", ");
    speakTTS(text);
    return;
  }

  // Play clips sequentially, chaining via onended
  clipPlaybackActive = true;
  const PUNCH_GAP_MS = 200;
  const BODY_PREFIX_GAP_MS = 30;

  function playNext(index: number) {
    if (!clipPlaybackActive || index >= entries.length) return;
    const entry = entries[index];
    const src = PUNCH_AUDIO_MAP[entry.key];
    const audio = preloadClip(src);
    audio.currentTime = 0;
    audio.volume = 0.9;

    audio.onended = () => {
      if (!clipPlaybackActive) return;
      // Use a short gap after body prefix, longer gap between punches
      const nextEntry = entries[index + 1];
      const gap = nextEntry?.isBodyPrefix ? PUNCH_GAP_MS : entry.isBodyPrefix ? BODY_PREFIX_GAP_MS : PUNCH_GAP_MS;
      const t = setTimeout(() => playNext(index + 1), gap);
      clipTimeouts.push(t);
    };
    audio.onerror = () => playNext(index + 1);
    audio.play().catch(() => playNext(index + 1));
  }

  playNext(0);
}

/** Speak round title using pre-recorded clips or TTS */
export function speakText(text: string): void {
  cancelSpeech();

  // Try to match a round type audio clip
  const lower = text.toLowerCase();
  for (const [keyword, src] of Object.entries(ROUND_AUDIO_MAP)) {
    if (lower.includes(keyword)) {
      clipPlaybackActive = true;
      playClip(src);
      return;
    }
  }

  // Fall back to TTS for unmatched round titles
  speakTTS(text, 1.1);
}

/** Cancel any current speech or clip playback */
export function cancelSpeech(): void {
  clipPlaybackActive = false;
  for (const t of clipTimeouts) clearTimeout(t);
  clipTimeouts = [];

  // Stop any currently playing clips
  for (const audio of audioCache.values()) {
    audio.pause();
    audio.currentTime = 0;
  }

  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
