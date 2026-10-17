import { describe, expect, it } from "vitest";
import { suggestPart } from "./DrumSuggest";
import { buildDrumMidi, encodeVlq } from "./MidiExport";
import { createStep } from "~/core/flow/FlowMath";

function ascii(bytes: Uint8Array, from: number): string {
  return String.fromCharCode(...bytes.slice(from, from + 4));
}

describe("encodeVlq", () => {
  it("encodes MIDI variable-length quantities", () => {
    expect(encodeVlq(0)).toEqual([0x00]);
    expect(encodeVlq(0x7f)).toEqual([0x7f]);
    expect(encodeVlq(0x80)).toEqual([0x81, 0x00]);
    expect(encodeVlq(0x3fff)).toEqual([0xff, 0x7f]);
  });
});

describe("buildDrumMidi", () => {
  const steps = [createStep(7, 16, { groups: [4, 3], repeats: 2 }), createStep(5, 8, { groups: [3, 2], repeats: 1 })];
  const parts = steps.map((step) => ({ ...suggestPart(step, "groove", 7, true), useFill: true }));

  it("writes a single-track standard MIDI file", () => {
    const bytes = buildDrumMidi({ steps, parts, tempo: 92, cycles: 1, mutes: {} });
    expect(ascii(bytes, 0)).toBe("MThd");
    expect(ascii(bytes, 14)).toBe("MTrk");
    const length = (bytes[18]! << 24) | (bytes[19]! << 16) | (bytes[20]! << 8) | bytes[21]!;
    expect(bytes.length).toBe(22 + length);
    expect(Array.from(bytes.slice(-3))).toEqual([0xff, 0x2f, 0x00]);
  });

  it("emits a time signature change per pattern", () => {
    const bytes = Array.from(buildDrumMidi({ steps, parts, tempo: 92, cycles: 1, mutes: {} }));
    const signatures: number[][] = [];
    for (let i = 0; i < bytes.length - 4; i++) {
      if (bytes[i] === 0xff && bytes[i + 1] === 0x58) signatures.push(bytes.slice(i + 3, i + 5));
    }
    expect(signatures).toEqual([
      [7, 4],
      [5, 3],
    ]);
  });

  it("grows with more cycles and shrinks when instruments are muted", () => {
    const one = buildDrumMidi({ steps, parts, tempo: 92, cycles: 1, mutes: {} });
    const two = buildDrumMidi({ steps, parts, tempo: 92, cycles: 2, mutes: {} });
    const muted = buildDrumMidi({ steps, parts, tempo: 92, cycles: 1, mutes: { hat: true, kick: true } });
    expect(two.length).toBeGreaterThan(one.length);
    expect(muted.length).toBeLessThan(one.length);
  });
});
