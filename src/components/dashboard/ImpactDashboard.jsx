import { HeartHandshake, PackageCheck, Salad, Scale, Store, TriangleAlert } from 'lucide-react';
import { useStore } from '../../state/StoreContext';
import { useCountUp } from '../../hooks/useCountUp';
import { StatTile } from './StatTile';
import { StatusBreakdown } from './StatusBreakdown';
import { NgoLeaderboard } from './NgoLeaderboard';
import { ActivityFeed } from './ActivityFeed';
import { formatKg } from '../../utils/format';
import { ITEM_STATUS, KG_TO_MEALS } from '../../constants';

export function ImpactDashboard() {
  const { state } = useStore();

  const items = Object.values(state.items);
  const claims = Object.values(state.claims);
  const ngos = Object.values(state.ngos);
  const vendors = Object.values(state.vendors);

  const itemsCompleted = items.filter(
    (item) => item.status === ITEM_STATUS.PICKED_UP || item.status === ITEM_STATUS.COMPLETED,
  ).length;

  const kgDiverted = claims
    .filter((c) => !c.cancelledAt && c.pickedUpAt)
    .reduce((sum, c) => sum + c.qtyClaimed, 0);

  const mealsSaved = Math.round(kgDiverted * KG_TO_MEALS);

  const kgUnclaimed = items
    .filter((item) => item.status === ITEM_STATUS.UNCLAIMED_EXPIRED)
    .reduce((sum, item) => sum + item.qtyRemaining, 0);

  // Animate every headline number toward its latest value instead of
  // snapping, so the dashboard feels alive as events come in live.
  const animatedItemsCompleted = Math.round(useCountUp(itemsCompleted));
  const animatedKgDiverted = useCountUp(kgDiverted);
  const animatedMealsSaved = Math.round(useCountUp(mealsSaved));
  const animatedKgUnclaimed = useCountUp(kgUnclaimed);

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-emerald-600 to-emerald-700 p-6 text-white shadow-lg shadow-emerald-900/20">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 right-16 h-40 w-40 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <p className="relative text-sm font-medium text-emerald-100">Meals saved so far</p>
        <p className="relative mt-1 text-5xl font-extrabold tracking-tight tabular-nums">{animatedMealsSaved}</p>
        <p className="relative mt-2 text-sm text-emerald-100">1 kg of surplus food ≈ {KG_TO_MEALS} meals</p>
        <div className="relative mt-4 flex flex-wrap gap-4 text-sm text-emerald-50">
          <span className="flex items-center gap-1.5">
            <Store className="h-4 w-4" strokeWidth={2.25} />
            {vendors.length} vendor{vendors.length === 1 ? '' : 's'}
          </span>
          <span className="flex items-center gap-1.5">
            <HeartHandshake className="h-4 w-4" strokeWidth={2.25} />
            {ngos.length} NGO{ngos.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Items completed" value={animatedItemsCompleted} accent="emerald" icon={PackageCheck} />
        <StatTile label="kg diverted" value={formatKg(animatedKgDiverted)} accent="emerald" icon={Scale} />
        <StatTile label="Meals saved" value={animatedMealsSaved} accent="emerald" icon={Salad} />
        <StatTile
          label="kg unclaimed"
          value={formatKg(animatedKgUnclaimed)}
          caption="Still lost — the honest metric"
          accent="red"
          icon={TriangleAlert}
        />
      </div>

      {/* Detail grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <StatusBreakdown items={items} />
          <NgoLeaderboard ngos={ngos} claims={claims} />
        </div>
        <ActivityFeed activity={state.activity ?? []} />
      </div>
    </div>
  );
}
