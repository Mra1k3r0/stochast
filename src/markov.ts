/**
 * @module markov
 * Markov chain: state machine with probabilistic transitions.
 */

export type TransitionMatrix = Record<string, Record<string, number>>;

export function normalizeMatrix(matrix: TransitionMatrix): TransitionMatrix {
  const result: TransitionMatrix = {};
  for (const [from, transitions] of Object.entries(matrix)) {
    const total = Object.values(transitions).reduce((a, b) => a + b, 0);
    result[from] = {};
    for (const [to, weight] of Object.entries(transitions)) {
      result[from]![to] = total > 0 ? weight / total : 0;
    }
  }
  return result;
}

export function nextState(matrix: TransitionMatrix, current: string): string {
  const transitions = matrix[current];
  if (!transitions) throw new Error(`nextState: unknown state "${current}"`);
  const entries = Object.entries(transitions);
  if (entries.length === 0) throw new Error(`nextState: no transitions from "${current}"`);

  let r = Math.random();
  for (const [state, prob] of entries) {
    r -= prob;
    if (r <= 0) return state!;
  }
  return entries[entries.length - 1]![0];
}

export function sampleSequence(matrix: TransitionMatrix, start: string, length: number): string[] {
  const seq = [start];
  let current = start;
  for (let i = 1; i < length; i++) {
    current = nextState(matrix, current);
    seq.push(current);
  }
  return seq;
}

export function buildMatrix(observations: string[]): TransitionMatrix {
  const matrix: TransitionMatrix = {};
  for (let i = 0; i < observations.length - 1; i++) {
    const from = observations[i]!;
    const to = observations[i + 1]!;
    if (!matrix[from]) matrix[from] = {};
    matrix[from]![to] = (matrix[from]![to] ?? 0) + 1;
  }
  return normalizeMatrix(matrix);
}

export function stationaryDistribution(matrix: TransitionMatrix, iterations = 100): Record<string, number> {
  const states = Object.keys(matrix);
  if (states.length === 0) return {};

  let dist: Record<string, number> = {};
  for (const s of states) dist[s] = 1 / states.length;

  for (let iter = 0; iter < iterations; iter++) {
    const next: Record<string, number> = {};
    for (const s of states) next[s] = 0;
    for (const [from, transitions] of Object.entries(matrix)) {
      for (const [to, prob] of Object.entries(transitions)) {
        next[to!] = (next[to!] ?? 0) + dist[from]! * prob;
      }
    }
    dist = next;
  }
  return dist;
}
