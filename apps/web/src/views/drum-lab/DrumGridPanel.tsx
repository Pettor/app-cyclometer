import type { ReactElement } from "react";
import { Button, Switch, ToggleButton, ToggleButtonGroup } from "@heroui/react";
import type { Key } from "@heroui/react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { DRUM_COLORS, drumName } from "./DrumLabUtils";
import { slotColor, withAlpha } from "~/components/display/shared/MeterColors";
import { DRUM_KIT } from "~/core/drums/DrumKit";
import type { DrumHit, DrumKey } from "~/core/drums/DrumKit";
import type { DrumGrid, DrumGridView, DrumPart } from "~/core/drums/DrumPart";
import { formatGrouping, formatSignature, slotGroup } from "~/core/flow/FlowMath";
import type { FlowStep } from "~/core/flow/FlowStep";

export interface DrumGridPanelProps {
  index: number;
  step: FlowStep;
  part: DrumPart;
  grid: DrumGrid;
  view: DrumGridView;
  stepHasFill: boolean;
  gridSlot: number;
  mutes: Partial<Record<DrumKey, boolean>>;
  onViewChange: (view: DrumGridView) => void;
  onUseFillChange: (useFill: boolean) => void;
  onToggleHit: (key: DrumKey, slot: number) => void;
  onToggleMute: (key: DrumKey) => void;
  onAudition: (key: DrumKey) => void;
}

function cellBackground(hit: DrumHit, color: string, group: number): string {
  if (hit === 0) return group % 2 ? "var(--surface-secondary)" : "var(--surface-tertiary)";
  if (hit === 2) return color;
  return withAlpha(color, hit === 1 ? 66 : 25);
}

