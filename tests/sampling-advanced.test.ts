import { describe, it, expect } from "vitest";
import {
  inverseTransform,
  acceptReject,
  rejectionSample,
  weightedResample,
  poissonProcess,
  compoundPoisson,
} from "../src/sampling-advanced.js";

describe("inverseTransform", () => {
  it("generates from uniform CDF", () => {
    const uniformCdf = (x: number) => (x - 2) / 3;
    const samples = Array.from({ length: 1000 }, () => inverseTransform(uniformCdf, 2, 5));
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    expect(mean).toBeCloseTo(3.5, 0);
  });

  it("generates from exponential-like CDF", () => {
    const expCdf = (x: number) => 1 - Math.exp(-x);
    const samples = Array.from({ length: 1000 }, () => inverseTransform(expCdf, 0, 10));
    expect(samples.every((x) => x >= 0 && x <= 10)).toBe(true);
  });
});

describe("acceptReject", () => {
  it("generates from known target", () => {
    const pdf = (x: number) => (x >= 0 && x <= 1 ? 1 : 0);
    const proposal = () => Math.random();
    const proposalPdf = () => 1;
    const samples = Array.from({ length: 1000 }, () => acceptReject(proposal, pdf, proposalPdf, 1));
    expect(samples.every((x) => x >= 0 && x <= 1)).toBe(true);
  });

  it("throws after max iterations if impossible", () => {
    expect(() =>
      acceptReject(
        () => 0.5,
        () => 0,
        () => 1,
        1,
      ),
    ).toThrow("failed to sample after 1000 iterations");
  });
});

describe("rejectionSample", () => {
  it("generates from known pdf", () => {
    const pdf = (x: number) => (x >= 0 && x <= 1 ? 1 : 0);
    const samples = Array.from({ length: 1000 }, () => rejectionSample(pdf, 0, 1));
    expect(samples.every((x) => x >= 0 && x <= 1)).toBe(true);
  });

  it("generates beta-like distribution", () => {
    const pdf = (x: number) => (x >= 0 && x <= 1 ? 6 * x * (1 - x) : 0);
    const samples = Array.from({ length: 5000 }, () => rejectionSample(pdf, 0, 1));
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    expect(mean).toBeCloseTo(0.5, 1);
  });
});

describe("weightedResample", () => {
  it("returns n items", () => {
    const result = weightedResample([1, 2, 3], 10);
    expect(result).toHaveLength(10);
  });

  it("heavier weights sampled more", () => {
    const weights = [1, 100, 1];
    const counts = [0, 0, 0];
    for (let i = 0; i < 1000; i++) {
      const indices = weightedResample(weights, 1);
      counts[indices[0] as number]++;
    }
    expect(counts[1]).toBeGreaterThan(counts[0] + counts[2]);
  });

  it("all indices valid", () => {
    const result = weightedResample([10, 20, 30], 100);
    expect(result.every((i) => i >= 0 && i <= 2)).toBe(true);
  });
});

describe("poissonProcess", () => {
  it("returns sorted times", () => {
    const events = poissonProcess(5, 10);
    for (let i = 1; i < events.length; i++) {
      expect(events[i]!).toBeGreaterThan(events[i - 1]!);
    }
  });

  it("all times within duration", () => {
    const events = poissonProcess(10, 5);
    expect(events.every((t) => t >= 0 && t <= 5)).toBe(true);
  });

  it("higher rate => more events", () => {
    const low = poissonProcess(1, 100);
    const high = poissonProcess(100, 100);
    expect(high.length).toBeGreaterThan(low.length);
  });
});

describe("compoundPoisson", () => {
  it("returns { time, value } pairs", () => {
    const events = compoundPoisson(5, () => Math.random(), 10);
    for (const e of events) {
      expect(e).toHaveProperty("time");
      expect(e).toHaveProperty("value");
    }
  });

  it("all times within duration", () => {
    const events = compoundPoisson(10, () => 1, 5);
    expect(events.every((e) => e.time >= 0 && e.time <= 5)).toBe(true);
  });
});
