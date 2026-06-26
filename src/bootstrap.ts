/**
 * @module bootstrap
 * Bootstrap resampling: estimate confidence intervals by resampling with replacement.
 */

export function resample<T>(arr: T[]): T[] {
  return Array.from({ length: arr.length }, () => arr[Math.floor(Math.random() * arr.length)]!);
}

export function bootstrapCI(
  data: number[],
  statFn: (sample: number[]) => number,
  iterations = 1000,
  alpha = 0.05,
): [number, number] {
  const stats: number[] = [];
  for (let i = 0; i < iterations; i++) {
    stats.push(statFn(resample(data)));
  }
  stats.sort((a, b) => a - b);
  const lowerIdx = Math.floor((alpha / 2) * stats.length);
  const upperIdx = Math.floor((1 - alpha / 2) * stats.length) - 1;
  return [stats[lowerIdx]!, stats[Math.min(upperIdx, stats.length - 1)]!];
}

export function bootstrapSE(data: number[], statFn: (sample: number[]) => number, iterations = 1000): number {
  const stats: number[] = [];
  const mean = statFn(data);
  for (let i = 0; i < iterations; i++) {
    stats.push(statFn(resample(data)));
  }
  const variance = stats.reduce((sum, s) => sum + (s - mean) ** 2, 0) / stats.length;
  return Math.sqrt(variance);
}

export function permutationTest(
  a: number[],
  b: number[],
  statFn: (sample: number[]) => number,
  iterations = 1000,
): number {
  const observed = Math.abs(statFn(a) - statFn(b));
  const combined = [...a, ...b];
  let count = 0;
  for (let i = 0; i < iterations; i++) {
    const shuffled = [...combined];
    for (let j = shuffled.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]!];
    }
    const permA = shuffled.slice(0, a.length);
    const permB = shuffled.slice(a.length);
    if (Math.abs(statFn(permA) - statFn(permB)) >= observed) count++;
  }
  return count / iterations;
}
