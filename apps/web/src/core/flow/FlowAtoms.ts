import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { z } from "zod";
import { DEFAULT_TEMPO, createDefaultFlow } from "./FlowDefaults";
import { MAX_TEMPO, MIN_TEMPO } from "./FlowMath";
import { FlowStepListSchema } from "./FlowStep";
import type { FlowStep } from "./FlowStep";
import { createValidatedStorage } from "~/core/storage/ValidatedStorage";

const storageOptions = { getOnInit: true };

// The flow and the playback preferences survive reloads
export const flowStepsAtom = atomWithStorage<FlowStep[]>(
  "cyclometer:flow",
  createDefaultFlow(),
  createValidatedStorage(FlowStepListSchema),
  storageOptions
);

export const flowTempoAtom = atomWithStorage<number>(
  "cyclometer:tempo",
  DEFAULT_TEMPO,
  createValidatedStorage(z.number().int().min(MIN_TEMPO).max(MAX_TEMPO)),
  storageOptions
);

export const flowLoopAtom = atomWithStorage<boolean>(
  "cyclometer:loop",
  true,
  createValidatedStorage(z.boolean()),
  storageOptions
);

export const flowMutedAtom = atomWithStorage<boolean>(
  "cyclometer:muted",
  false,
  createValidatedStorage(z.boolean()),
  storageOptions
);

// Selection is per session
const flowSelectedIndexBaseAtom = atom(0);

/** Index of the pattern being edited, always clamped to the current flow length. */
export const flowSelectedIndexAtom = atom(
  (get) => Math.min(get(flowSelectedIndexBaseAtom), get(flowStepsAtom).length - 1),
  (_get, set, index: number) => set(flowSelectedIndexBaseAtom, Math.max(0, index))
);
