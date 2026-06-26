import { describe, it, expect } from "vitest";
import {
  normalizeMatrix,
  nextState,
  sampleSequence,
  buildMatrix,
  stationaryDistribution,
  type TransitionMatrix,
} from "../src/markov.js";

describe("normalizeMatrix", () => {
  it("normalizes rows to sum to 1", () => {
    const matrix: TransitionMatrix = { A: { B: 3, C: 1 } };
    const normalized = normalizeMatrix(matrix);
    const sum = Object.values(normalized.A!).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1);
  });

  it("preserves zero rows", () => {
    const matrix: TransitionMatrix = { A: {} };
    expect(normalizeMatrix(matrix)).toEqual({ A: {} });
  });
});

describe("nextState", () => {
  it("returns a valid state", () => {
    const matrix: TransitionMatrix = { A: { B: 0.5, C: 0.5 } };
    for (let i = 0; i < 100; i++) {
      expect(["B", "C"]).toContain(nextState(matrix, "A"));
    }
  });

  it("throws on unknown state", () => {
    expect(() => nextState({}, "X")).toThrow('unknown state "X"');
  });

  it("throws on no transitions", () => {
    expect(() => nextState({ A: {} }, "A")).toThrow('no transitions from "A"');
  });
});

describe("sampleSequence", () => {
  it("starts with given state", () => {
    const matrix: TransitionMatrix = { A: { B: 1 }, B: { A: 1 } };
    const seq = sampleSequence(matrix, "A", 5);
    expect(seq[0]).toBe("A");
  });

  it("returns correct length", () => {
    const matrix: TransitionMatrix = { A: { B: 1 }, B: { A: 1 } };
    expect(sampleSequence(matrix, "A", 3)).toHaveLength(3);
  });

  it("only uses valid states", () => {
    const matrix: TransitionMatrix = { A: { B: 1 }, B: { A: 1 } };
    const seq = sampleSequence(matrix, "A", 10);
    expect(seq.every((s) => s === "A" || s === "B")).toBe(true);
  });
});

describe("buildMatrix", () => {
  it("builds correct transition counts", () => {
    const obs = ["A", "B", "A", "B", "A"];
    const matrix = buildMatrix(obs);
    expect(matrix.A!.B).toBeCloseTo(1);
    expect(matrix.B!.A).toBeCloseTo(1);
  });

  it("handles single observation", () => {
    expect(buildMatrix(["A"])).toEqual({});
  });

  it("handles empty", () => {
    expect(buildMatrix([])).toEqual({});
  });
});

describe("stationaryDistribution", () => {
  it("sums to 1", () => {
    const matrix: TransitionMatrix = { A: { A: 0.7, B: 0.3 }, B: { A: 0.4, B: 0.6 } };
    const dist = stationaryDistribution(matrix);
    const sum = Object.values(dist).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1);
  });

  it("converges for simple chain", () => {
    const matrix: TransitionMatrix = { A: { A: 0.5, B: 0.5 }, B: { A: 0.5, B: 0.5 } };
    const dist = stationaryDistribution(matrix, 50);
    expect(dist.A).toBeCloseTo(0.5, 1);
    expect(dist.B).toBeCloseTo(0.5, 1);
  });

  it("converges for biased chain", () => {
    const matrix: TransitionMatrix = { A: { B: 1.0 }, B: { A: 1.0 } };
    const dist = stationaryDistribution(matrix, 100);
    expect(dist.A).toBeCloseTo(0.5, 1);
    expect(dist.B).toBeCloseTo(0.5, 1);
  });
});
