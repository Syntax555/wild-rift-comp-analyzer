const STAGE_CONTEXT_LIMITS = {
  early: 0.18,
  middle: 0.34,
  last: 0.48,
};

export function adaptiveContextAdjustment({ baselineScore, contextScore = 50, contextEvidence = 0, draftMode, hasContext }) {
  if (!hasContext) {
    return { score: Math.round(baselineScore), uplift: 0, influence: 0 };
  }
  const evidence = Math.max(0, Math.min(1, Number(contextEvidence) || 0));
  const limit = STAGE_CONTEXT_LIMITS[draftMode] || STAGE_CONTEXT_LIMITS.middle;
  const influence = limit * (.15 + evidence * .85);
  const uplift = (contextScore - 50) * influence;
  return {
    score: Math.round(Math.max(15, Math.min(85, baselineScore + uplift))),
    uplift: Math.round(uplift * 10) / 10,
    influence: Math.round(influence * 1000) / 1000,
  };
}

export function classifyRecommendation({ baselineRank, finalRank, contextUplift }) {
  return baselineRank !== finalRank || Math.abs(contextUplift) >= 4
    ? "draftDriven"
    : "stableBest";
}

