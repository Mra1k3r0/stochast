import { describe, it, expect } from "vitest";
import {
  mean,
  median,
  standardDeviation,
  sampleStandardDeviation,
  variance,
  percentile,
  min,
  max,
  sum,
  uniqueCount,
  zScore,
  clamp,
} from "../src/stats.js";

describe("mean", () => {
  it("[1, 2, 3] = 2", () => {
    expect(mean([1, 2, 3])).toBe(2);
  });

  it("throws on empty", () => {
    expect(() => mean([])).toThrow("empty");
  });
});

describe("median", () => {
  it("[1, 2, 3] = 2", () => {
    expect(median([1, 2, 3])).toBe(2);
  });

  it("[1, 2, 3, 4] = 2.5", () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it("single element", () => {
    expect(median([5])).toBe(5);
  });
});

describe("standardDeviation", () => {
  it("[1, 1, 1] = 0", () => {
    expect(standardDeviation([1, 1, 1])).toBe(0);
  });

  it("[1, 2, 3, 4, 5] = sqrt(2)", () => {
    expect(standardDeviation([1, 2, 3, 4, 5])).toBeCloseTo(Math.sqrt(2));
  });
});

describe("sampleStandardDeviation", () => {
  it("needs at least 2 values", () => {
    expect(() => sampleStandardDeviation([1])).toThrow();
  });

  it("[1, 2, 3] sample stddev", () => {
    expect(sampleStandardDeviation([1, 2, 3])).toBeCloseTo(1);
  });
});

describe("variance", () => {
  it("[1, 1, 1] = 0", () => {
    expect(variance([1, 1, 1])).toBe(0);
  });

  it("[1, 2, 3] = 2/3", () => {
    expect(variance([1, 2, 3])).toBeCloseTo(2 / 3);
  });
});

describe("percentile", () => {
  it("p=50 is median", () => {
    expect(percentile([1, 2, 3, 4, 5], 50)).toBe(3);
  });

  it("p=0 is min", () => {
    expect(percentile([1, 2, 3, 4, 5], 0)).toBe(1);
  });

  it("p=100 is max", () => {
    expect(percentile([1, 2, 3, 4, 5], 100)).toBe(5);
  });

  it("throws on empty", () => {
    expect(() => percentile([], 50)).toThrow();
  });

  it("throws on invalid p", () => {
    expect(() => percentile([1, 2], -1)).toThrow();
    expect(() => percentile([1, 2], 101)).toThrow();
  });
});

describe("min", () => {
  it("finds minimum", () => {
    expect(min([3, 1, 4, 1, 5, 9])).toBe(1);
  });
});

describe("max", () => {
  it("finds maximum", () => {
    expect(max([3, 1, 4, 1, 5, 9])).toBe(9);
  });
});

describe("sum", () => {
  it("[1, 2, 3] = 6", () => {
    expect(sum([1, 2, 3])).toBe(6);
  });

  it("empty = 0", () => {
    expect(sum([])).toBe(0);
  });
});

describe("uniqueCount", () => {
  it("[1, 1, 2, 3, 3] = 3", () => {
    expect(uniqueCount([1, 1, 2, 3, 3])).toBe(3);
  });
});

describe("zScore", () => {
  it("mean = 0 zScore", () => {
    expect(zScore(3, [1, 2, 3, 4, 5])).toBeCloseTo(0);
  });

  it("mean=3, stddev=sqrt(2), z(5)=sqrt(2)", () => {
    expect(zScore(5, [1, 2, 3, 4, 5])).toBeCloseTo(Math.sqrt(2));
  });

  it("returns 0 for zero stddev", () => {
    expect(zScore(5, [3, 3, 3])).toBe(0);
  });
});

describe("clamp", () => {
  it("clamps below min", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("clamps above max", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("passes through in range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
});
