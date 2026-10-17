import { z } from "zod";
import { DRUM_KIT, DrumHitSchema, DrumKeySchema } from "./DrumKit";
import type { DrumHit } from "./DrumKit";
import type { FlowStep } from "~/core/flow/FlowStep";

export const DrumGridSchema = z.record(DrumKeySchema, z.array(DrumHitSchema));

/** One row of hits per instrument, one column per slot. */
export type DrumGrid = z.infer<typeof DrumGridSchema>;

export const DrumPartSchema = z.object({
  main: DrumGridSchema,
  fill: DrumGridSchema,
  useFill: z.boolean(),
});

/** The drum part for one flow pattern: a main groove and a fill for the last pass. */
export type DrumPart = z.infer<typeof DrumPartSchema>;

export type DrumGridView = "main" | "fill";

export function emptyGrid(slots: number): DrumGrid {
  const grid = {} as DrumGrid;
  for (const { key } of DRUM_KIT) grid[key] = Array.from({ length: slots }, () => 0 as DrumHit);
  return grid;
}

export function cloneGrid(grid: DrumGrid): DrumGrid {
  const out = {} as DrumGrid;
  for (const { key } of DRUM_KIT) out[key] = (grid[key] ?? []).slice();
  return out;
}

/** True when the part has a row for every instrument and a column for every slot of `step`. */
export function partFitsStep(part: DrumPart | undefined, step: FlowStep): part is DrumPart {
  if (!part) return false;
  return DRUM_KIT.every(({ key }) => part.main[key]?.length === step.num && part.fill[key]?.length === step.num);
}

/** The fill plays on the last pass when it is switched on and the pattern repeats. */
export function hasFill(part: DrumPart, step: FlowStep): boolean {
  return part.useFill && step.repeats > 1;
}

export function gridForPass(part: DrumPart, step: FlowStep, pass: number): DrumGrid {
  return hasFill(part, step) && pass === step.repeats - 1 ? part.fill : part.main;
}
