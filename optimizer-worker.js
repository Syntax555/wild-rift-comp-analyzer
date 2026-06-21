const resultCache = new Map();
const MAX_CACHE_ENTRIES = 40;

function average(values) {
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
}

function allyPairFit(candidate, ally) {
  return (
    candidate.frontline * ally.carry
    + candidate.control * (ally.carry * .7 + ally.access * .3)
    + candidate.protection * ally.carry
    + candidate.carry * (ally.frontline * .7 + ally.control * .3)
    + candidate.access * ally.control
  ) / 5;
}

function lineupPairFitScore(entries, knownAllies) {
  const profiles = [...knownAllies, ...entries].map((entry) => entry.profile).filter((profile) => profile?.available);
  const scores = [];
  for (let left = 0; left < profiles.length; left += 1) {
    for (let right = left + 1; right < profiles.length; right += 1) {
      scores.push((allyPairFit(profiles[left], profiles[right]) + allyPairFit(profiles[right], profiles[left])) * 50);
    }
  }
  return scores.length ? Math.max(15, Math.min(85, average(scores))) : 50;
}

function lineupBalanceScore(entries, knownAllies) {
  const profiles = [...knownAllies, ...entries].map((entry) => entry.profile).filter((profile) => profile?.available);
  if (!profiles.length) return 50;
  const totals = profiles.reduce((sum, profile) => ({
    frontline: sum.frontline + profile.frontline,
    control: sum.control + profile.control,
    protection: sum.protection + profile.protection,
    carry: sum.carry + profile.carry,
    access: sum.access + profile.access,
  }), { frontline: 0, control: 0, protection: 0, carry: 0, access: 0 });
  const targets = { frontline: 1.2, control: 1.2, protection: .65, carry: 1.7, access: .8 };
  return Math.round(average(Object.keys(targets).map((key) => Math.min(1, totals[key] / targets[key]))) * 100);
}

function projectedLineupScore(entries, knownAllies) {
  const evidence = entries.length ? average(entries.map((entry) => entry.evidenceScore)) : 50;
  return Math.round(
    evidence * .82
    + lineupPairFitScore(entries, knownAllies) * .10
    + lineupBalanceScore(entries, knownAllies) * .08
  );
}

function bestCompletionForSeed(seedRole, seedEntry, openRoles, pools, knownAllies, counter) {
  let beam = [{ entries: [seedEntry], used: new Set([seedEntry.championId]), score: projectedLineupScore([seedEntry], knownAllies) }];
  openRoles.filter((role) => role !== seedRole).forEach((role) => {
    const expanded = [];
    beam.forEach((plan) => {
      (pools.get(role) || []).forEach((entry) => {
        if (plan.used.has(entry.championId)) return;
        const entries = [...plan.entries, entry];
        expanded.push({ entries, used: new Set([...plan.used, entry.championId]), score: projectedLineupScore(entries, knownAllies) });
        counter.count += 1;
      });
    });
    beam = expanded.sort((left, right) => right.score - left.score).slice(0, 70);
  });
  return beam[0] || { entries: [seedEntry], score: seedEntry.evidenceScore };
}

function optimize(payload) {
  const openRoles = payload.openRoles;
  const knownAllies = payload.knownAllies || [];
  const pools = new Map(payload.pools.map((group) => [group.role, group.entries]));
  const counter = { count: 0 };
  const groups = openRoles.map((role) => ({
    role,
    entries: (pools.get(role) || []).map((entry) => {
      const plan = bestCompletionForSeed(role, entry, openRoles, pools, knownAllies, counter);
      return {
        championId: entry.championId,
        projectedScore: plan.score,
        projectedLineup: plan.entries.map((planned) => planned.championId),
      };
    }).sort((left, right) => right.projectedScore - left.projectedScore).slice(0, 3),
  })).filter((group) => group.entries.length);
  return { groups, projectedLineups: counter.count };
}

self.addEventListener("message", (event) => {
  const { id, key, payload } = event.data;
  if (resultCache.has(key)) {
    self.postMessage({ id, result: { ...resultCache.get(key), cached: true } });
    return;
  }
  const result = { ...optimize(payload), cached: false };
  resultCache.set(key, result);
  if (resultCache.size > MAX_CACHE_ENTRIES) resultCache.delete(resultCache.keys().next().value);
  self.postMessage({ id, result });
});
