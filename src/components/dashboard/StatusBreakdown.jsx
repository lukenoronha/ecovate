import { BarChart3 } from 'lucide-react';
import { STATUS_META } from '../../utils/statusMeta';
import { ITEM_STATUS } from '../../constants';

// Lifecycle order, not count order -- reads as the story of an item's life
// rather than a shuffled ranking.
const STATUS_ORDER = [
  ITEM_STATUS.BROADCAST,
  ITEM_STATUS.ESCALATED,
  ITEM_STATUS.CLAIMED,
  ITEM_STATUS.PICKED_UP,
  ITEM_STATUS.COMPLETED,
  ITEM_STATUS.CANCELLED_BY_VENDOR,
  ITEM_STATUS.UNCLAIMED_EXPIRED,
  ITEM_STATUS.PENDING,
];

export function StatusBreakdown({ items }) {
  const counts = {};
  for (const item of items) counts[item.status] = (counts[item.status] ?? 0) + 1;

  const rows = STATUS_ORDER.filter((status) => counts[status] > 0);
  const max = Math.max(1, ...rows.map((status) => counts[status]));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
        <BarChart3 className="h-4 w-4 text-slate-400" strokeWidth={2.25} />
        Listings by status
      </h3>

      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">No listings yet.</p>
      ) : (
        <div className="mt-4 space-y-2.5">
          {rows.map((status) => {
            const meta = STATUS_META[status];
            const count = counts[status];
            return (
              <div key={status} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-xs text-slate-600">{meta.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${meta.barClass}`}
                    style={{ width: `${(count / max) * 100}%` }}
                  />
                </div>
                <span className="w-5 shrink-0 text-right text-xs font-semibold text-slate-700">{count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
