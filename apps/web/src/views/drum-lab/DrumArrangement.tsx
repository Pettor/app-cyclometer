import type { ReactElement } from "react";
import { Button } from "@heroui/react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import type { DrumPart } from "~/core/drums/DrumPart";
import { hasFill } from "~/core/drums/DrumPart";
import { formatSignature, stepWeight } from "~/core/flow/FlowMath";
import type { FlowStep } from "~/core/flow/FlowStep";
import type { FlowPlayback } from "~/views/flow/FlowViewProps";

export interface DrumArrangementProps {
  steps: FlowStep[];
  parts: DrumPart[];
  selectedIndex: number;
  playingIndex: number;
  playback: FlowPlayback;
  onSelect: (index: number) => void;
}

const FILL_STRIPES = "repeating-linear-gradient(135deg, var(--color-group-2) 0 6px, transparent 6px 12px)";

/** The whole cycle at a glance: one block per pass, striped where the fill plays. */
export function DrumArrangement({
  steps,
  parts,
  selectedIndex,
  playingIndex,
  playback,
  onSelect,
}: DrumArrangementProps): ReactElement {
  const intl = useIntl();

  return (
    <div className="bg-surface flex flex-col gap-2.5 rounded-[20px] p-4">
      <div className="flex justify-between gap-2 text-[13px]">
        <h3 className="font-semibold">
          {intl.formatMessage({
            description: "DrumArrangement - heading",
            defaultMessage: "Arrangement",
            id: "Xut+Nx",
          })}
        </h3>
        <span className="text-muted text-right">
          {intl.formatMessage({
            description: "DrumArrangement - legend",
            defaultMessage: "Each block is one pass. Striped = fill.",
            id: "dgEDya",
          })}
        </span>
      </div>
      <div className="flex h-12 gap-1.5 overflow-x-auto">
        {steps.map((step, i) => {
          const part = parts[i];
          const fill = !!part && hasFill(part, step);
          return (
            <Button
              key={step.id}
              variant="ghost"
              onPress={() => onSelect(i)}
              aria-label={intl.formatMessage(
                {
                  description: "DrumArrangement - block aria-label",
                  defaultMessage: "Pattern {n}: {signature}",
                  id: "E5y6qG",
                },
                { n: i + 1, signature: formatSignature(step) }
              )}
              className={clsx(
                "h-full min-w-10 gap-0.5 overflow-hidden rounded-xl border-2 p-0",
                i === selectedIndex ? "border-accent" : "border-transparent"
              )}
              style={{ flex: `${stepWeight(step)} 1 0` }}
            >
              {Array.from({ length: step.repeats }, (_, p) => {
                const isCurrent = i === playingIndex && p === playback.position.pass;
                const isFillPass = fill && p === step.repeats - 1;
                return (
                  <span
                    key={p}
                    className={clsx(
                      "flex h-full flex-1 items-center justify-center text-[11px] font-bold",
                      isCurrent ? "bg-accent text-accent-foreground" : "bg-default"
                    )}
                    style={!isCurrent && isFillPass ? { backgroundImage: FILL_STRIPES } : undefined}
                  >
                    {p === 0 ? formatSignature(step) : ""}
                  </span>
                );
              })}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
