import type { ReactElement } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { slotColor, withAlpha } from "~/components/display/shared/MeterColors";
import { slotGroup } from "~/core/flow/FlowMath";
import type { FlowStep } from "~/core/flow/FlowStep";

export interface SlotStripProps {
  step: Pick<FlowStep, "num" | "groups" | "slots">;
  /** Slot to highlight as currently sounding. */
  activeSlot?: number;
  size?: "sm" | "md";
  className?: string;
}

/** Compact row of squares showing a bar's slots: filled = accent, tinted = note, dashed = rest. */
export function SlotStrip({ step, activeSlot = -1, size = "md", className }: SlotStripProps): ReactElement {
  const intl = useIntl();
  const accents = step.slots.filter((kind) => kind === "a").length;
  const rests = step.slots.filter((kind) => kind === "r").length;

  return (
    <div
      role="img"
      aria-label={intl.formatMessage(
        {
          description: "SlotStrip - aria-label summarising the slots in a bar",
          defaultMessage: "{slots} slots, {accents} accented, {rests} rests",
          id: "P3u6oO",
        },
        { slots: step.num, accents, rests }
      )}
      className={clsx("flex items-center gap-[3px]", className)}
    >
      {step.slots.map((kind, slot) => {
        const color = slotColor(step, slot);
        const isActive = slot === activeSlot;
        const isGroupStart = slot > 0 && slotGroup(step, slot).isGroupStart;
        return (
          <span
            key={slot}
            data-active={isActive || undefined}
            className={clsx(
              "box-border rounded-[4px] border-[1.5px]",
              size === "md" ? "size-3.5" : "size-3",
              isGroupStart && (size === "md" ? "ml-1.5" : "ml-1"),
              kind === "r" ? "border-muted border-dashed" : "border-solid",
              isActive && "!border-foreground !bg-foreground"
            )}
            style={
              kind === "r" ? undefined : { borderColor: color, background: kind === "a" ? color : withAlpha(color, 40) }
            }
          />
        );
      })}
    </div>
  );
}
