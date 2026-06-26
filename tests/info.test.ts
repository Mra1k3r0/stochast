import { describe, it, expect } from "vitest";
import {
  entropy,
  crossEntropy,
  klDivergence,
  jsDivergence,
  mutualInformation,
  giniImpurity,
  renyiEntropy,
} from "../src/info.js";

describe("entropy", () => {
  it("max entropy for uniform", () => {
    expect(entropy([0.5, 0.5])).toBeCloseTo(Math.log(2));
  });

  it("[1.0] = 0 (certain outcome)", () => {
    expect(entropy([1.0])).toBeCloseTo(0);
  });

  it("single element [1]", () => {
    expect(entropy([1])).toBeCloseTo(0);
  });

  it("three-element uniform", () => {
    const result = entropy([1 / 3, 1 / 3, 1 / 3]);
    expect(result).toBeCloseTo(Math.log(3));
  });

  it("ignores zero entries", () => {
    expect(entropy([0, 0.5, 0.5])).toBeCloseTo(Math.log(2));
  });
});

describe("crossEntropy", () => {
  it("H(p, p) = entropy(p)", () => {
    const p = [0.5, 0.5];
    expect(crossEntropy(p, p)).toBeCloseTo(entropy(p));
  });

  it("H(p, q) >= H(p, p)", () => {
    const p = [0.5, 0.5];
    const q = [0.3, 0.7];
    expect(crossEntropy(p, q)).toBeGreaterThanOrEqual(entropy(p) - 0.001);
  });

  it("throws on mismatched lengths", () => {
    expect(() => crossEntropy([0.5, 0.5], [1])).toThrow("must match");
  });
});

describe("klDivergence", () => {
  it("D_KL(p, p) = 0", () => {
    const p = [0.3, 0.7];
    expect(klDivergence(p, p)).toBeCloseTo(0);
  });

  it("D_KL(p, q) > 0 for different distributions", () => {
    expect(klDivergence([0.3, 0.7], [0.5, 0.5])).toBeGreaterThan(0);
  });

  it("asymmetric: D_KL(p||q) != D_KL(q||p) in general", () => {
    const p = [0.1, 0.9];
    const q = [0.5, 0.5];
    const d1 = klDivergence(p, q);
    const d2 = klDivergence(q, p);
    expect(d1).not.toBeCloseTo(d2, 6);
  });

  it("throws on mismatched lengths", () => {
    expect(() => klDivergence([0.5, 0.5], [1])).toThrow("must match");
  });

  it("skips zero entries", () => {
    expect(() => klDivergence([0, 0.5, 0.5], [0, 0.5, 0.5])).not.toThrow();
  });
});

describe("jsDivergence", () => {
  it("symmetric", () => {
    const p = [0.3, 0.7];
    const q = [0.5, 0.5];
    expect(jsDivergence(p, q)).toBeCloseTo(jsDivergence(q, p));
  });

  it(">= 0", () => {
    expect(jsDivergence([0.3, 0.7], [0.5, 0.5])).toBeGreaterThanOrEqual(0);
  });

  it("0 for identical", () => {
    expect(jsDivergence([0.5, 0.5], [0.5, 0.5])).toBeCloseTo(0);
  });

  it("throws on mismatched lengths", () => {
    expect(() => jsDivergence([0.5, 0.5], [1])).toThrow("must match");
  });
});

describe("mutualInformation", () => {
  it("independent => MI = 0", () => {
    const joint = [
      [0.25, 0.25],
      [0.25, 0.25],
    ];
    const margX = [0.5, 0.5];
    const margY = [0.5, 0.5];
    expect(mutualInformation(joint, margX, margY)).toBeCloseTo(0);
  });

  it("correlated => MI > 0", () => {
    const joint = [
      [0.4, 0.1],
      [0.1, 0.4],
    ];
    const margX = [0.5, 0.5];
    const margY = [0.5, 0.5];
    expect(mutualInformation(joint, margX, margY)).toBeGreaterThan(0);
  });
});

describe("giniImpurity", () => {
  it("uniform = 1 - sum(p^2)", () => {
    expect(giniImpurity([0.5, 0.5])).toBeCloseTo(0.5);
  });

  it("pure = 0", () => {
    expect(giniImpurity([1.0])).toBeCloseTo(0);
  });

  it("three-class uniform", () => {
    expect(giniImpurity([1 / 3, 1 / 3, 1 / 3])).toBeCloseTo(2 / 3);
  });
});

describe("renyiEntropy", () => {
  it("alpha=1 => Shannon entropy", () => {
    const p = [0.5, 0.5];
    expect(renyiEntropy(p, 1)).toBeCloseTo(entropy(p));
  });

  it("alpha=0 => log of support size", () => {
    expect(renyiEntropy([0.5, 0.5], 0)).toBeCloseTo(Math.log(2));
  });

  it("alpha=2 => collision entropy", () => {
    const p = [0.5, 0.5];
    expect(renyiEntropy(p, 2)).toBeCloseTo(-Math.log(0.5));
  });
});
