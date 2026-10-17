import { createJSONStorage, unstable_withStorageValidator as withStorageValidator } from "jotai/utils";
import type { z } from "zod";

/** Structural match for jotai's `SyncStorage`, which `jotai/utils` does not re-export. */
export interface ValidatedStorage<T> {
  getItem: (key: string, initialValue: T) => T;
  setItem: (key: string, newValue: T) => void;
  removeItem: (key: string) => void;
}

/**
 * JSON localStorage adapter for `atomWithStorage` that falls back to the atom's
 * initial value when the stored data no longer matches `schema`.
 */
export function createValidatedStorage<T>(schema: z.ZodType<T>): ValidatedStorage<T> {
  function isValid(value: unknown): value is T {
    return schema.safeParse(value).success;
  }

  return withStorageValidator(isValid)(createJSONStorage<unknown>());
}
