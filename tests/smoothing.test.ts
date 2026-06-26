import { describe, it, expect } from "vitest";
import { ema, emaSeries, sma } from "../src/smoothing.js";

describe("ema", () => {
  it("computes single EMA step correctly", () => {
    expect(ema(0.5, 1.0, 0.3)).toBeCloseTo(0.65);
  });

  it("with alpha=1 returns newValue", () => {
    expect(ema(10, 20, 1)).toBe(20);
  });

  it("with alpha=0 returns current", () => {
    expect(ema(10, 20, 0)).toBe(10);
  });
});

describe("emaSeries", () => {
  it("first value is the first input", () => {
    const result = emaSeries([1, 2, 3, 4, 5], 0.5);
    expect(result[0]).toBe(1);
  });

  it("returns array of same length", () => {
    const result = emaSeries([1, 2, 3, 4, 5], 0.5);
    expect(result.length).toBe(5);
  });

  it("last value is smoothed toward 5", () => {
    const result = emaSeries([1, 2, 3, 4, 5], 0.5);
    expect(result[result.length - 1]).toBeGreaterThan(3);
    expect(result[result.length - 1]).toBeLessThanOrEqual(5);
  });

  it("returns empty array for empty input", () => {
    expect(emaSeries([], 0.5)).toEqual([]);
  });
});

describe("sma", () => {
  it("third value is average of first 3", () => {
    const result = sma([1, 2, 3, 4, 5], 3);
    expect(result[2]).toBeCloseTo(2);
  });

  it("last value is average of last 3", () => {
    const result = sma([1, 2, 3, 4, 5], 3);
    expect(result[4]).toBeCloseTo(4);
  });

  it("returns array of same length", () => {
    const result = sma([1, 2, 3, 4, 5], 3);
    expect(result.length).toBe(5);
  });

  it("first value is just the first element", () => {
    const result = sma([1, 2, 3, 4, 5], 3);
    expect(result[0]).toBe(1);
  });
});
