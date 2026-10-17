import { toast } from "@heroui/react";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { useIntl } from "react-intl";
import type { AppSection } from "~/components/navigation/app-header/AppHeader";
import { useAudioEngine } from "~/core/audio/UseAudioEngine";
import { DRUM_KIT, HIT_VELOCITY } from "~/core/drums/DrumKit";
import type { DrumKey } from "~/core/drums/DrumKit";
import type { DrumGridView } from "~/core/drums/DrumPart";
import { gridForPass } from "~/core/drums/DrumPart";
import { buildDrumMidi } from "~/core/drums/MidiExport";
import { useDrumLab } from "~/core/drums/UseDrumLab";
import { downloadFile } from "~/core/files/DownloadFile";
import { flowLoopAtom, flowTempoAtom } from "~/core/flow/FlowAtoms";
import { useFlow } from "~/core/flow/UseFlow";
import { useSettingsModal } from "~/core/settings/UseSettingsModal";
import { useTransport } from "~/core/transport/UseTransport";
import type { TransportTick } from "~/core/transport/UseTransport";
import type { DrumLabViewProps } from "~/views/drum-lab/DrumLabViewProps";

const MIDI_FILENAME = "cyclometer-drums.mid";

export function useDrumsRoute(): DrumLabViewProps {
  const intl = useIntl();
  const navigate = useNavigate();
  const { open: openSettings } = useSettingsModal();
  const engine = useAudioEngine();
  const { steps, selectedIndex, select } = useFlow();
  const drums = useDrumLab(steps);
  const [tempo, setTempo] = useAtom(flowTempoAtom);
  const [loop, setLoop] = useAtom(flowLoopAtom);

  function playDrums({ position }: TransportTick): void {
    const step = steps[position.step];
    const part = drums.parts[position.step];
    if (!step || !part) return;
    const grid = gridForPass(part, step, position.pass);
    for (const instrument of DRUM_KIT) {
      if (drums.mutes[instrument.key] || (instrument.firstPassOnly && position.pass > 0)) continue;
      const hit = grid[instrument.key][position.slot] ?? 0;
      if (hit) engine.drum(instrument.key, HIT_VELOCITY[hit] / 127);
    }
  }

  const transport = useTransport({ steps, tempo, loop, onSlot: playDrums });

  function audition(key: DrumKey): void {
    engine.resume();
    engine.drum(key, HIT_VELOCITY[2] / 127);
  }

  function toggleHit(view: DrumGridView, key: DrumKey, slot: number): void {
    const wasOff = !drums.parts[selectedIndex]?.[view][key][slot];
    drums.toggleHit(selectedIndex, view, key, slot);
    if (wasOff) {
      engine.resume();
      engine.drum(key, HIT_VELOCITY[1] / 127);
    }
  }

  function suggestSelected(): void {
    drums.suggest([selectedIndex]);
    toast.success(
      intl.formatMessage(
        {
          description: "DrumsRoute - toast after suggesting one pattern",
          defaultMessage: "New part for pattern {n}",
          id: "Brh/VB",
        },
        { n: selectedIndex + 1 }
      )
    );
  }

  function suggestAll(): void {
    drums.suggest(steps.map((_, i) => i));
    toast.success(
      intl.formatMessage({
        description: "DrumsRoute - toast after suggesting the whole flow",
        defaultMessage: "New part for the whole flow",
        id: "1V65Am",
      })
    );
  }

  function exportMidi(): void {
    try {
      const bytes = buildDrumMidi({ steps, parts: drums.parts, tempo, cycles: drums.exportCycles, mutes: drums.mutes });
      downloadFile(bytes, MIDI_FILENAME, "audio/midi");
      toast.success(
        intl.formatMessage(
          {
            description: "DrumsRoute - toast after MIDI download",
            defaultMessage: "Downloaded {filename}",
            id: "/feHpf",
          },
          { filename: MIDI_FILENAME }
        )
      );
    } catch {
      toast.danger(
        intl.formatMessage({
          description: "DrumsRoute - toast when the MIDI download fails",
          defaultMessage: "Could not create the MIDI file",
          id: "hvtgE5",
        })
      );
    }
  }

  function navigateTo(section: AppSection): void {
    void navigate({ to: section === "drums" ? "/drums" : "/" });
  }

  return {
    steps,
    selectedIndex,
    onSelect: select,
    drums,
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
      isPlaying: transport.isPlaying,
      onTogglePlay: () => {
        // Audio can only start inside a user gesture
        engine.resume();
        transport.toggle(selectedIndex);
      },
      onStop: transport.stop,
    },
    onToggleHit: toggleHit,
    onAudition: audition,
    onSuggestSelected: suggestSelected,
    onSuggestAll: suggestAll,
    onReroll: () => drums.reroll(selectedIndex),
    onExportMidi: exportMidi,
    onNavigate: navigateTo,
    onOpenSettings: () => openSettings(),
  };
}
