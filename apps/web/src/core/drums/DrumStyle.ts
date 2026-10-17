import { z } from "zod";

export const DrumStyleSchema = z.enum(["groove", "prog", "half", "linear", "busy", "sparse"]);

/** Groove styles the suggester can build. */
export type DrumStyle = z.infer<typeof DrumStyleSchema>;

export const DRUM_STYLES: DrumStyle[] = DrumStyleSchema.options;
