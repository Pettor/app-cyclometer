import { DRUM_KIT, HIT_VELOCITY } from "./DrumKit";
import type { DrumKey } from "./DrumKit";
import { gridForPass } from "./DrumPart";
import type { DrumPart } from "./DrumPart";
import type { FlowStep } from "~/core/flow/FlowStep";

export interface MidiExportOptions {
  steps: FlowStep[];
  parts: DrumPart[];
  tempo: number;
  cycles: number;
  mutes: Partial<Record<DrumKey, boolean>>;
}

interface MidiEvent {
  tick: number;
  /** Sort order for events on the same tick: meta, note-off, note-on. */
  order: number;
  bytes: number[];
}

const PPQ = 480;
const DRUM_CHANNEL_NOTE_ON = 0x99;
const DRUM_CHANNEL_NOTE_OFF = 0x89;

/** Variable-length quantity encoding used for MIDI delta times. */
export function encodeVlq(value: number): number[] {
  let v = value;
  const bytes = [v & 0x7f];
  v >>= 7;
  while (v > 0) {
    bytes.unshift((v & 0x7f) | 0x80);
    v >>= 7;
  }
  return bytes;
}

/**
 * Renders the flow's drum parts as a single-track Standard MIDI File: General MIDI drums
 * on channel 10, a time signature change at every pattern and fills on last passes.
 */
export function buildDrumMidi({ steps, parts, tempo, cycles, mutes }: MidiExportOptions): Uint8Array {
  const events: MidiEvent[] = [];
  const name = Array.from(new TextEncoder().encode("Cyclometer drums"));
  const usPerQuarter = Math.round(60000000 / tempo);
  let tick = 0;

  events.push({ tick: 0, order: 0, bytes: [0xff, 0x03, ...encodeVlq(name.length), ...name] });
  events.push({
    tick: 0,
    order: 0,
    bytes: [0xff, 0x51, 0x03, (usPerQuarter >> 16) & 255, (usPerQuarter >> 8) & 255, usPerQuarter & 255],
  });

  for (let cycle = 0; cycle < cycles; cycle++) {
    steps.forEach((step, index) => {
      const part = parts[index];
      if (!part) return;
      const denPower = Math.round(Math.log2(step.den));
      const slotTicks = (PPQ * 4) / step.den;
      const gate = Math.min(slotTicks - 1, 90);
      events.push({ tick, order: 0, bytes: [0xff, 0x58, 0x04, step.num, denPower, 24, 8] });

      for (let pass = 0; pass < step.repeats; pass++) {
        const grid = gridForPass(part, step, pass);
        for (let slot = 0; slot < step.num; slot++) {
          for (const instrument of DRUM_KIT) {
            const hit = grid[instrument.key][slot] ?? 0;
            if (!hit || mutes[instrument.key] || (instrument.firstPassOnly && pass > 0)) continue;
            events.push({ tick, order: 2, bytes: [DRUM_CHANNEL_NOTE_ON, instrument.midi, HIT_VELOCITY[hit]] });
            events.push({ tick: tick + gate, order: 1, bytes: [DRUM_CHANNEL_NOTE_OFF, instrument.midi, 0] });
          }
          tick += slotTicks;
        }
      }
    });
  }

  events.sort((a, b) => a.tick - b.tick || a.order - b.order);

  const track: number[] = [];
  let last = 0;
  for (const event of events) {
    track.push(...encodeVlq(event.tick - last), ...event.bytes);
    last = event.tick;
  }
  track.push(...encodeVlq(Math.max(0, tick - last)), 0xff, 0x2f, 0x00);

  const length = track.length;
  // MThd (format 0, one track, PPQ resolution) followed by the MTrk chunk header
  // prettier-ignore
  const header = [
    0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, (PPQ >> 8) & 255, PPQ & 255,
    0x4d, 0x54, 0x72, 0x6b, (length >>> 24) & 255, (length >> 16) & 255, (length >> 8) & 255, length & 255,
  ];

  return new Uint8Array([...header, ...track]);
}
