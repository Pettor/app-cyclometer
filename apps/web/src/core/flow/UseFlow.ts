import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { flowSelectedIndexAtom, flowStepsAtom } from "./FlowAtoms";
import { createStep, duplicateStep, nextSlotKind, withBeats, withRepeats } from "./FlowMath";
import type { Denominator, FlowStep, TimeSignature } from "./FlowStep";

export interface FlowActions {
  select: (index: number) => void;
  /** Inserts a new pattern right after the selected one and selects it. */
  add: (signature: TimeSignature) => void;
  move: (index: number, delta: -1 | 1) => void;
  duplicate: (index: number) => void;
  remove: (index: number) => void;
  setRepeats: (index: number, repeats: number) => void;
  setBeats: (index: number, beats: number) => void;
  setDenominator: (index: number, den: Denominator) => void;
  setGrouping: (index: number, groups: number[]) => void;
  cycleSlot: (index: number, slot: number) => void;
}

export interface UseFlowResult extends FlowActions {
  steps: FlowStep[];
  selectedIndex: number;
}

export function useFlow(): UseFlowResult {
  const [steps, setSteps] = useAtom(flowStepsAtom);
  const [selectedIndex, setSelectedIndex] = useAtom(flowSelectedIndexAtom);

  const update = useCallback(
    (index: number, fn: (step: FlowStep) => FlowStep) => {
      setSteps((prev) => prev.map((step, i) => (i === index ? fn(step) : step)));
    },
    [setSteps]
  );

  const actions = useMemo<FlowActions>(
    () => ({
      select: setSelectedIndex,
      add: (signature) => {
        const at = selectedIndex + 1;
        setSteps((prev) => [...prev.slice(0, at), createStep(signature.num, signature.den), ...prev.slice(at)]);
        setSelectedIndex(at);
      },
      move: (index, delta) => {
        const target = index + delta;
        if (target < 0 || target >= steps.length) return;
        setSteps((prev) => {
          const next = prev.slice();
          const a = next[index];
          const b = next[target];
          if (!a || !b) return prev;
          next[index] = b;
          next[target] = a;
          return next;
        });
        setSelectedIndex(target);
      },
      duplicate: (index) => {
        setSteps((prev) => {
          const source = prev[index];
          if (!source) return prev;
          return [...prev.slice(0, index + 1), duplicateStep(source), ...prev.slice(index + 1)];
        });
        setSelectedIndex(index + 1);
      },
      remove: (index) => {
        if (steps.length < 2) return;
        setSteps((prev) => prev.filter((_, i) => i !== index));
        setSelectedIndex(Math.min(index, steps.length - 2));
      },
      setRepeats: (index, repeats) => update(index, (step) => withRepeats(step, repeats)),
      setBeats: (index, beats) => update(index, (step) => withBeats(step, beats)),
      setDenominator: (index, den) => update(index, (step) => ({ ...step, den })),
      setGrouping: (index, groups) => update(index, (step) => ({ ...step, groups: groups.slice() })),
      cycleSlot: (index, slot) =>
        update(index, (step) => ({
          ...step,
          slots: step.slots.map((kind, k) => (k === slot ? nextSlotKind(kind) : kind)),
        })),
    }),
    [selectedIndex, setSelectedIndex, setSteps, steps.length, update]
  );

  return { steps, selectedIndex, ...actions };
}
