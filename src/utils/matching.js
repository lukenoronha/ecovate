import { BROADCAST_TOP_N } from '../constants';

// Baseline score per capacity tier.
const CAPACITY_BASE_SCORE = { high: 20, medium: 10, low: 0 };

// Rewards an NGO whose capacity tier actually fits the item's quantity,
// not just "bigger capacity is always better" -- a low-capacity/closest
// NGO should still win small items.
export function capacityFitScore(ngo, item) {
  let score = CAPACITY_BASE_SCORE[ngo.capacity] ?? 0;
  const qty = item.qtyRemaining ?? item.qty;
  if (ngo.capacity === 'low' && qty <= 10) score += 15;
  else if (ngo.capacity === 'medium' && qty > 10 && qty < 30) score += 15;
  else if (ngo.capacity === 'high' && qty >= 30) score += 15;
  return score;
}

/** Rank NGOs by capacity fit + reliabilityScore, best first. */
export function rankNGOs(ngos, item, { excludeIds = [] } = {}) {
  return Object.values(ngos)
    .filter((ngo) => !excludeIds.includes(ngo.id))
    .map((ngo) => ({ ngo, score: capacityFitScore(ngo, item) + ngo.reliabilityScore }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.ngo);
}

/** The NGO ids a broadcast (or re-broadcast) wave should go to. */
export function selectBroadcastTargets(ngos, item, opts) {
  return rankNGOs(ngos, item, opts)
    .slice(0, BROADCAST_TOP_N)
    .map((ngo) => ngo.id);
}
