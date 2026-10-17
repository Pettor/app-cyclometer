import type { ReactElement } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Button, Switch, ToggleButton, ToggleButtonGroup } from "@heroui/react";
import type { Key } from "@heroui/react";
import { useIntl } from "react-intl";
import { DRUM_COLORS, drumStyleHint, drumStyleLabel, grooveFacts } from "./DrumLabUtils";
import type { DrumPart } from "~/core/drums/DrumPart";
import { hasFill } from "~/core/drums/DrumPart";
import { DRUM_STYLES } from "~/core/drums/DrumStyle";
import type { DrumStyle } from "~/core/drums/DrumStyle";
import { formatGrouping, formatSignature } from "~/core/flow/FlowMath";
import type { FlowStep } from "~/core/flow/FlowStep";

const EXPORT_CYCLE_OPTIONS = [1, 2, 4];

export interface DrumSuggestPanelProps {
  index: number;
  step: FlowStep;
  part: DrumPart;
  style: DrumStyle;
  onStyleChange: (style: DrumStyle) => void;
  keepRestsSilent: boolean;
  onKeepRestsSilentChange: (value: boolean) => void;
  exportCycles: number;
  onExportCyclesChange: (cycles: number) => void;
  onSuggestSelected: () => void;
  onSuggestAll: () => void;
  onReroll: () => void;
  onExportMidi: () => void;
}

