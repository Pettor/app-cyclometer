import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { IDLE_POSITION, advancePosition } from "./TransportPosition";
import type { TransportPosition } from "./TransportPosition";
import { slotDurationMs } from "~/core/flow/FlowMath";
import type { FlowStep } from "~/core/flow/FlowStep";

export interface TransportTick {
  step: FlowStep;
  position: TransportPosition;
}

export interface UseTransportOptions {
  steps: FlowStep[];
  tempo: number;
  loop: boolean;
  /** Called on every slot while playing — trigger sounds here. */
  onSlot: (tick: TransportTick) => void;
}

export interface UseTransportResult {
  isPlaying: boolean;
  /** True from the first play until stop; stays true while paused. */
  isStarted: boolean;
  position: TransportPosition;
  /** Completed passes through the whole flow. */
  cycles: number;
  /** Plays or pauses. A fresh start begins at `startIndex`. */
  toggle: (startIndex: number) => void;
  stop: () => void;
}

interface TransportState {
  isPlaying: boolean;
  isStarted: boolean;
  position: TransportPosition;
  cycles: number;
}

const IDLE_STATE: TransportState = { isPlaying: false, isStarted: false, position: IDLE_POSITION, cycles: 0 };

/**
 * Steps through the flow slot by slot. Timing uses a drift-corrected timeout chain,
 * so each slot is scheduled against an absolute target time rather than the previous tick.
 */
export function useTransport({ steps, tempo, loop, onSlot }: UseTransportOptions): UseTransportResult {
  const [state, setState] = useState<TransportState>(IDLE_STATE);
  // The scheduler reads and writes the playhead synchronously between renders
  const positionRef = useRef<TransportPosition>(IDLE_POSITION);
  const cyclesRef = useRef(0);

  const stop = useCallback(() => {
    positionRef.current = IDLE_POSITION;
    cyclesRef.current = 0;
    setState(IDLE_STATE);
  }, []);

  const toggle = useCallback(
    (startIndex: number) => {
      if (state.isPlaying) {
        setState((prev) => ({ ...prev, isPlaying: false }));
        return;
      }
      if (!state.isStarted) {
        positionRef.current = { step: startIndex, pass: 0, slot: -1 };
        cyclesRef.current = 0;
        setState({ isPlaying: true, isStarted: true, position: positionRef.current, cycles: 0 });
        return;
      }
      setState((prev) => ({ ...prev, isPlaying: true }));
    },
    [state.isPlaying, state.isStarted]
  );

  /** Advances one slot and returns the time until the next one, or null when playback ended. */
  const onTick = useEffectEvent((): number | null => {
    const { position, completedCycle } = advancePosition(steps, positionRef.current);
    if (completedCycle) {
      cyclesRef.current++;
      if (!loop) {
        stop();
        return null;
      }
    }

    const step = steps[position.step];
    if (!step) return null;

    positionRef.current = position;
    setState((prev) => ({ ...prev, position, cycles: cyclesRef.current }));
    onSlot({ step, position });
    return slotDurationMs(tempo, step.den);
  });

  useEffect(() => {
    if (!state.isPlaying) return;

    let timer = 0;
    let nextAt = performance.now();

    function run(): void {
      const duration = onTick();
      if (duration === null) return;
      nextAt += duration;
      timer = window.setTimeout(run, Math.max(0, nextAt - performance.now()));
    }

    run();
    return () => window.clearTimeout(timer);
  }, [state.isPlaying]);

  return { ...state, toggle, stop };
}
