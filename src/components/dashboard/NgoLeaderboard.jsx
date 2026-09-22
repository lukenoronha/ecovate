import { Trophy } from 'lucide-react';
import { formatKg } from '../../utils/format';

const RANK_MEDAL = ['bg-amber-400 text-amber-950', 'bg-slate-300 text-slate-700', 'bg-orange-300 text-orange-900'];

export function NgoLeaderboard({ ngos, claims }) {
  const rows = ngos
    .map((ngo) => {
      const kgClaimed = claims
        .filter((c) => c.ngoId === ngo.id && !c.cancelledAt)
        .reduce((sum, c) => sum + c.qtyClaimed, 0);
      return { ...ngo, kgClaimed };
    })
    .sort((a, b) => b.reliabilityScore - a.reliabilityScore);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
        <Trophy className="h-4 w-4 text-amber-500" strokeWidth={2.25} />
        NGO reliability leaderboard
      </h3>

      <div className="mt-3 space-y-3">
        {rows.map((ngo, i) => (
          <div key={ngo.id} className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${RANK_MEDAL[i] ?? 'bg-slate-100 text-slate-500'}`}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-medium text-slate-900">{ngo.name}</span>
                <span className="shrink-0 text-xs text-slate-500">
                  {formatKg(ngo.kgClaimed)} · {ngo.cancelledCount} cancelled
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, ngo.reliabilityScore))}%` }}
                />
              </div>
            </div>
            <span className="w-8 shrink-0 text-right text-sm font-semibold text-slate-700">
              {ngo.reliabilityScore}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
