import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import {
  DEFAULT_DRUM_SEED,
  drumExportCyclesAtom,
  drumKeepRestsSilentAtom,
  drumMutesAtom,
  drumPartsAtom,
  drumSeedAtom,
  drumStyleAtom,
} from "./DrumAtoms";
import { nextHit } from "./DrumKit";
import type { DrumKey } from "./DrumKit";
import { cloneGrid, partFitsStep } from "./DrumPart";
import type { DrumGridView, DrumPart } from "./DrumPart";
import type { DrumStyle } from "./DrumStyle";
import { suggestPart } from "./DrumSuggest";
import type { FlowStep } from "~/core/flow/FlowStep";

export interface UseDrumLabResult {
  /** One part per flow step, in flow order. */
  parts: DrumPart[];
  style: DrumStyle;
  setStyle: (style: DrumStyle) => void;
  keepRestsSilent: boolean;
  setKeepRestsSilent: (value: boolean) => void;
  mutes: Partial<Record<DrumKey, boolean>>;
  toggleMute: (key: DrumKey) => void;
  exportCycles: number;
  setExportCycles: (cycles: number) => void;
  toggleHit: (stepIndex: number, view: DrumGridView, key: DrumKey, slot: number) => void;
  setUseFill: (stepIndex: number, useFill: boolean) => void;
  /** Replaces the parts at `indices` with fresh suggestions in the current style. */
  suggest: (indices: number[]) => void;
  /** Suggests a new variation for one pattern using a new seed. */
  reroll: (stepIndex: number) => void;
}

function defaultPart(step: FlowStep, index: number): DrumPart {
  return { ...suggestPart(step, "groove", DEFAULT_DRUM_SEED + index, true), useFill: true };
}

export function useDrumLab(steps: FlowStep[]): UseDrumLabResult {
  const [stored, setStored] = useAtom(drumPartsAtom);
  const [style, setStyle] = useAtom(drumStyleAtom);
  const [keepRestsSilent, setKeepRestsSilent] = useAtom(drumKeepRestsSilentAtom);
  const [seed, setSeed] = useAtom(drumSeedAtom);
  const [mutes, setMutes] = useAtom(drumMutesAtom);
  const [exportCycles, setExportCycles] = useAtom(drumExportCyclesAtom);

  const parts = useMemo(
    () =>
      steps.map((step, index) => {
        const part = stored[step.id];
        return partFitsStep(part, step) ? part : defaultPart(step, index);
      }),
    [steps, stored]
  );

  /** Writes parts back by step id, dropping entries for steps no longer in the flow. */
  const writeParts = useCallback(
    (changes: Map<number, DrumPart>) => {
      setStored((prev) => {
        const next: Record<string, DrumPart> = {};
        steps.forEach((step, index) => {
          const part = changes.get(index) ?? prev[step.id];
          if (part) next[step.id] = part;
        });
        return next;
      });
    },
    [setStored, steps]
  );

  const applySuggestions = useCallback(
    (indices: number[], withSeed: number) => {
      const changes = new Map<number, DrumPart>();
      for (const index of indices) {
        const step = steps[index];
        const part = parts[index];
        if (!step || !part) continue;
        changes.set(index, { ...suggestPart(step, style, withSeed + index, keepRestsSilent), useFill: part.useFill });
      }
      writeParts(changes);
      setSeed(withSeed);
    },
    [keepRestsSilent, parts, setSeed, steps, style, writeParts]
  );

  const toggleHit = useCallback(
    (stepIndex: number, view: DrumGridView, key: DrumKey, slot: number) => {
      const part = parts[stepIndex];
      if (!part) return;
      const grid = cloneGrid(part[view]);
      grid[key][slot] = nextHit(grid[key][slot] ?? 0);
      writeParts(new Map([[stepIndex, { ...part, [view]: grid }]]));
    },
    [parts, writeParts]
  );

  const setUseFill = useCallback(
    (stepIndex: number, useFill: boolean) => {
      const part = parts[stepIndex];
      if (!part) return;
      writeParts(new Map([[stepIndex, { ...part, useFill }]]));
    },
    [parts, writeParts]
  );

  const toggleMute = useCallback((key: DrumKey) => setMutes((prev) => ({ ...prev, [key]: !prev[key] })), [setMutes]);

  const suggest = useCallback((indices: number[]) => applySuggestions(indices, seed), [applySuggestions, seed]);

  const reroll = useCallback(
    (stepIndex: number) => applySuggestions([stepIndex], seed + 97 + Math.floor(Math.random() * 1000)),
    [applySuggestions, seed]
  );

  return {
    parts,
    style,
    setStyle,
    keepRestsSilent,
    setKeepRestsSilent,
    mutes,
    toggleMute,
    exportCycles,
    setExportCycles,
    toggleHit,
    setUseFill,
    suggest,
    reroll,
  };
}
