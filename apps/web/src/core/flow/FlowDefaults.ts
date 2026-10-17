import { createStep } from "./FlowMath";
import type { FlowStep, TimeSignature } from "./FlowStep";

export const DEFAULT_TEMPO = 84;

/** Time signatures offered as one-tap additions to the flow. */
export const FLOW_PRESETS: TimeSignature[] = [
  { num: 5, den: 8 },
  { num: 7, den: 8 },
  { num: 7, den: 16 },
  { num: 9, den: 8 },
  { num: 11, den: 16 },
  { num: 13, den: 16 },
  { num: 4, den: 4 },
  { num: 6, den: 8 },
];

/** Replay counts offered as quick picks in the pattern editor. */
export const REPEAT_PRESETS = [1, 2, 4, 8];

export function createDefaultFlow(): FlowStep[] {
  return [
    createStep(7, 16, { groups: [4, 3], repeats: 2, slots: ["n", "n", "n", "n", "r", "n", "n"] }),
    createStep(7, 16, { groups: [4, 3], repeats: 2, slots: ["a", "r", "n", "r", "a", "r", "n"] }),
    createStep(7, 16, { groups: [3, 4], repeats: 2, slots: ["a", "r", "n", "r", "n", "r", "n"] }),
    createStep(5, 8, { groups: [3, 2], repeats: 4 }),
    createStep(9, 8, { groups: [2, 2, 2, 3], repeats: 2 }),
    createStep(11, 16, { groups: [3, 3, 3, 2], repeats: 2 }),
  ];
}
