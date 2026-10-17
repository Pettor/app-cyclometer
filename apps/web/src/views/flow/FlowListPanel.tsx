import type { ReactElement } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Button, Chip } from "@heroui/react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { FlowStepCard } from "./FlowStepCard";
import { FLOW_PRESETS } from "~/core/flow/FlowDefaults";
import { formatDuration, formatSignature } from "~/core/flow/FlowMath";
import type { CycleStats } from "~/core/flow/FlowMath";
import type { UseFlowResult } from "~/core/flow/UseFlow";
import type { TransportPosition } from "~/core/transport/TransportPosition";

export interface FlowListPanelProps {
  flow: UseFlowResult;
  playingIndex: number;
  position: TransportPosition;
  stats: CycleStats;
  onSelect: (index: number) => void;
  className?: string;
}

export function FlowListPanel({
  flow,
  playingIndex,
  position,
  stats,
  onSelect,
  className = "flex",
}: FlowListPanelProps): ReactElement {
  const intl = useIntl();
  const { steps, selectedIndex } = flow;

  return (
    <section
      aria-labelledby="flow-list-heading"
      className={clsx("min-w-0 flex-col gap-3 lg:max-w-[380px] lg:flex-[1_1_300px]", className)}
    >
      <div className="flex items-baseline justify-between px-1 pt-1">
        <h2 id="flow-list-heading" className="text-[15px] font-semibold">
          {intl.formatMessage({ description: "FlowListPanel - heading", defaultMessage: "Flow", id: "l7ue8C" })}
        </h2>
        <span className="text-muted text-xs">
          {intl.formatMessage({
            description: "FlowListPanel - explains playback order",
            defaultMessage: "Plays top to bottom, then cycles",
            id: "r+LhFA",
          })}
        </span>
      </div>
      <div className="flex gap-1.5 lg:hidden">
        <Chip size="sm" variant="secondary">
          {intl.formatMessage(
            { description: "FlowListPanel - bars per cycle chip", defaultMessage: "{bars} bars", id: "AfBaVg" },
            { bars: stats.bars }
          )}
        </Chip>
        <Chip size="sm" variant="secondary">
          {intl.formatMessage(
            { description: "FlowListPanel - cycle length chip", defaultMessage: "{time} per cycle", id: "6/drXM" },
            { time: formatDuration(stats.seconds) }
          )}
        </Chip>
      </div>
      <ol className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <FlowStepCard
            key={step.id}
            step={step}
            index={i}
            isSelected={i === selectedIndex}
            playingPass={i === playingIndex ? position.pass : undefined}
            activeSlot={position.slot}
            canMoveUp={i > 0}
            canMoveDown={i < steps.length - 1}
            canDelete={steps.length > 1}
            onSelect={() => onSelect(i)}
            onRepeatsChange={(repeats) => flow.setRepeats(i, repeats)}
            onMoveUp={() => flow.move(i, -1)}
            onMoveDown={() => flow.move(i, 1)}
            onDuplicate={() => flow.duplicate(i)}
            onDelete={() => flow.remove(i)}
          />
        ))}
      </ol>
      <div className="border-default flex flex-col gap-2.5 rounded-[20px] border-[1.5px] border-dashed p-3.5">
        <h3 className="text-sm font-semibold">
          {intl.formatMessage({
            description: "FlowListPanel - add pattern heading",
            defaultMessage: "Add a pattern after the selected one",
            id: "WPrnTb",
          })}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {FLOW_PRESETS.map((preset) => {
            const label = formatSignature(preset);
            return (
              <Button
                key={label}
                size="sm"
                variant="outline"
                className="rounded-full"
                onPress={() => flow.add(preset)}
                aria-label={intl.formatMessage(
                  {
                    description: "FlowListPanel - add preset aria-label",
                    defaultMessage: "Add {signature}",
                    id: "DsXwSG",
                  },
                  { signature: label }
                )}
              >
                <PlusIcon className="size-3.5" />
                {label}
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
