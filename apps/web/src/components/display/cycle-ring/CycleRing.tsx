import type { CSSProperties, ReactElement } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { useCycleRing } from "./UseCycleRing";
import type { CycleRingStatus } from "./UseCycleRing";
import { withAlpha } from "~/components/display/shared/MeterColors";
import type { FlowStep } from "~/core/flow/FlowStep";

export interface CycleRingProps {
  step: Pick<FlowStep, "num" | "groups" | "slots">;
  /** Slot currently sounding, or -1 when nothing is playing. */
  slot: number;
  status: CycleRingStatus;
  className?: string;
}

const RING_MASK = "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))";

/**
 * A bar drawn as a clock face: one dot per slot, the downbeat at 12 o'clock and arcs colored
 * by beat group. Scales with its container width.
 */
export function CycleRing({ step, slot, status, className }: CycleRingProps): ReactElement {
  const intl = useIntl();
  const { gradient, dots, center } = useCycleRing(step, slot, status);

  return (
    <div
      role="group"
      aria-label={intl.formatMessage({
        description: "CycleRing - aria-label for the ring",
        defaultMessage: "Cycle",
        id: "C5sBLY",
      })}
      className={clsx("@container relative aspect-square w-full max-w-[400px]", className)}
    >
      <div
        className="absolute inset-[7.5%] rounded-full"
        style={{ background: gradient, mask: RING_MASK, WebkitMask: RING_MASK }}
      />
      <div className="absolute inset-1/4 flex flex-col items-center justify-center gap-[1.5cqw] text-center">
        <span
          data-testid="cycle-ring__badge"
          className={clsx(
            "rounded-full px-[3.5cqw] py-[1.5cqw] text-[3.25cqw] font-bold tracking-[0.08em] uppercase",
            center.badgeTone === "neutral" && "bg-default text-default-foreground",
            center.badgeTone === "downbeat" && "bg-downbeat text-black",
            center.badgeTone === "accent" && "bg-foreground text-background"
          )}
        >
          {center.badge}
        </span>
        <span className="text-[20cqw] leading-none font-extrabold tabular-nums">{center.value}</span>
        <span
          className={clsx("text-[4cqw] font-semibold", !center.captionColor && "text-muted")}
          style={center.captionColor ? { color: center.captionColor } : undefined}
        >
          {center.caption}
        </span>
        <span className="text-muted mt-[1cqw] font-mono text-[3cqw] uppercase">{center.slotLabel}</span>
      </div>
      {dots.map((dot) => {
        const style: CSSProperties = {
          left: `${dot.left}%`,
          top: `${dot.top}%`,
          borderColor: dot.kind === "r" ? undefined : dot.color,
          background: dot.isCurrent
            ? dot.kind === "r"
              ? "var(--default)"
              : dot.color
            : dot.kind === "a"
              ? withAlpha(dot.color, 19)
              : undefined,
          boxShadow: dot.isCurrent
            ? `0 0 0 1.25cqw ${withAlpha(dot.color, 25)}, 0 0 7cqw ${withAlpha(dot.color, 56)}`
            : undefined,
        };
        return (
          <div
            key={dot.slot}
            aria-hidden="true"
            data-current={dot.isCurrent || undefined}
            className={clsx(
              "absolute flex size-[12%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-[4.25cqw] font-bold",
              "bg-surface-secondary transition-[background,box-shadow] duration-75",
              dot.kind === "r" ? "border-default text-muted border-dashed" : "border-solid",
              dot.isCurrent && dot.kind !== "r" && "text-black"
            )}
            style={style}
          >
            {dot.label}
            {dot.kind === "a" && (
              <span className="bg-foreground text-background absolute -top-[2cqw] -right-[2cqw] flex size-[5cqw] items-center justify-center rounded-full text-[3cqw] font-extrabold">
                &gt;
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
