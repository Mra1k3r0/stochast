/**
 * @module sampling-advanced
 * Advanced sampling: inverse transform, accept-reject, importance sampling.
 */

export function inverseTransform(cdf: (x: number) => number, min: number, max: number): number {
  const u = Math.random();
  let lo = min;
  let hi = max;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (cdf(mid) < u) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function acceptReject(
  proposal: () => number,
  pdf: (x: number) => number,
  proposalPdf: (x: number) => number,
  M: number,
): number {
  for (let i = 0; i < 1000; i++) {
    const x = proposal();
    const u = Math.random();
    if (u < pdf(x) / (M * proposalPdf(x))) return x;
  }
  throw new Error("acceptReject: failed to sample after 1000 iterations");
}

export function rejectionSample(pdf: (x: number) => number, min: number, max: number): number {
  let maxPdf = 0;
  for (let i = 0; i < 100; i++) {
    const x = min + Math.random() * (max - min);
    maxPdf = Math.max(maxPdf, pdf(x));
  }
  return acceptReject(
    () => min + Math.random() * (max - min),
    pdf,
    () => 1 / (max - min),
    maxPdf * (max - min),
  );
}

export function weightedResample(weights: number[], n: number): number[] {
  const total = weights.reduce((a, b) => a + b, 0);
  const cumsum: number[] = [];
  let sum = 0;
  for (const w of weights) {
    sum += w;
    cumsum.push(sum);
  }
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    const u = Math.random() * total;
    for (let j = 0; j < cumsum.length; j++) {
      if (u <= cumsum[j]!) {
        result.push(j);
        break;
      }
    }
  }
  return result;
}

export function poissonProcess(lambda: number, duration: number): number[] {
  const events: number[] = [];
  let t = 0;
  while (t < duration) {
    t += -Math.log(1 - Math.random()) / lambda;
    if (t < duration) events.push(t);
  }
  return events;
}

export function compoundPoisson(
  lambda: number,
  valueFn: () => number,
  duration: number,
): { time: number; value: number }[] {
  const events: { time: number; value: number }[] = [];
  let t = 0;
  while (t < duration) {
    t += -Math.log(1 - Math.random()) / lambda;
    if (t < duration) events.push({ time: t, value: valueFn() });
  }
  return events;
}
