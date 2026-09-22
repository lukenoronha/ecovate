// Hardcoded demo NGOs, per CLAUDE.md.
export const SEED_NGOS = [
  {
    id: 'ngo-a',
    name: 'NGO A',
    capacity: 'high',
    reliabilityScore: 90,
    cancelledCount: 0,
  },
  {
    id: 'ngo-b',
    name: 'NGO B',
    capacity: 'medium',
    reliabilityScore: 70,
    cancelledCount: 0,
  },
  {
    id: 'ngo-c',
    name: 'NGO C',
    capacity: 'low',
    reliabilityScore: 85,
    cancelledCount: 0,
    // Closest location -> fastest to claim small items. Used only as demo flavor text.
    closest: true,
  },
];
