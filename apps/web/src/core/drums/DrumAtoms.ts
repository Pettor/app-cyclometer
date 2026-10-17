import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { z } from "zod";
import type { DrumKey } from "./DrumKit";
import { DrumPartSchema } from "./DrumPart";
import type { DrumPart } from "./DrumPart";
import { DrumStyleSchema } from "./DrumStyle";
import type { DrumStyle } from "./DrumStyle";
import { createValidatedStorage } from "~/core/storage/ValidatedStorage";

const storageOptions = { getOnInit: true };

/** Edited drum parts keyed by flow step id. Steps without an entry get a suggested part. */
export const drumPartsAtom = atomWithStorage<Record<string, DrumPart>>(
  "cyclometer:drum-parts",
  {},
  createValidatedStorage(z.record(z.string(), DrumPartSchema)),
  storageOptions
);

export const drumStyleAtom = atomWithStorage<DrumStyle>(
  "cyclometer:drum-style",
  "groove",
  createValidatedStorage(DrumStyleSchema),
  storageOptions
);

export const drumKeepRestsSilentAtom = atomWithStorage<boolean>(
  "cyclometer:drum-keep-rests",
  true,
  createValidatedStorage(z.boolean()),
  storageOptions
);

export const DEFAULT_DRUM_SEED = 7;

export const drumSeedAtom = atom(DEFAULT_DRUM_SEED);
export const drumMutesAtom = atom<Partial<Record<DrumKey, boolean>>>({});
export const drumExportCyclesAtom = atom(1);
