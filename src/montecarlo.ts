/**
 * @module montecarlo
 * Monte Carlo methods: integration, expectation, simulation.
 */

export function monteCarloIntegral(f: (x: number) => number, a: number, b: number, samples = 10000): number {
  let sum = 0;
  for (let i = 0; i < samples; i++) {
    const x = a + Math.random() * (b - a);
    sum += f(x);
  }
  return ((b - a) * sum) / samples;
}

export function monteCarloExpectation(distribution: () => number, f: (x: number) => number, samples = 10000): number {
  let sum = 0;
  for (let i = 0; i < samples; i++) {
    sum += f(distribution());
  }
  return sum / samples;
}

export function monteCarloProbability(distribution: () => number, threshold: number, samples = 10000): number {
  let count = 0;
  for (let i = 0; i < samples; i++) {
    if (distribution() > threshold) count++;
  }
  return count / samples;
}

export function buffonsNeedle(needleLength: number, lineSpacing: number, drops = 10000): number {
  let crossings = 0;
  for (let i = 0; i < drops; i++) {
    const y = Math.random() * lineSpacing;
    const theta = Math.random() * Math.PI;
    if (y <= (needleLength / 2) * Math.sin(theta)) crossings++;
  }
  return crossings > 0 ? (2 * needleLength * drops) / (lineSpacing * crossings) : Math.PI;
}

export function randomWalk(steps: number, stepSize = 1, dimensions = 1): number[][] {
  const path: number[][] = [Array(dimensions).fill(0)];
  for (let i = 0; i < steps; i++) {
    const pos = [...path[path.length - 1]!];
    const d = Math.floor(Math.random() * dimensions);
    pos[d] = (pos[d] as number) + (Math.random() < 0.5 ? -stepSize : stepSize);
    path.push(pos);
  }
  return path;
}

export function brownianMotion(steps: number, dt: number, sigma: number): number[] {
  const path = [0];
  for (let i = 0; i < steps; i++) {
    const prev = path[path.length - 1]!;
    const dW =
      Math.sqrt(dt) *
      (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3) *
      Math.sqrt(2);
    path.push(prev + sigma * dW);
  }
  return path;
}
