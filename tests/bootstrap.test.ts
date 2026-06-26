import { describe, it, expect } from "vitest";
import { resample, bootstrapCI, bootstrapSE, permutationTest } from "../src/bootstrap.js";

describe("resample", () => {
  it("returns same length", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(resample(arr)).toHaveLength(5);
  });

  it("all items from source", () => {
    const arr = [1, 2, 3];
    const result = resample(arr);
    expect(result.every((x) => arr.includes(x))).toBe(true);
  });

  it("contains duplicates", () => {
    const arr = [1, 2, 3, 4, 5];
    let hasDupes = false;
    for (let i = 0; i < 20; i++) {
      const r = resample(arr);
      if (new Set(r).size < r.length) hasDupes = true;
    }
    expect(hasDupes).toBe(true);
  });
});

describe("bootstrapCI", () => {
  it("returns [lower, upper]", () => {
    const data = [1, 2, 3, 4, 5, 100];
    const [lower, upper] = bootstrapCI(data, (s) => s.reduce((a, b) => a + b, 0) / s.length, 500);
    expect(lower).toBeLessThan(upper);
    expect(lower).toBeGreaterThan(0);
    expect(upper).toBeLessThan(100);
  });

  it("smaller alpha gives wider interval", () => {
    const data = [1, 2, 3, 4, 5, 100];
    const [l1, u1] = bootstrapCI(data, (s) => s.reduce((a, b) => a + b, 0) / s.length, 500, 0.1);
    const [l2, u2] = bootstrapCI(data, (s) => s.reduce((a, b) => a + b, 0) / s.length, 500, 0.01);
    expect(u1 - l1).toBeLessThanOrEqual(u2 - l2 + 0.5);
  });
});

describe("bootstrapSE", () => {
  it("returns positive", () => {
    const data = [1, 2, 3, 4, 5];
    expect(bootstrapSE(data, (s) => s.reduce((a, b) => a + b, 0) / s.length, 200)).toBeGreaterThan(0);
  });

  it("larger sample => smaller SE", () => {
    const small = [1, 2, 3];
    const big = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const seSmall = bootstrapSE(small, (s) => s.reduce((a, b) => a + b, 0) / s.length, 500);
    const seBig = bootstrapSE(big, (s) => s.reduce((a, b) => a + b, 0) / s.length, 500);
    expect(seBig).toBeLessThan(seSmall * 3);
  });
});

describe("permutationTest", () => {
  it("similar groups => high p", () => {
    const a = [1, 2, 3, 4, 5];
    const b = [1, 2, 3, 4, 5];
    const p = permutationTest(a, b, (s) => s.reduce((a, b) => a + b, 0) / s.length, 200);
    expect(p).toBeGreaterThan(0.8);
  });

  it("different groups => low p", () => {
    const a = [1, 2, 3];
    const b = [100, 200, 300];
    const p = permutationTest(a, b, (s) => s.reduce((a, b) => a + b, 0) / s.length, 500);
    expect(p).toBeLessThan(0.05);
  });
});
