/**
 * @module stats
 * Descriptive statistics for numeric arrays.
 */

export function mean(arr: number[]): number {
  if (arr.length === 0) throw new Error("mean: empty array");
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function median(arr: number[]): number {
  if (arr.length === 0) throw new Error("median: empty array");
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
}

export function standardDeviation(arr: number[]): number {
  if (arr.length === 0) throw new Error("standardDeviation: empty array");
  const m = mean(arr);
  const variance = arr.reduce((sum, x) => sum + (x - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

export function sampleStandardDeviation(arr: number[]): number {
  if (arr.length < 2) throw new Error("sampleStandardDeviation: need at least 2 values");
  const m = mean(arr);
  const variance = arr.reduce((sum, x) => sum + (x - m) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

export function variance(arr: number[]): number {
  if (arr.length === 0) throw new Error("variance: empty array");
  const m = mean(arr);
  return arr.reduce((sum, x) => sum + (x - m) ** 2, 0) / arr.length;
}

export function percentile(arr: number[], p: number): number {
  if (arr.length === 0) throw new Error("percentile: empty array");
  if (p < 0 || p > 100) throw new Error("percentile: p must be 0-100");
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower]!;
  const frac = index - lower;
  return sorted[lower]! * (1 - frac) + sorted[upper]! * frac;
}

export function min(arr: number[]): number {
  if (arr.length === 0) throw new Error("min: empty array");
  return Math.min(...arr);
}

export function max(arr: number[]): number {
  if (arr.length === 0) throw new Error("max: empty array");
  return Math.max(...arr);
}

export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

export function uniqueCount(arr: number[]): number {
  return new Set(arr).size;
}

export function zScore(value: number, arr: number[]): number {
  const m = mean(arr);
  const sd = standardDeviation(arr);
  if (sd === 0) return 0;
  return (value - m) / sd;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
