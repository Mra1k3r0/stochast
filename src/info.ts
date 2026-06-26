/**
 * @module info
 * Information theory: entropy, divergence, mutual information.
 */

export function entropy(probs: number[]): number {
  return -probs.reduce((sum, p) => {
    if (p <= 0) return sum;
    return sum + p * Math.log(p);
  }, 0);
}

export function crossEntropy(p: number[], q: number[]): number {
  if (p.length !== q.length) throw new Error("crossEntropy: distributions must match");
  return -p.reduce((sum, pi, i) => {
    if (pi <= 0 || q[i]! <= 0) return sum;
    return sum + pi * Math.log(q[i]!);
  }, 0);
}

export function klDivergence(p: number[], q: number[]): number {
  if (p.length !== q.length) throw new Error("klDivergence: distributions must match");
  return p.reduce((sum, pi, i) => {
    if (pi <= 0 || q[i]! <= 0) return sum;
    return sum + pi * Math.log(pi / q[i]!);
  }, 0);
}

export function jsDivergence(p: number[], q: number[]): number {
  if (p.length !== q.length) throw new Error("jsDivergence: distributions must match");
  const m = p.map((pi, i) => (pi + q[i]!) / 2);
  return (klDivergence(p, m) + klDivergence(q, m)) / 2;
}

export function mutualInformation(joint: number[][], margX: number[], margY: number[]): number {
  let mi = 0;
  for (let i = 0; i < joint.length; i++) {
    for (let j = 0; j < joint[i]!.length; j++) {
      const pxy = joint[i]![j]!;
      if (pxy <= 0 || margX[i]! <= 0 || margY[j]! <= 0) continue;
      mi += pxy * Math.log(pxy / (margX[i]! * margY[j]!));
    }
  }
  return mi;
}

export function giniImpurity(probs: number[]): number {
  return 1 - probs.reduce((sum, p) => sum + p * p, 0);
}

export function renyiEntropy(probs: number[], alpha: number): number {
  if (alpha === 1) return entropy(probs);
  const sum = probs.reduce((s, p) => s + Math.pow(p, alpha), 0);
  return (1 / (1 - alpha)) * Math.log(sum);
}
