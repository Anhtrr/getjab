import { registerPlugin } from "@capacitor/core";

interface NativeAudioPlayerPlugin {
  preload(options: { assetId: string; path: string }): Promise<void>;
  play(options: { assetId: string; volume?: number }): Promise<void>;
  stop(options: { assetId: string }): Promise<void>;
  stopAll(): Promise<void>;
  startDucking(): Promise<void>;
  stopDucking(): Promise<void>;
}

const NativeAudioPlayer = registerPlugin<NativeAudioPlayerPlugin>("NativeAudioPlayer");

export default NativeAudioPlayer;
