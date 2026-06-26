/**
 * @module hash
 * Deterministic hashing utilities.
 */

export function hashString(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function hashToRange(str: string, min: number, max: number): number {
  const h = hashString(str);
  return min + (h % (max - min + 1));
}

export function hashToFloat(str: string): number {
  return hashString(str) / 0x7fffffff;
}

export function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return Math.abs(h);
}

export function deterministicLineCount(filePath: string, small: boolean): number {
  const seed = hashString(filePath);
  if (small) return 12 + (seed % 509);
  return 120 + (seed % 2680);
}
