import type { TransportControlsProps } from "~/components/actions/transport-controls/TransportControls";
import type { AppSection } from "~/components/navigation/app-header/AppHeader";
import type { UseFlowResult } from "~/core/flow/UseFlow";
import type { TransportPosition } from "~/core/transport/TransportPosition";

export interface FlowPlayback {
  isPlaying: boolean;
  isStarted: boolean;
  position: TransportPosition;
  cycles: number;
}

export interface FlowViewProps {
  flow: UseFlowResult;
  playback: FlowPlayback;
  controls: TransportControlsProps;
  onNavigate: (section: AppSection) => void;
  onOpenSettings: () => void;
}
