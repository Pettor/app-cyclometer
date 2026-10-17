import { cloneGrid, emptyGrid } from "./DrumPart";
import type { DrumGrid } from "./DrumPart";
import type { DrumStyle } from "./DrumStyle";
import { groupStarts } from "~/core/flow/FlowMath";
import type { FlowStep } from "~/core/flow/FlowStep";

export interface SuggestedPart {
  main: DrumGrid;
  fill: DrumGrid;
}

type StepShape = Pick<FlowStep, "num" | "groups" | "slots">;

/** Small seeded PRNG so the same seed always suggests the same groove. */
export function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Slots where the backbeat snare lands for a grouping. */
export function snareSlots(step: StepShape, style: DrumStyle): number[] {
  const starts = groupStarts(step.groups);
  if (starts.length === 1) return [Math.floor(step.num / 2)];
  if (style === "half") return [starts[Math.floor(starts.length / 2)] ?? 0];
  return starts.filter((_, i) => i % 2 === 1);
}

/** First slot of the fill: the last group, or the second half of a single-group bar. */
export function fillStart(step: StepShape): number {
  const starts = groupStarts(step.groups);
  return starts.length > 1 ? (starts[starts.length - 1] ?? 0) : Math.floor(step.num / 2);
}

/**
 * Builds a drum part from the grouping: kick on the downbeat, snare where the bar leans,
 * hats on the pulse, a crash on the first slot and a snare-to-toms fill over the last group.
 */
export function suggestPart(step: StepShape, style: DrumStyle, seed: number, keepRestsSilent: boolean): SuggestedPart {
  const n = step.num;
  const rng = mulberry32(seed);
  const starts = groupStarts(step.groups);
  function isStart(k: number): boolean {
    return starts.includes(k);
  }
  const snare = snareSlots(step, style);
  const g = emptyGrid(n);

  g.kick[0] = 2;
  if (style !== "half") {
    starts.forEach((s, k) => {
      if (k > 0 && !snare.includes(s)) g.kick[s] = 1;
    });
  }
  step.slots.forEach((kind, k) => {
    if (kind === "a" && k > 0 && !snare.includes(k) && !g.kick[k] && style !== "sparse") g.kick[k] = 1;
  });
  for (const s of snare) g.snare[s] = 2;

  if (style === "groove" || style === "busy") {
    const kickChance = style === "busy" ? 0.3 : 0.16;
    const ghostChance = style === "busy" ? 0.62 : 0.4;
    for (let i = 1; i < n; i++) {
      if (g.kick[i] || g.snare[i] || isStart(i)) continue;
      const r = rng();
      if (r < kickChance) g.kick[i] = 1;
      else if (r < ghostChance) g.snare[i] = 3;
    }
  }

  if (style === "half" && n > 5) {
    const pickup = n - 2;
    if (!g.snare[pickup]) g.kick[pickup] = 1;
  }

  for (let i = 0; i < n; i++) {
    if (style === "prog") g.ride[i] = isStart(i) ? 2 : 1;
    else if (style === "sparse") g.hat[i] = isStart(i) ? 1 : 0;
    else if (style === "linear") g.hat[i] = g.kick[i] || g.snare[i] ? 0 : isStart(i) ? 2 : 1;
    else g.hat[i] = isStart(i) ? 2 : style === "half" && i % 2 ? 3 : 1;
  }

  if (style === "linear") {
    for (let i = 0; i < n; i++) {
      if (g.snare[i] === 3) {
        g.snare[i] = 0;
        g.hat[i] = 1;
      }
    }
  }

  if ((style === "groove" || style === "busy") && starts.length > 1) {
    const beforeLast = (starts[starts.length - 1] ?? 0) - 1;
    if (beforeLast > 0 && rng() < 0.75) {
      g.hat[beforeLast] = 0;
      g.ohat[beforeLast] = 1;
    }
  }

  g.crash[0] = 2;
  if (style !== "prog" && style !== "linear") g.hat[0] = 0;

  if (keepRestsSilent) {
    step.slots.forEach((kind, k) => {
      if (kind !== "r") return;
      g.kick[k] = 0;
      if (g.snare[k] !== 3) g.snare[k] = 0;
    });
  }

  const f = cloneGrid(g);
  f.crash = f.crash.map(() => 0);
  const from = fillStart(step);
  const length = n - from;
  for (let i = from; i < n; i++) {
    f.hat[i] = 0;
    f.ohat[i] = 0;
    f.ride[i] = 0;
    f.snare[i] = 0;
    f.kick[i] = 0;
    const t = (i - from) / length;
    if (style === "sparse") {
      if (i === from) f.snare[i] = 2;
      if (i === n - 1) f.toml[i] = 2;
      continue;
    }
    if (t < 0.34) f.snare[i] = i === from ? 2 : 1;
    else if (t < 0.67) f.tomh[i] = 1;
    else f.toml[i] = 1;
    if (style === "busy" && i > from && f.snare[i]) f.snare[i] = 1;
  }
  f.toml[n - 1] = 2;
  f.kick[n - 1] = 1;

  return { main: g, fill: f };
}
