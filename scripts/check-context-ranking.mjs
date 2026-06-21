import assert from "node:assert/strict";
import { adaptiveContextAdjustment, classifyRecommendation } from "../ranking-model.mjs";

const noContext = adaptiveContextAdjustment({ baselineScore: 72, contextScore: 15, contextEvidence: 1, draftMode: "last", hasContext: false });
assert.deepEqual(noContext, { score: 72, uplift: 0, influence: 0 });

const sparseEstimate = adaptiveContextAdjustment({ baselineScore: 70, contextScore: 80, contextEvidence: .1, draftMode: "last", hasContext: true });
const observedCounter = adaptiveContextAdjustment({ baselineScore: 70, contextScore: 80, contextEvidence: 1, draftMode: "last", hasContext: true });
assert.ok(observedCounter.uplift > sparseEstimate.uplift * 3, "Observed context should outweigh sparse estimates");

const stableLeader = adaptiveContextAdjustment({ baselineScore: 78, contextScore: 50, contextEvidence: .25, draftMode: "middle", hasContext: true });
const stableChallenger = adaptiveContextAdjustment({ baselineScore: 65, contextScore: 70, contextEvidence: .25, draftMode: "middle", hasContext: true });
assert.ok(stableLeader.score > stableChallenger.score, "Context must not manufacture variety over a clear baseline leader");

const counteredLeader = adaptiveContextAdjustment({ baselineScore: 72, contextScore: 40, contextEvidence: 1, draftMode: "last", hasContext: true });
const counterPick = adaptiveContextAdjustment({ baselineScore: 68, contextScore: 80, contextEvidence: 1, draftMode: "last", hasContext: true });
assert.ok(counterPick.score > counteredLeader.score, "Strong observed context should be able to reorder picks");

assert.equal(classifyRecommendation({ baselineRank: 1, finalRank: 1, contextUplift: 2 }), "stableBest");
assert.equal(classifyRecommendation({ baselineRank: 4, finalRank: 1, contextUplift: 3 }), "draftDriven");

console.log("Adaptive context ranking checks passed.");