export function DrumGridPanel({
  index,
  step,
  part,
  grid,
  view,
  stepHasFill,
  gridSlot,
  mutes,
  onViewChange,
  onUseFillChange,
  onToggleHit,
  onToggleMute,
  onAudition,
}: DrumGridPanelProps): ReactElement {
  const intl = useIntl();
  const hitNames: Record<DrumHit, string> = {
    0: intl.formatMessage({ description: "DrumGridPanel - cell state off", defaultMessage: "off", id: "w7EzfU" }),
    1: intl.formatMessage({ description: "DrumGridPanel - cell state hit", defaultMessage: "hit", id: "4GL8HT" }),
    2: intl.formatMessage({ description: "DrumGridPanel - cell state accent", defaultMessage: "accent", id: "FqyerV" }),
    3: intl.formatMessage({ description: "DrumGridPanel - cell state ghost", defaultMessage: "ghost", id: "ekerNs" }),
  };

  return (
    <div className="lg:bg-surface/50 flex flex-col gap-4 rounded-3xl lg:border lg:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="text-muted text-xs font-semibold tracking-[0.14em] uppercase">
            {stepHasFill
              ? intl.formatMessage(
                  {
                    description: "DrumGridPanel - eyebrow with pattern, replays and edited grid",
                    defaultMessage:
                      "Pattern {n} · ×{repeats} · editing {view, select, fill {fill (pass {repeats})} other {main}}",
                    id: "1IzQlb",
                  },
                  { n: index + 1, repeats: step.repeats, view }
                )
              : intl.formatMessage(
                  {
                    description: "DrumGridPanel - eyebrow with pattern and replays",
                    defaultMessage: "Pattern {n} · ×{repeats}",
                    id: "XeXnX0",
                  },
                  { n: index + 1, repeats: step.repeats }
                )}
          </p>
          <h2 className="text-[30px] font-extrabold tracking-tight">
            {formatSignature(step)} <span className="text-group-2 text-xl">{formatGrouping(step.groups)}</span>
          </h2>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          {stepHasFill && (
            <ToggleButtonGroup
              size="sm"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={new Set<Key>([view])}
              onSelectionChange={(keys) => {
                const key = keys.values().next().value;
                if (key) onViewChange(key as DrumGridView);
              }}
              aria-label={intl.formatMessage({
                description: "DrumGridPanel - grid switcher aria-label",
                defaultMessage: "Grid",
                id: "NYI1Ji",
              })}
            >
              <ToggleButton id="main">
                {intl.formatMessage({
                  description: "DrumGridPanel - main groove tab",
                  defaultMessage: "Main groove",
                  id: "k4ytPh",
                })}
              </ToggleButton>
              <ToggleButton id="fill">
                {intl.formatMessage({ description: "DrumGridPanel - fill tab", defaultMessage: "Fill", id: "3q36tQ" })}
              </ToggleButton>
            </ToggleButtonGroup>
          )}
          <Switch isSelected={part.useFill} onChange={onUseFillChange} className="bg-surface h-10 rounded-full px-4">
            <Switch.Content className="text-sm">
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              {intl.formatMessage({
                description: "DrumGridPanel - fill switch label",
                defaultMessage: "Fill on last pass",
                id: "oN+teG",
              })}
            </Switch.Content>
          </Switch>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-max flex-col gap-1.5">
          <div className="flex items-end gap-1" aria-hidden="true">
            <div className="text-muted w-[164px] flex-none text-xs">
              {intl.formatMessage({
                description: "DrumGridPanel - header row caption",
                defaultMessage: "Feel from the flow",
                id: "/wG95X",
              })}
            </div>
            {step.slots.map((kind, slot) => {
              const color = slotColor(step, slot);
              const isNow = slot === gridSlot;
              return (
                <div
                  key={slot}
                  className={clsx(
                    "flex w-10 flex-col items-center gap-1",
                    slot > 0 && slotGroup(step, slot).isGroupStart && "ml-2.5"
                  )}
                >
                  <span className={clsx("text-xs font-bold", kind === "r" ? "text-muted" : "text-foreground")}>
                    {kind === "r" ? "R" : kind === "a" ? ">" : " "}
                  </span>
                  <span
                    className="flex h-[26px] w-10 items-center justify-center rounded-lg text-[13px] font-bold"
                    style={
                      isNow
                        ? { background: "var(--foreground)", color: "var(--background)" }
                        : { background: withAlpha(color, 20), color }
                    }
                  >
                    {slot + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {DRUM_KIT.map(({ key }) => {
            const name = drumName(intl, key);
            const color = DRUM_COLORS[key];
            const isMuted = !!mutes[key];
            return (
              <div
                key={key}
                role="group"
                aria-label={name}
                className={clsx("flex items-center gap-1", isMuted && "opacity-45")}
              >
                <div className="flex w-[164px] flex-none items-center gap-1.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    onPress={() => onAudition(key)}
                    aria-label={intl.formatMessage(
                      {
                        description: "DrumGridPanel - audition button aria-label",
                        defaultMessage: "Play {name}",
                        id: "Sl8KXu",
                      },
                      { name }
                    )}
                    className="text-foreground h-9 flex-1 justify-start gap-2 rounded-[10px] px-2.5"
                  >
                    <span className="size-2.5 flex-none rounded-full" style={{ background: color }} />
                    <span className="flex flex-col items-start gap-0.5 text-[13px] font-semibold">
                      {name}
                      {key === "crash" && (
                        <span className="text-muted text-[10px] font-medium">
                          {intl.formatMessage({
                            description: "DrumGridPanel - crash note",
                            defaultMessage: "1st pass only",
                            id: "lzF4vU",
                          })}
                        </span>
                      )}
                    </span>
                  </Button>
                  <ToggleButton
                    size="sm"
                    isSelected={isMuted}
                    onChange={() => onToggleMute(key)}
                    aria-label={intl.formatMessage(
                      {
                        description: "DrumGridPanel - mute instrument aria-label",
                        defaultMessage: "Mute {name}",
                        id: "XA5p1c",
                      },
                      { name }
                    )}
                    className="data-[selected=true]:bg-danger data-[selected=true]:text-danger-foreground h-9 w-8 min-w-0 rounded-[10px] px-0"
                  >
                    M
                  </ToggleButton>
                </div>
                {grid[key].map((hit, slot) => {
                  const isNow = slot === gridSlot;
                  const group = slotGroup(step, slot);
                  return (
                    <Button
                      key={slot}
                      variant="ghost"
                      onPress={() => onToggleHit(key, slot)}
                      aria-label={intl.formatMessage(
                        {
                          description: "DrumGridPanel - cell aria-label",
                          defaultMessage: "{name} slot {n}: {state}",
                          id: "4UwoSv",
                        },
                        { name, n: slot + 1, state: hitNames[hit] }
                      )}
                      data-testid="drum-grid__cell"
                      className={clsx(
                        "h-9 w-10 min-w-0 rounded-[9px] border-2 p-0 text-xs font-bold hover:brightness-125",
                        slot > 0 && group.isGroupStart && "ml-2.5",
                        hit === 2 ? "text-black" : "text-foreground"
                      )}
                      style={{
                        background: cellBackground(hit, color, group.group),
                        borderColor: isNow ? "var(--foreground)" : hit === 0 ? "var(--border)" : color,
                        boxShadow: isNow && hit ? `0 0 14px ${color}` : undefined,
                      }}
                    >
                      {hit === 2 ? ">" : hit === 3 ? "·" : ""}
                    </Button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-muted flex flex-wrap gap-4 text-xs">
        <span>
          {intl.formatMessage(
            {
              description: "DrumGridPanel - legend for cell clicks",
              defaultMessage: "Click a cell: <b>hit</b> → <b>accent {accent}</b> → <b>ghost {ghost}</b> → off",
              id: "j7q5gu",
            },
            { accent: ">", ghost: "·", b: (chunks) => <b className="text-foreground">{chunks}</b> }
          )}
        </span>
        <span>
          {intl.formatMessage({
            description: "DrumGridPanel - legend for auditioning",
            defaultMessage: "Click an instrument name to hear it",
            id: "6mBtER",
          })}
        </span>
        <span>
          {intl.formatMessage({
            description: "DrumGridPanel - legend for header row",
            defaultMessage: "Top row: R = rest, > = accent in the flow",
            id: "HpbYgj",
          })}
        </span>
      </div>
    </div>
  );
}
