import { describe, it, expect } from "vitest";
import { shuffle, sample, sampleWithReplacement, randomPick, weightedPick } from "../src/sampling.js";

describe("shuffle", () => {
  it("returns same length", () => {
    const result = shuffle([1, 2, 3, 4, 5]);
    expect(result.length).toBe(5);
  });

  it("contains same elements", () => {
    const result = shuffle([1, 2, 3, 4, 5]);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("does not mutate original", () => {
    const arr = [1, 2, 3];
    shuffle(arr);
    expect(arr).toEqual([1, 2, 3]);
  });
});

describe("sample", () => {
  it("returns n items", () => {
    const result = sample([1, 2, 3, 4, 5], 3);
    expect(result.length).toBe(3);
  });

  it("returns all when n >= length", () => {
    const result = sample([1, 2, 3], 10);
    expect(result.length).toBe(3);
  });
});

describe("sampleWithReplacement", () => {
  it("returns n items", () => {
    const result = sampleWithReplacement([1, 2, 3], 5);
    expect(result.length).toBe(5);
  });

  it("all items from source", () => {
    const result = sampleWithReplacement([1, 2, 3], 100);
    expect(result.every((x) => [1, 2, 3].includes(x))).toBe(true);
  });
});

describe("randomPick", () => {
  it("picks from array", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = randomPick(arr);
    expect(arr).toContain(result);
  });

  it("throws on empty", () => {
    expect(() => randomPick([])).toThrow("empty array");
  });
});

describe("weightedPick", () => {
  it("picks heavier items more", () => {
    const items = ["a", "b", "c"];
    const counts = { a: 0, b: 0, c: 0 };
    for (let i = 0; i < 1000; i++) {
      const pick = weightedPick(items, (t) => (t === "b" ? 100 : 1));
      counts[pick as keyof typeof counts]++;
    }
    expect(counts.b).toBeGreaterThan(counts.a + counts.c);
  });

  it("throws on empty", () => {
    expect(() => weightedPick([], () => 1)).toThrow("empty items");
  });
});
