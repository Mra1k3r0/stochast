import { describe, it, expect } from "vitest";
import { hashString, hashToRange, hashToFloat, fnv1a, deterministicLineCount } from "../src/hash.js";

describe("hashString", () => {
  it("same input => same output", () => {
    expect(hashString("hello")).toBe(hashString("hello"));
  });

  it("different input => different output", () => {
    expect(hashString("hello")).not.toBe(hashString("world"));
  });

  it("returns non-negative", () => {
    for (const s of ["a", "b", "test", "foo", "bar"]) {
      expect(hashString(s)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("hashToRange", () => {
  it("returns value in [min, max]", () => {
    for (let i = 0; i < 100; i++) {
      const v = hashToRange("test-" + i, 1, 10);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(10);
    }
  });

  it("returns integer", () => {
    const v = hashToRange("hello", 0, 100);
    expect(Number.isInteger(v)).toBe(true);
  });
});

describe("hashToFloat", () => {
  it("returns value in [0, 1)", () => {
    for (const s of ["a", "b", "test"]) {
      const v = hashToFloat(s);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("fnv1a", () => {
  it("same input => same output", () => {
    expect(fnv1a("hello")).toBe(fnv1a("hello"));
  });

  it("different input => different output", () => {
    expect(fnv1a("hello")).not.toBe(fnv1a("world"));
  });

  it("returns non-negative", () => {
    for (const s of ["a", "b", "test"]) {
      expect(fnv1a(s)).toBeGreaterThanOrEqual(0);
    }
  });

  it("different algorithm than hashString", () => {
    expect(fnv1a("hello")).not.toBe(hashString("hello"));
  });
});

describe("deterministicLineCount", () => {
  it("same file => same count", () => {
    expect(deterministicLineCount("src/index.ts", false)).toBe(deterministicLineCount("src/index.ts", false));
  });

  it("small mode returns smaller values", () => {
    const small = deterministicLineCount("test.ts", true);
    const large = deterministicLineCount("test.ts", false);
    expect(small).toBeLessThan(large);
  });

  it("small mode range", () => {
    for (let i = 0; i < 50; i++) {
      const v = deterministicLineCount("file-" + i, true);
      expect(v).toBeGreaterThanOrEqual(12);
      expect(v).toBeLessThanOrEqual(520);
    }
  });

  it("large mode range", () => {
    for (let i = 0; i < 50; i++) {
      const v = deterministicLineCount("file-" + i, false);
      expect(v).toBeGreaterThanOrEqual(120);
      expect(v).toBeLessThanOrEqual(2800);
    }
  });

  it("different files can have different counts", () => {
    const counts = new Set<string>();
    for (let i = 0; i < 20; i++) {
      counts.add(String(deterministicLineCount("path-" + i, false)));
    }
    expect(counts.size).toBeGreaterThan(1);
  });
});
