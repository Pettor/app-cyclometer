import type { ReactElement } from "react";

export interface CyclometerMarkProps {
  size?: number;
  className?: string;
}

/**
 * The Cyclometer app mark: a ring of beat groups with the downbeat at 12 o'clock.
 * Decorative — pair it with a visible app name.
 */
export function CyclometerMark({ size = 36, className }: CyclometerMarkProps): ReactElement {
  const stroke = size <= 24 ? 8 : size <= 40 ? 6 : 5;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <rect width="64" height="64" rx="15" fill="#18181b" />
      <path d="M32 15 A18 18 0 0 1 49.5 37" fill="none" stroke="#5ec8e5" strokeWidth={stroke} strokeLinecap="round" />
      <path d="M46 43 A18 18 0 0 1 18 45" fill="none" stroke="#b794f6" strokeWidth={stroke} strokeLinecap="round" />
      <path d="M15 39 A18 18 0 0 1 24 17.5" fill="none" stroke="#7ee0b0" strokeWidth={stroke} strokeLinecap="round" />
      <circle cx="32" cy="15" r={size <= 24 ? 8 : 6} fill="#f5b94a" />
    </svg>
  );
}
