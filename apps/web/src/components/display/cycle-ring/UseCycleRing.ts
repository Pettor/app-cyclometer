import { useMemo } from "react";
import { useIntl } from "react-intl";
import { DOWNBEAT_COLOR, groupColor, withAlpha } from "~/components/display/shared/MeterColors";
import { slotGroup } from "~/core/flow/FlowMath";
import type { FlowStep, SlotKind } from "~/core/flow/FlowStep";

export type CycleRingStatus = "ready" | "paused" | "playing";

export interface CycleRingDot {
  slot: number;
  kind: SlotKind;
  label: string;
  /** Center of the dot as a percentage of the ring box. */
  left: number;
  top: number;
  color: string;
  isCurrent: boolean;
}

export interface CycleRingCenter {
  badge: string;
  badgeTone: "neutral" | "downbeat" | "accent";
  value: string;
  caption: string;
  captionColor?: string;
  slotLabel: string;
}

export interface UseCycleRingResult {
  gradient: string;
  dots: CycleRingDot[];
  center: CycleRingCenter;
}

/** Radius of the dot track as a percentage of the box (170px of 400px in the design). */
const DOT_RADIUS = 42.5;

export function useCycleRing(
  step: Pick<FlowStep, "num" | "groups" | "slots">,
  slot: number,
  status: CycleRingStatus
): UseCycleRingResult {
  const intl = useIntl();

  return useMemo(() => {
    const n = step.num;
    const segments: string[] = [];
    const dots: CycleRingDot[] = [];

    for (let i = 0; i < n; i++) {
      const color = groupColor(slotGroup(step, i).group);
      const from = ((i * 360) / n).toFixed(2);
      const to = (((i + 1) * 360) / n).toFixed(2);
      segments.push(`${slot >= 0 && i <= slot ? color : withAlpha(color, 20)} ${from}deg ${to}deg`);

      const angle = (i * 2 * Math.PI) / n;
      const kind = step.slots[i] ?? "n";
      dots.push({
        slot: i,
        kind,
        label: kind === "r" ? "R" : String(i + 1),
        left: 50 + DOT_RADIUS * Math.sin(angle),
        top: 50 - DOT_RADIUS * Math.cos(angle),
        color: i === 0 ? DOWNBEAT_COLOR : color,
        isCurrent: i === slot,
      });
    }

    let center: CycleRingCenter;
    if (slot >= 0) {
      const group = slotGroup(step, slot);
      const kind = step.slots[slot] ?? "n";
      let badge: string;
      let badgeTone: CycleRingCenter["badgeTone"] = "neutral";
      if (kind === "r") {
        badge = intl.formatMessage({
          description: "CycleRing - badge on a rest slot",
          defaultMessage: "Rest",
          id: "yciWij",
        });
      } else if (slot === 0) {
        badge = intl.formatMessage({
          description: "CycleRing - badge on the downbeat",
          defaultMessage: "Downbeat",
          id: "V4AhN1",
        });
        badgeTone = "downbeat";
      } else if (kind === "a") {
        badge = intl.formatMessage({
          description: "CycleRing - badge on an accented slot",
          defaultMessage: "Accent",
          id: "oJDt74",
        });
        badgeTone = "accent";
      } else {
        badge = intl.formatMessage(
          {
            description: "CycleRing - badge naming the current beat group",
            defaultMessage: "Group {group}",
            id: "oX6k56",
          },
          { group: group.group + 1 }
        );
      }
      center = {
        badge,
        badgeTone,
        value: String(group.position + 1),
        caption: intl.formatMessage(
          { description: "CycleRing - position inside the beat group", defaultMessage: "of {size}", id: "OLXlsG" },
          { size: group.size }
        ),
        captionColor: groupColor(group.group),
        slotLabel: intl.formatMessage(
          {
            description: "CycleRing - current slot out of total",
            defaultMessage: "Slot {slot} / {total}",
            id: "U38AOi",
          },
          { slot: slot + 1, total: n }
        ),
      };
    } else {
      center = {
        badge:
          status === "paused"
            ? intl.formatMessage({
                description: "CycleRing - badge while paused",
                defaultMessage: "Paused",
                id: "aqYV+7",
              })
            : intl.formatMessage({
                description: "CycleRing - badge before playback",
                defaultMessage: "Ready",
                id: "64OOSU",
              }),
        badgeTone: "neutral",
        value: String(n),
        caption: intl.formatMessage({
          description: "CycleRing - caption under the slot count",
          defaultMessage: "slots",
          id: "S2HDoX",
        }),
        slotLabel: intl.formatMessage({
          description: "CycleRing - hint before playback",
          defaultMessage: "Press play",
          id: "X0dSVQ",
        }),
      };
    }

    return { gradient: `conic-gradient(${segments.join(", ")})`, dots, center };
  }, [intl, slot, status, step]);
}
