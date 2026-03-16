import type { ParsedCombo, ParsedPunch } from "./types";
import { getAudioContext } from "./audio";

// ─── Pre-recorded audio clip system ───

const PUNCH_AUDIO_MAP: Record<string, string> = {
  // Names mode
  "jab": "/audio/jab.mp3",
  "cross": "/audio/cross.mp3",
  "lead hook": "/audio/hook.mp3",
  "rear hook": "/audio/rear-hook.mp3",
  "lead uppercut": "/audio/uppercut.mp3",
  "rear uppercut": "/audio/rear-uppercut.mp3",
  "body jab": "/audio/body-jab.mp3",
  "body cross": "/audio/body-cross.mp3",
  "body lead hook": "/audio/body-hook.mp3",
  "body rear hook": "/audio/body-hook.mp3",
  "body lead uppercut": "/audio/body-uppercut.mp3",
  "body rear uppercut": "/audio/body-uppercut.mp3",
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
  // Body + number compounds
  "body one": "/audio/body-jab.mp3",
  "body two": "/audio/body-cross.mp3",
  "body three": "/audio/body-hook.mp3",
  "body four": "/audio/body-hook.mp3",
  "body five": "/audio/body-uppercut.mp3",
  "body six": "/audio/body-uppercut.mp3",
};

const ROUND_AUDIO_MAP: Record<string, string> = {
  "burnout": "/audio/burnout-round.mp3",
  "conditioning": "/audio/conditioning.mp3",
  "cooldown": "/audio/cooldown.mp3",
  "shadow": "/audio/shadow-boxing.mp3",
};

const bufferCache = new Map<string, AudioBuffer>();
const fetchPromises = new Map<string, Promise<AudioBuffer | null>>();
let clipPlaybackActive = false;
let clipTimeouts: ReturnType<typeof setTimeout>[] = [];
let activeSource: AudioBufferSourceNode | null = null;

async function preloadClip(src: string): Promise<AudioBuffer | null> {
  if (bufferCache.has(src)) return bufferCache.get(src)!;
  if (fetchPromises.has(src)) return fetchPromises.get(src)!;

  const promise = (async () => {
    try {
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      const ctx = getAudioContext();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      bufferCache.set(src, audioBuffer);
      return audioBuffer;
    } catch {
      return null;
    }
  })();

  fetchPromises.set(src, promise);
  return promise;
}

function playBuffer(buffer: AudioBuffer): { source: AudioBufferSourceNode; duration: number } {
  const ctx = getAudioContext();
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  gain.gain.value = 0.9;
  source.buffer = buffer;
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start();
  activeSource = source;
  return { source, duration: buffer.duration * 1000 };
}

function getPunchClipKey(punch: ParsedPunch, mode: "names" | "numbers"): string {
  if (mode === "numbers" && punch.type !== "defense") {
    const numWord = ["one", "two", "three", "four", "five", "six"][(punch.number as number) - 1] || String(punch.number);
    return punch.target === "body" ? `body ${numWord}` : numWord;
  }
  return punch.target === "body" ? `body ${punch.name.toLowerCase()}` : punch.name.toLowerCase();
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

  // Build the list of clip keys for this combo
  const keys = combo.punches.map((p) => getPunchClipKey(p, mode));

  // Check if all clips are available
  const allAvailable = keys.every((key) => PUNCH_AUDIO_MAP[key]);

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

  // Play clips sequentially using AudioContext buffers
  clipPlaybackActive = true;
  const GAP_MS = 80;

  async function playNext(index: number) {
    if (!clipPlaybackActive || index >= keys.length) return;
    const src = PUNCH_AUDIO_MAP[keys[index]];
    const buffer = await preloadClip(src);
    if (!buffer || !clipPlaybackActive) return;

    const { source, duration } = playBuffer(buffer);
    source.onended = () => {
      if (!clipPlaybackActive) return;
      const t = setTimeout(() => playNext(index + 1), GAP_MS);
      clipTimeouts.push(t);
    };
  }

  playNext(0);
}

/** Speak round title via TTS */
export function speakText(text: string): void {
  cancelSpeech();
  speakTTS(text, 1.1);
}

/** Cancel any current speech or clip playback */
export function cancelSpeech(): void {
  clipPlaybackActive = false;
  for (const t of clipTimeouts) clearTimeout(t);
  clipTimeouts = [];

  // Stop any currently playing buffer source
  if (activeSource) {
    try { activeSource.stop(); } catch {}
    activeSource = null;
  }

  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
