import { describe, expect, it } from "vitest";
import { IDLE_POSITION, advancePosition, stepProgress } from "./TransportPosition";
import { createStep } from "~/core/flow/FlowMath";

const steps = [createStep(3, 8, { groups: [3], repeats: 2 }), createStep(2, 4, { groups: [2], repeats: 1 })];

describe("advancePosition", () => {
  it("starts on the first slot", () => {
    expect(advancePosition(steps, IDLE_POSITION).position).toEqual({ step: 0, pass: 0, slot: 0 });
  });

  it("replays a pattern before moving on", () => {
    expect(advancePosition(steps, { step: 0, pass: 0, slot: 2 }).position).toEqual({ step: 0, pass: 1, slot: 0 });
    expect(advancePosition(steps, { step: 0, pass: 1, slot: 2 }).position).toEqual({ step: 1, pass: 0, slot: 0 });
  });

  it("wraps to the start and reports a completed cycle", () => {
    const result = advancePosition(steps, { step: 1, pass: 0, slot: 1 });
    expect(result.position).toEqual({ step: 0, pass: 0, slot: 0 });
    expect(result.completedCycle).toBe(true);
  });

  it("recovers when the flow shrank under the playhead", () => {
    expect(advancePosition(steps, { step: 5, pass: 0, slot: 3 }).position).toEqual({ step: 0, pass: 0, slot: 0 });
  });
});

describe("stepProgress", () => {
  it("is empty when stopped", () => {
    expect(stepProgress(steps, 0, { step: 0, pass: 1, slot: 1 }, false)).toBe(0);
  });

  it("fills finished patterns and measures the current one", () => {
    const position = { step: 1, pass: 0, slot: 0 };
    expect(stepProgress(steps, 0, position, true)).toBe(100);
    expect(stepProgress(steps, 1, position, true)).toBe(50);
  });
});
