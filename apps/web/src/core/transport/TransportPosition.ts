import type { FlowStep } from "~/core/flow/FlowStep";

export interface TransportPosition {
  /** Index of the pattern in the flow. */
  step: number;
  /** Which replay of the pattern is playing (0-based). */
  pass: number;
  /** Current slot in the bar, or -1 before the first slot has sounded. */
  slot: number;
}

export interface TransportAdvance {
  position: TransportPosition;
  /** True when the advance wrapped from the last pattern back to the first. */
  completedCycle: boolean;
}

export const IDLE_POSITION: TransportPosition = { step: 0, pass: 0, slot: -1 };

/** Moves one slot forward through the flow, replaying each pattern `repeats` times. */
export function advancePosition(steps: FlowStep[], position: TransportPosition): TransportAdvance {
  let { step, pass } = position;
  let slot = position.slot + 1;
  let completedCycle = false;

  if (step >= steps.length) {
    step = 0;
    pass = 0;
    slot = 0;
  }

  const current = steps[step];
  if (current && slot >= current.num) {
    slot = 0;
    pass++;
    if (pass >= current.repeats) {
      pass = 0;
      step++;
      if (step >= steps.length) {
        step = 0;
        completedCycle = true;
      }
    }
  }

  return { position: { step, pass, slot }, completedCycle };
}

/** Progress through pattern `index` as a 0–100 percentage, for timeline fills. */
export function stepProgress(
  steps: FlowStep[],
  index: number,
  position: TransportPosition,
  isStarted: boolean
): number {
  if (!isStarted) return 0;
  if (index < position.step) return 100;
  const step = steps[index];
  if (index > position.step || !step || position.slot < 0) return 0;
  return ((position.pass * step.num + position.slot + 1) / (step.num * step.repeats)) * 100;
}
