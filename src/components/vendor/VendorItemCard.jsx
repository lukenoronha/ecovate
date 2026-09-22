import { useState } from 'react';
import { Flame, Radio, Trash2 } from 'lucide-react';
import { useStore } from '../../state/StoreContext';
import { ACTIONS } from '../../state/actionTypes';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import { Countdown } from '../common/Countdown';
import { LiveDot } from '../common/LiveDot';
import { Button } from '../common/Button';
import { formatKg, formatScore } from '../../utils/format';
import { ITEM_STATUS } from '../../constants';

const CANCELLABLE = [ITEM_STATUS.PENDING, ITEM_STATUS.BROADCAST, ITEM_STATUS.ESCALATED];

function urgencyColor(score) {
  if (score >= 100) return 'text-red-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-slate-400';
}

export function VendorItemCard({ item, index = 0 }) {
  const { state, dispatch } = useStore();
  const [confirming, setConfirming] = useState(false);

  const hasActiveClaim = Object.values(state.claims).some((c) => c.itemId === item.id && !c.cancelledAt);
  const canCancel = CANCELLABLE.includes(item.status) && !hasActiveClaim;

  const broadcastNames = item.broadcastedTo.map((id) => state.ngos[id]?.name ?? id).join(', ');
  const remainingPct = item.qty > 0 ? Math.round((item.qtyRemaining / item.qty) * 100) : 0;

  const handleCancel = () => {
    dispatch({ type: ACTIONS.CANCEL_LISTING, payload: { itemId: item.id } });
    setConfirming(false);
  };

  return (
    <div
      className="animate-slide-up rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms`, animationFillMode: 'backwards' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-semibold text-slate-900">{item.foodType}</div>
          <div className="mt-0.5 flex items-center gap-2.5 text-xs text-slate-500">
            <span>
              {formatKg(item.qtyRemaining)} left of {formatKg(item.qty)}
            </span>
            <span className={`flex items-center gap-0.5 font-medium ${urgencyColor(item.urgencyScore)}`}>
              <Flame className="h-3.5 w-3.5" strokeWidth={2.25} />
              {formatScore(item.urgencyScore)}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <StatusBadge status={item.status} />
          <Countdown item={item} />
        </div>
      </div>

      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${remainingPct}%` }}
        />
      </div>

      {item.photo && (
        <img src={item.photo} alt={item.foodType} className="mt-3 h-24 w-full rounded-lg object-cover" />
      )}

      {[ITEM_STATUS.BROADCAST, ITEM_STATUS.ESCALATED].includes(item.status) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
          <LiveDot color={item.status === ITEM_STATUS.ESCALATED ? 'amber' : 'blue'} />
          <Radio className="h-3.5 w-3.5 shrink-0 text-blue-500" strokeWidth={2.25} />
          Broadcasting to {broadcastNames || '—'}
        </div>
      )}

      {canCancel && (
        <Button variant="danger" size="sm" icon={Trash2} onClick={() => setConfirming(true)} className="mt-3">
          Cancel listing
        </Button>
      )}

      <ConfirmModal
        open={confirming}
        title="Cancel this listing?"
        description={`This removes "${item.foodType}" from the broadcast. This can't be undone.`}
        confirmLabel="Cancel listing"
        onConfirm={handleCancel}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
