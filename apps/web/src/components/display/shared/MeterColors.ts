import { slotGroup } from "~/core/flow/FlowMath";
import type { FlowStep } from "~/core/flow/FlowStep";

export const DOWNBEAT_COLOR = "var(--color-downbeat)";

const GROUP_COLORS = ["var(--color-group-1)", "var(--color-group-2)", "var(--color-group-3)", "var(--color-group-4)"];

/** Color for beat group `index`, cycling through four hues. */
export function groupColor(index: number): string {
  return GROUP_COLORS[index % GROUP_COLORS.length] ?? GROUP_COLORS[0]!;
}

/** Slot 1 is always the downbeat; every other slot takes its group's color. */
export function slotColor(step: Pick<FlowStep, "groups">, slot: number): string {
  return slot === 0 ? DOWNBEAT_COLOR : groupColor(slotGroup(step, slot).group);
}

/** Mixes `color` with transparency, e.g. `withAlpha(groupColor(0), 40)`. */
export function withAlpha(color: string, percent: number): string {
  return `color-mix(in oklab, ${color} ${percent}%, transparent)`;
}
