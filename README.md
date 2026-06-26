<p align="center">
  <h1 align="center" style="font-family: 'Courier New', monospace; font-size: 2.5em; letter-spacing: 0.15em; margin-bottom: 0;">
    <code style="background: none; font-size: inherit;">STOCHAST</code>
  </h1>
  <p align="center" style="color: #888; font-size: 0.95em; letter-spacing: 0.3em; margin-top: 0;">
    stochastic utilities
  </p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/stochast"><img src="https://img.shields.io/npm/v/stochast?style=flat-square&logo=npm" alt="npm version"></a>
  <a href="https://github.com/Mra1k3r0/stochast/actions"><img src="https://img.shields.io/github/actions/workflow/status/Mra1k3r0/stochast/ci.yml?style=flat-square&label=build&logo=github" alt="build status"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square&logo=node.js" alt="node version"></a>
</p>

<p align="center" style="color: #555; max-width: 600px; margin: 1.5em auto; line-height: 1.6;">
  Stochastic utilities for Node.js. Distributions, sampling, statistics, information theory, Markov chains, bootstrap, Monte Carlo. Zero dependencies.
</p>

## Table of Contents

- [Install](#install)
- [Modules](#modules)
  - [Distributions](#distributions)
  - [Sampling](#sampling)
  - [Statistics](#statistics)
  - [Hashing](#hashing)
  - [Smoothing](#smoothing)
  - [Markov Chains](#markov-chains)
  - [Bootstrap](#bootstrap)
  - [Information Theory](#information-theory)
  - [Advanced Sampling](#advanced-sampling)
  - [Monte Carlo](#monte-carlo)
- [License](#license)

## Install

```bash
npm install stochast
```

## Modules

### Distributions

```ts
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
} from "stochast";

uniformRand(0, 1); // [0, 1)
randInt(1, 6); // 1–6 inclusive
bernoulliRand(0.7); // true/false with 70% chance
exponentialRand(2.0); // mean = 0.5
poissonRand(5.0); // mean = 5
binomialRand(10, 0.5); // 0–10
gaussianRand(); // mean 0, stddev 1
gaussianRandWith(100, 15); // custom mean/stddev
lognormalRand(0, 0.5); // always positive
cauchyRand(0, 1); // heavy-tailed
```

### Sampling

```ts
import { shuffle, sample, sampleWithReplacement, randomPick, weightedPick } from "stochast";

shuffle([1, 2, 3]); // new shuffled array
sample([1, 2, 3, 4, 5], 3); // 3 unique items
sampleWithReplacement([1, 2], 5); // 5 items, duplicates OK
randomPick(["a", "b", "c"]); // single random item
weightedPick(items, (i) => i.weight); // weighted random
```

### Statistics

```ts
import { mean, median, standardDeviation, variance, percentile, zScore, clamp } from "stochast";

mean([1, 2, 3, 4, 5]); // 3
median([3, 1, 2]); // 2
standardDeviation([1, 2, 3]); // ~0.816
variance([1, 2, 3, 4, 5]); // 2
percentile([1, 2, 3, 4, 5], 50); // 3
zScore(5, [1, 2, 3, 4, 5]); // ~1.414
clamp(15, 0, 10); // 10
```

### Hashing

```ts
import { hashString, hashToRange, hashToFloat, fnv1a, deterministicLineCount } from "stochast";

hashString("hello"); // deterministic integer
hashToRange("test", 0, 100); // 0–100
hashToFloat("test"); // [0, 1)
fnv1a("hello"); // FNV-1a hash
deterministicLineCount("src/index.ts", false); // 120–2800
```

### Smoothing

```ts
import { ema, emaSeries, sma } from "stochast";

ema(0.5, 1.0, 0.3); // 0.65
emaSeries([1, 2, 3, 4, 5], 0.5); // smoothed series
sma([1, 2, 3, 4, 5], 3); // simple moving average
```

### Markov Chains

```ts
import { buildMatrix, sampleSequence, stationaryDistribution, nextState } from "stochast";

const matrix = buildMatrix(["A", "B", "A", "C", "A", "B"]);
const seq = sampleSequence(matrix, "A", 10); // 10-state sequence
const dist = stationaryDistribution(matrix); // long-run probabilities
```

### Bootstrap

```ts
import { bootstrapCI, bootstrapSE, permutationTest, resample } from "stochast";

const [lo, hi] = bootstrapCI(data, mean); // 95% CI for mean
const se = bootstrapSE(data, standardDeviation); // standard error
const p = permutationTest(groupA, groupB, mean); // permutation p-value
```

### Information Theory

```ts
import { entropy, klDivergence, jsDivergence, mutualInformation, giniImpurity } from "stochast";

entropy([0.5, 0.5]); // ln(2) ≈ 0.693
klDivergence(p, q); // D_KL(p || q)
jsDivergence(p, q); // symmetric divergence
mutualInformation(joint, margX, margY); // I(X; Y)
giniImpurity([0.5, 0.5]); // 0.5
```

### Advanced Sampling

```ts
import { inverseTransform, acceptReject, poissonProcess, weightedResample } from "stochast";

inverseTransform(cdf, 0, 10); // sample from CDF
acceptReject(proposal, pdf, propPdf, M); // accept-reject
poissonProcess(2.0, 100); // event times in [0, 100)
weightedResample([0.1, 0.3, 0.6], 100); // weighted indices
```

### Monte Carlo

```ts
import { monteCarloIntegral, monteCarloExpectation, buffonsNeedle, randomWalk, brownianMotion } from "stochast";

monteCarloIntegral((x) => x * x, 0, 1); // ≈ 1/3
monteCarloExpectation(gaussianRand, (x) => x * x); // ≈ 1
buffonsNeedle(1, 2, 10000); // ≈ pi
randomWalk(100, 1, 2); // 2D random walk
brownianMotion(1000, 0.01, 1); // Brownian path
```

## Note

THIS IS A GENERAL-PURPOSE STOCHASTIC UTILITIES LIBRARY. IT DOES NOT TARGET ANY SPECIFIC DOMAIN. IT PROVIDES PURE, COMPOSABLE PRIMITIVES FOR RANDOMNESS, SAMPLING, AND STATISTICAL ESTIMATION. IF YOU NEED DOMAIN-SPECIFIC LOGIC, BUILD ON TOP OF THESE FUNCTIONS.

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this software.
