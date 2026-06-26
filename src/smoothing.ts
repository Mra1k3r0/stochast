/**
 * @module smoothing
 * Exponential moving average and time-series smoothing.
 */

export function ema(current: number, newValue: number, alpha: number): number {
  return alpha * newValue + (1 - alpha) * current;
}

export function emaSeries(values: number[], alpha: number): number[] {
  if (values.length === 0) return [];
  const result = [values[0]!];
  for (let i = 1; i < values.length; i++) {
    result.push(ema(result[i - 1]!, values[i]!, alpha));
  }
  return result;
}

export function sma(values: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    result.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return result;
}
