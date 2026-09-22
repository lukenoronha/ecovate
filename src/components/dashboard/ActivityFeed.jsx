import {
  Ban,
  CircleCheck,
  Flame,
  HeartHandshake,
  History,
  PackageCheck,
  Store,
  TriangleAlert,
  XCircle,
} from 'lucide-react';
import { useNow } from '../../hooks/useNow';
import { formatRelativeTime } from '../../utils/format';

const TYPE_META = {
  vendor_joined: { icon: Store, tone: 'text-emerald-600 bg-emerald-100' },
  ngo_joined: { icon: HeartHandshake, tone: 'text-purple-600 bg-purple-100' },
  listed: { icon: Flame, tone: 'text-blue-600 bg-blue-100' },
  listing_cancelled: { icon: XCircle, tone: 'text-red-600 bg-red-100' },
  claimed: { icon: PackageCheck, tone: 'text-purple-600 bg-purple-100' },
  claim_cancelled: { icon: Ban, tone: 'text-red-600 bg-red-100' },
  picked_up: { icon: CircleCheck, tone: 'text-emerald-600 bg-emerald-100' },
  escalated: { icon: TriangleAlert, tone: 'text-amber-600 bg-amber-100' },
  expired: { icon: XCircle, tone: 'text-red-600 bg-red-100' },
};

export function ActivityFeed({ activity }) {
  const now = useNow(1000);
  const recent = [...activity].reverse().slice(0, 12);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
        <History className="h-4 w-4 text-slate-400" strokeWidth={2.25} />
        Live activity
      </h3>

      {recent.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">Nothing has happened yet -- list an item to get started.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {recent.map((entry, index) => {
            const meta = TYPE_META[entry.type] ?? { icon: History, tone: 'text-slate-500 bg-slate-100' };
            const Icon = meta.icon;
            return (
              <li
                key={entry.id}
                className="animate-slide-up flex items-start gap-2.5"
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms`, animationFillMode: 'backwards' }}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${meta.tone}`}>
                  <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                </span>
                <span className="min-w-0 flex-1 text-sm text-slate-700">{entry.message}</span>
                <span className="shrink-0 text-xs text-slate-400">{formatRelativeTime(entry.at, now)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
