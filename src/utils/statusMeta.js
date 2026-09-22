import { Ban, CircleCheck, Clock, FlameKindling, PackageCheck, TriangleAlert } from 'lucide-react';

// Single source of truth for status colors/labels/icons -- used by the
// StatusBadge everywhere AND the dashboard's status breakdown chart, so a bar
// in the chart always matches the badge color a user sees on the item card.
export const STATUS_META = {
  pending: { label: 'Pending', badgeClass: 'bg-slate-200 text-slate-700', barClass: 'bg-slate-400', icon: Clock },
  broadcast: { label: 'Broadcast', badgeClass: 'bg-blue-100 text-blue-700', barClass: 'bg-blue-500', icon: FlameKindling },
  escalated: {
    label: 'Escalated',
    badgeClass: 'bg-amber-100 text-amber-800',
    barClass: 'bg-amber-500',
    icon: TriangleAlert,
  },
  claimed: {
    label: 'Claimed',
    badgeClass: 'bg-purple-100 text-purple-700',
    barClass: 'bg-purple-500',
    icon: PackageCheck,
  },
  picked_up: {
    label: 'Picked Up',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    barClass: 'bg-emerald-500',
    icon: CircleCheck,
  },
  completed: {
    label: 'Completed',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    barClass: 'bg-emerald-500',
    icon: CircleCheck,
  },
  cancelled_by_vendor: {
    label: 'Cancelled',
    badgeClass: 'bg-red-100 text-red-700',
    barClass: 'bg-red-400',
    icon: Ban,
  },
  unclaimed_expired: {
    label: 'Expired — Unclaimed',
    badgeClass: 'bg-red-100 text-red-700',
    barClass: 'bg-red-500',
    icon: Ban,
  },
};

export const DEFAULT_STATUS_META = { label: '', badgeClass: 'bg-slate-200 text-slate-700', barClass: 'bg-slate-400', icon: null };
