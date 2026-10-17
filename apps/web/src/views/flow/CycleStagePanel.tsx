import { Fragment } from "react";
import type { ReactElement } from "react";
import { Button } from "@heroui/react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import type { FlowPlayback } from "./FlowViewProps";
import { CycleRing } from "~/components/display/cycle-ring/CycleRing";
import { groupColor } from "~/components/display/shared/MeterColors";
import { formatGrouping, formatSignature } from "~/core/flow/FlowMath";
import type { FlowStep } from "~/core/flow/FlowStep";

export interface CycleStagePanelProps {
  steps: FlowStep[];
  activeIndex: number;
  activeSlot: number;
  playback: FlowPlayback;
  onSelectUpNext: (index: number) => void;
  className?: string;
}

export function CycleStagePanel({
  steps,
  activeIndex,
  activeSlot,
  playback,
  onSelectUpNext,
  className,
}: CycleStagePanelProps): ReactElement | null {
  const intl = useIntl();
  const step = steps[activeIndex];
  if (!step) return null;

  const upNext = [1, 2].filter((k) => k < steps.length).map((k) => (activeIndex + k) % steps.length);

  return (
    <div
      className={clsx("lg:bg-surface/50 flex flex-col items-center gap-2 rounded-[28px] lg:border lg:p-6", className)}
    >
      <div className="text-muted hidden items-start justify-between self-stretch text-[13px] lg:flex">
        <span className="font-semibold tracking-[0.16em] uppercase">
          {intl.formatMessage(
            {
              description: "CycleStagePanel - current pattern out of total",
              defaultMessage: "Pattern {n} / {total}",
              id: "yVKCx7",
            },
            { n: activeIndex + 1, total: steps.length }
          )}
        </span>
        <span className="flex flex-col gap-1 text-right">
          <span className="text-foreground font-semibold uppercase">
            {playback.isStarted
              ? intl.formatMessage(
                  {
                    description: "CycleStagePanel - current pass",
                    defaultMessage: "Pass {pass} / {total}",
                    id: "4jiLth",
                  },
                  { pass: playback.position.pass + 1, total: step.repeats }
                )
              : intl.formatMessage(
                  {
                    description: "CycleStagePanel - number of passes before playback",
                    defaultMessage: "×{total} passes",
                    id: "dC8iJJ",
                  },
                  { total: step.repeats }
                )}
          </span>
          <span>
            {intl.formatMessage(
              { description: "CycleStagePanel - cycle counter", defaultMessage: "Cycle {cycle}", id: "Z0DhGn" },
              { cycle: playback.cycles + 1 }
            )}
          </span>
        </span>
      </div>

      <div
        className="text-[64px] leading-none font-extrabold tracking-[-0.04em] lg:text-[88px]"
        data-testid="cycle-stage__signature"
      >
        {formatSignature(step)}
      </div>
      <div
        className="flex items-center gap-2.5 text-3xl font-extrabold lg:text-[40px]"
        aria-label={intl.formatMessage(
          { description: "CycleStagePanel - grouping aria-label", defaultMessage: "Grouping {grouping}", id: "Anffri" },
          { grouping: formatGrouping(step.groups, " + ") }
        )}
        role="img"
      >
        {step.groups.map((g, k) => (
          <Fragment key={k}>
            {k > 0 && <span className="text-muted">+</span>}
            <span style={{ color: groupColor(k) }}>{g}</span>
          </Fragment>
        ))}
      </div>

      <CycleRing
        step={step}
        slot={activeSlot}
        status={playback.isPlaying ? "playing" : playback.isStarted ? "paused" : "ready"}
        className="mt-2 max-w-[300px] lg:max-w-[400px]"
      />

      <p className="text-muted hidden text-center text-sm lg:block">
        {intl.formatMessage(
          {
            description: "CycleStagePanel - legend explaining the click sounds",
            defaultMessage: "Deep kick on 1, accent ping on <b>{accent}</b>, light click on the rest. <b>R</b> = rest.",
            id: "4ntBDL",
          },
          { accent: ">", b: (chunks) => <b className="text-foreground">{chunks}</b> }
        )}
      </p>

      <div className="mt-4 flex flex-col gap-2 self-stretch lg:hidden">
        <h2 className="text-muted text-xs font-semibold tracking-[0.14em] uppercase">
          {intl.formatMessage({
            description: "CycleStagePanel - up next heading",
            defaultMessage: "Up next",
            id: "orpn+Y",
          })}
        </h2>
        {upNext.map((index) => {
          const next = steps[index];
          if (!next) return null;
          return (
            <Button
              key={`${next.id}-${index}`}
              variant="secondary"
              fullWidth
              onPress={() => onSelectUpNext(index)}
              className="text-foreground h-auto min-h-12 justify-start gap-3 rounded-2xl px-3.5 py-3"
            >
              <span className="text-lg font-extrabold">{formatSignature(next)}</span>
              <span className="text-group-2 text-sm font-semibold">{formatGrouping(next.groups)}</span>
              <span className="text-muted ml-auto text-[13px]">×{next.repeats}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
