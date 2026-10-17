import type { ReactElement } from "react";
import { Button } from "@heroui/react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import type { TransportProgressSegment } from "~/components/actions/transport-controls/CompactTransportControls";
import { formatSignature } from "~/core/flow/FlowMath";
import type { FlowStep } from "~/core/flow/FlowStep";

export interface CycleTimelineProps {
  steps: FlowStep[];
  progress: TransportProgressSegment[];
  selectedIndex: number;
  playingIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

/** One block per pattern, sized by how long it plays, filling as the playhead moves through. */
export function CycleTimeline({
  steps,
  progress,
  selectedIndex,
  playingIndex,
  onSelect,
  className = "flex",
}: CycleTimelineProps): ReactElement {
  const intl = useIntl();

  return (
    <div className={clsx("bg-surface flex-col gap-2.5 rounded-[20px] p-4", className)}>
      <div className="flex justify-between gap-2 text-[13px]">
        <h2 className="font-semibold">
          {intl.formatMessage({
            description: "CycleTimeline - heading",
            defaultMessage: "Cycle timeline",
            id: "Ty/nfK",
          })}
        </h2>
        <span className="text-muted text-right">
          {intl.formatMessage({
            description: "CycleTimeline - explains block widths",
            defaultMessage: "Width = time spent in each pattern",
            id: "bKlnli",
          })}
        </span>
      </div>
      <div className="flex h-[52px] gap-1">
        {steps.map((step, i) => {
          const segment = progress[i];
          return (
            <Button
              key={step.id}
              variant="secondary"
              onPress={() => onSelect(i)}
              aria-label={intl.formatMessage(
                {
                  description: "CycleTimeline - block aria-label",
                  defaultMessage: "Pattern {n}: {signature}, {repeats} replays",
                  id: "sVaWwr",
                },
                { n: i + 1, signature: formatSignature(step), repeats: step.repeats }
              )}
              className={clsx(
                "text-foreground relative h-full min-w-0 overflow-hidden rounded-xl border-2 p-0",
                i === selectedIndex ? "border-accent" : "border-transparent"
              )}
              style={{ flex: `${segment?.weight ?? 1} 1 0` }}
            >
              <span
                aria-hidden="true"
                className={clsx("absolute inset-y-0 left-0", i === playingIndex ? "bg-accent" : "bg-accent/40")}
                style={{ width: `${segment?.fill ?? 0}%` }}
              />
              <span className="relative flex flex-col items-start gap-0.5 px-2.5 whitespace-nowrap">
                <span className="text-sm font-bold">{formatSignature(step)}</span>
                <span className="text-[11px] opacity-80">×{step.repeats}</span>
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
