import { useMemo, useState } from "react";
import type { DrumLabViewProps } from "./DrumLabViewProps";
import type { DrumGrid, DrumGridView, DrumPart } from "~/core/drums/DrumPart";
import { gridForPass, hasFill } from "~/core/drums/DrumPart";
import { cycleStats } from "~/core/flow/FlowMath";
import type { FlowStep } from "~/core/flow/FlowStep";

export interface UseDrumLabViewResult {
  step: FlowStep | undefined;
  part: DrumPart | undefined;
  /** Grid being edited: the main groove, or the fill when the pattern has one. */
  view: DrumGridView;
  setView: (view: DrumGridView) => void;
  grid: DrumGrid | undefined;
  stepHasFill: boolean;
  playingIndex: number;
  /** Slot to highlight in the grid, or -1 when the playhead is in another grid. */
  gridSlot: number;
  cycleSeconds: number;
}

export function useDrumLabView({
  steps,
  selectedIndex,
  drums,
  playback,
  controls,
}: DrumLabViewProps): UseDrumLabViewResult {
  const [requestedView, setView] = useState<DrumGridView>("main");
  const step = steps[selectedIndex];
  const part = drums.parts[selectedIndex];
  const stepHasFill = !!step && !!part && hasFill(part, step);
  const view = stepHasFill ? requestedView : "main";
  const grid = part?.[view];

  const playingIndex = playback.isStarted ? Math.min(playback.position.step, steps.length - 1) : -1;
  const isPlayingThisGrid =
    playingIndex === selectedIndex && !!step && !!part && gridForPass(part, step, playback.position.pass) === grid;
  const gridSlot = isPlayingThisGrid ? playback.position.slot : -1;

  const cycleSeconds = useMemo(() => cycleStats(steps, controls.tempo).seconds, [steps, controls.tempo]);

  return { step, part, view, setView, grid, stepHasFill, playingIndex, gridSlot, cycleSeconds };
}
