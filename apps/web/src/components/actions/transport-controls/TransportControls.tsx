import type { ReactElement } from "react";
import { PauseIcon, PlayIcon, SpeakerWaveIcon, SpeakerXMarkIcon, StopIcon } from "@heroicons/react/20/solid";
import { Button, Label, Slider, Switch, ToggleButton } from "@heroui/react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { MAX_TEMPO, MIN_TEMPO } from "~/core/flow/FlowMath";

export interface TransportControlsProps {
  tempo: number;
  onTempoChange: (tempo: number) => void;
  loop: boolean;
  onLoopChange: (loop: boolean) => void;
  /** Omit to hide the master mute button. */
  muted?: boolean;
  onMutedChange?: (muted: boolean) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
  className?: string;
}

/** Toolbar with tempo, loop, mute, stop and play/pause — the desktop transport. */
export function TransportControls({
  tempo,
  onTempoChange,
  loop,
  onLoopChange,
  muted,
  onMutedChange,
  isPlaying,
  onTogglePlay,
  onStop,
  className = "flex",
}: TransportControlsProps): ReactElement {
  const intl = useIntl();
  const muteLabel = muted
    ? intl.formatMessage({
        description: "TransportControls - unmute button aria-label",
        defaultMessage: "Unmute",
        id: "Zow1H+",
      })
    : intl.formatMessage({
        description: "TransportControls - mute button aria-label",
        defaultMessage: "Mute",
        id: "p+IbRX",
      });

  return (
    <div className={clsx("flex-wrap items-center gap-3", className)}>
      <Slider
        value={tempo}
        minValue={MIN_TEMPO}
        maxValue={MAX_TEMPO}
        step={1}
        onChange={(value) => onTempoChange(Array.isArray(value) ? (value[0] ?? tempo) : value)}
        className="bg-surface flex h-10 w-auto flex-row items-center gap-3 rounded-full px-4"
      >
        <Label className="text-muted text-sm">
          {intl.formatMessage({
            description: "TransportControls - tempo slider label",
            defaultMessage: "Tempo",
            id: "DcJ1wx",
          })}
        </Label>
        <Slider.Track className="w-28">
          <Slider.Fill />
          <Slider.Thumb />
        </Slider.Track>
        <Slider.Output className="min-w-16 font-mono text-sm tabular-nums">
          {intl.formatMessage(
            { description: "TransportControls - tempo value with unit", defaultMessage: "{tempo} BPM", id: "BD9GrY" },
            { tempo }
          )}
        </Slider.Output>
      </Slider>

      <Switch isSelected={loop} onChange={onLoopChange} className="bg-surface h-10 rounded-full px-4">
        <Switch.Content className="text-sm">
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          {intl.formatMessage({
            description: "TransportControls - loop switch label",
            defaultMessage: "Loop flow",
            id: "xgzb7C",
          })}
        </Switch.Content>
      </Switch>

      {onMutedChange && (
        <ToggleButton
          isIconOnly
          isSelected={!!muted}
          onChange={onMutedChange}
          aria-label={muteLabel}
          className="rounded-full"
        >
          {muted ? <SpeakerXMarkIcon className="size-5" /> : <SpeakerWaveIcon className="size-5" />}
        </ToggleButton>
      )}

      <Button variant="secondary" onPress={onStop} className="rounded-full">
        <StopIcon className="size-4" />
        {intl.formatMessage({ description: "TransportControls - stop button", defaultMessage: "Stop", id: "vqL3MQ" })}
      </Button>

      <Button variant="primary" onPress={onTogglePlay} className="min-w-28 rounded-full" data-testid="transport__play">
        {isPlaying ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
        {isPlaying
          ? intl.formatMessage({
              description: "TransportControls - pause button",
              defaultMessage: "Pause",
              id: "dPznfC",
            })
          : intl.formatMessage({
              description: "TransportControls - play button",
              defaultMessage: "Play",
              id: "MGjBSk",
            })}
      </Button>
    </div>
  );
}
