import { AudioEngine } from "./AudioEngine";

// One engine per app: browsers limit how many AudioContexts a page may open
const engine = new AudioEngine();

export function useAudioEngine(): AudioEngine {
  return engine;
}
