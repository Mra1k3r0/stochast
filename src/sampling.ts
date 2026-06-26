/**
 * @module sampling
 * Array sampling and shuffling utilities.
 */

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

export function sample<T>(arr: T[], n: number): T[] {
  if (n >= arr.length) return shuffle(arr);
  const shuffled = shuffle(arr);
  return shuffled.slice(0, n);
}

export function sampleWithReplacement<T>(arr: T[], n: number): T[] {
  return Array.from({ length: n }, () => arr[Math.floor(Math.random() * arr.length)]!);
}

export function randomPick<T>(arr: T[]): T {
  if (arr.length === 0) throw new Error("randomPick: empty array");
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function weightedPick<T>(items: T[], weightFn: (t: T) => number): T {
  if (items.length === 0) throw new Error("weightedPick: empty items");
  const w = items.map((t) => Math.max(0, weightFn(t)));
  const sum = w.reduce((a, b) => a + b, 0);
  if (sum <= 0) return items[Math.floor(Math.random() * items.length)]!;
  let r = Math.random() * sum;
  for (let i = 0; i < items.length; i++) {
    r -= w[i]!;
    if (r <= 0) return items[i]!;
  }
  return items[items.length - 1]!;
}
