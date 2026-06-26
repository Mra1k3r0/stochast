/**
 * @packageDocumentation
 * Stochastic utilities: distributions, sampling, statistics, information theory,
 * Markov chains, bootstrap, Monte Carlo. Zero dependencies. Pure functions.
 */

export {
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
} from "./distributions.js";

export { shuffle, sample, sampleWithReplacement, randomPick, weightedPick } from "./sampling.js";

export {
  clamp,
  mean,
  median,
  standardDeviation,
  sampleStandardDeviation,
  variance,
  percentile,
  min,
  max,
  sum,
  uniqueCount,
  zScore,
} from "./stats.js";

export { hashString, hashToRange, hashToFloat, fnv1a, deterministicLineCount } from "./hash.js";

export { ema, emaSeries, sma } from "./smoothing.js";

export { normalizeMatrix, nextState, sampleSequence, buildMatrix, stationaryDistribution } from "./markov.js";

export { resample, bootstrapCI, bootstrapSE, permutationTest } from "./bootstrap.js";

export {
  entropy,
  crossEntropy,
  klDivergence,
  jsDivergence,
  mutualInformation,
  giniImpurity,
  renyiEntropy,
} from "./info.js";

export {
  inverseTransform,
  acceptReject,
  rejectionSample,
  weightedResample,
  poissonProcess,
  compoundPoisson,
} from "./sampling-advanced.js";

export {
  monteCarloIntegral,
  monteCarloExpectation,
  monteCarloProbability,
  buffonsNeedle,
  randomWalk,
  brownianMotion,
} from "./montecarlo.js";
