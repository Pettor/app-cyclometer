import { describe, expect, it } from "vitest";
import {
  createStep,
  cycleStats,
  defaultSlots,
  formatDuration,
  groupingsFor,
  nextSlotKind,
  slotDurationMs,
  slotGroup,
  withBeats,
  withRepeats,
} from "./FlowMath";

describe("groupingsFor", () => {
  it("splits 7 into two groups first", () => {
    const groupings = groupingsFor(7);
    expect(groupings[0]).toEqual([4, 3]);
    expect(groupings).toContainEqual([3, 4]);
    expect(groupings).toContainEqual([2, 2, 3]);
  });

  it("only uses groups of 2, 3 and 4 that add up to n", () => {
    for (const g of groupingsFor(11)) {
      expect(g.reduce((a, b) => a + b, 0)).toBe(11);
      expect(g.every((p) => p >= 2 && p <= 4)).toBe(true);
    }
  });

  it("caps the number of groupings", () => {
    expect(groupingsFor(13).length).toBeLessThanOrEqual(8);
  });
});

describe("slotGroup", () => {
  it("locates a slot inside its group", () => {
    const step = { groups: [3, 2, 2] };
    expect(slotGroup(step, 0)).toEqual({ group: 0, position: 0, size: 3, isGroupStart: true });
    expect(slotGroup(step, 2)).toEqual({ group: 0, position: 2, size: 3, isGroupStart: false });
    expect(slotGroup(step, 3)).toEqual({ group: 1, position: 0, size: 2, isGroupStart: true });
    expect(slotGroup(step, 6)).toEqual({ group: 2, position: 1, size: 2, isGroupStart: false });
  });
});

describe("defaultSlots", () => {
  it("accents every group start after the downbeat", () => {
    expect(defaultSlots(7, [3, 2, 2])).toEqual(["n", "n", "n", "a", "n", "a", "n"]);
  });
});

describe("withBeats", () => {
  it("keeps existing slots, pads with notes and resets the grouping", () => {
    const step = createStep(5, 8, { groups: [3, 2], slots: ["a", "r", "n", "a", "n"] });
    const grown = withBeats(step, 7);
    expect(grown.slots).toEqual(["a", "r", "n", "a", "n", "n", "n"]);
    expect(grown.groups.reduce((a, b) => a + b, 0)).toBe(7);
  });

  it("clamps to the allowed range", () => {
    const step = createStep(5, 8);
    expect(withBeats(step, 1).num).toBe(2);
    expect(withBeats(step, 40).num).toBe(17);
  });
});

describe("withRepeats", () => {
  it("clamps replays between 1 and 32", () => {
    const step = createStep(5, 8);
    expect(withRepeats(step, 0).repeats).toBe(1);
    expect(withRepeats(step, 99).repeats).toBe(32);
  });
});

describe("nextSlotKind", () => {
  it("cycles note, accent, rest", () => {
    expect(nextSlotKind("n")).toBe("a");
    expect(nextSlotKind("a")).toBe("r");
    expect(nextSlotKind("r")).toBe("n");
  });
});

describe("timing", () => {
  it("computes slot duration from tempo and denominator", () => {
    expect(slotDurationMs(60, 4)).toBe(1000);
    expect(slotDurationMs(120, 8)).toBe(250);
  });

  it("totals bars and seconds for a cycle", () => {
    const steps = [createStep(4, 4, { repeats: 2 }), createStep(7, 8, { repeats: 1 })];
    const stats = cycleStats(steps, 60);
    expect(stats.patterns).toBe(2);
    expect(stats.bars).toBe(3);
    expect(stats.seconds).toBeCloseTo(8 + 3.5);
  });

  it("formats durations as m:ss", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(119.6)).toBe("2:00");
  });
});
