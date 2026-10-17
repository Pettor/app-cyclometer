import { z } from "zod";

export const DrumKeySchema = z.enum(["crash", "ride", "ohat", "hat", "snare", "tomh", "toml", "kick"]);
export type DrumKey = z.infer<typeof DrumKeySchema>;

/** 0 = off, 1 = hit, 2 = accent, 3 = ghost. */
export const DrumHitSchema = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]);
export type DrumHit = z.infer<typeof DrumHitSchema>;

export interface DrumInstrument {
  key: DrumKey;
  /** General MIDI percussion note (channel 10). */
  midi: number;
  /** True when the instrument only sounds on the first pass of a pattern. */
  firstPassOnly?: boolean;
}

/** Top-to-bottom row order of the drum grid. */
export const DRUM_KIT: DrumInstrument[] = [
  { key: "crash", midi: 49, firstPassOnly: true },
  { key: "ride", midi: 51 },
  { key: "ohat", midi: 46 },
  { key: "hat", midi: 42 },
  { key: "snare", midi: 38 },
  { key: "tomh", midi: 48 },
  { key: "toml", midi: 45 },
  { key: "kick", midi: 36 },
];

/** MIDI velocity per hit level. */
export const HIT_VELOCITY: Record<DrumHit, number> = { 0: 0, 1: 96, 2: 124, 3: 46 };

export function nextHit(hit: DrumHit): DrumHit {
  return ((hit + 1) % 4) as DrumHit;
}
