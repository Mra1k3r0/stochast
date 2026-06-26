/**
 * @module distributions
 * Random number generators for common distributions.
 */

export function uniformRand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function bernoulliRand(p: number): boolean {
  return Math.random() < p;
}

export function exponentialRand(lambda: number): number {
  return -Math.log(1 - Math.random()) / lambda;
}

export function poissonRand(lambda: number): number {
  const limit = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > limit);
  return k - 1;
}

export function binomialRand(n: number, p: number): number {
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (Math.random() < p) count++;
  }
  return count;
}

export function gaussianRand(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function gaussianRandWith(mean: number, stddev: number): number {
  return mean + gaussianRand() * stddev;
}

export function lognormalRand(mu: number, sigma: number): number {
  return Math.exp(mu + sigma * gaussianRand());
}

export function cauchyRand(location: number, scale: number): number {
  return location + scale * Math.tan(Math.PI * (Math.random() - 0.5));
}
