import type { ReactElement } from "react";
import { ChevronDownIcon, ChevronUpIcon, DocumentDuplicateIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { SlotStrip } from "~/components/display/slot-strip/SlotStrip";
import { StepperField } from "~/components/input/stepper-field/StepperField";
import { MAX_REPEATS, MIN_REPEATS, formatGrouping, formatSignature } from "~/core/flow/FlowMath";
import type { FlowStep } from "~/core/flow/FlowStep";

export interface FlowStepCardProps {
  step: FlowStep;
  index: number;
  isSelected: boolean;
  /** Pass currently playing in this pattern, or undefined when the playhead is elsewhere. */
  playingPass?: number;
  activeSlot: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onRepeatsChange: (repeats: number) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function FlowStepCard({
  step,
  index,
  isSelected,
  playingPass,
  activeSlot,
  canMoveUp,
  canMoveDown,
  canDelete,
  onSelect,
  onRepeatsChange,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: FlowStepCardProps): ReactElement {
  const intl = useIntl();
  const isPlaying = playingPass !== undefined;
  const signature = formatSignature(step);

  return (
    <li
      data-testid="flow-step-card"
      data-selected={isSelected || undefined}
      className={clsx(
        "bg-surface flex flex-col gap-2.5 rounded-[20px] border-2 p-3.5 transition-colors",
        isSelected ? "border-accent" : isPlaying ? "border-default" : "border-transparent"
      )}
    >
      <Button
        variant="ghost"
        fullWidth
        onPress={onSelect}
        aria-current={isSelected ? "true" : undefined}
        className="h-auto justify-start gap-3 rounded-lg px-0 py-0 text-left hover:bg-transparent"
      >
        <span className="bg-default text-default-foreground inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs">
          {index + 1}
        </span>
        <span className="text-[22px] font-extrabold tracking-tight">{signature}</span>
        <span className="text-group-2 text-sm font-semibold">{formatGrouping(step.groups)}</span>
        {isPlaying && (
          <span className="text-success ml-auto text-xs font-semibold">
            {intl.formatMessage(
              {
                description: "FlowStepCard - playing pass indicator",
                defaultMessage: "Pass {pass} / {total}",
                id: "As1Ysp",
              },
              { pass: playingPass + 1, total: step.repeats }
            )}
          </span>
        )}
      </Button>
      <SlotStrip step={step} activeSlot={isPlaying ? activeSlot : -1} className="pl-10" />
      <div className="flex items-center gap-1 pl-10">
        <StepperField
          hideLabel
          size="sm"
          prefix="×"
          label={intl.formatMessage(
            {
              description: "FlowStepCard - replays field aria-label",
              defaultMessage: "Replays for pattern {n}",
              id: "C6PJ60",
            },
            { n: index + 1 }
          )}
          value={step.repeats}
          minValue={MIN_REPEATS}
          maxValue={MAX_REPEATS}
          onChange={onRepeatsChange}
        />
        <div className="ml-auto flex">
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            className="size-7 min-w-7"
            isDisabled={!canMoveUp}
            onPress={onMoveUp}
            aria-label={intl.formatMessage({
              description: "FlowStepCard - move up aria-label",
              defaultMessage: "Move up",
              id: "el3TZU",
            })}
          >
            <ChevronUpIcon className="size-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            className="size-7 min-w-7"
            isDisabled={!canMoveDown}
            onPress={onMoveDown}
            aria-label={intl.formatMessage({
              description: "FlowStepCard - move down aria-label",
              defaultMessage: "Move down",
              id: "zd0CSC",
            })}
          >
            <ChevronDownIcon className="size-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            className="size-7 min-w-7"
            onPress={onDuplicate}
            aria-label={intl.formatMessage({
              description: "FlowStepCard - duplicate aria-label",
              defaultMessage: "Duplicate",
              id: "w7xIPk",
            })}
          >
            <DocumentDuplicateIcon className="size-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            className="size-7 min-w-7"
            isDisabled={!canDelete}
            onPress={onDelete}
            aria-label={intl.formatMessage({
              description: "FlowStepCard - delete aria-label",
              defaultMessage: "Delete",
              id: "k3hF6n",
            })}
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
      </div>
    </li>
  );
}
