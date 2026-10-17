import type { ReactElement } from "react";
import { Button } from "@heroui/react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import type { DrumPart } from "~/core/drums/DrumPart";
import { hasFill } from "~/core/drums/DrumPart";
import { formatDuration, formatGrouping, formatSignature } from "~/core/flow/FlowMath";
import type { FlowStep } from "~/core/flow/FlowStep";
import type { FlowPlayback } from "~/views/flow/FlowViewProps";

export interface DrumLabFlowPanelProps {
  steps: FlowStep[];
  parts: DrumPart[];
  selectedIndex: number;
  playingIndex: number;
  playback: FlowPlayback;
  cycleSeconds: number;
  onSelect: (index: number) => void;
}

export function DrumLabFlowPanel({
  steps,
  parts,
  selectedIndex,
  playingIndex,
  playback,
  cycleSeconds,
  onSelect,
}: DrumLabFlowPanelProps): ReactElement {
  const intl = useIntl();

  return (
    <section
      aria-labelledby="drum-flow-heading"
      className="flex min-w-0 flex-col gap-2.5 lg:max-w-[320px] lg:flex-[1_1_260px]"
    >
      <div className="flex items-baseline justify-between px-1 pt-1">
        <h2 id="drum-flow-heading" className="text-[15px] font-semibold">
          {intl.formatMessage({
            description: "DrumLabFlowPanel - heading",
            defaultMessage: "Time signature flow",
            id: "Hb9Yv0",
          })}
        </h2>
        <span className="text-muted text-xs">
          {intl.formatMessage(
            { description: "DrumLabFlowPanel - cycle length", defaultMessage: "{time} per cycle", id: "oIukne" },
            { time: formatDuration(cycleSeconds) }
          )}
        </span>
      </div>
      <ol className="flex gap-2.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {steps.map((step, i) => {
          const part = parts[i];
          const fill = !!part && hasFill(part, step);
          const isActive = i === playingIndex;
          return (
            <li key={step.id} className="shrink-0 lg:shrink">
              <Button
                variant="ghost"
                fullWidth
                onPress={() => onSelect(i)}
                aria-current={i === selectedIndex ? "true" : undefined}
                className={clsx(
                  "bg-surface h-auto min-w-56 flex-col items-stretch gap-2 rounded-[18px] border-2 px-3.5 py-3 text-left",
                  i === selectedIndex ? "border-accent" : isActive ? "border-default" : "border-transparent"
                )}
              >
                <span className="flex w-full items-center gap-2.5">
                  <span className="bg-default text-default-foreground inline-flex size-6 items-center justify-center rounded-full text-xs">
                    {i + 1}
                  </span>
                  <span className="text-xl font-extrabold">{formatSignature(step)}</span>
                  <span className="text-group-2 text-[13px] font-semibold">{formatGrouping(step.groups)}</span>
                  <span className="text-muted ml-auto text-[13px]">×{step.repeats}</span>
                </span>
                <span className="flex gap-[3px] pl-[34px]" aria-hidden="true">
                  {Array.from({ length: step.repeats }, (_, p) => {
                    const isFillPass = fill && p === step.repeats - 1;
                    const done = isActive
                      ? p < playback.position.pass || (p === playback.position.pass && playback.position.slot >= 0)
                      : playback.isStarted && i < playingIndex;
                    return (
                      <span
                        key={p}
                        className={clsx(
                          "h-2 flex-1 rounded",
                          done ? "bg-accent" : isFillPass ? "bg-group-2/60" : "bg-default"
                        )}
                      />
                    );
                  })}
                </span>
                <span className={clsx("pl-[34px] text-xs font-normal", isActive ? "text-success" : "text-muted")}>
                  {isActive
                    ? intl.formatMessage(
                        {
                          description: "DrumLabFlowPanel - playing pass status",
                          defaultMessage: "Playing pass {pass} / {total}",
                          id: "2GXEM7",
                        },
                        { pass: playback.position.pass + 1, total: step.repeats }
                      )
                    : fill
                      ? intl.formatMessage(
                          {
                            description: "DrumLabFlowPanel - fill pass status",
                            defaultMessage: "Fill on pass {pass}",
                            id: "ZVl869",
                          },
                          { pass: step.repeats }
                        )
                      : intl.formatMessage({
                          description: "DrumLabFlowPanel - no fill status",
                          defaultMessage: "No fill",
                          id: "1M6tE1",
                        })}
                </span>
              </Button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
