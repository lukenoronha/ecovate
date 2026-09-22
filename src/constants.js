// Toggle for live demo pacing. Production timers are the real-world defaults;
// DEMO_MODE compresses them so the same logic fits a 5-7 min pitch. Off by
// default now -- broadcast/escalation windows run at the real ~3 min pace.
export const DEMO_MODE = false;

export const BROADCAST_WINDOW_MS = DEMO_MODE ? 10_000 : 3 * 60 * 1000;
export const ESCALATION_WINDOW_MS = DEMO_MODE ? 10_000 : 3 * 60 * 1000;

// perishabilityWeight used in the urgency formula.
export const PERISHABILITY_WEIGHT = {
  high: 1.5, // cooked / high-risk food
  low: 0.8, // packaged / low-risk food
};

// Fixed urgency penalty applied when an NGO cancels a claim, to reflect lost time.
export const CANCELLATION_URGENCY_PENALTY = 15;

// Reliability score penalty applied to an NGO when it cancels a claim.
export const CANCELLATION_RELIABILITY_PENALTY = 10;

// 1 kg of surplus food ~= 2 meals, for the impact dashboard.
export const KG_TO_MEALS = 2;

// How many top-ranked NGOs a broadcast (or escalated broadcast) goes to.
export const BROADCAST_TOP_N = 5;

export const ITEM_STATUS = {
  PENDING: 'pending',
  BROADCAST: 'broadcast',
  ESCALATED: 'escalated',
  CLAIMED: 'claimed',
  PICKED_UP: 'picked_up',
  COMPLETED: 'completed',
  CANCELLED_BY_VENDOR: 'cancelled_by_vendor',
  UNCLAIMED_EXPIRED: 'unclaimed_expired',
};

export const BROADCAST_CHANNEL_NAME = 'ecovate-sync';
