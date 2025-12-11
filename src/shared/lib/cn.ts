import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging Tailwind CSS classes with clsx.
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