export function DrumSuggestPanel({
  index,
  step,
  part,
  style,
  onStyleChange,
  keepRestsSilent,
  onKeepRestsSilentChange,
  exportCycles,
  onExportCyclesChange,
  onSuggestSelected,
  onSuggestAll,
  onReroll,
  onExportMidi,
}: DrumSuggestPanelProps): ReactElement {
  const intl = useIntl();
  const facts = grooveFacts(step, part);
  function list(slots: number[]): string {
    return intl.formatList(slots.map(String), { type: "conjunction" });
  }

  const why = [
    {
      color: DRUM_COLORS.kick,
      text: intl.formatMessage(
        {
          description: "DrumSuggestPanel - why: kick placement",
          defaultMessage:
            "Kick on slot {kicks}. Slot 1 anchors the bar and the other kicks mark where groups begin ({starts}).",
          id: "NqNyd1",
        },
        { kicks: list(facts.kickSlots), starts: list(facts.groupStartSlots) }
      ),
    },
    {
      color: DRUM_COLORS.snare,
      text: facts.snareSlots.length
        ? intl.formatMessage(
            {
              description: "DrumSuggestPanel - why: snare placement",
              defaultMessage:
                "Snare on slot {snares}, where the {grouping} grouping leans, so the odd bar still has a backbeat.",
              id: "hm2D+7",
            },
            { snares: list(facts.snareSlots), grouping: formatGrouping(step.groups) }
          )
        : intl.formatMessage({
            description: "DrumSuggestPanel - why: no snare",
            defaultMessage: "No backbeat snare yet. Suggest again or add one on a group start.",
            id: "SU2U9d",
          }),
    },
    {
      color: DRUM_COLORS.hat,
      text: intl.formatMessage(
        {
          description: "DrumSuggestPanel - why: cymbal pulse",
          defaultMessage:
            "Cymbals ride the {den}th-note pulse, accented on group starts so you hear the {grouping} shape.",
          id: "vutzBs",
        },
        { den: step.den, grouping: formatGrouping(step.groups, " + ") }
      ),
    },
    {
      color: DRUM_COLORS.crash,
      text: intl.formatMessage({
        description: "DrumSuggestPanel - why: crash",
        defaultMessage: "Crash on slot 1 marks the change into this pattern (first pass only).",
        id: "C3RUAA",
      }),
    },
    {
      color: DRUM_COLORS.toml,
      text: hasFill(part, step)
        ? intl.formatMessage(
            {
              description: "DrumSuggestPanel - why: fill",
              defaultMessage:
                "Fill on pass {pass}: slots {from} to {to} roll snare into toms and lead into the next pattern.",
              id: "I7TURx",
            },
            { pass: step.repeats, from: facts.fillFrom, to: step.num }
          )
        : intl.formatMessage({
            description: "DrumSuggestPanel - why: no fill",
            defaultMessage: "No fill: this pattern plays once, or the fill is switched off.",
            id: "nsBbQB",
          }),
    },
  ];

  return (
    <section
      aria-labelledby="drum-suggest-heading"
      className="bg-surface flex min-w-0 flex-col gap-5 rounded-3xl p-5 lg:max-w-[340px] lg:flex-[1_1_280px]"
    >
      <div>
        <h2 id="drum-suggest-heading" className="text-[17px] font-bold">
          {intl.formatMessage({
            description: "DrumSuggestPanel - heading",
            defaultMessage: "Suggest a groove",
            id: "4SCD42",
          })}
        </h2>
        <p className="text-muted mt-1.5 text-[13px] leading-normal">
          {intl.formatMessage({
            description: "DrumSuggestPanel - intro",
            defaultMessage:
              "Builds a part from the grouping: kick on the downbeat, snare where the bar leans, hats on the pulse, a crash on every new pattern and a fill into the next one.",
            id: "R2nKUa",
          })}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <h3 id="drum-style-label" className="text-[13px] font-semibold">
          {intl.formatMessage({
            description: "DrumSuggestPanel - style heading",
            defaultMessage: "Style",
            id: "eVNT96",
          })}
        </h3>
        <ToggleButtonGroup
          isDetached
          size="sm"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={new Set<Key>([style])}
          onSelectionChange={(keys) => {
            const key = keys.values().next().value;
            if (key) onStyleChange(key as DrumStyle);
          }}
          aria-labelledby="drum-style-label"
          className="flex-wrap justify-start"
        >
          {DRUM_STYLES.map((s) => (
            <ToggleButton key={s} id={s} className="rounded-full">
              {drumStyleLabel(intl, s)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <p className="text-muted text-xs">{drumStyleHint(intl, style)}</p>
      </div>

      <Switch isSelected={keepRestsSilent} onChange={onKeepRestsSilentChange}>
        <Switch.Content className="text-sm">
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          {intl.formatMessage({
            description: "DrumSuggestPanel - keep rests silent switch",
            defaultMessage: "Keep the flow's rests silent",
            id: "dmwQ6S",
          })}
        </Switch.Content>
      </Switch>

      <div className="flex flex-col gap-2">
        <Button variant="primary" className="rounded-full" onPress={onSuggestSelected}>
          {intl.formatMessage(
            {
              description: "DrumSuggestPanel - suggest selected pattern button",
              defaultMessage: "Suggest pattern {n}",
              id: "tD4rFt",
            },
            { n: index + 1 }
          )}
        </Button>
        <Button variant="secondary" className="rounded-full" onPress={onSuggestAll}>
          {intl.formatMessage({
            description: "DrumSuggestPanel - suggest whole flow button",
            defaultMessage: "Suggest whole flow",
            id: "enBkuz",
          })}
        </Button>
        <Button variant="outline" className="rounded-full" onPress={onReroll}>
          {intl.formatMessage({
            description: "DrumSuggestPanel - reroll button",
            defaultMessage: "Try another variation",
            id: "2pM3dT",
          })}
        </Button>
      </div>

      <div className="flex flex-col gap-2 border-t pt-4">
        <h3 className="text-[13px] font-semibold">
          {intl.formatMessage(
            {
              description: "DrumSuggestPanel - why heading",
              defaultMessage: "Why it fits {signature} {grouping}",
              id: "vyHIzX",
            },
            { signature: formatSignature(step), grouping: formatGrouping(step.groups) }
          )}
        </h3>
        <ul className="flex flex-col gap-2">
          {why.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-[13px] leading-snug">
              <span
                aria-hidden="true"
                className="mt-1.5 size-2 flex-none rounded-full"
                style={{ background: item.color }}
              />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-muted flex flex-col gap-2 border-t pt-4 text-xs leading-normal">
        <h3 className="text-foreground text-[13px] font-semibold">
          {intl.formatMessage({
            description: "DrumSuggestPanel - MIDI heading",
            defaultMessage: "MIDI export",
            id: "3749K8",
          })}
        </h3>
        <p>
          {intl.formatMessage({
            description: "DrumSuggestPanel - MIDI description",
            defaultMessage:
              "General MIDI drums on channel 10, with a time signature change at every pattern and fills on last passes.",
            id: "x7sXur",
          })}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span id="export-cycles-label">
            {intl.formatMessage({
              description: "DrumSuggestPanel - export cycles label",
              defaultMessage: "Cycles:",
              id: "mxVILB",
            })}
          </span>
          <ToggleButtonGroup
            isDetached
            size="sm"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={new Set<Key>([String(exportCycles)])}
            onSelectionChange={(keys) => {
              const key = keys.values().next().value;
              if (key) onExportCyclesChange(Number(key));
            }}
            aria-labelledby="export-cycles-label"
          >
            {EXPORT_CYCLE_OPTIONS.map((c) => (
              <ToggleButton key={c} id={String(c)} className="rounded-full">
                {c}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
        <Button
          variant="outline"
          className="mt-1 rounded-full"
          onPress={onExportMidi}
          data-testid="drum-suggest__export"
        >
          <ArrowDownTrayIcon className="size-4" />
          {intl.formatMessage({
            description: "DrumSuggestPanel - export MIDI button",
            defaultMessage: "Export MIDI",
            id: "Y2H2n9",
          })}
        </Button>
      </div>
    </section>
  );
}
