import { describe, expect, it } from "vitest";
import { DRUM_KIT } from "./DrumKit";
import { DRUM_STYLES } from "./DrumStyle";
import { fillStart, snareSlots, suggestPart } from "./DrumSuggest";

const sevenFourThree = { num: 7, groups: [4, 3], slots: ["n", "n", "n", "n", "r", "n", "n"] as const };
const step = { ...sevenFourThree, slots: [...sevenFourThree.slots] };

describe("suggestPart", () => {
  it("returns a column per slot for every instrument in every style", () => {
    for (const style of DRUM_STYLES) {
      const { main, fill } = suggestPart(step, style, 1, false);
      for (const { key } of DRUM_KIT) {
        expect(main[key]).toHaveLength(7);
        expect(fill[key]).toHaveLength(7);
      }
    }
  });

  it("puts an accented kick and a crash on the downbeat", () => {
    const { main } = suggestPart(step, "groove", 1, false);
    expect(main.kick[0]).toBe(2);
    expect(main.crash[0]).toBe(2);
  });

  it("is deterministic for the same seed", () => {
    expect(suggestPart(step, "busy", 42, false)).toEqual(suggestPart(step, "busy", 42, false));
  });

  it("keeps kick and backbeat snare off rests when asked", () => {
    for (let seed = 0; seed < 20; seed++) {
      const { main } = suggestPart(step, "busy", seed, true);
      expect(main.kick[4]).toBe(0);
      expect([0, 3]).toContain(main.snare[4]);
    }
  });

  it("drops the crash from the fill and ends on the low tom", () => {
    const { fill } = suggestPart(step, "groove", 1, false);
    expect(fill.crash.every((hit) => hit === 0)).toBe(true);
    expect(fill.toml[6]).toBe(2);
  });

  it("plays only one voice per slot in the linear style", () => {
    const { main } = suggestPart(step, "linear", 3, false);
    for (let i = 1; i < 7; i++) {
      const voices = [main.kick[i], main.snare[i], main.hat[i]].filter(Boolean);
      expect(voices.length).toBeLessThanOrEqual(1);
    }
  });
});

describe("snareSlots and fillStart", () => {
  it("leans the snare on the second group and fills over the last one", () => {
    expect(snareSlots(step, "groove")).toEqual([4]);
    expect(fillStart(step)).toBe(4);
  });

  it("splits a single-group bar in half", () => {
    const single = { num: 5, groups: [5], slots: [] };
    expect(snareSlots(single, "groove")).toEqual([2]);
    expect(fillStart(single)).toBe(2);
  });
});
