import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import type { AppSection } from "~/components/navigation/app-header/AppHeader";
import { useAudioEngine } from "~/core/audio/UseAudioEngine";
import { flowLoopAtom, flowMutedAtom, flowTempoAtom } from "~/core/flow/FlowAtoms";
import { useFlow } from "~/core/flow/UseFlow";
import { useSettingsModal } from "~/core/settings/UseSettingsModal";
import { useTransport } from "~/core/transport/UseTransport";
import type { TransportTick } from "~/core/transport/UseTransport";
import type { FlowViewProps } from "~/views/flow/FlowViewProps";

export function useFlowRoute(): FlowViewProps {
  const navigate = useNavigate();
  const { open: openSettings } = useSettingsModal();
  const engine = useAudioEngine();
  const flow = useFlow();
  const [tempo, setTempo] = useAtom(flowTempoAtom);
  const [loop, setLoop] = useAtom(flowLoopAtom);
  const [muted, setMuted] = useAtom(flowMutedAtom);

  function playClick({ step, position }: TransportTick): void {
    const kind = step.slots[position.slot];
    if (muted || kind === undefined || kind === "r") return;
    engine.click(position.slot === 0 ? "downbeat" : kind === "a" ? "accent" : "note");
  }

  const transport = useTransport({ steps: flow.steps, tempo, loop, onSlot: playClick });

  function togglePlay(): void {
    // Audio can only start inside a user gesture
    engine.resume();
    transport.toggle(flow.selectedIndex);
  }

  function navigateTo(section: AppSection): void {
    void navigate({ to: section === "drums" ? "/drums" : "/" });
  }

  return {
    flow,
    playback: {
      isPlaying: transport.isPlaying,
      isStarted: transport.isStarted,
      position: transport.position,
      cycles: transport.cycles,
    },
    controls: {
      tempo,
      onTempoChange: setTempo,
      loop,
      onLoopChange: setLoop,
      muted,
      onMutedChange: setMuted,
      isPlaying: transport.isPlaying,
      onTogglePlay: togglePlay,
      onStop: transport.stop,
    },
    onNavigate: navigateTo,
    onOpenSettings: () => openSettings(),
  };
}
