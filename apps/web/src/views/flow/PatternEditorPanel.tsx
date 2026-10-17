import type { ReactElement } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button, ToggleButton, ToggleButtonGroup } from "@heroui/react";
import type { Key } from "@heroui/react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { slotColor, withAlpha } from "~/components/display/shared/MeterColors";
import { StepperField } from "~/components/input/stepper-field/StepperField";
import { REPEAT_PRESETS } from "~/core/flow/FlowDefaults";
import {
  DENOMINATORS,
  MAX_BEATS,
  MAX_REPEATS,
  MIN_BEATS,
  MIN_REPEATS,
  formatGrouping,
  formatSignature,
  groupingsFor,
  slotGroup,
} from "~/core/flow/FlowMath";
import type { Denominator } from "~/core/flow/FlowStep";
import type { UseFlowResult } from "~/core/flow/UseFlow";

export interface PatternEditorPanelProps {
  flow: UseFlowResult;
  className?: string;
}

function firstKey(keys: Set<Key>): Key | undefined {
  return keys.values().next().value;
}

export function PatternEditorPanel({ flow, className = "flex" }: PatternEditorPanelProps): ReactElement | null {
  const intl = useIntl();
  const { steps, selectedIndex: index } = flow;
  const step = steps[index];
  if (!step) return null;

  const grouping = formatGrouping(step.groups);
  const slotLabels = {
    n: intl.formatMessage({ description: "PatternEditorPanel - slot kind note", defaultMessage: "note", id: "zt9gZ8" }),
    a: intl.formatMessage({
      description: "PatternEditorPanel - slot kind accent",
      defaultMessage: "accent",
      id: "wX7+zr",
    }),
    r: intl.formatMessage({ description: "PatternEditorPanel - slot kind rest", defaultMessage: "rest", id: "NWnx4H" }),
  };

  return (
    <section
      aria-labelledby="pattern-editor-heading"
      className={clsx(
        "lg:bg-surface min-w-0 flex-col gap-[22px] lg:max-w-[380px] lg:flex-[1_1_300px] lg:rounded-3xl lg:p-5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted text-xs font-semibold tracking-[0.14em] uppercase">
            {intl.formatMessage(
              {
                description: "PatternEditorPanel - eyebrow naming the pattern",
                defaultMessage: "Edit pattern {n}",
                id: "drFYMw",
              },
              { n: index + 1 }
            )}
          </p>
          <h2 id="pattern-editor-heading" className="text-[28px] font-extrabold tracking-tight">
            {formatSignature(step)} <span className="text-group-2 text-lg">{grouping}</span>
          </h2>
        </div>
        <div className="flex gap-0.5 lg:hidden">
          <Button
            isIconOnly
            variant="ghost"
            onPress={() => flow.select((index - 1 + steps.length) % steps.length)}
            aria-label={intl.formatMessage({
              description: "PatternEditorPanel - previous pattern",
              defaultMessage: "Previous pattern",
              id: "uDZExj",
            })}
          >
            <ChevronLeftIcon className="size-5" />
          </Button>
          <Button
            isIconOnly
            variant="ghost"
            onPress={() => flow.select((index + 1) % steps.length)}
            aria-label={intl.formatMessage({
              description: "PatternEditorPanel - next pattern",
              defaultMessage: "Next pattern",
              id: "UvAk71",
            })}
          >
            <ChevronRightIcon className="size-5" />
          </Button>
        </div>
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 text-[13px] font-semibold">
          {intl.formatMessage({
            description: "PatternEditorPanel - time signature heading",
            defaultMessage: "Time signature",
            id: "4nKzIp",
          })}
        </legend>
        <div className="flex flex-wrap items-center gap-3">
          <StepperField
            hideLabel
            label={intl.formatMessage({
              description: "PatternEditorPanel - beats field aria-label",
              defaultMessage: "Beats per bar",
              id: "TRR4nR",
            })}
            value={step.num}
            minValue={MIN_BEATS}
            maxValue={MAX_BEATS}
            onChange={(beats) => flow.setBeats(index, beats)}
          />
          <span className="flex items-center gap-3">
            <span className="text-muted text-[22px]" aria-hidden="true">
              /
            </span>
            <ToggleButtonGroup
              isDetached
              size="sm"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={new Set<Key>([String(step.den)])}
              onSelectionChange={(keys) => {
                const key = firstKey(keys);
                if (key !== undefined) flow.setDenominator(index, Number(key) as Denominator);
              }}
              aria-label={intl.formatMessage({
                description: "PatternEditorPanel - note value group aria-label",
                defaultMessage: "Note value",
                id: "TsJULV",
              })}
            >
              {DENOMINATORS.map((den) => (
                <ToggleButton key={den} id={String(den)} className="rounded-full">
                  {den}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </span>
        </div>
      </fieldset>

      <div className="flex flex-col gap-2.5">
        <h3 id="grouping-label" className="text-[13px] font-semibold">
          {intl.formatMessage({
            description: "PatternEditorPanel - grouping heading",
            defaultMessage: "Feel (grouping)",
            id: "niBAOK",
          })}
        </h3>
        <ToggleButtonGroup
          isDetached
          size="sm"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={new Set<Key>([grouping])}
          onSelectionChange={(keys) => {
            const key = firstKey(keys);
            if (key !== undefined) flow.setGrouping(index, String(key).split("+").map(Number));
          }}
          aria-labelledby="grouping-label"
          className="flex-wrap justify-start"
        >
          {groupingsFor(step.num).map((g) => (
            <ToggleButton key={g.join("+")} id={g.join("+")} className="rounded-full">
              {formatGrouping(g, " + ")}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-[13px] font-semibold">
            {intl.formatMessage({
              description: "PatternEditorPanel - slots heading",
              defaultMessage: "Slots",
              id: "mFuE/y",
            })}
          </h3>
          <span className="text-muted text-xs">
            {intl.formatMessage({
              description: "PatternEditorPanel - slots hint",
              defaultMessage: "Tap: note, accent, rest",
              id: "2s2i1G",
            })}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {step.slots.map((kind, k) => {
            const color = slotColor(step, k);
            const isGroupStart = k > 0 && slotGroup(step, k).isGroupStart;
            return (
              <Button
                key={k}
                variant="ghost"
                onPress={() => flow.cycleSlot(index, k)}
                aria-label={intl.formatMessage(
                  {
                    description: "PatternEditorPanel - slot button aria-label",
                    defaultMessage: "Slot {n}: {kind}",
                    id: "7qKfR7",
                  },
                  { n: k + 1, kind: slotLabels[kind] }
                )}
                data-testid="pattern-editor__slot"
                className={clsx(
                  "bg-background h-14 w-11 min-w-0 flex-col gap-0.5 rounded-xl border-2 p-0",
                  isGroupStart && "ml-2",
                  kind === "r" ? "border-default border-dashed" : "border-solid"
                )}
                style={
                  kind === "r"
                    ? undefined
                    : { borderColor: color, background: kind === "a" ? withAlpha(color, 25) : undefined }
                }
              >
                <span className="text-[15px] font-bold">{kind === "r" ? "R" : kind === "a" ? ">" : "•"}</span>
                <span className="text-muted text-[11px]">{k + 1}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-end gap-2.5">
          <StepperField
            prefix="×"
            label={intl.formatMessage({
              description: "PatternEditorPanel - replays heading",
              defaultMessage: "Replays",
              id: "B7Lbq4",
            })}
            value={step.repeats}
            minValue={MIN_REPEATS}
            maxValue={MAX_REPEATS}
            onChange={(repeats) => flow.setRepeats(index, repeats)}
          />
          <ToggleButtonGroup
            isDetached
            size="sm"
            selectionMode="single"
            selectedKeys={new Set<Key>(REPEAT_PRESETS.includes(step.repeats) ? [String(step.repeats)] : [])}
            onSelectionChange={(keys) => {
              const key = firstKey(keys);
              if (key !== undefined) flow.setRepeats(index, Number(key));
            }}
            aria-label={intl.formatMessage({
              description: "PatternEditorPanel - replay presets aria-label",
              defaultMessage: "Replay presets",
              id: "hoEdfb",
            })}
            className="pb-0.5"
          >
            {REPEAT_PRESETS.map((r) => (
              <ToggleButton key={r} id={String(r)} className="rounded-full">
                ×{r}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
        <p className="text-muted text-xs">
          {intl.formatMessage(
            {
              description: "PatternEditorPanel - explains replays",
              defaultMessage:
                "This pattern plays {repeats, plural, one {once} other {# times in a row}} before the flow moves on.",
              id: "nvC8d9",
            },
            { repeats: step.repeats }
          )}
        </p>
      </div>

      <div className="flex gap-2 border-t pt-4">
        <Button variant="secondary" className="rounded-full" onPress={() => flow.duplicate(index)}>
          {intl.formatMessage({
            description: "PatternEditorPanel - duplicate button",
            defaultMessage: "Duplicate",
            id: "ciAITV",
          })}
        </Button>
        <Button
          variant="danger-soft"
          className="rounded-full"
          isDisabled={steps.length < 2}
          onPress={() => flow.remove(index)}
        >
          {intl.formatMessage({
            description: "PatternEditorPanel - delete button",
            defaultMessage: "Delete",
            id: "aP8Y6/",
          })}
        </Button>
      </div>
    </section>
  );
}
