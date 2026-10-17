import type { ReactElement } from "react";
import { Label, NumberField } from "@heroui/react";
import clsx from "clsx";

export interface StepperFieldProps {
  label: string;
  /** Hide the label visually; it is still used as the accessible name. */
  hideLabel?: boolean;
  value: number;
  minValue: number;
  maxValue: number;
  onChange: (value: number) => void;
  /** Short text shown before the number, e.g. "×". */
  prefix?: string;
  size?: "sm" | "md";
  className?: string;
}

/** Number input with − and + buttons, for small integer settings like replays or beats per bar. */
export function StepperField({
  label,
  hideLabel,
  value,
  minValue,
  maxValue,
  onChange,
  prefix,
  size = "md",
  className,
}: StepperFieldProps): ReactElement {
  return (
    <NumberField
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      step={1}
      onChange={(next) => {
        if (!Number.isNaN(next)) onChange(next);
      }}
      aria-label={hideLabel ? label : undefined}
      className={clsx("flex w-fit flex-col gap-2", className)}
    >
      {!hideLabel && <Label className="text-sm font-semibold">{label}</Label>}
      <NumberField.Group
        className={clsx("w-fit rounded-full", size === "sm" && "h-8 [&_button]:w-7 [&_button]:min-w-7")}
      >
        <NumberField.DecrementButton />
        <span className="flex items-center">
          {prefix && (
            <span aria-hidden="true" className="text-muted pl-1 text-sm font-semibold">
              {prefix}
            </span>
          )}
          <NumberField.Input
            className={clsx("text-center font-semibold tabular-nums", size === "sm" ? "w-8 text-sm" : "w-10 text-base")}
          />
        </span>
        <NumberField.IncrementButton />
      </NumberField.Group>
    </NumberField>
  );
}
