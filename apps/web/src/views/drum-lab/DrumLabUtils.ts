import type { IntlShape } from "react-intl";
import { DOWNBEAT_COLOR, groupColor } from "~/components/display/shared/MeterColors";
import type { DrumKey } from "~/core/drums/DrumKit";
import type { DrumPart } from "~/core/drums/DrumPart";
import type { DrumStyle } from "~/core/drums/DrumStyle";
import { fillStart } from "~/core/drums/DrumSuggest";
import { groupStarts } from "~/core/flow/FlowMath";
import type { FlowStep } from "~/core/flow/FlowStep";

export const DRUM_COLORS: Record<DrumKey, string> = {
  crash: DOWNBEAT_COLOR,
  ride: groupColor(3),
  ohat: groupColor(2),
  hat: groupColor(0),
  snare: groupColor(1),
  tomh: "var(--color-drum-tom-high)",
  toml: "var(--color-drum-tom-low)",
  kick: "var(--color-drum-kick)",
};

export function drumName(intl: IntlShape, key: DrumKey): string {
  switch (key) {
    case "crash":
      return intl.formatMessage({ description: "DrumLab - crash cymbal name", defaultMessage: "Crash", id: "X3EiPd" });
    case "ride":
      return intl.formatMessage({ description: "DrumLab - ride cymbal name", defaultMessage: "Ride", id: "B10wVG" });
    case "ohat":
      return intl.formatMessage({
        description: "DrumLab - open hi-hat name",
        defaultMessage: "Open hat",
        id: "awzTdg",
      });
    case "hat":
      return intl.formatMessage({
        description: "DrumLab - closed hi-hat name",
        defaultMessage: "Hi-hat",
        id: "E4GUPm",
      });
    case "snare":
      return intl.formatMessage({ description: "DrumLab - snare drum name", defaultMessage: "Snare", id: "Xl85zy" });
    case "tomh":
      return intl.formatMessage({ description: "DrumLab - high tom name", defaultMessage: "High tom", id: "An7PYD" });
    case "toml":
      return intl.formatMessage({ description: "DrumLab - low tom name", defaultMessage: "Low tom", id: "5FU08f" });
    case "kick":
      return intl.formatMessage({ description: "DrumLab - kick drum name", defaultMessage: "Kick", id: "WZgp7i" });
  }
}

export function drumStyleLabel(intl: IntlShape, style: DrumStyle): string {
  switch (style) {
    case "groove":
      return intl.formatMessage({ description: "DrumLab - groove style name", defaultMessage: "Groove", id: "WtHmjQ" });
    case "prog":
      return intl.formatMessage({ description: "DrumLab - prog style name", defaultMessage: "Prog", id: "7rnhwh" });
    case "half":
      return intl.formatMessage({
        description: "DrumLab - half-time style name",
        defaultMessage: "Half-time",
        id: "GyFZej",
      });
    case "linear":
      return intl.formatMessage({ description: "DrumLab - linear style name", defaultMessage: "Linear", id: "e3fEqf" });
    case "busy":
      return intl.formatMessage({ description: "DrumLab - busy style name", defaultMessage: "Busy", id: "/QXSeb" });
    case "sparse":
      return intl.formatMessage({ description: "DrumLab - sparse style name", defaultMessage: "Sparse", id: "QbnweX" });
  }
}

export function drumStyleHint(intl: IntlShape, style: DrumStyle): string {
  switch (style) {
    case "groove":
      return intl.formatMessage({
        description: "DrumLab - groove style hint",
        defaultMessage: "Backbeat feel with a few pickup kicks, ghost notes and an open hat into the last group.",
        id: "2uKQJg",
      });
    case "prog":
      return intl.formatMessage({
        description: "DrumLab - prog style hint",
        defaultMessage: "Ride on every slot with the bell on group starts. Kick and snare spell the grouping.",
        id: "zcsJTq",
      });
    case "half":
      return intl.formatMessage({
        description: "DrumLab - half-time style hint",
        defaultMessage: "One heavy snare in the middle of the bar. Lots of space.",
        id: "X86lfp",
      });
    case "linear":
      return intl.formatMessage({
        description: "DrumLab - linear style hint",
        defaultMessage: "Only one voice per slot: kick, snare or hat. Great for odd groupings.",
        id: "phcXVV",
      });
    case "busy":
      return intl.formatMessage({
        description: "DrumLab - busy style hint",
        defaultMessage: "More kicks and ghost notes on top of the groove.",
        id: "c+vxLY",
      });
    case "sparse":
      return intl.formatMessage({
        description: "DrumLab - sparse style hint",
        defaultMessage: "Kick, snare and a hat on each group start. Nothing else.",
        id: "F0wDC+",
      });
  }
}

export interface GrooveFacts {
  kickSlots: number[];
  snareSlots: number[];
  groupStartSlots: number[];
  fillFrom: number;
}

/** 1-based slot numbers describing why the main groove fits the grouping. */
export function grooveFacts(step: FlowStep, part: DrumPart): GrooveFacts {
  function toSlots(hits: number[], keep: (hit: number) => boolean): number[] {
    return hits.flatMap((hit, i) => (keep(hit) ? [i + 1] : []));
  }
  return {
    kickSlots: toSlots(part.main.kick, (hit) => hit > 0),
    snareSlots: toSlots(part.main.snare, (hit) => hit === 1 || hit === 2),
    groupStartSlots: groupStarts(step.groups).map((s) => s + 1),
    fillFrom: fillStart(step) + 1,
  };
}
