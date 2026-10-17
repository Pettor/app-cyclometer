import type { TransportControlsProps } from "~/components/actions/transport-controls/TransportControls";
import type { AppSection } from "~/components/navigation/app-header/AppHeader";
import type { DrumKey } from "~/core/drums/DrumKit";
import type { DrumGridView } from "~/core/drums/DrumPart";
import type { UseDrumLabResult } from "~/core/drums/UseDrumLab";
import type { FlowStep } from "~/core/flow/FlowStep";
import type { FlowPlayback } from "~/views/flow/FlowViewProps";

export interface DrumLabViewProps {
  steps: FlowStep[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  drums: UseDrumLabResult;
  playback: FlowPlayback;
  controls: TransportControlsProps;
  onToggleHit: (view: DrumGridView, key: DrumKey, slot: number) => void;
  onAudition: (key: DrumKey) => void;
  onSuggestSelected: () => void;
  onSuggestAll: () => void;
  onReroll: () => void;
  onExportMidi: () => void;
  onNavigate: (section: AppSection) => void;
  onOpenSettings: () => void;
}
