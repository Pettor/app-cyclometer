import { z } from "zod";

/** `n` = normal note, `a` = accent, `r` = rest. */
export const SlotKindSchema = z.enum(["n", "a", "r"]);
export type SlotKind = z.infer<typeof SlotKindSchema>;

export const DenominatorSchema = z.union([z.literal(4), z.literal(8), z.literal(16)]);
export type Denominator = z.infer<typeof DenominatorSchema>;

export const FlowStepSchema = z.object({
  id: z.string(),
  num: z.number().int().min(2).max(17),
  den: DenominatorSchema,
  groups: z.array(z.number().int().positive()).min(1),
  repeats: z.number().int().min(1).max(32),
  slots: z.array(SlotKindSchema),
});

/** One time signature in the flow: how many slots, how they group, and how many times it replays. */
export type FlowStep = z.infer<typeof FlowStepSchema>;

export const FlowStepListSchema = z.array(FlowStepSchema).min(1);

export interface TimeSignature {
  num: number;
  den: Denominator;
}
