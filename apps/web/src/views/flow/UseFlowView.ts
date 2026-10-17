import { useMemo, useState } from "react";
import type { FlowViewProps } from "./FlowViewProps";
import type { TransportProgressSegment } from "~/components/actions/transport-controls/CompactTransportControls";
import { cycleStats, stepWeight } from "~/core/flow/FlowMath";
import type { CycleStats } from "~/core/flow/FlowMath";
import { stepProgress } from "~/core/transport/TransportPosition";

/** Which panel is visible on phones; desktop shows all three side by side. */
export type FlowMobileTab = "play" | "flow" | "edit";

export interface UseFlowViewResult {
  /** Pattern shown on the stage: the playing one, or the selected one when stopped. */
  activeIndex: number;
  /** Pattern currently under the playhead, or -1 when stopped. */
  playingIndex: number;
  activeSlot: number;
  stats: CycleStats;
  progress: TransportProgressSegment[];
  tab: FlowMobileTab;
  setTab: (tab: FlowMobileTab) => void;
  /** Selects a pattern and, on phones, jumps to the editor. */
  selectAndEdit: (index: number) => void;
  /** Toggles playback and, on phones, jumps to the stage. */
  togglePlay: () => void;
}

export function useFlowView({ flow, playback, controls }: FlowViewProps): UseFlowViewResult {
  const [tab, setTab] = useState<FlowMobileTab>("play");
  const { steps, selectedIndex, select } = flow;

  const playingIndex = playback.isStarted ? Math.min(playback.position.step, steps.length - 1) : -1;
  const activeIndex = playingIndex >= 0 ? playingIndex : selectedIndex;
  const activeSlot = playback.isStarted ? playback.position.slot : -1;

  const stats = useMemo(() => cycleStats(steps, controls.tempo), [steps, controls.tempo]);

  const progress = useMemo(
    () =>
      steps.map((step, i) => ({
        weight: stepWeight(step),
        fill: stepProgress(steps, i, playback.position, playback.isStarted),
      })),
    [steps, playback.position, playback.isStarted]
  );

  function selectAndEdit(index: number): void {
    select(index);
    setTab("edit");
  }

  function togglePlay(): void {
    if (!controls.isPlaying) setTab("play");
    controls.onTogglePlay();
  }

  return { activeIndex, playingIndex, activeSlot, stats, progress, tab, setTab, selectAndEdit, togglePlay };
}
