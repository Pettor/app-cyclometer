import type { ReactElement } from "react";
import {
  ArrowPathRoundedSquareIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  StopIcon,
} from "@heroicons/react/20/solid";
import { Button, NumberField, ToggleButton } from "@heroui/react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import type { TransportControlsProps } from "./TransportControls";
import { MAX_TEMPO, MIN_TEMPO } from "~/core/flow/FlowMath";

export interface TransportProgressSegment {
  /** Relative width of the segment. */
  weight: number;
  /** Filled share of the segment, 0–100. */
  fill: number;
}

export interface CompactTransportControlsProps extends TransportControlsProps {
  progress: TransportProgressSegment[];
}

/** Bottom-of-screen transport for phones: progress bar, tempo stepper and a large play button. */
export function CompactTransportControls({
  tempo,
  onTempoChange,
  loop,
  onLoopChange,
  muted,
  onMutedChange,
  isPlaying,
  onTogglePlay,
  onStop,
  progress,
  className,
}: CompactTransportControlsProps): ReactElement {
  const intl = useIntl();

  return (
    <div className={clsx("bg-surface flex flex-col gap-3 border-t px-4 pt-3 pb-6", className)}>
      <div className="bg-default flex h-1.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
        {progress.map((segment, i) => (
          <span key={i} className="bg-default relative" style={{ flex: `${segment.weight} 1 0` }}>
            <span className="bg-accent absolute inset-y-0 left-0" style={{ width: `${segment.fill}%` }} />
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <NumberField
          value={tempo}
          minValue={MIN_TEMPO}
          maxValue={MAX_TEMPO}
          step={1}
          onChange={(value) => {
            if (!Number.isNaN(value)) onTempoChange(value);
          }}
          aria-label={intl.formatMessage({
            description: "CompactTransportControls - tempo field aria-label",
            defaultMessage: "Tempo in BPM",
            id: "RcMUFQ",
          })}
          className="w-32"
        >
          <NumberField.Group className="rounded-full">
            <NumberField.DecrementButton />
            <NumberField.Input className="text-center font-mono tabular-nums" />
            <NumberField.IncrementButton />
          </NumberField.Group>
        </NumberField>

        <Button
          isIconOnly
          variant="primary"
          onPress={onTogglePlay}
          className="mx-auto size-16 rounded-full"
          aria-label={
            isPlaying
              ? intl.formatMessage({
                  description: "CompactTransportControls - pause aria-label",
                  defaultMessage: "Pause",
                  id: "+C2AsZ",
                })
              : intl.formatMessage({
                  description: "CompactTransportControls - play aria-label",
                  defaultMessage: "Play",
                  id: "J6Spv1",
                })
          }
        >
          {isPlaying ? <PauseIcon className="size-6" /> : <PlayIcon className="size-6" />}
        </Button>

        <Button
          isIconOnly
          variant="secondary"
          onPress={onStop}
          className="rounded-full"
          aria-label={intl.formatMessage({
            description: "CompactTransportControls - stop aria-label",
            defaultMessage: "Stop and reset",
            id: "5eTNQJ",
          })}
        >
          <StopIcon className="size-4" />
        </Button>

        <ToggleButton
          isIconOnly
          isSelected={loop}
          onChange={onLoopChange}
          className="rounded-full"
          aria-label={intl.formatMessage({
            description: "CompactTransportControls - loop toggle aria-label",
            defaultMessage: "Loop flow",
            id: "HZwIsq",
          })}
        >
          <ArrowPathRoundedSquareIcon className="size-5" />
        </ToggleButton>

        {onMutedChange && (
          <ToggleButton
            isIconOnly
            isSelected={!!muted}
            onChange={onMutedChange}
            className="rounded-full"
            aria-label={intl.formatMessage({
              description: "CompactTransportControls - mute toggle aria-label",
              defaultMessage: "Mute",
              id: "BXdw4i",
            })}
          >
            {muted ? <SpeakerXMarkIcon className="size-5" /> : <SpeakerWaveIcon className="size-5" />}
          </ToggleButton>
        )}
      </div>
    </div>
  );
}
