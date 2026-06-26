import { describe, it, expect } from "vitest";
import {
  uniformRand,
  randInt,
  bernoulliRand,
  exponentialRand,
  poissonRand,
  binomialRand,
  gaussianRand,
  gaussianRandWith,
  lognormalRand,
  cauchyRand,
} from "../src/distributions.js";

describe("uniformRand", () => {
  it("returns value in [min, max)", () => {
    for (let i = 0; i < 100; i++) {
      const v = uniformRand(5, 10);
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThan(10);
    }
  });

  it("returns 5 when min === max", () => {
    expect(uniformRand(5, 5)).toBe(5);
  });
});

describe("randInt", () => {
  it("returns integer in [min, max]", () => {
    for (let i = 0; i < 100; i++) {
      const v = randInt(1, 5);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(5);
      expect(Number.isInteger(v)).toBe(true);
    }
  });
});

describe("bernoulliRand", () => {
  it("p=1 always true", () => {
    for (let i = 0; i < 20; i++) expect(bernoulliRand(1)).toBe(true);
  });

  it("p=0 always false", () => {
    for (let i = 0; i < 20; i++) expect(bernoulliRand(0)).toBe(false);
  });
});

describe("exponentialRand", () => {
  it("returns non-negative", () => {
    for (let i = 0; i < 100; i++) {
      expect(exponentialRand(1)).toBeGreaterThanOrEqual(0);
    }
  });

  it("mean is approximately 1/lambda", () => {
    const samples = Array.from({ length: 5000 }, () => exponentialRand(2));
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    expect(mean).toBeCloseTo(0.5, 1);
  });
});

describe("poissonRand", () => {
  it("returns non-negative integer", () => {
    for (let i = 0; i < 100; i++) {
      const v = poissonRand(3);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(v)).toBe(true);
    }
  });

  it("mean approximately equals lambda", () => {
    const samples = Array.from({ length: 5000 }, () => poissonRand(4));
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    expect(mean).toBeGreaterThanOrEqual(3.5);
    expect(mean).toBeLessThanOrEqual(4.5);
  });
});

describe("binomialRand", () => {
  it("returns value in [0, n]", () => {
    for (let i = 0; i < 100; i++) {
      const v = binomialRand(10, 0.5);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(10);
    }
  });

  it("mean approximately equals n*p", () => {
    const samples = Array.from({ length: 5000 }, () => binomialRand(20, 0.3));
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    expect(mean).toBeGreaterThanOrEqual(5);
    expect(mean).toBeLessThanOrEqual(7);
  });
});

describe("gaussianRand", () => {
  it("mean approximately 0", () => {
    const samples = Array.from({ length: 10000 }, () => gaussianRand());
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    expect(Math.abs(mean)).toBeLessThan(0.1);
  });

  it("stddev approximately 1", () => {
    const samples = Array.from({ length: 10000 }, () => gaussianRand());
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    const variance = samples.reduce((s, x) => s + (x - mean) ** 2, 0) / samples.length;
    expect(Math.sqrt(variance)).toBeCloseTo(1, 0);
  });
});

describe("gaussianRandWith", () => {
  it("mean approximately matches", () => {
    const samples = Array.from({ length: 10000 }, () => gaussianRandWith(5, 2));
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    expect(mean).toBeCloseTo(5, 0);
  });
});

describe("lognormalRand", () => {
  it("returns positive", () => {
    for (let i = 0; i < 100; i++) {
      expect(lognormalRand(0, 1)).toBeGreaterThan(0);
    }
  });
});

describe("cauchyRand", () => {
  it("returns finite for most samples", () => {
    const samples = Array.from({ length: 1000 }, () => cauchyRand(0, 1));
    const finite = samples.filter((x) => Number.isFinite(x));
    expect(finite.length).toBeGreaterThan(900);
  });
});
