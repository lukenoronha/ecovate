import { PERISHABILITY_WEIGHT } from '../constants';

/**
 * urgencyScore = (100 - spoilMinutes) * perishabilityWeight + qty * 2
 */
export function computeUrgencyScore({ spoilMinutes, qty, perishability }) {
  const weight = PERISHABILITY_WEIGHT[perishability] ?? PERISHABILITY_WEIGHT.low;
  return (100 - spoilMinutes) * weight + qty * 2;
}
