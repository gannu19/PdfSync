import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Combines class names and merges Tailwind utility classes cleanly.
// This is useful for conditional styling and variant composition.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
