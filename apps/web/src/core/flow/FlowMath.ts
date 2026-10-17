import type { Denominator, FlowStep, SlotKind, TimeSignature } from "./FlowStep";

export const MIN_BEATS = 2;
export const MAX_BEATS = 17;
export const MIN_REPEATS = 1;
export const MAX_REPEATS = 32;
export const MIN_TEMPO = 40;
export const MAX_TEMPO = 220;
export const DENOMINATORS: Denominator[] = [4, 8, 16];

export interface SlotGroup {
  /** Index of the group the slot belongs to. */
  group: number;
  /** Position of the slot inside its group (0-based). */
  position: number;
  /** Size of the group the slot belongs to. */
  size: number;
  /** True when the slot is the first slot of its group. */
  isGroupStart: boolean;
}

export interface CycleStats {
  patterns: number;
  bars: number;
  seconds: number;
}

/**
 * Lists ways to split `n` slots into groups of 2, 3 and 4, fewest groups first.
 * Returns at most `limit` groupings; falls back to a single group when no split exists.
 */
export function groupingsFor(n: number, limit = 8): number[][] {
  const out: number[][] = [];

  function walk(remaining: number, acc: number[]): void {
    if (out.length > 40) return;
    if (remaining === 0) {
      out.push(acc.slice());
      return;
    }
    if (acc.length >= 5) return;
    for (const part of [4, 3, 2]) {
      if (part <= remaining) {
        acc.push(part);
        walk(remaining - part, acc);
        acc.pop();
      }
    }
  }

  walk(n, []);
  if (out.length === 0) out.push([n]);
  out.sort((a, b) => a.length - b.length);
  return out.slice(0, limit);
}

export function groupStarts(groups: number[]): number[] {
  const starts: number[] = [];
  let acc = 0;
  for (const g of groups) {
    starts.push(acc);
    acc += g;
  }
  return starts;
}

export function slotGroup(step: Pick<FlowStep, "groups">, slot: number): SlotGroup {
  let acc = 0;
  for (let g = 0; g < step.groups.length; g++) {
    const size = step.groups[g] ?? 0;
    if (slot < acc + size) {
      return { group: g, position: slot - acc, size, isGroupStart: slot === acc };
    }
    acc += size;
  }
  return { group: 0, position: 0, size: 1, isGroupStart: false };
}

/** Default slots for a grouping: accent every group start after the downbeat. */
export function defaultSlots(num: number, groups: number[]): SlotKind[] {
  const starts = new Set(groupStarts(groups));
  return Array.from({ length: num }, (_, i) => (i > 0 && starts.has(i) ? "a" : "n"));
}

export function createStepId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function createStep(
  num: number,
  den: Denominator,
  options: { groups?: number[]; repeats?: number; slots?: SlotKind[] } = {}
): FlowStep {
  const groups = options.groups ?? groupingsFor(num)[0] ?? [num];
  return {
    id: createStepId(),
    num,
    den,
    groups,
    repeats: options.repeats ?? 2,
    slots: options.slots ?? defaultSlots(num, groups),
  };
}

export function duplicateStep(step: FlowStep): FlowStep {
  return { ...step, id: createStepId(), groups: step.groups.slice(), slots: step.slots.slice() };
}

/** Changes the slot count, keeping existing slots and resetting the grouping. */
export function withBeats(step: FlowStep, num: number): FlowStep {
  const n = clamp(num, MIN_BEATS, MAX_BEATS);
  const slots = step.slots.slice(0, n);
  while (slots.length < n) slots.push("n");
  return { ...step, num: n, groups: groupingsFor(n)[0] ?? [n], slots };
}

export function withRepeats(step: FlowStep, repeats: number): FlowStep {
  return { ...step, repeats: clamp(repeats, MIN_REPEATS, MAX_REPEATS) };
}

/** Cycles a slot: note → accent → rest → note. */
export function nextSlotKind(kind: SlotKind): SlotKind {
  if (kind === "n") return "a";
  if (kind === "a") return "r";
  return "n";
}

export function formatSignature(sig: TimeSignature): string {
  return `${sig.num}/${sig.den}`;
}

export function formatGrouping(groups: number[], separator = "+"): string {
  return groups.join(separator);
}

/** Duration of one slot in milliseconds. A quarter note lasts one beat at `tempo`. */
export function slotDurationMs(tempo: number, den: Denominator): number {
  return ((60000 / tempo) * 4) / den;
}

/** Length of one pass through the flow, counted in 16th notes. Used for proportional widths. */
export function stepWeight(step: Pick<FlowStep, "num" | "den" | "repeats">): number {
  return (step.num * step.repeats * 16) / step.den;
}

export function cycleStats(steps: FlowStep[], tempo: number): CycleStats {
  let bars = 0;
  let seconds = 0;
  for (const step of steps) {
    bars += step.repeats;
    seconds += (step.num * step.repeats * slotDurationMs(tempo, step.den)) / 1000;
  }
  return { patterns: steps.length, bars, seconds };
}

/** Formats seconds as `m:ss`. */
export function formatDuration(seconds: number): string {
  let mm = Math.floor(seconds / 60);
  let ss = Math.round(seconds % 60);
  if (ss === 60) {
    mm++;
    ss = 0;
  }
  return `${mm}:${ss < 10 ? "0" : ""}${ss}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
