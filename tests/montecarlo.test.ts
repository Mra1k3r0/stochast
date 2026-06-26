import { describe, it, expect } from "vitest";
import {
  monteCarloIntegral,
  monteCarloExpectation,
  monteCarloProbability,
  buffonsNeedle,
  randomWalk,
  brownianMotion,
} from "../src/montecarlo.js";

describe("monteCarloIntegral", () => {
  it("integrates constant function", () => {
    const result = monteCarloIntegral(() => 1, 0, 1, 10000);
    expect(result).toBeCloseTo(1, 0);
  });

  it("integrates x from 0 to 1 = 0.5", () => {
    const result = monteCarloIntegral((x) => x, 0, 1, 10000);
    expect(result).toBeCloseTo(0.5, 1);
  });

  it("integrates 2x from 0 to 3 = 9", () => {
    const result = monteCarloIntegral((x) => 2 * x, 0, 3, 10000);
    expect(result).toBeCloseTo(9, 0);
  });
});

describe("monteCarloExpectation", () => {
  it("E[constant] = constant", () => {
    const result = monteCarloExpectation(
      () => Math.random(),
      () => 5,
      10000,
    );
    expect(result).toBeCloseTo(5, 0);
  });

  it("E[X] for uniform [0,1] = 0.5", () => {
    const result = monteCarloExpectation(
      () => Math.random(),
      (x) => x,
      10000,
    );
    expect(result).toBeCloseTo(0.5, 1);
  });
});

describe("monteCarloProbability", () => {
  it("P(X > 0.5) for uniform = 0.5", () => {
    const result = monteCarloProbability(() => Math.random(), 0.5, 10000);
    expect(result).toBeCloseTo(0.5, 1);
  });

  it("P(X > 2) for uniform [0,1] = 0", () => {
    const result = monteCarloProbability(() => Math.random(), 2, 10000);
    expect(result).toBe(0);
  });
});

describe("buffonsNeedle", () => {
  it("estimate is in reasonable range of pi", () => {
    const result = buffonsNeedle(1, 2, 50000);
    expect(result).toBeGreaterThan(2);
    expect(result).toBeLessThan(8);
  });
});

describe("randomWalk", () => {
  it("returns steps+1 positions", () => {
    const path = randomWalk(10, 1, 1);
    expect(path).toHaveLength(11);
  });

  it("starts at origin", () => {
    const path = randomWalk(5, 1, 2);
    expect(path[0]).toEqual([0, 0]);
  });

  it("exactly one dimension changes per step", () => {
    const path = randomWalk(10, 1, 3);
    for (let i = 1; i < path.length; i++) {
      const diffs = path[i]!.map((v, d) => Math.abs(v - path[i - 1]![d]!));
      const changed = diffs.filter((d) => d > 0);
      expect(changed.length).toBe(1);
    }
  });
});

describe("brownianMotion", () => {
  it("returns steps+1 positions", () => {
    const path = brownianMotion(10, 0.01, 1);
    expect(path).toHaveLength(11);
  });

  it("starts at 0", () => {
    expect(brownianMotion(5, 0.01, 1)[0]).toBe(0);
  });

  it("positions change", () => {
    const path = brownianMotion(100, 0.1, 1);
    expect(path[100]).not.toBe(0);
  });
});
