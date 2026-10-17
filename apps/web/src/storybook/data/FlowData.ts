import { fn } from "storybook/test";
import type { TransportControlsProps } from "~/components/actions/transport-controls/TransportControls";
import { suggestPart } from "~/core/drums/DrumSuggest";
import type { UseDrumLabResult } from "~/core/drums/UseDrumLab";
import { createDefaultFlow } from "~/core/flow/FlowDefaults";
import type { UseFlowResult } from "~/core/flow/UseFlow";
import type { FlowPlayback } from "~/views/flow/FlowViewProps";

export const storyFlowSteps = createDefaultFlow();

export function createStoryFlow(selectedIndex = 0): UseFlowResult {
  return {
    steps: storyFlowSteps,
    selectedIndex,
    select: fn(),
    add: fn(),
    move: fn(),
    duplicate: fn(),
    remove: fn(),
    setRepeats: fn(),
    setBeats: fn(),
    setDenominator: fn(),
    setGrouping: fn(),
    cycleSlot: fn(),
  };
}

export const stoppedPlayback: FlowPlayback = {
  isPlaying: false,
  isStarted: false,
  position: { step: 0, pass: 0, slot: -1 },
  cycles: 0,
};

export const playingPlayback: FlowPlayback = {
  isPlaying: true,
  isStarted: true,
  position: { step: 1, pass: 1, slot: 4 },
  cycles: 2,
};

export function createStoryControls(isPlaying = false): TransportControlsProps {
  return {
    tempo: 84,
    onTempoChange: fn(),
    loop: true,
    onLoopChange: fn(),
    muted: false,
    onMutedChange: fn(),
    isPlaying,
    onTogglePlay: fn(),
    onStop: fn(),
  };
}

export function createStoryDrums(): UseDrumLabResult {
  return {
    parts: storyFlowSteps.map((step, i) => ({ ...suggestPart(step, "groove", 7 + i, true), useFill: true })),
    style: "groove",
    setStyle: fn(),
    keepRestsSilent: true,
    setKeepRestsSilent: fn(),
    mutes: { ride: true },
    toggleMute: fn(),
    exportCycles: 1,
    setExportCycles: fn(),
    toggleHit: fn(),
    setUseFill: fn(),
    suggest: fn(),
    reroll: fn(),
  };
}
