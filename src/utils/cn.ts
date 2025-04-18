/**
 * Utility for merging class names
 */

export function cn(...classNames: (string | boolean | undefined | null)[]): string {
  return classNames.filter(Boolean).join(' ')
}
