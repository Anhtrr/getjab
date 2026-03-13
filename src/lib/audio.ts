let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  // iOS closes the context after background suspension — recreate if needed
  if (audioContext && audioContext.state === "closed") {
    audioContext = null;
  }
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

function playBellStrike(ctx: AudioContext, startTime: number, volume: number = 0.5) {
  // Boxing ring bell: high-pitched, bright, metallic clang
  // Fundamental — sharp metallic tone (~800Hz, typical boxing bell)
  const fund = ctx.createOscillator();
  const fundGain = ctx.createGain();
  fund.type = "sine";
  fund.frequency.setValueAtTime(830, startTime);
  fundGain.gain.setValueAtTime(0, startTime);
  fundGain.gain.linearRampToValueAtTime(volume * 0.9, startTime + 0.002);
  fundGain.gain.setTargetAtTime(volume * 0.35, startTime + 0.01, 0.08);
  fundGain.gain.setTargetAtTime(0.001, startTime + 0.15, 0.15);
  fund.connect(fundGain);
  fundGain.connect(ctx.destination);
  fund.start(startTime);
  fund.stop(startTime + 0.8);

  // Partial 2 — bright ring, non-harmonic (~2.7x for metallic character)
  const p2 = ctx.createOscillator();
  const p2Gain = ctx.createGain();
  p2.type = "sine";
  p2.frequency.setValueAtTime(830 * 2.71, startTime); // ~2249Hz
  p2Gain.gain.setValueAtTime(0, startTime);
  p2Gain.gain.linearRampToValueAtTime(volume * 0.55, startTime + 0.001);
  p2Gain.gain.setTargetAtTime(volume * 0.15, startTime + 0.008, 0.04);
  p2Gain.gain.setTargetAtTime(0.001, startTime + 0.1, 0.08);
  p2.connect(p2Gain);
  p2Gain.connect(ctx.destination);
  p2.start(startTime);
  p2.stop(startTime + 0.5);

  // Partial 3 — high shimmer (~5.4x)
  const p3 = ctx.createOscillator();
  const p3Gain = ctx.createGain();
  p3.type = "sine";
  p3.frequency.setValueAtTime(830 * 5.42, startTime); // ~4499Hz
  p3Gain.gain.setValueAtTime(0, startTime);
  p3Gain.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.001);
  p3Gain.gain.setTargetAtTime(0.001, startTime + 0.02, 0.025);
  p3.connect(p3Gain);
  p3Gain.connect(ctx.destination);
  p3.start(startTime);
  p3.stop(startTime + 0.2);

  // Partial 4 — ultra-high sizzle for metallic brightness
  const p4 = ctx.createOscillator();
  const p4Gain = ctx.createGain();
  p4.type = "sine";
  p4.frequency.setValueAtTime(830 * 8.3, startTime); // ~6889Hz
  p4Gain.gain.setValueAtTime(0, startTime);
  p4Gain.gain.linearRampToValueAtTime(volume * 0.12, startTime + 0.001);
  p4Gain.gain.setTargetAtTime(0.001, startTime + 0.008, 0.01);
  p4.connect(p4Gain);
  p4Gain.connect(ctx.destination);
  p4.start(startTime);
  p4.stop(startTime + 0.08);

  // Sharp metallic impact transient
  const noise = ctx.createBufferSource();
  const bufLen = Math.floor(ctx.sampleRate * 0.015);
  const noiseBuffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / noiseData.length, 4);
  }
  noise.buffer = noiseBuffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(3500, startTime);
  noiseFilter.Q.setValueAtTime(1.5, startTime);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.8, startTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.02);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(startTime);
}

export function playRoundStart() {
  const ctx = getAudioContext();
  playBellStrike(ctx, ctx.currentTime, 0.6);
}

export function playRoundEnd() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  playBellStrike(ctx, now, 0.6);
  playBellStrike(ctx, now + 0.18, 0.55);
  playBellStrike(ctx, now + 0.36, 0.5);
}

export function playWarning() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  playBellStrike(ctx, now, 0.45);
  playBellStrike(ctx, now + 0.25, 0.45);
}

export function initAudio() {
  getAudioContext();
}
